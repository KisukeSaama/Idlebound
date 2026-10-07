import { exp as dExp, log as dLog, pow as dPow } from "./dmath";

/**
 * The Remnants' health, as a natural logarithm, for any depth: what `stageHp` (formulas.ts)
 * and the deep road's unit (scale.ts) are both read from. Three segments down to the Dawn
 * (×1.55, ×1.15, then ×1.18 a stage), and below it the night drawn again (BIBLE 24): copies
 * of the strata above, thinner, their growth easing from ×1.18 a stage at the Dawn toward
 * ×`DEEP_GROWTH` over about `DEEP_EASE` stages. No seam at stage 3000: the curve and its
 * slope go on where they were.
 */
export const DEEP_FROM = 3000;
/**
 * The growth a stage the night drawn again eases toward, far below the Dawn. Below about
 * ×1.15 what a walker gains every Age of depth (essences ×1.02 a stage, the thread doubling
 * for the Warp of Plenty, the gold of deeper Remnants) outgrows the Remnants: the bot ran
 * away under ×1.125 (+590 stages in four days near 5500), and sped up again under ×1.15 (40
 * stages a day near 5000, 80 near 9500); at ×1.155 it slowed too fast (12 a day near 7000).
 * Just above the edge, every day still takes the walker a little less far than the one before.
 */
export const DEEP_GROWTH = 1.152;
/** Stages over which the growth eases (by a factor e). */
export const DEEP_EASE = 1000;

const LN_155 = dLog(1.55);
const LN_115 = dLog(1.15);
const LN_118 = dLog(1.18);
const LN_DEEP = dLog(DEEP_GROWTH);
const LN_HP_140 = dLog(10 * (139 + dPow(1.55, 139)));
const LN_HP_500 = LN_HP_140 + 360 * LN_115;
const LN_HP_DAWN = LN_HP_500 + (DEEP_FROM - 500) * LN_118;

/** ln of a normal Remnant's HP at `stage` (whole stages from 1). */
export function lnStageHp(stage: number): number {
  const s = Math.max(1, Math.floor(stage));
  if (s <= 140) return dLog(10 * (s - 1 + dExp(LN_155 * (s - 1))));
  if (s <= 500) return LN_HP_140 + LN_115 * (s - 140);
  if (s <= DEEP_FROM) return LN_HP_500 + LN_118 * (s - 500);
  const below = s - DEEP_FROM;
  return LN_HP_DAWN + LN_DEEP * below + (LN_118 - LN_DEEP) * DEEP_EASE * (1 - dExp(-below / DEEP_EASE));
}

/** The growth of a Remnant's HP from `stage` to the next one (×1.18 down to the Dawn). */
export function hpGrowth(stage: number): number {
  return dExp(lnStageHp(stage + 1) - lnStageHp(stage));
}
