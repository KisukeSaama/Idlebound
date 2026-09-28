/**
 * Balance milestones of AGENTS.md: median over several seeds of the time the bot takes to
 * reach stage 10, stage 50, the first ascension and stage 100.
 *
 *   npx tsx packages/game/scripts/milestones.ts [seeds=5] [clicks/s=5]
 */
import { GameEngine } from "../src/engine";
import { formatDuration } from "../src/numbers";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { fileURLToPath } from "node:url";
import { playBot } from "./bot";
import { pool, workerJob } from "./pool";

const seeds = Number(process.argv[2] ?? 5);
const clicksPerSecond = Number(process.argv[3] ?? 5);
const start = Date.UTC(2026, 0, 1);
const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

const LABELS = ["stage 10", "stage 50", "first ascension", "stage 100"] as const;

/** Seconds the bot takes to reach each milestone with seed `seed` (missing when never reached). */
function play(seed: number): Partial<Record<(typeof LABELS)[number], number>> {
  const engine = new GameEngine(createInitialState(start), seededRng(seed * 7919), start);
  const reached: Partial<Record<(typeof LABELS)[number], number>> = {};
  const mark = (label: (typeof LABELS)[number], now: number) => {
    reached[label] ??= (now - start) / 1000;
  };
  playBot(engine, start, 8 * 3600, {
    clicksPerSecond,
    onMilestone: (game, now) => {
      if (game.state.maxStageEver >= 10) mark("stage 10", now);
      if (game.state.maxStageEver >= 50) mark("stage 50", now);
      if (game.state.maxStageEver >= 100) mark("stage 100", now);
    },
    onAscend: (_game, now) => mark("first ascension", now)
  });
  return reached;
}

if (!workerJob(play)) {
  const runs = await pool<number, ReturnType<typeof play>>(fileURLToPath(import.meta.url), Array.from({ length: seeds }, (_, index) => index + 1));
  for (const label of LABELS) {
    const values = runs.flatMap((run) => (run[label] === undefined ? [] : [run[label]]));
    console.log(`${label.padEnd(16)} median ${formatDuration(median(values)).padStart(10)}   (${values.map((value) => formatDuration(value)).join(", ")})`);
  }
}
