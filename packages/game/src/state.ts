import { seedFrom } from "./rng";
import type { GameState, LifetimeStats, LoreState, RunTrail, StatBlock } from "./types";

export const SAVE_VERSION = 13;
/** Tutorial id of the one-time notice shown to saves whose altars version 4 refunded. */
export const ALTAR_REWORK_NOTICE = "altars-v4";
/**
 * Tutorial id written by the migration to a save that had raised the Altar of the Harvest
 * before version 11 (its levels came back as essences); `HARVEST_NOTICE_TOLD` once the walker was told.
 */
export const HARVEST_NOTICE = "harvest-v11";
export const HARVEST_NOTICE_TOLD = "harvest-v11:ok";

export function emptyStats(): StatBlock {
  return { clicks: 0, crits: 0, kills: 0, bosses: 0, treasures: 0, goldEarned: 0, crystals: 0, skillsUsed: 0, maxHit: 0, playTime: 0 };
}

export function emptyLifetime(): LifetimeStats {
  return {
    ...emptyStats(),
    ascensions: 0,
    essencesEarned: 0,
    ascensionEssences: 0,
    shardsEarned: 0,
    itemsFound: 0,
    legendaries: 0,
    mythics: 0,
    bossFails: 0,
    offlineSeconds: 0,
    hourglasses: 0,
    bestLevelSum: 0,
    bestHired: 0,
    kings: 0,
    seams: 0,
    threads: 0,
    routs: 0,
    weavings: 0
  };
}

export function emptyTrail(): RunTrail {
  return { wanderers: [], fieldKills: 0, rest: 0, evenRats: 0, offered: 0, listen: 0 };
}

export function emptyLore(): LoreState {
  return { echoes: {}, ages: {}, regalia: 0, songs: 0, dreams: 0, sayings: 0, lessons: [], nightSeconds: 0, lastSeconds: 0, biscuit: 0, tongues: { fr: 0, en: 0 }, readings: [], events: [], altars: [], seen: {} };
}

export function createInitialState(now = Date.now()): GameState {
  return {
    version: SAVE_VERSION,
    createdAt: now,
    lastTickAt: now,
    lastClickAt: now,
    gold: 0,
    essences: 0,
    shards: 0,
    stage: 1,
    maxStage: 1,
    maxStageEver: 1,
    runStartStage: 1,
    kills: 0,
    autoAdvance: true,
    monster: null,
    respawnIn: 0,
    bossTimeLeft: 0,
    heroLevels: {},
    heroUpgrades: [],
    skills: {},
    ritualStacks: 0,
    buffs: [],
    altars: {},
    achievements: [],
    equipment: {},
    inventory: [],
    crystal: null,
    nextCrystalAt: now + 75_000,
    run: emptyStats(),
    lifetime: emptyLifetime(),
    ascensions: [],
    settings: {
      notation: "letters",
      sound: true,
      volume: 0.6,
      damageNumbers: true,
      reducedMotion: false,
      confirmAscension: true,
      buyMode: 1,
      offlineSpending: true,
      darkNight: false,
      colorblind: false
    },
    // A new game never needs the notice of the altar rework (save version 4).
    tutorial: { done: [ALTAR_REWORK_NOTICE] },
    bestiary: {},
    lore: emptyLore(),
    recognition: {},
    promises: {},
    remembered: {},
    named: [],
    secrets: [],
    trail: emptyTrail(),
    descents: 0,
    threads: 0,
    weaves: {},
    caravanWeek: "",
    rngState: seedFrom(now)
  };
}
