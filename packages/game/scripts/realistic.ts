/**
 * A realistic walker, not a perfect one: what the first days look like for someone who plays
 * a little, by hand, and leaves the tab open the rest of the time. Median over several seeds.
 *
 *   npx tsx packages/game/scripts/realistic.ts [seeds=9] [days=3]
 *
 * The walker strikes 2 times a second while there, and buys naively: one level of the newest
 * companion it can afford, never the best value, and every talent. It presses each power as
 * it comes back, catches the crystals it sees, wears a relic of a rarer kind than the one in
 * its slot. Day one opens on an hour of play, then three sessions of 15 minutes (4, 8 and 12
 * hours in); every later day has four (at 0, 4, 8 and 12 hours). Between sessions the tab
 * stays open out of sight, the autopilot playing (the page wakes once a minute, as a
 * throttled background tab does); 16 hours after the day began the game is closed for the
 * night, and caught up when it opens again.
 *
 * It calls the dusk when the road has stopped paying: the company sent back by a boss (the
 * "Farm" button lit) at the start of a session, or 5 minutes of a session without a new
 * stage once the King is beaten; the first time, as soon as it sees the King fallen (the
 * hint of the first night sends it to the Sanctum). At dusk it gives its word as a reasonable walker would and
 * lets the Sanctum spend its essences as the "Distribute" button does (`buyAltars`).
 */
import { fileURLToPath } from "node:url";
import { HEROES } from "../src/data/heroes";
import { RARITIES } from "../src/data/items";
import { SKILLS } from "../src/data/skills";
import { GameEngine, isSkillUnlocked } from "../src/engine";
import { derive } from "../src/formulas";
import { formatDuration } from "../src/numbers";
import { seededRng } from "../src/rng";
import { createInitialState } from "../src/state";
import { CLICKER_ALTARS, IDLE_ALTARS, buyAltars, pledgeAtDusk, strikesLead } from "./bot";
import { pool, workerJob } from "./pool";

const seeds = Number(process.argv[2] ?? 9);
const days = Number(process.argv[3] ?? 3);
const CLICKS_PER_SECOND = 2;
const start = Date.UTC(2026, 0, 1);
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
/** The game is open this long a day, then closed for the night. */
const AWAKE = 16 * HOUR;
/** Sessions of a day: when they begin and how long they last. */
const sessions = (day: number) => (day === 0 ? [[0, 60], [4 * 60, 15], [8 * 60, 15], [12 * 60, 15]] : [[0, 15], [4 * 60, 15], [8 * 60, 15], [12 * 60, 15]]).map(([at, minutes]) => ({ from: day * DAY + at * MINUTE, minutes }));
/** Without a new stage for this long in a session, past the King, the walker calls the dusk. */
const STALL_MS = 5 * MINUTE;
const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

export interface RealisticRun {
  /** Hours from the start, each milestone (missing: not reached). */
  stage10?: number;
  stage50?: number;
  ascension?: number;
  /** Minutes the walker spent in sessions before the first ascension. */
  ascensionPlayed?: number;
  /** Minutes from the first arrival at the King to his fall. */
  kingWall?: number;
  /** Best stage at the end of the first hour of play. */
  firstHour?: number;
  /** Best stage at the end of each day. */
  daily: number[];
  /** Ascensions at the end of the last day. */
  ascensions: number;
}

export function playRealistic(seed: number, totalDays = days): RealisticRun {
  const engine = new GameEngine(createInitialState(start), seededRng(seed * 7919), start);
  engine.afkAfterMs = MINUTE;
  const s = engine.state;
  const run: RealisticRun = { daily: [], ascensions: 0 };
  let now = start;
  let played = 0;
  let kingFrom: number | undefined;
  let lastNewAt = now;
  let lastMax = 0;
  const hours = (at: number) => (at - start) / HOUR;

  const watch = () => {
    if (s.maxStageEver > lastMax) {
      lastMax = s.maxStageEver;
      lastNewAt = now;
    }
    if (run.stage10 === undefined && s.maxStageEver >= 10) run.stage10 = hours(now);
    if (run.stage50 === undefined && s.maxStageEver >= 50) run.stage50 = hours(now);
    if (kingFrom === undefined && s.maxStageEver >= 50) kingFrom = now;
    if (run.kingWall === undefined && kingFrom !== undefined && s.maxStageEver > 50) run.kingWall = (now - kingFrom) / MINUTE;
  };
  const dusk = () => {
    // The Sanctum weighs the night that ends: did the strikes or the company carry it?
    const led = strikesLead(derive(s, now, { ignoreTimed: true }), CLICKS_PER_SECOND);
    engine.ascend(now);
    run.ascension ??= hours(now);
    run.ascensionPlayed ??= played;
    pledgeAtDusk(engine, now, { clicksPerSecond: CLICKS_PER_SECOND });
    buyAltars(engine, now, led ? CLICKER_ALTARS : IDLE_ALTARS, led);
    lastNewAt = now;
    lastMax = s.maxStageEver;
  };
  /** One look at the game: what a walker does every few seconds while there. */
  const decide = () => {
    engine.buyAllUpgrades(now);
    for (let guard = 0; guard < 40; guard += 1) {
      const hero = [...HEROES].reverse().find((entry) => {
        if (entry.index > 1 && !s.heroLevels[entry.id] && !s.heroLevels[HEROES[entry.index - 1].id]) return false;
        return engine.heroPurchase(entry.id, 1).cost <= s.gold;
      });
      if (!hero || !engine.buyHero(hero.id, 1, now)) break;
    }
    for (const skill of SKILLS) if (isSkillUnlocked(s, skill.id) && skill.id !== "echo") engine.useSkill(skill.id, now);
    for (const item of [...s.inventory]) {
      const worn = s.equipment[item.slot];
      if (!worn || RARITIES.indexOf(item.rarity) > RARITIES.indexOf(worn.rarity)) engine.equip(item.uid, now);
    }
    if (s.satchel.length > 0) engine.openSatchel(now);
  };
  /** A session: the walker strikes, buys and looks, `minutes` long. */
  const session = (minutes: number) => {
    engine.setVisible(true, now);
    engine.markInput(now);
    // Back to a company that stopped before a boss, or to the first King fallen (a hint says
    // the Sanctum is open): a reasonable walker calls the dusk.
    if (engine.canAscend() && (!s.autoAdvance || s.lifetime.ascensions === 0)) dusk();
    const end = now + minutes * MINUTE;
    let debt = 0;
    for (let step = 0; now < end; step += 1) {
      now += 100;
      played += 100 / MINUTE;
      engine.tick(now);
      debt += CLICKS_PER_SECOND * 0.1;
      while (debt >= 1) {
        debt -= 1;
        engine.click(now);
      }
      if (s.crystal) engine.clickCrystal(now);
      if (step % 30 === 0) {
        engine.markInput(now);
        decide();
        // Sent back by a boss, the walker sends the company on again now and then.
        if (!s.autoAdvance && step % 600 === 0) engine.toggleAutoAdvance();
      }
      watch();
      if (engine.canAscend() && (now - lastNewAt > STALL_MS || s.lifetime.ascensions === 0)) dusk();
    }
  };
  /** The tab left open out of sight until `until`: the page wakes once a minute. */
  const away = (until: number) => {
    engine.setVisible(false, now);
    while (now < until) {
      now = Math.min(until, now + MINUTE);
      engine.tick(now);
      watch();
    }
  };

  for (let day = 0; day < totalDays; day += 1) {
    const dayStart = start + day * DAY;
    if (now < dayStart) {
      // The night: the game was closed, and is caught up as it opens.
      now = dayStart;
      engine.tick(now);
      watch();
    }
    for (const { from, minutes } of sessions(day)) {
      away(start + from);
      session(minutes);
      run.firstHour ??= s.maxStageEver;
    }
    away(dayStart + AWAKE);
    run.daily.push(s.maxStageEver);
  }
  run.ascensions = s.lifetime.ascensions;
  return run;
}

if (!workerJob((seed: number) => playRealistic(seed))) {
  const runs = await pool<number, RealisticRun>(fileURLToPath(import.meta.url), Array.from({ length: seeds }, (_, index) => index + 1));
  const line = (label: string, values: (number | undefined)[], show: (value: number) => string) => {
    const known = values.filter((value): value is number => value !== undefined);
    const missing = values.length - known.length;
    const middle = known.length > values.length / 2 ? show(median([...known, ...Array(missing).fill(Infinity)])) : "not reached";
    console.log(`${label.padEnd(22)} median ${middle.padStart(10)}   (${values.map((value) => (value === undefined ? "-" : show(value))).join(", ")})`);
  };
  const clock = (value: number) => formatDuration(value * 3600);
  console.log(`Realistic walker, ${seeds} seeds: ${CLICKS_PER_SECOND} strikes/s, naive purchases, an hour then 15 min sessions, the tab open between them.`);
  line("stage 10", runs.map((run) => run.stage10), clock);
  line("after the first hour", runs.map((run) => run.firstHour), String);
  line("stage 50", runs.map((run) => run.stage50), clock);
  line("King's wall", runs.map((run) => run.kingWall), (value) => formatDuration(value * 60));
  line("first ascension", runs.map((run) => run.ascension), clock);
  line("  of which played", runs.map((run) => run.ascensionPlayed), (value) => formatDuration(value * 60));
  for (let day = 0; day < days; day += 1) line(`stage at end of day ${day + 1}`, runs.map((run) => run.daily[day]), String);
  line("ascensions", runs.map((run) => run.ascensions), String);
}
