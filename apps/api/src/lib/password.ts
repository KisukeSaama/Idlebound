import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";
import type { PasswordIssue } from "@idlebound/game";

/** scrypt (RFC 7914): built into Node, GPU-resistant, no native dependency. */
const PARAMS = { N: 1 << 15, r: 8, p: 1 } as const;
const KEY_LENGTH = 64;
const MAX_MEMORY = 128 * PARAMS.N * PARAMS.r * 2;

function derive(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, { ...options, maxmem: MAX_MEMORY }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, PARAMS);
  return ["scrypt", PARAMS.N, PARAMS.r, PARAMS.p, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, n, r, p, salt, hash] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const key = await derive(password, Buffer.from(salt, "base64"), { N: Number(n), r: Number(r), p: Number(p) });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/** Dummy hash: checking a missing account costs as much as a real one (no timing enumeration). */
let dummyHash: Promise<string> | undefined;
export function dummyVerify(password: string): Promise<boolean> {
  dummyHash ??= hashPassword("idlebound-dummy-password");
  return dummyHash.then((hash) => verifyPassword(password, hash)).then(() => false);
}

const COMMON = new Set([
  "password", "motdepasse", "12345678", "123456789", "1234567890", "azertyuiop", "qwertyuiop", "azerty123",
  "password1", "iloveyou", "00000000", "11111111", "abcdefgh", "abcd1234", "soleil123", "doudou123",
  "football", "loveyou1", "bonjour1", "idlebound", "idlebound1", "qwerty123", "motdepasse1", "password123"
]);

/** Returns why a password is too weak (sent as the `reason` of a weak-password error), or null. */
export function checkPasswordStrength(password: string, username: string, email: string): PasswordIssue | null {
  if (password.length < 8) return "too-short";
  if (password.length > 128) return "too-long";
  const lowered = password.toLowerCase();
  if (COMMON.has(lowered)) return "too-common";
  if (/^(.)\1+$/.test(password)) return "too-simple";
  if (lowered.includes(username.toLowerCase()) || lowered === email.toLowerCase()) return "contains-identity";
  return null;
}
