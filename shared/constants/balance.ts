import type { Stats } from "../types/game";

export const SAVE_VERSION = 1;
export const INVENTORY_LIMIT = 60;
export const COMBAT_TICK_MS = 500;
export const RECOVERY_SECONDS = 4;
export const SHOP_SIZE = 6;
export const OFFLINE_MAX_SECONDS = 8 * 60 * 60;

export const BASE_PLAYER_STATS: Stats = {
  maxHp: 120,
  attack: 12,
  defense: 4,
  attackSpeed: 2
};

export const LEVEL_UP_GAINS: Stats = {
  maxHp: 18,
  attack: 3,
  defense: 2,
  attackSpeed: 0
};

export const EXPERIENCE_BASE = 80;
export const EXPERIENCE_GROWTH = 1.22;
export const DAMAGE_VARIANCE = 0.12;
export const ITEM_SELL_RATIO = 0.35;
export const UPGRADE_COST_BASE = 24;
export const UPGRADE_COST_GROWTH = 1.55;
export const UPGRADE_MAX_LEVEL = 10;

export const RARITY_MULTIPLIER = {
  common: 1,
  uncommon: 1.25,
  rare: 1.6,
  epic: 2.15
} as const;
