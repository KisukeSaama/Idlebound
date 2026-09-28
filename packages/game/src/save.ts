import { z } from "zod";
import { ALTAR_REWORK_NOTICE, SAVE_VERSION, createInitialState } from "./state";
import type { GameState } from "./types";

const finite = z.number().refine(Number.isFinite, "invalid number");
const positive = finite.refine((value) => value >= 0, "negative number");
const count = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);

const statBlock = z.object({
  clicks: count,
  crits: count,
  kills: count,
  bosses: count,
  treasures: count,
  goldEarned: positive,
  crystals: count,
  skillsUsed: count,
  maxHit: positive,
  playTime: positive
});

const itemSchema = z.object({
  uid: z.string().min(1).max(40),
  slot: z.enum(["weapon", "armor", "amulet", "ring"]),
  rarity: z.enum(["common", "rare", "epic", "legendary", "mythic"]),
  level: z.number().int().min(1).max(1_000_000),
  base: z.number().int().min(0).max(20).optional(),
  name: z.string().min(1).max(80).optional(),
  affixes: z.array(z.object({
    stat: z.enum(["dps", "click", "gold", "critChance", "critDamage", "bossDamage", "essence"]),
    value: positive
  })).min(1).max(6),
  forge: z.number().int().min(0).max(100),
  locked: z.boolean().optional(),
  named: z.string().max(40).optional()
});

const skillState = z.object({ activeUntil: finite, readyAt: finite });
const skillId = z.enum(["frenzy", "rally", "hawkeye", "goldrain", "ritual", "echo", "unweave"]);
const counter = z.record(z.string().max(40), count);

export const gameStateSchema = z.object({
  version: z.number().int(),
  createdAt: finite,
  lastTickAt: finite,
  lastClickAt: finite,
  gold: positive,
  essences: positive,
  shards: count,
  stage: z.number().int().min(1),
  maxStage: z.number().int().min(1),
  maxStageEver: z.number().int().min(1),
  runStartStage: z.number().int().min(1),
  kills: z.number().int().min(0).max(100),
  autoAdvance: z.boolean(),
  monster: z.object({
    id: z.string().max(60),
    name: z.string().max(120).optional(),
    hp: finite,
    maxHp: positive,
    kind: z.enum(["normal", "treasure", "rare", "miniboss", "boss"]),
    gold: positive,
    event: z.enum(["seam", "quiet", "stray", "unfinished"]).optional(),
    wager: z.object({ clicks: count, until: finite }).optional(),
    eclipse: z.boolean().optional()
  }).nullable(),
  respawnIn: finite,
  bossTimeLeft: finite,
  heroLevels: z.record(z.string().max(40), z.number().int().min(0).max(1_000_000)),
  heroUpgrades: z.array(z.string().max(40)).max(500),
  skills: z.partialRecord(skillId, skillState),
  lastSkill: skillId.optional(),
  ritualStacks: count,
  buffs: z.array(z.object({ id: z.enum(["rage", "fortune", "autoclick", "overcharge", "sharpness", "walker", "cheese", "lantern", "reunion"]), until: finite })).max(12),
  altars: z.record(z.string().max(40), z.number().int().min(0).max(1_000_000)),
  achievements: z.array(z.string().max(40)).max(500),
  equipment: z.partialRecord(z.enum(["weapon", "armor", "amulet", "ring"]), itemSchema),
  inventory: z.array(itemSchema).max(200),
  crystal: z.object({ id: z.string().max(40), expiresAt: finite, x: finite, y: finite, storm: z.number().int().min(0).max(10).optional() }).nullable(),
  nextCrystalAt: finite,
  run: statBlock,
  lifetime: statBlock.extend({
    ascensions: count,
    essencesEarned: positive,
    shardsEarned: count,
    itemsFound: count,
    legendaries: count,
    mythics: count,
    bossFails: count,
    offlineSeconds: positive,
    hourglasses: count,
    bestLevelSum: count,
    bestHired: count,
    kings: count,
    seams: count,
    threads: count
  }),
  ascensions: z.array(z.object({ at: finite, maxStage: z.number().int().min(1), essences: positive, threads: count.optional() })).max(200),
  settings: z.object({
    notation: z.enum(["letters", "scientific", "engineering"]),
    sound: z.boolean(),
    volume: z.number().min(0).max(1),
    damageNumbers: z.boolean(),
    reducedMotion: z.boolean(),
    confirmAscension: z.boolean(),
    buyMode: z.union([z.literal(1), z.literal(10), z.literal(25), z.literal(100), z.literal("max")]),
    offlineSpending: z.boolean(),
    darkNight: z.boolean()
  }),
  tutorial: z.object({ done: z.array(z.string().max(40)).max(50) }),
  bestiary: z.record(z.string().max(40), count),
  lore: z.object({
    echoes: z.record(z.string().max(40), z.number().int().min(0).max(1_000_000)),
    ages: z.record(z.string().max(4), z.number().int().min(0).max(1_000_000)),
    regalia: count,
    songs: count,
    dreams: count,
    sayings: count,
    lessons: z.array(z.string().max(40)).max(20),
    nightSeconds: positive,
    lastSeconds: count,
    biscuit: count,
    tongues: z.object({ fr: positive, en: positive }),
    readings: z.array(z.number().int().min(0).max(60)).max(1_000),
    events: z.array(z.string().max(20)).max(20),
    altars: z.array(z.string().max(20)).max(20),
    seen: z.record(z.string().max(20), count)
  }),
  recognition: counter,
  named: z.array(z.string().max(40)).max(100),
  secrets: z.array(z.string().max(40)).max(100),
  trail: z.object({
    wanderers: z.array(z.string().max(40)).max(20),
    fieldKills: count,
    rest: count,
    evenRats: count,
    offered: positive,
    listen: positive,
    migration: z.object({ stage: z.number().int().min(1), biome: z.string().max(40) }).optional(),
    wound: z.object({ stage: z.number().int().min(1), share: z.number().min(0).max(1) }).optional(),
    eclipse: z.boolean().optional()
  }),
  descents: count,
  threads: count,
  weaves: counter,
  descentMark: positive,
  caravanWeek: z.string().max(10)
});

/** Fills a save with the fields added since it was written. */
export function migrateState(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const base = createInitialState(0);
  const input = raw as Record<string, unknown>;
  const merged: Record<string, unknown> = { ...base, ...input };
  merged.settings = { ...base.settings, ...(input.settings as object | undefined) };
  merged.lifetime = { ...base.lifetime, ...(input.lifetime as object | undefined) };
  merged.run = { ...base.run, ...(input.run as object | undefined) };
  merged.tutorial = { ...base.tutorial, ...(input.tutorial as object | undefined) };
  merged.lore = { ...base.lore, ...(input.lore as object | undefined) };
  (merged.lore as Record<string, unknown>).tongues = { ...base.lore.tongues, ...((input.lore as { tongues?: object } | undefined)?.tongues) };
  merged.trail = { ...base.trail, ...(input.trail as object | undefined) };
  const version = typeof input.version === "number" ? input.version : 0;
  if (version < 4) {
    refundLegacyAltars(merged);
    // The rework notice is for these saves, even when their tutorial came from the defaults.
    const tutorial = merged.tutorial as { done?: unknown };
    if (Array.isArray(tutorial.done)) merged.tutorial = { ...tutorial, done: tutorial.done.filter((id) => id !== ALTAR_REWORK_NOTICE) };
  }
  if (version < 5 && merged.monster && typeof merged.monster === "object") {
    // Version 5 draws monsters from their art recipe: the painted image, its CSS filter and
    // its scale are no longer part of the state.
    const { image: _image, filter: _filter, scale: _scale, ...monster } = merged.monster as Record<string, unknown>;
    merged.monster = monster;
  }
  // Version 6 added the Chronicle (Bestiary, echoes, Recognition, named relics, secrets):
  // an older save starts it empty from the defaults above, and fills it by playing.
  if (version < 7) renameCreatures(merged);
  // Version 8 told the whole story (strata, the King's Words and forms, fragments, events,
  // secrets, the Descent): the new counters start from the defaults above. Kings beaten
  // before it are the King stages already cleared (one each at least), so the deed of the
  // first King is not lost; the Chronicle rebuilds the rest from the counters it has.
  if (version < 8) {
    const lifetime = merged.lifetime as Record<string, unknown>;
    const deepest = typeof merged.maxStageEver === "number" ? merged.maxStageEver : 1;
    const bestiary = merged.bestiary as Record<string, unknown> | undefined;
    const met = bestiary && typeof bestiary["ruined-king"] === "number" ? (bestiary["ruined-king"] as number) : 0;
    if (typeof lifetime.kings !== "number" || lifetime.kings === 0) lifetime.kings = Math.max(met, Math.floor((Math.max(1, deepest) - 1) / 50));
  }
  merged.version = SAVE_VERSION;
  return merged;
}

/**
 * Version 7 redrew the bestiary by hand, and some creatures became others in the same place
 * of the road. Their Bestiary kills carry over to the creature that took their place (a
 * completed page stays complete), and a monster on the road becomes its successor.
 */
export const RENAMED_CREATURES: Readonly<Record<string, string>> = {
  "rabid-rat": "carrion-crow",
  "tusk-king": "last-reaper",
  "blight-boar": "grove-spinner",
  "briar-matron": "root-knight",
  "deep-wolf": "crystal-mite",
  "howling-swarm": "miner-shade",
  "putrid-crawler": "rot-toad",
  "marsh-hag": "will-o-wisp",
  "royal-hound": "hour-gargoyle",
  "crown-bat": "banner-wraith"
};

function renameCreatures(merged: Record<string, unknown>) {
  const bestiary = merged.bestiary;
  if (bestiary && typeof bestiary === "object") {
    const counts = { ...(bestiary as Record<string, unknown>) };
    for (const [from, to] of Object.entries(RENAMED_CREATURES)) {
      if (!Object.hasOwn(counts, from)) continue;
      const moved = counts[from];
      delete counts[from];
      if (typeof moved === "number") counts[to] = (typeof counts[to] === "number" ? (counts[to] as number) : 0) + moved;
    }
    merged.bestiary = counts;
  }
  const monster = merged.monster as Record<string, unknown> | null | undefined;
  if (monster && typeof monster === "object" && typeof monster.id === "string" && Object.hasOwn(RENAMED_CREATURES, monster.id)) {
    const { name: _name, ...rest } = monster;
    merged.monster = { ...rest, id: RENAMED_CREATURES[monster.id] };
  }
}

/**
 * Altar prices up to save version 3 (linear: base × (level + 1); exp: base × growth^level).
 * Version 4 reworked the altars, so their levels are refunded once, at these prices.
 */
const LEGACY_ALTARS: Record<string, { base: number; growth: number; linear: boolean }> = {
  might: { base: 1, growth: 1, linear: true },
  blade: { base: 1, growth: 1, linear: true },
  fortune: { base: 1, growth: 1, linear: true },
  patience: { base: 1, growth: 1, linear: true },
  time: { base: 2, growth: 1.35, linear: false },
  fate: { base: 2, growth: 1, linear: true },
  precision: { base: 3, growth: 1.3, linear: false },
  treasure: { base: 3, growth: 1.35, linear: false },
  bargain: { base: 4, growth: 1.4, linear: false },
  echoes: { base: 5, growth: 1.6, linear: false },
  harvest: { base: 5, growth: 1.25, linear: false },
  wanderer: { base: 5, growth: 2, linear: false },
  memory: { base: 10, growth: 1.5, linear: false }
};

/** Essences a version 3 save spent on an altar (a hair under the rounded-up prices). */
export function legacyAltarSpend(id: string, level: number): number {
  const legacy = Object.hasOwn(LEGACY_ALTARS, id) ? LEGACY_ALTARS[id] : undefined;
  if (!legacy || !(level > 0)) return 0;
  if (legacy.linear) return (legacy.base * level * (level + 1)) / 2;
  return (legacy.base * (Math.pow(legacy.growth, level) - 1)) / (legacy.growth - 1);
}

/**
 * Version 4 reworked the altars: every level of an older save goes back to the owned
 * essences and the player chooses again. The essence ledger still holds (what leaves the
 * altars returns to the owned essences), and it runs once: the version is then 4.
 */
function refundLegacyAltars(merged: Record<string, unknown>) {
  const altars = merged.altars;
  if (!altars || typeof altars !== "object" || typeof merged.essences !== "number") return;
  let refund = 0;
  for (const [id, level] of Object.entries(altars as Record<string, unknown>)) {
    if (typeof level === "number" && Number.isFinite(level)) refund += legacyAltarSpend(id, level);
  }
  merged.altars = {};
  merged.essences = merged.essences + refund;
}

export function parseState(raw: unknown): GameState {
  const parsed = gameStateSchema.parse(migrateState(raw));
  if (parsed.stage > parsed.maxStage || parsed.maxStage > parsed.maxStageEver) {
    throw new Error("Inconsistent progression.");
  }
  return parsed as GameState;
}

export function safeParseState(raw: unknown): { ok: true; state: GameState } | { ok: false; error: string } {
  try {
    return { ok: true, state: parseState(raw) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid save." };
  }
}
