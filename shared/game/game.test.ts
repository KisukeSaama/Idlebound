import { describe, expect, it, vi } from "vitest";
import { ENEMIES } from "../data/enemies";
import { ITEM_CATALOG } from "../data/items";
import { createInitialState } from "../../client/src/store/initialState";
import { gameReducer } from "../../client/src/store/gameReducer";
import { tickCombat } from "../../client/src/store/gameEngine";
import { calculateDamage, calculatePower, calculateStats, experienceToNextLevel } from "./formulas";
import { upgradeCost, upgradeItem } from "./equipment";
import { applyExperience } from "./progression";
import { generateRewards } from "./rewards";
import { getShopOffers } from "./shop";
import { estimateOfflineProgress } from "./offline";
import { importSave, exportSave } from "../../client/src/features/save/saveService";

describe("formules de combat", () => {
  it("calcule au moins un degat", () => {
    expect(calculateDamage(4, 99, () => 0.5)).toBe(1);
    expect(calculateDamage(20, 5, () => 0.5)).toBe(15);
  });

  it("calcule une puissance globale positive", () => {
    const state = createInitialState();
    const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
    expect(calculatePower(stats, state.player.level)).toBeGreaterThan(0);
  });
});

describe("progression", () => {
  it("fait monter de niveau et restaure les points de vie", () => {
    const state = createInitialState();
    const result = applyExperience(state.player, experienceToNextLevel(1));
    expect(result.levelsGained).toBe(1);
    expect(result.player.level).toBe(2);
    expect(result.player.currentHp).toBe(result.player.baseStats.maxHp);
  });
});

describe("recompenses et equipement", () => {
  it("genere les recompenses garanties avec un random controle", () => {
    const boss = ENEMIES.find((enemy) => enemy.id === "moss-alpha")!;
    const rewards = generateRewards(boss, {}, () => 0);
    expect(rewards.experience).toBe(boss.experienceReward);
    expect(rewards.gold).toBe(boss.goldReward);
    expect(rewards.essences).toBeGreaterThan(0);
    expect(rewards.items.length).toBeGreaterThan(0);
  });

  it("ameliore un objet et augmente son cout suivant", () => {
    const item = ITEM_CATALOG[0];
    const before = upgradeCost(item);
    const upgraded = upgradeItem(item);
    expect(upgraded.upgradeLevel).toBe(1);
    expect(upgradeCost(upgraded)).toBeGreaterThan(before);
  });
});

describe("boutique", () => {
  it("propose des objets achetables selon le niveau", () => {
    expect(getShopOffers(1, 0, () => 0.4).length).toBeGreaterThan(0);
  });

  it("achete un objet si le joueur a assez d'or", () => {
    const state = { ...createInitialState(), player: { ...createInitialState().player, gold: 1000 } };
    const itemId = state.shop.offeredItemIds[0];
    const next = gameReducer(state, { type: "buyShopItem", itemId });
    expect(next.inventory.length).toBe(1);
    expect(next.player.gold).toBeLessThan(state.player.gold);
  });
});

describe("sauvegarde", () => {
  it("exporte et importe une sauvegarde valide", () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key)
    });
    const state = createInitialState();
    const raw = exportSave(state);
    const imported = importSave(raw);
    expect(imported.player.level).toBe(1);
  });
});

describe("progression hors ligne", () => {
  it("estime des gains apres une absence", () => {
    const state = createInitialState(new Date("2026-01-01T00:00:00.000Z"));
    const summary = estimateOfflineProgress(state, new Date("2026-01-01T02:00:00.000Z"));
    expect(summary?.estimatedVictories).toBeGreaterThan(0);
    expect(summary?.rewards.gold).toBeGreaterThan(0);
  });
});

describe("boucle principale", () => {
  it("vainc un boss et debloque la zone suivante", () => {
    let state = createInitialState();
    state = {
      ...state,
      player: {
        ...state.player,
        baseStats: { maxHp: 9999, attack: 999, defense: 999, attackSpeed: 0.5 },
        currentHp: 9999
      },
      zoneProgress: {
        ...state.zoneProgress,
        killsByZone: { "green-plains": 8 },
        bossReady: { "green-plains": true },
        fightingBoss: true
      }
    };
    for (let index = 0; index < 20; index += 1) {
      state = tickCombat(state, 0.5);
    }
    expect(state.zoneProgress.bossDefeated["green-plains"]).toBe(true);
    expect(state.zoneProgress.unlockedZoneIds).toContain("dark-forest");
  });
});
