/** A "reasonable" automatic player, shared by the balance simulation and the tests. */
import { ALTAR_BY_ID, altarCost } from "../src/data/altars";
import { WEAVES, weaveCost } from "../src/data/descent";
import { HEROES } from "../src/data/heroes";
import { relicDensity } from "../src/data/items";
import { SKILLS } from "../src/data/skills";
import { GameEngine, canDescend, descentPreview, isSkillUnlocked } from "../src/engine";
import { ESSENCE_DPS_BONUS, derive, heroCost, heroCostMultiplier, strikeFillShare } from "../src/formulas";
import type { AltarId, Derived, GameState, Item } from "../src/types";

export interface BotOptions {
  clicksPerSecond: number;
  /** Stop attack clicks from this stage of each run on (idle player); powers and crystals stay. */
  idleFromStage?: number;
  /** Occasional player: clicks only `seconds` out of every `everySeconds`. */
  burst?: { everySeconds: number; seconds: number };
  /** Ascend after this long without a new stage. */
  stagnationMs?: number;
  onMilestone?: (engine: GameEngine, now: number) => void;
  onAscend?: (engine: GameEngine, now: number, gain: number, from: number) => void;
  /** Altar plan after each ascension (default: by play style, see `buyAltars`). */
  altars?: AltarPlan;
  /** Descend right after an ascension when this plan allows it (never without one). */
  descent?: DescentPlan;
  onDescend?: (engine: GameEngine, now: number, threads: number) => void;
}

/**
 * When the bot descends: once the Descent would weave at least `minThreads`, and at least
 * `growth` times the threads woven so far (a second Descent must be worth the climb back).
 */
export interface DescentPlan {
  minThreads: number;
  growth: number;
}

export interface AltarPlan {
  /** Capped altars bought whenever cheap. */
  milestones: AltarId[];
}

export const CLICKER_ALTARS: AltarPlan = {
  milestones: ["time", "bargain", "memory", "treasure", "wanderer", "fate", "precision", "echoes"]
};
export const IDLE_ALTARS: AltarPlan = {
  milestones: ["time", "bargain", "memory", "treasure", "wanderer", "echoes"]
};

type Weights = Partial<Record<AltarId, number>>;
/**
 * Open-ended altars, weighted by how much of their effect reaches the walker: the Blade when
 * the strikes lead (they deal more than the Patience bonus they stand in for), Patience when
 * the company does.
 */
const STRIKE_WEIGHTS: Weights = { might: 1, blade: 0.9, fortune: 0.7 };
const COMPANY_WEIGHTS: Weights = { might: 1, patience: 0.9, fortune: 0.7 };

/** Whether the walker's strikes, at this pace, deal more than the Patience bonus they stand in for. */
export function strikesLead(state: GameState, d: Derived, clicksPerSecond: number): boolean {
  const strikes = clicksPerSecond * d.click * (1 + d.critChance * (d.critMultiplier - 1));
  return strikes * strikeFillShare(state) > d.patienceDps;
}

/**
 * Damage a second of the company with a walker striking `clicksPerSecond` times a second
 * (crits averaged): the strikes take the place of the Patience bonus, and add past it.
 */
export function damageRate(state: GameState, d: Derived, clicksPerSecond: number): number {
  const strikes = clicksPerSecond * d.click * (1 + d.critChance * (d.critMultiplier - 1));
  return d.dps - d.patienceDps + Math.max(0, d.patienceDps - strikes * strikeFillShare(state)) + strikes;
}

/** Average strikes a second of a play style over a whole run. */
export function averageClicks(options: BotOptions): number {
  if (options.idleFromStage !== undefined) return 0;
  return options.burst ? (options.clicksPerSecond * options.burst.seconds) / options.burst.everySeconds : options.clicksPerSecond;
}

const DT = 0.1;

/** What a relic is worth to the bot: its main stat, times its density. */
function relicWorth(item: Item): number {
  return (1 + item.affixes[0].value) * relicDensity(item);
}

function bestHeroPurchase(engine: GameEngine, now: number, clicksPerSecond: number) {
  const s = engine.state;
  const multiplier = heroCostMultiplier(s);
  let best: { id: string; ratio: number } | null = null;
  const base = damageRate(s, derive(s, now, { ignoreTimed: true }), clicksPerSecond);
  for (const hero of HEROES) {
    const level = s.heroLevels[hero.id] ?? 0;
    if (hero.index > 1 && level === 0 && (s.heroLevels[HEROES[hero.index - 1].id] ?? 0) === 0) continue;
    const cost = heroCost(hero, level, 1, multiplier);
    if (cost > s.gold) continue;
    s.heroLevels[hero.id] = level + 1;
    const after = damageRate(s, derive(s, now, { ignoreTimed: true }), clicksPerSecond);
    s.heroLevels[hero.id] = level;
    const gain = after - base;
    const ratio = gain / cost;
    if (!best || ratio > best.ratio) best = { id: hero.id, ratio };
  }
  return best;
}

/** Plays `seconds` seconds from `start`; returns the new time. */
export function playBot(engine: GameEngine, start: number, seconds: number, options: BotOptions): number {
  const s = engine.state;
  const stagnation = options.stagnationMs ?? 15 * 60_000;
  let now = start;
  let lastProgressAt = now;
  let lastMaxStage = s.maxStage;
  let clickDebt = 0;
  let step = 0;
  const endAt = start + seconds * 1000;

  while (now < endAt) {
    now += DT * 1000;
    step += 1;
    const inBurst = !options.burst || ((now - start) / 1000) % options.burst.everySeconds < options.burst.seconds;
    const clicking = inBurst && (options.idleFromStage === undefined || s.maxStage < options.idleFromStage);
    const clicksPerSecond = clicking ? options.clicksPerSecond : 0;
    clickDebt += clicksPerSecond * DT;
    while (clickDebt >= 1) {
      clickDebt -= 1;
      engine.click(now);
    }
    engine.tick(now);
    if (s.crystal) engine.clickCrystal(now);

    if (step % 5 === 0) {
      engine.buyAllUpgrades(now);
      for (let guard = 0; guard < 50; guard += 1) {
        const best = bestHeroPurchase(engine, now, clicksPerSecond);
        if (!best) break;
        engine.buyHero(best.id, 1, now);
      }
      for (const skill of SKILLS) if (isSkillUnlocked(s, skill.id) && skill.id !== "echo") engine.useSkill(skill.id, now);
      if (!s.autoAdvance && (now - lastProgressAt) % 120_000 < DT * 1000 * 5) engine.toggleAutoAdvance();
      if (s.shards >= 30 && s.inventory.length < 40) engine.buyOffer("chest", now);
      for (const item of [...s.inventory]) {
        const equipped = s.equipment[item.slot];
        // Morgrath's Phylactery halves the click: only a walker who lets go of the sword wears it.
        if (item.named === "phylactery" && clicksPerSecond > 0 && options.idleFromStage === undefined) continue;
        if (equipped?.named === "phylactery" && clicksPerSecond > 0 && options.idleFromStage === undefined) { engine.equip(item.uid, now); continue; }
        if (!equipped || relicWorth(item) > relicWorth(equipped)) engine.equip(item.uid, now);
      }
      engine.salvageUpTo("rare");
    }

    if (s.maxStage > lastMaxStage) {
      lastMaxStage = s.maxStage;
      lastProgressAt = now;
      options.onMilestone?.(engine, now);
    }

    if (engine.canAscend() && now - lastProgressAt > stagnation) {
      const from = s.maxStage;
      const leading = strikesLead(s, derive(s, now, { ignoreTimed: true }), averageClicks(options));
      const gain = engine.ascend(now);
      options.onAscend?.(engine, now, gain, from);
      if (options.descent && wantsDescent(s, options.descent)) {
        const threads = engine.descend(now);
        buyWeaves(engine, now);
        options.onDescend?.(engine, now, threads);
      }
      // Only a walker whose strikes lead the company invests in critical hits.
      buyAltars(engine, now, options.altars ?? (leading ? CLICKER_ALTARS : IDLE_ALTARS), leading);
      lastMaxStage = s.maxStage;
      lastProgressAt = now;
    }
  }
  return now;
}

function wantsDescent(state: GameState, { minThreads, growth }: DescentPlan): boolean {
  return canDescend(state) && descentPreview(state) >= Math.max(minThreads, growth * state.lifetime.threads);
}

/** Threads spent on the cheapest weave first; the Long Thread only matters to a closed game. */
export function buyWeaves(engine: GameEngine, now: number) {
  const s = engine.state;
  for (let guard = 0; guard < 500; guard += 1) {
    let cheapest: { id: (typeof WEAVES)[number]["id"]; cost: number } | null = null;
    for (const weave of WEAVES) {
      if (weave.id === "long-thread") continue;
      const cost = weaveCost(weave.id, s.weaves[weave.id] ?? 0);
      if (cost <= s.threads && (!cheapest || cost < cheapest.cost)) cheapest = { id: weave.id, cost };
    }
    if (!cheapest || !engine.buyWeave(cheapest.id, now)) return;
  }
}

/** Capped altars bought as soon as they cost little next to the owned essences. */
const MILESTONE_SHARE = 0.03;

/**
 * Essence spending after an ascension: capped altars when cheap, then the open-ended level
 * that adds the most log-power per essence (the Blade if the strikes led the last run,
 * Patience if the company did), as long as it beats keeping the essences (each one owned
 * gives +10% DPS).
 */
export function buyAltars(engine: GameEngine, now: number, { milestones }: AltarPlan, strikesLed: boolean) {
  const weights = strikesLed ? STRIKE_WEIGHTS : COMPANY_WEIGHTS;
  const s = engine.state;
  for (let guard = 0; guard < 2000; guard += 1) {
    let bought = false;
    for (const id of milestones) {
      const cost = altarCost(id, s.altars[id] ?? 0);
      if (Number.isFinite(cost) && cost <= s.essences * MILESTONE_SHARE && engine.buyAltar(id, now)) bought = true;
    }
    const hold = ESSENCE_DPS_BONUS / (1 + ESSENCE_DPS_BONUS * s.essences);
    let best: { id: AltarId; ratio: number } | null = null;
    for (const [id, weight] of Object.entries(weights) as [AltarId, number][]) {
      const cost = altarCost(id, s.altars[id] ?? 0);
      if (cost > s.essences) continue;
      const ratio = (Math.log(1 + ALTAR_BY_ID[id].valuePerLevel) * weight) / cost;
      if (ratio > hold && (!best || ratio > best.ratio)) best = { id, ratio };
    }
    if (best && engine.buyAltar(best.id, now)) bought = true;
    if (!bought) return;
  }
}
