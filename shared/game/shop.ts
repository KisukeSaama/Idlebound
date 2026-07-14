import { SHOP_SIZE } from "../constants/balance";
import { ITEM_CATALOG } from "../data/items";
import type { EquipmentItem } from "../types/game";

export function getShopOffers(playerLevel: number, zoneIndex: number, random = Math.random): string[] {
  const maxLevel = playerLevel + 2 + zoneIndex;
  const eligible = ITEM_CATALOG.filter((item) => item.source !== "starter" && item.level <= maxLevel);
  const shuffled = [...eligible].sort(() => random() - 0.5);
  return shuffled.slice(0, SHOP_SIZE).map((item) => item.id);
}

export function findItemTemplate(itemId: string): EquipmentItem | undefined {
  return ITEM_CATALOG.find((item) => item.id === itemId);
}
