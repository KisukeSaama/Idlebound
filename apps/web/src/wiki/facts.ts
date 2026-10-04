import {
  ACHIEVEMENTS,
  AGE_COUNT,
  ALTARS,
  ASCENSION_MIN_STAGE,
  BASE_BOSS_TIMER,
  BASE_CRIT_MULTIPLIER,
  BASE_TREASURE_CHANCE,
  BESTIARY,
  CLICK_HERO_ID,
  DESCENT_OPEN_STAGE,
  ERA_COUNT,
  ESSENCE_DPS_BONUS,
  FORGE_MAX,
  HEROES,
  INVENTORY_LIMIT,
  MAX_STAGE,
  MAX_TREASURE_CHANCE,
  MONSTERS_PER_STAGE,
  NAMED_RELICS,
  OFFLINE_BASE_CAP_HOURS,
  RECOGNITION_TIERS,
  REUNION_DPS,
  REUNION_MIN_AWAY_SECONDS,
  SECRETS,
  STAGES_PER_BIOME,
  STAGES_PER_ERA,
  WOUND_CAP,
  WOUND_LAST_STAGE
} from "@idlebound/game";

/**
 * The numbers the wiki's prose quotes, read from the game data: an article never states a
 * figure the engine has stopped using.
 */
export const FACTS = {
  monstersPerStage: MONSTERS_PER_STAGE,
  stagesPerBiome: STAGES_PER_BIOME,
  stagesPerEra: STAGES_PER_ERA,
  maxStage: MAX_STAGE,
  bossTimer: BASE_BOSS_TIMER,
  crit: BASE_CRIT_MULTIPLIER,
  treasurePct: BASE_TREASURE_CHANCE * 100,
  treasureMaxPct: MAX_TREASURE_CHANCE * 100,
  ascensionStage: ASCENSION_MIN_STAGE,
  essenceDpsPct: ESSENCE_DPS_BONUS * 100,
  woundCapPct: WOUND_CAP * 100,
  woundLastStage: WOUND_LAST_STAGE,
  offlineHours: OFFLINE_BASE_CAP_HOURS,
  reunionDps: REUNION_DPS,
  reunionMinutes: REUNION_MIN_AWAY_SECONDS / 60,
  companions: HEROES.filter((hero) => hero.id !== CLICK_HERO_ID).length,
  altars: ALTARS.length,
  eras: ERA_COUNT,
  ages: AGE_COUNT,
  creatures: BESTIARY.length,
  namedRelics: NAMED_RELICS.length,
  secrets: SECRETS.length,
  achievements: ACHIEVEMENTS.length,
  descentStage: DESCENT_OPEN_STAGE,
  inventory: INVENTORY_LIMIT,
  forgeMax: FORGE_MAX,
  recognitionTiers: RECOGNITION_TIERS.join(", ")
} as const;

export type Facts = typeof FACTS;
