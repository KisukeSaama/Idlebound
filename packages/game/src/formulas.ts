import { ACHIEVEMENT_BY_ID } from "./data/achievements";
import { ALTAR_BY_ID } from "./data/altars";
import { CLICK_HERO_ID, HEROES, UPGRADE_BY_ID } from "./data/heroes";
import { EQUIPMENT_CAP, FORGE_STEP } from "./data/items";
import type { AffixStat, AltarId, BuffId, Derived, GameState, HeroDef, Item } from "./types";

export const MONSTERS_PER_STAGE = 10;
/** Beyond this, monster HP would exceed floating-point precision. */
export const MAX_STAGE = 3000;
export const BASE_BOSS_TIMER = 30;
export const BASE_CRIT_MULTIPLIER = 10;
export const BASE_TREASURE_CHANCE = 0.01;
export const IDLE_DELAY_MS = 60_000;
export const RESPAWN_SECONDS = 0.35;
export const BOSS_RESPAWN_SECONDS = 0.8;
export const ASCENSION_MIN_STAGE = 51;
export const ESSENCE_DPS_BONUS = 0.1;
export const OFFLINE_BASE_EFFICIENCY = 0.5;
export const OFFLINE_BASE_CAP_HOURS = 8;

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
 * Base gold of a normal monster. The first ten stages pay more (×3 at stage 1, tapering
 * off) so the first purchases come quickly.
 */
export function stageGold(stage: number): number {
  const earlyBoost = 1 + (2 * Math.max(0, 11 - stage)) / 10;
  return Math.max(1, stageHp(stage) / 15) * earlyBoost;
}

export function altarLevel(state: GameState, id: AltarId): number {
  return state.altars[id] ?? 0;
}

export function altarValue(state: GameState, id: AltarId): number {
  return altarLevel(state, id) * ALTAR_BY_ID[id].valuePerLevel;
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

/** Automatic milestones: ×3.5 every 25 levels from level 200. */
export function milestoneMultiplier(level: number): number {
  if (level < 200) return 1;
  return Math.pow(3.5, Math.floor((level - 175) / 25));
}

/**
 * Essences earned on ascension. Growth must stay below monster HP growth, otherwise each
 * ascension pays enough to skip hundreds of stages (runaway).
 */
export function essencesForStage(highestCleared: number): number {
  if (highestCleared < ASCENSION_MIN_STAGE - 1) return 0;
  const early = Math.min(highestCleared, 140) - 50;
  const late = Math.max(0, highestCleared - 140);
  return Math.floor(5 * Math.pow(1.075, early) * Math.pow(1.02, late) + (highestCleared - 50));
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
  const cap = EQUIPMENT_CAP[stat];
  return cap === undefined ? total : Math.min(total, cap);
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
  /** Force the "idle" state (offline). */
  forceIdle?: boolean;
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

  for (const hero of HEROES) heroMult[hero.id] = milestoneMultiplier(state.heroLevels[hero.id] ?? 0);

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

  const idle = options.forceIdle || now - state.lastClickAt >= IDLE_DELAY_MS;
  const idleBonus = altarValue(state, "patience") + idleDps;
  let dpsMultiplier = globalDps
    * (1 + achievementBonus(state))
    * (1 + state.essences * ESSENCE_DPS_BONUS)
    * (1 + altarValue(state, "might"))
    * (1 + equipmentBonus(state, "dps"))
    * (1 + state.ritualStacks * 0.05);
  if (timed) {
    if (skillActive(state, "rally", now)) dpsMultiplier *= 2;
    if (buffActive(state, "rage", now)) dpsMultiplier *= 2;
    if (buffActive(state, "overcharge", now)) dpsMultiplier *= 7;
  }

  // Clicking ends the idle state, so clicks draw on the DPS without the idle bonus.
  const idleFactor = idle ? 1 + idleBonus : 1;
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
  const clickFlatMult = clickMult * (1 + altarValue(state, "blade")) * (1 + equipmentBonus(state, "click")) * (1 + achievementBonus(state) * 0.5);
  const sharpness = timed && buffActive(state, "sharpness", now) ? 10 : 1;
  const click = ((1 + aldricLevel * heroMult[CLICK_HERO_ID]) * clickFlatMult + activeDps * clickDps) * sharpness;

  critChance += altarValue(state, "precision") + equipmentBonus(state, "critChance");
  if (timed && skillActive(state, "hawkeye", now)) critChance += 0.5;

  const critMultiplier = (BASE_CRIT_MULTIPLIER + critAdd) * (1 + altarValue(state, "fate") + equipmentBonus(state, "critDamage"));

  let goldMultiplier = (1 + goldPct) * (1 + altarValue(state, "fortune")) * (1 + equipmentBonus(state, "gold"));
  if (timed && skillActive(state, "goldrain", now)) goldMultiplier *= 3;
  if (timed && buffActive(state, "fortune", now)) goldMultiplier *= 2;

  let autoClicksPerSecond = 0;
  if (timed && skillActive(state, "frenzy", now)) autoClicksPerSecond += 10;
  if (timed && buffActive(state, "autoclick", now)) autoClicksPerSecond += 5;

  return {
    dps,
    heroDps,
    click,
    critChance: Math.min(1, critChance),
    critMultiplier,
    goldMultiplier,
    bossTimer: bossTimer + altarValue(state, "time"),
    bossDamage: 1 + equipmentBonus(state, "bossDamage"),
    treasureChance: Math.min(0.25, treasure + altarValue(state, "treasure")),
    dpsMultiplier: dpsMultiplier * idleFactor,
    essenceMultiplier: (1 + altarValue(state, "harvest")) * (1 + equipmentBonus(state, "essence")),
    idle,
    idleBonus,
    clickDpsShare: clickDps,
    autoClicksPerSecond
  };
}

export function ascensionPreview(state: GameState, now: number): number {
  const highestCleared = state.maxStage - 1;
  if (highestCleared < ASCENSION_MIN_STAGE - 1) return 0;
  return Math.floor(essencesForStage(highestCleared) * derive(state, now).essenceMultiplier);
}

/** Starting gold after an ascension (Altar of Memory). */
export function memoryStartGold(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(100 * stageGold(level * 5));
}

export function offlineCapSeconds(state: GameState): number {
  return (OFFLINE_BASE_CAP_HOURS + altarLevel(state, "wanderer")) * 3600;
}

export function offlineEfficiency(state: GameState): number {
  return Math.min(1, OFFLINE_BASE_EFFICIENCY + altarValue(state, "wanderer"));
}

export function skillCooldownMultiplier(state: GameState): number {
  return 1 - altarValue(state, "echoes");
}
