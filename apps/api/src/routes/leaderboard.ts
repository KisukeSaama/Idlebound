import { and, count, desc, eq, gt, or, sql as raw } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { Hono } from "hono";
import { db } from "../db/client";
import { leaderboard, users } from "../db/schema";
import { t } from "../lib/i18n";
import { limiter, rateLimitByIp } from "../lib/rate-limit";
import { currentUser } from "../lib/session";

/**
 * Leaderboards by id; the web app localizes their titles. A board ranks by its column, then
 * by its tiebreak (the Night board: Descents, then Depth), then by who got there first.
 */
export const BOARDS: Record<"stage" | "ascensions" | "essences" | "achievements" | "descents", { column: AnyPgColumn; tiebreak?: AnyPgColumn }> = {
  stage: { column: leaderboard.maxStage },
  ascensions: { column: leaderboard.ascensions },
  essences: { column: leaderboard.essences },
  achievements: { column: leaderboard.achievements },
  descents: { column: leaderboard.descents, tiebreak: leaderboard.maxStage }
};

export type BoardId = keyof typeof BOARDS;

interface CachedBoard {
  at: number;
  rows: { rank: number; username: string; value: number; maxStage: number; ascensions: number; achievements: number; descents: number }[];
}

const CACHE_MS = 30_000;
const cache = new Map<string, CachedBoard>();
const readLimiter = limiter(120, 60_000);

async function topRows(board: BoardId, limit: number) {
  const key = `${board}:${limit}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.rows;
  const { column, tiebreak } = BOARDS[board];
  const rows = await db
    .select({
      username: users.username,
      value: column,
      maxStage: leaderboard.maxStage,
      ascensions: leaderboard.ascensions,
      achievements: leaderboard.achievements,
      descents: leaderboard.descents
    })
    .from(leaderboard)
    .innerJoin(users, eq(users.id, leaderboard.userId))
    .where(eq(leaderboard.hidden, false))
    .orderBy(desc(column), ...(tiebreak ? [desc(tiebreak)] : []), leaderboard.updatedAt)
    .limit(limit);
  const ranked = rows.map((row, index) => ({ rank: index + 1, ...row, value: Number(row.value) }));
  cache.set(key, { at: Date.now(), rows: ranked });
  return ranked;
}

let statsCache: { at: number; value: { players: number; bestStage: number } } | null = null;

export const leaderboardRoutes = new Hono()
  .use(rateLimitByIp(readLimiter))
  .get("/", async (c) => {
    const board = (c.req.query("board") ?? "stage") as BoardId;
    // Object.hasOwn: "toString" or "constructor" are not leaderboards.
    if (!Object.hasOwn(BOARDS, board)) return c.json({ error: t(c).unknownBoard }, 400);
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 50) || 50));
    const rows = await topRows(board, limit);

    let me: { rank: number; value: number } | null = null;
    const user = await currentUser(c);
    if (user) {
      const { column, tiebreak } = BOARDS[board];
      const [mine] = await db.select({ value: column, tie: tiebreak ?? column }).from(leaderboard).where(eq(leaderboard.userId, user.id)).limit(1);
      if (mine) {
        // Ranked above: a better value, or the same value and a better tiebreak.
        const ahead = tiebreak ? or(gt(column, mine.value), and(eq(column, mine.value), gt(tiebreak, mine.tie))) : gt(column, mine.value);
        const [above] = await db.select({ total: count() }).from(leaderboard)
          .where(and(eq(leaderboard.hidden, false), ahead));
        me = { rank: Number(above.total) + 1, value: Number(mine.value) };
      }
    }
    c.header("Cache-Control", user ? "private, no-store" : "public, max-age=30");
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
