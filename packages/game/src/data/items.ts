import type { AffixStat, ItemSlot, Rarity } from "../types";

export const SLOTS: ItemSlot[] = ["weapon", "armor", "amulet", "ring"];

export const SLOT_MAIN_STAT: Record<ItemSlot, AffixStat> = {
  weapon: "dps",
  armor: "bossDamage",
  amulet: "click",
  ring: "gold"
};

/**
 * Number of base nouns per slot. Every locale in `content/` provides exactly this many,
 * and an item stores the index of its noun so its name can be shown in any language.
 */
export const SLOT_BASE_COUNT: Record<ItemSlot, number> = { weapon: 7, armor: 5, amulet: 4, ring: 4 };

export const RARITIES: Rarity[] = ["common", "rare", "epic", "legendary", "mythic"];

export const RARITY_INFO: Record<Rarity, { color: string; affixes: number; power: number; weight: number; shards: number }> = {
  common: { color: "#b8c0cc", affixes: 1, power: 1, weight: 600, shards: 1 },
  rare: { color: "#5aa9ff", affixes: 2, power: 1.4, weight: 280, shards: 3 },
  epic: { color: "#b86bff", affixes: 3, power: 2, weight: 95, shards: 8 },
  legendary: { color: "#ffb347", affixes: 3, power: 3, weight: 22, shards: 25 },
  mythic: { color: "#ff5c7a", affixes: 4, power: 4.5, weight: 3, shards: 80 }
};

/** Base value of an affix (common item, level 1). */
export const AFFIX_BASE: Record<AffixStat, number> = {
  dps: 0.1,
  click: 0.15,
  gold: 0.08,
  critChance: 0.01,
  critDamage: 0.25,
  bossDamage: 0.12,
  essence: 0.03
};

/** Hard caps per affix so percentages stay sane. */
export const AFFIX_CAP: Partial<Record<AffixStat, number>> = {
  critChance: 0.08,
  essence: 0.25
};

export const INVENTORY_LIMIT = 48;
export const FORGE_MAX = 20;
export const FORGE_STEP = 0.1;

export function forgeCost(rarity: Rarity, forge: number): number {
  return Math.ceil(RARITY_INFO[rarity].shards * 2 * Math.pow(1.35, forge));
}

/** Power scaling by item level (= the stage it dropped at). */
export function levelScale(level: number): number {
  return 1 + Math.log2(1 + level / 10) * 0.9;
}
