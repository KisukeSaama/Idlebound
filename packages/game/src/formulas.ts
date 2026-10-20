import { ACHIEVEMENT_BY_ID } from "./data/achievements";
import { ALTAR_BY_ID, altarCost, altarEffect } from "./data/altars";
import { isBossStage, isKingStage } from "./data/biomes";
import { WEAVE_BY_ID, type WeaveId } from "./data/descent";
import { REMEMBRANCE_FRAGMENTS, STORM_ODDS, WAGER_MIN_GOLD, WAGER_PAY_SECONDS, WALKER_DPS, remembranceNight } from "./data/events";
import { CLICK_HERO_ID, HERO_BY_ID, HEROES, UPGRADE_BY_ID } from "./data/heroes";
import { EQUIPMENT_CAP, FORGE_STEP, depthScale, forgeCost, relicDensity } from "./data/items";
import { RECOGNITION_DPS, RECOGNITION_HEROES, bestiaryGoldBonus, recognitionTier } from "./data/lore";
import { PROMISE_BY_HERO, promiseAtDusk, promiseDepth, promiseDoublings, promiseGrantable, promiseOf } from "./data/promises";
import { COOLDOWN_FLOOR, GROVE_SEED_MAX, MIRELLE_BARON_DAMAGE, REGALIA_KING_DAMAGE, namedEffect, wearing, wearsRegalia, wornItems } from "./data/relics";
import { MEMORY_MULT, PLACE_SPOILS, PLACE_TREASURE, awakenCost, placeBonus, placeCount, rekindleCost, wornTrait } from "./data/traits";
import { DEEP_FROM, lnStageHp } from "./curve";
import { fromLog, runBits } from "./scale";
import type { AffixStat, AltarId, BuffId, Derived, GameState, HeroDef, Item } from "./types";
import { exp as dExp, log as dLog, log1p as dLog1p, pow as dPow } from "./dmath";

export const MONSTERS_PER_STAGE = 10;
/**
 * The deepest stage a save may name. The road has no end (BIBLE 24): this only bounds what a
 * save can claim, far beyond what a lifetime of play reaches.
 */
export const MAX_STAGE = 10_000_000;
export const BASE_BOSS_TIMER = 30;
export const BASE_CRIT_MULTIPLIER = 10;
export const BASE_TREASURE_CHANCE = 0.01;
export const RESPAWN_SECONDS = 0.35;
export const BOSS_RESPAWN_SECONDS = 0.8;
/**
 * The Rout (BIBLE 6.1): on a stretch of road walked on an earlier night, Remnants the company
 * would unmake within this many seconds break all at once, and the whole stage falls.
 */
export const ROUT_SECONDS = 0.1;
/** The fastest the road goes by in a Rout: one stage per this many seconds at the very least. */
export const ROUT_STEP_SECONDS = 0.25;
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
/**
 * The first night: the King has never met this walker, and his seam is still thin. On a walk
 * that has never seen a dusk, the Keep's gate and the King keep their wounds too, the King up
 * to `FIRST_NIGHT_KING_WOUND` of his HP (BIBLE 6.1).
 */
export const FIRST_NIGHT_LAST_STAGE = 50;
export const FIRST_NIGHT_KING_WOUND = 0.5;
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
const LN_155 = dLog(1.55);
const HP_140 = 10 * (139 + dPow(1.55, 139));
const HP_500 = HP_140 * dPow(1.15, 360);

/**
 * HP of a normal monster at a given stage, in a unit of `bits` bits (see `scale.ts`; 0, the
 * plain number, everywhere above stage 3500). Three segments down to the Dawn, then the night
 * drawn again, its growth easing (`curve.ts`, BIBLE 24).
 */
export function stageHp(stage: number, bits = 0): number {
  const s = Math.max(1, Math.floor(stage));
  if (bits === 0) {
    if (s <= 140) return Math.ceil(10 * (s - 1 + dExp(LN_155 * (s - 1))));
    if (s <= 500) return HP_140 * dPow(1.15, s - 140);
    if (s <= DEEP_FROM) return HP_500 * dPow(1.18, s - 500);
    return dExp(lnStageHp(s));
  }
  return fromLog(lnStageHp(s), bits);
}

export function bossHpMultiplier(stage: number): number {
  return stage % 10 === 0 ? 10 : 6;
}

export function bossHp(stage: number, bits = 0): number {
  return stageHp(stage, bits) * bossHpMultiplier(stage);
}

/**
 * Whether a stage routs (see `ROUT_SECONDS`): a stage of normal Remnants under the walker's
 * best stage ever, against a company that would unmake one of them in a blink.
 */
export function routs(state: GameState, stage: number, d: Derived): boolean {
  return !isBossStage(stage) && stage < state.maxStageEver && stageHp(stage, runBits(state)) <= (d.dps + d.click * d.autoClicksPerSecond) * routSeconds(state);
}

/** The Rout's blink: longer with a weapon that remembers routs (the trait Rout). */
export function routSeconds(state: GameState, worn = wornItems(state)): number {
  return Math.max(ROUT_SECONDS, wornTrait(worn, "rout"));
}

/** Relics the company's satchel holds, before the trait Satchel. */
export const SATCHEL_SIZE = 6;
/** Relics the company's satchel holds for this walker. */
export function satchelSize(state: GameState, worn = wornItems(state)): number {
  return SATCHEL_SIZE + wornTrait(worn, "satchel");
}

/** A guardian's and an elite's chance to leave a relic, before the trait Spoils and the Deepvaults. */
export const GUARDIAN_RELIC_CHANCE = 0.4;
export const ELITE_RELIC_CHANCE = 0.15;
/** Chance a guardian (or an elite) of the frontier leaves a relic: the trait Spoils and four relics of the Deepvaults add to it, to an elite's half as much. */
export function relicChance(state: GameState, guardian: boolean, worn = wornItems(state)): number {
  const added = wornTrait(worn, "spoils") + (placeCount(worn, "deepvaults") >= 4 ? PLACE_SPOILS : 0);
  return Math.min(1, guardian ? GUARDIAN_RELIC_CHANCE + added : ELITE_RELIC_CHANCE + added / 2);
}

/** Shards of a guardian, multiplied: the trait Skyglass and the relics of the Deepvaults. */
export function guardianShardMultiplier(state: GameState, worn = wornItems(state)): number {
  return wornTrait(worn, "skyglass", 1) * placeBonus(worn, "deepvaults");
}

/** Shards a guardian of this stage leaves. */
export function guardianShardsAt(state: GameState, stage: number, worn = wornItems(state)): number {
  return Math.floor((1 + Math.floor(stage / 25)) * guardianShardMultiplier(state, worn)) + namedEffect(state, "guardianShards", worn);
}

/** Luck of legendaries and mythics on the road (the trait Star): guardians, elites, Seams and the satchel. */
export function roadLuck(state: GameState, worn = wornItems(state)): number {
  return wornTrait(worn, "star", 1);
}

/** Whether the walk has never seen a dusk: no ascension, no Descent. */
export function firstNight(state: GameState): boolean {
  return state.lifetime.ascensions === 0 && state.descents === 0;
}

/**
 * Share of its HP a guardian or an elite keeps of its wounds: the present night's (up to stage
 * 44), or, deeper, what the trait Scars holds. The King heals whole, except on the walk's first
 * night (see `FIRST_NIGHT_LAST_STAGE`).
 */
export function woundCapAt(state: GameState, stage: number, worn = wornItems(state)): number {
  return woundCapWith(stage, wornTrait(worn, "scars"), firstNight(state));
}

/**
 * The share of its wounds a boss of `stage` keeps against armor of Old Scars worth `scars` (0
 * without), on the walk's first night (`first`) or another.
 */
export function woundCapWith(stage: number, scars: number, first = false): number {
  if (first && stage > WOUND_LAST_STAGE && stage <= FIRST_NIGHT_LAST_STAGE) return isKingStage(stage) ? FIRST_NIGHT_KING_WOUND : WOUND_CAP;
  if (isKingStage(stage)) return 0;
  return stage <= WOUND_LAST_STAGE ? Math.max(WOUND_CAP, scars) : scars;
}

/** Chance a wandering crystal is a Crystal Storm (the trait Storm). */
export function stormChance(state: GameState, worn = wornItems(state)): number {
  return Math.max(1 / STORM_ODDS, wornTrait(worn, "storm"));
}

/** The Reunion's company damage (the trait Homecoming). */
export function reunionDps(state: GameState, worn = wornItems(state)): number {
  return Math.max(REUNION_DPS, wornTrait(worn, "homecoming"));
}

/**
 * Base gold of a normal monster: a share of its HP, the lever of the pace of a run (tuned
 * with the bot to the balance targets of AGENTS.md). The first ten stages pay more (×2 at
 * stage 1, tapering off) so the first purchases come quickly.
 */
export const GOLD_PER_HP = 1 / 30;

export function stageGold(stage: number, bits = 0): number {
  const earlyBoost = 1 + Math.max(0, 11 - stage) / 10;
  if (bits === 0) return Math.max(1, stageHp(stage) * GOLD_PER_HP) * earlyBoost;
  return Math.max(fromLog(0, bits), stageHp(stage, bits) * GOLD_PER_HP) * earlyBoost;
}

/** Golden rats come this often at most, however the walker courts Pip. */
export const MAX_TREASURE_CHANCE = 0.25;

/**
 * A won Pip's Wager, in times the stage's gold: what the road would have paid in
 * `WAGER_PAY_SECONDS` at the company's pace, golden rats included, three golden rats at least.
 */
export function wagerGold(stage: number, dps: number, treasureChance: number, bits = 0): number {
  // `dps` in the night's unit (`bits`, see `scale.ts`), like the stage's HP it is measured against.
  const road = dps > 0 ? (WAGER_PAY_SECONDS * (1 + treasureChance * 9)) / (stageHp(stage, bits) / dps + RESPAWN_SECONDS) : 0;
  return Math.max(WAGER_MIN_GOLD, road);
}

/** The most a won wager can pay: every kill at the fastest respawn, rats at their cap. */
export const WAGER_MAX_GOLD = (WAGER_PAY_SECONDS * (1 + MAX_TREASURE_CHANCE * 9)) / RESPAWN_SECONDS;

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

/**
 * Whether a stone of the Sanctum answers this walker yet: from its night on (the nights
 * walked are the ascensions, which no Descent takes back), or once raised, whatever the night.
 */
export function altarOpen(state: GameState, id: AltarId): boolean {
  return state.lifetime.ascensions + 1 >= ALTAR_BY_ID[id].night || altarLevel(state, id) > 0;
}

/** Price of an altar's next level for this walker (infinite at its cap, or while its stone sleeps). */
export function altarPrice(state: GameState, id: AltarId): number {
  if (!altarOpen(state, id)) return Number.POSITIVE_INFINITY;
  return altarCost(id, altarLevel(state, id), altarMaxLevel(state, id));
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
  const night = remembranceNight(now, state.zone) ? REMEMBRANCE_FRAGMENTS : 1;
  return (1 + weaveValue(state, "frayed-edge")) * (1 + ear) * night;
}

export function heroCostMultiplier(state: GameState): number {
  return Math.max(0.5, 1 - altarValue(state, "bargain"));
}

/**
 * Cost of buying `count` levels starting from `level`, in a unit of `bits` bits (see
 * `scale.ts`): in a larger unit, worked out from its logarithm and never rounded.
 */
export function heroCost(hero: HeroDef, level: number, count: number, costMultiplier = 1, bits = 0): number {
  if (count <= 0) return 0;
  const growth = hero.costGrowth;
  if (bits === 0) {
    const first = hero.baseCost * dPow(growth, level);
    return Math.ceil((first * (dPow(growth, count) - 1)) / (growth - 1) * costMultiplier);
  }
  const ln = dLog(growth);
  // ln(growth^count - 1), without overflowing for a large count.
  const series = count * ln + dLog1p(-dExp(-count * ln));
  return fromLog(dLog(hero.baseCost) + level * ln + series - dLog(growth - 1) + dLog(costMultiplier), bits);
}

/** Number of levels affordable with `gold` (written in a unit of `bits` bits). */
export function maxAffordableLevels(hero: HeroDef, level: number, gold: number, costMultiplier = 1, bits = 0): number {
  const growth = hero.costGrowth;
  let count: number;
  if (bits === 0) {
    const first = hero.baseCost * dPow(growth, level) * costMultiplier;
    if (gold < first) return 0;
    count = Math.floor(dLog((gold * (growth - 1)) / first + 1) / dLog(growth));
  } else {
    if (!(gold > 0)) return 0;
    const ln = dLog(growth);
    // ln(gold × (growth - 1) / first + 1), kept in logarithms: the first level's price may be
    // too small to write in this unit.
    const x = dLog(gold * (growth - 1)) - (dLog(hero.baseCost) + level * ln + dLog(costMultiplier) - bits * Math.LN2);
    const total = x > 0 ? x + dLog1p(dExp(-x)) : dLog1p(dExp(x));
    count = Math.floor(total / ln);
  }
  // Guard against floating-point rounding errors.
  if (heroCost(hero, level, count, costMultiplier, bits) > gold) return Math.max(0, count - 1);
  return count;
}

export function upgradeCost(upgradeId: string, bits = 0): number {
  const entry = UPGRADE_BY_ID[upgradeId];
  if (!entry) return Number.POSITIVE_INFINITY;
  const cost = entry.hero.baseCost * entry.upgrade.costMult;
  return bits === 0 ? cost : fromLog(dLog(cost), bits);
}

const MILESTONE_FIRST = 200;
const MILESTONE_STEP = 25;

const LN_MILESTONE = dLog(3.5);

/**
 * Automatic milestones: ×3.5 every 25 levels from level 200. With `bits`, in the unit of the
 * night's damage (see `scale.ts`): the milestones of the deep road outgrow a double.
 */
export function milestoneMultiplier(level: number, bits = 0): number {
  const steps = level < MILESTONE_FIRST ? 0 : Math.floor((level - MILESTONE_FIRST) / MILESTONE_STEP) + 1;
  if (bits === 0) return steps === 0 ? 1 : dPow(3.5, steps);
  return fromLog(steps * LN_MILESTONE, bits);
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
  return Math.floor(20 * dPow(1.075, early) * dPow(LATE_ESSENCE_GROWTH, late) + 3 * (highestCleared - 50));
}

export function affixValue(item: Item, stat: AffixStat): number {
  const base = item.affixes.filter((affix) => affix.stat === stat).reduce((total, affix) => total + affix.value, 0);
  return base * (1 + item.forge * FORGE_STEP) * depthScale(item);
}

/** The total bonus of the worn relics, before `EQUIPMENT_CAP`. */
export function equipmentBonusUncapped(state: GameState, stat: AffixStat, worn = wornItems(state)): number {
  let total = 0;
  for (const item of worn) total += affixValue(item, stat);
  // The Thousandth Arrow's critical chance counts toward the same cap.
  if (stat === "critChance") total += namedEffect(state, "critChance", worn);
  return total;
}

export function equipmentBonus(state: GameState, stat: AffixStat, worn = wornItems(state)): number {
  const total = equipmentBonusUncapped(state, stat, worn);
  const cap = EQUIPMENT_CAP[stat];
  return cap === undefined ? total : Math.min(total, cap);
}

/** The density of every relic worn, multiplied together (1 with none from below the present night). */
export function equipmentDensity(state: GameState, worn = wornItems(state)): number {
  let total = 1;
  for (const item of worn) total *= relicDensity(item);
  return total;
}

/**
 * What a relic is worth to the company as it stands: how many times its damage is multiplied
 * with the relic worn in its slot rather than the slot left empty. Its DPS affix (forged and
 * awakened), its density, its traits and the companion it remembers, the places it completes
 * with the others worn and a named effect on the company's rhythm all count; gold, strikes and
 * damage to guardians are not damage of the company and stay out of it.
 */
export function relicCompanyGain(state: GameState, item: Item, now: number): number {
  const { [item.slot]: _worn, ...others } = state.equipment;
  const bare = derive({ ...state, equipment: others }, now, { ignoreTimed: true });
  const worn = derive({ ...state, equipment: { ...others, [item.slot]: item } }, now, { ignoreTimed: true });
  if (bare.dps > 0) return worn.dps / bare.dps;
  return bare.dpsMultiplier > 0 ? worn.dpsMultiplier / bare.dpsMultiplier : 1;
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

/**
 * Everything `derive` reads besides the companions' levels. Worked out once, it gives the
 * company's numbers at any levels (`deriveAt`), as many times as a choice between levels asks.
 */
export interface DeriveBase {
  bits: number;
  /** Each companion's multipliers on top of their milestones, in the order they apply (by `HEROES` index). */
  heroFactors: number[][];
  dpsMultiplier: number;
  idleBonus: number;
  clickBase: number;
  clickFlatMult: number;
  clickDps: number;
  blade: number;
  sharpness: number;
  relicClick: number;
  /** The numbers the levels do not change. */
  rest: Omit<Derived, "dps" | "heroDps" | "click" | "patienceDps">;
  /** Each companion's multiplier at the levels `damageAt` already weighed. */
  mults: (Map<number, number> | undefined)[];
}

export function deriveBase(state: GameState, now: number, options: DeriveOptions = {}): DeriveBase {
  const timed = !options.ignoreTimed;
  // Damage is written in the night's unit: each companion's milestones carry it (see `scale.ts`).
  const bits = runBits(state);
  const heroFactors: number[][] = [];
  const worn = wornItems(state);
  let globalDps = 1;
  let clickMult = 1;
  let clickDps = 0;
  let idleDps = 0;
  let critChance = 0;
  let critAdd = 0;
  let goldPct = 0;
  let bossTimer = BASE_BOSS_TIMER;
  let treasure = BASE_TREASURE_CHANCE;

  const tiers: number[] = [];
  for (const hero of HEROES) {
    const factors: number[] = [];
    const tier = recognitionTier(state, hero.id);
    tiers.push(tier);
    // A companion who fully remembers the walker fights harder (Recognition 5).
    if (tier >= 5) factors.push(1 + RECOGNITION_DPS);
    // Every word kept to a companion doubles their damage for good (the Promise).
    factors.push(dPow(2, promiseDoublings(state, hero.id)));
    // A relic that remembers who carried it: that companion fights harder while it is worn.
    for (const item of worn) if (item.memory === hero.id) factors.push(MEMORY_MULT[item.rarity]);
    heroFactors.push(factors);
  }

  for (const upgradeId of state.heroUpgrades) {
    const entry = UPGRADE_BY_ID[upgradeId];
    if (!entry) continue;
    const effect = entry.upgrade.effect;
    switch (effect.kind) {
      case "heroDps": heroFactors[entry.hero.index]?.push(effect.mult); break;
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

  // The Briar Mantle, Quietus and Morgrath's Phylactery deepen the company's rhythm.
  // So do a weapon that remembers its rhythm (Rhythm) and the relics of the Wychwood worn together.
  const idleBonus = (altarValue(state, "patience") + idleDps) * (1 + namedEffect(state, "idleBonus", worn)) * (1 + namedEffect(state, "phylactery", worn))
    * wornTrait(worn, "rhythm", 1) * placeBonus(worn, "wychwood");
  // A weapon that remembers the host it led (Host): more for every companion in the company.
  const host = wornTrait(worn, "host");
  const hired = host > 0 ? HEROES.reduce((count, hero) => count + (hero.id !== CLICK_HERO_ID && (state.heroLevels[hero.id] ?? 0) > 0 ? 1 : 0), 0) : 0;
  const achievements = achievementBonus(state);
  let dpsMultiplier = globalDps
    * (1 + achievements)
    * (1 + state.essences * ESSENCE_DPS_BONUS)
    * (1 + altarValue(state, "might"))
    * (1 + equipmentBonus(state, "dps", worn))
    * equipmentDensity(state, worn)
    * wornTrait(worn, "vanguard", 1)
    * (1 + host * hired)
    * (1 + state.ritualStacks * 0.05);
  if (timed) {
    if (skillActive(state, "rally", now)) dpsMultiplier *= 2;
    if (buffActive(state, "rage", now)) dpsMultiplier *= 2;
    if (buffActive(state, "overcharge", now)) dpsMultiplier *= 7;
    // Another walker's echo fights beside the company for a while.
    if (buffActive(state, "walker", now)) dpsMultiplier *= WALKER_DPS;
    if (buffActive(state, "reunion", now)) dpsMultiplier *= reunionDps(state, worn);
    // Dawnbreak, while a Seam is open.
    if (state.monster?.event === "seam") dpsMultiplier *= 1 + namedEffect(state, "seamDps", worn);
  }

  // Aldric's own damage carries the early game; the share of companion DPS takes over later.
  const clickFlatMult = clickMult * (1 + equipmentBonus(state, "click", worn)) * (1 + achievements * 0.5);
  const sharpness = timed && buffActive(state, "sharpness", now) ? 10 : 1;
  // The Seed of the Old Grove grows with every companion who remembers; the Phylactery takes half.
  const seed = namedEffect(state, "clickPerRemembered", worn);
  const remembered = RECOGNITION_HEROES.filter((hero) => (Object.hasOwn(HERO_BY_ID, hero) ? tiers[HERO_BY_ID[hero].index] : recognitionTier(state, hero)) >= 5).length;
  // An amulet that remembers the walker's hand (Edge) sharpens the whole strike.
  const relicClick = (1 + Math.min(GROVE_SEED_MAX, seed * remembered)) * (1 - namedEffect(state, "phylactery", worn)) * wornTrait(worn, "edge", 1);

  critChance += altarValue(state, "precision") + equipmentBonus(state, "critChance", worn);
  if (timed && skillActive(state, "hawkeye", now)) critChance += 0.5;

  const critMultiplier = (BASE_CRIT_MULTIPLIER + critAdd) * (1 + altarValue(state, "fate") + equipmentBonus(state, "critDamage", worn));

  let goldMultiplier = (1 + goldPct) * (1 + altarValue(state, "fortune")) * (1 + equipmentBonus(state, "gold", worn)) * (1 + bestiaryGoldBonus(state)) * (1 + namedEffect(state, "mirelle", worn))
    * relicGoldMultiplier(worn);
  if (timed && skillActive(state, "goldrain", now)) goldMultiplier *= 3;
  if (timed && buffActive(state, "fortune", now)) goldMultiplier *= 2;

  let autoClicksPerSecond = 0;
  if (timed && skillActive(state, "frenzy", now)) autoClicksPerSecond += 10;
  if (timed && buffActive(state, "autoclick", now)) autoClicksPerSecond += 5;

  // Pip's Cheese doubles the chance to meet him, inside the same cap.
  const cheese = timed && buffActive(state, "cheese", now) ? 2 : 1;
  const lantern = timed && buffActive(state, "lantern", now);
  const regalia = wearsRegalia(state, worn) ? REGALIA_KING_DAMAGE : 0;
  return {
    bits,
    heroFactors,
    dpsMultiplier,
    idleBonus,
    clickBase: bits === 0 ? 1 : fromLog(0, bits),
    clickFlatMult,
    clickDps,
    // The Altar of the Blade sharpens the whole strike, the companions' share included.
    blade: 1 + altarValue(state, "blade"),
    sharpness,
    relicClick,
    mults: [],
    rest: {
      critChance: Math.min(1, critChance),
      critMultiplier,
      goldMultiplier,
      // Thorvald's bet (his promise): every seam open for a share of its time.
      bossTimer: (bossTimer + altarValue(state, "time") + namedEffect(state, "bossTimer", worn) + wornTrait(worn, "bulwark") + placeBonus(worn, "mire", 0)) * (promiseOf(state, "seam")?.share ?? 1),
      // The Scales of Aurelion bite deeper into elites and guardians.
      bossDamage: (1 + equipmentBonus(state, "bossDamage", worn)) * (1 + namedEffect(state, "bossDamage", worn)),
      guardianGold: 1 + namedEffect(state, "guardianGold", worn),
      treasureChance: Math.min(MAX_TREASURE_CHANCE, (treasure + altarValue(state, "treasure") + namedEffect(state, "treasure", worn) + relicTreasure(worn)) * cheese),
      dpsMultiplier: dpsMultiplier * (1 + idleBonus),
      essenceMultiplier: (1 + altarValue(state, "harvest")) * (1 + equipmentBonus(state, "essence", worn)) * dPow(1 + WEAVE_BY_ID.plenty.valuePerLevel, weaveLevel(state, "plenty")),
      idleBonus,
      clickDpsShare: clickDps,
      autoClicksPerSecond,
      kingDamage: (1 + namedEffect(state, "kingDamage", worn)) * (1 + regalia) * wornTrait(worn, "regicide", 1) * placeBonus(worn, "keep"),
      baronDamage: wearing(state, "mirelle-ring", worn) ? 1 + MIRELLE_BARON_DAMAGE : 1,
      crystalStay: Math.max(13, namedEffect(state, "crystalStay", worn)),
      // The Lantern calls them every 45 to 90 s instead of 90 to 240 s; the Lodestone and the Loom sooner still.
      crystalWait: (lantern ? LANTERN_CRYSTAL_WAIT : 1) * (1 - namedEffect(state, "crystalSooner", worn)) * (1 - weaveValue(state, "humming-loom")) * (1 - wornTrait(worn, "attention")),
      fragmentChance: fragmentMultiplier(state, now)
    }
  };
}

/**
 * A companion's multiplier at a level: their milestones, then their own factors in order.
 * `remember`: kept in the base, for whoever weighs the same levels again and again.
 */
function heroMultAt(base: DeriveBase, index: number, level: number, remember: boolean): number {
  const known = remember ? base.mults[index]?.get(level) : undefined;
  if (known !== undefined) return known;
  let heroMult = milestoneMultiplier(level, base.bits);
  for (const factor of base.heroFactors[index]) heroMult *= factor;
  if (remember) (base.mults[index] ??= new Map()).set(level, heroMult);
  return heroMult;
}

/**
 * The company's damage and strike from `base` at these levels (and each companion's damage
 * into `heroDps` when given): what `deriveAt` and `damageAt` share.
 */
function companyAt(base: DeriveBase, heroLevels: Record<string, number>, remember: boolean, heroDps?: Record<string, number>) {
  // The Patience bonus: the company's own rhythm, whatever the walker does. Strikes add to
  // it, and draw their share on the DPS without it.
  const idleFactor = 1 + base.idleBonus;
  let activeDps = 0;
  let clickHeroMult = 0;
  for (let index = 0; index < HEROES.length; index += 1) {
    const hero = HEROES[index];
    const level = heroLevels[hero.id] ?? 0;
    const heroMult = heroMultAt(base, index, level, remember);
    if (hero.id === CLICK_HERO_ID) clickHeroMult = heroMult;
    const value = hero.baseDps * level * heroMult * base.dpsMultiplier;
    if (heroDps) heroDps[hero.id] = value * idleFactor;
    activeDps += value;
  }
  const dps = activeDps * idleFactor;
  const aldricLevel = heroLevels[CLICK_HERO_ID] ?? 0;
  const click = ((base.clickBase + aldricLevel * clickHeroMult) * base.clickFlatMult + activeDps * base.clickDps) * base.blade * base.sharpness * base.relicClick;
  return { dps, click, activeDps };
}

/** The company's numbers from `base` at these levels. */
export function deriveAt(base: DeriveBase, heroLevels: Record<string, number>): Derived {
  const heroDps: Record<string, number> = {};
  const { dps, click, activeDps } = companyAt(base, heroLevels, false, heroDps);
  return { dps, heroDps, click, patienceDps: activeDps * base.idleBonus, ...base.rest };
}

/** Only the damage and the strike of `deriveAt`, for whoever weighs many levels. */
export function damageAt(base: DeriveBase, heroLevels: Record<string, number>): Pick<Derived, "dps" | "click" | "critChance" | "critMultiplier"> {
  const { dps, click } = companyAt(base, heroLevels, true);
  return { dps, click, critChance: base.rest.critChance, critMultiplier: base.rest.critMultiplier };
}

export function derive(state: GameState, now: number, options: DeriveOptions = {}): Derived {
  return deriveAt(deriveBase(state, now, options), state.heroLevels);
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

/**
 * Whether a companion can be given the walker's word: their request can be granted, and the
 * night it asks for is one the walker has already walked (every stage it needs cleared lies
 * under the best stage ever, counted from where the next night starts). Lysandre does not
 * ask for two Kings of a walker who has only ever seen one fall.
 */
export function promiseAskable(state: GameState, heroId: string, start = wandererSkip(state) + 1): boolean {
  if (!promiseGrantable(state, heroId)) return false;
  return promiseDepth(PROMISE_BY_HERO[heroId], start) < state.maxStageEver;
}

/**
 * When a word to this companion would take effect: `tonight` while the night is still at its
 * dusk, otherwise at the `next` one; `null` when they cannot be asked. Nobody asks two nights
 * running: the companion of last night waits for the next dusk, tonight's for the one after.
 */
export function promiseWhen(state: GameState, heroId: string): "tonight" | "next" | null {
  // Tonight's road starts where this night did; the next one, where the Wanderer's altar will set it.
  if (promiseAtDusk(state, heroId) && heroId !== state.lastPromise && promiseAskable(state, heroId, state.runStartStage)) return "tonight";
  return heroId !== state.trail.promise?.hero && promiseAskable(state, heroId) ? "next" : null;
}

/** Share of the usual wait between wandering crystals while the Moth Lantern burns. */
export const LANTERN_CRYSTAL_WAIT = 0.4;

/** Essences a crystal grants when it carries some (more the deeper the walker has been). */
export function crystalEssenceReward(maxStageEver: number): number {
  return 1 + Math.floor(maxStageEver / 100);
}

/** Starting gold after an ascension (Altar of Memory), in a unit of `bits` bits. */
export function memoryStartGold(level: number, bits = 0): number {
  if (level <= 0) return 0;
  if (bits === 0) return Math.floor(100 * stageGold(level * 5));
  return 100 * stageGold(level * 5, bits);
}

export const OFFLINE_CAP_SECONDS = OFFLINE_BASE_CAP_HOURS * 3600;

/** A single catch-up's cap for this walker: the Long Thread adds an hour per level, a ring that remembers watching (Vigil) its hours. */
export function offlineCapSeconds(state: GameState): number {
  return (OFFLINE_BASE_CAP_HOURS + weaveValue(state, "long-thread") + wornTrait(wornItems(state), "vigil")) * 3600;
}

/** Shards the forge asks for the next level of an item (the Unfinished Hammer lowers it). */
export function forgePrice(state: GameState, item: Item): number {
  return Math.ceil(forgeCost(item.rarity, item.forge) * (1 - namedEffect(state, "forgeDiscount")));
}

/** Power cooldowns: the Altar of Echoes, Eldra's Locket and the trait Breath, never below 40% of the base. */
export function skillCooldownMultiplier(state: GameState): number {
  return Math.max(COOLDOWN_FLOOR, 1 - altarValue(state, "echoes") - namedEffect(state, "cooldown") - wornTrait(wornItems(state), "breath"));
}

/** Shards awakening a relic asks now (the Unfinished Hammer lowers it, as at the forge). */
export function awakenPrice(state: GameState, item: Item): number {
  return Math.ceil(awakenCost(item, state.maxStageEver) * (1 - namedEffect(state, "forgeDiscount")));
}

/** Shards Brom asks to rekindle a relic now (the Unfinished Hammer lowers it, as at the forge). */
export function rekindlePrice(state: GameState, item: Item): number {
  return Math.ceil(rekindleCost(item) * (1 - namedEffect(state, "forgeDiscount")));
}

/** Gold, multiplied by the relics worn: a ring that remembers fortune, the relics of the Hearthfields. */
export function relicGoldMultiplier(worn: readonly Item[]): number {
  return wornTrait(worn, "fortune", 1) * placeBonus(worn, "hearthfields");
}

/** Golden rat chance the relics worn add: an amulet that remembers Pip, four relics of the Hearthfields. */
export function relicTreasure(worn: readonly Item[]): number {
  return wornTrait(worn, "pip") + (placeCount(worn, "hearthfields") >= 4 ? PLACE_TREASURE : 0);
}
