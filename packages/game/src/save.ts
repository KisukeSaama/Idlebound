import { z } from "zod";
import { WEAVE_LEVEL_MAX } from "./data/descent";
import { MAX_STAGE } from "./formulas";
import { migrateState } from "./migrate";
import type { GameState } from "./types";

export { RENAMED_CREATURES, legacyAltarSpend, migrateState } from "./migrate";

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
const stageNumber = z.number().int().min(1).max(MAX_STAGE);
/**
 * A record keyed by game ids, with at most `max` entries (well above the game's data): the
 * server's checks walk every entry, so a save cannot make them walk a thousand junk keys.
 */
function idRecord<T extends z.ZodType>(value: T, max: number, keyLength = 40) {
  return z.record(z.string().max(keyLength), value).refine((entries) => Object.keys(entries).length <= max, "too many entries");
}
const level = z.number().int().min(0).max(1_000_000);

export const gameStateSchema = z.object({
  version: z.number().int(),
  createdAt: finite,
  lastTickAt: finite,
  lastClickAt: finite,
  gold: positive,
  essences: positive,
  shards: count,
  stage: stageNumber,
  maxStage: stageNumber,
  maxStageEver: stageNumber,
  runStartStage: stageNumber,
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
  heroLevels: idRecord(level, 100),
  heroUpgrades: z.array(z.string().max(40)).max(500),
  skills: z.partialRecord(skillId, skillState),
  lastSkill: skillId.optional(),
  ritualStacks: count,
  buffs: z.array(z.object({ id: z.enum(["rage", "fortune", "autoclick", "overcharge", "sharpness", "walker", "cheese", "lantern", "reunion"]), until: finite })).max(12),
  altars: idRecord(level, 50),
  achievements: z.array(z.string().max(40)).max(500),
  equipment: z.partialRecord(z.enum(["weapon", "armor", "amulet", "ring"]), itemSchema),
  inventory: z.array(itemSchema).max(200),
  crystal: z.object({ id: z.string().max(40), expiresAt: finite, x: finite, y: finite, storm: z.number().int().min(0).max(10).optional() }).nullable(),
  nextCrystalAt: finite,
  run: statBlock,
  lifetime: statBlock.extend({
    ascensions: count,
    essencesEarned: positive,
    ascensionEssences: positive,
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
  ascensions: z.array(z.object({ at: finite, maxStage: stageNumber, essences: positive, threads: count.optional() })).max(200),
  settings: z.object({
    notation: z.enum(["letters", "scientific", "engineering"]),
    sound: z.boolean(),
    volume: z.number().min(0).max(1),
    damageNumbers: z.boolean(),
    reducedMotion: z.boolean(),
    confirmAscension: z.boolean(),
    buyMode: z.union([z.literal(1), z.literal(10), z.literal(25), z.literal(100), z.literal("max")]),
    offlineSpending: z.boolean(),
    darkNight: z.boolean(),
    colorblind: z.boolean()
  }),
  tutorial: z.object({ done: z.array(z.string().max(40)).max(50) }),
  bestiary: idRecord(count, 300),
  lore: z.object({
    echoes: idRecord(level, 50),
    ages: idRecord(level, 50, 4),
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
    seen: idRecord(count, 300, 20)
  }),
  recognition: idRecord(count, 100),
  promises: idRecord(count, 100),
  remembered: idRecord(z.number().int().min(4).max(5), 100),
  pledge: z.string().max(40).optional(),
  lastPromise: z.string().max(40).optional(),
  named: z.array(z.string().max(40)).max(100),
  secrets: z.array(z.string().max(40)).max(100),
  trail: z.object({
    wanderers: z.array(z.string().max(40)).max(20),
    fieldKills: count,
    rest: count,
    evenRats: count,
    offered: positive,
    listen: positive,
    migration: z.object({ stage: stageNumber, biome: z.string().max(40) }).optional(),
    wound: z.object({ stage: stageNumber, share: z.number().min(0).max(1) }).optional(),
    promise: z.object({
      hero: z.string().max(40),
      kings: z.number().int().min(0).max(100),
      broken: z.boolean().optional(),
      waited: z.boolean().optional(),
      released: z.boolean().optional(),
      goal: stageNumber.optional()
    }).optional(),
    eclipse: z.boolean().optional()
  }),
  descents: count,
  threads: count,
  weaves: idRecord(z.number().int().min(0).max(WEAVE_LEVEL_MAX), 20),
  descentMark: positive,
  caravanWeek: z.string().max(10),
  rngState: z.number().int().min(0).max(0xffffffff)
});

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
