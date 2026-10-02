/** Scratch: per-run share of the fast re-climb and best stage per day, over `days` days. */
import { GameEngine } from "../src/engine";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { playBot } from "./bot";

const seed = Number(process.argv[2] ?? 1);
const days = Number(process.argv[3] ?? 14);
const start = Date.UTC(2026, 0, 1);
const engine = new GameEngine(createInitialState(start), seededRng(seed * 7919), start);
let spawnAt = start, runStart = start, fastUntil: number | null = null;
const runs: [number, number, number, number][] = [];
const orig = engine.tick.bind(engine);
engine.tick = ((t: number) => {
  const r = orig(t);
  for (const e of engine.drainEvents()) {
    if (e.type === "spawn") spawnAt = t;
    if (e.type === "kill" && fastUntil === null && e.monster.kind === "normal" && (t - spawnAt) / 1000 >= 1) fastUntil = t;
  }
  return r;
}) as typeof engine.tick;
const best: number[] = [];
let now = start;
const options = {
  clicksPerSecond: 5,
  descent: { minThreads: 8, growth: 1 },
  onAscend: (_: GameEngine, at: number, _gain: number, from: number) => {
    runs.push([(runStart - start) / 864e5, from, ((fastUntil ?? at) - runStart) / 60000, (at - runStart) / 60000]);
    runStart = at; fastUntil = null;
  }
};
for (let day = 0; day < days; day += 1) {
  now = playBot(engine, now, 86400, options);
  best.push(engine.state.maxStageEver);
}
console.log(JSON.stringify({ seed, best, descents: engine.state.descents, runs }));
