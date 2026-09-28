import { ACHIEVEMENT_BY_ID } from "./data/achievements";
import { ALTAR_BY_ID, altarCost, altarEffect } from "./data/altars";
import { WEAVE_BY_ID, type WeaveId } from "./data/descent";
import { REMEMBRANCE_FRAGMENTS, WALKER_DPS, remembranceNight } from "./data/events";
import { CLICK_HERO_ID, HEROES, UPGRADE_BY_ID } from "./data/heroes";
import { EQUIPMENT_CAP, FORGE_STEP, forgeCost, relicDensity } from "./data/items";
import { RECOGNITION_DPS, bestiaryGoldBonus, recognitionTier, rememberedCompanions } from "./data/lore";
import { COOLDOWN_FLOOR, GROVE_SEED_MAX, MIRELLE_BARON_DAMAGE, REGALIA_KING_DAMAGE, namedEffect, wearing, wearsRegalia } from "./data/relics";
import type { AffixStat, AltarId, BuffId, Derived, GameState, HeroDef, Item } from "./types";

export const MONSTERS_PER_STAGE = 10;
/** Beyond this, monster HP would exceed floating-point precision. */
export const MAX_STAGE = 3000;
export const BASE_BOSS_TIMER = 30;
export const BASE_CRIT_MULTIPLIER = 10;
export const BASE_TREASURE_CHANCE = 0.01;
/**
 * The Patience bonus is the company's rhythm when the walker steps back. The walker's own
 * strikes take its place, blow for blow: each strike's damage is taken off the bonus the
 * company deals next, and only strikes beyond it add. So a light hand costs nothing, and a
 * strike that goes unused waits this many seconds of the bonus at most.
 */
export const STRIKE_FILL_SECONDS = 3;
export const RESPAWN_SECONDS = 0.35;
export const BOSS_RESPAWN_SECONDS = 0.8;
export const ASCENSION_MIN_STAGE = 51;
/**
 * A guardian or an elite of the present night keeps its wounds: after a failed fight, this
 * share of the damage it took stays on it, up to this share of its HP, so a walker who keeps
 * trying gets through. Not the Keep's gate (stage 45) nor the King (his seam closes whole),
 * nor the Remnants of the strata below, whose memory is too dense.
 */
export const WOUND_KEEP = 1;
export const WOUND_CAP = 0.75;
export const WOUND_LAST_STAGE = 44;
export const ESSENCE_DPS_BONUS = 0.1;
/**
 * Essence growth per stage past stage 140: +2% per stage pushed before ascending. Faster,
 * the altars' multipliers make each ascension overshoot the last (runaway); never lower,
 * or past ascension records would exceed what the formula allows.
 */
export const LATE_ESSENCE_GROWTH = 1.02;
/** A single catch-up (hidden tab, computer asleep) counts at most this many hours. */
export const OFFLINE_BASE_CAP_HOURS = 8;
/**
 * Reunion: when the walker comes back after an absence of at least
 * `REUNION_MIN_AWAY_SECONDS`, the company that walked on alone fights harder for
 * `REUNION_SHARE` of the time away (capped at an hour: a night gives the full hour), never during the absence.
 */
export const REUNION_DPS = 3;
export const REUNION_SHARE = 1 / 6;
export const REUNION_MIN_AWAY_SECONDS = 1800;
const LN_155 = Math.log(1.55);
const HP_140 = 10 * (139 + Math.pow(1.55, 139));
const HP_500 = HP_140 * Math.pow(1.15, 360);

/** HP of a normal monster at a given stage (three-segment curve). */
export function stageHp(stage: number): number {
  const s = Math.max(1, Math.floor(stage));
  if (s <= 140) return Math.ceil(10 * (s - 1 + Math.exp(LN_155 * (s - 1))));
  if (s <= 500) return HP_140 * Math.pow(1.15, s - 140);
  return HP_500 * Math.pow(1.18, s - 500);
}

export function bossHpMultiplier(stage: number): number {
  return stage % 10 === 0 ? 10 : 6;
}

export function bossHp(stage: number): number {
  return stageHp(stage) * bossHpMultiplier(stage);
}

/**
 * Base gold of a normal monster: a share of its HP, the lever of the pace of a run (tuned
 * with the bot to the balance targets of AGENTS.md). The first ten stages pay more (×2 at
 * stage 1, tapering off) so the first purchases come quickly.
 */
export const GOLD_PER_HP = 1 / 30;

export function stageGold(stage: number): number {
  const earlyBoost = 1 + Math.max(0, 11 - stage) / 10;
  return Math.max(1, stageHp(stage) * GOLD_PER_HP) * earlyBoost;
}

export function altarLevel(state: GameState, id: AltarId): number {
  return state.altars[id] ?? 0;
}

export function weaveLevel(state: GameState, id: WeaveId): number {
  return Object.hasOwn(state.weaves, id) ? state.weaves[id] ?? 0 : 0;
}

/** The effect of a weave: its value per level times its level (within its cap). */
export function weaveValue(state: GameState, id: WeaveId): number {
  const weave = WEAVE_BY_ID[id];
  const level = weaveLevel(state, id);
  return (weave.maxLevel > 0 ? Math.min(level, weave.maxLevel) : level) * weave.valuePerLevel;
}

/** An altar's cap for this walker: the Knot of Dusk lets the Wanderer's grow. */
export function altarMaxLevel(state: GameState, id: AltarId): number {
  const base = ALTAR_BY_ID[id].maxLevel;
  return id === "wanderer" ? base + weaveValue(state, "dusk-knot") : base;
}

export function altarValue(state: GameState, id: AltarId): number {
  return altarEffect(ALTAR_BY_ID[id], altarLevel(state, id), altarMaxLevel(state, id));
}

/** Price of an altar's next level for this walker (infinite at its cap). */
export function altarPrice(state: GameState, id: AltarId): number {
  return altarCost(id, altarLevel(state, id), altarMaxLevel(state, id));
}

/** Share of a strike's damage that takes the Patience bonus's place (Quietus halves it). */
export function strikeFillShare(state: GameState): number {
  return 1 - namedEffect(state, "quietStrike");
}

/** Seconds Golden Rain lasts (the Vestment of Cinders makes it longer). */
export function skillDuration(state: GameState, id: keyof GameState["skills"], base: number): number {
  if (id === "goldrain") return Math.max(base, namedEffect(state, "rainSeconds"));
  return base;
}

/** Shard prices at the stall and the Caravan (the Stallkeeper's Token lowers them). */
export function shardPrice(state: GameState, cost: number): number {
  return Math.max(1, Math.ceil(cost * (1 - namedEffect(state, "marketDiscount"))));
}

/** Fragment chance multiplier: the Frayed Edge, Oriane's Ear (guardians), Remembrance Nights. */
export function fragmentMultiplier(state: GameState, now: number, guardian = false): number {
  const ear = guardian ? namedEffect(state, "fragments") : 0;
  const night = remembranceNight(new Date(now)) ? REMEMBRANCE_FRAGMENTS : 1;
  return (1 + weaveValue(state, "frayed-edge")) * (1 + ear) * night;
}

export function heroCostMultiplier(state: GameState): number {
  return Math.max(0.5, 1 - altarValue(state, "bargain"));
}

/** Cost of buying `count` levels starting from `level`. */
export function heroCost(hero: HeroDef, level: number, count: number, costMultiplier = 1): number {
  if (count <= 0) return 0;
  const growth = hero.costGrowth;
  const first = hero.baseCost * Math.pow(growth, level);
  return Math.ceil((first * (Math.pow(growth, count) - 1)) / (growth - 1) * costMultiplier);
}

/** Number of levels affordable with `gold`. */
export function maxAffordableLevels(hero: HeroDef, level: number, gold: number, costMultiplier = 1): number {
  const growth = hero.costGrowth;
  const first = hero.baseCost * Math.pow(growth, level) * costMultiplier;
  if (gold < first) return 0;
  const count = Math.floor(Math.log((gold * (growth - 1)) / first + 1) / Math.log(growth));
  // Guard against floating-point rounding errors.
  if (heroCost(hero, level, count, costMultiplier) > gold) return Math.max(0, count - 1);
  return count;
}

export function upgradeCost(upgradeId: string): number {
  const entry = UPGRADE_BY_ID[upgradeId];
  if (!entry) return Number.POSITIVE_INFINITY;
  return entry.hero.baseCost * entry.upgrade.costMult;
}

const MILESTONE_FIRST = 200;
const MILESTONE_STEP = 25;

/** Automatic milestones: ×3.5 every 25 levels from level 200. */
export function milestoneMultiplier(level: number): number {
  if (level < MILESTONE_FIRST) return 1;
  return Math.pow(3.5, Math.floor((level - MILESTONE_FIRST) / MILESTONE_STEP) + 1);
}

/** The next level where a companion's power jumps: its next talent, then every milestone. */
export function nextBreakpoint(hero: HeroDef, level: number): number {
  const talent = hero.upgrades.find((upgrade) => upgrade.level > level);
  if (talent) return talent.level;
  return Math.max(MILESTONE_FIRST, (Math.floor(level / MILESTONE_STEP) + 1) * MILESTONE_STEP);
}

/**
 * Essences earned on ascension. Growth must stay below monster HP growth, otherwise each
 * ascension pays enough to skip hundreds of stages (runaway). Since save version 4 the first
 * ascensions pay four times more (a newcomer's first one is a real leap); the formula only
 * ever grew, so older ascension records stay within it.
 */
export function essencesForStage(highestCleared: number): number {
  if (highestCleared < ASCENSION_MIN_STAGE - 1) return 0;
  const early = Math.min(highestCleared, 140) - 50;
  const late = Math.max(0, highestCleared - 140);
  return Math.floor(20 * Math.pow(1.075, early) * Math.pow(LATE_ESSENCE_GROWTH, late) + 3 * (highestCleared - 50));
}

export function affixValue(item: Item, stat: AffixStat): number {
  const base = item.affixes.filter((affix) => affix.stat === stat).reduce((total, affix) => total + affix.value, 0);
  return base * (1 + item.forge * FORGE_STEP);
}

export function equipmentBonus(state: GameState, stat: AffixStat): number {
  let total = 0;
  for (const item of Object.values(state.equipment)) {
    if (item) total += affixValue(item, stat);
  }
  // The Thousandth Arrow's critical chance counts toward the same cap.
  if (stat === "critChance") total += namedEffect(state, "critChance");
  const cap = EQUIPMENT_CAP[stat];
  return cap === undefined ? total : Math.min(total, cap);
}

/** The density of every relic worn, multiplied together (1 with none from below the present night). */
export function equipmentDensity(state: GameState): number {
  let total = 1;
  for (const item of Object.values(state.equipment)) if (item) total *= relicDensity(item);
  return total;
}

export function achievementBonus(state: GameState): number {
  let total = 0;
  for (const id of state.achievements) total += ACHIEVEMENT_BY_ID[id]?.bonus ?? 0;
  return total;
}

export function buffActive(state: GameState, id: BuffId, now: number): boolean {
  return state.buffs.some((buff) => buff.id === id && buff.until > now);
}

export function skillActive(state: GameState, id: keyof GameState["skills"], now: number): boolean {
  const skill = state.skills[id];
  return Boolean(skill && skill.activeUntil > now);
}

export interface DeriveOptions {
  /** Ignore timed bonuses (powers, potions, crystals); used offline. */
  ignoreTimed?: boolean;
}

export function derive(state: GameState, now: number, options: DeriveOptions = {}): Derived {
  const timed = !options.ignoreTimed;
  const heroMult: Record<string, number> = {};
  let globalDps = 1;
  let clickMult = 1;
  let clickDps = 0;
  let idleDps = 0;
  let critChance = 0;
  let critAdd = 0;
  let goldPct = 0;
  let bossTimer = BASE_BOSS_TIMER;
  let treasure = BASE_TREASURE_CHANCE;

  for (const hero of HEROES) {
    heroMult[hero.id] = milestoneMultiplier(state.heroLevels[hero.id] ?? 0);
    // A companion who fully remembers the walker fights harder (Recognition 5).
    if (recognitionTier(state, hero.id) >= 5) heroMult[hero.id] *= 1 + RECOGNITION_DPS;
  }

  for (const upgradeId of state.heroUpgrades) {
    const entry = UPGRADE_BY_ID[upgradeId];
    if (!entry) continue;
    const effect = entry.upgrade.effect;
    switch (effect.kind) {
      case "heroDps": heroMult[entry.hero.id] *= effect.mult; break;
      case "globalDps": globalDps *= 1 + effect.pct; break;
      case "click": clickMult *= effect.mult; break;
      case "clickDps": clickDps += effect.pct; break;
      case "critChance": critChance += effect.pct; break;
      case "critDamage": critAdd += effect.add; break;
      case "gold": goldPct += effect.pct; break;
      case "bossTimer": bossTimer += effect.seconds; break;
      case "treasure": treasure += effect.pct; break;
      case "idleDps": idleDps += effect.pct; break;
    }
  }

  // The Briar Mantle and Morgrath's Phylactery deepen the rhythm companions find alone.
  const idleBonus = (altarValue(state, "patience") + idleDps) * (1 + namedEffect(state, "idleBonus")) * (1 + namedEffect(state, "phylactery"));
  let dpsMultiplier = globalDps
    * (1 + achievementBonus(state))
    * (1 + state.essences * ESSENCE_DPS_BONUS)
    * (1 + altarValue(state, "might"))
    * (1 + equipmentBonus(state, "dps"))
    * equipmentDensity(state)
    * (1 + state.ritualStacks * 0.05);
  if (timed) {
    if (skillActive(state, "rally", now)) dpsMultiplier *= 2;
    if (buffActive(state, "rage", now)) dpsMultiplier *= 2;
    if (buffActive(state, "overcharge", now)) dpsMultiplier *= 7;
    // Another walker's echo fights beside the company for a while.
    if (buffActive(state, "walker", now)) dpsMultiplier *= WALKER_DPS;
    if (buffActive(state, "reunion", now)) dpsMultiplier *= REUNION_DPS;
    // Dawnbreak, while a Seam is open.
    if (state.monster?.event === "seam") dpsMultiplier *= 1 + namedEffect(state, "seamDps");
  }

  // The company's rhythm (the walker's strikes take its place, see STRIKE_FILL_SECONDS);
  // strikes draw on the DPS without it.
  const idleFactor = 1 + idleBonus;
  const heroDps: Record<string, number> = {};
  let activeDps = 0;
  for (const hero of HEROES) {
    const level = state.heroLevels[hero.id] ?? 0;
    const value = hero.baseDps * level * heroMult[hero.id] * dpsMultiplier;
    heroDps[hero.id] = value * idleFactor;
    activeDps += value;
  }
  const dps = activeDps * idleFactor;

  // Aldric's own damage carries the early game; the share of companion DPS takes over later.
  const aldricLevel = state.heroLevels[CLICK_HERO_ID] ?? 0;
  const clickFlatMult = clickMult * (1 + equipmentBonus(state, "click")) * (1 + achievementBonus(state) * 0.5);
  const sharpness = timed && buffActive(state, "sharpness", now) ? 10 : 1;
  // The Seed of the Old Grove grows with every companion who remembers; the Phylactery takes half.
  const seed = namedEffect(state, "clickPerRemembered");
  const relicClick = (1 + Math.min(GROVE_SEED_MAX, seed * rememberedCompanions(state))) * (1 - namedEffect(state, "phylactery"));
  // The Altar of the Blade sharpens the whole strike, the companions' share included.
  const click = ((1 + aldricLevel * heroMult[CLICK_HERO_ID]) * clickFlatMult + activeDps * clickDps) * (1 + altarValue(state, "blade")) * sharpness * relicClick;

  critChance += altarValue(state, "precision") + equipmentBonus(state, "critChance");
  if (timed && skillActive(state, "hawkeye", now)) critChance += 0.5;

  const critMultiplier = (BASE_CRIT_MULTIPLIER + critAdd) * (1 + altarValue(state, "fate") + equipmentBonus(state, "critDamage"));

  let goldMultiplier = (1 + goldPct) * (1 + altarValue(state, "fortune")) * (1 + equipmentBonus(state, "gold")) * (1 + bestiaryGoldBonus(state)) * (1 + namedEffect(state, "mirelle"));
  if (timed && skillActive(state, "goldrain", now)) goldMultiplier *= 3;
  if (timed && buffActive(state, "fortune", now)) goldMultiplier *= 2;

  let autoClicksPerSecond = 0;
  if (timed && skillActive(state, "frenzy", now)) autoClicksPerSecond += 10;
  if (timed && buffActive(state, "autoclick", now)) autoClicksPerSecond += 5;

  // Pip's Cheese doubles the chance to meet him, inside the same cap.
  const cheese = timed && buffActive(state, "cheese", now) ? 2 : 1;
  const lantern = timed && buffActive(state, "lantern", now);
  const regalia = wearsRegalia(state) ? REGALIA_KING_DAMAGE : 0;
  return {
    dps,
    heroDps,
    click,
    critChance: Math.min(1, critChance),
    critMultiplier,
    goldMultiplier,
    bossTimer: bossTimer + altarValue(state, "time") + namedEffect(state, "bossTimer"),
    // The Scales of Aurelion bite deeper into elites and guardians.
    bossDamage: (1 + equipmentBonus(state, "bossDamage")) * (1 + namedEffect(state, "bossDamage")),
    guardianGold: 1 + namedEffect(state, "guardianGold"),
    treasureChance: Math.min(0.25, (treasure + altarValue(state, "treasure") + namedEffect(state, "treasure")) * cheese),
    dpsMultiplier: dpsMultiplier * idleFactor,
    patienceDps: activeDps * idleBonus,
    essenceMultiplier: (1 + altarValue(state, "harvest")) * (1 + equipmentBonus(state, "essence")) * Math.pow(1 + WEAVE_BY_ID.plenty.valuePerLevel, weaveLevel(state, "plenty")),
    idleBonus,
    clickDpsShare: clickDps,
    autoClicksPerSecond,
    kingDamage: (1 + namedEffect(state, "kingDamage")) * (1 + regalia),
    baronDamage: wearing(state, "mirelle-ring") ? 1 + MIRELLE_BARON_DAMAGE : 1,
    crystalStay: Math.max(13, namedEffect(state, "crystalStay")),
    // The Lantern calls them every 45 to 90 s instead of 90 to 240 s; the Lodestone and the Loom sooner still.
    crystalWait: (lantern ? LANTERN_CRYSTAL_WAIT : 1) * (1 - namedEffect(state, "crystalSooner")) * (1 - weaveValue(state, "humming-loom")),
    fragmentChance: fragmentMultiplier(state, now)
  };
}

/**
 * Essences of an ascension now. Only the stages this run fought through pay: those the
 * Altar of the Wanderer skipped are deducted, so a run cannot be skipped and cashed again.
 */
export function ascensionPreview(state: GameState, now: number): number {
  const highestCleared = state.maxStage - 1;
  if (highestCleared < ASCENSION_MIN_STAGE - 1 || state.maxStage <= state.runStartStage) return 0;
  const earned = essencesForStage(highestCleared) - essencesForStage(state.runStartStage - 1);
  return Math.max(0, Math.floor(earned * derive(state, now).essenceMultiplier));
}

/**
 * Stages the Altar of the Wanderer clears at the start of a run: its value, never more than
 * half the stage record, rounded down to a multiple of 5 so a run never starts on a boss.
 */
export function wandererSkip(state: GameState): number {
  // The Ring of the Second Morning walks a few stages more, inside the same caps.
  const skip = Math.min(altarValue(state, "wanderer") + namedEffect(state, "wandererStages"), Math.floor(state.maxStageEver / 2));
  return Math.floor(skip / 5) * 5;
}

/** Share of the usual wait between wandering crystals while the Moth Lantern burns. */
export const LANTERN_CRYSTAL_WAIT = 0.4;

/** Essences a crystal grants when it carries some (more the deeper the walker has been). */
export function crystalEssenceReward(maxStageEver: number): number {
  return 1 + Math.floor(maxStageEver / 100);
}

/** Starting gold after an ascension (Altar of Memory). */
export function memoryStartGold(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(100 * stageGold(level * 5));
}

export const OFFLINE_CAP_SECONDS = OFFLINE_BASE_CAP_HOURS * 3600;

/** A single catch-up's cap for this walker: the Long Thread adds an hour per level. */
export function offlineCapSeconds(state: GameState): number {
  return (OFFLINE_BASE_CAP_HOURS + weaveValue(state, "long-thread")) * 3600;
}

/** Shards the forge asks for the next level of an item (the Unfinished Hammer lowers it). */
export function forgePrice(state: GameState, item: Item): number {
  return Math.ceil(forgeCost(item.rarity, item.forge) * (1 - namedEffect(state, "forgeDiscount")));
}

/** Power cooldowns: the Altar of Echoes and Eldra's Locket, never below 40% of the base. */
export function skillCooldownMultiplier(state: GameState): number {
  return Math.max(COOLDOWN_FLOOR, 1 - altarValue(state, "echoes") - namedEffect(state, "cooldown"));
}
