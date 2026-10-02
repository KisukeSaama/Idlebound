import { migrateState, type ApiError, type GameState } from "@idlebound/game";
import { leaderboardSummary, safeParseState, verifyNewLineage, verifySaveVersion, verifyState, verifyTransition, type Violation } from "@idlebound/game/server";
import { eq, sql as raw } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { z } from "zod";
import { db } from "../db/client";
import { guestSaves, leaderboard, saveRejections, saves, stageHistory } from "../db/schema";
import { forgetGuest, guestId, keepGuest, newGuest, renewGuest, visitDue } from "../lib/guest";
import { fail } from "../lib/errors";
import { clientIp, limiter, tooMany } from "../lib/rate-limit";
import { currentUser } from "../lib/session";
import { utcDay } from "../lib/stride";
import { verificationOverdue } from "../lib/verification";

/** At most one save every 10 s per game, an account's or a guest's (the client sends one every 30 s). */
const saveLimiter = limiter(6, 60_000);
/** Replacing the stored save with another lineage is rare, so it is tightly limited. */
const replaceLimiter = limiter(3, 60 * 60_000);
/** Rejections logged per game: a client looping on a refused save cannot flood the audit table. */
const rejectionLog = limiter(30, 60 * 60_000);
/** Guest saves from one address, all games together: ten guests at full pace behind one router. */
const guestSaveIp = limiter(60, 60_000);
/** New guest games from one address: each one is a row the server keeps for weeks. */
const guestCreateIp = limiter(20, 60 * 60_000);

/** Violations sent back to the client: enough to debug, never a megabyte of echoes. */
const MAX_REPORTED_VIOLATIONS = 20;

/**
 * A game the server sees for the first time (a guest's first save, or one brought to an
 * account without the guest save it came from) may be at most 30 days old.
 */
const MAX_GUEST_AGE_MS = 30 * 86_400_000;

const putBody = z.object({
  state: z.unknown(),
  /** Revision the client builds on; null for a first save. */
  baseRevision: z.number().int().nullable(),
  /** Replaces the stored save with a game from another lineage (explicit player choice). */
  replace: z.boolean().optional()
});

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

interface Stored {
  state: unknown;
  revision: number;
  updatedAt: Date;
}

interface Written {
  state: GameState;
  revision: number;
  gameCreatedAt: number;
  updatedAt: Date;
}

type Outcome =
  | { status: 200; body: { revision: number; updatedAt: string } }
  | { status: 409 | 422; body: Record<string, unknown> }
  | { status: 429; body: { error: ApiError }; retryAfter?: number };

/** Where a game is kept: an account's row, or a guest's. Both go through the same checks. */
interface Ledger {
  /** Key of the replacement limit; null when nothing can be stored under it yet. */
  key: string | null;
  conflict: ApiError;
  /** The stored game, its row locked until the transaction ends. */
  load(tx: Tx): Promise<Stored | undefined>;
  /** Another game the server already kept and that `next` carries on (a guest's, brought to an account). */
  witness(tx: Tx, next: GameState): Promise<Stored | undefined>;
  /** Oldest creation date of a game the server never saw before. */
  oldest: number;
  reject(tx: Tx, codes: string[]): Promise<void>;
  /** Writes the accepted game; an outcome when it could not be written after all. */
  write(tx: Tx, existing: Stored | undefined, values: Written, witness: Stored | undefined): Promise<Outcome | null>;
}

function summary(state: GameState) {
  return {
    maxStage: state.maxStageEver,
    ascensions: state.lifetime.ascensions,
    playTime: Math.floor(state.lifetime.playTime),
    achievements: state.achievements.length,
    savedAt: state.lastTickAt
  };
}

/** What `GET` answers for a stored game. */
function stored(row: Stored) {
  // The time the server saw pass since this save: the most a closed game may be credited
  // when it opens again, whatever the device's clock says.
  const elapsedMs = Math.max(0, Date.now() - row.updatedAt.getTime());
  return { state: row.state, revision: row.revision, updatedAt: row.updatedAt.toISOString(), elapsedMs };
}

/** Checks a save against what its ledger holds and writes it. Accounts and guests alike. */
async function keep(c: Context, ledger: Ledger): Promise<Outcome | { status: 400; body: { error: ApiError } }> {
  let input: unknown;
  try {
    input = await c.req.json();
  } catch {
    return { status: 400, body: fail("invalid_request") };
  }
  const parsedBody = putBody.safeParse(input);
  if (!parsedBody.success) return { status: 400, body: fail("invalid_request") };
  const parsed = safeParseState(parsedBody.data.state);
  if (!parsed.ok) return { status: 400, body: fail("invalid_save", { detail: parsed.error }) };
  const next = parsed.state;
  const now = Date.now();
  const { baseRevision, replace } = parsedBody.data;
  // Checks that need no stored data run before the transaction: the row lock and the
  // pooled connection are held only for what depends on the previous save.
  const stateViolations = verifyState(next, now);

  return db.transaction(async (tx): Promise<Outcome> => {
    const existing = await ledger.load(tx);
    // The stored save may predate the current version: compare like with like.
    const previous = existing ? (migrateState(existing.state) as GameState) : undefined;

    // Another revision (another device) or another game (new game): the player must choose
    // explicitly, never a silent overwrite.
    const otherLineage = existing && previous && previous.createdAt !== next.createdAt;
    if (existing && !replace && (baseRevision !== existing.revision || otherLineage)) {
      return { status: 409, body: { error: ledger.conflict, conflict: { revision: existing.revision, updatedAt: existing.updatedAt.toISOString(), cloud: summary(previous!) } } };
    }
    if (existing && replace && ledger.key && replaceLimiter.consume(ledger.key) > 0) {
      return { status: 429, body: fail("too_many_replacements") };
    }

    const violations: Violation[] = [...stateViolations];
    // Never back to an older version: a relabelled save would run the migrations again.
    if (existing) violations.push(...verifySaveVersion(existing.state, parsedBody.data.state));
    const sameLineage = existing && previous && previous.createdAt === next.createdAt;
    const witness = sameLineage ? undefined : await ledger.witness(tx, next);
    if (existing && previous && sameLineage) {
      violations.push(...verifyTransition(previous, next, now - existing.updatedAt.getTime()));
    } else if (witness) {
      // A guest's game brought to the account: the server kept it, so it is held to its own
      // last save, like any game that carries on.
      violations.push(...verifySaveVersion(witness.state, parsedBody.data.state));
      violations.push(...verifyTransition(migrateState(witness.state) as GameState, next, now - witness.updatedAt.getTime()));
    } else if (existing && previous) {
      // Another game replaces the stored one: it gets no more time than the stored game had
      // been credited, plus the time the server saw pass since, whatever its creation date.
      violations.push(...verifyNewLineage(previous, next, now - existing.updatedAt.getTime()));
    } else if (next.createdAt < ledger.oldest) {
      // A game the server never saw: its age is bounded, otherwise an invented creation
      // date would grant months of "plausible" play time.
      violations.push({ code: "lineage-age", message: "This game is too old to be seen for the first time." });
    }
    if (violations.length > 0) {
      await ledger.reject(tx, [...new Set(violations.map((violation) => violation.code))]);
      return { status: 422, body: fail("save_rejected", { violations: violations.slice(0, MAX_REPORTED_VIOLATIONS) }) };
    }

    const revision = (existing?.revision ?? 0) + 1;
    const updatedAt = new Date(now);
    const refused = await ledger.write(tx, existing, { state: next, revision, gameCreatedAt: next.createdAt, updatedAt }, witness);
    return refused ?? { status: 200, body: { revision, updatedAt: updatedAt.toISOString() } };
  });
}

function answer(c: Context, outcome: Awaited<ReturnType<typeof keep>>) {
  if (outcome.status === 429 && outcome.retryAfter) c.header("Retry-After", String(outcome.retryAfter));
  return c.json(outcome.body, outcome.status);
}

export const saveRoutes = new Hono()
  .get("/", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json(fail("login_required"), 401);
    const [row] = await db.select().from(saves).where(eq(saves.userId, user.id)).limit(1);
    return c.json({ save: row ? stored(row) : null });
  })

  .put("/", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json(fail("login_required"), 401);
    // After the grace period, an unconfirmed address blocks saving (loading still works).
    if (verificationOverdue(user)) return c.json(fail("email_unverified"), 403);
    const wait = saveLimiter.consume(user.id);
    if (wait > 0) return tooMany(c, wait);

    const guest = guestId(c);
    const moved = { guest: false };
    const outcome = await keep(c, {
      key: user.id,
      conflict: "save_conflict",
      load: async (tx) => (await tx.select().from(saves).where(eq(saves.userId, user.id)).for("update").limit(1))[0],
      // The game this browser played as a guest, when it is the one being saved.
      witness: async (tx, next) => {
        if (!guest) return undefined;
        const [row] = await tx.select().from(guestSaves).where(eq(guestSaves.id, guest)).for("update").limit(1);
        return row && row.gameCreatedAt === next.createdAt ? row : undefined;
      },
      oldest: user.createdAt.getTime() - MAX_GUEST_AGE_MS,
      reject: async (tx, codes) => {
        if (rejectionLog.consume(user.id) === 0) await tx.insert(saveRejections).values({ userId: user.id, codes });
      },
      write: async (tx, existing, values, witness) => {
        if (existing) {
          await tx.update(saves).set(values).where(eq(saves.userId, user.id));
        } else {
          // Two first saves at once (two tabs): the first one written wins, the other is a
          // conflict the player resolves, never a silent overwrite.
          const inserted = await tx.insert(saves)
            .values({ userId: user.id, ...values })
            .onConflictDoNothing({ target: saves.userId })
            .returning({ userId: saves.userId });
          if (inserted.length === 0) return { status: 409, body: fail("save_conflict") };
        }
        // The guest's game is the account's now: one game, one keeper.
        if (witness && guest) {
          await tx.delete(guestSaves).where(eq(guestSaves.id, guest));
          moved.guest = true;
        }

        const board = leaderboardSummary(values.state);
        // The Stride board: the day's first accepted save records the best stage as the day
        // began (an account's first save, the stage it arrives with). The save row is locked,
        // so this account's saves never race here.
        const [ranked] = await tx.select({ maxStage: leaderboard.maxStage }).from(leaderboard).where(eq(leaderboard.userId, user.id)).limit(1);
        await tx.insert(stageHistory)
          .values({ userId: user.id, day: utcDay(values.updatedAt), maxStage: ranked?.maxStage ?? board.maxStage })
          .onConflictDoNothing();
        await tx.insert(leaderboard)
          .values({ userId: user.id, ...board, updatedAt: values.updatedAt, stageReachedAt: values.updatedAt })
          .onConflictDoUpdate({
            target: leaderboard.userId,
            set: {
              // A replacement may lower a record: keep the best verified one.
              maxStage: raw`greatest(${leaderboard.maxStage}, ${board.maxStage})`,
              ascensions: raw`greatest(${leaderboard.ascensions}, ${board.ascensions})`,
              essences: raw`greatest(${leaderboard.essences}, ${board.essences})`,
              achievements: raw`greatest(${leaderboard.achievements}, ${board.achievements})`,
              descents: raw`greatest(${leaderboard.descents}, ${board.descents})`,
              playTime: raw`greatest(${leaderboard.playTime}, ${board.playTime})`,
              // Depth ties go to whoever got there first: the date moves only with the record.
              stageReachedAt: raw`case when ${board.maxStage} > ${leaderboard.maxStage} then ${values.updatedAt.toISOString()}::timestamptz else ${leaderboard.stageReachedAt} end`,
              updatedAt: values.updatedAt
            }
          });
        return null;
      }
    });
    if (moved.guest) forgetGuest(c);
    return answer(c, outcome);
  })

  // A guest's game: kept without an account, found by this browser's cookie, never ranked.
  .get("/guest", async (c) => {
    const id = guestId(c);
    if (!id) return c.json({ save: null });
    const [row] = await db.select().from(guestSaves).where(eq(guestSaves.id, id)).limit(1);
    if (!row) {
      // Purged, or adopted by an account from another tab: the cookie leads nowhere.
      forgetGuest(c);
      return c.json({ save: null });
    }
    if (visitDue(row.lastSeenAt)) {
      await db.update(guestSaves).set({ lastSeenAt: new Date() }).where(eq(guestSaves.id, id));
      renewGuest(c);
    }
    return c.json({ save: stored(row) });
  })

  .put("/guest", async (c) => {
    const ip = clientIp(c);
    const ipWait = guestSaveIp.consume(ip);
    if (ipWait > 0) return tooMany(c, ipWait);
    const id = guestId(c);
    const wait = id ? saveLimiter.consume(id) : 0;
    if (wait > 0) return tooMany(c, wait);

    // What the transaction leaves for the cookie: a new game's token, or the last visit seen.
    const cookie: { issued: string | null; lastSeenAt: Date | null } = { issued: null, lastSeenAt: null };
    const outcome = await keep(c, {
      key: id,
      conflict: "guest_save_conflict",
      load: async (tx) => {
        if (!id) return undefined;
        const [row] = await tx.select().from(guestSaves).where(eq(guestSaves.id, id)).for("update").limit(1);
        cookie.lastSeenAt = row?.lastSeenAt ?? null;
        return row;
      },
      witness: async () => undefined,
      oldest: Date.now() - MAX_GUEST_AGE_MS,
      reject: async (tx, codes) => {
        if (id && rejectionLog.consume(id) === 0) await tx.insert(saveRejections).values({ guestId: id, codes });
      },
      write: async (tx, existing, values) => {
        if (existing && id) {
          await tx.update(guestSaves).set({ ...values, lastSeenAt: values.updatedAt }).where(eq(guestSaves.id, id));
          return null;
        }
        // A new guest game (or one whose row is gone): a new row under a new cookie.
        const createWait = guestCreateIp.consume(ip);
        if (createWait > 0) return { status: 429, body: fail("too_many_attempts", { retryAfter: createWait }), retryAfter: createWait };
        const guest = newGuest();
        await tx.insert(guestSaves).values({ id: guest.id, ...values, lastSeenAt: values.updatedAt });
        cookie.issued = guest.token;
        // The save that creates the game counts towards its own pace.
        saveLimiter.consume(guest.id);
        return null;
      }
    });
    if (cookie.issued) keepGuest(c, cookie.issued);
    else if (outcome.status === 200 && cookie.lastSeenAt && visitDue(cookie.lastSeenAt)) renewGuest(c);
    return answer(c, outcome);
  })

  // The guest's game is let go: the account's game was taken instead, or replaced it.
  .delete("/guest", async (c) => {
    const id = guestId(c);
    if (id) await db.delete(guestSaves).where(eq(guestSaves.id, id));
    forgetGuest(c);
    return c.json({ ok: true });
  });
