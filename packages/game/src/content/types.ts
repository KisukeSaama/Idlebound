import type { AchievementCategory } from "../data/achievements";
import type { AffixStat, AltarId, ItemSlot, Rarity, SkillId } from "../types";
import type { MarketOfferId } from "../data/market";

/** How an item base noun agrees with its adjectives (only French needs it). */
export type Gender = "m" | "f";

export interface HeroText {
  name: string;
  title: string;
  lore: string;
}

export interface NameText {
  name: string;
  description: string;
}

/**
 * Every player-facing string of the game content, for one locale. Mechanics (numbers,
 * ids, formulas) live in `data/`; only words live here.
 */
export interface GameText {
  biomes: Record<string, NameText>;
  /** Monster, mini-boss and boss names, by monster id. */
  monsters: Record<string, string>;
  /** Prefix added to monster names from the second era on (index 1..5). */
  eraTags: readonly string[];
  eraName: (era: number) => string;
  heroes: Record<string, HeroText>;
  /** Talent names, by upgrade id (`<heroId>-<level>`). */
  talents: Record<string, string>;
  skills: Record<SkillId, NameText>;
  altars: Record<AltarId, NameText>;
  market: Record<MarketOfferId, NameText>;
  /** Achievement names per series (id prefix), one per tier, in tier order. */
  achievementNames: Record<string, readonly string[]>;
  achievementCategories: Record<AchievementCategory, string>;
  /** Description of an achievement series, by id prefix (`stage`, `clicks`…). */
  achievementDescriptions: Record<string, (threshold: number) => string>;
  slots: Record<ItemSlot, string>;
  rarities: Record<Rarity, string>;
  affixes: Record<AffixStat, string>;
  /** Item nouns per slot, in the same order as `SLOT_BASE_COUNT`. */
  itemBases: Record<ItemSlot, readonly { noun: string; gender: Gender }[]>;
  /** Builds an item name from its parts. */
  itemName: (parts: { noun: string; gender: Gender; rarity: Rarity; biome: number }) => string;
}
