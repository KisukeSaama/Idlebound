/**
 * Balance simulation.
 *
 *   npm run balance -- [hours=12] [clicks/s=5]
 *   npm run balance -- [hours=24] compare [seeds=3]
 *
 * `compare` plays the same game with several profiles (an occasional player back every hour,
 * idle, occasional bursts, 2, 5 and 10 clicks/s) over several seeds and prints the median stage each one reaches over time,
 * the click/DPS ratio at the end, the stages a night away (8 h offline, auto-advance on,
 * offline spending on) adds to the final state, and the stages of the first hour back, with
 * the Reunion and without it.
 */
import { GameEngine } from "../src/engine";
import { derive } from "../src/formulas";
import { formatDuration, formatNumber } from "../src/numbers";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { fileURLToPath } from "node:url";
import { IDLE_ALTARS, buyAltars, playBot, type BotOptions } from "./bot";
import { pool, workerJob } from "./pool";

const hours = Number(process.argv[2] ?? 12);
const mode = process.argv[3] ?? "5";
const start = Date.UTC(2026, 0, 1);
const time = (now: number) => formatDuration((now - start) / 1000).padStart(12);
const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

/** Damage of `clicksPerSecond` average clicks (crits included) relative to companion DPS without the Patience bonus. */
function clickRatio(engine: GameEngine, now: number, clicksPerSecond: number): number {
  const d = derive(engine.state, now, { ignoreTimed: true });
  const activeDps = d.dps - d.patienceDps;
  if (activeDps <= 0) return Number.POSITIVE_INFINITY;
  return (clicksPerSecond * d.click * (1 + d.critChance * (d.critMultiplier - 1))) / activeDps;
}

const HOUR_MS = 3_600_000;
/** The occasional player plays this long at the top of every hour, in bursts. */
const VISIT_MS = 10 * 60_000;
const BURSTS: BotOptions = { clicksPerSecond: 5, burst: { everySeconds: 120, seconds: 10 } };

/**
 * An occasional player: back at the top of every hour (the Reunion), ascends when the company
 * is blocked by a boss (the "Farm" button), plays 10 minutes in bursts, then leaves the tab
 * open to the autopilot.
 */
function playOccasional(engine: GameEngine, from: number, seconds: number): number {
  const s = engine.state;
  engine.afkAfterMs = 60_000;
  let now = from;
  const end = from + seconds * 1000;
  while (now < end) {
    const phase = (now - start) % HOUR_MS;
    if (phase === 0) {
      if (engine.canAscend() && !s.autoAdvance) {
        engine.ascend(now);
        buyAltars(engine, now, IDLE_ALTARS, false);
      }
      engine.markInput(now);
    }
    if (phase < VISIT_MS) {
      now = playBot(engine, now, Math.min(VISIT_MS - phase, end - now) / 1000, BURSTS);
    } else {
      const until = Math.min(end, now - phase + HOUR_MS);
      while (now < until) {
        now = Math.min(until, now + 200);
        engine.tick(now);
      }
    }
  }
  return now;
}

const PROFILES: { label: string; options: BotOptions; occasional?: boolean }[] = [
  { label: "occasional (10 min an hour)", options: BURSTS, occasional: true },
  { label: "idle (clicks until stage 20)", options: { clicksPerSecond: 5, idleFromStage: 20 } },
  { label: "bursts (5/s, 10 s every 2 min)", options: { clicksPerSecond: 5, burst: { everySeconds: 120, seconds: 10 } } },
  { label: "2 clicks/s", options: { clicksPerSecond: 2 } },
  { label: "5 clicks/s", options: { clicksPerSecond: 5 } },
  { label: "10 clicks/s", options: { clicksPerSecond: 10 } }
];
const CHECKPOINTS = [0.5, 1, 2, 3, 6, 12, 24, 48].filter((h) => h <= hours);

interface Played {
  stages: number[];
  ratio: number;
  offline: number;
  back: number;
  tired: number;
}

/** One profile, one seed: the stage at each checkpoint, then the night and the hour back. */
function playProfile({ profile: index, seed }: { profile: number; seed: number }): Played {
  const profile = PROFILES[index];
  const engine = new GameEngine(createInitialState(start), seededRng(seed * 7919), start);
  const stages: number[] = [];
  let now = start;
  let elapsed = 0;
  for (const checkpoint of CHECKPOINTS) {
    const seconds = (checkpoint - elapsed) * 3600;
    now = profile.occasional ? playOccasional(engine, now, seconds) : playBot(engine, now, seconds, profile.options);
    elapsed = checkpoint;
    stages.push(engine.state.maxStageEver);
  }
  const cps = profile.options.idleFromStage === undefined ? profile.options.clicksPerSecond : 5;
  const played: Played = { stages, ratio: clickRatio(engine, now, cps), offline: 0, back: 0, tired: 0 };
  // The night, then the first hour back (no ascension inside it), with and without the Reunion.
  const later = now + 8 * 3600_000;
  const hour = { ...profile.options, stagnationMs: Number.POSITIVE_INFINITY };
  for (const reunion of [true, false]) {
    const away = new GameEngine(structuredClone(engine.state), seededRng(seed), now);
    away.state.autoAdvance = true;
    const night = away.tick(later)?.stages ?? 0;
    away.markInput(later);
    if (reunion) played.offline = night;
    else away.state.buffs = away.state.buffs.filter((buff) => buff.id !== "reunion");
    const returned = away.state.maxStage;
    playBot(away, later, 3600, hour);
    played[reunion ? "back" : "tired"] = away.state.maxStage - returned;
  }
  return played;
}

if (mode === "compare") {
  if (!workerJob(playProfile)) {
    const seeds = Number(process.argv[4] ?? 3);
    const jobs = PROFILES.flatMap((_, profile) => Array.from({ length: seeds }, (_, index) => ({ profile, seed: index + 1 })));
    const runs = await pool<{ profile: number; seed: number }, Played>(fileURLToPath(import.meta.url), jobs);
    console.log(`Median of ${seeds} seeds.`);
    console.log(`${"profile".padEnd(30)}${CHECKPOINTS.map((h) => `${h} h`.padStart(8)).join("")}  click/DPS  8 h away  hour back  (no Reunion)`);
    PROFILES.forEach((profile, index) => {
      const games = runs.filter((_, job) => jobs[job].profile === index);
      const cps = profile.options.idleFromStage === undefined ? profile.options.clicksPerSecond : 5;
      const stages = CHECKPOINTS.map((_, checkpoint) => median(games.map((game) => game.stages[checkpoint])));
      const pick = (key: "ratio" | "offline" | "back" | "tired") => median(games.map((game) => game[key] ?? Number.POSITIVE_INFINITY));
      console.log(`${profile.label.padEnd(30)}${stages.map((value) => String(value).padStart(8)).join("")}  ${pick("ratio").toFixed(2).padStart(5)} (${cps}/s)  ${`+${pick("offline")}`.padStart(6)}  ${`+${pick("back")}`.padStart(9)}  ${`(+${pick("tired")})`.padStart(11)}`);
    });
  }
} else {
  const clicksPerSecond = Number(mode);
  const engine = new GameEngine(createInitialState(start), seededRng(42), start);
  const milestones = new Set([10, 25, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 750, 1000]);
  playBot(engine, start, hours * 3600, {
    clicksPerSecond,
    onMilestone: (game, now) => {
      const s = game.state;
      if (!milestones.has(s.maxStageEver) || s.maxStage !== s.maxStageEver) return;
      milestones.delete(s.maxStageEver);
      const ratio = clickRatio(game, now, clicksPerSecond);
      console.log(`${time(now)}  stage ${String(s.maxStageEver).padStart(4)}  DPS ${formatNumber(game.derived.dps).padStart(8)}  click ${formatNumber(game.derived.click).padStart(8)}  clicks/DPS ${ratio.toFixed(2).padStart(6)}  ascensions ${s.lifetime.ascensions}`);
    },
    onAscend: (game, now, gain, from) => {
      console.log(`${time(now)}  ascension from ${from} → +${formatNumber(gain)} essences (total ${formatNumber(game.state.lifetime.essencesEarned)})`);
    }
  });

  const s = engine.state;
  console.log(`\nDone after ${hours} h: max stage ${s.maxStageEver}, ${s.lifetime.ascensions} ascensions, ${formatNumber(s.lifetime.essencesEarned)} essences, ${s.achievements.length} achievements, ${s.lifetime.itemsFound} items.`);
}
