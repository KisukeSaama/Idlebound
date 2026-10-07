import type { AltarDef, AltarId } from "../types";
import { lookup } from "./lookup";
import { pow as dPow } from "../dmath";

/**
 * Altars: permanent upgrades bought with essences. Names and descriptions live in `content/`.
 *
 * Every level costs `costBase × costGrowth^level`. The four open-ended altars (might, blade,
 * fortune, patience) multiply their effect at each level ("mult": ×(1 + value)^level), so
 * against an exponential price they stay a real trade-off with holding essences (each one
 * owned gives +10% DPS) at every stage of the game: the best split keeps about half the
 * essences in hand. The others add up ("add": value × level) and are capped. The Harvest is
 * capped too, and dearer (before save version 11 it had no cap and cost 5 × 1.3^level):
 * open-ended, its cheap levels multiplied every later night's essences by eight within a day,
 * far past what the balance is measured on.
 *
 * The Sanctum wakes in three times (`night`): the four open-ended stones answer from the first
 * night, where the one real choice is (keep or offer, and to which); three more from the third
 * night, the last six from the fifth. A stone the walker already raised stays open.
 */
export const ALTARS: AltarDef[] = [
  { id: "might", maxLevel: 0, costBase: 1, costGrowth: 1.6, stacking: "mult", valuePerLevel: 0.1, format: "pct", night: 1 },
  { id: "blade", maxLevel: 0, costBase: 1, costGrowth: 1.6, stacking: "mult", valuePerLevel: 0.1, format: "pct", night: 1 },
  { id: "fortune", maxLevel: 0, costBase: 1, costGrowth: 1.6, stacking: "mult", valuePerLevel: 0.12, format: "pct", night: 1 },
  { id: "patience", maxLevel: 0, costBase: 1, costGrowth: 1.7, stacking: "mult", valuePerLevel: 0.14, format: "pct", night: 1 },
  { id: "time", maxLevel: 30, costBase: 2, costGrowth: 1.35, stacking: "add", valuePerLevel: 1, format: "seconds", night: 3 },
  { id: "fate", maxLevel: 5, costBase: 3, costGrowth: 2, stacking: "add", valuePerLevel: 0.2, format: "pct", night: 5 },
  { id: "precision", maxLevel: 25, costBase: 3, costGrowth: 1.3, stacking: "add", valuePerLevel: 0.01, format: "pct", night: 5 },
  { id: "treasure", maxLevel: 20, costBase: 3, costGrowth: 1.35, stacking: "add", valuePerLevel: 0.005, format: "pct", night: 3 },
  { id: "bargain", maxLevel: 25, costBase: 4, costGrowth: 1.4, stacking: "add", valuePerLevel: 0.02, format: "pct", night: 3 },
  { id: "echoes", maxLevel: 10, costBase: 5, costGrowth: 1.6, stacking: "add", valuePerLevel: 0.05, format: "pct", night: 5 },
  { id: "harvest", maxLevel: 5, costBase: 5, costGrowth: 3, stacking: "add", valuePerLevel: 0.1, format: "pct", night: 5 },
  { id: "wanderer", maxLevel: 10, costBase: 10, costGrowth: 1.8, stacking: "add", valuePerLevel: 10, format: "stages", night: 5 },
  { id: "memory", maxLevel: 20, costBase: 10, costGrowth: 1.5, stacking: "add", valuePerLevel: 5, format: "flat", night: 5 }
];

export const ALTAR_BY_ID = lookup(ALTARS.map((altar) => [altar.id, altar])) as Record<AltarId, AltarDef>;

/** The Altar of the Harvest's price before save version 11: what an older save paid for its levels. */
const LEGACY_HARVEST = { costBase: 5, costGrowth: 1.3 };

/** What level `level` of the Harvest cost an older save (rounded up, as it was paid). */
export function legacyHarvestPrice(level: number): number {
  return Math.ceil(LEGACY_HARVEST.costBase * dPow(LEGACY_HARVEST.costGrowth, level));
}

/** Essences an older save spent to raise the Harvest to `level` at the least (closed form, a hair under the prices paid). */
export function legacyHarvestCost(level: number): number {
  if (level <= 0) return 0;
  return (LEGACY_HARVEST.costBase * (dPow(LEGACY_HARVEST.costGrowth, level) - 1)) / (LEGACY_HARVEST.costGrowth - 1);
}

/**
 * Total effect of an altar at a given level: `value × level`, or `(1 + value)^level - 1`.
 * `maxLevel` is the altar's cap for this walker (the Knot of Dusk raises the Wanderer's).
 */
export function altarEffect(altar: AltarDef, level: number, maxLevel = altar.maxLevel): number {
  const capped = maxLevel > 0 ? Math.min(level, maxLevel) : level;
  return altar.stacking === "mult" ? dPow(1 + altar.valuePerLevel, capped) - 1 : capped * altar.valuePerLevel;
}

export function altarCost(id: AltarId, level: number, maxLevel = ALTAR_BY_ID[id].maxLevel): number {
  const altar = ALTAR_BY_ID[id];
  if (maxLevel > 0 && level >= maxLevel) return Number.POSITIVE_INFINITY;
  return altarLevelPrice(altar, level);
}

/** Price of a level ignoring the maximum. */
export function altarLevelPrice(altar: AltarDef, level: number): number {
  return Math.ceil(altar.costBase * dPow(altar.costGrowth, level));
}

/**
 * Total essences spent to reach a given level. Closed form, a hair under the sum of the
 * rounded-up prices, so the essence ledger never blames an honest save (and a forged level
 * in the millions costs nothing to check).
 */
export function altarTotalCost(id: AltarId, level: number): number {
  const altar = ALTAR_BY_ID[id];
  if (level <= 0) return 0;
  return (altar.costBase * (dPow(altar.costGrowth, level) - 1)) / (altar.costGrowth - 1);
}
