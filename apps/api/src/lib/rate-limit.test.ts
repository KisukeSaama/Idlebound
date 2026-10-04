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

  it("refuses new keys once full, keeps the tracked ones working, and makes room as keys expire", () => {
    const limiter = new RateLimiter(5, 1000, 3);
    for (const key of ["a", "b", "c"]) expect(limiter.consume(key, 0)).toBe(0);
    // Full and nothing expired: a new key waits, without being stored.
    expect(limiter.consume("d", 100)).toBeGreaterThan(0);
    expect(limiter.consume("e", 200)).toBeGreaterThan(0);
    expect(limiter.count("d", 200)).toBe(0);
    // The keys already tracked still count normally.
    expect(limiter.consume("a", 300)).toBe(0);
    expect(limiter.count("a", 300)).toBe(2);
    // Once the window has passed, the sweep frees room for a new key.
    expect(limiter.consume("d", 1500)).toBe(0);
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
