/** A "reasonable" automatic player, shared by the balance simulation and the tests. */
import { ALTAR_BY_ID, altarCost } from "../src/data/altars";
import { HEROES } from "../src/data/heroes";
import { SKILLS } from "../src/data/skills";
import { GameEngine, isSkillUnlocked } from "../src/engine";
import { ESSENCE_DPS_BONUS, derive, heroCost, heroCostMultiplier } from "../src/formulas";
import type { AltarId } from "../src/types";

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
}

export interface AltarPlan {
  /** Capped altars bought whenever cheap. */
  milestones: AltarId[];
  /** Open-ended altars, weighted by how much of their effect reaches this play style. */
  weights: Partial<Record<AltarId, number>>;
}

export const CLICKER_ALTARS: AltarPlan = {
  milestones: ["time", "bargain", "memory", "treasure", "wanderer", "fate", "precision", "echoes"],
  weights: { might: 1, blade: 0.6, fortune: 0.7 }
};
export const IDLE_ALTARS: AltarPlan = {
  milestones: ["time", "bargain", "memory", "treasure", "wanderer", "echoes"],
  weights: { might: 1, patience: 0.9, fortune: 0.7 }
};

const DT = 0.1;

function bestHeroPurchase(engine: GameEngine, now: number, clicksPerSecond: number) {
  const s = engine.state;
  const multiplier = heroCostMultiplier(s);
  let best: { id: string; ratio: number } | null = null;
  const base = derive(s, now, { ignoreTimed: true });
  for (const hero of HEROES) {
    const level = s.heroLevels[hero.id] ?? 0;
    if (hero.index > 1 && level === 0 && (s.heroLevels[HEROES[hero.index - 1].id] ?? 0) === 0) continue;
    const cost = heroCost(hero, level, 1, multiplier);
    if (cost > s.gold) continue;
    s.heroLevels[hero.id] = level + 1;
    const after = derive(s, now, { ignoreTimed: true });
    s.heroLevels[hero.id] = level;
    const gain = after.dps - base.dps + (after.click - base.click) * clicksPerSecond * (1 + after.critChance * (after.critMultiplier - 1));
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
        if (!equipped || item.affixes[0].value > equipped.affixes[0].value) engine.equip(item.uid, now);
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
      const gain = engine.ascend(now);
      options.onAscend?.(engine, now, gain, from);
      // A clicking player never benefits from patience, an idle one from click altars.
      buyAltars(engine, now, options.altars ?? (options.idleFromStage === undefined && !options.burst ? CLICKER_ALTARS : IDLE_ALTARS));
      lastMaxStage = s.maxStage;
      lastProgressAt = now;
    }
  }
  return now;
}

/** Capped altars bought as soon as they cost little next to the owned essences. */
const MILESTONE_SHARE = 0.03;

/**
 * Essence spending after an ascension: capped altars when cheap, then the open-ended level
 * that adds the most log-power per essence, as long as it beats keeping the essences
 * (each one owned gives +10% DPS).
 */
export function buyAltars(engine: GameEngine, now: number, { milestones, weights }: AltarPlan) {
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
