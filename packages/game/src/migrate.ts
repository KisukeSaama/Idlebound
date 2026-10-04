/**
 * Migration of older saves, without the schema: the client runs it on every cloud load, so it
 * stays free of zod and of the server's checks (see save.ts and validation.ts).
 */
import { ALTAR_BY_ID, legacyHarvestCost, legacyHarvestPrice } from "./data/altars";
import { WEAVE_LEVEL_MAX, weaveTotalCost } from "./data/descent";
import { LEGACY_RECOGNITION_TIERS, recognitionTierByRuns } from "./data/lore";
import { crystalEssenceReward } from "./formulas";
import { seedFrom } from "./rng";
import { ALTAR_REWORK_NOTICE, HARVEST_NOTICE, SAVE_VERSION, createInitialState } from "./state";

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
  // Version 9 keeps every ascension's essences in one ledger (the history holds only the
  // last hundred). An older save gets the most its data proves: its history, or what its
  // crystals cannot explain. The engine's generator is seeded once from the save itself.
  if (version < 9) {
    (merged.lifetime as Record<string, unknown>).ascensionEssences = legacyAscensionEssences(merged);
  }
  // Version 10 brought promises: the last two memories of a companion now ask for a word
  // kept. What a companion already remembered stays remembered, and asks nothing again.
  if (version < 10) merged.remembered = legacyRemembered(merged);
  // Version 11 weaves the thread from depth, no longer from essences, and priced the Warp of
  // Plenty anew: the threads an older save wove stay woven, and its Warp is paid again at
  // today's price with what it cost then.
  if (version < 11) rethread(merged);
  // Version 11 also caps the Altar of the Harvest and raises its price: every level an older
  // save holds comes back as essences, at the price it was paid, and the walker is told once.
  if (version < 11) keepLegacyHarvest(merged);
  if (version < 11 && refundHarvest(merged)) {
    const tutorial = merged.tutorial as { done?: unknown };
    if (Array.isArray(tutorial.done) && !tutorial.done.includes(HARVEST_NOTICE)) merged.tutorial = { ...tutorial, done: [...tutorial.done, HARVEST_NOTICE] };
  }
  // Version 13 counts the Descents that wove a thread. An older save never counted them: each
  // of its Descents counts, as long as it has a thread woven for each (one wove one at least).
  if (version < 13) {
    const lifetime = merged.lifetime as Record<string, unknown>;
    const descents = typeof merged.descents === "number" && Number.isFinite(merged.descents) ? merged.descents : 0;
    const woven = typeof lifetime.threads === "number" && Number.isFinite(lifetime.threads) ? lifetime.threads : 0;
    lifetime.weavings = Math.max(0, Math.floor(Math.min(descents, woven)));
  }
  if (typeof input.rngState !== "number") merged.rngState = seedFrom(typeof merged.createdAt === "number" ? merged.createdAt : 0);
  merged.version = SAVE_VERSION;
  return merged;
}

/** Levels of the Harvest an older save may hold before the refund gives up (a forged level is left to the checks). */
const HARVEST_REFUND_MAX = 1_000;

/**
 * What the ascensions of an older save may have been multiplied by: the highest level of the
 * uncapped Harvest its essences could have bought, kept once so its ledgers still verify.
 */
function keepLegacyHarvest(merged: Record<string, unknown>) {
  const lifetime = merged.lifetime as Record<string, unknown>;
  const earned = typeof lifetime.essencesEarned === "number" && Number.isFinite(lifetime.essencesEarned) ? lifetime.essencesEarned : 0;
  if (!(typeof lifetime.ascensions === "number" && lifetime.ascensions > 0)) return;
  let level = 0;
  while (level < HARVEST_REFUND_MAX && legacyHarvestCost(level + 1) <= earned + 1) level += 1;
  if (level > ALTAR_BY_ID.harvest.maxLevel) merged.legacyHarvest = level;
}

/**
 * The Altar of the Harvest had no cap and a lower price before version 11. Its levels go back
 * to the owned essences at the rounded-up price each one cost, so the essence ledger still
 * holds, and the walker raises it again at today's price.
 */
function refundHarvest(merged: Record<string, unknown>): boolean {
  const altars = merged.altars;
  if (!altars || typeof altars !== "object" || typeof merged.essences !== "number") return false;
  const level = (altars as Record<string, unknown>).harvest;
  if (typeof level !== "number" || !Number.isInteger(level) || level <= 0 || level > HARVEST_REFUND_MAX) return false;
  let refund = 0;
  for (let n = 0; n < level; n += 1) refund += legacyHarvestPrice(n);
  const { harvest: _harvest, ...others } = altars as Record<string, unknown>;
  merged.altars = others;
  merged.essences = merged.essences + refund;
  return true;
}

/** Price growth of the Warp of Plenty up to save version 10 (`ceil(2 × 1.6^level)`). */
const LEGACY_PLENTY = { base: 2, growth: 1.6 };

/** Threads a save written before version 11 spent on its Warp of Plenty. */
export function legacyPlentySpend(level: number): number {
  let total = 0;
  for (let n = 0; n < level; n += 1) total += Math.ceil(LEGACY_PLENTY.base * Math.pow(LEGACY_PLENTY.growth, n));
  return total;
}

/**
 * The threads woven so far are kept as they are (`legacyThreads`). The Warp of Plenty keeps
 * its levels, paid again at today's price with what they cost then: the difference comes
 * back as threads, or is taken from the threads held, and a level the save cannot pay goes
 * back to threads too. The thread ledger holds either way.
 */
function rethread(merged: Record<string, unknown>) {
  delete merged.descentMark;
  const lifetime = merged.lifetime as Record<string, unknown>;
  const woven = typeof lifetime.threads === "number" && Number.isFinite(lifetime.threads) ? lifetime.threads : 0;
  if (woven > 0) merged.legacyThreads = woven;
  const weaves = merged.weaves && typeof merged.weaves === "object" ? (merged.weaves as Record<string, unknown>) : {};
  const plenty = Object.hasOwn(weaves, "plenty") && typeof weaves.plenty === "number" && Number.isInteger(weaves.plenty) ? weaves.plenty : 0;
  if (plenty <= 0 || plenty > WEAVE_LEVEL_MAX || typeof merged.threads !== "number") return;
  const purse = merged.threads + legacyPlentySpend(plenty);
  let level = plenty;
  while (level > 0 && weaveTotalCost("plenty", level) > purse) level -= 1;
  merged.weaves = { ...weaves, plenty: level };
  merged.threads = purse - weaveTotalCost("plenty", level);
}

/** The fourth and fifth tiers companions held under the rule of runs alone (before version 10). */
function legacyRemembered(merged: Record<string, unknown>): Record<string, number> {
  const recognition = merged.recognition && typeof merged.recognition === "object" ? (merged.recognition as Record<string, unknown>) : {};
  const weaves = merged.weaves && typeof merged.weaves === "object" ? (merged.weaves as Record<string, unknown>) : {};
  const kinship = Object.hasOwn(weaves, "kinship") && typeof weaves.kinship === "number" && Number.isFinite(weaves.kinship) ? weaves.kinship : 0;
  const thresholds = LEGACY_RECOGNITION_TIERS.map((threshold, index) => Math.max(index + 1, threshold - kinship));
  const remembered: Record<string, number> = {};
  for (const [hero, runs] of Object.entries(recognition)) {
    const tier = typeof runs === "number" ? recognitionTierByRuns(runs, thresholds) : 0;
    if (tier >= 4) remembered[hero] = tier;
  }
  return remembered;
}

/** Essences the ascensions of a save written before version 9 granted, at least. */
function legacyAscensionEssences(merged: Record<string, unknown>): number {
  const lifetime = merged.lifetime as Record<string, unknown>;
  const history = Array.isArray(merged.ascensions) ? merged.ascensions : [];
  const recorded = history.reduce((total: number, record: unknown) => {
    const essences = record && typeof record === "object" ? (record as { essences?: unknown }).essences : undefined;
    return total + (typeof essences === "number" && Number.isFinite(essences) ? essences : 0);
  }, 0);
  const earned = typeof lifetime.essencesEarned === "number" ? lifetime.essencesEarned : 0;
  const crystals = typeof lifetime.crystals === "number" ? lifetime.crystals : 0;
  const deepest = typeof merged.maxStageEver === "number" ? merged.maxStageEver : 1;
  // Every crystal paid at most what one pays at the deepest stage: the rest came from ascensions.
  const unexplained = earned - crystals * crystalEssenceReward(deepest);
  const value = Math.max(recorded, unexplained, 0);
  return Number.isFinite(value) ? value : 0;
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
