import type { GameState, Item, ItemSlot, Rarity } from "../types";
import { biomeForStage, eraForStage } from "./biomes";
import { CLICK_HERO_ID, HEROES, HERO_BY_ID } from "./heroes";
import { lookup } from "./lookup";

/**
 * What a relic remembers (BIBLE 11): the clearer the memory, the more it holds. A blur
 * (common) or a clear outline (rare) is only weight, a rare's a little more. An epic or better
 * remembers what it did (a trait, two for a myth), a legendary or a mythic who carried it (a
 * companion's memory), and every relic the place it comes from (its biome: worn together, a
 * place's relics answer each other). Values are read from the trait id and the relic's
 * rarity, so the Ledger checks a relic from its ids alone.
 */
export type TraitId =
  // Weapons: the company's strength.
  | "vanguard"
  | "host"
  | "rout"
  | "rhythm"
  // Armor: standing against guardians.
  | "bulwark"
  | "scars"
  | "spoils"
  | "skyglass"
  | "regicide"
  // Amulets: the rhythm of the night and the walker's own hand.
  | "attention"
  | "breath"
  | "edge"
  | "pip"
  | "storm"
  // Rings: fortune and absence.
  | "fortune"
  | "homecoming"
  | "star"
  | "satchel"
  | "vigil";

export interface TraitDef {
  id: TraitId;
  slot: ItemSlot;
  /** The trait's value at epic, legendary and mythic. */
  values: readonly [number, number, number];
}

export const TRAITS: readonly TraitDef[] = [
  // The company's damage, multiplied.
  { id: "vanguard", slot: "weapon", values: [1.1, 1.3, 1.5] },
  // The company's damage, more for each companion in it.
  { id: "host", slot: "weapon", values: [0.005, 0.0125, 0.015] },
  // A stage routs when the company would fell its monsters in under this many seconds (0.1 without).
  { id: "rout", slot: "weapon", values: [0.2, 0.3, 0.5] },
  // The Patience bonus, multiplied.
  { id: "rhythm", slot: "weapon", values: [1.05, 1.15, 1.25] },
  // Seconds on every boss timer.
  { id: "bulwark", slot: "armor", values: [1, 3, 5] },
  // An elite or a guardian that pushed the company back keeps this share of its wounds at any depth (never the King).
  { id: "scars", slot: "armor", values: [0.25, 0.35, 0.5] },
  // Chance a guardian leaves a relic, added (an elite gets half of it).
  { id: "spoils", slot: "armor", values: [0.1, 0.2, 0.35] },
  // Shards of every guardian, multiplied.
  { id: "skyglass", slot: "armor", values: [1.5, 2, 3] },
  // Damage to the King, multiplied.
  { id: "regicide", slot: "armor", values: [1.5, 2, 3] },
  // Wandering crystals come this much sooner.
  { id: "attention", slot: "amulet", values: [0.1, 0.15, 0.25] },
  // Power cooldowns, lowered (never below 40% of their base, with the Altar of Echoes).
  { id: "breath", slot: "amulet", values: [0.06, 0.1, 0.15] },
  // The walker's whole strike, multiplied.
  { id: "edge", slot: "amulet", values: [1.1, 1.35, 1.5] },
  // Golden rat chance, added (inside its cap).
  { id: "pip", slot: "amulet", values: [0.006, 0.01, 0.015] },
  // Chance a crystal is a Crystal Storm (1 in 20 without).
  { id: "storm", slot: "amulet", values: [1 / 16, 1 / 13, 1 / 10] },
  // Gold, multiplied.
  { id: "fortune", slot: "ring", values: [1.1, 1.4, 1.75] },
  // The Reunion's company damage (x3 without).
  { id: "homecoming", slot: "ring", values: [3.5, 4, 5] },
  // Legendaries and mythics on the road (guardians, elites, Seams, the company's satchel), more likely.
  { id: "star", slot: "ring", values: [1.25, 1.5, 1.75] },
  // Relics the company's satchel holds, added.
  { id: "satchel", slot: "ring", values: [1, 2, 3] },
  // Hours a single absence is lived, added.
  { id: "vigil", slot: "ring", values: [0.5, 1, 1.5] }
];

export const TRAIT_BY_ID: Record<string, TraitDef> = lookup(TRAITS.map((trait) => [trait.id, trait]));

/** Traits a relic of each rarity remembers. */
export const TRAIT_COUNT: Record<Rarity, number> = { common: 0, rare: 0, epic: 1, legendary: 1, mythic: 2 };

/** A companion's damage, multiplied, while a relic that remembers them is worn. */
export const MEMORY_MULT: Record<Rarity, number> = { common: 1, rare: 1, epic: 1, legendary: 1.5, mythic: 2 };

/** Whether a relic of this rarity remembers who carried it. */
export function remembersBearer(rarity: Rarity): boolean {
  return MEMORY_MULT[rarity] > 1;
}

const TIER: Record<Rarity, number> = { common: -1, rare: -1, epic: 0, legendary: 1, mythic: 2 };

/** A trait's value on a relic of this rarity (0 below epic, which holds none). */
export function traitValue(id: TraitId, rarity: Rarity): number {
  const tier = TIER[rarity];
  return tier < 0 ? 0 : TRAIT_BY_ID[id].values[tier];
}

/** The strongest value a trait can reach, for the Ledger's bounds. */
export function traitMax(id: TraitId): number {
  return TRAIT_BY_ID[id].values[2];
}

/** The traits of a slot. */
export function slotTraits(slot: ItemSlot): TraitDef[] {
  return TRAITS.filter((trait) => trait.slot === slot);
}

/** A trait among the relics worn: its value, or `none` when no worn relic holds it. */
export function wornTrait(worn: readonly Item[], id: TraitId, none = 0): number {
  for (const item of worn) if (item.traits?.includes(id)) return traitValue(id, item.rarity);
  return none;
}

/**
 * Companions a relic can remember: those the walker ever had in the company (at least the
 * first), never Aldric, who is the walker.
 */
export function memoryPool(bestHired: number): string[] {
  const reach = Math.max(2, bestHired);
  return HEROES.filter((hero) => hero.id !== CLICK_HERO_ID && hero.index < reach).map((hero) => hero.id);
}

/** Whether a relic's memory names a companion the walker could have met. */
export function memoryReached(state: GameState, heroId: string): boolean {
  return memoryPool(state.lifetime.bestHired).includes(heroId) && Object.hasOwn(HERO_BY_ID, heroId);
}

/**
 * The places relics come from: the five biomes, by the stage a relic first dropped at (its
 * level), whatever depth it was brought down to since. Two and four relics of one place worn
 * together answer each other.
 */
export type PlaceId = "hearthfields" | "wychwood" | "deepvaults" | "mire" | "keep";
export const PLACES: readonly PlaceId[] = ["hearthfields", "wychwood", "deepvaults", "mire", "keep"];

/** What a place's relics give together, at two and at four. */
export const PLACE_BONUS: Record<PlaceId, readonly [number, number]> = {
  // Gold, multiplied.
  hearthfields: [1.2, 1.5],
  // The Patience bonus, multiplied.
  wychwood: [1.1, 1.25],
  // Shards of every guardian, multiplied; at four, relics more likely too (see PLACE_SPOILS).
  deepvaults: [1.25, 2],
  // Seconds on every boss timer.
  mire: [2, 5],
  // Damage to the King, multiplied.
  keep: [1.25, 1.75]
};
/** Four relics of the Deepvaults: chance a guardian leaves a relic, added (an elite half). */
export const PLACE_SPOILS = 0.1;
/** Four relics of the Hearthfields: golden rat chance, added (inside its cap). */
export const PLACE_TREASURE = 0.01;

/** Where a relic comes from. */
export function relicPlace(item: Item): PlaceId {
  return PLACES[biomeForStage(item.level).index] ?? "hearthfields";
}

/** How many worn relics come from a place. */
export function placeCount(worn: readonly Item[], place: PlaceId): number {
  return worn.filter((item) => relicPlace(item) === place).length;
}

/** A place's bonus among the relics worn: its value at two or four, or `none`. */
export function placeBonus(worn: readonly Item[], place: PlaceId, none = 1): number {
  const count = placeCount(worn, place);
  return count >= 4 ? PLACE_BONUS[place][1] : count >= 2 ? PLACE_BONUS[place][0] : none;
}

/** Density per stratum below the present night, by rarity: a clearer memory weighs more. */
export const DENSITY_BY_RARITY: Record<Rarity, number> = { common: 0.02, rare: 0.024, epic: 0.027, legendary: 0.03, mythic: 0.032 };

/** The stage a relic is remembered at: where it dropped, or as deep as it was awakened. */
export function relicDepth(item: Item): number {
  return Math.max(item.level, item.depth ?? item.level);
}

/**
 * Awakening (Brom, at the forge): a relic remembered again at the walker's deepest night, in
 * the same place it came from (the same stage of a deeper loop). The deepest such stage.
 */
export function awakenDepth(item: Item, maxStageEver: number): number {
  const loops = Math.floor((maxStageEver - item.level) / 50);
  return item.level + 50 * Math.max(0, loops);
}

/** Strata a relic would go down by awakening it now. */
export function awakenStrata(item: Item, maxStageEver: number): number {
  return Math.max(0, eraForStage(awakenDepth(item, maxStageEver)) - eraForStage(relicDepth(item)));
}

/** Shards an awakening of `strata` strata asks of a relic of this rarity (before discounts). */
export const AWAKEN_SHARDS_PER_STRATUM: Record<Rarity, number> = { common: 20, rare: 60, epic: 160, legendary: 500, mythic: 1600 };

/** Shards awakening a relic now costs (before discounts). */
export function awakenCost(item: Item, maxStageEver: number): number {
  return AWAKEN_SHARDS_PER_STRATUM[item.rarity] * awakenStrata(item, maxStageEver);
}

/**
 * What depth does to the prices of the stall and of Brom's rekindling: the best stage squared,
 * over 100,000 (×1 to stage 446, ×10 at 1000, ×40 at 2000, ×250 at 5000). Shards come about
 * as the square of the depth (the active bot, 2.2: 40 an hour at stage 50, 560 at 1000, 2000
 * at 1800, 5000 at 2900, 18,000 at 4400): so priced, a chest asks about the same play at
 * any depth. The same price everywhere meant nothing deep (675,000 shards bought every
 * boon for good).
 */
export function shardScale(stage: number): number {
  return Math.max(1, Math.floor((stage * stage) / 100_000));
}

/**
 * Rekindling (Brom, at the forge, from save version 20): a relic that remembers lets one trait
 * go and remembers another of its slot, drawn among those it does not hold. Shards before
 * depth, by rarity: the price is this times `shardScale` of the relic's own depth.
 */
export const REKINDLE_SHARDS: Record<Rarity, number> = { common: 0, rare: 0, epic: 100, legendary: 300, mythic: 1000 };

/** Shards rekindling a relic asks (before discounts). */
export function rekindleCost(item: Item): number {
  return REKINDLE_SHARDS[item.rarity] * shardScale(relicDepth(item));
}

/** Shards the rekindlings a relic carries cost at the very least (before discounts): each at the depth it dropped at. */
export function rekindledSpend(item: Item): number {
  return REKINDLE_SHARDS[item.rarity] * shardScale(item.level) * (item.rekindled ?? 0);
}

/** Shards every awakening a relic carries cost at the very least (before discounts). */
export function awakenedSpend(item: Item): number {
  return AWAKEN_SHARDS_PER_STRATUM[item.rarity] * Math.max(0, eraForStage(relicDepth(item)) - eraForStage(item.level));
}
