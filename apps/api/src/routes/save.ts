import { migrateState, type ApiError, type GameState } from "@idlebound/game";
import { leaderboardSummary, safeParseState, verifyFirstSight, verifyNewLineage, verifyPace, verifySaveVersion, verifyState, verifyTransition, type Pace, type Violation } from "@idlebound/game/server";
import { eq, sql as raw } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { z } from "zod";
import { db } from "../db/client";
import { guestSaves, leaderboard, saveRejections, saves } from "../db/schema";
import { forgetGuest, guestId, keepGuest, newGuest, renewGuest, visitDue } from "../lib/guest";
import { fail } from "../lib/errors";
import { clientIp, limiter, tooMany } from "../lib/rate-limit";
import { currentUser } from "../lib/session";
import { verificationOverdue } from "../lib/verification";

/** At most one save every 10 s per game, an account's or a guest's (the client sends one every 30 s). */
const saveLimiter = limiter(6, 60_000);
/** Replacing the stored save with another lineage is rare, so it is tightly limited. */
const replaceLimiter = limiter(3, 60 * 60_000);
/** Rejections logged per game: a client looping on a refused save cannot flood the audit table. */
const rejectionLog = limiter(30, 60 * 60_000);
/** Opening a game (each page load, each takeover): far more than a walker needs. */
const openLimiter = limiter(10, 60_000);
/** Guest saves from one address, all games together: ten guests at full pace behind one router. */
const guestSaveIp = limiter(60, 60_000);
/** Guest games opened from one address, all games together: the cookie is the caller's to invent. */
const guestOpenIp = limiter(60, 60_000);
/** New guest games from one address: each one is a row the server keeps for weeks. */
const guestCreateIp = limiter(20, 60 * 60_000);

/** Violations sent back to the client: enough to debug, never a megabyte of echoes. */
const MAX_REPORTED_VIOLATIONS = 20;

/**
 * A game the server sees for the first time (a guest's first save, or one brought to an
 * account without the guest save it came from) may be at most 30 days old.
 */
const MAX_GUEST_AGE_MS = 30 * 86_400_000;

/**
 * A page in sight saves every 30 s at most: one silent for this long (closed, asleep, offline)
 * no longer holds its game, and another page opens it without asking.
 */
const HOLD_MS = 2 * 60_000;

/** A page's id: random, chosen by the page, only ever compared with another. */
const holderId = z.string().min(16).max(64);

const putBody = z.object({
  state: z.unknown(),
  /** Revision the client builds on; null for a first save. */
  baseRevision: z.number().int().nullable(),
  /** Replaces the stored save with a game from another lineage (explicit player choice). */
  replace: z.boolean().optional(),
  /** The page sending the save; absent from pages older than the hold (they hold nothing). */
  holder: holderId.optional(),
  /** The page is out of sight: the game is saved, and any other page may take it at once. */
  release: z.boolean().optional()
});

const openBody = z.object({
  holder: holderId,
  /** Takes the game even from a page playing it right now (explicit player choice). */
  force: z.boolean().optional()
});

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

interface Stored {
  state: unknown;
  revision: number;
  updatedAt: Date;
  holder: string | null;
  heldAt: Date | null;
  pace: Pace | null;
}

interface Written {
  state: GameState;
  revision: number;
  gameCreatedAt: number;
  updatedAt: Date;
  pace: Pace;
  /** Left out by a page that sent no id: the hold stays as it was. */
  holder?: string | null;
  heldAt?: Date | null;
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

/** Another page played this game a moment ago, and has not let it go. */
function heldElsewhere(row: Stored, holder: string, now: number): boolean {
  return row.holder !== null && row.holder !== holder && row.heldAt !== null && now - row.heldAt.getTime() < HOLD_MS;
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
  const { baseRevision, replace, holder, release } = parsedBody.data;
  // Checks that need no stored data run before the transaction: the row lock and the
  // pooled connection are held only for what depends on the previous save.
  const stateViolations = verifyState(next, now);

  return db.transaction(async (tx): Promise<Outcome> => {
    const existing = await ledger.load(tx);
    // The stored save may predate the current version: compare like with like.
    const previous = existing ? (migrateState(existing.state) as GameState) : undefined;

    // Another page plays this game: it was taken over from here, this page stops. Replacing
    // the game is a choice made in sight, and takes it over too.
    if (existing && holder && !replace && heldElsewhere(existing, holder, now)) {
      return { status: 409, body: fail("game_elsewhere") };
    }
    // Another revision (another device) or another game (new game): the player must choose
    // explicitly, never a silent overwrite.
    const otherLineage = existing && previous && previous.createdAt !== next.createdAt;
    if (existing && !replace && (baseRevision !== existing.revision || otherLineage)) {
      return { status: 409, body: { error: ledger.conflict, conflict: { revision: existing.revision, updatedAt: existing.updatedAt.toISOString(), cloud: summary(previous!) } } };
    }
    // The page builds on a game the server no longer keeps here (another page brought it to
    // an account): it is not a new game, and never becomes a second copy of that one.
    if (!existing && baseRevision !== null && !replace) return { status: 409, body: fail(ledger.conflict) };
    if (existing && replace && ledger.key && replaceLimiter.consume(ledger.key) > 0) {
      return { status: 429, body: fail("too_many_replacements") };
    }

    const violations: Violation[] = [...stateViolations];
    // Never back to an older version: a relabelled save would run the migrations again.
    if (existing) violations.push(...verifySaveVersion(existing.state, parsedBody.data.state));
    const sameLineage = existing && previous && previous.createdAt === next.createdAt;
    const witness = sameLineage ? undefined : await ledger.witness(tx, next);
    // The save this one carries on, as the server kept it, and what the server measured since.
    let kept: { state: GameState; pace: Pace | null; elapsedMs: number } | undefined;
    if (existing && previous && sameLineage) {
      kept = { state: previous, pace: existing.pace, elapsedMs: now - existing.updatedAt.getTime() };
      violations.push(...verifyTransition(previous, next, kept.elapsedMs));
    } else if (witness) {
      // A guest's game brought to the account: the server kept it, so it is held to its own
      // last save, like any game that carries on.
      kept = { state: migrateState(witness.state) as GameState, pace: witness.pace, elapsedMs: now - witness.updatedAt.getTime() };
      violations.push(...verifySaveVersion(witness.state, parsedBody.data.state));
      violations.push(...verifyTransition(kept.state, next, kept.elapsedMs));
    } else {
      // A game the server never saw: every stage of its record was walked.
      violations.push(...verifyFirstSight(next));
      if (existing && previous) {
        // Another game replaces the stored one: it gets no more time than the stored game had
        // been credited, plus the time the server saw pass since, whatever its creation date.
        violations.push(...verifyNewLineage(previous, next, now - existing.updatedAt.getTime()));
      } else if (next.createdAt < ledger.oldest) {
        // Its age is bounded, otherwise an invented creation date would grant months of
        // "plausible" play time.
        violations.push({ code: "lineage-age", message: "This game is too old to be seen for the first time." });
      }
    }
    const paced = verifyPace(kept?.state, next, kept?.pace, now, kept?.elapsedMs ?? 0);
    violations.push(...paced.violations);
    if (violations.length > 0) {
      await ledger.reject(tx, [...new Set(violations.map((violation) => violation.code))]);
      return { status: 422, body: fail("save_rejected", { violations: violations.slice(0, MAX_REPORTED_VIOLATIONS) }) };
    }

    const revision = (existing?.revision ?? 0) + 1;
    const updatedAt = new Date(now);
    const hold = holder === undefined ? {} : release ? { holder: null, heldAt: null } : { holder, heldAt: updatedAt };
    const refused = await ledger.write(tx, existing, { state: next, revision, gameCreatedAt: next.createdAt, updatedAt, pace: paced.pace, ...hold }, witness);
    return refused ?? { status: 200, body: { revision, updatedAt: updatedAt.toISOString() } };
  });
}

/**
 * A page opens the stored game: it holds it from now on, unless another page plays it right
 * now and the walker did not ask to take it over (`elsewhere`, nothing changed). The game is
 * answered either way, so the page shows it.
 */
async function open<Row extends Stored>(c: Context, load: (tx: Tx) => Promise<Row | undefined>, hold: (tx: Tx, holder: string, at: Date) => Promise<void>) {
  let input: unknown;
  try {
    input = await c.req.json();
  } catch {
    return null;
  }
  const parsed = openBody.safeParse(input);
  if (!parsed.success) return null;
  const { holder, force } = parsed.data;
  return db.transaction(async (tx) => {
    const row = await load(tx);
    if (!row) return { row, elsewhere: false };
    const now = Date.now();
    if (!force && heldElsewhere(row, holder, now)) return { row, elsewhere: true };
    await hold(tx, holder, new Date(now));
    return { row, elsewhere: false };
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

  .post("/open", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json(fail("login_required"), 401);
    const wait = openLimiter.consume(user.id);
    if (wait > 0) return tooMany(c, wait);
    const opened = await open(
      c,
      async (tx) => (await tx.select().from(saves).where(eq(saves.userId, user.id)).for("update").limit(1))[0],
      async (tx, holder, heldAt) => {
        await tx.update(saves).set({ holder, heldAt }).where(eq(saves.userId, user.id));
      }
    );
    if (!opened) return c.json(fail("invalid_request"), 400);
    return c.json({ save: opened.row ? stored(opened.row) : null, elsewhere: opened.elsewhere });
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
        await tx.insert(leaderboard)
          .values({ userId: user.id, ...board, updatedAt: values.updatedAt, stageReachedAt: values.updatedAt })
          .onConflictDoUpdate({
            target: leaderboard.userId,
            set: {
              // A replacement may lower a record: keep the best verified one.
              maxStage: raw`greatest(${leaderboard.maxStage}, ${board.maxStage})`,
              weavings: raw`greatest(${leaderboard.weavings}, ${board.weavings})`,
              promises: raw`greatest(${leaderboard.promises}, ${board.promises})`,
              crystals: raw`greatest(${leaderboard.crystals}, ${board.crystals})`,
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

  .post("/guest/open", async (c) => {
    const ipWait = guestOpenIp.consume(clientIp(c));
    if (ipWait > 0) return tooMany(c, ipWait);
    const id = guestId(c);
    const wait = openLimiter.consume(id ?? `ip:${clientIp(c)}`);
    if (wait > 0) return tooMany(c, wait);
    const opened = await open(
      c,
      async (tx) => (id ? (await tx.select().from(guestSaves).where(eq(guestSaves.id, id)).for("update").limit(1))[0] : undefined),
      async (tx, holder, heldAt) => {
        await tx.update(guestSaves).set({ holder, heldAt }).where(eq(guestSaves.id, id!));
      }
    );
    if (!opened) return c.json(fail("invalid_request"), 400);
    const { row, elsewhere } = opened;
    // Purged, or adopted by an account from another tab: the cookie leads nowhere.
    if (!row && id) forgetGuest(c);
    if (row && id && visitDue(row.lastSeenAt)) {
      await db.update(guestSaves).set({ lastSeenAt: new Date() }).where(eq(guestSaves.id, id));
      renewGuest(c);
    }
    return c.json({ save: row ? stored(row) : null, elsewhere });
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
