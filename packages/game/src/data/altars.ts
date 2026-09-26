import type { AltarDef, AltarId } from "../types";
import { lookup } from "./lookup";

/** Altars: permanent upgrades bought with essences. Names and descriptions live in `content/`. */
export const ALTARS: AltarDef[] = [
  { id: "might", maxLevel: 0, costBase: 1, costGrowth: 1, costCurve: "linear", valuePerLevel: 0.25, format: "pct" },
  { id: "blade", maxLevel: 0, costBase: 1, costGrowth: 1, costCurve: "linear", valuePerLevel: 0.25, format: "pct" },
  { id: "fortune", maxLevel: 0, costBase: 1, costGrowth: 1, costCurve: "linear", valuePerLevel: 0.15, format: "pct" },
  { id: "patience", maxLevel: 0, costBase: 1, costGrowth: 1, costCurve: "linear", valuePerLevel: 0.4, format: "pct" },
  { id: "time", maxLevel: 30, costBase: 2, costGrowth: 1.35, costCurve: "exp", valuePerLevel: 1, format: "seconds" },
  { id: "fate", maxLevel: 0, costBase: 2, costGrowth: 1, costCurve: "linear", valuePerLevel: 0.2, format: "pct" },
  { id: "precision", maxLevel: 25, costBase: 3, costGrowth: 1.3, costCurve: "exp", valuePerLevel: 0.01, format: "pct" },
  { id: "treasure", maxLevel: 20, costBase: 3, costGrowth: 1.35, costCurve: "exp", valuePerLevel: 0.005, format: "pct" },
  { id: "bargain", maxLevel: 25, costBase: 4, costGrowth: 1.4, costCurve: "exp", valuePerLevel: 0.02, format: "pct" },
  { id: "echoes", maxLevel: 10, costBase: 5, costGrowth: 1.6, costCurve: "exp", valuePerLevel: 0.05, format: "pct" },
  { id: "harvest", maxLevel: 0, costBase: 5, costGrowth: 1.25, costCurve: "exp", valuePerLevel: 0.1, format: "pct" },
  { id: "wanderer", maxLevel: 5, costBase: 5, costGrowth: 2, costCurve: "exp", valuePerLevel: 0.1, format: "pct" },
  { id: "memory", maxLevel: 20, costBase: 10, costGrowth: 1.5, costCurve: "exp", valuePerLevel: 5, format: "flat" }
];

export const ALTAR_BY_ID = lookup(ALTARS.map((altar) => [altar.id, altar])) as Record<AltarId, AltarDef>;

export function altarCost(id: AltarId, level: number): number {
  const altar = ALTAR_BY_ID[id];
  if (altar.maxLevel > 0 && level >= altar.maxLevel) return Number.POSITIVE_INFINITY;
  if (altar.costCurve === "linear") return altar.costBase * (level + 1);
  return Math.ceil(altar.costBase * Math.pow(altar.costGrowth, level));
}

/** Total essences spent to reach a given level. */
export function altarTotalCost(id: AltarId, level: number): number {
  let total = 0;
  for (let index = 0; index < level; index += 1) total += altarCost(id, index);
  return total;
}
