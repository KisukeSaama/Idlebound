import { BASE_PLAYER_STATS } from "../../../shared/constants/balance";
import { STARTER_ITEMS } from "../../../shared/data/items";
import { ZONES } from "../../../shared/data/zones";
import type { GameState } from "../../../shared/types/game";
import { experienceToNextLevel } from "../../../shared/game/formulas";
import { getShopOffers } from "../../../shared/game/shop";

export function createInitialState(now = new Date()): GameState {
  const starterWeapon = { ...STARTER_ITEMS[0], instanceId: "starter-weapon" };
  const starterArmor = { ...STARTER_ITEMS[1], instanceId: "starter-armor" };

  return {
    player: {
      name: "Aventurier",
      level: 1,
      experience: 0,
      experienceToNext: experienceToNextLevel(1),
      currentHp: BASE_PLAYER_STATS.maxHp,
      baseStats: BASE_PLAYER_STATS,
      gold: 25,
      essences: 0
    },
    clicker: {
      manualPowerLevel: 1,
      autoDamageLevel: 0,
      autoSpeedLevel: 0,
      critLevel: 0
    },
    inventory: [],
    equipment: {
      weapon: starterWeapon,
      armor: starterArmor
    },
    essenceUpgrades: {},
    zoneProgress: {
      unlockedZoneIds: [ZONES[0].id],
      selectedZoneId: ZONES[0].id,
      killsByZone: {},
      bossDefeated: {},
      bossReady: {},
      fightingBoss: false
    },
    shop: {
      offeredItemIds: getShopOffers(1, 0),
      lastRefreshAt: now.toISOString()
    },
    combat: {
      playerAttackTimer: 0,
      enemyAttackTimer: 0,
      status: "idle",
      log: [],
      floatingTexts: []
    },
    settings: {
      autoContinue: true,
      reducedMotion: false
    },
    lastActiveAt: now.toISOString(),
    notifications: []
  };
}
