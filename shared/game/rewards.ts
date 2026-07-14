import { ITEM_CATALOG } from "../data/items";
import type { Enemy, EquipmentItem, EssenceUpgradeState, RewardBundle } from "../types/game";
import { createItemInstance } from "./equipment";
import { getEssenceBonus, randomBetween } from "./formulas";

export function emptyRewards(): RewardBundle {
  return { experience: 0, gold: 0, essences: 0, items: [] };
}

export function mergeRewards(a: RewardBundle, b: RewardBundle): RewardBundle {
  return {
    experience: a.experience + b.experience,
    gold: a.gold + b.gold,
    essences: a.essences + b.essences,
    items: [...a.items, ...b.items]
  };
}

export function generateRewards(
  enemy: Enemy,
  upgrades: EssenceUpgradeState,
  random = Math.random
): RewardBundle {
  const experienceMultiplier = 1 + getEssenceBonus(upgrades, "experienceGain");
  const goldMultiplier = 1 + getEssenceBonus(upgrades, "goldGain");
  const dropBonus = getEssenceBonus(upgrades, "dropRate");
  const items: EquipmentItem[] = [];
  let essences = 0;

  for (const loot of enemy.lootTable) {
    const chance = Math.min(0.95, loot.chance + dropBonus);
    if (random() > chance) continue;

    if (loot.kind === "essence") {
      essences += randomBetween(loot.min ?? 1, loot.max ?? 1, random);
    }

    if (loot.kind === "item" && loot.itemId) {
      const template = ITEM_CATALOG.find((item) => item.id === loot.itemId);
      if (template) items.push(createItemInstance(template, "drop"));
    }
  }

  return {
    experience: Math.floor(enemy.experienceReward * experienceMultiplier),
    gold: Math.floor(enemy.goldReward * goldMultiplier),
    essences,
    items
  };
}
