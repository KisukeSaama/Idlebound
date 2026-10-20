import { describe, expect, it } from "vitest";
import { RateLimiter, networkKey, resolveClientIp } from "./rate-limit";

const headers = (values: Record<string, string>) => (name: string) => values[name];

describe("resolveClientIp", () => {
  it("trusts the Cloudflare header when the peer is a Cloudflare node", () => {
    expect(resolveClientIp(headers({ "x-forwarded-for": "162.158.1.2", "cf-connecting-ip": "203.0.113.7" }))).toBe("203.0.113.7");
  });

  it("ignores a cf-connecting-ip forged by a client bypassing Cloudflare", () => {
    expect(resolveClientIp(headers({ "x-forwarded-for": "198.51.100.9", "cf-connecting-ip": "203.0.113.7" }))).toBe("198.51.100.9");
  });

  it("ignores X-Forwarded-For entries added by the client", () => {
    expect(resolveClientIp(headers({ "x-forwarded-for": "1.1.1.1, 198.51.100.9" }))).toBe("198.51.100.9");
  });

  it("groups IPv6 addresses by /64", () => {
    const a = resolveClientIp(headers({ "x-forwarded-for": "2606:4700::1", "cf-connecting-ip": "2001:db8:1:2:aaaa::1" }));
    const b = resolveClientIp(headers({ "x-forwarded-for": "2606:4700::1", "cf-connecting-ip": "2001:db8:1:2:bbbb::9" }));
    expect(a).toBe(b);
  });

  it("names the /48 of an IPv6 key, and nothing wider for IPv4", () => {
    const key = resolveClientIp(headers({ "x-forwarded-for": "2606:4700::1", "cf-connecting-ip": "2001:db8:1:2:aaaa::1" }));
    const neighbour = resolveClientIp(headers({ "x-forwarded-for": "2606:4700::1", "cf-connecting-ip": "2001:db8:1:ffff::9" }));
    expect(key).not.toBe(neighbour);
    expect(networkKey(key)).toBe("2001:db8:1::/48");
    expect(networkKey(neighbour)).toBe(networkKey(key));
    expect(networkKey("203.0.113.7")).toBeNull();
  });

  it("rejects a value that is not an IP", () => {
    expect(resolveClientIp(headers({ "x-forwarded-for": "162.158.1.2", "cf-connecting-ip": "not an ip" }))).toBe("162.158.1.2");
    expect(resolveClientIp(headers({}))).toBe("local");
  });
});

describe("RateLimiter", () => {
  it("blocks past the limit then frees up after the window", () => {
    const limiter = new RateLimiter(2, 1000);
    expect(limiter.consume("k", 0)).toBe(0);
    expect(limiter.consume("k", 10)).toBe(0);
    expect(limiter.consume("k", 20)).toBeGreaterThan(0);
    expect(limiter.consume("k", 1500)).toBe(0);
  });

  it("makes room once full by letting go of the least recently seen key that is not held back", () => {
    const limiter = new RateLimiter(2, 1000, 3);
    for (const key of ["a", "b", "c"]) expect(limiter.consume(key, 0)).toBe(0);
    // "a" seen again: "b" is now the least recently seen, and makes room for "d".
    expect(limiter.consume("a", 100)).toBe(0);
    expect(limiter.consume("d", 200)).toBe(0);
    expect(limiter.count("b", 200)).toBe(0);
    expect(limiter.count("a", 200)).toBe(2);
    // A key held back is never let go: a flood of new keys cannot free it.
    expect(limiter.consume("a", 300)).toBeGreaterThan(0);
    for (const key of ["e", "f", "g", "h"]) expect(limiter.consume(key, 400)).toBe(0);
    expect(limiter.consume("a", 500)).toBeGreaterThan(0);
  });

  it("makes a new key wait only when every key is held back", () => {
    const limiter = new RateLimiter(1, 1000, 2);
    expect(limiter.consume("a", 0)).toBe(0);
    expect(limiter.consume("b", 0)).toBe(0);
    expect(limiter.consume("c", 100)).toBeGreaterThan(0);
    expect(limiter.count("c", 100)).toBe(0);
    // Once the window has passed, the sweep frees room.
    expect(limiter.consume("c", 1500)).toBe(0);
  });

  it("counts a key's hits without recording one", () => {
    const limiter = new RateLimiter(2, 1000);
    expect(limiter.count("k", 0)).toBe(0);
    limiter.consume("k", 0);
    expect(limiter.count("k", 10)).toBe(1);
    expect(limiter.count("k", 10)).toBe(1);
    expect(limiter.count("k", 1500)).toBe(0);
  });
});
