import { describe, expect, it } from "vitest";
import { RateLimiter, resolveClientIp } from "./rate-limit";

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
});
