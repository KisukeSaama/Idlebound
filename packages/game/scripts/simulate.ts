/**
 * Balance simulation.
 *
 *   npm run balance -- [hours=12] [clicks/s=5]
 *   npm run balance -- [hours=24] compare
 *
 * `compare` plays the same game with several profiles (idle, 2, 5 and 10 clicks/s) and
 * prints the stage each one reaches over time, so the idle/active gap can be checked.
 */
import { GameEngine } from "../src/engine";
import { derive } from "../src/formulas";
import { formatDuration, formatNumber } from "../src/numbers";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { playBot, type BotOptions } from "./bot";

const hours = Number(process.argv[2] ?? 12);
const mode = process.argv[3] ?? "5";
const start = Date.UTC(2026, 0, 1);
const time = (now: number) => formatDuration((now - start) / 1000).padStart(12);

/** Damage of `clicksPerSecond` average clicks (crits included) relative to the active DPS. */
function clickRatio(engine: GameEngine, now: number, clicksPerSecond: number): number {
  const d = derive(engine.state, now, { ignoreTimed: true });
  const activeDps = d.idle ? d.dps / (1 + d.idleBonus) : d.dps;
  if (activeDps <= 0) return Number.POSITIVE_INFINITY;
  return (clicksPerSecond * d.click * (1 + d.critChance * (d.critMultiplier - 1))) / activeDps;
}

if (mode === "compare") {
  const profiles: { label: string; options: BotOptions }[] = [
    { label: "idle (clicks until stage 20)", options: { clicksPerSecond: 5, idleFromStage: 20 } },
    { label: "2 clicks/s", options: { clicksPerSecond: 2 } },
    { label: "5 clicks/s", options: { clicksPerSecond: 5 } },
    { label: "10 clicks/s", options: { clicksPerSecond: 10 } }
  ];
  const checkpoints = [0.5, 1, 2, 3, 6, 12, 24, 48].filter((h) => h <= hours);
  console.log(`${"profile".padEnd(30)}${checkpoints.map((h) => `${h} h`.padStart(8)).join("")}   ascensions  click/DPS at end`);
  for (const profile of profiles) {
    const engine = new GameEngine(createInitialState(start), seededRng(42), start);
    let now = start;
    const stages: number[] = [];
    let elapsed = 0;
    for (const checkpoint of checkpoints) {
      now = playBot(engine, now, (checkpoint - elapsed) * 3600, profile.options);
      elapsed = checkpoint;
      stages.push(engine.state.maxStageEver);
    }
    const cps = profile.options.idleFromStage === undefined ? profile.options.clicksPerSecond : 5;
    console.log(`${profile.label.padEnd(30)}${stages.map((stage) => String(stage).padStart(8)).join("")}   ${String(engine.state.lifetime.ascensions).padStart(10)}  ${clickRatio(engine, now, cps).toFixed(2).padStart(8)} (${cps}/s)`);
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
