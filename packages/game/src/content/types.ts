import type { AchievementCategory } from "../data/achievements";
import type { CaravanWareId } from "../data/caravan";
import type { CutsceneId } from "../data/cutscenes";
import type { WeaveId } from "../data/descent";
import type { EventId } from "../data/events";
import type { AffixStat, AltarId, ItemSlot, Rarity, SkillId } from "../types";
import type { MarketOfferId } from "../data/market";
import type { BestiaryPage, SecretId } from "../data/lore";
import type { NamedEffect } from "../data/relics";
import type { MilestoneId } from "../data/strata";

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

/** A line of the Chronicle and the voice that says it. */
export interface LoreLine {
  by: string;
  text: string;
}

/**
 * A companion's promise (BIBLE 12.11), in their own voice: what they ask at dusk, what they
 * say when the walker kept their word, and when it was broken.
 */
export interface PromiseText {
  ask: string;
  kept: string;
  broken: string;
}

/** Five memories, one per tier of Recognition. */
export type Memories = readonly [LoreLine, LoreLine, LoreLine, LoreLine, LoreLine];

/** The strata of the Long Night (BIBLE 9): their tags, the Ages, the keystones. */
export interface StrataText {
  /** Tag of each of the sixty eras (index = era). Era 0, the present night, has none: "". */
  tags: readonly string[];
  /** Names of the twelve Ages, from the Kingdom to the First Mark. */
  ages: readonly string[];
  /** The keystone of each stratum (index = era), found on the first clear of its last stage. */
  keystones: readonly LoreLine[];
  /** Keystones of the walker's own milestones (BIBLE 17.1). */
  milestones: Record<MilestoneId, LoreLine>;
}

/** The voices that come back night after night (BIBLE 12.4, 12.8, 17.1). */
export interface VoicesText {
  /** The King's Words, one per ascension, in order (50). The King speaks them. */
  kingWords: readonly string[];
  /** What the King says when his seam first closes on a walker who never passed him (1). */
  kingRepels: readonly string[];
  /** What the King says instead while the walker wears the Regalia (12). */
  regaliaWords: readonly string[];
  /** The King's Eclipse: what he says, shadowed (7). */
  eclipseWords: readonly string[];
  /** What stays after a long absence: one image, nobody speaks (24). */
  dreams: readonly string[];
  /** Célestine's crystal songs (30). */
  songs: readonly string[];
  /** The Stallkeeper's sayings, one per visit to the stall (12). */
  sayings: readonly string[];
}

/** One of the Ledger's scenes: its name in the Hall, and one line per shot ("" for silence). */
export interface CutsceneText {
  name: string;
  lines: readonly string[];
}

/** An event of the Long Night: its name, the toast when it happens, the fragment it leaves. */
export interface EventText {
  name: string;
  text: string;
  line: LoreLine;
}

/**
 * Every player-facing string of the game content, for one locale. Mechanics (numbers,
 * ids, formulas) live in `data/`; only words live here.
 */
export interface GameText {
  biomes: Record<string, NameText>;
  /** Monster, mini-boss and boss names, by monster id. */
  monsters: Record<string, string>;
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

  /** The line the scene shows as a new run begins at stage 1. */
  openingLine: string;
  /** Bestiary: three lines per creature, unlocked by its kill counts (the Ledger speaks). */
  bestiary: Record<string, readonly [string, string, string]>;
  bestiaryPages: Record<BestiaryPage, string>;
  /** Biome echoes, in the order guardians bring them back. */
  echoes: Record<string, readonly LoreLine[]>;
  /** The fragment a rare wanderer leaves on its first defeat. */
  wanderers: Record<string, LoreLine>;
  /** Recognition memories of the companions whose arc is written. */
  memories: Record<string, Memories>;
  /** What a companion says when hired: as a stranger, half remembered, remembered. */
  hireLines: Record<string, readonly [string, string, string]>;
  /** What each companion asks at dusk, and says of a word kept or broken. */
  promises: Record<string, PromiseText>;
  /** Named relics: name and legend. */
  relics: Record<string, { name: string; legend: string }>;
  /** The unique effect of a named relic. */
  namedEffects: Record<NamedEffect["kind"], (pct: number) => string>;
  /** Secrets: the deed's name, its riddle while hidden, and the line found with it. */
  secrets: Record<SecretId, { name: string; riddle: string; line: LoreLine }>;
  events: Record<EventId, EventText>;

  strata: StrataText;
  voices: VoicesText;
  /** Age echoes: eight per Age, in the order they come back (index = Age). */
  ageEchoes: readonly (readonly LoreLine[])[];
  /** Places outside the road: the Sanctum of Dusk, Eldra's Loom, the Dawn. */
  places: Record<"sanctum" | "loom" | "dawn", NameText>;
  /** Aldric's Lessons, by the id of the talent that teaches them (BIBLE 10.2). */
  lessons: Record<string, LoreLine>;
  /** Who raised each altar, and what they left in the stone (shown from level 5). */
  altarLegends: Record<AltarId, LoreLine>;
  /** The Weaves of Eldra's Loom. */
  weaves: Record<WeaveId, NameText>;
  /** The Caravan's wares. */
  caravan: Record<CaravanWareId, NameText>;
  /** The Crown of Orvane: it cannot be worn (BIBLE 11.5). */
  crown: { name: string; hover: string; legend: LoreLine };
  /** The Ledger's scenes, told at a few moments of the Long Night. */
  cutscenes: Record<CutsceneId, CutsceneText>;
  /** Names of the voices that speak without a line of their own: the King, the Stallkeeper, Célestine. */
  speakers: { king: string; stallkeeper: string; ledger: string };
}

/** The places of the road and beyond: biome descriptions, echoes, wanderers, special places. */
export interface PlacesText {
  biomes: Record<string, NameText>;
  echoes: Record<string, readonly LoreLine[]>;
  wanderers: Record<string, LoreLine>;
  places: Record<"sanctum" | "loom" | "dawn", NameText>;
}

/** Names and Bestiary lines of the creatures, and the names of the Bestiary's pages. */
export interface BestiaryText {
  monsters: Record<string, string>;
  lines: Record<string, readonly [string, string, string]>;
  pages: Record<BestiaryPage, string>;
}

/** The company: Recognition memories, hire lines, Aldric's Lessons. */
export interface CompanyText {
  memories: Record<string, Memories>;
  hireLines: Record<string, readonly [string, string, string]>;
  lessons: Record<string, LoreLine>;
}

/** Relics, altars, secrets, events, deeds, the Loom and the Caravan. */
export interface SystemsText {
  relics: Record<string, { name: string; legend: string }>;
  namedEffects: Record<NamedEffect["kind"], (pct: number) => string>;
  altarLegends: Record<AltarId, LoreLine>;
  secrets: Record<SecretId, { name: string; riddle: string; line: LoreLine }>;
  events: Record<EventId, EventText>;
  /** Full name lists of the series this adds or extends (stage, ascend, essences and the new ones). */
  achievementNames: Record<string, readonly string[]>;
  achievementDescriptions: Record<string, (threshold: number) => string>;
  weaves: Record<WeaveId, NameText>;
  caravan: Record<CaravanWareId, NameText>;
  unweave: NameText;
  crown: { name: string; hover: string; legend: LoreLine };
}
