// npm run review -w @idlebound/api: the presence scores of the walkers a board ranks, for a
// person to review (see lib/presence.ts). Nothing is hidden without being asked by name.
//
//   review [--board crystals|stage|promises|weavings] [--days 30] [--limit 25]
//   review --hide <username>     takes a walker's line off every board (leaderboard.hidden)
//   review --show <username>     puts it back
//   review --snapshots <username>             the account's daily snapshots (30 days)
//   review --restore <username> --day <date>  puts that day's snapshot back as the account's game
//   review --replays [--days 7]   what the replays found: the share of saves enforce mode
//                                 would keep, correct or refuse, and where games diverge
//
// La Veille (crystals) is reviewed first: it is the board presence weighs on most.
import { usernameKey } from "@idlebound/game";
import { and, desc, eq, gte, inArray } from "drizzle-orm";
import { db, sql } from "./db/client";
import { leaderboard, presenceDays, users } from "./db/schema";
import { presenceScore } from "./lib/presence";
import { replaySummary } from "./lib/replay-review";
import { listSnapshots, restoreSnapshot } from "./lib/snapshots";
import { BOARDS, type BoardId } from "./routes/leaderboard";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const percent = (value: number | null) => (value === null ? "-" : `${Math.round(value * 100)}%`);

async function walker(username: string) {
  const [user] = await db.select({ id: users.id, username: users.username }).from(users).where(eq(users.usernameKey, usernameKey(username))).limit(1);
  if (!user) {
    console.error(`No walker named ${username}.`);
    process.exitCode = 1;
  }
  return user;
}

async function setHidden(username: string, hidden: boolean) {
  const user = await walker(username);
  if (!user) return;
  await db.update(leaderboard).set({ hidden }).where(eq(leaderboard.userId, user.id));
  console.log(`${user.username}: ${hidden ? "hidden from" : "shown on"} the boards.`);
}

async function review() {
  const board = (option("board") ?? "crystals") as BoardId;
  if (!Object.hasOwn(BOARDS, board)) throw new Error(`Unknown board: ${board}`);
  const days = Number(option("days") ?? 30);
  const limit = Number(option("limit") ?? 25);
  const column = BOARDS[board];
  const rows = await db
    .select({ userId: leaderboard.userId, username: users.username, value: column, hidden: leaderboard.hidden })
    .from(leaderboard)
    .innerJoin(users, eq(users.id, leaderboard.userId))
    .orderBy(desc(column))
    .limit(limit);
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  const presence = rows.length === 0 ? [] : await db.select().from(presenceDays).where(and(inArray(presenceDays.userId, rows.map((row) => row.userId)), gte(presenceDays.day, since)));
  console.log(`Board ${board}, presence over ${days} days (score 0 to 100, for review only).`);
  console.table(rows.map((row, index) => {
    const score = presenceScore(presence.filter((day) => day.userId === row.userId));
    return {
      rank: index + 1,
      walker: row.username,
      value: row.value,
      score: score.score,
      "span h": Math.round(score.spanHours * 10) / 10,
      caught: percent(score.catchShare),
      "<300 ms": percent(score.fastShare),
      "prompt powers": percent(score.promptShare),
      ascensions: score.ascensions,
      hidden: row.hidden
    };
  }));
}

async function snapshots(username: string) {
  const user = await walker(username);
  if (!user) return;
  const rows = await listSnapshots(user.id);
  if (rows.length === 0) console.log(`${user.username}: no snapshot kept.`);
  else console.table(rows.map((row) => ({ day: row.day, revision: row.revision, "best stage": row.maxStage, taken: row.createdAt.toISOString() })));
}

async function restore(username: string, day: string | undefined) {
  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    console.error("Name the day to restore: --day YYYY-MM-DD (see --snapshots).");
    process.exitCode = 1;
    return;
  }
  const user = await walker(username);
  if (!user) return;
  const restored = await restoreSnapshot(user.id, day);
  if (!restored) {
    console.error(`${user.username}: no snapshot on ${day}, or no game kept.`);
    process.exitCode = 1;
    return;
  }
  console.log(`${user.username}: the game of ${day} (best stage ${restored.maxStage}) is back as revision ${restored.revision}. Open pages will be asked to choose.`);
}

async function replays() {
  const days = Number(option("days") ?? 7);
  const summary = await replaySummary(days);
  console.log(`Replays over ${days} days: ${summary.total}.`);
  if (summary.total === 0) return;
  console.table(summary.outcomes.map((row) => ({ found: row.outcome, saves: row.count, share: percent(row.share) })));
  console.log(`Enforced, these saves would be kept as sent: ${percent(summary.kept)}, corrected to the replayed game: ${percent(summary.corrected)}, refused: ${percent(summary.refused)}.`);
  if (summary.paths.length > 0) {
    console.log("Where diverging games differ most often (reports, one per game and path):");
    console.table(summary.paths);
  }
}

const hide = option("hide");
const show = option("show");
const listed = option("snapshots");
const restored = option("restore");
const task = hide
  ? setHidden(hide, true)
  : show
    ? setHidden(show, false)
    : listed
      ? snapshots(listed)
      : restored
        ? restore(restored, option("day"))
        : process.argv.includes("--replays")
          ? replays()
          : review();
task
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
