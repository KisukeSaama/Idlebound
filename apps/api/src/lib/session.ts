import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { db } from "../db/client";
import { emailVerifications, passwordResets, saveRejections, sessions, users } from "../db/schema";
import { env } from "../env";
import { localeOf } from "./i18n";
import { purgeInactiveAccounts, purgeUnverifiedAccounts } from "./inactivity";

export const SESSION_COOKIE = "ib_session";
const SESSION_DAYS = 30;
const RENEW_BELOW_DAYS = 15;
const DAY = 86_400_000;
const REJECTION_RETENTION_DAYS = 90;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("base64url");
}

export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

function writeCookie(c: Context, token: string, expiresAt: Date) {
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "Lax",
    path: "/",
    expires: expiresAt
  });
}

export async function createSession(c: Context, userId: string) {
  // Rotation: any session the browser already carries is destroyed, never reused.
  const previous = getCookie(c, SESSION_COOKIE);
  if (previous && previous.length <= 100) await db.delete(sessions).where(eq(sessions.id, hashToken(previous)));
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY);
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });
  writeCookie(c, token, expiresAt);
}

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

/** User of the current session (and sliding renewal of the session). */
export async function currentUser(c: Context): Promise<SessionUser | null> {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token || token.length > 100) return null;
  const id = hashToken(token);
  const [row] = await db
    .select({ id: users.id, email: users.email, username: users.username, emailVerifiedAt: users.emailVerifiedAt, createdAt: users.createdAt, lastSeenAt: users.lastSeenAt, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())))
    .limit(1);
  if (!row) return null;
  // Activity is tracked to the day: at most one write per day, not one per request. Coming
  // back cancels a pending inactivity warning and refreshes the language used for e-mails.
  if (Date.now() - row.lastSeenAt.getTime() > DAY) {
    await db.update(users).set({ lastSeenAt: new Date(), inactivityNoticeAt: null, locale: localeOf(c) }).where(eq(users.id, row.id));
  }
  if (row.expiresAt.getTime() - Date.now() < RENEW_BELOW_DAYS * DAY) {
    const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY);
    await db.update(sessions).set({ expiresAt }).where(eq(sessions.id, id));
    writeCookie(c, token, expiresAt);
  }
  return { id: row.id, email: row.email, username: row.username, emailVerifiedAt: row.emailVerifiedAt, createdAt: row.createdAt };
}

export async function destroySession(c: Context) {
  const token = getCookie(c, SESSION_COOKIE);
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  deleteCookie(c, SESSION_COOKIE, { path: "/", secure: env.COOKIE_SECURE });
}

export async function destroyAllSessions(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

/** Periodic cleanup: expired sessions and links, old anti-cheat logs, inactive and never-confirmed accounts. */
export async function purgeExpired() {
  const now = new Date();
  // Warn-then-delete, never delete without a warning e-mail.
  await purgeInactiveAccounts(now);
  await purgeUnverifiedAccounts(now);
  await db.delete(sessions).where(lt(sessions.expiresAt, now));
  await db.delete(passwordResets).where(lt(passwordResets.expiresAt, now));
  await db.delete(emailVerifications).where(lt(emailVerifications.expiresAt, now));
  await db.delete(saveRejections).where(lt(saveRejections.createdAt, new Date(now.getTime() - REJECTION_RETENTION_DAYS * DAY)));
}
