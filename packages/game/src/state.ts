import type { GameState, LifetimeStats, StatBlock } from "./types";

export const SAVE_VERSION = 2;

export function emptyStats(): StatBlock {
  return { clicks: 0, crits: 0, kills: 0, bosses: 0, treasures: 0, goldEarned: 0, crystals: 0, skillsUsed: 0, maxHit: 0, playTime: 0 };
}

export function emptyLifetime(): LifetimeStats {
  return {
    ...emptyStats(),
    ascensions: 0,
    essencesEarned: 0,
    shardsEarned: 0,
    itemsFound: 0,
    legendaries: 0,
    mythics: 0,
    bossFails: 0,
    offlineSeconds: 0,
    hourglasses: 0,
    bestLevelSum: 0,
    bestHired: 0
  };
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
      buyMode: 1
    },
    tutorial: { done: [] }
  };
}
