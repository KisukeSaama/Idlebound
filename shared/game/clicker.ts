import type { ClickerState, Stats } from "../types/game";

export type ClickerUpgrade = "manualPowerLevel" | "autoDamageLevel" | "autoSpeedLevel" | "critLevel";

export const DEFAULT_CLICKER: ClickerState = {
  manualPowerLevel: 1,
  autoDamageLevel: 0,
  autoSpeedLevel: 0,
  critLevel: 0
};

export function normalizeClicker(clicker?: Partial<ClickerState>): ClickerState {
  return { ...DEFAULT_CLICKER, ...clicker };
}

export function manualClickDamage(stats: Stats, clicker?: Partial<ClickerState>): number {
  const normalized = normalizeClicker(clicker);
  return Math.max(1, Math.floor(stats.attack * (0.8 + normalized.manualPowerLevel * 0.22)));
}

export function autoAttackDamage(stats: Stats, clicker?: Partial<ClickerState>): number {
  const normalized = normalizeClicker(clicker);
  if (normalized.autoDamageLevel <= 0) return 0;
  return Math.max(1, Math.floor(stats.attack * (0.22 + normalized.autoDamageLevel * 0.16)));
}

export function autoAttackInterval(clicker?: Partial<ClickerState>): number {
  const normalized = normalizeClicker(clicker);
  if (normalized.autoDamageLevel <= 0) return Number.POSITIVE_INFINITY;
  return Math.max(0.45, 2.2 - normalized.autoSpeedLevel * 0.16);
}

export function critChance(clicker?: Partial<ClickerState>): number {
  const normalized = normalizeClicker(clicker);
  return Math.min(0.35, normalized.critLevel * 0.025);
}

export function clickerUpgradeCost(upgrade: ClickerUpgrade, currentLevel: number): number {
  const base = {
    manualPowerLevel: 35,
    autoDamageLevel: 75,
    autoSpeedLevel: 120,
    critLevel: 160
  } satisfies Record<ClickerUpgrade, number>;

  const growth = {
    manualPowerLevel: 1.42,
    autoDamageLevel: 1.5,
    autoSpeedLevel: 1.58,
    critLevel: 1.7
  } satisfies Record<ClickerUpgrade, number>;

  return Math.floor(base[upgrade] * Math.pow(growth[upgrade], currentLevel));
}
