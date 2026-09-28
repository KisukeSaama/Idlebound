import { lookup } from "./lookup";

/**
 * The Descent (BIBLE 12.7), the second layer of rebirth: Eldra unweaves the Sanctum and
 * weaves the Long Night again, one thread deeper. The walker gives up the stones and the
 * memories (altars, essences) and keeps what cannot be unwoven. Threads, earned from the
 * essences gathered since the last Descent, buy Weaves at her Loom. Numbers only.
 */
export type WeaveId = "plenty" | "dusk-knot" | "long-thread" | "humming-loom" | "kinship" | "remembered-stones" | "frayed-edge" | "seventh-night";

export interface WeaveDef {
  id: WeaveId;
  /** 0: no cap. */
  maxLevel: number;
  /** Price of level n, in threads: `ceil(costBase × costGrowth^n)`. */
  costBase: number;
  costGrowth: number;
  /** Effect of one level (see each weave). */
  valuePerLevel: number;
}

export const WEAVES: readonly WeaveDef[] = [
  /** Essences ×1.25 per level, multiplied. */
  { id: "plenty", maxLevel: 0, costBase: 2, costGrowth: 1.6, valuePerLevel: 0.25 },
  /** The Altar of the Wanderer's cap, +10 levels per level. */
  { id: "dusk-knot", maxLevel: 5, costBase: 3, costGrowth: 2, valuePerLevel: 10 },
  /** One more hour of background catch-up per level. */
  { id: "long-thread", maxLevel: 4, costBase: 4, costGrowth: 2, valuePerLevel: 1 },
  /** Wandering crystals come 10% sooner per level. */
  { id: "humming-loom", maxLevel: 5, costBase: 2, costGrowth: 1.7, valuePerLevel: 0.1 },
  /** Every tier of Recognition asks one run less per level. */
  { id: "kinship", maxLevel: 3, costBase: 5, costGrowth: 3, valuePerLevel: 1 },
  /** 5% of each altar level survives a Descent, per level. */
  { id: "remembered-stones", maxLevel: 5, costBase: 3, costGrowth: 2, valuePerLevel: 0.05 },
  /** Fragments come 20% more often per level. */
  { id: "frayed-edge", maxLevel: 5, costBase: 1, costGrowth: 1.5, valuePerLevel: 0.2 },
  /** The seventh power: Unweave (skip the current stage). */
  { id: "seventh-night", maxLevel: 1, costBase: 10, costGrowth: 1, valuePerLevel: 1 }
];

export const WEAVE_BY_ID = lookup(WEAVES.map((weave) => [weave.id, weave])) as Record<WeaveId, WeaveDef>;

/** A Descent asks for this deepest stage ever… */
export const DESCENT_MIN_STAGE = 1000;
/** …and for Eldra to remember the walker fully (she shows the Loom at Recognition 5). */
export const DESCENT_HERO = "eldra";

/** Threads woven from `essences` gathered since the last Descent: 0 under a million, 8 at 1e9. */
export function threadsFor(essences: number): number {
  if (!(essences >= 1e6)) return 0;
  return Math.max(0, Math.floor(2 * (Math.log10(essences) - 5)));
}

export function weaveCost(id: WeaveId, level: number): number {
  const weave = WEAVE_BY_ID[id];
  if (weave.maxLevel > 0 && level >= weave.maxLevel) return Number.POSITIVE_INFINITY;
  return Math.ceil(weave.costBase * Math.pow(weave.costGrowth, level));
}

/** Threads spent to bring a weave from 0 to `level`. */
export function weaveTotalCost(id: WeaveId, level: number): number {
  let total = 0;
  const weave = WEAVE_BY_ID[id];
  const top = weave.maxLevel > 0 ? Math.min(level, weave.maxLevel) : level;
  for (let n = 0; n < top; n += 1) total += Math.ceil(weave.costBase * Math.pow(weave.costGrowth, n));
  return total;
}
