import { leaderboardSummary, migrateState, safeParseState, verifyState, verifyTransition, type GameState, type Violation } from "@idlebound/game";
import { eq, sql as raw } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db/client";
import { leaderboard, saveRejections, saves } from "../db/schema";
import { t } from "../lib/i18n";
import { limiter, tooMany } from "../lib/rate-limit";
import { currentUser } from "../lib/session";
import { verificationOverdue } from "../lib/verification";

/** At most one cloud save every 10 s per player (the client sends one every 30 s). */
const saveLimiter = limiter(6, 60_000);
/** Replacing the cloud save with another lineage is rare, so it is tightly limited. */
const replaceLimiter = limiter(3, 60 * 60_000);

/** A game played as a guest may predate sign-up by at most 30 days. */
const MAX_GUEST_AGE_MS = 30 * 86_400_000;

const putBody = z.object({
  state: z.unknown(),
  /** Revision the client builds on; null for a first save. */
  baseRevision: z.number().int().nullable(),
  /** Replaces the cloud save with a game from another lineage (explicit player choice). */
  replace: z.boolean().optional()
});

function summary(state: GameState) {
  return {
    maxStage: state.maxStageEver,
    ascensions: state.lifetime.ascensions,
    playTime: Math.floor(state.lifetime.playTime),
    achievements: state.achievements.length,
    savedAt: state.lastTickAt
  };
}

export const saveRoutes = new Hono()
  .get("/", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json({ error: t(c).loginRequired }, 401);
    const [row] = await db.select().from(saves).where(eq(saves.userId, user.id)).limit(1);
    if (!row) return c.json({ save: null });
    return c.json({ save: { state: row.state, revision: row.revision, updatedAt: row.updatedAt.toISOString() } });
  })

  .put("/", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json({ error: t(c).loginRequired }, 401);
    // After the grace period, an unconfirmed address blocks saving (loading still works).
    if (verificationOverdue(user)) return c.json({ error: t(c).emailUnverified, code: "email-unverified" }, 403);
    const wait = saveLimiter.consume(user.id);
    if (wait > 0) return tooMany(c, wait);

    let input: unknown;
    try {
      input = await c.req.json();
    } catch {
      return c.json({ error: t(c).invalidRequest }, 400);
    }
    const parsedBody = putBody.safeParse(input);
    if (!parsedBody.success) return c.json({ error: t(c).invalidRequest }, 400);
    const parsed = safeParseState(parsedBody.data.state);
    if (!parsed.ok) return c.json({ error: t(c).invalidSave(parsed.error) }, 400);
    const next = parsed.state;
    const now = Date.now();
    const { baseRevision, replace } = parsedBody.data;

    const result = await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(saves).where(eq(saves.userId, user.id)).for("update").limit(1);
      // The stored save may predate the current version: compare like with like.
      const previous = existing ? (migrateState(existing.state) as GameState) : undefined;

      // Another revision (another device) or another game (new game): the player must choose
      // explicitly, never a silent overwrite.
      const otherLineage = existing && previous && previous.createdAt !== next.createdAt;
      if (existing && !replace && (baseRevision !== existing.revision || otherLineage)) {
        return { status: 409 as const, body: { error: t(c).saveConflict, conflict: { revision: existing.revision, updatedAt: existing.updatedAt.toISOString(), cloud: summary(previous!) } } };
      }
      if (existing && replace && replaceLimiter.consume(user.id) > 0) {
        return { status: 429 as const, body: { error: t(c).tooManyReplacements } };
      }

      const violations: Violation[] = verifyState(next, now);
      const sameLineage = existing && previous && previous.createdAt === next.createdAt;
      if (existing && previous && sameLineage) {
        violations.push(...verifyTransition(previous, next, now - existing.updatedAt.getTime()));
      } else if (next.createdAt < user.createdAt.getTime() - MAX_GUEST_AGE_MS) {
        // New game (played as a guest before sign-up): its age is bounded, otherwise an
        // invented creation date would grant months of "plausible" play time.
        violations.push({ code: "lineage-age", message: "This game is too old compared to the account." });
      }
      if (violations.length > 0) {
        await tx.insert(saveRejections).values({ userId: user.id, codes: violations.map((violation) => violation.code) });
        return { status: 422 as const, body: { error: t(c).saveRejected, violations } };
      }

      const revision = (existing?.revision ?? 0) + 1;
      await tx.insert(saves)
        .values({ userId: user.id, state: next, revision, gameCreatedAt: next.createdAt, updatedAt: new Date(now) })
        .onConflictDoUpdate({ target: saves.userId, set: { state: next, revision, gameCreatedAt: next.createdAt, updatedAt: new Date(now) } });

      const board = leaderboardSummary(next);
      await tx.insert(leaderboard)
        .values({ userId: user.id, ...board, updatedAt: new Date(now) })
        .onConflictDoUpdate({
          target: leaderboard.userId,
          set: {
            // A replacement may lower a record: keep the best verified one.
            maxStage: raw`greatest(${leaderboard.maxStage}, ${board.maxStage})`,
            ascensions: raw`greatest(${leaderboard.ascensions}, ${board.ascensions})`,
            essences: raw`greatest(${leaderboard.essences}, ${board.essences})`,
            achievements: raw`greatest(${leaderboard.achievements}, ${board.achievements})`,
            playTime: raw`greatest(${leaderboard.playTime}, ${board.playTime})`,
            updatedAt: new Date(now)
          }
        });
      return { status: 200 as const, body: { revision, updatedAt: new Date(now).toISOString() } };
    });

    return c.json(result.body, result.status);
  });
