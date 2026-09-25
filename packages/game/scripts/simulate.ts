/**
 * Balance simulation.
 *
 *   npm run balance -- [hours=12] [clicks/s=5]
 */
import { GameEngine } from "../src/engine";
import { formatDuration, formatNumber } from "../src/numbers";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { playBot } from "./bot";

const hours = Number(process.argv[2] ?? 12);
const clicksPerSecond = Number(process.argv[3] ?? 5);
const start = Date.UTC(2026, 0, 1);
const engine = new GameEngine(createInitialState(start), seededRng(42), start);
const milestones = new Set([10, 25, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 750, 1000]);
const time = (now: number) => formatDuration((now - start) / 1000).padStart(12);

playBot(engine, start, hours * 3600, {
  clicksPerSecond,
  onMilestone: (game, now) => {
    const s = game.state;
    if (!milestones.has(s.maxStageEver) || s.maxStage !== s.maxStageEver) return;
    milestones.delete(s.maxStageEver);
    console.log(`${time(now)}  stage ${String(s.maxStageEver).padStart(4)}  DPS ${formatNumber(game.derived.dps).padStart(8)}  click ${formatNumber(game.derived.click).padStart(8)}  ascensions ${s.lifetime.ascensions}`);
  },
  onAscend: (game, now, gain, from) => {
    console.log(`${time(now)}  ascension from ${from} → +${formatNumber(gain)} essences (total ${formatNumber(game.state.lifetime.essencesEarned)})`);
  }
});

const s = engine.state;
console.log(`\nDone after ${hours} h: max stage ${s.maxStageEver}, ${s.lifetime.ascensions} ascensions, ${formatNumber(s.lifetime.essencesEarned)} essences, ${s.achievements.length} achievements, ${s.lifetime.itemsFound} items.`);
