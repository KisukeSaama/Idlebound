/**
 * Anti-cheat checks run by the server on every cloud save.
 *
 * The game runs client-side (it is an idle game), so the server does not replay every
 * click. Instead it recomputes everything deterministic with the same engine and checks
 * ledgers that cannot all lie at once:
 *  - what was spent (levels, talents, altars) must have been earned;
 *  - what was earned must fit in the time that really elapsed on the server;
 *  - the stage reached must be beatable with the power the save declares;
 *  - items and achievements must match their generation rules.
 *
 * Violation messages are for logs and developers; the UI localizes by `code`.
 */
import { ACHIEVEMENT_BY_ID } from "./data/achievements";
import { ALTARS, ALTAR_BY_ID, altarTotalCost, legacyHarvestCost } from "./data/altars";
import { BIOMES, KING_FORMS, GUARDIAN_IDS, eraForStage, isBossStage, isKingStage } from "./data/biomes";
import { DESCENT_MIN_STAGE, DESCENT_OPEN_STAGE, LEGACY_LOOM_HERO, WEAVE_BY_ID, legacyThreadsFor, threadsFor, weaveTotalCost, type WeaveId } from "./data/descent";
import { EVENTS, SEAM_ODDS, STORM_CRYSTALS, UNFINISHED_ODDS, WAGER_MIN_GOLD, WALKER_DPS } from "./data/events";
import { HERO_BY_ID, UPGRADE_BY_ID } from "./data/heroes";
import { AFFIX_CAP, FORGE_MAX, INVENTORY_LIMIT, RARITY_INFO, SLOT_BASE_COUNT, SLOT_MAIN_STAT, forgeCost } from "./data/items";
import { CARAVAN_WARES, isoWeek } from "./data/caravan";
import { BUFF_DURATION_SECONDS, BUFF_MAX_SECONDS, isMarketBuff, MARKET_BUFFS, MARKET_BY_ID } from "./data/market";
import { CRYSTAL_SHARDS_MAX, salvageValue } from "./engine";
import { LANTERN_CRYSTAL_WAIT, MAX_STAGE, affixValue, altarValue, MAX_TREASURE_CHANCE, MONSTERS_PER_STAGE, REUNION_DPS, ROUT_STEP_SECONDS, WOUND_CAP, WOUND_LAST_STAGE, altarMaxLevel, bossHp, crystalEssenceReward, derive, equipmentBonus, equipmentBonusUncapped, essencesForStage, heroCost, memoryStartGold, stageGold, upgradeCost, WAGER_MAX_GOLD, wandererSkip, weaveLevel } from "./formulas";
import { maxAffixValue } from "./loot";
import {
  BESTIARY_BY_ID,
  EVEN_RATS,
  GOOD_BOY_RUNS,
  LAST_SECOND_TIMES,
  LEGACY_RECOGNITION_TIERS,
  LESSONS,
  LISTEN_SECONDS,
  NIGHT_OWL_SECONDS,
  NOTCH_KILLS,
  RECOGNITION_HEROES,
  RECOGNITION_PROMISES,
  SECRET_IDS,
  TONGUE_SECONDS,
  WANDERERS,
  WANDERER_BY_ID,
  WELCOME_BACK_MS,
  bestiaryKills,
  recognitionRuns,
  recognitionThresholds,
  recognitionTier,
  recognitionTierByRuns,
  type SecretId
} from "./data/lore";
import { PROMISE_BY_HERO, companionMet, promiseAsker, promiseDepth, promiseKings, promisesKept, promisesKeptInAll } from "./data/promises";
import { COOLDOWN_FLOOR, NAMED_BY_ID, NAMED_RELICS, namedEffect, namedSourceReached, type NamedEffect } from "./data/relics";
import { SKILLS } from "./data/skills";
import { AGE_COUNT, keystonesFound } from "./data/strata";
import { lifeBits, rescale, runBits } from "./scale";
import { SAVE_VERSION } from "./state";
import type { AltarId, GameState, Item, ItemSlot, LifetimeStats, Rarity } from "./types";
import { pow as dPow } from "./dmath";
import { STREAMS } from "./fates";

export interface Violation {
  code: string;
  message: string;
}

/** Relative tolerance for floating-point rounding. */
const EPSILON = 1e-6;
/** Highest stackable timed damage multiplier (rally × rage × overcharge × a walker's echo × Dawnbreak in a Seam × the Reunion). */
const MAX_TIMED_DPS = 2 * 2 * 7 * WALKER_DPS * 1.25 * REUNION_DPS;
/** Highest timed gold multiplier (golden rain × elixir). */
const MAX_TIMED_GOLD = 3 * 2;
/** Human clicks + frenzy + scroll, with margin. */
const MAX_CLICKS_PER_SECOND = 40;
/** Minimum respawn 0.35 s → fewer than 3 kills per second. */
const MAX_KILLS_PER_SECOND = 3;
/** Kills the Altar of the Wanderer can grant in one go (its maximum skip for this walker, 10 per stage). */
function maxSkipKills(state: GameState): number {
  return (altarMaxLevel(state, "wanderer") * ALTAR_BY_ID.wanderer.valuePerLevel + 5) * MONSTERS_PER_STAGE;
}
/**
 * Stages the Altar of the Wanderer may have skipped at the dusk that began this run: the Ring
 * of the Second Morning counts when found, worn then or not (it may have been taken off since).
 */
function maxWandererSkip(state: GameState): number {
  const ring = state.named.reduce((total, id) => total + (NAMED_BY_ID[id]?.effect.kind === "wandererStages" ? NAMED_BY_ID[id].effect.pct : 0), 0);
  const skip = Math.min(altarValue(state, "wanderer") + ring, Math.floor(state.maxStageEver / 2));
  return Math.floor(skip / 5) * 5;
}
/** Slack granted to client/server clocks. */
const CLOCK_SLACK_SECONDS = 120;
/** A device clock may run ahead of the server's, but not by more than this. */
const FUTURE_TICK_SLACK_MS = 10 * 60_000;
/** Seconds a single ascension or Descent takes at the very least (a whole night walked). */
const MIN_RUN_SECONDS = 30;
/**
 * Stages a record may stand past the deepest stage the server saw a night reach: the road
 * walked between the last save and a dusk (a few seconds online, a night caught up offline).
 */
export const RECORD_GAP = 50;
const WEEK_SECONDS = 7 * 86_400;
/** Launch date: no save can be older. */
export const GAME_EPOCH = Date.UTC(2026, 0, 1);

/** The strongest effect of a kind that named relics could ever add up to. */
function namedMax(kind: NamedEffect["kind"]): number {
  return NAMED_RELICS.reduce((total, relic) => total + (relic.effect.kind === kind ? relic.effect.pct : 0), 0);
}

/**
 * Seconds between two wandering crystals at the very least: the Lantern's pace, the
 * Lodestone and a whole Humming Loom at once. A Crystal Storm brings five in one call.
 */
const HUMMING_LOOM = WEAVE_BY_ID["humming-loom"];
const MIN_CRYSTAL_SECONDS = 90 * LANTERN_CRYSTAL_WAIT * (1 - namedMax("crystalSooner")) * (1 - HUMMING_LOOM.maxLevel * HUMMING_LOOM.valuePerLevel);
/** Crystals that can have fallen in so many seconds (each wake of the tab may call one at once). */
function maxCrystals(seconds: number, wakes: number): number {
  return STORM_CRYSTALS * (Math.max(0, seconds) / MIN_CRYSTAL_SECONDS + wakes + 2);
}

/** Cheapest hour of bottled time, in shards: the stall's hourglass or the Caravan's night, every discount worn. */
const MIN_HOURGLASS_SHARDS = (() => {
  const discount = 1 - namedMax("marketDiscount");
  const night = CARAVAN_WARES.find((ware) => ware.id === "bottled-night")!;
  return Math.min(Math.max(1, Math.ceil(MARKET_BY_ID.hourglass.cost * discount)), Math.max(1, Math.ceil(night.cost * discount)) / 2);
})();

/**
 * Cheapest ten minutes of a stall boon, in shards: a potion, an elixir, a scroll, or half an
 * Ember Draught (which pours both), every discount worn.
 */
const MIN_BOON_SHARDS = (() => {
  const discount = 1 - namedMax("marketDiscount");
  const draught = CARAVAN_WARES.find((ware) => ware.id === "ember-draught")!;
  const potions = MARKET_BUFFS.map((id) => Math.max(1, Math.ceil(MARKET_BY_ID[id].cost * discount)));
  return Math.min(...potions, Math.max(1, Math.ceil(draught.cost * discount)) / 2);
})();

/**
 * Salvage gives back half an item's shards per forge level, and each level cost at least
 * twice its shards (less the Unfinished Hammer): the share of forge spending that returns.
 * A chest pays back far less than it costs (a tenth on average), so the same share of every
 * shard spent covers both.
 */
const SPENT_RETURN_SHARE = 0.5 / (2 * (1 - namedMax("forgeDiscount")));
/** Cheapest relic a chest brings, in shards: a chest, a great chest, the Caravan's three or its coffer, every discount worn. */
const MIN_CHEST_SHARDS = (() => {
  const discount = 1 - namedMax("marketDiscount");
  const price = (cost: number) => Math.max(1, Math.ceil(cost * discount));
  const ware = (id: string) => price(CARAVAN_WARES.find((entry) => entry.id === id)!.cost);
  return Math.min(price(MARKET_BY_ID.chest.cost), price(MARKET_BY_ID["great-chest"].cost), ware("three-chests") / 3, ware("sealed-coffer"));
})();
/**
 * Shards salvaging relics returns before their forge levels: each legendary and mythic at its
 * worth, a guardian's or a Seam's other relic as an epic, a chest's as a rare (a chest's epic
 * is paid back by the share of its price above).
 */
function salvageShards(finds: { items: number; legendaries: number; mythics: number; drops: number }): number {
  const plain = Math.max(0, finds.items - finds.legendaries - finds.mythics);
  const dropped = Math.min(plain, finds.drops);
  return finds.mythics * RARITY_INFO.mythic.shards + finds.legendaries * RARITY_INFO.legendary.shards + dropped * RARITY_INFO.epic.shards + (plain - dropped) * RARITY_INFO.rare.shards;
}
/** Boss stages (guardians and lesser guardians) from `from` to just before `to`. */
function bossStages(from: number, to: number): number {
  return to <= from ? 0 : Math.floor((to - 1) / 5) - Math.floor((from - 1) / 5);
}
/** Kills that first clear every stage from `from` to just before `to`: a whole stage of monsters each, a guardian alone. */
function stageKills(from: number, to: number): number {
  if (to <= from) return 0;
  const bosses = bossStages(from, to);
  return (to - from - bosses) * MONSTERS_PER_STAGE + bosses;
}

/** Shards a guardian of this depth drops at most. */
function guardianShards(maxStageEver: number): number {
  return 1 + Math.floor(maxStageEver / 25) + namedMax("guardianShards");
}
/** Shards the forge levels of an item cost at the very least. */
function forgeSpend(item: Item): number {
  let total = 0;
  for (let level = 0; level < item.forge; level += 1) total += Math.ceil(forgeCost(item.rarity, level) * (1 - namedMax("forgeDiscount")));
  return total;
}
/** The named relics of a rarity the walker holds the story of (each was found once). */
function namedOf(state: GameState, rarity: Rarity): number {
  return state.named.filter((id) => NAMED_BY_ID[id]?.rarity === rarity).length;
}
/**
 * Relics and shards over a whole game. Relics drop from the guardian blocking the road, from a
 * Seam closed, as a named relic, or from a chest paid in shards; shards from guardians, Seams,
 * crystals and salvage, plus the share of shards spent that salvage gives back. Legendaries
 * and mythics stay within a generous share of their sources. `guardians` is the bosses that
 * may have dropped something (every boss beaten, for a game the server kept from the days
 * a boss replayed paid like the first).
 */
function verifyFinds(state: GameState, guardians: number, fail: (code: string, message: string) => void) {
  const lifetime = state.lifetime;
  const spent = Math.max(0, lifetime.shardsEarned - state.shards);
  const drops = guardians + lifetime.seams;
  if (lifetime.itemsFound > drops + state.named.length + spent / MIN_CHEST_SHARDS + 1) fail("item", "More relics found than guardians, Seams and chests gave.");
  if (lifetime.legendaries + lifetime.mythics > lifetime.itemsFound) fail("item", "More legendaries and mythics than relics found.");
  if (lifetime.legendaries > namedOf(state, "legendary") + drops * 0.1 + spent / 250 + 10) fail("item", "More legendaries than luck allows.");
  if (lifetime.mythics > namedOf(state, "mythic") + drops * 0.02 + spent / 2_000 + 6) fail("item", "More mythics than luck allows.");
  const salvage = salvageShards({ items: lifetime.itemsFound, legendaries: lifetime.legendaries, mythics: lifetime.mythics, drops: drops + state.named.length });
  const found = guardians * guardianShards(state.maxStageEver) + lifetime.seams + lifetime.crystals * CRYSTAL_SHARDS_MAX + salvage;
  if (!le(lifetime.shardsEarned, found / (1 - SPENT_RETURN_SHARE) + 1)) fail("shards-earned", "More shards earned than deeds yield.");
}

/** Highest level of the Altar of the Harvest the essences ever gathered could have bought, up to `cap`, at the price `cost`. */
function harvestAffordable(state: GameState, cap: number, cost: (level: number) => number = (level) => altarTotalCost("harvest", level)): number {
  let harvest = 0;
  while (harvest < cap && cost(harvest + 1) <= state.lifetime.essencesEarned + 1) harvest += 1;
  return harvest;
}
/** The Harvest had no cap before save version 11: what an older save's past ascensions are checked against. */
const LEGACY_HARVEST_MAX = 1_000;

/**
 * Highest essence multiplier an ascension of this walker ever had. The Altar of the Harvest
 * falls with each Descent, so it is taken at the highest level every essence ever gathered
 * could have bought, within its cap; `past` adds the level an older save could hold before
 * the cap came (its ascensions of then stay in its ledgers).
 */
function maxEssenceMultiplier(state: GameState, past = true): number {
  const bought = Math.max(state.altars.harvest ?? 0, harvestAffordable(state, ALTAR_BY_ID.harvest.maxLevel));
  const harvest = past ? Math.max(bought, state.legacyHarvest ?? 0) : bought;
  return (1 + harvest * ALTAR_BY_ID.harvest.valuePerLevel) * (1 + AFFIX_CAP.essence! * 4) * dPow(1 + WEAVE_BY_ID.plenty.valuePerLevel, weaveLevel(state, "plenty"));
}
/** Most essences one ascension of this walker can grant. */
function maxAscensionEssences(state: GameState, past = true): number {
  return essencesForStage(state.maxStageEver - 1) * maxEssenceMultiplier(state, past) + 1;
}

const HERO_BY_ID_COUNT = Object.keys(HERO_BY_ID).length;
const le = (a: number, b: number) => a <= b * (1 + EPSILON) + EPSILON;
/**
 * What adding to a total this large may round up by: past 2^53 a total moves in steps (32
 * essences at 2.5e17), so a gain between two saves reads larger than it was.
 */
const rounding = (total: number) => Math.abs(total) * Number.EPSILON * 2;

/** The least the night's companions and talents cost, in the night's unit (see `scale.ts`). */
/** Statistics written in a unit of `from` bits, in one of `to` (gold and the hardest blow; see `scale.ts`). */
function statsIn<T extends { goldEarned: number; maxHit?: number }>(stats: T, from: number, to: number): T {
  if (from === to) return stats;
  const moved = { ...stats, goldEarned: rescale(stats.goldEarned, from, to) };
  if (stats.maxHit !== undefined) moved.maxHit = rescale(stats.maxHit, from, to);
  return moved;
}

function heroSpend(state: GameState): number {
  const bits = runBits(state);
  let total = 0;
  for (const [heroId, level] of Object.entries(state.heroLevels)) {
    const hero = HERO_BY_ID[heroId];
    if (hero && level > 0) total += heroCost(hero, 0, level, 0.5, bits);
  }
  for (const upgradeId of state.heroUpgrades) total += upgradeCost(upgradeId, bits);
  return total;
}

function altarSpend(state: GameState): number {
  let total = 0;
  for (const [id, level] of Object.entries(state.altars)) {
    if (ALTAR_BY_ID[id as AltarId]) total += altarTotalCost(id as AltarId, level ?? 0);
  }
  return total;
}

/** Checks that depend on the save alone. */
export function verifyState(state: GameState, serverNow: number): Violation[] {
  const violations: Violation[] = [];
  const fail = (code: string, message: string) => violations.push({ code, message });

  // Progression structure.
  if (state.stage > state.maxStage || state.maxStage > state.maxStageEver) fail("stage-order", "Inconsistent stage order.");
  if (state.runStartStage > state.maxStage || state.runStartStage > maxWandererSkip(state) + 1) fail("stage-order", "Run started further than the Altar of the Wanderer allows.");
  if (state.createdAt < GAME_EPOCH || state.createdAt > serverNow + CLOCK_SLACK_SECONDS * 1000) fail("created-at", "Impossible creation date.");
  const age = (serverNow - state.createdAt) / 1000 + CLOCK_SLACK_SECONDS;
  if (state.lifetime.playTime + state.lifetime.offlineSeconds > age) fail("time", "More play time than the game has existed.");

  // Kills and gold bounded by total time and the best reachable loot.
  const totalSeconds = state.lifetime.playTime + state.lifetime.offlineSeconds;
  // An hourglass pours an hour of kills at once.
  const pouredSeconds = state.lifetime.hourglasses * 3600;
  // A Rout fells a stage in one step, only on a night after the first, under the best stage.
  if (state.lifetime.routs > (totalSeconds + CLOCK_SLACK_SECONDS) / ROUT_STEP_SECONDS) fail("routs", "Routs faster than the road allows.");
  if (state.lifetime.routs > (state.lifetime.ascensions + state.descents) * state.maxStageEver) fail("routs", "More Routs than the nights walked allow.");
  if (state.lifetime.kills > (totalSeconds + pouredSeconds) * MAX_KILLS_PER_SECOND + 10 + state.lifetime.ascensions * maxSkipKills(state) + state.lifetime.routs * MONSTERS_PER_STAGE) fail("kills", "Too many kills for the play time.");
  if (state.lifetime.clicks > state.lifetime.playTime * MAX_CLICKS_PER_SECOND + 10) fail("clicks", "Impossible click rate.");
  // A rebirth takes at least half a minute of the game running (online or caught up), and
  // every stage is left by a kill (the Wanderer's skip counts its kills) or by Unweave, a power.
  const creditedSeconds = Math.min(Math.max(0, age), totalSeconds + CLOCK_SLACK_SECONDS);
  if (state.lifetime.ascensions > creditedSeconds / MIN_RUN_SECONDS + 1) fail("ascension", "More ascensions than time allows.");
  if (state.descents > creditedSeconds / MIN_RUN_SECONDS + 1) fail("descent", "More Descents than time allows.");
  if (state.lifetime.bosses > state.lifetime.kills) fail("kills", "More guardians than kills.");
  if (state.maxStageEver - 1 > state.lifetime.kills + state.lifetime.skillsUsed) fail("stage", "Stages cleared without fighting.");
  // Boons are measured from the last tick: it cannot lie far in the server's future.
  if (state.lastTickAt > serverNow + FUTURE_TICK_SLACK_MS) fail("time", "Last tick in the future.");
  if (state.caravanWeek > isoWeek(serverNow + FUTURE_TICK_SLACK_MS)) fail("caravan", "A Caravan from a week to come.");
  // Crystals fall at a bounded pace, while the game has existed on the server's clock.
  if (state.lifetime.crystals > maxCrystals(Math.max(0, age), state.lore.dreams)) fail("crystals", "More crystals than time allows.");
  const bestGold = bestGoldPerKill(state);
  const goldBound = (state.lifetime.kills + state.lifetime.crystals * 15 + state.lifetime.hourglasses * 12_000 + 1) * bestGold + state.lifetime.treasures * bestWagerGold(state);
  if (!le(state.lifetime.goldEarned, goldBound)) fail("gold", "Too much gold earned.");

  // Lifetime ledgers ≥ current-run ledgers (gold and blows written in the night's unit).
  for (const key of ["clicks", "crits", "kills", "bosses", "treasures", "goldEarned", "crystals", "skillsUsed", "maxHit", "playTime"] as const) {
    const run = key === "goldEarned" || key === "maxHit" ? rescale(state.run[key], runBits(state), lifeBits(state)) : state.run[key];
    if (!le(run, state.lifetime[key])) fail("run-lifetime", `Inconsistent statistic "${key}".`);
  }
  // Each Ritual is a power used this run.
  if (state.ritualStacks > state.run.skillsUsed) fail("skills", "More ritual stacks than powers used.");
  if (state.lifetime.crits > state.lifetime.clicks + state.lifetime.playTime * 15 + 10) fail("crits", "Too many critical hits.");

  // Companions and talents.
  for (const heroId of Object.keys(state.heroLevels)) {
    if (!HERO_BY_ID[heroId]) fail("hero", `Unknown companion: ${heroId}.`);
  }
  const upgrades = new Set<string>();
  for (const upgradeId of state.heroUpgrades) {
    const entry = UPGRADE_BY_ID[upgradeId];
    if (!entry) { fail("upgrade", `Unknown talent: ${upgradeId}.`); continue; }
    if (upgrades.has(upgradeId)) fail("upgrade", "Talent bought twice.");
    upgrades.add(upgradeId);
    if ((state.heroLevels[entry.hero.id] ?? 0) < entry.upgrade.level) fail("upgrade", "Talent bought without the required level.");
  }

  const levels = Object.values(state.heroLevels);
  if (levels.reduce((total, value) => total + value, 0) > state.lifetime.bestLevelSum) fail("hero", "Inconsistent level record.");
  if (levels.filter((value) => value > 0).length > state.lifetime.bestHired) fail("hero", "Inconsistent hiring record.");
  if (state.lifetime.bestHired > HERO_BY_ID_COUNT) fail("hero", "Too many companions hired.");

  // Gold: spent + owned ≤ earned + starting gold.
  const startGold = memoryStartGold(state.altars.memory ?? 0, runBits(state));
  if (!le(heroSpend(state) + state.gold, state.run.goldEarned + startGold)) fail("gold-ledger", "More gold spent than earned.");

  // Essences: altars + owned ≤ collected.
  for (const id of Object.keys(state.altars)) {
    const altar = ALTAR_BY_ID[id as AltarId];
    if (!altar) fail("altar", `Unknown altar: ${id}.`);
    else if (altar.maxLevel > 0 && (state.altars[id as AltarId] ?? 0) > altarMaxLevel(state, id as AltarId)) fail("altar", "Altar level above maximum.");
  }
  if (!le(altarSpend(state) + state.essences, state.lifetime.essencesEarned)) fail("essence-ledger", "More essences spent than collected.");
  // The Harvest an older save held above today's cap is no higher than its essences could buy.
  if ((state.legacyHarvest ?? 0) > harvestAffordable(state, LEGACY_HARVEST_MAX, legacyHarvestCost)) fail("altar", "A Harvest of old the essences gathered could never have raised.");
  // The Warp of Plenty multiplies every ascension's essences; the Harvest of a night in the
  // history may have fallen since (a Descent, the cap of version 11).
  const essenceCap = maxEssenceMultiplier(state);
  const ascensionTotal = state.ascensions.reduce((total, record) => total + record.essences, 0);
  for (const record of state.ascensions) {
    if (record.maxStage > state.maxStageEver) fail("ascension", "Ascension from a stage never reached.");
    if (!le(record.essences, essencesForStage(record.maxStage - 1) * essenceCap + 1)) fail("ascension", "Ascension too generous.");
  }
  // Every essence came from an ascension or a crystal. The history keeps only the last
  // ascensions: the ledger of all of them holds at least its sum, and each ascension at most
  // what the deepest stage pays.
  const crystalEssences = state.lifetime.crystals * crystalEssenceReward(state.maxStageEver);
  const fromAscensions = state.lifetime.ascensionEssences;
  if (!le(ascensionTotal, fromAscensions + 1) || !le(fromAscensions, state.lifetime.ascensions * maxAscensionEssences(state))) {
    fail("essence-source", "Ascension essences outside their ledger.");
  }
  if (!le(state.lifetime.essencesEarned, fromAscensions + crystalEssences + 1)) fail("essence-source", "Essences of unknown origin.");
  if (state.ascensions.length > state.lifetime.ascensions) fail("ascension", "Inconsistent ascension history.");

  // Shards: owned ≤ earned ≤ what guardians, Seams, crystals and salvage yield.
  if (state.shards > state.lifetime.shardsEarned) fail("shards", "More shards owned than earned.");
  verifyFinds(state, state.lifetime.bosses, fail);
  // Bottled hours are bought with shards, and so are the forge levels the relics carry.
  if (state.lifetime.hourglasses * MIN_HOURGLASS_SHARDS > state.lifetime.shardsEarned) fail("hourglasses", "More hourglasses than shards could buy.");
  const forged = [...Object.values(state.equipment), ...state.inventory].reduce((total, item) => total + (item ? forgeSpend(item) : 0), 0);
  if (forged + state.lifetime.hourglasses * MIN_HOURGLASS_SHARDS + state.shards > state.lifetime.shardsEarned) fail("forge", "More forge levels than the shards earned could pay.");
  // Golden rats come with one kill in four at most, Seams with one in four hundred.
  if (state.lifetime.treasures > state.lifetime.kills * MAX_TREASURE_CHANCE * 1.2 + 50) fail("kills", "More golden rats than luck allows.");
  if (state.lifetime.seams > (state.lifetime.kills * 4) / SEAM_ODDS + 25) fail("lore", "More Seams than luck allows.");

  // Items. Named relics always find room, even in a full pack.
  const items = [...Object.values(state.equipment), ...state.inventory].filter((item) => item !== undefined);
  if (state.inventory.length > INVENTORY_LIMIT + state.inventory.filter((item) => item.named).length) fail("inventory", "Inventory too large.");
  const uids = new Set<string>();
  for (const item of items) {
    if (uids.has(item.uid)) fail("item", "Duplicate item.");
    uids.add(item.uid);
    // The level is also the relic's stratum, so it bounds its density (a damage multiplier).
    if (item.level > state.maxStageEver) fail("item", "Item from a stage never reached.");
    if (item.forge > FORGE_MAX) fail("item", "Forge level above maximum.");
    if (item.base !== undefined && item.base >= SLOT_BASE_COUNT[item.slot]) fail("item", "Unknown item base.");
    if (item.named !== undefined) {
      const def = NAMED_BY_ID[item.named];
      if (!def || def.slot !== item.slot || def.rarity !== item.rarity || !state.named.includes(item.named)) fail("named", `Unknown named relic on item ${item.uid}.`);
    }
    const info = RARITY_INFO[item.rarity];
    const extra = item.rarity === "legendary" || item.rarity === "mythic" ? 1 : 0;
    if (item.affixes.length > info.affixes + extra) fail("item", "Too many affixes.");
    if (item.affixes[0]?.stat !== SLOT_MAIN_STAT[item.slot]) fail("item", "Invalid main affix.");
    const stats = new Set<string>();
    for (const affix of item.affixes) {
      if (stats.has(affix.stat)) fail("item", "Duplicate affix.");
      stats.add(affix.stat);
      if (!le(affix.value, maxAffixValue(affix.stat, item.rarity, item.level))) fail("item", `Affix too strong on item ${item.uid}.`);
    }
  }
  const itemEquipped = Object.entries(state.equipment).every(([slot, item]) => !item || item.slot === slot);
  if (!itemEquipped) fail("item", "Item equipped in the wrong slot.");
  if (items.length > state.lifetime.itemsFound + 1) fail("item", "More items than items found.");

  verifyChronicle(state, serverNow, fail);
  verifyDescent(state, fail);

  // Achievements, each earned once.
  if (new Set(state.achievements).size !== state.achievements.length) fail("achievement", "Achievement listed twice.");
  for (const id of state.achievements) {
    const achievement = ACHIEVEMENT_BY_ID[id];
    if (!achievement) fail("achievement", `Unknown achievement: ${id}.`);
    else if (achievement.metric(state) < achievement.threshold) fail("achievement", `Unearned achievement: ${id}.`);
  }

  // Power: the last boss beaten in this run must be beatable with this build (bosses the
  // Altar of the Wanderer skipped were not fought).
  const lastBoss = lastBossCleared(state.maxStage);
  if (lastBoss >= state.runStartStage) {
    // Companions with their whole Patience bonus plus every strike on top: strikes only
    // ever take that bonus's place, so the sum bounds what was dealt.
    const derived = derive(state, serverNow, { ignoreTimed: true });
    // Every click a crit at maximum rate, ×10 for the crystals' "sharpness" bonus.
    const burstClick = derived.click * Math.max(1, derived.critMultiplier) * MAX_CLICKS_PER_SECOND * 10;
    // Relics past the cap on damage to guardians count whole: that boss may have fallen
    // before the cap existed, and the worn relics are verified above either way.
    const bossDamage = (derived.bossDamage * (1 + equipmentBonusUncapped(state, "bossDamage"))) / (1 + equipmentBonus(state, "bossDamage"));
    const maxDps = (derived.dps * MAX_TIMED_DPS + burstClick) * bossDamage * (isKingStage(lastBoss) ? derived.kingDamage : 1) * derived.baronDamage;
    // ×10 margin: items salvaged since, rounding, chained overcharge crystals…
    // A boss of the present night may have kept its wounds from earlier fights.
    const wounds = lastBoss <= WOUND_LAST_STAGE && !isKingStage(lastBoss) ? 1 - WOUND_CAP : 1;
    if (maxDps * derived.bossTimer * 10 < bossHp(lastBoss, runBits(state)) * wounds) fail("power", `Stage ${lastBoss} boss cannot be beaten with this power.`);
  }

  return violations;
}

/** The Chronicle's counters, each bounded by statistics the Ledger already verifies. */
function verifyChronicle(state: GameState, serverNow: number, fail: (code: string, message: string) => void) {
  const guardians = new Set([...GUARDIAN_IDS, ...BIOMES.map((biome) => biome.miniBoss.id)]);
  const kings = new Set(KING_FORMS);
  const lifetime = state.lifetime;
  let kills = 0;
  let bossKills = 0;
  let kingKills = 0;
  for (const [id, count] of Object.entries(state.bestiary)) {
    if (!BESTIARY_BY_ID[id]) {
      fail("bestiary", `Unknown creature: ${id}.`);
      continue;
    }
    // The Lantern Queen is seen, not killed: one Crystal Storm per crystal at most.
    if (id === "lantern-queen") {
      if (count > lifetime.playTime / 90 + 1) fail("bestiary", "Too many Crystal Storms.");
      continue;
    }
    // A walker's echo fights beside the company: one per guardian's first clear at most.
    if (id === "walker-echo") {
      if (count > state.maxStageEver / 10 + 1) fail("bestiary", "Too many echoes of walkers.");
      continue;
    }
    kills += count;
    if (guardians.has(id)) bossKills += count;
    if (kings.has(id)) kingKills += count;
  }
  if (kills > lifetime.kills) fail("bestiary", "More creatures recorded than kills.");
  if (bossKills > lifetime.bosses) fail("bestiary", "More guardians recorded than bosses.");
  if (kingKills > lifetime.kings || lifetime.kings > lifetime.bosses) fail("bestiary", "More Kings recorded than beaten.");
  if (lifetime.seams > lifetime.kills) fail("lore", "More Seams closed than kills.");
  // A rare wanderer is met once a run at most.
  for (const wanderer of WANDERERS) {
    if (bestiaryKills(state, wanderer.id) > lifetime.ascensions + state.descents + 1) fail("bestiary", `Too many encounters with ${wanderer.id}.`);
  }
  const trail = state.trail;
  for (const id of trail.wanderers) {
    if (!WANDERER_BY_ID[id]) fail("trail", `Unknown wanderer: ${id}.`);
  }
  if (new Set(trail.wanderers).size !== trail.wanderers.length) fail("trail", "Wanderer met twice in a run.");
  if (trail.fieldKills > state.run.kills) fail("trail", "More field kills than kills this run.");
  if (trail.rest > lifetime.bossFails || trail.evenRats > state.run.treasures || trail.listen > state.run.playTime + CLOCK_SLACK_SECONDS) fail("trail", "Inconsistent trail.");
  if (trail.offered > lifetime.essencesEarned + 1) fail("trail", "More essences offered than gathered.");
  if (trail.migration && !BIOMES.some((biome) => biome.id === trail.migration!.biome)) fail("trail", "Unknown migration.");
  // Wounds stay only on a boss of the present night, at the head of the run, up to their cap.
  // Boons (the Reunion included) last an hour at most from the last tick; the stall's pile up,
  // but never past what every shard ever earned could have bought.
  const lasting = (buff: GameState["buffs"][number]) => Math.max(0, buff.until - state.lastTickAt) / 1000;
  if (state.buffs.some((buff) => !isMarketBuff(buff.id) && lasting(buff) > BUFF_MAX_SECONDS + CLOCK_SLACK_SECONDS)) fail("buff", "A boon lasts too long.");
  const bottled = state.buffs.filter((buff) => isMarketBuff(buff.id)).reduce((sum, buff) => sum + lasting(buff), 0);
  if (bottled > (state.lifetime.shardsEarned / MIN_BOON_SHARDS) * BUFF_DURATION_SECONDS + CLOCK_SLACK_SECONDS) fail("buff", "More boon time than shards could buy.");
  if (trail.wound && (trail.wound.share > WOUND_CAP + EPSILON || trail.wound.stage > WOUND_LAST_STAGE || trail.wound.stage !== state.maxStage || !isBossStage(trail.wound.stage) || lifetime.bossFails === 0)) fail("trail", "Impossible wounds.");

  const lore = state.lore;
  // One guardian per biome and stratum: a biome's echoes never outnumber its first clears,
  // below the Dawn too (the strata go on, the keystones stop at sixty).
  const strata = keystonesFound(state.maxStageEver) + 1;
  const crossed = eraForStage(state.maxStageEver) + 1;
  for (const [biome, count] of Object.entries(lore.echoes)) {
    if (!BIOMES.some((entry) => entry.id === biome)) fail("lore", `Unknown biome echoes: ${biome}.`);
    else if (count > crossed || count > lifetime.bosses) fail("lore", "More echoes than guardians.");
  }
  let ageEchoes = 0;
  for (const [age, count] of Object.entries(lore.ages)) {
    const index = Number(age);
    if (!Number.isInteger(index) || index < 0 || index >= AGE_COUNT) fail("lore", `Unknown Age: ${age}.`);
    ageEchoes += count;
  }
  const quiet = bestiaryKills(state, "the-quiet");
  if (ageEchoes > keystonesFound(state.maxStageEver) + lifetime.seams + quiet + lifetime.kills / UNFINISHED_ODDS + 1) fail("lore", "More Age echoes than their sources.");
  if (lore.songs > lifetime.crystals) fail("lore", "More songs than crystals.");
  if (lore.dreams > lifetime.offlineSeconds / 3600 + 1) fail("lore", "More returns than absences.");
  if (lore.sayings > lifetime.playTime + 10) fail("lore", "More visits to the stall than seconds played.");
  if (lore.regalia > lifetime.ascensions || lore.biscuit > lifetime.ascensions) fail("lore", "More remembered nights than nights.");
  if (lore.lastSeconds > lifetime.bosses) fail("lore", "More last seconds than guardians.");
  if (lore.nightSeconds > lifetime.playTime + CLOCK_SLACK_SECONDS) fail("lore", "More night time than play time.");
  if (lore.tongues.fr + lore.tongues.en > lifetime.playTime + CLOCK_SLACK_SECONDS) fail("lore", "More time in two languages than play time.");
  if (new Set(lore.lessons).size !== lore.lessons.length || lore.lessons.some((id) => !LESSONS.includes(id))) fail("lore", "Unknown Lesson.");
  if (lore.readings.length > state.descents || lore.readings.some((count) => count > strata)) fail("lore", "Readings of strata never crossed.");
  if (new Set(lore.events).size !== lore.events.length || lore.events.some((id) => !(EVENTS as readonly string[]).includes(id))) fail("lore", "Unknown event.");
  if (new Set(lore.altars).size !== lore.altars.length || lore.altars.some((id) => !ALTAR_BY_ID[id as AltarId])) fail("lore", "Unknown altar legend.");

  // A night counts once for a companion, twice for each of the two words their memories ask.
  const doubled = RECOGNITION_PROMISES[RECOGNITION_PROMISES.length - 1];
  for (const [heroId, runs] of Object.entries(state.recognition)) {
    if (!HERO_BY_ID[heroId]) fail("recognition", `Unknown companion: ${heroId}.`);
    else if (runs > lifetime.ascensions + Math.min(doubled, promisesKept(state, heroId))) fail("recognition", "More remembered runs than ascensions.");
  }
  // What a companion remembered before promises came is what the runs alone had earned.
  const thresholds = recognitionThresholds(state, LEGACY_RECOGNITION_TIERS);
  for (const [heroId, tier] of Object.entries(state.remembered)) {
    if (!RECOGNITION_HEROES.includes(heroId)) fail("recognition", `Unknown companion: ${heroId}.`);
    else if (recognitionTierByRuns(recognitionRuns(state, heroId), thresholds) < tier) fail("recognition", "A memory older than the runs that earned it.");
  }
  verifyPromises(state, fail);

  if (new Set(state.named).size !== state.named.length) fail("named", "Named relic found twice.");
  for (const id of state.named) {
    const def = NAMED_BY_ID[id];
    if (!def) fail("named", `Unknown named relic: ${id}.`);
    else if (!namedSourceReached(state, def)) fail("named", `Named relic from a source never reached: ${id}.`);
  }
  const named = [...Object.values(state.equipment), ...state.inventory].filter((item) => item?.named).map((item) => item!.named);
  if (new Set(named).size !== named.length) fail("named", "Duplicate named relic.");

  if (new Set(state.secrets).size !== state.secrets.length) fail("secret", "Secret found twice.");
  for (const id of state.secrets) {
    if (!SECRET_IDS.includes(id)) fail("secret", `Unknown secret: ${id}.`);
    else if (!secretPossible(state, id as SecretId, serverNow)) fail("secret", `Secret without its conditions: ${id}.`);
  }
}

/** Promises: one word a night at most, kept only on a night whose King fell. */
function verifyPromises(state: GameState, fail: (code: string, message: string) => void) {
  const lifetime = state.lifetime;
  for (const heroId of Object.keys(state.promises)) {
    if (!Object.hasOwn(PROMISE_BY_HERO, heroId)) fail("promise", `Unknown companion: ${heroId}.`);
  }
  if (promisesKeptInAll(state) > lifetime.ascensions) fail("promise", "More promises kept than nights.");
  if (state.pledge !== undefined && !Object.hasOwn(PROMISE_BY_HERO, state.pledge)) fail("promise", `Unknown companion: ${state.pledge}.`);
  if (state.lastPromise !== undefined && !Object.hasOwn(PROMISE_BY_HERO, state.lastPromise)) fail("promise", `Unknown companion: ${state.lastPromise}.`);
  const promise = state.trail.promise;
  if (!promise) return;
  const def = Object.hasOwn(PROMISE_BY_HERO, promise.hero) ? PROMISE_BY_HERO[promise.hero] : undefined;
  if (!def) {
    fail("promise", `Unknown companion: ${promise.hero}.`);
    return;
  }
  if (!promiseAsker(state, promise.hero) || !companionMet(state, promise.hero)) fail("promise", "A promise to someone who does not remember the walker.");
  // Nobody asks two nights running, and nobody asks for a night the walker never walked.
  if (promise.hero === state.lastPromise) fail("promise", "The same companion asked two nights running.");
  if (promiseDepth(def, state.runStartStage) >= state.maxStageEver) fail("promise", "A promise deeper than the walker ever went.");
  // Its Kings were fought this night, at the head of the run.
  const kingsAhead = Math.floor((state.maxStage - 1) / 50) - Math.floor((state.runStartStage - 1) / 50);
  if (promise.kings > kingsAhead || promise.kings > state.run.bosses || promise.kings > lifetime.kings) fail("promise", "More Kings than the night has seen fall.");
  if ((promise.waited || promise.released) && state.run.bosses === 0) fail("promise", "A guardian that never fell.");
  if (promise.waited && def.kind !== "wait") fail("promise", "Nothing to wait for.");
  if (promise.released && def.kind !== "head") fail("promise", "Nobody to follow.");
  if (promise.released && def.kind === "head" && def.until === "king" && promise.kings < promiseKings(def)) fail("promise", "Released before the King fell.");
  if (promise.goal !== undefined && (def.kind !== "further" || promise.goal > state.maxStageEver)) fail("promise", "A night deeper than any night walked.");
  // What the word forbids was not done while it stood.
  if (!promise.broken) {
    if (def.kind === "without" && (state.heroLevels[def.other] ?? 0) > 0) fail("promise", "The companion left behind was hired.");
    if (def.kind === "abstain" && def.from === "strikes" && state.run.clicks > 0) fail("promise", "A strike under a promise to sheathe the sword.");
    if (def.kind === "abstain" && def.from === "powers" && state.run.skillsUsed > 0) fail("promise", "A power used under a promise of silence.");
    if (def.kind === "abstain" && def.from === "crystals" && state.run.crystals > 0) fail("promise", "A crystal caught under a promise to leave them.");
    if (def.kind === "abstain" && def.from === "essences" && state.trail.offered > 0) fail("promise", "Essences offered under a promise to keep them.");
    if (def.kind === "head" && !promise.released) {
      const limit = HERO_BY_ID[def.hero].index;
      if (Object.entries(state.heroLevels).some(([heroId, level]) => level > 0 && (HERO_BY_ID[heroId]?.index ?? 0) > limit)) fail("promise", "The company grew past its head.");
    }
  }
}

/** Whether a save shows what a secret needs (secrets give no power: a coarse check is enough). */
function secretPossible(state: GameState, id: SecretId, serverNow: number): boolean {
  const lifetime = state.lifetime;
  switch (id) {
    case "let-him-rest": return lifetime.bossFails >= 3 && state.maxStageEver >= 50;
    case "even": return lifetime.treasures >= EVEN_RATS;
    case "faceless": return lifetime.bestHired > HERO_BY_ID.nyx.index;
    case "small-change": return lifetime.mythics > 0;
    case "night-owl": return state.lore.nightSeconds >= NIGHT_OWL_SECONDS;
    case "thousandth-notch": return lifetime.kills >= NOTCH_KILLS;
    case "same-road": return lifetime.ascensions >= 3;
    case "keep-some": return lifetime.ascensions >= 1;
    case "how-it-starts": return lifetime.essencesEarned >= 1_000;
    case "empty-hands": return lifetime.kings >= 1;
    case "pacifist": return state.maxStageEver >= 50;
    case "last-second": return state.lore.lastSeconds >= LAST_SECOND_TIMES;
    case "listening": return lifetime.playTime >= LISTEN_SECONDS;
    case "good-boy": return state.lore.biscuit >= GOOD_BOY_RUNS;
    case "till-death": return state.named.includes("mirelle-ring");
    case "last-blow": return recognitionTier(state, "kaelen") >= 5 && lifetime.kings >= 1;
    case "it-wears-you": return state.descents >= 10;
    case "behind-the-glass": return state.maxStageEver > 2_000;
    case "two-tongues": return state.lore.tongues.fr >= TONGUE_SECONDS && state.lore.tongues.en >= TONGUE_SECONDS;
    case "welcome-back": return serverNow - state.createdAt >= WELCOME_BACK_MS;
  }
}

/** The Descent: a thread no longer than the deepest stage weaves, spent only on weaves that exist. */
function verifyDescent(state: GameState, fail: (code: string, message: string) => void) {
  const lifetime = state.lifetime;
  const deepest = state.maxStageEver;
  if (state.descents > 0 && (deepest < DESCENT_MIN_STAGE || (deepest < DESCENT_OPEN_STAGE && recognitionTier(state, LEGACY_LOOM_HERO) < 5))) fail("descent", "Descent without the Loom.");
  let spent = 0;
  for (const [id, level] of Object.entries(state.weaves)) {
    const weave = WEAVE_BY_ID[id as WeaveId];
    if (!weave) {
      fail("descent", `Unknown weave: ${id}.`);
      continue;
    }
    if (weave.maxLevel > 0 && (level ?? 0) > weave.maxLevel) fail("descent", "Weave above its cap.");
    spent += weaveTotalCost(id as WeaveId, level ?? 0);
  }
  if (spent + state.threads > lifetime.threads) fail("descent", "More threads spent than woven.");
  if (state.descents === 0 && lifetime.threads > 0) fail("descent", "Threads woven without a Descent.");
  // A night rewoven is a Descent that wove one thread at least.
  if (lifetime.weavings > state.descents || lifetime.weavings > lifetime.threads) fail("descent", "More nights rewoven than threads woven.");
  // Before version 11 each Descent wove at most what every essence ever gathered could weave:
  // those threads stay. Since, the thread is as long as the deepest stage, and no longer.
  const legacy = state.legacyThreads ?? 0;
  if (legacy > state.descents * legacyThreadsFor(lifetime.essencesEarned)) fail("descent", "More threads than essences allowed.");
  if (lifetime.threads > Math.max(legacy, threadsFor(deepest))) fail("descent", "More threads than the deepest stage weaves.");
  if (!/^(\d{4}-W\d{2})?$/.test(state.caravanWeek)) fail("descent", "Unknown Caravan week.");
}

/**
 * The company's gold multiplier at its richest. The Altar of Fortune falls with each Descent,
 * the gold earned under it does not: it is taken at the highest level every essence ever
 * gathered could have bought, as the Harvest is (a walker who has just descended earned
 * their gold with it).
 */
function richestGoldMultiplier(state: GameState): number {
  const fortune = Math.max(state.altars.fortune ?? 0, harvestAffordable(state, Number.POSITIVE_INFINITY, (level) => altarTotalCost("fortune", level)));
  return derive({ ...state, altars: { ...state.altars, fortune } }, state.lastTickAt, { ignoreTimed: true }).goldMultiplier;
}

/**
 * Best loot of a single kill: boss of the best stage, at a won wager's floor, every bonus
 * active. Gold totals are written in the walk's unit (see `scale.ts`), and so is this.
 */
function bestGoldPerKill(state: GameState): number {
  return stageGold(state.maxStageEver, lifeBits(state)) * 10 * WAGER_MIN_GOLD * MAX_TIMED_GOLD * richestGoldMultiplier(state);
}

/**
 * Best loot of a single kill between two saves: boss of the best stage, every boon active,
 * under the richer of the two companies, wearing the best gold relic of each slot either
 * save holds (a relic swapped out before saving still paid while worn). A won wager is paid
 * by its golden rat (`bestWagerGold`).
 */
function bestGoldPerKillBetween(previous: GameState, next: GameState): number {
  const best: Partial<Record<ItemSlot, number>> = {};
  for (const state of [previous, next]) {
    for (const item of [...Object.values(state.equipment), ...state.inventory]) {
      if (item) best[item.slot] = Math.max(best[item.slot] ?? 0, affixValue(item, "gold"));
    }
  }
  const relics = 1 + Object.values(best).reduce((total, value) => total + value, 0);
  const company = Math.max(...[previous, next].map((state) => derive(state, state.lastTickAt, { ignoreTimed: true }).goldMultiplier / ((1 + equipmentBonus(state, "gold")) * (1 + namedEffect(state, "mirelle")))));
  const found = (kind: NamedEffect["kind"]) => next.named.reduce((total, id) => total + (NAMED_BY_ID[id]?.effect.kind === kind ? NAMED_BY_ID[id].effect.pct : 0), 0);
  return stageGold(Math.max(previous.maxStageEver, next.maxStageEver), lifeBits(next)) * 10 * MAX_TIMED_GOLD * company * relics * (1 + found("mirelle")) * (1 + found("guardianGold"));
}

/** Best won Pip's Wager, beyond a kill: one at most per golden rat caught (in the walk's unit). */
function bestWagerGold(state: GameState): number {
  return stageGold(state.maxStageEver, lifeBits(state)) * WAGER_MAX_GOLD * MAX_TIMED_GOLD * richestGoldMultiplier(state);
}

function lastBossCleared(maxStage: number): number {
  for (let stage = maxStage - 1; stage >= 1; stage -= 1) {
    if (isBossStage(stage)) return stage;
  }
  return 0;
}

/** Checks between two accepted saves, using the time measured by the server. */
export function verifyTransition(previous: GameState, next: GameState, elapsedMs: number): Violation[] {
  const violations: Violation[] = [];
  const fail = (code: string, message: string) => violations.push({ code, message });
  const elapsed = Math.max(0, elapsedMs / 1000) + CLOCK_SLACK_SECONDS;
  // The previous save's totals in the next one's unit: the deeper walk writes them larger (see `scale.ts`).
  const a = statsIn(previous.lifetime, lifeBits(previous), lifeBits(next));
  const b = next.lifetime;

  if (next.createdAt !== previous.createdAt) fail("identity", "This save does not continue the previous one.");
  // Fates are drawn in order: an occasion used is never drawn again (see `fates.ts`).
  for (const stream of STREAMS) {
    if (next.fates[stream] < previous.fates[stream]) fail("fates", `The fates of "${stream}" went back.`);
  }

  const monotonic = ["clicks", "crits", "kills", "bosses", "treasures", "goldEarned", "essencesEarned", "ascensionEssences", "shardsEarned", "ascensions", "playTime", "offlineSeconds", "crystals", "hourglasses", "itemsFound", "legendaries", "mythics", "bossFails", "kings", "seams", "threads", "routs", "weavings"] as const;
  for (const key of monotonic) {
    if (b[key] + EPSILON < a[key]) fail("rollback", `Statistic "${key}" went down.`);
  }
  if (next.maxStageEver < previous.maxStageEver) fail("rollback", "Stage record went down.");
  if (b.kings - a.kings > b.bosses - a.bosses) fail("kills", "More Kings than guardians beaten.");
  // A stone of the Sanctum is first raised on its night or later (one already raised stays open).
  for (const altar of ALTARS) {
    if ((next.altars[altar.id] ?? 0) > 0 && !((previous.altars[altar.id] ?? 0) > 0) && b.ascensions + 1 < altar.night) fail("altar", `Altar raised before its night: ${altar.id}.`);
  }
  const recorded = (state: GameState) => Object.values(state.bestiary).reduce((total, count) => total + count, 0);
  if (recorded(next) < recorded(previous)) fail("rollback", "Bestiary went down.");
  for (const [heroId, runs] of Object.entries(previous.recognition)) {
    if ((Object.hasOwn(next.recognition, heroId) ? next.recognition[heroId] : 0) < runs) fail("rollback", "Recognition went down.");
  }
  // Promises: kept ones never go back, one more at most per night ended, and the word given
  // for a night is not swapped or mended before its dusk.
  const nights = Math.max(0, b.ascensions - a.ascensions);
  for (const [heroId, kept] of Object.entries(previous.promises)) {
    if (promisesKept(next, heroId) < kept) fail("rollback", "A promise kept was forgotten.");
  }
  if (promisesKeptInAll(next) - promisesKeptInAll(previous) > nights) fail("promise", "More promises kept than nights ended.");
  for (const [heroId, runs] of Object.entries(next.recognition)) {
    const gained = runs - recognitionRuns(previous, heroId);
    if (gained > nights + promisesKept(next, heroId) - promisesKept(previous, heroId)) fail("recognition", "Recognition grew faster than the nights.");
  }
  const tiers = (state: GameState) => JSON.stringify(Object.entries(state.remembered).sort(([x], [y]) => (x < y ? -1 : 1)));
  if (tiers(next) !== tiers(previous)) fail("recognition", "Memories older than promises cannot change.");
  const given = previous.trail.promise;
  if (given && nights === 0 && next.descents === previous.descents) {
    const now = next.trail.promise;
    if (!now || now.hero !== given.hero) fail("promise", "The word given for the night was swapped.");
    else if ((given.broken && !now.broken) || now.kings < given.kings) fail("promise", "A broken promise was mended.");
  }
  // One dusk later, last night's word is remembered as it was.
  if (nights === 1 && next.descents === previous.descents && next.lastPromise !== given?.hero) fail("promise", "Last night's word was rewritten.");
  if (previous.named.some((id) => !next.named.includes(id))) fail("rollback", "A named relic was forgotten.");
  if (next.descents < previous.descents) fail("rollback", "Descents went down.");
  if (b.threads > a.threads && next.descents === previous.descents) fail("descent", "Threads woven without a Descent.");
  if (b.weavings - a.weavings > Math.min(next.descents - previous.descents, b.threads - a.threads)) fail("descent", "A night rewoven without a Descent that wove.");
  if ((next.legacyThreads ?? 0) !== (previous.legacyThreads ?? 0)) fail("descent", "The threads of an older save cannot change.");
  if (previous.secrets.some((id) => !next.secrets.includes(id))) fail("rollback", "A secret was forgotten.");
  const lore = (state: GameState) => state.lore.songs + state.lore.dreams + Object.values(state.lore.ages).reduce((total, count) => total + count, 0) + Object.values(state.lore.echoes).reduce((total, count) => total + count, 0);
  if (lore(next) < lore(previous)) fail("rollback", "The Chronicle went down.");

  const played = b.playTime - a.playTime;
  const offline = b.offlineSeconds - a.offlineSeconds;
  if (played + offline > elapsed) fail("time", "More play time than elapsed time.");

  const activeSeconds = Math.max(0, played) + 1;
  if (b.clicks - a.clicks > activeSeconds * MAX_CLICKS_PER_SECOND) fail("clicks", "Impossible click rate.");
  const kills = b.kills - a.kills;
  const ascensions = Math.max(0, b.ascensions - a.ascensions);
  const skipKills = ascensions * maxSkipKills(next);
  // An hourglass pours an hour of kills at once (the Caravan's night, two).
  const hourglasses = Math.max(0, b.hourglasses - a.hourglasses);
  // A Rout fells a stage in one step, each stage once a night at most.
  const routed = Math.max(0, b.routs - a.routs);
  if (routed > (activeSeconds + Math.max(0, offline)) / ROUT_STEP_SECONDS + 1) fail("routs", "Routs faster than the road allows.");
  const deepest = next.maxStageEver;
  if (routed > (ascensions + Math.max(0, next.descents - previous.descents) + 1) * deepest) fail("routs", "More Routs than the nights walked allow.");
  if (kills > (activeSeconds + Math.max(0, offline) + hourglasses * 3600) * MAX_KILLS_PER_SECOND + 10 + skipKills + routed * MONSTERS_PER_STAGE) fail("kills", "Too many kills for the elapsed time.");
  // Each new stage is a whole stage of monsters (a guardian alone), or one Unweave.
  const skills = Math.max(0, b.skillsUsed - a.skillsUsed);
  if (stageKills(previous.maxStageEver, next.maxStageEver) > kills + previous.kills + skills * MONSTERS_PER_STAGE) fail("stage", "Stages cleared without fighting.");
  if (b.ascensions - a.ascensions > elapsed / 30 + 1) fail("ascension", "Too many ascensions.");
  if (next.descents - previous.descents > elapsed / 30 + 1) fail("descent", "Too many Descents.");

  // Crystals fall at a bounded pace (each wake of the tab may call one at once).
  const crystals = Math.max(0, b.crystals - a.crystals);
  if (crystals > maxCrystals(elapsed, Math.max(0, next.lore.dreams - previous.lore.dreams))) fail("crystals", "Crystals gathered too fast.");

  // Gold earned ≤ kills × best possible loot (+ crystals and hourglasses).
  const bestGold = bestGoldPerKillBetween(previous, next);
  const goldBound = (kills + crystals * 15 + hourglasses * 12_000 + 1) * bestGold + Math.max(0, b.treasures - a.treasures) * bestWagerGold(next);
  if (!le(b.goldEarned - a.goldEarned, goldBound + rounding(b.goldEarned))) fail("gold", "Gold earned too fast.");

  // Essences: each ascension at most what the deepest stage pays, each crystal its share.
  // The nights since the last save were walked under today's cap on the Harvest.
  const perAscension = maxAscensionEssences(next, false);
  if ((next.legacyHarvest ?? 0) !== (previous.legacyHarvest ?? 0)) fail("altar", "The Harvest of an older save cannot change.");
  const fromAscensions = b.ascensionEssences - a.ascensionEssences;
  if (!le(fromAscensions, ascensions * perAscension + rounding(b.ascensionEssences))) fail("essence-source", "Ascensions too generous.");
  if (!le(b.essencesEarned - a.essencesEarned, Math.min(ascensions * perAscension, Math.max(0, fromAscensions)) + crystals * crystalEssenceReward(deepest) + 1 + rounding(b.essencesEarned))) {
    fail("essence-source", "Essences gathered too fast.");
  }

  // Relics and shards: only the boss blocking the road drops them, once a night per boss
  // stage (the last stage of all stays the frontier for good), and a Seam closed.
  const nightsWalked = ascensions + Math.max(0, next.descents - previous.descents);
  const atEnd = previous.maxStage >= MAX_STAGE || next.maxStage >= MAX_STAGE;
  const frontier = atEnd ? Infinity : bossStages(previous.maxStage, deepest) + nightsWalked * bossStages(1, deepest);
  const guardians = Math.max(0, Math.min(b.bosses - a.bosses, frontier));
  const seams = Math.max(0, b.seams - a.seams);
  const drops = guardians + seams + Math.max(0, next.named.length - previous.named.length);
  const shardsEarned = b.shardsEarned - a.shardsEarned;
  const spent = Math.max(0, previous.shards + shardsEarned - next.shards);
  const items = b.itemsFound - a.itemsFound;
  if (items > drops + spent / MIN_CHEST_SHARDS + EPSILON) fail("item", "Relics found faster than guardians, Seams and chests give.");
  // A relic is what it was when it dropped: only its forge goes up. Any other is a find.
  const before = new Map([...Object.values(previous.equipment), ...previous.inventory].filter((item) => item !== undefined).map((item) => [item.uid, item]));
  let fresh = 0;
  for (const item of [...Object.values(next.equipment), ...next.inventory]) {
    if (!item) continue;
    const was = before.get(item.uid);
    if (!was) fresh += 1;
    else if (!sameRelic(was, item)) fail("item", `Relic remade: ${item.uid}.`);
  }
  if (fresh > items) fail("item", "Relics held that were never found.");
  const legendaries = b.legendaries - a.legendaries;
  const mythics = b.mythics - a.mythics;
  if (legendaries + mythics > items) fail("item", "Legendaries and mythics outside the relics found.");
  // Shards: what the deeds since the last save yield, the salvage of relics found since or
  // already held, and the share of shards spent since that salvage gives back.
  const salvage = salvageShards({ items: Math.max(0, items), legendaries: Math.max(0, legendaries), mythics: Math.max(0, mythics), drops });
  const held = [...Object.values(previous.equipment), ...previous.inventory].reduce((total, item) => total + (item ? salvageValue(item) : 0), 0);
  const found = guardians * guardianShards(deepest) + seams + crystals * CRYSTAL_SHARDS_MAX + salvage + held;
  const shardBound = (found + SPENT_RETURN_SHARE * previous.shards) / (1 - SPENT_RETURN_SHARE) + 1;
  if (!le(shardsEarned, shardBound)) fail("shards-earned", "Shards earned too fast.");
  // Bottled hours paid with shards owned or earned since.
  if (hourglasses * MIN_HOURGLASS_SHARDS > previous.shards + Math.max(0, shardsEarned)) fail("hourglasses", "More hourglasses than shards could buy.");

  return violations;
}

/** The same relic, at most forged further: what dropped never changes. */
function sameRelic(was: Item, now: Item): boolean {
  return was.slot === now.slot && was.rarity === now.rarity && was.level === now.level && was.base === now.base && was.named === now.named && now.forge >= was.forge
    && was.affixes.length === now.affixes.length && was.affixes.every((affix, index) => affix.stat === now.affixes[index].stat && affix.value === now.affixes[index].value);
}

/**
 * A game the server never saw (a first save, or another game replacing the account's): every
 * stage of its record was walked, by kills or an Unweave (see `verifyPace` for its time).
 */
export function verifyFirstSight(state: GameState): Violation[] {
  const violations: Violation[] = [];
  const fail = (code: string, message: string) => violations.push({ code, message });
  const lifetime = state.lifetime;
  if (stageKills(1, state.maxStageEver) > lifetime.kills + lifetime.skillsUsed * MONSTERS_PER_STAGE) fail("stage", "Stages cleared without fighting.");
  // It was played after bosses replayed stopped paying: only the boss blocking the road
  // dropped something, once a night per boss stage.
  const nights = lifetime.ascensions + state.descents + 1;
  const frontier = state.maxStageEver >= MAX_STAGE ? Infinity : nights * bossStages(1, state.maxStageEver);
  verifyFinds(state, Math.min(lifetime.bosses, frontier), fail);
  return violations;
}

/**
 * What the server measures itself across a game's saves, kept beside the save where the
 * walker cannot write it. Every save is checked against it and hands the next one its own.
 */
export interface Pace {
  /** The deepest stage the server saw a night reach: the head of a night, held to its build by the power check. */
  proven: number;
  /** Seconds of play and absence claimed ahead of the time the server saw pass. */
  lead: number;
  /** Powers the walker may still use before they come back. */
  powers: number;
  /** When the present night began at the latest, on the server's clock (ms). */
  nightSince: number;
}

/** Powers ready at once: every one of them, and as many again for the Echo and Eldra's Thread. */
const POWER_RESERVE = 2 * (SKILLS.length + 1);
/** Powers that come back each second at most: every cooldown at its floor, twice over for the Echo. */
const POWER_RATE = SKILLS.reduce((total, skill) => total + 2 / (skill.cooldown * COOLDOWN_FLOOR), 0);
const RITUAL_COOLDOWN = SKILLS.find((skill) => skill.id === "ritual")!.cooldown * COOLDOWN_FLOOR;
/**
 * Share of the server's time a claim may lag behind before its lead counts: two devices'
 * clocks never drift this far, and the jitter of the network washes out of the ledger.
 */
const LEAD_LEAK = 0.01;

/**
 * Checks against the server's own clock and the ledger of the game's past saves (`pace`, absent
 * for a game the server never saw or saved before it was kept). `previous` is the last save
 * of this game the server kept, if any; `elapsedMs` the time the server saw pass since.
 */
export function verifyPace(previous: GameState | undefined, next: GameState, pace: Pace | null | undefined, serverNow: number, elapsedMs: number): { violations: Violation[]; pace: Pace } {
  const violations: Violation[] = [];
  const fail = (code: string, message: string) => violations.push({ code, message });
  // A game never seen is measured from its own first second.
  const since = previous ? serverNow - Math.max(0, elapsedMs) : Math.min(serverNow, next.createdAt);
  const seconds = Math.max(0, serverNow - since) / 1000;
  const base: Pace = pace ?? { proven: previous ? previous.maxStageEver : 0, lead: 0, powers: POWER_RESERVE, nightSince: previous ? previous.createdAt : since };
  const before = previous?.lifetime;
  const rebirths = next.lifetime.ascensions - (before?.ascensions ?? 0) + next.descents - (previous?.descents ?? 0);

  // Time: what the save claims beyond the server's clock piles up, and may not pass the slack.
  const claimed = next.lifetime.playTime + next.lifetime.offlineSeconds - (before ? before.playTime + before.offlineSeconds : 0);
  const lead = Math.max(0, base.lead + claimed - seconds * (1 + LEAD_LEAK));
  if (lead > CLOCK_SLACK_SECONDS) fail("time", "More play time than the server saw pass.");

  // The Caravan comes once a week of the server's calendar: never a week before the last save, nor one to come.
  const caravanMoved = next.caravanWeek !== (previous?.caravanWeek ?? "") && next.caravanWeek !== "";
  if (caravanMoved && (next.caravanWeek < isoWeek(since - CLOCK_SLACK_SECONDS * 1000) || next.caravanWeek > isoWeek(serverNow + CLOCK_SLACK_SECONDS * 1000))) fail("caravan", "A Caravan from another week.");

  // Powers come back at their pace, all at once at each dusk and with Eldra's Thread. Only
  // the stock kept between two saves is capped: powers used as they come back, over a long
  // stretch between two saves, all count.
  const fresh = (Math.max(0, rebirths) + (caravanMoved ? 1 : 0)) * POWER_RESERVE;
  const powers = Math.min(POWER_RESERVE, base.powers) + seconds * POWER_RATE + fresh - (next.lifetime.skillsUsed - (before?.skillsUsed ?? 0));
  if (powers < 0) fail("powers", "Powers used faster than they come back.");
  // Each Ritual of the night stays: twice per cooldown since the night began (the Echo), and once more per Thread.
  const nightSince = rebirths > 0 && previous ? since : base.nightSince;
  const night = Math.max(0, serverNow - nightSince) / 1000;
  if (next.ritualStacks > 2 * (night / RITUAL_COOLDOWN + night / WEEK_SECONDS + 2)) fail("powers", "More Rituals than the night allows.");

  // The record stands no further than a night the server saw, plus the road walked unseen
  // before a dusk: a record set outside any night (no build to check it against) would carry
  // relics, essences and the Roll of the Deep with it.
  const proven = Math.max(base.proven, next.maxStage);
  if (next.maxStageEver > proven + RECORD_GAP) fail("record", "A record deeper than any night the server saw.");

  return { violations, pace: { proven, lead, powers: Math.min(POWER_RESERVE, Math.max(0, powers)), nightSince } };
}

/** The version a raw save declares (0 when it has none): read before any migration. */
export function saveVersionOf(raw: unknown): number {
  const version = raw && typeof raw === "object" ? (raw as { version?: unknown }).version : undefined;
  return typeof version === "number" && Number.isFinite(version) ? version : 0;
}

/**
 * A save never goes back to an older version than the one stored: migrations (the altar
 * refund of version 4) run once, never again on a relabelled save.
 */
export function verifySaveVersion(storedRaw: unknown, nextRaw: unknown): Violation[] {
  const stored = Math.min(saveVersionOf(storedRaw), SAVE_VERSION);
  if (saveVersionOf(nextRaw) < stored) return [{ code: "version", message: "This save is older than the one it replaces." }];
  return [];
}

/**
 * Another game replacing the account's: it may not claim more time than the replaced one had
 * been credited, plus the time the server saw pass since that save.
 */
export function verifyNewLineage(previous: GameState, next: GameState, elapsedMs: number): Violation[] {
  const credited = previous.lifetime.playTime + previous.lifetime.offlineSeconds;
  const allowed = credited + Math.max(0, elapsedMs / 1000) + CLOCK_SLACK_SECONDS;
  if (next.lifetime.playTime + next.lifetime.offlineSeconds > allowed) return [{ code: "lineage-time", message: "This game claims more time than the account has lived." }];
  return [];
}


/** What the Roll ranks, from a save the anti-cheat accepted: the best stage and three tallies. */
export function leaderboardSummary(state: GameState) {
  return {
    maxStage: state.maxStageEver,
    weavings: state.lifetime.weavings,
    promises: promisesKeptInAll(state),
    crystals: state.lifetime.crystals
  };
}
