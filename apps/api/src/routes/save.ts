import { createInitialState, migrateState, type ApiError, type EngineRuntime, type FateWindow, type GameState, type Journal } from "@idlebound/game";
import { leaderboardSummary, safeParseState, verifyFirstSight, verifyNewLineage, verifyPace, verifySaveVersion, verifyState, verifyTransition, type Pace, type Violation } from "@idlebound/game/server";
import { and, eq, ne, sql as raw } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { z } from "zod";
import { db } from "../db/client";
import { guestSaves, leaderboard, pendingSeeds, saveRejections, saves, type Branch, type Chain } from "../db/schema";
import { env } from "../env";
import { fateWindow, newSecret } from "../lib/fates";
import { accountOwner, consumePending, decodeJournal, findPending, guestOwner, pendingSeed, recordPresence, report } from "../lib/replays";
import { runReplay } from "../replay/pool";
import type { ReplayVerdict } from "../replay/check";
import { forgetGuest, guestId, keepGuest, newGuest, renewGuest, visitDue } from "../lib/guest";
import { fail } from "../lib/errors";
import { clientIp, consumeNetwork, limiter, tooMany } from "../lib/rate-limit";
import { currentUser } from "../lib/session";
import { snapshotSave } from "../lib/snapshots";
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
/** The same per IPv6 /48 (see `networkKey`): one site, 65,536 addresses. */
const guestCreateNetwork = limiter(60, 60 * 60_000);
/**
 * Guest games the server begins keeping in an hour, every address together: a flood from
 * many addresses cannot fill the disk faster than this. Past it, a guest still plays, and its
 * game is kept once the hour turns (see `GUEST_GAMES_PER_HOUR`).
 */
const guestCreateAll = limiter(env.GUEST_GAMES_PER_HOUR, 60 * 60_000);

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
/** A save whose replay found every worker busy is asked again after this. */
const BUSY_RETRY_SECONDS = 5;

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
  release: z.boolean().optional(),
  /**
   * What the walker did since the save it builds on (see `replay.ts` in the game), as JSON or
   * gzipped JSON in base64. The server replays it and compares (see `REPLAY_MODE`).
   */
  journal: z.union([z.string().max(700_000), z.record(z.string(), z.unknown())]).optional(),
  /** More of the journal follows in the next saves (the page is back from a long outage). */
  more: z.boolean().optional()
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
  seed: string | null;
  runtime: EngineRuntime | null;
  branch: Branch | null;
  parent: Branch | null;
  chain: Chain | null;
}

interface Written {
  state: GameState;
  revision: number;
  gameCreatedAt: number;
  updatedAt: Date;
  pace: Pace;
  seed: string | null;
  runtime: EngineRuntime | null;
  /** The revision it follows, as the server kept it (null for a game seen for the first time). */
  parent: Branch | null;
  /** Cleared when another game takes the row: where another page left the old one means nothing now. */
  branch?: null;
  /** Where the chain of saves under way began, if one is (see `Chain`). */
  chain: Chain | null;
  /** Left out by a page that sent no id: the hold stays as it was. */
  holder?: string | null;
  heldAt?: Date | null;
}

type Outcome =
  | { status: 200; body: { revision: number; updatedAt: string; fates: FateWindow | null; replay?: { state: GameState; runtime: EngineRuntime } } }
  | { status: 409 | 422; body: Record<string, unknown> }
  | { status: 429; body: { error: ApiError }; retryAfter?: number };

/** Where a game is kept: an account's row, or a guest's. Both go through the same checks. */
interface Ledger {
  /** Key of the replacement limit; null when nothing can be stored under it yet. */
  key: string | null;
  /** Whose game this is: the account's row, or a guest's. */
  kind: "account" | "guest";
  /** Who the replay reports and the presence are kept for. */
  who: { userId?: string; guestId?: string };
  /** Owners whose pending seed may begin a game this ledger keeps (see lib/replays.ts). */
  owners: string[];
  conflict: ApiError;
  /** The stored game; with `lock`, its row locked until the transaction ends. */
  load(tx: Tx, lock: boolean): Promise<Stored | undefined>;
  /** Another game the server already kept and that `next` carries on (a guest's, brought to an account). */
  witness(tx: Tx, next: GameState, lock: boolean): Promise<Stored | undefined>;
  /** Oldest creation date of a game the server never saw before. */
  oldest: number;
  /** Another account already keeps the game born at `createdAt`: this one would be its copy. */
  claimed(tx: Tx, createdAt: number): Promise<boolean>;
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

/** What `GET` answers for a stored game: the save, and the window of its fates (`seed` is the row's secret). */
function stored(row: Stored, seed: string | null) {
  // The time the server saw pass since this save: the most a closed game may be credited
  // when it opens again, whatever the device's clock says.
  const elapsedMs = Math.max(0, Date.now() - row.updatedAt.getTime());
  const fates = seed ? fateWindow(seed, (migrateState(row.state) as GameState).fates) : null;
  return { state: row.state, revision: row.revision, updatedAt: row.updatedAt.toISOString(), elapsedMs, fates };
}

/**
 * Where a journal begins, as the server kept it; null when it keeps nothing there any more.
 * `earlier`: it begins before the stored revision (where another page took the game, or the
 * revision before a save whose answer was lost), and the checks measure from there.
 */
function journalBase(journal: Journal, ledger: Ledger, existing: Stored | undefined, previous: GameState | undefined, witness: Stored | undefined): { state: GameState; runtime: EngineRuntime | null; earlier?: Branch } | null {
  const { revision, guest } = journal.base;
  if (revision === null) return journal.open ? { state: createInitialState(journal.base.createdAt), runtime: null } : null;
  const own = (guest === true) === (ledger.kind === "guest");
  if (own && existing && previous) {
    if (existing.revision === revision) return { state: previous, runtime: existing.runtime };
    for (const kept of [existing.branch, existing.parent]) {
      if (kept?.revision === revision) {
        const state = migrateState(kept.state) as GameState;
        return { state, runtime: kept.runtime, earlier: { ...kept, state } };
      }
    }
  }
  if (!own && witness && witness.revision === revision) return { state: migrateState(witness.state) as GameState, runtime: witness.runtime };
  return null;
}

/** Saves raced on the same game: a save measured against rows that moved is measured again, at most this often. */
const SETTLE_ATTEMPTS = 3;

/**
 * What a save is measured against, read without a lock: the stored rows by revision (and
 * where another page took the game), and the secret of its fates. The replay runs against
 * these, with no row locked and no connection held; the transaction that writes the save
 * reads them again under the lock and measures again if they moved.
 */
function markOf(existing: Stored | undefined, witness: Stored | undefined, secret: string | null): string {
  const row = (kept: Stored | undefined) => (kept ? `${kept.revision}@${kept.updatedAt.getTime()}+${kept.branch?.revision ?? ""}@${kept.branch?.at ?? ""}` : "-");
  return `${row(existing)}/${row(witness)}/${secret ?? ""}`;
}

/** What the rows say of a save before it is measured: its fates' secret, its previous game, the conflict that stops it. */
async function survey(tx: Tx, ledger: Ledger, next: GameState, input: { baseRevision: number | null; replace?: boolean; holder?: string }, lock: boolean, now: number) {
  const existing = await ledger.load(tx, lock);
  // The stored save may predate the current version: compare like with like.
  const previous = existing ? (migrateState(existing.state) as GameState) : undefined;
  let stop: Outcome | null = null;
  // Another page plays this game: it was taken over from here, this page stops. Replacing
  // the game is a choice made in sight, and takes it over too.
  if (existing && input.holder && !input.replace && heldElsewhere(existing, input.holder, now)) stop = { status: 409, body: fail("game_elsewhere") };
  // Another revision (another device) or another game (new game): the player must choose
  // explicitly, never a silent overwrite.
  const otherLineage = existing && previous && previous.createdAt !== next.createdAt;
  if (!stop && existing && !input.replace && (input.baseRevision !== existing.revision || otherLineage)) {
    stop = { status: 409, body: { error: ledger.conflict, conflict: { revision: existing.revision, updatedAt: existing.updatedAt.toISOString(), cloud: summary(previous!) } } };
  }
  // The page builds on a game the server no longer keeps here (another page brought it to
  // an account): it is not a new game, and never becomes a second copy of that one.
  if (!stop && !existing && input.baseRevision !== null && !input.replace) stop = { status: 409, body: fail(ledger.conflict) };
  const sameLineage = !!(existing && previous && previous.createdAt === next.createdAt);
  const witness = sameLineage ? undefined : await ledger.witness(tx, next, lock);
  // The game's fates: its own secret, the guest's it came from, or the pending seed that began it.
  let secret: string | null = null;
  let pendingOwner: string | null = null;
  if (sameLineage) secret = existing!.seed;
  else if (witness) secret = witness.seed;
  else {
    const pending = await findPending(tx, ledger.owners, next.createdAt);
    if (pending) {
      secret = pending.secret;
      pendingOwner = pending.owner;
    }
  }
  return { existing, previous, sameLineage, witness, secret, pendingOwner, stop, mark: markOf(existing, witness, secret) };
}

type Survey = Awaited<ReturnType<typeof survey>>;

/** The journal replayed from the save it builds on, with the game's fates (see REPLAY_MODE). */
interface Measure {
  verdict: ReplayVerdict | null;
  problem: string | null;
  earlier: Branch | undefined;
}

async function measure(journal: ReturnType<typeof decodeJournal>, ledger: Ledger, seen: Survey, declared: GameState): Promise<Measure> {
  if (journal === "invalid") return { verdict: null, problem: "journal-invalid", earlier: undefined };
  if (!journal) return { verdict: null, problem: "no-journal", earlier: undefined };
  if (!seen.secret) return { verdict: null, problem: "no-seed", earlier: undefined };
  const base = journalBase(journal.journal, ledger, seen.existing, seen.previous, seen.witness);
  // A new game's journal begins the game the save names, never another one.
  if (!base || (journal.journal.base.revision === null && journal.journal.base.createdAt !== declared.createdAt)) return { verdict: null, problem: "no-base", earlier: undefined };
  const verdict = await runReplay({ base: base.state, runtime: base.runtime, journal: journal.journal, secret: seen.secret, declared });
  return { verdict, problem: verdict.outcome === "failed" ? (verdict.error ?? "failed") : null, earlier: base.earlier };
}

/** A save measured against rows that moved before it could be written. */
const MOVED = Symbol("moved");

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
  const declared = parsed.state;
  // The creation date names the game's lineage in the database (a bigint): a whole number.
  if (!Number.isSafeInteger(declared.createdAt)) return { status: 400, body: fail("invalid_save", { detail: "createdAt" }) };
  const now = Date.now();
  const enforce = env.REPLAY_MODE === "enforce";
  const journal = decodeJournal(parsedBody.data.journal);
  // Checks that need no stored data run before the transaction: the row lock and the
  // pooled connection are held only for what depends on the previous save. Enforced, they
  // run on the replayed game instead, once it is known.
  const stateViolations = enforce ? [] : verifyState(declared, now);

  for (let attempt = 0; attempt < SETTLE_ATTEMPTS; attempt += 1) {
    // Read without a lock, then replay with no row locked and no connection held: a burst of
    // long journals never holds the pool the rest of the API needs.
    const seen = await db.transaction((tx) => survey(tx, ledger, declared, parsedBody.data, false, now));
    const measured = seen.stop ? null : await measure(journal, ledger, seen, declared);
    // Every worker was busy: enforced, the save comes back a little later rather than refused.
    if (enforce && measured?.verdict?.error === "busy") return { status: 429, body: fail("too_many_attempts", { retryAfter: BUSY_RETRY_SECONDS }), retryAfter: BUSY_RETRY_SECONDS };
    const outcome = await db.transaction((tx) => settle(tx, ledger, parsedBody.data, declared, journal, stateViolations, seen.mark, measured, now));
    if (outcome !== MOVED) return outcome;
  }
  // Another save of the same game kept landing in between: the page asks again.
  return { status: 409, body: fail(ledger.conflict) };
}

/** Under the row lock: the checks that depend on the stored game, then the write. */
async function settle(
  tx: Tx,
  ledger: Ledger,
  body: z.infer<typeof putBody>,
  declared: GameState,
  journal: ReturnType<typeof decodeJournal>,
  stateViolations: Violation[],
  mark: string,
  measured: Measure | null,
  now: number
): Promise<Outcome | typeof MOVED> {
  const { replace, holder, release } = body;
  const enforce = env.REPLAY_MODE === "enforce";
  let next = declared;
  const seen = await survey(tx, ledger, next, body, true, now);
  if (seen.stop) return seen.stop;
  // The rows moved since the replay was measured, or it was not (a conflict that lifted since).
  if (seen.mark !== mark || !measured) return MOVED;
  const { existing, previous, sameLineage, witness, secret, pendingOwner } = seen;
  if (existing && replace && ledger.key && replaceLimiter.consume(ledger.key) > 0) {
    return { status: 429, body: fail("too_many_replacements") };
  }

  const violations: Violation[] = [...stateViolations];
  // Never back to an older version: a relabelled save would run the migrations again.
  if (existing) violations.push(...verifySaveVersion(existing.state, body.state));
  if (!sameLineage) {
    // A game belongs to one account: a copy of one another account keeps (sent again after
    // a sign-out, or by hand) would rank the same walk twice. Two copies sent at once wait
    // for each other here, so the second one sees the first.
    await tx.execute(raw`select pg_advisory_xact_lock(${next.createdAt}::bigint)`);
    // A first save sent twice at once: the second one finds the first one's game here.
    if (!existing && (await ledger.load(tx, true))) return { status: 409, body: fail(ledger.conflict) };
    if (await ledger.claimed(tx, next.createdAt)) {
      violations.push({ code: "lineage-taken", message: "Another account already keeps this game." });
    }
  }

  const { verdict, problem, earlier } = measured;
  const ignored = (verdict?.ignored ?? 0) + (journal && journal !== "invalid" ? journal.dropped : 0);
  if (problem || verdict?.outcome === "diverged" || ignored > 0 || (verdict?.stray ?? 0) > 0) {
    await report(tx, ledger.who, problem ?? verdict!.outcome, {
      mode: env.REPLAY_MODE,
      problem,
      diff: verdict?.diff ?? [],
      ignored,
      stray: verdict?.stray ?? 0,
      steps: verdict?.steps ?? 0,
      ms: Math.round(verdict?.ms ?? 0),
      base: journal && journal !== "invalid" ? journal.journal.base.revision : null
    });
  }
  if (enforce) {
    // The replayed game is the one kept: what the walker could really have done.
    if (problem || !verdict?.state) violations.push({ code: "journal", message: "The journal could not be replayed." });
    else {
      next = verdict.state;
      violations.push(...verifyState(next, now));
    }
  }
  // The save this one carries on, as the server kept it, and what the server measured since.
  let kept: { state: GameState; pace: Pace | null; elapsedMs: number } | undefined;
  if (existing && previous && sameLineage) {
    // Within a chain of saves (a long journal sent in parts), the time counts from the save
    // the chain began after: the parts together are held as one save would be.
    // A journal that begins at an earlier revision is held to that revision and the time since.
    kept = earlier
      ? { state: earlier.state, pace: earlier.pace, elapsedMs: now - earlier.at }
      : existing.chain
        ? { state: migrateState(existing.chain.state) as GameState, pace: existing.chain.pace, elapsedMs: now - existing.chain.at }
        : { state: previous, pace: existing.pace, elapsedMs: now - existing.updatedAt.getTime() };
    violations.push(...verifyTransition(kept.state, next, kept.elapsedMs));
  } else if (witness) {
    // A guest's game brought to the account: the server kept it, so it is held to its own
    // last save, like any game that carries on.
    kept = { state: migrateState(witness.state) as GameState, pace: witness.pace, elapsedMs: now - witness.updatedAt.getTime() };
    violations.push(...verifySaveVersion(witness.state, body.state));
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
  // A game without a secret yet (begun before the seeds, or without a pending one) gets one
  // now: the page plays its next draws from the window this answer carries.
  const seed = secret ?? newSecret();
  const runtime = verdict?.runtime ?? null;
  const parent = existing && sameLineage ? { revision: existing.revision, state: existing.state as GameState, runtime: existing.runtime, pace: existing.pace, at: existing.updatedAt.getTime() } : null;
  // A part of a longer journal begins a chain, or carries it on; the last part ends it.
  // A journal that began at an earlier revision begins its chain there.
  const chain = body.more && existing && sameLineage
    ? earlier
      ? { state: earlier.state, pace: earlier.pace, at: earlier.at }
      : existing.chain ?? { state: existing.state as GameState, pace: existing.pace, at: existing.updatedAt.getTime() }
    : null;
  const refused = await ledger.write(tx, existing, { state: next, revision, gameCreatedAt: next.createdAt, updatedAt, pace: paced.pace, seed, runtime, parent, chain, ...(sameLineage ? {} : { branch: null }), ...hold }, witness);
  if (refused) return refused;
  if (pendingOwner) await consumePending(tx, pendingOwner);
  if (ledger.who.userId && verdict?.presence) await recordPresence(tx, ledger.who.userId, verdict.presence, now);
  const corrected = enforce && verdict?.outcome === "diverged" && verdict.runtime ? { replay: { state: next, runtime: verdict.runtime } } : {};
  return { status: 200, body: { revision, updatedAt: updatedAt.toISOString(), fates: fateWindow(seed, next.fates), ...corrected } };
}

/**
 * A page opens the stored game: it holds it from now on, unless another page plays it right
 * now and the walker did not ask to take it over (`elsewhere`, nothing changed). The game is
 * answered either way, so the page shows it.
 */
/** What opening a game writes to its row: who holds it, where another page left it, its secret. */
interface Hold {
  holder: string;
  heldAt: Date;
  branch?: Branch;
  seed?: string;
}

async function open<Row extends Stored>(c: Context, load: (tx: Tx) => Promise<Row | undefined>, hold: (tx: Tx, patch: Hold) => Promise<void>) {
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
    const patch: Hold = { holder, heldAt: new Date(now) };
    // Taken from another page: that page builds on this revision, and its journal may still
    // be replayed from here if the walker keeps its game (see `journalBase`).
    if (row.holder !== null && row.holder !== holder) patch.branch = { revision: row.revision, state: row.state as GameState, runtime: row.runtime, pace: row.pace, at: row.updatedAt.getTime() };
    // A game begun before the seeds gets its secret as it opens: the page plays from its window.
    if (!row.seed) patch.seed = newSecret();
    await hold(tx, patch);
    return { row: { ...row, seed: patch.seed ?? row.seed }, elsewhere: false };
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
    return c.json({ save: row ? stored(row, row.seed) : null });
  })

  // The seed of the account's next game (see lib/replays.ts): the same until a save begins it.
  .post("/new", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json(fail("login_required"), 401);
    const wait = openLimiter.consume(user.id);
    if (wait > 0) return tooMany(c, wait);
    const seed = await pendingSeed(accountOwner(user.id));
    return c.json({ createdAt: seed.createdAt, fates: fateWindow(seed.secret, undefined) });
  })

  .post("/open", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json(fail("login_required"), 401);
    const wait = openLimiter.consume(user.id);
    if (wait > 0) return tooMany(c, wait);
    const opened = await open(
      c,
      async (tx) => (await tx.select().from(saves).where(eq(saves.userId, user.id)).for("update").limit(1))[0],
      async (tx, patch) => {
        await tx.update(saves).set(patch).where(eq(saves.userId, user.id));
      }
    );
    if (!opened) return c.json(fail("invalid_request"), 400);
    return c.json({ save: opened.row ? stored(opened.row, opened.row.seed) : null, elsewhere: opened.elsewhere });
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
      kind: "account",
      who: { userId: user.id },
      // A game begun as a guest in this browser and never kept there comes with its seed.
      owners: guest ? [accountOwner(user.id), guestOwner(guest)] : [accountOwner(user.id)],
      conflict: "save_conflict",
      load: async (tx, lock) => {
        const query = tx.select().from(saves).where(eq(saves.userId, user.id));
        return (await (lock ? query.for("update") : query).limit(1))[0];
      },
      // The game this browser played as a guest, when it is the one being saved.
      witness: async (tx, next, lock) => {
        if (!guest) return undefined;
        const query = tx.select().from(guestSaves).where(eq(guestSaves.id, guest));
        const [row] = await (lock ? query.for("update") : query).limit(1);
        return row && row.gameCreatedAt === next.createdAt ? row : undefined;
      },
      oldest: user.createdAt.getTime() - MAX_GUEST_AGE_MS,
      claimed: async (tx, createdAt) => (await tx.select({ userId: saves.userId }).from(saves).where(and(eq(saves.gameCreatedAt, createdAt), ne(saves.userId, user.id))).limit(1)).length > 0,
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
        await snapshotSave(tx, user.id, values.state, values.revision, values.updatedAt.getTime());
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
    return c.json({ save: stored(row, row.seed) });
  })

  // The seed of this browser's next guest game: the same for a cookie until a save begins it.
  // A browser without a cookie gets one now, counted as a new guest game of its address.
  .post("/guest/new", async (c) => {
    const ip = clientIp(c);
    const ipWait = guestOpenIp.consume(ip);
    if (ipWait > 0) return tooMany(c, ipWait);
    let id = guestId(c);
    if (!id) {
      const createWait = consumeNetwork(guestCreateIp, guestCreateNetwork, ip);
      if (createWait > 0) return tooMany(c, createWait);
      const guest = newGuest();
      keepGuest(c, guest.token);
      id = guest.id;
    }
    const seed = await pendingSeed(guestOwner(id));
    return c.json({ createdAt: seed.createdAt, fates: fateWindow(seed.secret, undefined) });
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
      async (tx, patch) => {
        await tx.update(guestSaves).set(patch).where(eq(guestSaves.id, id!));
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
    return c.json({ save: row ? stored(row, row.seed) : null, elsewhere });
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
      kind: "guest",
      who: id ? { guestId: id } : {},
      owners: id ? [guestOwner(id)] : [],
      conflict: "guest_save_conflict",
      load: async (tx, lock) => {
        if (!id) return undefined;
        const query = tx.select().from(guestSaves).where(eq(guestSaves.id, id));
        const [row] = await (lock ? query.for("update") : query).limit(1);
        cookie.lastSeenAt = row?.lastSeenAt ?? null;
        return row;
      },
      witness: async () => undefined,
      oldest: Date.now() - MAX_GUEST_AGE_MS,
      // An account's game is never a guest's to keep, nor to bring to another account.
      claimed: async (tx, createdAt) => (await tx.select({ userId: saves.userId }).from(saves).where(eq(saves.gameCreatedAt, createdAt)).limit(1)).length > 0,
      reject: async (tx, codes) => {
        if (id && rejectionLog.consume(id) === 0) await tx.insert(saveRejections).values({ guestId: id, codes });
      },
      write: async (tx, existing, values) => {
        if (existing && id) {
          await tx.update(guestSaves).set({ ...values, lastSeenAt: values.updatedAt }).where(eq(guestSaves.id, id));
          return null;
        }
        // The game this cookie's pending seed began: its row, under the cookie it already has.
        const allWait = guestCreateAll.consume("all");
        if (allWait > 0) {
          console.warn("[api] guest games: the hourly ceiling is reached, new ones wait");
          return { status: 429, body: fail("too_many_attempts", { retryAfter: allWait }), retryAfter: allWait };
        }
        if (id && (await tx.select({ owner: pendingSeeds.owner }).from(pendingSeeds).where(eq(pendingSeeds.owner, guestOwner(id))).limit(1)).length > 0) {
          await tx.insert(guestSaves).values({ id, ...values, lastSeenAt: values.updatedAt });
          return null;
        }
        // A new guest game (or one whose row is gone): a new row under a new cookie.
        const createWait = consumeNetwork(guestCreateIp, guestCreateNetwork, ip);
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
