/**
 * When the Loom opens: the day Eldra fully remembers the walker (her fifth memory asks for
 * thirty runs and two promises kept) and the day of the first Descent, by promise policy.
 *
 *   npx tsx packages/game/scripts/loom.ts [days=12] [seeds=9] [clicks/s=5] [project]
 *
 * Two walkers: a reasonable one, and the worst case for the Loom's day (every word to Eldra
 * that the rules allow). Each game plays day by day and stops at its first Descent (8
 * threads or more). Prints, per policy, the median day the Loom opens and of the first
 * Descent, the median best stage at days 1, 2, 3 and 7, and the promises kept out of the
 * nights walked. Each game reports every simulated day on stderr.
 *
 * With `project`, nobody descends and every game plays all its days: the script then also
 * prints the day the Loom would open for other thresholds of the fifth tier, read from
 * Eldra's runs night by night (the reasonable walker's second word to her follows the
 * threshold in the code, so a projection is confirmed by a run once the threshold is set).
 */
import { fileURLToPath } from "node:url";
import { DESCENT_HERO, DESCENT_MIN_STAGE } from "../src/data/descent";
import { recognitionRuns } from "../src/data/lore";
import { promisesKept, promisesKeptInAll } from "../src/data/promises";
import { GameEngine, canDescend } from "../src/engine";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { loomPromise, playBot, reasonablePromise, type BotOptions, type PromisePolicy } from "./bot";
import { pool, workerJob } from "./pool";

const days = Number(process.argv[2] ?? 12);
const seeds = Number(process.argv[3] ?? 9);
const clicksPerSecond = Number(process.argv[4] ?? 5);
const start = Date.UTC(2026, 0, 1);
const DAY_MS = 86_400_000;
const project = process.argv[5] === "project";
const CHECKPOINTS = [1, 2, 3, 7].filter((day) => day <= days);
/** Thresholds of the fifth tier the projection reads the Loom's day for. */
const THRESHOLDS = [30, 32, 34, 36, 38, 40, 42, 44];

const POLICIES: { label: string; promises: PromisePolicy }[] = [
  { label: "reasonable (in turn, the Loom first)", promises: reasonablePromise },
  { label: "worst case (Eldra every other night)", promises: loomPromise }
];

interface Played {
  stages: (number | null)[];
  loomDay: number | null;
  descentDay: number | null;
  nights: number;
  kept: number;
  /** Each dusk: its day, Eldra's runs and the promises kept to her, the best stage. */
  dusks: [number, number, number, number][];
}

function play({ policy, seed }: { policy: number; seed: number }): Played {
  const engine = new GameEngine(createInitialState(start), seededRng(seed * 7919), start);
  const s = engine.state;
  const played: Played = { stages: [], loomDay: null, descentDay: null, nights: 0, kept: 0, dusks: [] };
  const options: BotOptions = {
    clicksPerSecond,
    promises: POLICIES[policy].promises,
    descent: project ? undefined : { minThreads: 8, growth: 1 },
    onAscend: (_, now) => {
      if (played.loomDay === null && canDescend(s)) played.loomDay = (now - start) / DAY_MS;
      played.dusks.push([(now - start) / DAY_MS, recognitionRuns(s, DESCENT_HERO), promisesKept(s, DESCENT_HERO), s.maxStageEver]);
    },
    onDescend: (_, now) => {
      played.descentDay ??= (now - start) / DAY_MS;
    }
  };
  let now = start;
  for (let day = 1; day <= days; day += 1) {
    if (played.descentDay === null) {
      now = playBot(engine, now, DAY_MS / 1000, options);
      if (played.descentDay === null) {
        played.nights = s.lifetime.ascensions;
        played.kept = promisesKeptInAll(s);
      }
      console.error(`[${POLICIES[policy].label}, seed ${seed}] day ${day}/${days}: stage ${s.maxStageEver}, ${s.lifetime.ascensions} ascensions, ${promisesKeptInAll(s)} promises kept, ${s.descents} Descents`);
    }
    if (CHECKPOINTS.includes(day)) played.stages.push(played.descentDay === null ? s.maxStageEver : null);
  }
  return played;
}

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const day = (values: (number | null)[]) => {
  const reached = values.filter((value): value is number => value !== null);
  return reached.length === 0 ? "never" : `day ${median(reached).toFixed(1)} (${reached.length}/${values.length})`;
};

if (!workerJob(play)) {
  const jobs = POLICIES.flatMap((_, policy) => Array.from({ length: seeds }, (_, index) => ({ policy, seed: index + 1 })));
  const runs = await pool<{ policy: number; seed: number }, Played>(fileURLToPath(import.meta.url), jobs);
  console.log(`Median of ${seeds} seeds, ${clicksPerSecond} clicks/s, ${days} days at most.`);
  console.log(`${"promises".padEnd(38)}${CHECKPOINTS.map((d) => `d${d}`.padStart(7)).join("")}  ${"Loom opens".padEnd(16)}  ${"first Descent".padEnd(16)}  kept / nights`);
  POLICIES.forEach((policy, index) => {
    const games = runs.filter((_, job) => jobs[job].policy === index);
    const stages = CHECKPOINTS.map((_, checkpoint) => {
      const values = games.map((game) => game.stages[checkpoint]).filter((value): value is number => value !== null);
      return values.length === 0 ? "-" : String(median(values));
    });
    console.log(
      `${policy.label.padEnd(38)}${stages.map((value) => value.padStart(7)).join("")}  ${day(games.map((game) => game.loomDay)).padEnd(16)}  ${day(games.map((game) => game.descentDay)).padEnd(16)}  ${median(games.map((game) => game.kept))} / ${median(games.map((game) => game.nights))}`
    );
  });
  if (project) {
    console.log(`
The Loom's day by threshold of the fifth tier (two promises kept to Eldra, stage ${DESCENT_MIN_STAGE}):`);
    console.log(`${"promises".padEnd(38)}${THRESHOLDS.map((runs) => String(runs).padStart(16)).join("")}`);
    POLICIES.forEach((policy, index) => {
      const games = runs.filter((_, job) => jobs[job].policy === index);
      const opens = THRESHOLDS.map((threshold) => day(games.map((game) => game.dusks.find(([, eldra, kept, stage]) => eldra >= threshold && kept >= 2 && stage >= DESCENT_MIN_STAGE)?.[0] ?? null)));
      console.log(`${policy.label.padEnd(38)}${opens.map((value) => value.padStart(16)).join("")}`);
    });
  }
}
