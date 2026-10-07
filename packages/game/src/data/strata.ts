import { eraForStage } from "./biomes";

/**
 * The strata of the Long Night (BIBLE 9): sixty eras, one per loop of the five biomes,
 * grouped five by five into twelve Ages. Era 0 is the present night; the sixtieth, Dawn,
 * ends at stage 3000. The night has no bottom (BIBLE 24): below the Dawn it draws itself
 * again from the first stratum, one fold deeper (`drawnEra`, `eraFold`). Numbers only;
 * tags, Age names and keystones live in `content/`.
 */
export const ERA_COUNT = 60;
export const ERAS_PER_AGE = 5;
export const AGE_COUNT = ERA_COUNT / ERAS_PER_AGE;
export const STAGES_PER_ERA = 50;

/** Age of an era, 0 (the Kingdom) to 11 (the First Mark). */
export function ageForEra(era: number): number {
  return Math.min(AGE_COUNT - 1, Math.floor(Math.max(0, era) / ERAS_PER_AGE));
}

export function ageForStage(stage: number): number {
  return ageForEra(eraForStage(stage));
}

/**
 * The stratum an era looks like: itself down to the Dawn, then the night drawn again from the
 * first stratum (era 60 is the present night once more, era 61 Echo, and so on). Its look,
 * its tag, its Age's name and its King's form follow it; the numbers follow the true era.
 */
export function drawnEra(era: number): number {
  return Math.max(0, era) % ERA_COUNT;
}

export function drawnEraForStage(stage: number): number {
  return drawnEra(eraForStage(stage));
}

/** How many times the night has drawn itself again at this era: 0 down to the Dawn, 1 below it… */
export function eraFold(era: number): number {
  return Math.floor(Math.max(0, era) / ERA_COUNT);
}

/** Age VIII (the Edge of Sleep, index 7): from here on, the words of the Truth may be spoken. */
export const SLEEP_AGE = 7;

/**
 * Strata keystones found: one per stratum whose last stage (its King, or at the cap the
 * Dawn) was cleared. The record of the deepest stage is the whole counter.
 */
export function keystonesFound(maxStageEver: number): number {
  return Math.min(ERA_COUNT, Math.floor((Math.max(1, maxStageEver) - 1) / STAGES_PER_ERA));
}

/**
 * Milestone keystones (BIBLE 17.1): moments of a walker's own story, each one fragment
 * written by hand. Their conditions are read from the save (`milestoneReached`).
 */
export type MilestoneId =
  | "ascend-1"
  | "ascend-5"
  | "ascend-10"
  | "ascend-25"
  | "ascend-50"
  | "ascend-100"
  | "descent-1"
  | "descent-3"
  | "descent-5"
  | "descent-10"
  | "remember-first"
  | "remember-third"
  | "remember-whole"
  | "remember-five"
  | "remember-ten"
  | "remember-all"
  | "kaelen-ran"
  | "nameless-speaks"
  | "eldra-loom"
  | "awakened-hello";

export const MILESTONES: readonly MilestoneId[] = [
  "ascend-1",
  "remember-first",
  "ascend-5",
  "ascend-10",
  "remember-third",
  "ascend-25",
  "nameless-speaks",
  "remember-whole",
  "kaelen-ran",
  "ascend-50",
  "remember-five",
  "eldra-loom",
  "descent-1",
  "ascend-100",
  "descent-3",
  "remember-ten",
  "descent-5",
  "awakened-hello",
  "descent-10",
  "remember-all"
];
