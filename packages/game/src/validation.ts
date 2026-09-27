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
import { ALTAR_BY_ID, altarTotalCost } from "./data/altars";
import { isBossStage } from "./data/biomes";
import { HERO_BY_ID, UPGRADE_BY_ID } from "./data/heroes";
import { AFFIX_CAP, FORGE_MAX, INVENTORY_LIMIT, RARITY_INFO, SLOT_BASE_COUNT, SLOT_MAIN_STAT } from "./data/items";
import { crystalEssenceReward } from "./engine";
import { MONSTERS_PER_STAGE, bossHp, derive, essencesForStage, heroCost, memoryStartGold, stageGold, upgradeCost, wandererSkip } from "./formulas";
import { maxAffixValue } from "./loot";
import type { AltarId, GameState } from "./types";

export interface Violation {
  code: string;
  message: string;
}

/** Relative tolerance for floating-point rounding. */
const EPSILON = 1e-6;
/** Highest stackable timed damage multiplier (rally × rage × overcharge). */
const MAX_TIMED_DPS = 2 * 2 * 7;
/** Highest timed gold multiplier (golden rain × elixir) × golden rat. */
const MAX_TIMED_GOLD = 3 * 2 * 10;
/** Human clicks + frenzy + scroll, with margin. */
const MAX_CLICKS_PER_SECOND = 40;
/** Minimum respawn 0.35 s → fewer than 3 kills per second. */
const MAX_KILLS_PER_SECOND = 3;
/** Kills the Altar of the Wanderer can grant in one go (its maximum skip, 10 per stage). */
const MAX_SKIP_KILLS = (ALTAR_BY_ID.wanderer.maxLevel * ALTAR_BY_ID.wanderer.valuePerLevel) * MONSTERS_PER_STAGE;
/** Slack granted to client/server clocks. */
const CLOCK_SLACK_SECONDS = 120;
/** Launch date: no save can be older. */
export const GAME_EPOCH = Date.UTC(2026, 0, 1);

const HERO_BY_ID_COUNT = Object.keys(HERO_BY_ID).length;
const le = (a: number, b: number) => a <= b * (1 + EPSILON) + EPSILON;

function heroSpend(state: GameState): number {
  let total = 0;
  for (const [heroId, level] of Object.entries(state.heroLevels)) {
    const hero = HERO_BY_ID[heroId];
    if (hero && level > 0) total += heroCost(hero, 0, level, 0.5);
  }
  for (const upgradeId of state.heroUpgrades) total += upgradeCost(upgradeId);
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
  if (state.runStartStage > state.maxStage || state.runStartStage > wandererSkip(state) + 1) fail("stage-order", "Run started further than the Altar of the Wanderer allows.");
  if (state.createdAt < GAME_EPOCH || state.createdAt > serverNow + CLOCK_SLACK_SECONDS * 1000) fail("created-at", "Impossible creation date.");
  const age = (serverNow - state.createdAt) / 1000 + CLOCK_SLACK_SECONDS;
  if (state.lifetime.playTime + state.lifetime.offlineSeconds > age) fail("time", "More play time than the game has existed.");

  // Kills and gold bounded by total time and the best reachable loot.
  const totalSeconds = state.lifetime.playTime + state.lifetime.offlineSeconds;
  if (state.lifetime.kills > totalSeconds * MAX_KILLS_PER_SECOND + 10 + state.lifetime.ascensions * MAX_SKIP_KILLS) fail("kills", "Too many kills for the play time.");
  if (state.lifetime.clicks > state.lifetime.playTime * MAX_CLICKS_PER_SECOND + 10) fail("clicks", "Impossible click rate.");
  const bestGold = bestGoldPerKill(state);
  const goldBound = (state.lifetime.kills + state.lifetime.crystals * 15 + state.lifetime.hourglasses * 12_000 + 1) * bestGold;
  if (!le(state.lifetime.goldEarned, goldBound)) fail("gold", "Too much gold earned.");

  // Lifetime ledgers ≥ current-run ledgers.
  for (const key of ["clicks", "crits", "kills", "bosses", "treasures", "goldEarned", "crystals", "skillsUsed", "maxHit", "playTime"] as const) {
    if (!le(state.run[key], state.lifetime[key])) fail("run-lifetime", `Inconsistent statistic "${key}".`);
  }
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
  const startGold = memoryStartGold(state.altars.memory ?? 0);
  if (!le(heroSpend(state) + state.gold, state.run.goldEarned + startGold)) fail("gold-ledger", "More gold spent than earned.");

  // Essences: altars + owned ≤ collected.
  for (const id of Object.keys(state.altars)) {
    const altar = ALTAR_BY_ID[id as AltarId];
    if (!altar) fail("altar", `Unknown altar: ${id}.`);
    else if (altar.maxLevel > 0 && (state.altars[id as AltarId] ?? 0) > altar.maxLevel) fail("altar", "Altar level above maximum.");
  }
  if (!le(altarSpend(state) + state.essences, state.lifetime.essencesEarned)) fail("essence-ledger", "More essences spent than collected.");
  const essenceCap = (1 + (state.altars.harvest ?? 0) * 0.1) * (1 + AFFIX_CAP.essence! * 4);
  const ascensionTotal = state.ascensions.reduce((total, record) => total + record.essences, 0);
  for (const record of state.ascensions) {
    if (record.maxStage > state.maxStageEver) fail("ascension", "Ascension from a stage never reached.");
    if (!le(record.essences, essencesForStage(record.maxStage - 1) * essenceCap + 1)) fail("ascension", "Ascension too generous.");
  }
  const crystalEssences = state.lifetime.crystals * crystalEssenceReward(state.maxStageEver);
  if (state.ascensions.length >= state.lifetime.ascensions && !le(state.lifetime.essencesEarned, ascensionTotal + crystalEssences)) {
    fail("essence-source", "Essences of unknown origin.");
  }
  if (state.ascensions.length > state.lifetime.ascensions) fail("ascension", "Inconsistent ascension history.");

  // Shards.
  if (state.shards > state.lifetime.shardsEarned) fail("shards", "More shards owned than earned.");

  // Items.
  const items = [...Object.values(state.equipment), ...state.inventory].filter((item) => item !== undefined);
  if (state.inventory.length > INVENTORY_LIMIT) fail("inventory", "Inventory too large.");
  const uids = new Set<string>();
  for (const item of items) {
    if (uids.has(item.uid)) fail("item", "Duplicate item.");
    uids.add(item.uid);
    if (item.level > state.maxStageEver) fail("item", "Item from a stage never reached.");
    if (item.forge > FORGE_MAX) fail("item", "Forge level above maximum.");
    if (item.base !== undefined && item.base >= SLOT_BASE_COUNT[item.slot]) fail("item", "Unknown item base.");
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

  // Achievements.
  for (const id of state.achievements) {
    const achievement = ACHIEVEMENT_BY_ID[id];
    if (!achievement) fail("achievement", `Unknown achievement: ${id}.`);
    else if (achievement.metric(state) < achievement.threshold) fail("achievement", `Unearned achievement: ${id}.`);
  }

  // Power: the last boss beaten in this run must be beatable with this build (bosses the
  // Altar of the Wanderer skipped were not fought).
  const lastBoss = lastBossCleared(state.maxStage);
  if (lastBoss >= state.runStartStage) {
    // Idle forced: the boss may have been beaten by companions alone, with the idle bonus
    // (clicks never include it, so the click bound is unaffected).
    const derived = derive(state, serverNow, { ignoreTimed: true, forceIdle: true });
    // Every click a crit at maximum rate, ×10 for the crystals' "sharpness" bonus.
    const burstClick = derived.click * Math.max(1, derived.critMultiplier) * MAX_CLICKS_PER_SECOND * 10;
    const maxDps = (derived.dps * MAX_TIMED_DPS + burstClick) * derived.bossDamage;
    // ×10 margin: items salvaged since, rounding, chained overcharge crystals…
    if (maxDps * derived.bossTimer * 10 < bossHp(lastBoss)) fail("power", `Stage ${lastBoss} boss cannot be beaten with this power.`);
  }

  return violations;
}

/** Best loot of a single kill: boss of the best stage, golden rat, every bonus active. */
function bestGoldPerKill(state: GameState): number {
  return stageGold(state.maxStageEver) * 10 * MAX_TIMED_GOLD * derive(state, state.lastTickAt, { ignoreTimed: true }).goldMultiplier;
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
  const a = previous.lifetime;
  const b = next.lifetime;

  if (next.createdAt !== previous.createdAt) fail("identity", "This save does not continue the previous one.");

  const monotonic = ["clicks", "kills", "bosses", "goldEarned", "essencesEarned", "shardsEarned", "ascensions", "playTime", "offlineSeconds", "crystals", "itemsFound"] as const;
  for (const key of monotonic) {
    if (b[key] + EPSILON < a[key]) fail("rollback", `Statistic "${key}" went down.`);
  }
  if (next.maxStageEver < previous.maxStageEver) fail("rollback", "Stage record went down.");

  const played = b.playTime - a.playTime;
  const offline = b.offlineSeconds - a.offlineSeconds;
  if (played + offline > elapsed) fail("time", "More play time than elapsed time.");

  const activeSeconds = Math.max(0, played) + 1;
  if (b.clicks - a.clicks > activeSeconds * MAX_CLICKS_PER_SECOND) fail("clicks", "Impossible click rate.");
  const kills = b.kills - a.kills;
  const skipKills = Math.max(0, b.ascensions - a.ascensions) * MAX_SKIP_KILLS;
  if (kills > (activeSeconds + Math.max(0, offline)) * MAX_KILLS_PER_SECOND + 10 + skipKills) fail("kills", "Too many kills for the elapsed time.");
  if (next.maxStageEver - previous.maxStageEver > kills + 1) fail("stage", "Stages cleared without fighting.");
  if (b.ascensions - a.ascensions > elapsed / 30 + 1) fail("ascension", "Too many ascensions.");

  // Gold earned ≤ kills × best possible loot (+ crystals and hourglasses).
  const bestGold = bestGoldPerKill(next);
  const crystals = b.crystals - a.crystals;
  const hourglasses = b.hourglasses - a.hourglasses;
  const goldBound = (kills + crystals * 15 + hourglasses * 12_000 + 1) * bestGold;
  if (!le(b.goldEarned - a.goldEarned, goldBound)) fail("gold", "Gold earned too fast.");

  return violations;
}

/** Summary used by the leaderboard. */
export function leaderboardSummary(state: GameState) {
  return {
    maxStage: state.maxStageEver,
    ascensions: state.lifetime.ascensions,
    essences: Math.floor(state.lifetime.essencesEarned),
    achievements: state.achievements.length,
    playTime: Math.floor(state.lifetime.playTime)
  };
}

