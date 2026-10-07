import type { GameState } from "../types";
import { BIOMES } from "./biomes";
import { lookup } from "./lookup";

/**
 * The story systems of the Chronicle (BIBLE 12): the Bestiary, echoes, rare wanderers,
 * Recognition, secrets and the pools of written fragments. Numbers and ids only; every
 * word lives in `content/`.
 */

export type BestiaryPage = "green-plains" | "dark-forest" | "forgotten-caves" | "corrupted-marsh" | "fallen-king-ruins" | "specials" | "kings";

export interface BestiaryEntry {
  id: string;
  page: BestiaryPage;
  /** Kills (or sightings) that unlock the entry's three lines. */
  tiers: readonly [number, number, number];
}

const COMMON_TIERS = [1, 100, 1_000] as const;
/** Creatures met at most once a run (rare wanderers) or once an event. */
const RARE_TIERS = [1, 5, 25] as const;
/** The King in a given form is met once a stratum, and the deepest forms rarely. */
const KING_TIERS = [1, 10, 100] as const;

/** Every creature the Ledger keeps a page for, in reading order (BIBLE 8). */
export const BESTIARY: readonly BestiaryEntry[] = [
  ...BIOMES.flatMap((biome) => [
    ...biome.monsters.map((monster): BestiaryEntry => ({ id: monster.id, page: biome.id as BestiaryPage, tiers: COMMON_TIERS })),
    { id: biome.miniBoss.id, page: biome.id as BestiaryPage, tiers: COMMON_TIERS },
    { id: biome.boss.id, page: biome.id as BestiaryPage, tiers: biome.index === 4 ? KING_TIERS : COMMON_TIERS }
  ]),
  { id: "lost-shepherd", page: "green-plains", tiers: RARE_TIERS },
  { id: "weeping-stag", page: "dark-forest", tiers: RARE_TIERS },
  { id: "singing-geode", page: "forgotten-caves", tiers: RARE_TIERS },
  { id: "ferryman", page: "corrupted-marsh", tiers: RARE_TIERS },
  { id: "court-jester", page: "fallen-king-ruins", tiers: RARE_TIERS },
  { id: "golden-rat", page: "specials", tiers: COMMON_TIERS },
  { id: "lantern-queen", page: "specials", tiers: RARE_TIERS },
  { id: "seam-warden", page: "specials", tiers: RARE_TIERS },
  { id: "walker-echo", page: "specials", tiers: RARE_TIERS },
  { id: "the-quiet", page: "specials", tiers: RARE_TIERS },
  { id: "stray-armor", page: "specials", tiers: RARE_TIERS },
  { id: "the-dawn", page: "specials", tiers: RARE_TIERS },
  { id: "titan-king", page: "kings", tiers: KING_TIERS },
  { id: "hallowed-king", page: "kings", tiers: KING_TIERS },
  { id: "star-crowned", page: "kings", tiers: KING_TIERS },
  { id: "woven-king", page: "kings", tiers: KING_TIERS },
  { id: "sketched-king", page: "kings", tiers: KING_TIERS },
  { id: "king-name", page: "kings", tiers: KING_TIERS },
  { id: "sleeping-king", page: "kings", tiers: KING_TIERS },
  { id: "window-king", page: "kings", tiers: KING_TIERS },
  { id: "hollow-crown", page: "kings", tiers: KING_TIERS },
  { id: "blank-king", page: "kings", tiers: KING_TIERS },
  { id: "aldemar", page: "kings", tiers: KING_TIERS }
];

export const BESTIARY_BY_ID: Record<string, BestiaryEntry> = lookup(BESTIARY.map((entry) => [entry.id, entry]));

/** Pages whose completion (every creature met) raises gold, and by how much. */
export const BESTIARY_GOLD_PAGES: readonly BestiaryPage[] = ["green-plains", "dark-forest", "forgotten-caves", "corrupted-marsh", "fallen-king-ruins"];
export const BESTIARY_PAGE_GOLD = 0.01;

/** Pages in reading order. */
export const BESTIARY_PAGES: readonly BestiaryPage[] = [...BESTIARY_GOLD_PAGES, "specials", "kings"];

/** Lines of an entry unlocked by a kill count (0 to 3). */
export function bestiaryTier(entry: BestiaryEntry, kills: number): number {
  return entry.tiers.filter((threshold) => kills >= threshold).length;
}

export function bestiaryKills(state: GameState, id: string): number {
  return Object.hasOwn(state.bestiary, id) ? state.bestiary[id] : 0;
}

/** Creatures met at least once. */
export function bestiaryMet(state: GameState): number {
  return BESTIARY.filter((entry) => bestiaryKills(state, entry.id) > 0).length;
}

/** The creatures of each page, in the Bestiary's order. */
const PAGE_CREATURES = new Map<BestiaryPage, string[]>();
for (const entry of BESTIARY) {
  if (!PAGE_CREATURES.has(entry.page)) PAGE_CREATURES.set(entry.page, []);
  PAGE_CREATURES.get(entry.page)!.push(entry.id);
}

/** Whether every creature of a page has been met. */
export function bestiaryPageComplete(state: GameState, page: BestiaryPage): boolean {
  return (PAGE_CREATURES.get(page) ?? []).every((id) => bestiaryKills(state, id) > 0);
}

/** Gold bonus of the completed Bestiary pages. */
export function bestiaryGoldBonus(state: GameState): number {
  return BESTIARY_GOLD_PAGES.filter((page) => bestiaryPageComplete(state, page)).length * BESTIARY_PAGE_GOLD;
}

// ---------------------------------------------------------------- rare wanderers

export interface WandererDef {
  id: string;
  biome: string;
  /** Chance per normal spawn on the biome's stages. */
  chance: number;
  /** Gold multiplier over a normal monster of the stage. */
  gold: number;
}

/** One rare wanderer per biome (BIBLE 8): met at most once a run. */
export const WANDERERS: readonly WandererDef[] = [
  { id: "lost-shepherd", biome: "green-plains", chance: 0.005, gold: 5 },
  { id: "weeping-stag", biome: "dark-forest", chance: 0.005, gold: 5 },
  { id: "singing-geode", biome: "forgotten-caves", chance: 0.005, gold: 5 },
  { id: "ferryman", biome: "corrupted-marsh", chance: 0.005, gold: 5 },
  { id: "court-jester", biome: "fallen-king-ruins", chance: 0.005, gold: 5 }
];

export const WANDERER_BY_BIOME: Record<string, WandererDef> = lookup(WANDERERS.map((wanderer) => [wanderer.biome, wanderer]));
export const WANDERER_BY_ID: Record<string, WandererDef> = lookup(WANDERERS.map((wanderer) => [wanderer.id, wanderer]));

// ---------------------------------------------------------------- echoes

/** Echoes written by hand per biome; past them the fragment grammar speaks (BIBLE 17). */
export const BIOME_ECHOES: Record<string, number> = lookup(BIOMES.map((biome) => [biome.id, 12]));
/** Chance of an echo on a guardian's first clear, raised by the depth of the stratum. */
export const ECHO_CHANCE = 0.15;
export const ECHO_CHANCE_PER_ERA = 0.05;

export function echoChance(era: number, found: number): number {
  // The first echo of a biome always comes back: the story starts on the first guardian.
  if (found === 0) return 1;
  return Math.min(1, ECHO_CHANCE + ECHO_CHANCE_PER_ERA * era);
}

export function echoesFound(state: GameState, biomeId: string): number {
  return Object.hasOwn(state.lore.echoes, biomeId) ? state.lore.echoes[biomeId] : 0;
}

/**
 * Age echoes (BIBLE 17.1): eight written by hand per Age (Lysandre's notes, unknown hands),
 * then the grammar. The King's first clear in an Age brings one back; a Seam closed there
 * brings one too.
 */
export const AGE_ECHOES = 8;

export function ageEchoesFound(state: GameState, age: number): number {
  const key = String(age);
  return Object.hasOwn(state.lore.ages, key) ? state.lore.ages[key] : 0;
}

// ---------------------------------------------------------------- written pools

/** The King's Words written by hand, one per ascension (BIBLE 12.4); the grammar goes on after. */
export const KING_WORDS = 50;
/** The King's Words while the walker wears the Regalia (BIBLE 11.5). */
export const REGALIA_WORDS = 12;
/** Words of the King's Eclipse, one per eclipse, in order, then again from the first. */
export const ECLIPSE_WORDS = 7;
/** What stays after a long absence (BIBLE 12.8), one line; the grammar goes on after. */
export const DREAMS = 24;
/** A catch-up this long leaves one line in the scene and the Chronicle. */
export const DREAM_MIN_SECONDS = 3_600;
/** Célestine's crystal songs; a caught crystal sings one this often. */
export const SONGS = 30;
export const SONG_CHANCE = 0.05;
/** The Stallkeeper's sayings, one per visit to the stall, in turn. */
export const SAYINGS = 12;

// ---------------------------------------------------------------- Recognition

/**
 * Runs of Recognition that raise a companion to each tier: a night with them at level 100
 * or more counts once, twice when it kept one of the two promises their last memories wait
 * for. The last tier asks two runs more since promises came (save version 10): those two
 * words give them back, and the Loom still opens around day 8 to 9.
 */
export const RECOGNITION_TIERS = [1, 3, 7, 15, 32] as const;
/** The tiers before promises (save version 9 and older): what a companion remembered then, they keep. */
export const LEGACY_RECOGNITION_TIERS = [1, 3, 7, 15, 30] as const;
export const RECOGNITION_LEVEL = 100;
/** A companion who fully remembers the walker fights 10% harder. */
export const RECOGNITION_DPS = 0.1;
/** Every companion remembers (Aldric is the walker: nobody needs to remember him). */
export const RECOGNITION_HEROES: readonly string[] = [
  "maelle", "brom", "ysolde", "cendre", "nyx", "garrick", "seraphine", "thorvald", "mirelle", "kaelen",
  "oriane", "vorn", "lysandre", "ashka", "nameless", "eldra", "morgrath", "celestine", "aurelion", "awakened"
];

export function recognitionRuns(state: GameState, heroId: string): number {
  return Object.hasOwn(state.recognition, heroId) ? state.recognition[heroId] : 0;
}

/** The tiers' thresholds at each Kinship level met: `recognitionTier` asks for them all the time. */
const THRESHOLDS_BY_KINSHIP = new Map<number, readonly number[]>();

/** Runs needed for each tier, lowered by the Kinship weave (never under one run a tier). */
export function recognitionThresholds(state: GameState, tiers: readonly number[] = RECOGNITION_TIERS): readonly number[] {
  const kinship = Object.hasOwn(state.weaves, "kinship") ? state.weaves.kinship ?? 0 : 0;
  const known = tiers === RECOGNITION_TIERS ? THRESHOLDS_BY_KINSHIP.get(kinship) : undefined;
  if (known) return known;
  const thresholds = tiers.map((threshold, index) => Math.max(index + 1, threshold - kinship));
  if (tiers === RECOGNITION_TIERS) THRESHOLDS_BY_KINSHIP.set(kinship, thresholds);
  return thresholds;
}

/**
 * Promises kept that each tier asks on top of its runs (BIBLE 12.11): the last two memories
 * are only given to a walker who kept their word, once each.
 */
export const RECOGNITION_PROMISES = [0, 0, 0, 1, 2] as const;

/** The tier the runs alone give: the rule before promises (save version 9 and older). */
export function recognitionTierByRuns(runs: number, thresholds: readonly number[]): number {
  return thresholds.filter((threshold) => runs >= threshold).length;
}

/** The tier a companion already held when promises came: it stays, and the tiers above ask only what is left. */
export function rememberedTier(state: GameState, heroId: string): number {
  return Object.hasOwn(state.remembered, heroId) ? state.remembered[heroId] : 0;
}

/** Recognition tier of a companion, 0 to 5. */
export function recognitionTier(state: GameState, heroId: string): number {
  if (!RECOGNITION_HEROES.includes(heroId)) return 0;
  const runs = recognitionRuns(state, heroId);
  const kept = Object.hasOwn(state.promises, heroId) ? state.promises[heroId] : 0;
  const held = rememberedTier(state, heroId);
  const already = held > 0 ? RECOGNITION_PROMISES[held - 1] : 0;
  const thresholds = recognitionThresholds(state);
  let tier = 0;
  for (let index = 0; index < thresholds.length; index += 1) {
    if (runs < thresholds[index] || kept < RECOGNITION_PROMISES[index] - already) break;
    tier = index + 1;
  }
  return Math.max(tier, held);
}

/**
 * Promises a companion's memories still wait for (two in all, one for each of the last two,
 * less what they held before promises came). Only those count a night twice: a word kept
 * past them is remembered like any night.
 */
export function promisesAwaited(state: GameState, heroId: string): number {
  if (!RECOGNITION_HEROES.includes(heroId)) return 0;
  const held = rememberedTier(state, heroId);
  const already = held > 0 ? RECOGNITION_PROMISES[held - 1] : 0;
  const kept = Object.hasOwn(state.promises, heroId) ? state.promises[heroId] : 0;
  return Math.max(0, RECOGNITION_PROMISES[RECOGNITION_PROMISES.length - 1] - already - kept);
}

/** What keeps a companion from their next memory: runs with them still to walk, promises still to keep. */
export function recognitionNeeds(state: GameState, heroId: string): { runs: number; promises: number } | null {
  const tier = recognitionTier(state, heroId);
  const thresholds = recognitionThresholds(state);
  if (!RECOGNITION_HEROES.includes(heroId) || tier >= thresholds.length) return null;
  const held = rememberedTier(state, heroId);
  const already = held > 0 ? RECOGNITION_PROMISES[held - 1] : 0;
  const kept = Object.hasOwn(state.promises, heroId) ? state.promises[heroId] : 0;
  return {
    runs: Math.max(0, thresholds[tier] - recognitionRuns(state, heroId)),
    promises: Math.max(0, RECOGNITION_PROMISES[tier] - already - kept)
  };
}

/** Companions who fully remember the walker. */
export function rememberedCompanions(state: GameState): number {
  return RECOGNITION_HEROES.filter((hero) => recognitionTier(state, hero) >= 5).length;
}

/** Aldric's talents, each a Lesson the first time it is ever bought (BIBLE 10.2). */
export const LESSONS: readonly string[] = ["aldric-10", "aldric-25", "aldric-50", "aldric-75", "aldric-100", "aldric-150", "aldric-200"];

// ---------------------------------------------------------------- secrets

export type SecretId =
  | "let-him-rest"
  | "even"
  | "faceless"
  | "small-change"
  | "night-owl"
  | "thousandth-notch"
  | "same-road"
  | "keep-some"
  | "how-it-starts"
  | "empty-hands"
  | "pacifist"
  | "last-second"
  | "listening"
  | "good-boy"
  | "till-death"
  | "last-blow"
  | "it-wears-you"
  | "behind-the-glass"
  | "two-tongues"
  | "welcome-back";

export interface SecretDef {
  id: SecretId;
  /** Its number among the twenty secrets (BIBLE 15), which is also its deed's tier. */
  deed: number;
}

export const SECRETS: readonly SecretDef[] = ([
  "let-him-rest", "even", "faceless", "small-change", "night-owl", "thousandth-notch", "same-road", "keep-some", "how-it-starts", "empty-hands",
  "pacifist", "last-second", "listening", "good-boy", "till-death", "last-blow", "it-wears-you", "behind-the-glass", "two-tongues", "welcome-back"
] as const).map((id, index) => ({ id, deed: index + 1 }));

export const SECRET_IDS: readonly string[] = SECRETS.map((secret) => secret.id);

/** Night Owl: an hour of play between midnight and four in the morning, local time. */
export const NIGHT_OWL_SECONDS = 3_600;
export const NIGHT_HOURS: readonly [number, number] = [0, 4];
/** The Thousandth Notch: kills on the Hearthfields' first stretch (stages 1 to 10) in one run. */
export const NOTCH_KILLS = 1_000;
export const NOTCH_LAST_STAGE = 10;
/** Let Him Rest: the King's timer runs out this many times in a row at stage 50, untouched. */
export const REST_FAILS = 3;
export const REST_STAGE = 50;
/** Even: golden rats caught in one run with Thorvald at level 50 or more. */
export const EVEN_RATS = 100;
export const EVEN_THORVALD_LEVEL = 50;
/** Faceless: Nyx's portrait touched this many times within this many milliseconds. */
export const FACELESS_TOUCHES = 7;
export const FACELESS_WINDOW_MS = 3_000;
/** Same Road: ascensions in a row from the same best stage. */
export const SAME_ROAD_NIGHTS = 3;
/** Keep Some / That's How It Starts: essences held at dusk, or spent in one visit to the Sanctum. */
export const KEEP_SOME_ESSENCES = 1_000;

/**
 * The walker gave all of themselves away this night: a thousand essences offered, none
 * kept. The road to the Nameless (BIBLE 4): the name starts to go, until one is held again.
 */
export function givingAllAway(state: GameState): boolean {
  return state.essences < 1 && state.trail.offered >= KEEP_SOME_ESSENCES;
}
/** The Last Second: guardians beaten with this little time left, this many times. */
export const LAST_SECOND_LEFT = 0.5;
export const LAST_SECOND_TIMES = 7;
/** Listening: an hour in the Deepvaults, watched and untouched. */
export const LISTEN_SECONDS = 3_600;
/** Good Boy: runs with Vorn at level 150 or more. */
export const GOOD_BOY_RUNS = 10;
export const GOOD_BOY_LEVEL = 150;
/** It Wears You: after this many Descents, the fifth slot, held this long. */
export const CROWN_DESCENTS = 10;
export const CROWN_HOLD_MS = 5_000;
/** Two Tongues: an hour in each language. */
export const TONGUE_SECONDS = 3_600;
/** Welcome Back: away this long between two games opened. */
export const WELCOME_BACK_MS = 30 * 86_400_000;
/** Behind the Glass: the Dreamer's Room (Age IX, index 8). */
export const GLASS_AGE = 8;
