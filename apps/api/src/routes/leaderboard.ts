import { and, asc, count, desc, eq, gt, lt, ne, not, or, sql as raw, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { Hono } from "hono";
import { db } from "../db/client";
import { leaderboard, users } from "../db/schema";
import { fail } from "../lib/errors";
import { limiter, rateLimitByIp } from "../lib/rate-limit";
import { currentUser } from "../lib/session";

/**
 * The four boards of the Roll; the web app words them. `stage` is the official one: the highest
 * stage reached. The others are all-time tallies with no end (Descents that wove, promises kept,
 * crystals caught): a walker enters them with the first one. Every board breaks its ties by
 * the highest stage, then by who reached it first (`stage_reached_at`, the server's time).
 */
export const BOARDS = {
  stage: leaderboard.maxStage,
  weavings: leaderboard.weavings,
  promises: leaderboard.promises,
  crystals: leaderboard.crystals
} satisfies Record<string, AnyPgColumn>;

export type BoardId = keyof typeof BOARDS;

// Object.hasOwn: "toString" or "constructor" are not leaderboards.
const isBoard = (board: string): board is BoardId => Object.hasOwn(BOARDS, board);

type BoardRow = { rank: number; username: string; value: number; maxStage: number; reachedAt: string };

/** Walkers shown on each side of the logged-in walker. */
const AROUND = 2;

interface CachedBoard {
  at: number;
  /** Shared by every request arriving while the query runs: one query per expiry, not one per visitor. */
  rows: Promise<BoardRow[]>;
}

const CACHE_MS = 30_000;
const cache = new Map<string, CachedBoard>();
const readLimiter = limiter(120, 60_000);

/** A board's order from the best down: its value, then the highest stage, then who got there first. */
const best = (column: AnyPgColumn) => [desc(column), desc(leaderboard.maxStage), asc(leaderboard.stageReachedAt)];
const worst = (column: AnyPgColumn) => [asc(column), asc(leaderboard.maxStage), desc(leaderboard.stageReachedAt)];

/** The rows a board ranks: never a hidden one, and on a tally only those with one at least. */
const ranked = (column: AnyPgColumn) => and(eq(leaderboard.hidden, false), gt(column, 0));

/** A board's rows with their names. */
function named(column: AnyPgColumn) {
  return db
    .select({ username: users.username, value: column, maxStage: leaderboard.maxStage, reachedAt: leaderboard.stageReachedAt, hidden: leaderboard.hidden })
    .from(leaderboard)
    .innerJoin(users, eq(users.id, leaderboard.userId))
    .$dynamic();
}

const toRow = (row: { username: string; value: unknown; maxStage: number; reachedAt: Date }, rank: number): BoardRow =>
  ({ rank, username: row.username, value: Number(row.value), maxStage: row.maxStage, reachedAt: row.reachedAt.toISOString() });

function topRows(board: BoardId, limit: number): Promise<BoardRow[]> {
  const key = `${board}:${limit}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.rows;
  const column = BOARDS[board];
  const rows = named(column)
    .where(ranked(column))
    .orderBy(...best(column))
    .limit(limit)
    .then((found) => found.map((row, index) => toRow(row, index + 1)));
  cache.set(key, { at: Date.now(), rows });
  // A failed query is not cached: the next request retries.
  rows.catch(() => { if (cache.get(key)?.rows === rows) cache.delete(key); });
  return rows;
}

/**
 * The logged-in walker's place on a board (one more than the ranked rows above theirs) and the
 * walkers just ahead and just behind. Nothing on a tally they have none of yet. A hidden walker
 * still sees their place, but nobody around.
 */
async function standing(board: BoardId, userId: string): Promise<{ me: BoardRow; around: BoardRow[] } | null> {
  const column = BOARDS[board];
  const [mine] = await named(column).where(and(eq(leaderboard.userId, userId), gt(column, 0))).limit(1);
  if (!mine) return null;
  const ahead: SQL = or(
    gt(column, mine.value),
    and(eq(column, mine.value), gt(leaderboard.maxStage, mine.maxStage)),
    and(eq(column, mine.value), eq(leaderboard.maxStage, mine.maxStage), lt(leaderboard.stageReachedAt, mine.reachedAt))
  )!;
  const [above] = await db.select({ total: count() }).from(leaderboard).where(and(ranked(column), ahead));
  const me = toRow(mine, Number(above.total) + 1);
  if (mine.hidden) return { me, around: [] };

  const [before, after] = await Promise.all([
    named(column).where(and(ranked(column), ahead)).orderBy(...worst(column)).limit(AROUND),
    named(column).where(and(ranked(column), ne(leaderboard.userId, userId), not(ahead))).orderBy(...best(column)).limit(AROUND)
  ]);
  return {
    me,
    around: [
      ...before.reverse().map((row, index) => toRow(row, me.rank - before.length + index)),
      me,
      ...after.map((row, index) => toRow(row, me.rank + index + 1))
    ]
  };
}

let statsCache: { at: number; value: { players: number; bestStage: number } } | null = null;

export const leaderboardRoutes = new Hono()
  .use(rateLimitByIp(readLimiter))
  .get("/", async (c) => {
    const board = c.req.query("board") ?? "stage";
    if (!isBoard(board)) return c.json(fail("unknown_board"), 400);
    // Whole rows only: "1.5" would reach the query as a fractional LIMIT.
    const limit = Math.min(100, Math.max(1, Math.trunc(Number(c.req.query("limit") ?? 50)) || 50));
    const rows = await topRows(board, limit);

    const user = await currentUser(c);
    const place = user ? await standing(board, user.id) : null;
    // The answer depends on the session cookie: a shared cache must never mix the two.
    c.header("Cache-Control", user ? "private, no-store" : "public, max-age=30");
    c.header("Vary", "Cookie");
    return c.json({ board, rows, me: place?.me ?? null, around: place?.around ?? [] });
  })

  .get("/stats", async (c) => {
    if (!statsCache || Date.now() - statsCache.at > 60_000) {
      const [row] = await db.select({ players: count(), bestStage: raw<number>`coalesce(max(${leaderboard.maxStage}), 0)` }).from(leaderboard);
      statsCache = { at: Date.now(), value: { players: Number(row.players), bestStage: Number(row.bestStage) } };
    }
    c.header("Cache-Control", "public, max-age=60");
    return c.json(statsCache.value);
  });
