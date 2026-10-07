import { DEEP_FROM, lnStageHp } from "./curve";
import type { GameState } from "./types";
import { exp as dExp, log10 as dLog10, pow as dPow } from "./dmath";

/**
 * The deep road's numbers (BIBLE 24). The night has no bottom, but a number of the engine
 * does: a double stops at about 1.8e308, the HP of a guardian some thousand stages below
 * the Dawn. Past `SCALE_FROM`, HP, gold and damage are written in a larger unit, a power of
 * two, so the values the walker deals with stay in a double's range however deep the road
 * goes: the unit grows every `SCALE_SPAN` stages as fast as the Remnants' HP did.
 *
 * Two units, both read from stages that only grow inside what they measure:
 * - the night's (`runBits`, from `state.maxStage`): gold held, the Remnant fought, the
 *   company's damage, every price, the night's own statistics;
 * - the walk's (`lifeBits`, from the deepest stage): totals over every night (gold earned
 *   in all, the hardest blow ever).
 *
 * Shallower than `SCALE_FROM` both are 0 and every number is the plain one: nothing changes
 * for a walker above stage 3500. Rescaling by a power of two is exact; a value more than
 * about 1e308 times smaller than the unit reads as nothing, which only ever happens to the
 * Remnants of the very first stages, met again from the depths.
 */
export const SCALE_FROM = 3500;
export const SCALE_SPAN = 500;

/**
 * The unit (in bits) of the numbers of a night whose deepest stage is `stage`: from the first
 * stage of its span of 500, as many bits as the Remnants' HP grew since the Dawn (`curve.ts`),
 * so the frontier's numbers always sit between the Dawn's and 500 stages deeper.
 */
export function scaleBits(stage: number): number {
  if (!(stage >= SCALE_FROM)) return 0;
  const from = SCALE_FROM + SCALE_SPAN * Math.floor((stage - SCALE_FROM) / SCALE_SPAN);
  return Math.round((lnStageHp(from) - lnStageHp(DEEP_FROM)) / Math.LN2);
}

/** The unit of this night's numbers. */
export function runBits(state: GameState): number {
  return scaleBits(state.maxStage);
}

/** The unit of the totals over every night. */
export function lifeBits(state: GameState): number {
  return scaleBits(state.maxStageEver);
}

/** `value`, written in a unit of `from` bits, in a unit of `to` bits. Exact unless it underflows. */
export function rescale(value: number, from: number, to: number): number {
  if (from === to) return value;
  return value * dPow(2, from - to);
}

/** e^`log` in a unit of `bits` bits: a magnitude known by its natural logarithm. */
export function fromLog(log: number, bits: number): number {
  return dExp(log - bits * Math.LN2);
}

/** The base-10 logarithm of a value written in a unit of `bits` bits (−Infinity for 0). */
export function log10Of(value: number, bits: number): number {
  return dLog10(value) + bits * Math.LOG10E * Math.LN2;
}
