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
import { BIOMES, KING_FORMS, GUARDIAN_IDS, isBossStage, isKingStage } from "./data/biomes";
import { DESCENT_HERO, DESCENT_MIN_STAGE, WEAVE_BY_ID, threadsFor, weaveTotalCost, type WeaveId } from "./data/descent";
import { EVENTS, UNFINISHED_ODDS, WAGER_GOLD, WALKER_DPS } from "./data/events";
import { HERO_BY_ID, UPGRADE_BY_ID } from "./data/heroes";
import { AFFIX_CAP, FORGE_MAX, INVENTORY_LIMIT, RARITY_INFO, SLOT_BASE_COUNT, SLOT_MAIN_STAT } from "./data/items";
import { BUFF_MAX_SECONDS } from "./data/market";
import { crystalEssenceReward } from "./engine";
import { MONSTERS_PER_STAGE, REUNION_DPS, WOUND_CAP, WOUND_LAST_STAGE, altarMaxLevel, bossHp, derive, essencesForStage, heroCost, memoryStartGold, stageGold, upgradeCost, wandererSkip, weaveLevel } from "./formulas";
import { maxAffixValue } from "./loot";
import {
  BESTIARY_BY_ID,
  EVEN_RATS,
  GOOD_BOY_RUNS,
  LAST_SECOND_TIMES,
  LESSONS,
  LISTEN_SECONDS,
  NIGHT_OWL_SECONDS,
  NOTCH_KILLS,
  SECRET_IDS,
  TONGUE_SECONDS,
  WANDERERS,
  WANDERER_BY_ID,
  WELCOME_BACK_MS,
  bestiaryKills,
  recognitionTier,
  type SecretId
} from "./data/lore";
import { NAMED_BY_ID, namedSourceReached } from "./data/relics";
import { AGE_COUNT, keystonesFound } from "./data/strata";
import type { AltarId, GameState } from "./types";

export interface Violation {
  code: string;
  message: string;
}

/** Relative tolerance for floating-point rounding. */
const EPSILON = 1e-6;
/** Highest stackable timed damage multiplier (rally × rage × overcharge × a walker's echo × Dawnbreak in a Seam × the Reunion). */
const MAX_TIMED_DPS = 2 * 2 * 7 * WALKER_DPS * 1.25 * REUNION_DPS;
/** Highest timed gold multiplier (golden rain × elixir) × golden rat × Pip's Wager. */
const MAX_TIMED_GOLD = 3 * 2 * 10 * WAGER_GOLD;
/** Human clicks + frenzy + scroll, with margin. */
const MAX_CLICKS_PER_SECOND = 40;
/** Minimum respawn 0.35 s → fewer than 3 kills per second. */
const MAX_KILLS_PER_SECOND = 3;
/** Kills the Altar of the Wanderer can grant in one go (its maximum skip for this walker, 10 per stage). */
function maxSkipKills(state: GameState): number {
  return (altarMaxLevel(state, "wanderer") * ALTAR_BY_ID.wanderer.valuePerLevel + 5) * MONSTERS_PER_STAGE;
}
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
  if (state.lifetime.kills > totalSeconds * MAX_KILLS_PER_SECOND + 10 + state.lifetime.ascensions * maxSkipKills(state)) fail("kills", "Too many kills for the play time.");
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
    else if (altar.maxLevel > 0 && (state.altars[id as AltarId] ?? 0) > altarMaxLevel(state, id as AltarId)) fail("altar", "Altar level above maximum.");
  }
  if (!le(altarSpend(state) + state.essences, state.lifetime.essencesEarned)) fail("essence-ledger", "More essences spent than collected.");
  // The Warp of Plenty multiplies every ascension's essences.
  const essenceCap = (1 + (state.altars.harvest ?? 0) * 0.1) * (1 + AFFIX_CAP.essence! * 4) * Math.pow(1 + WEAVE_BY_ID.plenty.valuePerLevel, weaveLevel(state, "plenty"));
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

  // Items. Named relics always find room, even in a full pack.
  const items = [...Object.values(state.equipment), ...state.inventory].filter((item) => item !== undefined);
  if (state.inventory.length > INVENTORY_LIMIT + state.inventory.filter((item) => item.named).length) fail("inventory", "Inventory too large.");
  const uids = new Set<string>();
  for (const item of items) {
    if (uids.has(item.uid)) fail("item", "Duplicate item.");
    uids.add(item.uid);
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
    const maxDps = (derived.dps * MAX_TIMED_DPS + burstClick) * derived.bossDamage * (isKingStage(lastBoss) ? derived.kingDamage : 1) * derived.baronDamage;
    // ×10 margin: items salvaged since, rounding, chained overcharge crystals…
    // A boss of the present night may have kept its wounds from earlier fights.
    const wounds = lastBoss <= WOUND_LAST_STAGE && !isKingStage(lastBoss) ? 1 - WOUND_CAP : 1;
    if (maxDps * derived.bossTimer * 10 < bossHp(lastBoss) * wounds) fail("power", `Stage ${lastBoss} boss cannot be beaten with this power.`);
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
  // Boons (the Reunion included) last an hour at most from the last tick.
  if (state.buffs.some((buff) => buff.until > state.lastTickAt + (BUFF_MAX_SECONDS + CLOCK_SLACK_SECONDS) * 1000)) fail("buff", "A boon lasts too long.");
  if (trail.wound && (trail.wound.share > WOUND_CAP + EPSILON || trail.wound.stage > WOUND_LAST_STAGE || trail.wound.stage !== state.maxStage || !isBossStage(trail.wound.stage) || lifetime.bossFails === 0)) fail("trail", "Impossible wounds.");

  const lore = state.lore;
  // One guardian per biome and stratum: a biome's echoes never outnumber its first clears.
  const strata = keystonesFound(state.maxStageEver) + 1;
  for (const [biome, count] of Object.entries(lore.echoes)) {
    if (!BIOMES.some((entry) => entry.id === biome)) fail("lore", `Unknown biome echoes: ${biome}.`);
    else if (count > strata || count > lifetime.bosses) fail("lore", "More echoes than guardians.");
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

  for (const [heroId, runs] of Object.entries(state.recognition)) {
    if (!HERO_BY_ID[heroId]) fail("recognition", `Unknown companion: ${heroId}.`);
    else if (runs > lifetime.ascensions) fail("recognition", "More remembered runs than ascensions.");
  }

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

/** The Descent: threads woven only from essences gathered, spent only on weaves that exist. */
function verifyDescent(state: GameState, fail: (code: string, message: string) => void) {
  const lifetime = state.lifetime;
  if (state.descents > 0 && (state.maxStageEver < DESCENT_MIN_STAGE || recognitionTier(state, DESCENT_HERO) < 5)) fail("descent", "Descent without the Loom.");
  if (state.descentMark > lifetime.essencesEarned + 1) fail("descent", "Descent begun past the essences gathered.");
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
  // Each Descent wove at most what every essence ever gathered could weave.
  if (lifetime.threads > state.descents * threadsFor(lifetime.essencesEarned)) fail("descent", "More threads than essences allow.");
  if (!/^(\d{4}-W\d{2})?$/.test(state.caravanWeek)) fail("descent", "Unknown Caravan week.");
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

  const monotonic = ["clicks", "kills", "bosses", "goldEarned", "essencesEarned", "shardsEarned", "ascensions", "playTime", "offlineSeconds", "crystals", "itemsFound", "kings", "seams", "threads"] as const;
  for (const key of monotonic) {
    if (b[key] + EPSILON < a[key]) fail("rollback", `Statistic "${key}" went down.`);
  }
  if (next.maxStageEver < previous.maxStageEver) fail("rollback", "Stage record went down.");
  const recorded = (state: GameState) => Object.values(state.bestiary).reduce((total, count) => total + count, 0);
  if (recorded(next) < recorded(previous)) fail("rollback", "Bestiary went down.");
  for (const [heroId, runs] of Object.entries(previous.recognition)) {
    if ((Object.hasOwn(next.recognition, heroId) ? next.recognition[heroId] : 0) < runs) fail("rollback", "Recognition went down.");
  }
  if (previous.named.some((id) => !next.named.includes(id))) fail("rollback", "A named relic was forgotten.");
  if (next.descents < previous.descents) fail("rollback", "Descents went down.");
  if (previous.secrets.some((id) => !next.secrets.includes(id))) fail("rollback", "A secret was forgotten.");
  const lore = (state: GameState) => state.lore.songs + state.lore.dreams + Object.values(state.lore.ages).reduce((total, count) => total + count, 0) + Object.values(state.lore.echoes).reduce((total, count) => total + count, 0);
  if (lore(next) < lore(previous)) fail("rollback", "The Chronicle went down.");

  const played = b.playTime - a.playTime;
  const offline = b.offlineSeconds - a.offlineSeconds;
  if (played + offline > elapsed) fail("time", "More play time than elapsed time.");

  const activeSeconds = Math.max(0, played) + 1;
  if (b.clicks - a.clicks > activeSeconds * MAX_CLICKS_PER_SECOND) fail("clicks", "Impossible click rate.");
  const kills = b.kills - a.kills;
  const skipKills = Math.max(0, b.ascensions - a.ascensions) * maxSkipKills(next);
  if (kills > (activeSeconds + Math.max(0, offline)) * MAX_KILLS_PER_SECOND + 10 + skipKills) fail("kills", "Too many kills for the elapsed time.");
  if (next.maxStageEver - previous.maxStageEver > kills + 1) fail("stage", "Stages cleared without fighting.");
  if (b.ascensions - a.ascensions > elapsed / 30 + 1) fail("ascension", "Too many ascensions.");
  if (next.descents - previous.descents > elapsed / 30 + 1) fail("descent", "Too many Descents.");

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
    descents: state.descents,
    playTime: Math.floor(state.lifetime.playTime)
  };
}

