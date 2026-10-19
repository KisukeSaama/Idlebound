import type { GameState } from "@idlebound/game";
import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "../db/client";
import { saveSnapshots, saves } from "../db/schema";

const DAY = 86_400_000;
/** Days a snapshot is kept: long enough to notice a lost game and ask for it back. */
export const SNAPSHOT_DAYS = 30;

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** The UTC day of a moment, as Postgres stores a `date`. */
export function snapshotDay(at: number): string {
  return new Date(at).toISOString().slice(0, 10);
}

/**
 * Keeps the account's game as the day's first accepted save left it. Later saves of the same
 * day write nothing: the snapshot is the game from before anything that went wrong that day.
 */
export async function snapshotSave(tx: Tx, userId: string, state: GameState, revision: number, at: number) {
  await tx.insert(saveSnapshots)
    .values({ userId, day: snapshotDay(at), state, revision, maxStage: state.maxStageEver })
    .onConflictDoNothing({ target: [saveSnapshots.userId, saveSnapshots.day] });
}

export async function purgeSnapshots(now = new Date()) {
  await db.delete(saveSnapshots).where(lt(saveSnapshots.day, snapshotDay(now.getTime() - SNAPSHOT_DAYS * DAY)));
}

/** An account's snapshots, newest first, without their games. */
export async function listSnapshots(userId: string) {
  return db
    .select({ day: saveSnapshots.day, revision: saveSnapshots.revision, maxStage: saveSnapshots.maxStage, createdAt: saveSnapshots.createdAt })
    .from(saveSnapshots)
    .where(eq(saveSnapshots.userId, userId))
    .orderBy(desc(saveSnapshots.day));
}

/**
 * Puts a snapshot back as the account's game, as a new revision: every open page builds on an
 * older one and gets the choice between its game and this one, never a silent overwrite. What
 * the server kept around the old revision (the branch, the parent, a chain under way, the page
 * holding it) belongs to the game being replaced and goes with it; the server's own ledger of
 * the game (`pace`) starts again from the restored game's record, as for a save older than it.
 */
export async function restoreSnapshot(userId: string, day: string): Promise<{ revision: number; maxStage: number } | null> {
  return db.transaction(async (tx) => {
    const [snapshot] = await tx.select().from(saveSnapshots).where(and(eq(saveSnapshots.userId, userId), eq(saveSnapshots.day, day))).limit(1);
    if (!snapshot) return null;
    const [row] = await tx.select({ revision: saves.revision }).from(saves).where(eq(saves.userId, userId)).for("update").limit(1);
    if (!row) return null;
    const revision = row.revision + 1;
    await tx.update(saves).set({
      state: snapshot.state,
      revision,
      gameCreatedAt: snapshot.state.createdAt,
      updatedAt: new Date(),
      holder: null,
      heldAt: null,
      pace: null,
      runtime: null,
      branch: null,
      parent: null,
      chain: null
    }).where(eq(saves.userId, userId));
    return { revision, maxStage: snapshot.maxStage };
  });
}
