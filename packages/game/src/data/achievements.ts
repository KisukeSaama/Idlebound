import type { GameState } from "../types";
import { HEROES } from "./heroes";
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

const heroLevelSum = (state: GameState) => state.lifetime.bestLevelSum;
const heroesHired = (state: GameState) => state.lifetime.bestHired;

function series(
  prefix: string,
  category: AchievementCategory,
  metric: AchievementDef["metric"],
  thresholds: number[],
  bonus = 0.02
): AchievementDef[] {
  return thresholds.map((threshold, index) => ({
    id: `${prefix}-${index + 1}`,
    series: prefix,
    category,
    metric,
    threshold,
    // The last two tiers of every series are worth 2.5× more.
    bonus: index >= thresholds.length - 2 ? bonus * 2.5 : bonus
  }));
}

export const ACHIEVEMENTS: AchievementDef[] = [
  ...series("stage", "progression", (s) => s.maxStageEver, [10, 25, 50, 75, 100, 150, 200, 300, 500], 0.03),
  ...series("clicks", "combat", (s) => s.lifetime.clicks, [100, 1_000, 10_000, 100_000, 1_000_000]),
  ...series("crits", "combat", (s) => s.lifetime.crits, [50, 1_000, 25_000, 250_000]),
  ...series("kills", "combat", (s) => s.lifetime.kills, [100, 1_000, 10_000, 100_000, 1_000_000]),
  ...series("bosses", "combat", (s) => s.lifetime.bosses, [10, 100, 1_000, 10_000]),
  ...series("gold", "wealth", (s) => s.lifetime.goldEarned, [1e3, 1e6, 1e9, 1e12, 1e18, 1e24, 1e36]),
  ...series("treasure", "wealth", (s) => s.lifetime.treasures, [1, 25, 250]),
  ...series("crystal", "wealth", (s) => s.lifetime.crystals, [1, 10, 50, 250]),
  ...series("levels", "companions", heroLevelSum, [100, 500, 1_500, 4_000, 10_000]),
  ...series("hired", "companions", heroesHired, [5, 10, 15, HEROES.length]),
  ...series("skills", "companions", (s) => s.lifetime.skillsUsed, [10, 100, 1_000]),
  ...series("ascend", "ascension", (s) => s.lifetime.ascensions, [1, 5, 10, 25, 50], 0.03),
  ...series("essences", "ascension", (s) => s.lifetime.essencesEarned, [10, 100, 1_000, 100_000, 1e7], 0.03),
  ...series("legend", "secrets", (s) => s.lifetime.legendaries, [1, 10]),
  ...series("mythic", "secrets", (s) => s.lifetime.mythics, [1], 0.05),
  ...series("hit", "combat", (s) => s.lifetime.maxHit, [1e3, 1e9, 1e18, 1e30]),
  ...series("time", "secrets", (s) => s.lifetime.playTime, [3_600, 36_000, 360_000]),
  ...series("fails", "secrets", (s) => s.lifetime.bossFails, [1, 50])
];

export const ACHIEVEMENT_BY_ID: Record<string, AchievementDef> = lookup(ACHIEVEMENTS.map((a) => [a.id, a]));
