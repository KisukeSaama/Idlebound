import { INVENTORY_LIMIT } from "../../../shared/constants/balance";
import { ESSENCE_UPGRADES } from "../../../shared/data/essences";
import { ZONES } from "../../../shared/data/zones";
import { essenceUpgradeCost } from "../../../shared/game/formulas";
import { createItemInstance, sellValue, upgradeCost, upgradeItem } from "../../../shared/game/equipment";
import { findItemTemplate, getShopOffers } from "../../../shared/game/shop";
import type { GameState, OfflineSummary } from "../../../shared/types/game";
import { createInitialState } from "./initialState";
import { manualAttack, tickCombat } from "./gameEngine";
import { applyExperience } from "../../../shared/game/progression";
import { clickerUpgradeCost, normalizeClicker, type ClickerUpgrade } from "../../../shared/game/clicker";

export type GameAction =
  | { type: "tick"; deltaSeconds?: number }
  | { type: "manualAttack" }
  | { type: "buyClickerUpgrade"; upgrade: ClickerUpgrade }
  | { type: "selectZone"; zoneId: string }
  | { type: "fightBoss" }
  | { type: "equipItem"; instanceId: string }
  | { type: "sellItem"; instanceId: string }
  | { type: "upgradeEquipped"; slot: "weapon" | "armor" | "accessory" }
  | { type: "buyShopItem"; itemId: string }
  | { type: "refreshShop" }
  | { type: "buyEssenceUpgrade"; upgradeId: string }
  | { type: "applyOffline"; summary: OfflineSummary }
  | { type: "toggleSetting"; key: "autoContinue" | "reducedMotion" }
  | { type: "loadState"; state: GameState }
  | { type: "reset" }
  | { type: "markSaved" }
  | { type: "clearOfflineSummary" };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "tick": {
      if (state.combat.status === "recovering" && state.combat.playerAttackTimer < 0) {
        const timer = state.combat.playerAttackTimer + (action.deltaSeconds ?? 0.5);
        if (timer < 0) return { ...state, combat: { ...state.combat, playerAttackTimer: timer } };
        return {
          ...state,
          player: { ...state.player, currentHp: state.player.baseStats.maxHp },
          combat: { ...state.combat, status: "idle", playerAttackTimer: 0 }
        };
      }
      if (!state.settings.autoContinue && state.combat.status !== "fighting") return state;
      return tickCombat(state, action.deltaSeconds);
    }
    case "manualAttack":
      return manualAttack(state);
    case "buyClickerUpgrade": {
      const clicker = normalizeClicker(state.clicker);
      const currentLevel = clicker[action.upgrade];
      const cost = clickerUpgradeCost(action.upgrade, currentLevel);
      if (state.player.gold < cost) return state;
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - cost },
        clicker: { ...clicker, [action.upgrade]: currentLevel + 1 }
      };
    }
    case "selectZone": {
      if (!state.zoneProgress.unlockedZoneIds.includes(action.zoneId)) return state;
      return {
        ...state,
        zoneProgress: { ...state.zoneProgress, selectedZoneId: action.zoneId, fightingBoss: false },
        combat: { ...state.combat, enemy: undefined, status: "idle" }
      };
    }
    case "fightBoss": {
      const zone = ZONES.find((entry) => entry.id === state.zoneProgress.selectedZoneId);
      if (!zone || !state.zoneProgress.bossReady[zone.id]) return state;
      return {
        ...state,
        zoneProgress: { ...state.zoneProgress, fightingBoss: true },
        combat: { ...state.combat, enemy: undefined, status: "idle" }
      };
    }
    case "equipItem": {
      const item = state.inventory.find((entry) => entry.instanceId === action.instanceId);
      if (!item) return state;
      const previous = state.equipment[item.slot];
      return {
        ...state,
        inventory: [...state.inventory.filter((entry) => entry.instanceId !== action.instanceId), ...(previous ? [previous] : [])],
        equipment: { ...state.equipment, [item.slot]: item }
      };
    }
    case "sellItem": {
      const item = state.inventory.find((entry) => entry.instanceId === action.instanceId);
      if (!item) return state;
      return {
        ...state,
        inventory: state.inventory.filter((entry) => entry.instanceId !== action.instanceId),
        player: { ...state.player, gold: state.player.gold + sellValue(item) }
      };
    }
    case "upgradeEquipped": {
      const item = state.equipment[action.slot];
      if (!item) return state;
      const cost = upgradeCost(item);
      if (state.player.gold < cost) return state;
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - cost },
        equipment: { ...state.equipment, [action.slot]: upgradeItem(item) }
      };
    }
    case "buyShopItem": {
      const template = findItemTemplate(action.itemId);
      if (!template || state.player.gold < template.price || state.inventory.length >= INVENTORY_LIMIT) return state;
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold - template.price },
        inventory: [...state.inventory, createItemInstance(template, "shop")]
      };
    }
    case "refreshShop": {
      const zoneIndex = ZONES.findIndex((zone) => zone.id === state.zoneProgress.selectedZoneId);
      return {
        ...state,
        shop: {
          offeredItemIds: getShopOffers(state.player.level, Math.max(0, zoneIndex)),
          lastRefreshAt: new Date().toISOString()
        }
      };
    }
    case "buyEssenceUpgrade": {
      const definition = ESSENCE_UPGRADES.find((entry) => entry.id === action.upgradeId);
      const rank = state.essenceUpgrades[action.upgradeId] ?? 0;
      if (!definition || rank >= definition.maxRank) return state;
      const cost = essenceUpgradeCost(action.upgradeId, rank);
      if (state.player.essences < cost) return state;
      return {
        ...state,
        player: { ...state.player, essences: state.player.essences - cost },
        essenceUpgrades: { ...state.essenceUpgrades, [action.upgradeId]: rank + 1 }
      };
    }
    case "applyOffline": {
      const xpResult = applyExperience(state.player, action.summary.rewards.experience);
      return {
        ...state,
        player: {
          ...xpResult.player,
          gold: xpResult.player.gold + action.summary.rewards.gold,
          essences: xpResult.player.essences + action.summary.rewards.essences
        },
        inventory: [...state.inventory, ...action.summary.rewards.items].slice(0, INVENTORY_LIMIT),
        offlineSummary: action.summary,
        lastActiveAt: new Date().toISOString()
      };
    }
    case "toggleSetting":
      return { ...state, settings: { ...state.settings, [action.key]: !state.settings[action.key] } };
    case "loadState":
      return action.state;
    case "reset":
      return createInitialState();
    case "markSaved":
      return { ...state, lastSavedAt: new Date().toISOString(), lastActiveAt: new Date().toISOString() };
    case "clearOfflineSummary":
      return { ...state, offlineSummary: undefined };
    default:
      return state;
  }
}
