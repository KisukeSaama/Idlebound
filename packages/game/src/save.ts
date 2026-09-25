import { z } from "zod";
import { SAVE_VERSION, createInitialState } from "./state";
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
  locked: z.boolean().optional()
});

const skillState = z.object({ activeUntil: finite, readyAt: finite });
const skillId = z.enum(["frenzy", "rally", "hawkeye", "goldrain", "ritual", "echo"]);

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
  kills: z.number().int().min(0).max(100),
  autoAdvance: z.boolean(),
  monster: z.object({
    id: z.string().max(60),
    name: z.string().max(120).optional(),
    image: z.string().max(200),
    filter: z.string().max(300).optional(),
    scale: finite,
    hp: finite,
    maxHp: positive,
    kind: z.enum(["normal", "treasure", "miniboss", "boss"]),
    gold: positive
  }).nullable(),
  respawnIn: finite,
  bossTimeLeft: finite,
  heroLevels: z.record(z.string().max(40), z.number().int().min(0).max(1_000_000)),
  heroUpgrades: z.array(z.string().max(40)).max(500),
  skills: z.partialRecord(skillId, skillState),
  lastSkill: skillId.optional(),
  ritualStacks: count,
  buffs: z.array(z.object({ id: z.enum(["rage", "fortune", "autoclick", "overcharge", "sharpness"]), until: finite })).max(10),
  altars: z.record(z.string().max(40), z.number().int().min(0).max(1_000_000)),
  achievements: z.array(z.string().max(40)).max(500),
  equipment: z.partialRecord(z.enum(["weapon", "armor", "amulet", "ring"]), itemSchema),
  inventory: z.array(itemSchema).max(200),
  crystal: z.object({ id: z.string().max(40), expiresAt: finite, x: finite, y: finite }).nullable(),
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
    bestHired: count
  }),
  ascensions: z.array(z.object({ at: finite, maxStage: z.number().int().min(1), essences: positive })).max(200),
  settings: z.object({
    notation: z.enum(["letters", "scientific", "engineering"]),
    sound: z.boolean(),
    volume: z.number().min(0).max(1),
    damageNumbers: z.boolean(),
    reducedMotion: z.boolean(),
    confirmAscension: z.boolean(),
    buyMode: z.union([z.literal(1), z.literal(10), z.literal(25), z.literal(100), z.literal("max")])
  }),
  tutorial: z.object({ done: z.array(z.string().max(40)).max(50) })
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
  merged.version = SAVE_VERSION;
  return merged;
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
