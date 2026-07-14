import { OFFLINE_MAX_SECONDS } from "../constants/balance";
import { ENEMIES } from "../data/enemies";
import { ZONES } from "../data/zones";
import type { GameState, OfflineSummary } from "../types/game";
import { calculateStats } from "./formulas";
import { emptyRewards, generateRewards, mergeRewards } from "./rewards";

export function estimateOfflineProgress(state: GameState, now = new Date()): OfflineSummary | undefined {
  const lastActive = new Date(state.lastActiveAt);
  const secondsAway = Math.max(0, Math.floor((now.getTime() - lastActive.getTime()) / 1000));
  if (secondsAway < 60) return undefined;

  const cappedSeconds = Math.min(secondsAway, OFFLINE_MAX_SECONDS);
  const zone = ZONES.find((entry) => entry.id === state.zoneProgress.selectedZoneId) ?? ZONES[0];
  const enemies = zone.enemyIds
    .map((id) => ENEMIES.find((enemy) => enemy.id === id))
    .filter(Boolean);
  if (enemies.length === 0) return undefined;

  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const averageEnemy = enemies.reduce(
    (total, enemy) => ({
      maxHp: total.maxHp + enemy!.maxHp / enemies.length,
      attack: total.attack + enemy!.attack / enemies.length,
      defense: total.defense + enemy!.defense / enemies.length,
      experienceReward: total.experienceReward + enemy!.experienceReward / enemies.length,
      goldReward: total.goldReward + enemy!.goldReward / enemies.length
    }),
    { maxHp: 0, attack: 0, defense: 0, experienceReward: 0, goldReward: 0 }
  );

  const playerDamage = Math.max(1, stats.attack - averageEnemy.defense);
  const enemyDamage = Math.max(1, averageEnemy.attack - stats.defense);
  const timeToWin = Math.ceil(averageEnemy.maxHp / playerDamage) * stats.attackSpeed;
  const timeToLose = Math.ceil(stats.maxHp / enemyDamage) * 2.6;
  const successRate = Math.max(0.15, Math.min(1, timeToLose / Math.max(timeToWin, 1)));
  const estimatedVictories = Math.floor((cappedSeconds / Math.max(timeToWin, 6)) * successRate);

  let rewards = emptyRewards();
  for (let index = 0; index < estimatedVictories; index += 1) {
    const enemy = enemies[index % enemies.length]!;
    rewards = mergeRewards(rewards, generateRewards(enemy, state.essenceUpgrades));
  }

  return { secondsAway, cappedSeconds, estimatedVictories, rewards };
}
