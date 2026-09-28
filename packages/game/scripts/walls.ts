/**
 * The guardians' walls for a naive walker: time from the first arrival at a boss stage to
 * its fall, median over several seeds. The naive walker buys one level of the newest
 * companion it can afford (never the best value), every talent, uses its powers and clicks.
 *
 *   npx tsx packages/game/scripts/walls.ts [seeds=9] [clicks/s=5]
 */
import { fileURLToPath } from "node:url";
import { HEROES } from "../src/data/heroes";
import { SKILLS } from "../src/data/skills";
import { GameEngine, isSkillUnlocked } from "../src/engine";
import { formatDuration } from "../src/numbers";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { pool, workerJob } from "./pool";

const seeds = Number(process.argv[2] ?? 9);
const clicksPerSecond = Number(process.argv[3] ?? 5);
const WALLS = [10, 20, 30, 40, 50];
const start = Date.UTC(2026, 0, 1);
const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

/** Plays naively until stage 51 (or `limit` seconds); returns the seconds lost at each wall. */
export function naiveWalls(seed: number, limit = 6 * 3600): Record<number, number> {
  const engine = new GameEngine(createInitialState(start), seededRng(seed * 7919), start);
  const s = engine.state;
  const arrived: Record<number, number> = {};
  const lost: Record<number, number> = {};
  let now = start;
  let debt = 0;
  for (let step = 0; now < start + limit * 1000 && s.maxStage <= 50; step += 1) {
    now += 100;
    debt += clicksPerSecond * 0.1;
    while (debt >= 1) {
      debt -= 1;
      engine.click(now);
    }
    engine.tick(now);
    if (s.crystal) engine.clickCrystal(now);
    if (step % 10 === 0) {
      engine.buyAllUpgrades(now);
      for (let guard = 0; guard < 40; guard += 1) {
        const hero = [...HEROES].reverse().find((entry) => {
          if (entry.index > 1 && !s.heroLevels[entry.id] && !s.heroLevels[HEROES[entry.index - 1].id]) return false;
          return engine.heroPurchase(entry.id, 1).cost <= s.gold;
        });
        if (!hero || !engine.buyHero(hero.id, 1, now)) break;
      }
      for (const skill of SKILLS) if (isSkillUnlocked(s, skill.id) && skill.id !== "echo") engine.useSkill(skill.id, now);
      // A naive walker presses "Auto" again now and then after a failed boss.
      if (!s.autoAdvance && step % 600 === 0) engine.toggleAutoAdvance();
    }
    for (const wall of WALLS) {
      if (arrived[wall] === undefined && s.maxStage === wall) arrived[wall] = now;
      if (lost[wall] === undefined && arrived[wall] !== undefined && s.maxStage > wall) lost[wall] = (now - arrived[wall]) / 1000;
    }
  }
  return lost;
}

if (!workerJob((seed: number) => naiveWalls(seed))) {
  const runs = await pool<number, Record<number, number>>(fileURLToPath(import.meta.url), Array.from({ length: seeds }, (_, index) => index + 1));
  const table: Record<number, number[]> = {};
  for (const lost of runs) {
    for (const wall of WALLS) (table[wall] ??= []).push(lost[wall] ?? Infinity);
  }
  for (const wall of WALLS) {
    console.log(`stage ${String(wall).padStart(2)}  median ${formatDuration(median(table[wall])).padStart(9)}  worst ${formatDuration(Math.max(...table[wall])).padStart(9)}`);
  }
}
