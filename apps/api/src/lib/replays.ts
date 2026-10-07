import { gunzipSync } from "node:zlib";
import { GUEST_SAVE_DAYS, REACTION_BUCKETS, type PresenceTally } from "@idlebound/game";
import { parseJournal, type ParsedJournal } from "@idlebound/game/server";
import { and, eq, inArray, lt, sql as raw } from "drizzle-orm";
import { db } from "../db/client";
import { pendingSeeds, presenceDays, presenceSpans, replayReports } from "../db/schema";
import { newSecret } from "./fates";
import { limiter } from "./rate-limit";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const DAY = 86_400_000;
/** Replay reports and presence days are kept this long. */
const RECORD_DAYS = 90;
/** A journal unpacked from its gzip may be at most this large: no request can make the server inflate a bomb. */
const JOURNAL_MAX_BYTES = 4 * 1024 * 1024;
/** Acts of presence further apart than this end a stretch. */
export const PRESENCE_PAUSE_MS = 20 * 60_000;

/**
 * The journal a page sent with its save: an object, or the same JSON gzipped and in base64 (a
 * long journal compresses tenfold). Null when absent; "invalid" when it cannot be read.
 */
export function decodeJournal(raw: unknown): ParsedJournal | null | "invalid" {
  if (raw === undefined || raw === null) return null;
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(gunzipSync(Buffer.from(raw, "base64"), { maxOutputLength: JOURNAL_MAX_BYTES }).toString("utf8"));
    } catch {
      return "invalid";
    }
  }
  return parseJournal(value) ?? "invalid";
}

/** The pending seed's owner key of an account, or of a guest's cookie. */
export const accountOwner = (userId: string) => `u:${userId}`;
export const guestOwner = (guestId: string) => `g:${guestId}`;

/**
 * The seed of the next game of `owner`: the one already handed out if no save began it yet,
 * a new one otherwise. Its creation date is the server's clock, moved on by a millisecond
 * while another game already has it (a lineage is one game).
 */
export async function pendingSeed(owner: string): Promise<{ secret: string; createdAt: number }> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const [kept] = await db.select().from(pendingSeeds).where(eq(pendingSeeds.owner, owner)).limit(1);
    if (kept) return { secret: kept.secret, createdAt: kept.gameCreatedAt };
    const inserted = await db.insert(pendingSeeds)
      .values({ owner, secret: newSecret(), gameCreatedAt: Date.now() + attempt })
      .onConflictDoNothing()
      .returning();
    if (inserted[0]) return { secret: inserted[0].secret, createdAt: inserted[0].gameCreatedAt };
  }
  throw new Error("No pending seed could be kept.");
}

/** The pending seed of one of `owners` that begins the game born at `createdAt`, if any. */
export async function findPending(tx: Tx, owners: string[], createdAt: number): Promise<{ owner: string; secret: string } | undefined> {
  if (owners.length === 0) return undefined;
  const [row] = await tx.select().from(pendingSeeds).where(and(inArray(pendingSeeds.owner, owners), eq(pendingSeeds.gameCreatedAt, createdAt))).limit(1);
  return row ? { owner: row.owner, secret: row.secret } : undefined;
}

/** The game began: its seed is the game's now, no longer pending. */
export async function consumePending(tx: Tx, owner: string) {
  await tx.delete(pendingSeeds).where(eq(pendingSeeds.owner, owner));
}

/** Reports kept per game: a page looping on a diverging journal cannot flood the table. */
const reportLog = limiter(30, 60 * 60_000);

/** Keeps what a replay found, under the account or the guest's game. */
export async function report(tx: Tx, who: { userId?: string; guestId?: string }, outcome: string, detail: Record<string, unknown>) {
  const key = who.userId ?? who.guestId ?? "anonymous";
  if (reportLog.consume(key) > 0) return;
  await tx.insert(replayReports).values({ userId: who.userId ?? null, guestId: who.guestId ?? null, outcome, detail });
  console.log(`[api] replay ${outcome}`, JSON.stringify({ ...who, ...detail }).slice(0, 500));
}

/**
 * Adds what a replay saw of an account's presence to its day, and follows the stretch under
 * way: acts closer than `PRESENCE_PAUSE_MS` carry it on, a longer pause ends it.
 */
export async function recordPresence(tx: Tx, userId: string, tally: PresenceTally, now: number) {
  const day = new Date(now).toISOString().slice(0, 10);
  const [span] = await tx.select().from(presenceSpans).where(eq(presenceSpans.userId, userId)).for("update").limit(1);
  let current = span ? { startedAt: span.startedAt, lastAt: span.lastAt } : null;
  let longest = 0;
  for (const at of tally.acts) {
    if (current && at - current.lastAt <= PRESENCE_PAUSE_MS) {
      current.lastAt = Math.max(current.lastAt, at);
    } else {
      if (current) longest = Math.max(longest, current.lastAt - current.startedAt);
      current = { startedAt: at, lastAt: at };
    }
  }
  if (current) {
    longest = Math.max(longest, current.lastAt - current.startedAt);
    await tx.insert(presenceSpans).values({ userId, ...current }).onConflictDoUpdate({ target: presenceSpans.userId, set: current });
  }
  const empty = REACTION_BUCKETS.map(() => 0).concat(0);
  const reactions = empty.map((_, index) => tally.reactions[index] ?? 0);
  await tx.insert(presenceDays)
    .values({
      userId,
      day,
      crystalsSeen: tally.crystalsSeen,
      crystalsCaught: tally.crystalsCaught,
      reactions,
      powers: tally.powers,
      promptPowers: tally.promptPowers,
      ascensions: tally.ascensions,
      acts: tally.acts.length,
      longestSpanMs: longest
    })
    .onConflictDoUpdate({
      target: [presenceDays.userId, presenceDays.day],
      set: {
        crystalsSeen: raw`${presenceDays.crystalsSeen} + ${tally.crystalsSeen}`,
        crystalsCaught: raw`${presenceDays.crystalsCaught} + ${tally.crystalsCaught}`,
        reactions: raw`(select jsonb_agg(coalesce((${presenceDays.reactions} ->> (i - 1))::int, 0) + coalesce((${JSON.stringify(reactions)}::jsonb ->> (i - 1))::int, 0) order by i) from generate_series(1, ${reactions.length}) as i)`,
        powers: raw`${presenceDays.powers} + ${tally.powers}`,
        promptPowers: raw`${presenceDays.promptPowers} + ${tally.promptPowers}`,
        ascensions: raw`${presenceDays.ascensions} + ${tally.ascensions}`,
        acts: raw`${presenceDays.acts} + ${tally.acts.length}`,
        longestSpanMs: raw`greatest(${presenceDays.longestSpanMs}, ${longest})`
      }
    });
}

/** Periodic cleanup: old replay reports and presence days, pending seeds nobody began. */
export async function purgeReplayRecords(now = new Date()) {
  const old = new Date(now.getTime() - RECORD_DAYS * DAY);
  await db.delete(replayReports).where(lt(replayReports.createdAt, old));
  await db.delete(presenceDays).where(lt(presenceDays.day, old.toISOString().slice(0, 10)));
  await db.delete(presenceSpans).where(lt(presenceSpans.lastAt, old.getTime()));
  await db.delete(pendingSeeds).where(lt(pendingSeeds.issuedAt, new Date(now.getTime() - GUEST_SAVE_DAYS * DAY)));
}
