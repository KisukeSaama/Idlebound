import type { AltarDef, AltarId } from "../types";
import { lookup } from "./lookup";

/**
 * Altars: permanent upgrades bought with essences. Names and descriptions live in `content/`.
 *
 * Every level costs `costBase × costGrowth^level`. The four open-ended altars (might, blade,
 * fortune, patience) multiply their effect at each level ("mult": ×(1 + value)^level), so
 * against an exponential price they stay a real trade-off with holding essences (each one
 * owned gives +10% DPS) at every stage of the game: the best split keeps about half the
 * essences in hand. The others add up ("add": value × level) and most are capped.
 */
export const ALTARS: AltarDef[] = [
  { id: "might", maxLevel: 0, costBase: 1, costGrowth: 1.6, stacking: "mult", valuePerLevel: 0.1, format: "pct" },
  { id: "blade", maxLevel: 0, costBase: 1, costGrowth: 1.6, stacking: "mult", valuePerLevel: 0.15, format: "pct" },
  { id: "fortune", maxLevel: 0, costBase: 1, costGrowth: 1.6, stacking: "mult", valuePerLevel: 0.12, format: "pct" },
  { id: "patience", maxLevel: 0, costBase: 1, costGrowth: 1.7, stacking: "mult", valuePerLevel: 0.15, format: "pct" },
  { id: "time", maxLevel: 30, costBase: 2, costGrowth: 1.35, stacking: "add", valuePerLevel: 1, format: "seconds" },
  { id: "fate", maxLevel: 5, costBase: 3, costGrowth: 2, stacking: "add", valuePerLevel: 0.2, format: "pct" },
  { id: "precision", maxLevel: 25, costBase: 3, costGrowth: 1.3, stacking: "add", valuePerLevel: 0.01, format: "pct" },
  { id: "treasure", maxLevel: 20, costBase: 3, costGrowth: 1.35, stacking: "add", valuePerLevel: 0.005, format: "pct" },
  { id: "bargain", maxLevel: 25, costBase: 4, costGrowth: 1.4, stacking: "add", valuePerLevel: 0.02, format: "pct" },
  { id: "echoes", maxLevel: 10, costBase: 5, costGrowth: 1.6, stacking: "add", valuePerLevel: 0.05, format: "pct" },
  { id: "harvest", maxLevel: 0, costBase: 5, costGrowth: 1.3, stacking: "add", valuePerLevel: 0.1, format: "pct" },
  { id: "wanderer", maxLevel: 10, costBase: 10, costGrowth: 1.8, stacking: "add", valuePerLevel: 10, format: "stages" },
  { id: "memory", maxLevel: 20, costBase: 10, costGrowth: 1.5, stacking: "add", valuePerLevel: 5, format: "flat" }
];

export const ALTAR_BY_ID = lookup(ALTARS.map((altar) => [altar.id, altar])) as Record<AltarId, AltarDef>;

/** Total effect of an altar at a given level: `value × level`, or `(1 + value)^level - 1`. */
export function altarEffect(altar: AltarDef, level: number): number {
  const capped = altar.maxLevel > 0 ? Math.min(level, altar.maxLevel) : level;
  return altar.stacking === "mult" ? Math.pow(1 + altar.valuePerLevel, capped) - 1 : capped * altar.valuePerLevel;
}

export function altarCost(id: AltarId, level: number): number {
  const altar = ALTAR_BY_ID[id];
  if (altar.maxLevel > 0 && level >= altar.maxLevel) return Number.POSITIVE_INFINITY;
  return altarLevelPrice(altar, level);
}

/** Price of a level ignoring the maximum. */
export function altarLevelPrice(altar: AltarDef, level: number): number {
  return Math.ceil(altar.costBase * Math.pow(altar.costGrowth, level));
}

/**
 * Total essences spent to reach a given level. Closed form, a hair under the sum of the
 * rounded-up prices, so the essence ledger never blames an honest save (and a forged level
 * in the millions costs nothing to check).
 */
export function altarTotalCost(id: AltarId, level: number): number {
  const altar = ALTAR_BY_ID[id];
  if (level <= 0) return 0;
  return (altar.costBase * (Math.pow(altar.costGrowth, level) - 1)) / (altar.costGrowth - 1);
}
