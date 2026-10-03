import type { AffixStat, Item, ItemSlot, Rarity } from "../types";
import { eraForStage } from "./biomes";

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

/**
 * The rarities for eyes blind to red and green: blue and violet part by lightness, gold and
 * crimson by hue, so no two tiers merge under protanopia or deuteranopia (nor tritanopia).
 */
const COLORBLIND_RARITY_COLOR: Record<Rarity, string> = {
  common: "#e6ecef",
  rare: "#96b5ec",
  epic: "#8e69fb",
  legendary: "#fcb902",
  mythic: "#ff2259"
};

/** The color a rarity is shown in, following the colorblind setting. */
export function rarityColor(rarity: Rarity, colorblind: boolean): string {
  return colorblind ? COLORBLIND_RARITY_COLOR[rarity] : RARITY_INFO[rarity].color;
}

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

/**
 * Caps on the total bonus of the four equipped relics. Critical hits only apply to clicks:
 * uncapped, late relics would make clicking dwarf companion DPS again. Damage to elites and
 * guardians stays under their HP multiplier (×6 and ×10): uncapped, forged late relics made
 * them fall faster than the Remnants of their own stage.
 */
export const EQUIPMENT_CAP: Partial<Record<AffixStat, number>> = {
  critChance: AFFIX_CAP.critChance! * 2,
  essence: AFFIX_CAP.essence! * 4,
  critDamage: 0.5,
  bossDamage: 3
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

/**
 * Density: older memories are denser, and so are the objects they held. A relic worn
 * multiplies all companion damage (and the strike's share of it) by this much per stratum
 * below the present night it came from. Its stratum is its level's, so it needs no field
 * of its own and the Ledger bounds it with the level (never deeper than the walker went).
 */
export const DENSITY_PER_STRATUM = 0.03;

/** The stratum a relic was remembered in (0: the present night). */
export function relicStratum(item: Item): number {
  return eraForStage(item.level);
}

/** A relic's density: its damage multiplier while worn. */
export function relicDensity(item: Item): number {
  return Math.pow(1 + DENSITY_PER_STRATUM, relicStratum(item));
}
