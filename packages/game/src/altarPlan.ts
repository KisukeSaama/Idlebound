import { ALTAR_BY_ID } from "./data/altars";
import { CLICK_HERO_ID, HEROES } from "./data/heroes";
import { promiseAbstains } from "./data/promises";
import { ESSENCE_DPS_BONUS, altarPrice, derive } from "./formulas";
import type { AltarId, Derived, GameState } from "./types";

/**
 * How the essences of a dusk are best offered (BIBLE 6.4): each essence held gives +10%
 * damage, so an altar only pays when its level adds more than the essences it takes away.
 * The "Distribute" button of the Sanctum and the balance bots share this plan.
 */

/** Capped altars a walker whose strikes lead raises whenever they cost little. */
export const CLICKER_ALTARS: readonly AltarId[] = ["time", "bargain", "memory", "treasure", "wanderer", "fate", "precision", "echoes"];
/** Capped altars a walker whose company leads raises whenever they cost little. */
export const IDLE_ALTARS: readonly AltarId[] = ["time", "bargain", "memory", "treasure", "wanderer", "echoes"];

type Weights = Partial<Record<AltarId, number>>;
/**
 * Open-ended altars, weighted by how much of their effect reaches the walker: the Blade when
 * the strikes lead (they deal more than the Patience bonus adds), Patience when the company
 * does.
 */
const STRIKE_WEIGHTS: Weights = { might: 1, blade: 0.9, fortune: 0.7 };
const COMPANY_WEIGHTS: Weights = { might: 1, patience: 0.9, fortune: 0.7 };

/** A capped altar is raised once it costs this share of the essences held, at most. */
const MILESTONE_SHARE = 0.03;

/**
 * Damage a second of the company with a walker striking `clicksPerSecond` times a second
 * (crits averaged): the company's damage, Patience bonus included, and every strike on top.
 */
export function damageRate(d: Pick<Derived, "dps" | "click" | "critChance" | "critMultiplier">, clicksPerSecond: number): number {
  const strikes = clicksPerSecond * d.click * (1 + d.critChance * (d.critMultiplier - 1));
  return d.dps + strikes;
}

/** Whether the walker's strikes, at this pace, deal more than the Patience bonus adds to the company. */
export function strikesLead(d: Derived, clicksPerSecond: number): boolean {
  const strikes = clicksPerSecond * d.click * (1 + d.critChance * (d.critMultiplier - 1));
  return strikes > d.patienceDps;
}

/** The walker's own pace over the whole walk: strikes a second of play. */
export function walkerPace(state: GameState): number {
  return state.lifetime.playTime > 0 ? state.lifetime.clicks / state.lifetime.playTime : 0;
}

/** A walker striking this often a second over the walk is taken for one whose strikes lead, before any altar says so. */
const STRIKER_PACE = 3;

/**
 * Whether the walker's strikes lead their company, as the Sanctum sees it: weighed on the
 * company when there is one, else from the walker's own choices at the altars (the Blade
 * raised over Patience), else from their pace over the walk.
 */
export function walkerStrikesLead(state: GameState, now: number): boolean {
  const hired = HEROES.some((hero) => hero.id !== CLICK_HERO_ID && (state.heroLevels[hero.id] ?? 0) > 0);
  if (hired) return strikesLead(derive(state, now, { ignoreTimed: true }), walkerPace(state));
  const blade = state.altars.blade ?? 0;
  const patience = state.altars.patience ?? 0;
  if (blade !== patience) return blade > patience;
  return walkerPace(state) >= STRIKER_PACE;
}

/**
 * The altars to raise, in order, with the essences held: the capped ones when cheap, then the
 * open-ended level that adds the most to the walker's damage per essence, as long as it beats
 * keeping the essences; the Harvest when a level adds more to the nights to come. Nothing
 * while the Nameless's word keeps the essences.
 */
export function distributeEssences(state: GameState, strikesLed: boolean, milestones: readonly AltarId[] = strikesLed ? CLICKER_ALTARS : IDLE_ALTARS): AltarId[] {
  if (promiseAbstains(state, "essences")) return [];
  const weights = strikesLed ? STRIKE_WEIGHTS : COMPANY_WEIGHTS;
  const probe: GameState = { ...state, altars: { ...state.altars } };
  const plan: AltarId[] = [];
  const raise = (id: AltarId) => {
    const cost = altarPrice(probe, id);
    if (!Number.isFinite(cost) || cost > probe.essences) return false;
    probe.essences -= cost;
    probe.altars[id] = (probe.altars[id] ?? 0) + 1;
    plan.push(id);
    return true;
  };
  for (let guard = 0; guard < 2000; guard += 1) {
    let raised = false;
    for (const id of milestones) {
      const cost = altarPrice(probe, id);
      if (Number.isFinite(cost) && cost <= probe.essences * MILESTONE_SHARE && raise(id)) raised = true;
    }
    const hold = ESSENCE_DPS_BONUS / (1 + ESSENCE_DPS_BONUS * probe.essences);
    let best: { id: AltarId; ratio: number } | null = null;
    for (const [id, weight] of Object.entries(weights) as [AltarId, number][]) {
      const cost = altarPrice(probe, id);
      if (cost > probe.essences) continue;
      const ratio = (Math.log(1 + ALTAR_BY_ID[id].valuePerLevel) * weight) / cost;
      if (ratio > hold && (!best || ratio > best.ratio)) best = { id, ratio };
    }
    // The Harvest pays in the nights to come: a level is worth the essences it adds to every
    // later dusk, weighed like the others against keeping the essences.
    const harvest = probe.altars.harvest ?? 0;
    const harvestCost = altarPrice(probe, "harvest");
    if (harvestCost <= probe.essences) {
      const step = ALTAR_BY_ID.harvest.valuePerLevel;
      const ratio = Math.log((1 + step * (harvest + 1)) / (1 + step * harvest)) / harvestCost;
      if (ratio > hold && (!best || ratio > best.ratio)) best = { id: "harvest", ratio };
    }
    if (best && raise(best.id)) raised = true;
    if (!raised) break;
  }
  return plan;
}

/** Whether an altar's effect is a share of the walker's damage (the others give gold, time, luck). */
export function damageAltar(id: AltarId): boolean {
  return id === "might" || id === "blade" || id === "patience" || id === "fate" || id === "precision";
}

/**
 * What raising an altar one level does to the walker's damage, the essences it takes included:
 * `essences`, the share of damage the essences offered carried (below 1); `damage`, the altar's
 * own share for a damage altar (1 for the others); `net`, the two together. Weighed on the
 * company as it stands, or, at the start of a night, on every companion once met at level 1,
 * with the walker striking at their own pace over the walk.
 */
export function altarNet(state: GameState, id: AltarId, now: number): { essences: number; damage: number; net: number } {
  const cost = altarPrice(state, id);
  if (!Number.isFinite(cost) || cost > state.essences) return { essences: 1, damage: 1, net: 1 };
  const essences = (1 + ESSENCE_DPS_BONUS * (state.essences - cost)) / (1 + ESSENCE_DPS_BONUS * state.essences);
  if (!damageAltar(id)) return { essences, damage: 1, net: essences };
  const hired = HEROES.some((hero) => hero.id !== CLICK_HERO_ID && (state.heroLevels[hero.id] ?? 0) > 0);
  const heroLevels = hired ? state.heroLevels : Object.fromEntries(HEROES.slice(0, Math.max(2, state.lifetime.bestHired)).map((hero) => [hero.id, 1]));
  const pace = walkerPace(state);
  const before = derive({ ...state, heroLevels }, now, { ignoreTimed: true });
  const after = derive({ ...state, heroLevels, essences: state.essences - cost, altars: { ...state.altars, [id]: (state.altars[id] ?? 0) + 1 } }, now, { ignoreTimed: true });
  const net = damageRate(after, pace) / damageRate(before, pace);
  return { essences, damage: net / essences, net };
}
