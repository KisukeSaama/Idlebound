import { lookup } from "./lookup";
import { log10 as dLog10, log2 as dLog2, pow as dPow } from "../dmath";

/**
 * The Descent (BIBLE 12.7), the second layer of rebirth: Eldra unweaves the Sanctum and
 * weaves the Long Night again, one thread deeper. The walker gives up the stones and the
 * memories (altars, essences) and keeps what cannot be unwoven. Threads, as long as the night
 * has gone deep, buy Weaves at her Loom. Numbers only.
 */
export type WeaveId = "plenty" | "hourglass" | "habits" | "dusk-knot" | "long-thread" | "humming-loom" | "kinship" | "remembered-stones" | "frayed-edge" | "seventh-night";

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
 * Eldra shows her Loom once the night has gone this deep: the Draft, where the Ages start to
 * come undone (BIBLE 16 paces the late Ages by Descents from here). The first Descent weaves
 * 8 threads there. From save version 12 to 18 it opened at stage 2000, when a Descent still
 * took every essence and cost more than a day under the record: opened sooner, it set the
 * walker back for longer. Keeping a tenth of the essences, it pays from the second day after
 * it opens (`scripts/descent.ts`, from stage 1500).
 */
export const DESCENT_OPEN_STAGE = 1500;
/**
 * Before save version 12 the Loom opened with Eldra's Recognition 5 from stage 1000: a walker
 * she showed it to that way keeps it.
 */
export const LEGACY_LOOM_HERO = "eldra";

/** The Warp of Plenty's price from save version 11 to 18: what an older save paid for its levels. */
export const LEGACY_PLENTY = { costBase: 4, costGrowth: 1.2 };

export const WEAVES: readonly WeaveDef[] = [
  /**
   * Essences ×1.25 per level, multiplied. Its price grows by a quarter a level while the
   * thread doubles with every Age: an Age buys about 3.1 levels. A knife edge, measured with
   * the long run of `deep.ts` from stage 3000 (the Descent keeping a tenth of the essences): at
   * ×1.2 a level (save versions 11 to 18) the road ran away below the Dawn (stage 10,000 on day
   * 29, the pace rising from 200 to 467 a day past 7500); at ×1.22 it sped up past 7000 (10,000
   * on day 57); at ×1.3 it stalled near 5850 (under 3 stages a day).
   */
  { id: "plenty", maxLevel: 0, costBase: 4, costGrowth: 1.25, valuePerLevel: 0.25 },
  /**
   * Eldra's Hourglass: while the walker is away, the company calls the dusk itself once the
   * head of the night has stood still for `HOURGLASS_STALL_SECONDS`, and walks the next night.
   */
  { id: "hourglass", maxLevel: 1, costBase: 8, costGrowth: 1, valuePerLevel: 1 },
  /** Woven Habits: the powers are used again the moment they are ready (never Time Echo nor Unweave). */
  { id: "habits", maxLevel: 1, costBase: 8, costGrowth: 1, valuePerLevel: 1 },
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
 * Eldra's Hourglass turns once the head of the night has not moved for this long (a boss the
 * company cannot beat, trained against in vain): long enough for a quarter hour of purchases
 * to show, short enough that a night away is not spent standing still.
 */
export const HOURGLASS_STALL_SECONDS = 900;

/** Powers Woven Habits never uses on its own: Time Echo (the walker chooses its target) and Unweave (it unmakes the road). */
export const HABITS_LEAVE: readonly string[] = ["echo", "unweave"];

/**
 * Highest level a save may hold for any weave, the uncapped Warp of Plenty included. Level n
 * of Plenty costs 4 × 1.2^n threads, and the thread doubles every Age of new depth with no
 * bottom to the road (2^35 at stage 10,000): 1000 lies past stage 60,000, and keeps the cost
 * sums below bounded (about 1e80 threads).
 */
export const WEAVE_LEVEL_MAX = 1000;

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
  return Math.floor(dPow(2, (deepest - THREAD_ORIGIN) / THREAD_DOUBLING));
}

/**
 * Share of the essences held that a Descent leaves the walker (rounded down): Eldra unweaves
 * the stones, not every memory. Before save version 19 a Descent took them all, and the walker
 * spent a day and a half of play or more under the record it left (measured with
 * `scripts/descent.ts`, from stage 2000); with a tenth kept, five to six hours for the first
 * four (up to fifteen later), and the Descent pays from the second day. Keeping a twentieth or a thirtieth walks almost the same
 * road, an hour or two slower to come back each time.
 */
export const DESCENT_KEEP = 0.1;

/** The shallowest stage whose thread is `threads` long: `threadsFor` inverted. */
export function stageForThreads(threads: number): number {
  let stage = Math.max(DESCENT_MIN_STAGE, Math.ceil(THREAD_ORIGIN + THREAD_DOUBLING * dLog2(Math.max(1, threads))));
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
  return Math.max(0, Math.floor(2 * (dLog10(essences) - 5)));
}

export function weaveCost(id: WeaveId, level: number): number {
  const weave = WEAVE_BY_ID[id];
  if (weave.maxLevel > 0 && level >= weave.maxLevel) return Number.POSITIVE_INFINITY;
  return Math.ceil(weave.costBase * dPow(weave.costGrowth, level));
}

/**
 * Threads spent to bring a weave from 0 to `level`. `legacy`: levels of the Warp of Plenty
 * bought before save version 19, at the price of then (`LEGACY_PLENTY`).
 */
export function weaveTotalCost(id: WeaveId, level: number, legacy = 0): number {
  let total = 0;
  const weave = WEAVE_BY_ID[id];
  const top = Math.min(level, weave.maxLevel > 0 ? weave.maxLevel : WEAVE_LEVEL_MAX);
  for (let n = 0; n < top; n += 1) {
    const price = id === "plenty" && n < legacy ? LEGACY_PLENTY : weave;
    total += Math.ceil(price.costBase * dPow(price.costGrowth, n));
  }
  return total;
}
