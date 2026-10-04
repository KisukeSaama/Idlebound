import { BlockList, isIP, isIPv6 } from "node:net";
import type { Context, MiddlewareHandler } from "hono";
import { env } from "../env";
import { fail } from "./errors";

/**
 * Past this size, expired keys are purged before adding one; if the map is still full, new
 * keys are refused (bounded memory) while keys already tracked keep working.
 */
const MAX_KEYS = 50_000;
/** A full map is swept at most this often: a flood of new keys must not cost a full scan each. */
const FULL_SWEEP_MS = 1_000;

/**
 * In-memory sliding-window limiter. A single API instance runs per environment, so no
 * Redis is needed. Traefik adds a per-IP limit upstream.
 */
export class RateLimiter {
  private hits = new Map<string, number[]>();
  private lastFullSweep = Number.NEGATIVE_INFINITY;

  constructor(private readonly limit: number, private readonly windowMs: number, private readonly maxKeys = MAX_KEYS) {}

  /** Returns the number of seconds to wait, or 0 when the request is allowed. */
  consume(key: string, now = Date.now()): number {
    if (this.hits.size >= this.maxKeys && !this.hits.has(key)) {
      if (now - this.lastFullSweep >= FULL_SWEEP_MS) {
        this.lastFullSweep = now;
        this.sweep(now);
      }
      // Still full: a new key waits for room rather than growing the map without bound.
      if (this.hits.size >= this.maxKeys) return Math.ceil(this.windowMs / 1000);
    }
    const since = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((time) => time > since);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return Math.ceil((recent[0] + this.windowMs - now) / 1000);
    }
    recent.push(now);
    this.hits.set(key, recent);
    return 0;
  }

  /** Hits still counted for this key, without recording one. */
  count(key: string, now = Date.now()): number {
    const since = now - this.windowMs;
    return (this.hits.get(key) ?? []).filter((time) => time > since).length;
  }

  reset(key: string) {
    this.hits.delete(key);
  }

  sweep(now = Date.now()) {
    const since = now - this.windowMs;
    for (const [key, times] of this.hits) {
      if (times.every((time) => time <= since)) this.hits.delete(key);
    }
  }
}

const limiters: RateLimiter[] = [];
export function limiter(limit: number, windowMs: number): RateLimiter {
  const instance = new RateLimiter(limit, windowMs);
  limiters.push(instance);
  return instance;
}

setInterval(() => limiters.forEach((instance) => instance.sweep()), 60_000).unref();

/**
 * Ranges published by Cloudflare (https://www.cloudflare.com/ips/). The edge proxy IP
 * header is only trusted when the request really comes from one of them: the origin is
 * reachable directly, and anyone can send a forged `cf-connecting-ip` to it.
 */
const CLOUDFLARE_RANGES = [
  "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22", "141.101.64.0/18",
  "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20", "197.234.240.0/22", "198.41.128.0/17",
  "162.158.0.0/15", "104.16.0.0/13", "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
  "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32", "2405:8100::/32",
  "2a06:98c0::/29", "2c0f:f248::/32"
];

function buildBlockList(ranges: string[]): BlockList {
  const list = new BlockList();
  for (const range of ranges) {
    const [address, prefix] = range.split("/");
    const family = isIPv6(address) ? "ipv6" : "ipv4";
    list.addSubnet(address, Number(prefix), family);
  }
  return list;
}

const edgeProxies = buildBlockList(env.EDGE_PROXY_CIDRS ? env.EDGE_PROXY_CIDRS.split(",").map((range) => range.trim()).filter(Boolean) : CLOUDFLARE_RANGES);

function isEdgeProxy(address: string): boolean {
  const family = isIP(address);
  if (family === 0) return false;
  return edgeProxies.check(address, family === 6 ? "ipv6" : "ipv4");
}

/** An IPv6 address is reduced to its /64: a single subscriber owns billions of them. */
function rateKey(address: string): string {
  if (isIPv6(address)) {
    const mapped = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
    if (mapped) return mapped[1];
    const groups = expandIPv6(address);
    return groups ? `${groups.slice(0, 4).join(":")}::/64` : address;
  }
  return address;
}

function expandIPv6(address: string): string[] | null {
  const [head, tail] = address.split("::");
  const left = head ? head.split(":") : [];
  const right = tail !== undefined && tail !== "" ? tail.split(":") : [];
  if (tail === undefined && left.length !== 8) return null;
  const missing = 8 - left.length - right.length;
  if (missing < 0) return null;
  return [...left, ...Array<string>(missing).fill("0"), ...right].map((group) => group.toLowerCase().replace(/^0+(?=.)/, ""));
}

/**
 * Client IP. The direct peer is read from X-Forwarded-For (the entry added by the last
 * trusted proxy, Traefik); the edge proxy header is only trusted when that peer really is
 * the edge proxy.
 */
export function clientIp(c: Context): string {
  return resolveClientIp((name) => c.req.header(name));
}

export function resolveClientIp(header: (name: string) => string | undefined): string {
  const forwarded = (header("x-forwarded-for") ?? "").split(",").map((part) => part.trim()).filter(Boolean);
  const peer = forwarded.length > 0 && env.TRUSTED_PROXY_COUNT > 0
    ? forwarded[Math.max(0, forwarded.length - env.TRUSTED_PROXY_COUNT)]
    : undefined;
  const edge = header(env.CLIENT_IP_HEADER)?.trim();
  if (edge && isIP(edge) && peer && isEdgeProxy(peer)) return rateKey(edge);
  if (peer && isIP(peer)) return rateKey(peer);
  return "local";
}

export function tooMany(c: Context, retryAfter: number) {
  c.header("Retry-After", String(retryAfter));
  return c.json(fail("too_many_attempts", { retryAfter }), 429);
}

export function rateLimitByIp(instance: RateLimiter): MiddlewareHandler {
  return async (c, next) => {
    const wait = instance.consume(clientIp(c));
    if (wait > 0) return tooMany(c, wait);
    await next();
  };
}
