// npm run review -w @idlebound/api: the presence scores of the walkers a board ranks, for a
// person to review (see lib/presence.ts). Nothing is hidden without being asked by name.
//
//   review [--board crystals|stage|promises|weavings] [--days 30] [--limit 25]
//   review --hide <username>     takes a walker's line off every board (leaderboard.hidden)
//   review --show <username>     puts it back
//
// La Veille (crystals) is reviewed first: it is the board presence weighs on most.
import { usernameKey } from "@idlebound/game";
import { and, desc, eq, gte, inArray } from "drizzle-orm";
import { db, sql } from "./db/client";
import { leaderboard, presenceDays, users } from "./db/schema";
import { presenceScore } from "./lib/presence";
import { BOARDS, type BoardId } from "./routes/leaderboard";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const percent = (value: number | null) => (value === null ? "-" : `${Math.round(value * 100)}%`);

async function setHidden(username: string, hidden: boolean) {
  const [user] = await db.select({ id: users.id, username: users.username }).from(users).where(eq(users.usernameKey, usernameKey(username))).limit(1);
  if (!user) {
    console.error(`No walker named ${username}.`);
    process.exitCode = 1;
    return;
  }
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

const hide = option("hide");
const show = option("show");
const task = hide ? setHidden(hide, true) : show ? setHidden(show, false) : review();
task
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
