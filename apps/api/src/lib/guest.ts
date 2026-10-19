import { and, eq, lt } from "drizzle-orm";
import { GUEST_SAVE_DAYS } from "@idlebound/game";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { db } from "../db/client";
import { guestSaves } from "../db/schema";
import { env } from "../env";
import { hashToken, newToken } from "./session";

export const GUEST_COOKIE = "ib_guest";
const DAY = 86_400_000;

/** The guest game this browser carries (the row's id), or null. No database access. */
export function guestId(c: Context): string | null {
  const token = getCookie(c, GUEST_COOKIE);
  if (!token || token.length > 100) return null;
  return hashToken(token);
}

function writeCookie(c: Context, token: string) {
  setCookie(c, GUEST_COOKIE, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "Lax",
    path: "/",
    expires: new Date(Date.now() + GUEST_SAVE_DAYS * DAY)
  });
}

/** A new guest game: the token goes to the browser (see `keepGuest`), only its hash is stored. */
export function newGuest(): { token: string; id: string } {
  const token = newToken();
  return { token, id: hashToken(token) };
}

/** Hands the browser the cookie of the game just stored for it. */
export function keepGuest(c: Context, token: string) {
  writeCookie(c, token);
}

/** A visit is tracked to the day: the cookie slides with it, at most once a day. */
export function visitDue(lastSeenAt: Date, now = Date.now()): boolean {
  return now - lastSeenAt.getTime() > DAY;
}

/** Pushes the cookie's expiry back: the guest came back. */
export function renewGuest(c: Context) {
  const token = getCookie(c, GUEST_COOKIE);
  if (token) writeCookie(c, token);
}

export function forgetGuest(c: Context) {
  deleteCookie(c, GUEST_COOKIE, { path: "/", secure: env.COOKIE_SECURE });
}

/**
 * A guest game saved once and never again (a page opened, a few blows, then left: less than
 * a minute of play) is let go after this many hours unvisited, the others after
 * GUEST_SAVE_DAYS: most rows a flood of new guests leaves are of the first kind.
 */
export const GUEST_GLIMPSE_HOURS = 48;

/** Deletes the guest games nobody visited for GUEST_SAVE_DAYS, and the glimpses after GUEST_GLIMPSE_HOURS. */
export async function purgeGuestSaves(now = new Date()) {
  const removed = await db.delete(guestSaves)
    .where(lt(guestSaves.lastSeenAt, new Date(now.getTime() - GUEST_SAVE_DAYS * DAY)))
    .returning({ id: guestSaves.id });
  if (removed.length > 0) console.log(`[api] ${removed.length} guest game(s) deleted after ${GUEST_SAVE_DAYS} days unvisited`);
  const glimpses = await db.delete(guestSaves)
    .where(and(eq(guestSaves.revision, 1), lt(guestSaves.lastSeenAt, new Date(now.getTime() - GUEST_GLIMPSE_HOURS * 3_600_000))))
    .returning({ id: guestSaves.id });
  if (glimpses.length > 0) console.log(`[api] ${glimpses.length} guest game(s) saved once deleted after ${GUEST_GLIMPSE_HOURS} h unvisited`);
}
