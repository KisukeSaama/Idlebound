/**
 * Balance simulation.
 *
 *   npm run balance -- [hours=12] [clicks/s=5]
 *   npm run balance -- [hours=24] compare [seeds=3]
 *
 * `compare` plays the same game with several profiles (idle, occasional bursts, 2, 5 and
 * 10 clicks/s) over several seeds and prints the median stage each one reaches over time,
 * the click/DPS ratio at the end and the gold of one hour offline against the next hour
 * played the same way (runs that ascend during that hour are left out).
 */
import { GameEngine, offlineGains } from "../src/engine";
import { derive, offlineEfficiency } from "../src/formulas";
import { formatDuration, formatNumber } from "../src/numbers";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { playBot, type BotOptions } from "./bot";

const hours = Number(process.argv[2] ?? 12);
const mode = process.argv[3] ?? "5";
const start = Date.UTC(2026, 0, 1);
const time = (now: number) => formatDuration((now - start) / 1000).padStart(12);
const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

/** Damage of `clicksPerSecond` average clicks (crits included) relative to the active DPS. */
function clickRatio(engine: GameEngine, now: number, clicksPerSecond: number): number {
  const d = derive(engine.state, now, { ignoreTimed: true });
  const activeDps = d.dps / (1 + d.idleBonus * d.idleRatio);
  if (activeDps <= 0) return Number.POSITIVE_INFINITY;
  return (clicksPerSecond * d.click * (1 + d.critChance * (d.critMultiplier - 1))) / activeDps;
}

if (mode === "compare") {
  const seeds = Number(process.argv[4] ?? 3);
  const profiles: { label: string; options: BotOptions }[] = [
    { label: "idle (clicks until stage 20)", options: { clicksPerSecond: 5, idleFromStage: 20 } },
    { label: "bursts (5/s, 10 s every 2 min)", options: { clicksPerSecond: 5, burst: { everySeconds: 120, seconds: 10 } } },
    { label: "2 clicks/s", options: { clicksPerSecond: 2 } },
    { label: "5 clicks/s", options: { clicksPerSecond: 5 } },
    { label: "10 clicks/s", options: { clicksPerSecond: 10 } }
  ];
  const checkpoints = [0.5, 1, 2, 3, 6, 12, 24, 48].filter((h) => h <= hours);
  console.log(`Median of ${seeds} seeds.`);
  console.log(`${"profile".padEnd(30)}${checkpoints.map((h) => `${h} h`.padStart(8)).join("")}  click/DPS  offline/online gold`);
  for (const profile of profiles) {
    const stages: number[][] = checkpoints.map(() => []);
    const ratios: number[] = [];
    const offline: number[] = [];
    for (let seed = 1; seed <= seeds; seed += 1) {
      const engine = new GameEngine(createInitialState(start), seededRng(seed * 7919), start);
      let now = start;
      let elapsed = 0;
      checkpoints.forEach((checkpoint, index) => {
        now = playBot(engine, now, (checkpoint - elapsed) * 3600, profile.options);
        elapsed = checkpoint;
        stages[index].push(engine.state.maxStageEver);
      });
      const cps = profile.options.idleFromStage === undefined ? profile.options.clicksPerSecond : 5;
      ratios.push(clickRatio(engine, now, cps));
      const away = offlineGains(engine.state, 3600, offlineEfficiency(engine.state), now).gold;
      const goldBefore = engine.state.lifetime.goldEarned;
      const ascensionsBefore = engine.state.lifetime.ascensions;
      now = playBot(engine, now, 3600, profile.options);
      const online = engine.state.lifetime.goldEarned - goldBefore;
      if (engine.state.lifetime.ascensions === ascensionsBefore && online > 0) offline.push(away / online);
    }
    const cps = profile.options.idleFromStage === undefined ? profile.options.clicksPerSecond : 5;
    const offlineText = offline.length ? `${(median(offline) * 100).toFixed(0)}%` : "n/a";
    console.log(`${profile.label.padEnd(30)}${stages.map((values) => String(median(values)).padStart(8)).join("")}  ${median(ratios).toFixed(2).padStart(5)} (${cps}/s)  ${offlineText.padStart(6)}`);
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
