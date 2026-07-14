import {
  ITEM_SELL_RATIO,
  UPGRADE_COST_BASE,
  UPGRADE_COST_GROWTH,
  UPGRADE_MAX_LEVEL
} from "../constants/balance";
import type { EquipmentItem } from "../types/game";

export function createItemInstance(item: EquipmentItem, source = item.source): EquipmentItem {
  return {
    ...item,
    source,
    instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  };
}

export function itemPower(item: EquipmentItem): number {
  return Math.floor(item.attackBonus * 4 + item.defenseBonus * 3 + item.hpBonus * 0.35 + item.upgradeLevel * item.upgradeValue * 5);
}

export function upgradeCost(item: EquipmentItem): number {
  if (item.upgradeLevel >= UPGRADE_MAX_LEVEL) return Number.POSITIVE_INFINITY;
  const levelFactor = Math.max(1, item.level);
  return Math.floor((UPGRADE_COST_BASE + item.price * 0.18) * levelFactor * Math.pow(UPGRADE_COST_GROWTH, item.upgradeLevel));
}

export function upgradeItem(item: EquipmentItem): EquipmentItem {
  if (item.upgradeLevel >= UPGRADE_MAX_LEVEL) return item;
  return {
    ...item,
    upgradeLevel: item.upgradeLevel + 1
  };
}

export function sellValue(item: EquipmentItem): number {
  return Math.max(1, Math.floor((item.price + item.upgradeLevel * UPGRADE_COST_BASE) * ITEM_SELL_RATIO));
}
