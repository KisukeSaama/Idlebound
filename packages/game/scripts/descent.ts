/**
 * The Descent measured (BIBLE 12.7): what it costs and what it gives, against the same walker
 * who never descends.
 *
 *   npx tsx packages/game/scripts/descent.ts reach [seeds=9] [stage=2000] [days=21]
 *   npx tsx packages/game/scripts/descent.ts play <from> [days=14] [seeds=9]
 *
 * `reach` plays the active bot (5 clicks/s around the clock) from a new game without ever
 * descending, and keeps the state of each seed as it passes every 250 stages from 1000 on, up
 * to `stage` (or `days`). `play` starts from each seed's state at `from` and plays `days` more
 * twice: once without a Descent, once descending as the bot does (`DESCENT_PLAN`). Prints, per
 * day, the median best stage of both and the stages each gained since `from` (their ratio is
 * what the Descents add), then, per Descent, the median hours of play it took to stand again
 * on the record it left (the stage the walker had reached before it). With `DESCENT_ONLY=1`, the
 * games without a Descent are read back from the last `play` from the same stage (they do not
 * change with the Descent's rules), and only the Descents are played.
 * States go to `DESCENT_DIR` (the system's temporary folder by default).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { GameEngine } from "../src/engine";
import { migrateState } from "../src/migrate";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import type { GameState } from "../src/types";
import { DESCENT_PLAN, playBot, type BotOptions } from "./bot";
import { pool, workerJob } from "./pool";

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const start = Date.UTC(2026, 0, 1);
const DIR = process.env.DESCENT_DIR ?? join(tmpdir(), "idlebound-descent");
const KEEP_EVERY = 250;

interface Job {
  mode: "reach" | "play";
  seed: number;
  /** reach: the deepest state kept; play: the state started from. */
  stage: number;
  days: number;
  descend: boolean;
}

interface Result {
  /** Best stage at the end of each day. */
  stages: number[];
  /** Per Descent: hours of play until the record it left stood again (null: never). */
  regained: (number | null)[];
  descents: number;
}

const file = (seed: number, stage: number) => join(DIR, `walk-${seed}-${stage}.json`);

function play(job: Job): Result {
  mkdirSync(DIR, { recursive: true });
  let engine: GameEngine;
  let now: number;
  if (job.mode === "reach") {
    now = start;
    engine = new GameEngine(createInitialState(start), seededRng(job.seed * 7919), start);
  } else {
    const kept = JSON.parse(readFileSync(file(job.seed, job.stage), "utf8")) as { state: GameState; now: number };
    now = kept.now;
    engine = new GameEngine(migrateState(kept.state) as GameState, seededRng(job.seed * 104_729 + job.stage), now);
  }
  const s = engine.state;
  const result: Result = { stages: [], regained: [], descents: 0 };
  // The record each Descent left, and when: watched hour by hour of play.
  let left: { record: number; at: number; index: number } | null = null;
  const options: BotOptions = {
    clicksPerSecond: 5,
    fastPurchases: true,
    descent: job.descend ? DESCENT_PLAN : undefined,
    onDescend: (_, at) => {
      result.descents += 1;
      result.regained.push(null);
      left = { record: s.maxStageEver, at, index: result.regained.length - 1 };
    },
    onMilestone: (_, at) => {
      if (left && s.maxStage >= left.record) {
        result.regained[left.index] = (at - left.at) / HOUR_MS;
        left = null;
      }
    }
  };
  const label = `${job.mode} ${job.descend ? "descent" : "none"} ${job.seed}`;
  for (let day = 1; day <= job.days; day += 1) {
    now = playBot(engine, now, DAY_MS / 1000, options);
    result.stages.push(s.maxStageEver);
    console.error(`[${label}] day ${day}: ${s.maxStageEver}, ${s.lifetime.ascensions} nights, ${s.descents} Descents`);
    if (job.mode === "reach") {
      for (let at = 1000; at <= job.stage; at += KEEP_EVERY) {
        const path = file(job.seed, at);
        if (s.maxStageEver >= at && !existsSync(path)) writeFileSync(path, JSON.stringify({ state: s, now, day }));
      }
      if (s.maxStageEver >= job.stage) break;
    }
  }
  return result;
}

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

if (!workerJob(play)) {
  const mode = process.argv[2] as Job["mode"];
  const jobs: Job[] = [];
  if (mode === "reach") {
    const [seeds = 9, stage = 2000, days = 21] = process.argv.slice(3).map(Number);
    for (let seed = 1; seed <= seeds; seed += 1) jobs.push({ mode, seed, stage, days, descend: false });
  } else {
    const [from, days = 14, seeds = 9] = process.argv.slice(3).map(Number);
    for (const descend of [false, true]) for (let seed = 1; seed <= seeds; seed += 1) jobs.push({ mode, seed, stage: from, days, descend });
  }
  // The games without a Descent of an earlier `play`, kept by stage, seeds and days.
  const kept = join(DIR, `none-${jobs[0].stage}-${jobs.length / 2}-${jobs[0].days}.json`);
  const reuse = mode === "play" && process.env.DESCENT_ONLY === "1" && existsSync(kept);
  const played = await pool<Job, Result>(fileURLToPath(import.meta.url), reuse ? jobs.filter((job) => job.descend) : jobs);
  const results = reuse ? [...(JSON.parse(readFileSync(kept, "utf8")) as Result[]), ...played] : played;
  if (mode === "play" && !reuse) writeFileSync(kept, JSON.stringify(results.slice(0, results.length / 2)));
  if (mode === "reach") {
    const days = Math.max(...results.map((result) => result.stages.length));
    for (let day = 0; day < days; day += 1) {
      const row = results.map((result) => result.stages[Math.min(day, result.stages.length - 1)]);
      console.log(`day ${String(day + 1).padStart(3)}  ${String(median(row)).padStart(6)}  [${row.join(" ")}]`);
    }
  } else {
    const from = jobs[0].stage;
    const half = results.length / 2;
    const none = results.slice(0, half);
    const down = results.slice(half);
    console.log(`from stage ${from}, median of ${half} seeds: best stage (stages gained) without a Descent, then with`);
    for (let day = 0; day < none[0].stages.length; day += 1) {
      const a = median(none.map((result) => result.stages[day]));
      const b = median(down.map((result) => result.stages[day]));
      const ratio = a > from ? ((b - from) / (a - from)).toFixed(2) : "-";
      console.log(`day ${String(day + 1).padStart(3)}  ${String(a).padStart(6)} (+${a - from})  ${String(b).padStart(6)} (+${b - from})  x${ratio}`);
    }
    const most = Math.max(...down.map((result) => result.regained.length));
    for (let index = 0; index < most; index += 1) {
      const hours = down.map((result) => result.regained[index]).filter((value): value is number => value !== null && value !== undefined);
      const never = down.filter((result) => index < result.regained.length && result.regained[index] === null).length;
      console.log(`Descent ${index + 1}: record regained in ${hours.length ? median(hours).toFixed(1) : "-"} h (median of ${hours.length}), ${never} never`);
    }
    console.log(`Descents in ${none[0].stages.length} days: ${down.map((result) => result.descents).join(" ")}`);
  }
}
