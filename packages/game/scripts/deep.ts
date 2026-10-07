/**
 * The deep road (BIBLE 24): how far a walker gets past the Dawn, day by day.
 *
 *   npx tsx packages/game/scripts/deep.ts reach [seeds=9] [days=60]
 *   npx tsx packages/game/scripts/deep.ts deep <profile> <from> [seeds=9] [days=60] [until=10000]
 *
 * `reach` plays the active bot (5 clicks/s around the clock, descending once an Age) from a
 * new game to stage 3000 and keeps the state of each seed as it passes 1000, 2000, 2500,
 * 2800 and 3000. `deep` starts from the `from` state of each seed and plays `days` more (or up
 * to stage `until`) with a profile:
 * - `active`: the same bot;
 * - `idle`: the bot that stops striking from stage 20 of every night, the company alone;
 * - `realistic`: a leading human, three sessions a day (8:00 for an hour, 12:30 for half an
 *   hour, 19:30 for two and a half), striking in bursts (4 a second, 20 s of every minute),
 *   the game closed in between (the catch-up, eight hours at most, and the Reunion);
 * - `realistic-idle`: the same days, never striking.
 * Every day ends with a save the server's checks must accept (`verifyState`, and
 * `verifyTransition` from the day before): a refusal stops the game and is printed. The pace
 * the server measures (`verifyPace`) asks for the saves of a real game, every 30 s: the tests
 * check it on the deep road at a save every quarter hour (`deep.test.ts`). The states are kept as each seed passes 3480 (before the first larger unit), 4000,
 * 5000, 7500, 9950 and 10000 too.
 *
 * Prints, per day, the median best stage and each seed's, then per seed what stopped it.
 * States go to `DEEP_DIR` (the system's temporary folder by default).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALTARS } from "../src/data/altars";
import { WEAVES } from "../src/data/descent";
import { GameEngine } from "../src/engine";
import { bossHp, derive } from "../src/formulas";
import { migrateState } from "../src/migrate";
import { seededRng } from "../src/rng";
import { runBits } from "../src/scale";
import { createInitialState } from "../src/state";
import type { GameState } from "../src/types";
import { verifyState, verifyTransition } from "../src/validation";
import { playBot, type BotOptions } from "./bot";
import { pool, workerJob } from "./pool";

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const start = Date.UTC(2026, 0, 1);
const DIR = process.env.DEEP_DIR ?? join(tmpdir(), "idlebound-deep");
const KEEP_AT = [1000, 2000, 2500, 2800, 3000, 3480, 4000, 5000, 7500, 9950, 10_000];
const descent = { minThreads: 8, growth: 1 };
/** DEEP_FAST=1: the bot weighs its purchases the fast way (`fastPurchases`), for the long runs. */
const fastPurchases = process.env.DEEP_FAST === "1";

export type DeepProfile = "active" | "idle" | "realistic" | "realistic-idle";

const BOT: Record<"active" | "idle", BotOptions> = {
  active: { clicksPerSecond: 5, descent, fastPurchases },
  idle: { clicksPerSecond: 5, idleFromStage: 20, descent, fastPurchases }
};

/** A leading human's sessions: [hour of the day, hours played]. */
const SESSIONS: [at: number, hours: number][] = [[8, 1], [12.5, 0.5], [19.5, 2.5]];

/** One day of a leading human, from `from` (the start of a day) to the start of the next. */
function playHumanDay(engine: GameEngine, from: number, idle: boolean): number {
  const dayStart = from - ((from - start) % DAY_MS);
  const options: BotOptions = idle ? { clicksPerSecond: 4, idleFromStage: 20, descent, fastPurchases } : { clicksPerSecond: 4, burst: { everySeconds: 60, seconds: 20 }, descent, fastPurchases };
  let now = from;
  for (const [at, hours] of SESSIONS) {
    const open = dayStart + at * HOUR_MS;
    if (open < now) continue;
    // The game opens again: the catch-up of the time away, then the walker is back.
    now = open;
    engine.tick(now);
    engine.markInput(now);
    now = playBot(engine, now, hours * 3600, options);
  }
  return dayStart + DAY_MS;
}

export function playDeepDay(engine: GameEngine, now: number, profile: DeepProfile): number {
  if (profile === "realistic" || profile === "realistic-idle") return playHumanDay(engine, now, profile === "realistic-idle");
  return playBot(engine, now, DAY_MS / 1000, BOT[profile]);
}

/** What the walker can no longer raise, and how strong the night is. */
function standing(state: GameState) {
  const cappedAltars = ALTARS.filter((altar) => altar.maxLevel > 0 && (state.altars[altar.id] ?? 0) >= altar.maxLevel).length;
  const cappedWeaves = WEAVES.filter((weave) => weave.maxLevel > 0 && (state.weaves[weave.id] ?? 0) >= weave.maxLevel).length;
  return {
    altars: `${cappedAltars}/${ALTARS.filter((altar) => altar.maxLevel > 0).length}`,
    weaves: `${cappedWeaves}/${WEAVES.filter((weave) => weave.maxLevel > 0).length}`,
    open: ALTARS.filter((altar) => altar.maxLevel === 0).map((altar) => `${altar.id} ${state.altars[altar.id] ?? 0}`).join(", "),
    plenty: state.weaves.plenty ?? 0,
    talents: state.heroUpgrades.length,
    essences: Math.log10(Math.max(1, state.essences)),
    levels: Math.max(0, ...Object.values(state.heroLevels)),
    ascensions: state.lifetime.ascensions,
    descents: state.descents
  };
}

/** The first number that does not hold: a guardian's HP, the company's damage, the gold held. */
function broken(state: GameState, now: number): string | null {
  const bits = runBits(state);
  if (!Number.isFinite(bossHp(state.maxStage + 10, bits) * 1e6)) return "boss HP";
  const d = derive(state, now);
  if (!Number.isFinite(d.dps) || !Number.isFinite(d.click)) return "damage";
  if (!Number.isFinite(state.gold) || !Number.isFinite(state.lifetime.goldEarned)) return "gold";
  if (!Number.isFinite(state.essences) || !Number.isFinite(state.lifetime.essencesEarned)) return "essences";
  return null;
}

interface Job {
  mode: "reach" | "deep";
  profile: DeepProfile;
  seed: number;
  days: number;
  from: number;
  until: number;
}

interface Result {
  stages: number[];
  stop: string | null;
  last: ReturnType<typeof standing>;
}

const file = (profile: string, seed: number, stage: number) => join(DIR, `${profile}-${seed}-${stage}.json`);

function play(job: Job): Result {
  mkdirSync(DIR, { recursive: true });
  let engine: GameEngine;
  let now: number;
  if (job.mode === "reach") {
    now = start;
    engine = new GameEngine(createInitialState(start), seededRng(job.seed * 7919), start);
  } else {
    const kept = JSON.parse(readFileSync(file("active", job.seed, job.from), "utf8")) as { state: GameState; now: number };
    now = kept.now;
    engine = new GameEngine(migrateState(kept.state) as GameState, seededRng(job.seed * 104_729 + job.from), now);
  }
  const s = engine.state;
  const result: Result = { stages: [], stop: null, last: standing(s) };
  const label = `${job.mode} ${job.profile} ${job.seed}`;
  let previous = structuredClone(s);
  let previousAt = now;
  const began = performance.now();
  for (let day = 1; day <= job.days; day += 1) {
    now = playDeepDay(engine, now, job.profile);
    result.stages.push(s.maxStageEver);
    result.last = standing(s);
    // The day's save, as the server would check it.
    const saved = structuredClone(s);
    const refused = [...verifyState(saved, now), ...verifyTransition(previous, saved, now - previousAt)];
    previous = saved;
    previousAt = now;
    console.error(`[${label}] day ${day}: ${s.maxStageEver}, ${s.lifetime.ascensions} nights, ${s.descents} Descents (${((performance.now() - began) / 60_000).toFixed(1)} min)`);
    for (const at of KEEP_AT) {
      const path = file(job.profile, job.seed, at);
      if (at > job.from && s.maxStageEver >= at && !existsSync(path)) writeFileSync(path, JSON.stringify({ state: s, now }));
    }
    if (refused.length > 0) {
      result.stop = `day ${day}, stage ${s.maxStageEver}: refused ${JSON.stringify(refused)}`;
      console.error(`[${label}] ${result.stop}`);
      break;
    }
    const what = broken(s, now);
    if (what) {
      result.stop = `day ${day}, stage ${s.maxStageEver}: ${what} broke`;
      break;
    }
    if (s.maxStageEver >= job.until) {
      result.stop = `day ${day}: stage ${job.until}`;
      break;
    }
  }
  return result;
}

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

if (!workerJob(play)) {
  const mode = process.argv[2] as Job["mode"];
  const deep = mode === "deep";
  const profile = (deep ? process.argv[3] : "active") as DeepProfile;
  const from = deep ? Number(process.argv[4]) : 0;
  const rest = process.argv.slice(deep ? 5 : 3).map(Number);
  const [seeds = 9, days = 60, until = deep ? 10_000 : 3000] = rest;
  // DEEP_SEEDS=9 (or 1,4) plays only those seeds of the `seeds`.
  const only = process.env.DEEP_SEEDS?.split(",").map(Number);
  const jobs: Job[] = Array.from({ length: seeds }, (_, index) => ({ mode, profile, seed: index + 1, days, from, until })).filter((job) => !only || only.includes(job.seed));
  const results = await pool<Job, Result>(fileURLToPath(import.meta.url), jobs);
  writeFileSync(join(DIR, `result-${mode}-${profile}${deep ? `-${from}` : ""}.json`), JSON.stringify(results));
  console.log(`${mode} ${profile}${deep ? ` from ${from}` : ""}, median of ${seeds} seeds`);
  const most = Math.max(...results.map((result) => result.stages.length));
  for (let day = 0; day < most; day += 1) {
    const row = results.map((result) => result.stages[Math.min(day, result.stages.length - 1)]);
    console.log(`day ${String(day + 1).padStart(3)}  ${String(median(row)).padStart(6)}  [${row.join(" ")}]`);
  }
  results.forEach((result, index) => console.log(`seed ${index + 1}: ${result.stop ?? "played every day"}  ${JSON.stringify(result.last)}`));
}
