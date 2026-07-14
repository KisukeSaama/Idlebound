import {
  BASE_PLAYER_STATS,
  DAMAGE_VARIANCE,
  EXPERIENCE_BASE,
  EXPERIENCE_GROWTH,
  RARITY_MULTIPLIER
} from "../constants/balance";
import { ESSENCE_UPGRADES } from "../data/essences";
import type { EquipmentState, EssenceUpgradeState, Player, Stats } from "../types/game";

export function experienceToNextLevel(level: number): number {
  return Math.floor(EXPERIENCE_BASE * Math.pow(EXPERIENCE_GROWTH, Math.max(0, level - 1)));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function randomBetween(min: number, max: number, random = Math.random): number {
  return Math.floor(min + random() * (max - min + 1));
}

export function calculateDamage(
  attack: number,
  defense: number,
  random = Math.random
): number {
  const base = Math.max(1, attack - defense);
  const variance = 1 - DAMAGE_VARIANCE + random() * DAMAGE_VARIANCE * 2;
  return Math.max(1, Math.round(base * variance));
}

export function getEssenceBonus(upgrades: EssenceUpgradeState, stat: string): number {
  return ESSENCE_UPGRADES.reduce((total, upgrade) => {
    if (upgrade.stat !== stat) return total;
    return total + (upgrades[upgrade.id] ?? 0) * upgrade.valuePerRank;
  }, 0);
}

export function calculateStats(
  player: Player,
  equipment: EquipmentState,
  upgrades: EssenceUpgradeState
): Stats {
  const items = Object.values(equipment).filter(Boolean);
  const itemStats = items.reduce(
    (total, item) => ({
      maxHp: total.maxHp + item.hpBonus + item.upgradeLevel * item.upgradeValue * 3,
      attack: total.attack + item.attackBonus + item.upgradeLevel * item.upgradeValue,
      defense: total.defense + item.defenseBonus + Math.floor(item.upgradeLevel * item.upgradeValue * 0.75),
      attackSpeed: total.attackSpeed
    }),
    { maxHp: 0, attack: 0, defense: 0, attackSpeed: 0 }
  );

  return {
    maxHp: player.baseStats.maxHp + itemStats.maxHp + getEssenceBonus(upgrades, "maxHp"),
    attack: player.baseStats.attack + itemStats.attack + getEssenceBonus(upgrades, "attack"),
    defense: player.baseStats.defense + itemStats.defense + getEssenceBonus(upgrades, "defense"),
    attackSpeed: Math.max(0.8, BASE_PLAYER_STATS.attackSpeed + itemStats.attackSpeed)
  };
}

export function calculatePower(stats: Stats, level: number): number {
  return Math.floor(stats.attack * 4.2 + stats.defense * 3.2 + stats.maxHp * 0.45 + level * 10);
}

export function essenceUpgradeCost(upgradeId: string, currentRank: number): number {
  const upgrade = ESSENCE_UPGRADES.find((entry) => entry.id === upgradeId);
  if (!upgrade) return Number.POSITIVE_INFINITY;
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentRank));
}

export function rarityScore(rarity: keyof typeof RARITY_MULTIPLIER): number {
  return RARITY_MULTIPLIER[rarity];
}
