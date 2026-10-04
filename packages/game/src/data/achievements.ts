import type { GameState } from "../types";
import { HEROES } from "./heroes";
import { SECRETS, bestiaryMet, rememberedCompanions } from "./lore";
import { chronicleCount } from "../chronicle";
import { eraForStage } from "./biomes";
import { lookup } from "./lookup";

export type AchievementCategory = "progression" | "combat" | "wealth" | "companions" | "ascension" | "secrets";

/**
 * An achievement is one tier of a series. Its id is `<series>-<tier>` (1-based); names and
 * descriptions are looked up by series and tier in `content/`.
 */
export interface AchievementDef {
  id: string;
  series: string;
  category: AchievementCategory;
  metric: (state: GameState) => number;
  threshold: number;
  /** Permanent DPS bonus (additive across achievements). */
  bonus: number;
}

/** Series of the secret deeds. */
export const SECRET_SERIES = "secret";

const heroLevelSum = (state: GameState) => state.lifetime.bestLevelSum;
const heroesHired = (state: GameState) => state.lifetime.bestHired;

/**
 * A series of tiers. Thresholds are listed in the order of their ids, which never change:
 * a tier added later between two others gets the next id and takes its place by threshold.
 */
function series(
  prefix: string,
  category: AchievementCategory,
  metric: AchievementDef["metric"],
  thresholds: number[],
  bonus = 0.02
): AchievementDef[] {
  const deeper = (threshold: number) => thresholds.filter((other) => other > threshold).length;
  return thresholds
    .map((threshold, index) => ({
      id: `${prefix}-${index + 1}`,
      series: prefix,
      category,
      metric,
      threshold,
      // The two highest tiers of every series are worth 2.5× more.
      bonus: deeper(threshold) < 2 ? bonus * 2.5 : bonus
    }))
    .sort((a, b) => a.threshold - b.threshold);
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // The end of every Age from the third on (tiers 13 to 19 came later, between the others).
  ...series("stage", "progression", (s) => s.maxStageEver, [10, 25, 50, 75, 100, 150, 200, 300, 500, 1_000, 2_000, 3_000, 750, 1_250, 1_500, 1_750, 2_250, 2_500, 2_750], 0.03),
  // Strata reached: the era of the deepest stage, counted from one.
  ...series("strata", "progression", (s) => eraForStage(s.maxStageEver) + 1, [10, 20, 30, 40, 50, 60]),
  ...series("clicks", "combat", (s) => s.lifetime.clicks, [100, 1_000, 10_000, 100_000, 1_000_000]),
  ...series("crits", "combat", (s) => s.lifetime.crits, [50, 1_000, 25_000, 250_000]),
  ...series("kills", "combat", (s) => s.lifetime.kills, [100, 1_000, 10_000, 100_000, 1_000_000]),
  ...series("bosses", "combat", (s) => s.lifetime.bosses, [10, 100, 1_000, 10_000]),
  ...series("kings", "combat", (s) => s.lifetime.kings, [1, 10, 100, 1_000]),
  ...series("seams", "combat", (s) => s.lifetime.seams, [1, 25, 100]),
  // Then about what a walker has earned by the end of each Age, down to the last one.
  ...series("gold", "wealth", (s) => s.lifetime.goldEarned, [1e3, 1e6, 1e9, 1e12, 1e18, 1e24, 1e36, 1e45, 1e65, 1e80, 1e100, 1e115, 1e135, 1e155, 1e170, 1e190, 1e205, 1e225]),
  ...series("treasure", "wealth", (s) => s.lifetime.treasures, [1, 25, 250]),
  ...series("crystal", "wealth", (s) => s.lifetime.crystals, [1, 10, 50, 250]),
  ...series("levels", "companions", heroLevelSum, [100, 500, 1_500, 4_000, 10_000]),
  ...series("hired", "companions", heroesHired, [5, 10, 15, HEROES.length]),
  ...series("skills", "companions", (s) => s.lifetime.skillsUsed, [10, 100, 1_000]),
  ...series("recognition", "companions", rememberedCompanions, [1, 5, 10, 20]),
  ...series("ascend", "ascension", (s) => s.lifetime.ascensions, [1, 5, 10, 25, 50, 100, 250], 0.03),
  ...series("essences", "ascension", (s) => s.lifetime.essencesEarned, [10, 100, 1_000, 100_000, 1e7, 1e10, 1e15], 0.03),
  ...series("descents", "ascension", (s) => s.descents, [1, 3, 10, 25]),
  ...series("legend", "secrets", (s) => s.lifetime.legendaries, [1, 10]),
  ...series("mythic", "secrets", (s) => s.lifetime.mythics, [1], 0.05),
  ...series("hit", "combat", (s) => s.lifetime.maxHit, [1e3, 1e9, 1e18, 1e30]),
  ...series("time", "secrets", (s) => s.lifetime.playTime, [3_600, 36_000, 360_000]),
  ...series("fails", "secrets", (s) => s.lifetime.bossFails, [1, 50]),
  ...series("bestiary", "secrets", bestiaryMet, [10, 25, 45, 63]),
  ...series("fragments", "secrets", chronicleCount, [10, 50, 150, 500, 2_000]),
  ...series("named", "secrets", (s) => s.named.length, [1, 6, 12, 24]),
  // Secret deeds (BIBLE 14.3): one per secret, tier = the secret's number, and no bonus, so
  // forging one gains nothing. Hidden in the Hall until earned.
  ...SECRETS.map((secret): AchievementDef => ({
    id: `${SECRET_SERIES}-${secret.deed}`,
    series: SECRET_SERIES,
    category: "secrets",
    metric: (s) => (s.secrets.includes(secret.id) ? 1 : 0),
    threshold: 1,
    bonus: 0
  }))
];

export const ACHIEVEMENT_BY_ID: Record<string, AchievementDef> = lookup(ACHIEVEMENTS.map((a) => [a.id, a]));

/** Past this ratio between two tiers, the way between them is measured in orders of magnitude. */
const LOG_PROGRESS_RATIO = 100;

/**
 * How far a deed is, from 0 to 1, counted from the tier below it in its series. Between tiers
 * a hundredfold apart or more (gold, the mightiest hit), it counts orders of magnitude: a
 * walker at 2e201 gold on the way from 1e190 to 1e205 is three quarters there, not at zero.
 */
export function achievementProgress(def: AchievementDef, value: number): number {
  const below = ACHIEVEMENTS.filter((other) => other.series === def.series && other.threshold < def.threshold);
  const floor = below.reduce((highest, other) => Math.max(highest, other.threshold), 0);
  if (value >= def.threshold) return 1;
  if (floor > 0 && def.threshold / floor >= LOG_PROGRESS_RATIO) {
    if (value <= floor) return 0;
    return Math.log(value / floor) / Math.log(def.threshold / floor);
  }
  return Math.max(0, (value - floor) / (def.threshold - floor));
}
