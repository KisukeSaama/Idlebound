import { lookup } from "./lookup";

/**
 * The Descent (BIBLE 12.7), the second layer of rebirth: Eldra unweaves the Sanctum and
 * weaves the Long Night again, one thread deeper. The walker gives up the stones and the
 * memories (altars, essences) and keeps what cannot be unwoven. Threads, as long as the night
 * has gone deep, buy Weaves at her Loom. Numbers only.
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

/** Threads are woven from this deepest stage on (see `threadsFor`). */
export const DESCENT_MIN_STAGE = 1000;
/**
 * Eldra shows her Loom once the night has gone this deep: past the Edge of Sleep, where the
 * road slows for good without it, about a week into the game. The first Descent weaves 32
 * threads there. Sooner, Descents came every other day and the Dawn fell within two weeks.
 */
export const DESCENT_OPEN_STAGE = 2000;
/**
 * Before save version 12 the Loom opened with Eldra's Recognition 5 from stage 1000: a walker
 * she showed it to that way keeps it.
 */
export const LEGACY_LOOM_HERO = "eldra";

export const WEAVES: readonly WeaveDef[] = [
  /**
   * Essences ×1.25 per level, multiplied. Its price grows by a fifth a level while the thread
   * doubles with every Age: an Age buys fewer levels than the one before.
   */
  { id: "plenty", maxLevel: 0, costBase: 4, costGrowth: 1.2, valuePerLevel: 0.25 },
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

/**
 * Highest level a save may hold for any weave, the uncapped Warp of Plenty included. Level n
 * of Plenty costs 4 × 1.2^n threads and the whole thread is 512 long at the Dawn: 200 is far
 * out of reach, and keeps the cost sums below bounded.
 */
export const WEAVE_LEVEL_MAX = 200;

export const WEAVE_BY_ID = lookup(WEAVES.map((weave) => [weave.id, weave])) as Record<WeaveId, WeaveDef>;

/**
 * The thread is as long as the night has gone deep: 2 threads at the Loom's stage, twice as
 * many with every Age (`THREAD_DOUBLING` stages) below it, 32 at stage 2000, 512 at the Dawn.
 * It counts every thread ever woven: a Descent weaves only what the walker's deepest stage
 * adds to it, so a night that went no deeper than the last weaves nothing. Exponential on
 * purpose: the Warp of Plenty's price grows faster (see WEAVES), so each Age asks for more
 * nights than the last and the Descents never run away.
 */
export const THREAD_DOUBLING = 250;
const THREAD_ORIGIN = DESCENT_MIN_STAGE - THREAD_DOUBLING;

export function threadsFor(deepest: number): number {
  if (!(deepest >= DESCENT_MIN_STAGE)) return 0;
  return Math.floor(Math.pow(2, (deepest - THREAD_ORIGIN) / THREAD_DOUBLING));
}

/** The shallowest stage whose thread is `threads` long: `threadsFor` inverted. */
export function stageForThreads(threads: number): number {
  let stage = Math.max(DESCENT_MIN_STAGE, Math.ceil(THREAD_ORIGIN + THREAD_DOUBLING * Math.log2(Math.max(1, threads))));
  // The logarithm may land a stage off either way: settle on the first stage that weaves enough.
  while (stage > DESCENT_MIN_STAGE && threadsFor(stage - 1) >= threads) stage -= 1;
  while (threadsFor(stage) < threads) stage += 1;
  return stage;
}

/**
 * Threads a Descent wove before save version 11, from the essences gathered since the last
 * one: what an older save's threads are checked against (they stay woven).
 */
export function legacyThreadsFor(essences: number): number {
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
  const top = Math.min(level, weave.maxLevel > 0 ? weave.maxLevel : WEAVE_LEVEL_MAX);
  for (let n = 0; n < top; n += 1) total += Math.ceil(weave.costBase * Math.pow(weave.costGrowth, n));
  return total;
}
