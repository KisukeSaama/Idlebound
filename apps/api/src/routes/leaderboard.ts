import { and, count, desc, eq, gt, gte, lt, or, sql as raw, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { Hono } from "hono";
import { db } from "../db/client";
import { leaderboard, stageHistory, users } from "../db/schema";
import { fail } from "../lib/errors";
import { limiter, rateLimitByIp } from "../lib/rate-limit";
import { currentUser } from "../lib/session";
import { strideStart } from "../lib/stride";

interface ColumnBoard {
  column: AnyPgColumn;
  /** Second key, higher first (the Night board: Descents, then Depth). */
  tiebreak?: AnyPgColumn;
  /** Last key, earlier first: who got there first. */
  first: AnyPgColumn;
}

/**
 * Leaderboards by id; the web app localizes their titles. A board ranks by its column, then
 * by its tiebreak, then by who got there first. Depth and Night count from the save that
 * raised the best stage (`stage_reached_at`), so equal stages keep the order they were reached in.
 */
export const BOARDS: Record<"stage" | "ascensions" | "essences" | "achievements" | "descents", ColumnBoard> = {
  stage: { column: leaderboard.maxStage, first: leaderboard.stageReachedAt },
  ascensions: { column: leaderboard.ascensions, first: leaderboard.updatedAt },
  essences: { column: leaderboard.essences, first: leaderboard.updatedAt },
  achievements: { column: leaderboard.achievements, first: leaderboard.updatedAt },
  descents: { column: leaderboard.descents, tiebreak: leaderboard.maxStage, first: leaderboard.stageReachedAt }
};

/** Every board: the column boards, and the Stride (stages gained over the last 7 days). */
export type BoardId = keyof typeof BOARDS | "week";

const isBoard = (board: string): board is BoardId => board === "week" || Object.hasOwn(BOARDS, board);

type BoardRow = { rank: number; username: string; value: number; maxStage: number; ascensions: number; achievements: number; descents: number };

interface CachedBoard {
  at: number;
  /** Shared by every request arriving while the query runs: one query per expiry, not one per visitor. */
  rows: Promise<BoardRow[]>;
}

const CACHE_MS = 30_000;
const cache = new Map<string, CachedBoard>();
const readLimiter = limiter(120, 60_000);

function topRows(board: BoardId, limit: number): Promise<BoardRow[]> {
  const key = `${board}:${limit}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.rows;
  const rows = queryTopRows(board, limit);
  cache.set(key, { at: Date.now(), rows });
  // A failed query is not cached: the next request retries.
  rows.catch(() => { if (cache.get(key)?.rows === rows) cache.delete(key); });
  return rows;
}

/**
 * The Stride: each account with a save in the last 7 days, and the best stage it had when its
 * first day of the window began (the earliest row, as the best stage never goes down).
 */
function strideStarts(now: Date) {
  return db
    .select({ userId: stageHistory.userId, strideStart: raw<number>`min(${stageHistory.maxStage})`.as("stride_start") })
    .from(stageHistory)
    .where(gte(stageHistory.day, strideStart(now)))
    .groupBy(stageHistory.userId)
    .as("stride");
}

/** What a board ranks by, from the highest value to the lowest: the value, then its tiebreaks. */
function boardOrder(board: BoardId, now: Date) {
  if (board === "week") {
    const starts = strideStarts(now);
    const value: SQL<number> = raw<number>`${leaderboard.maxStage} - ${starts.strideStart}`;
    // Only walkers who went deeper this week: a still week is not a place on this board.
    return { value, tiebreak: undefined, first: leaderboard.stageReachedAt, starts, ranked: gt(value, 0) };
  }
  const { column, tiebreak, first } = BOARDS[board];
  return { value: raw<number>`${column}`, tiebreak, first, starts: undefined, ranked: undefined };
}

async function queryTopRows(board: BoardId, limit: number): Promise<BoardRow[]> {
  const { value, tiebreak, first, starts, ranked } = boardOrder(board, new Date());
  const base = db
    .select({
      username: users.username,
      value,
      maxStage: leaderboard.maxStage,
      ascensions: leaderboard.ascensions,
      achievements: leaderboard.achievements,
      descents: leaderboard.descents
    })
    .from(leaderboard)
    .innerJoin(users, eq(users.id, leaderboard.userId))
    .$dynamic();
  const joined = starts ? base.innerJoin(starts, eq(starts.userId, leaderboard.userId)) : base;
  const rows = await joined
    .where(and(eq(leaderboard.hidden, false), ranked))
    .orderBy(desc(value), ...(tiebreak ? [desc(tiebreak)] : []), first)
    .limit(limit);
  return rows.map((row, index) => ({ rank: index + 1, ...row, value: Number(row.value) }));
}

/** The logged-in walker's place: one more than the visible rows ranked above theirs. */
async function rankOf(board: BoardId, userId: string): Promise<{ rank: number; value: number } | null> {
  const { value, tiebreak, first, starts, ranked } = boardOrder(board, new Date());
  const mineQuery = db.select({ value, tie: tiebreak ?? value, first }).from(leaderboard).$dynamic();
  const [mine] = await (starts ? mineQuery.innerJoin(starts, eq(starts.userId, leaderboard.userId)) : mineQuery)
    .where(and(eq(leaderboard.userId, userId), ranked))
    .limit(1);
  if (!mine) return null;
  // Ranked above: a better value, or the same value and a better tiebreak, or all equal and
  // there first.
  const there = lt(first, mine.first);
  const tied = tiebreak ? or(gt(tiebreak, mine.tie), and(eq(tiebreak, mine.tie), there)) : there;
  const ahead = or(gt(value, mine.value), and(eq(value, mine.value), tied));
  const aboveQuery = db.select({ total: count() }).from(leaderboard).$dynamic();
  const [above] = await (starts ? aboveQuery.innerJoin(starts, eq(starts.userId, leaderboard.userId)) : aboveQuery)
    .where(and(eq(leaderboard.hidden, false), ranked, ahead));
  return { rank: Number(above.total) + 1, value: Number(mine.value) };
}

let statsCache: { at: number; value: { players: number; bestStage: number } } | null = null;

export const leaderboardRoutes = new Hono()
  .use(rateLimitByIp(readLimiter))
  .get("/", async (c) => {
    const board = c.req.query("board") ?? "stage";
    // Object.hasOwn: "toString" or "constructor" are not leaderboards.
    if (!isBoard(board)) return c.json(fail("unknown_board"), 400);
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 50) || 50));
    const rows = await topRows(board, limit);

    const user = await currentUser(c);
    const me = user ? await rankOf(board, user.id) : null;
    // The answer depends on the session cookie: a shared cache must never mix the two.
    c.header("Cache-Control", user ? "private, no-store" : "public, max-age=30");
    c.header("Vary", "Cookie");
    return c.json({ board, rows, me });
  })

  .get("/stats", async (c) => {
    if (!statsCache || Date.now() - statsCache.at > 60_000) {
      const [row] = await db.select({ players: count(), bestStage: raw<number>`coalesce(max(${leaderboard.maxStage}), 0)` }).from(leaderboard);
      statsCache = { at: Date.now(), value: { players: Number(row.players), bestStage: Number(row.bestStage) } };
    }
    c.header("Cache-Control", "public, max-age=60");
    return c.json(statsCache.value);
  });
