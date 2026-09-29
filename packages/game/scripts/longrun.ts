/**
 * The long game: how far the bot gets over weeks, with the Descent or without it, and when
 * it reaches the Dawn (stage 3000).
 *
 *   npx tsx packages/game/scripts/longrun.ts [weeks=8] [seeds=9] [clicks/s=5]
 *
 * Each game plays day by day and stops at the Dawn. Prints the median best stage at each
 * checkpoint, the median day of the first Descent, the Descents woven, and how many seeds
 * reached the Dawn (with the median day). Each game reports every simulated day on stderr,
 * with the time that day took to play.
 */
import { fileURLToPath } from "node:url";
import { DAWN_STAGE } from "../src/data/biomes";
import { GameEngine } from "../src/engine";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { playBot, type DescentPlan } from "./bot";
import { pool, workerJob } from "./pool";

const weeks = Number(process.argv[2] ?? 8);
const seeds = Number(process.argv[3] ?? 9);
const clicksPerSecond = Number(process.argv[4] ?? 5);
const start = Date.UTC(2026, 0, 1);
const DAY_MS = 86_400_000;
const days = Math.round(weeks * 7);
const CHECKPOINTS = [1, 2, 3, 7, 14, 21, 28, 42, 56, 84, 112].filter((day) => day <= days);

const PLANS: { label: string; descent?: DescentPlan }[] = [
  { label: "no Descent" },
  { label: "Descent (8+ threads, x1)", descent: { minThreads: 8, growth: 1 } },
  { label: "Descent (4+ threads, x0.5)", descent: { minThreads: 4, growth: 0.5 } }
];

interface Played {
  stages: number[];
  firstDescentDay: number | null;
  descents: number;
  threads: number;
  ascensions: number;
  dawnDay: number | null;
}

function playLong({ plan, seed }: { plan: number; seed: number }): Played {
  const engine = new GameEngine(createInitialState(start), seededRng(seed * 7919), start);
  const s = engine.state;
  const played: Played = { stages: [], firstDescentDay: null, descents: 0, threads: 0, ascensions: 0, dawnDay: null };
  const options = {
    clicksPerSecond,
    descent: PLANS[plan].descent,
    onDescend: (_: GameEngine, now: number) => {
      played.firstDescentDay ??= (now - start) / DAY_MS;
    },
    onMilestone: (_: GameEngine, now: number) => {
      if (played.dawnDay === null && s.maxStageEver >= DAWN_STAGE) played.dawnDay = (now - start) / DAY_MS;
    }
  };
  let now = start;
  const began = performance.now();
  for (let day = 1; day <= days; day += 1) {
    if (played.dawnDay === null) {
      const dayBegan = performance.now();
      now = playBot(engine, now, DAY_MS / 1000, options);
      // Progress on stderr, so a run of hours shows where it stands and how fast it goes.
      const minutes = (ms: number) => (ms / 60_000).toFixed(1);
      console.error(
        `[${PLANS[plan].label}, seed ${seed}] day ${day}/${days}: stage ${s.maxStageEver}, ${s.lifetime.ascensions} ascensions, ${s.descents} Descents` +
          ` (day ${minutes(performance.now() - dayBegan)} min, total ${minutes(performance.now() - began)} min)`
      );
    }
    if (CHECKPOINTS.includes(day)) played.stages.push(s.maxStageEver);
  }
  played.descents = s.descents;
  played.threads = s.lifetime.threads;
  played.ascensions = s.lifetime.ascensions;
  return played;
}

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const day = (value: number | null) => (value === null ? "-" : value.toFixed(1));

if (!workerJob(playLong)) {
  const jobs = PLANS.flatMap((_, plan) => Array.from({ length: seeds }, (_, index) => ({ plan, seed: index + 1 })));
  const runs = await pool<{ plan: number; seed: number }, Played>(fileURLToPath(import.meta.url), jobs);
  console.log(`Median of ${seeds} seeds, ${clicksPerSecond} clicks/s, ${weeks} weeks.`);
  console.log(`${"plan".padEnd(28)}${CHECKPOINTS.map((d) => `d${d}`.padStart(7)).join("")}  1st Descent  Descents  threads  ascensions  Dawn`);
  PLANS.forEach((plan, index) => {
    const games = runs.filter((_, job) => jobs[job].plan === index);
    const stages = CHECKPOINTS.map((_, checkpoint) => median(games.map((game) => game.stages[checkpoint])));
    const descended = games.map((game) => game.firstDescentDay).filter((value): value is number => value !== null);
    const dawns = games.map((game) => game.dawnDay).filter((value): value is number => value !== null);
    const dawn = dawns.length === 0 ? "never" : `${dawns.length}/${games.length}, day ${day(median(dawns))}`;
    console.log(
      `${plan.label.padEnd(28)}${stages.map((value) => String(value).padStart(7)).join("")}  ${`day ${day(descended.length ? median(descended) : null)}`.padStart(11)}  ${String(median(games.map((game) => game.descents))).padStart(8)}  ${String(median(games.map((game) => game.threads))).padStart(7)}  ${String(median(games.map((game) => game.ascensions))).padStart(10)}  ${dawn}`
    );
  });
}
