import { z } from "zod";
import { SAVE_VERSION } from "../../../../shared/constants/balance";
import type { GameState } from "../../../../shared/types/game";

const STORAGE_KEY = "idlebound.save.v1";
const BACKUP_KEY = "idlebound.save.backup.v1";

const statsSchema = z.object({
  maxHp: z.number().positive(),
  attack: z.number().nonnegative(),
  defense: z.number().nonnegative(),
  attackSpeed: z.number().positive()
});

const itemSchema = z.object({
  instanceId: z.string().optional(),
  id: z.string(),
  name: z.string(),
  slot: z.enum(["weapon", "armor", "accessory"]),
  rarity: z.enum(["common", "uncommon", "rare", "epic"]),
  level: z.number().int().positive(),
  attackBonus: z.number(),
  defenseBonus: z.number(),
  hpBonus: z.number(),
  price: z.number().nonnegative(),
  upgradeLevel: z.number().int().nonnegative(),
  upgradeValue: z.number().nonnegative(),
  source: z.enum(["shop", "drop", "starter"])
});

const saveSchema = z.object({
  version: z.literal(SAVE_VERSION),
  savedAt: z.string(),
  state: z.object({
    player: z.object({
      name: z.string(),
      level: z.number().int().positive(),
      experience: z.number().int().nonnegative(),
      experienceToNext: z.number().int().positive(),
      currentHp: z.number().nonnegative(),
      baseStats: statsSchema,
      gold: z.number().int().nonnegative(),
      essences: z.number().int().nonnegative()
    }),
    inventory: z.array(itemSchema).max(80),
    equipment: z.object({
      weapon: itemSchema.optional(),
      armor: itemSchema.optional(),
      accessory: itemSchema.optional()
    }),
    essenceUpgrades: z.record(z.string(), z.number().int().nonnegative()),
    zoneProgress: z.object({
      unlockedZoneIds: z.array(z.string()).min(1),
      selectedZoneId: z.string(),
      killsByZone: z.record(z.string(), z.number().int().nonnegative()),
      bossDefeated: z.record(z.string(), z.boolean()),
      bossReady: z.record(z.string(), z.boolean()),
      fightingBoss: z.boolean()
    }),
    shop: z.object({
      offeredItemIds: z.array(z.string()),
      lastRefreshAt: z.string()
    }),
    combat: z.any(),
    settings: z.object({
      autoContinue: z.boolean(),
      reducedMotion: z.boolean()
    }),
    lastSavedAt: z.string().optional(),
    lastActiveAt: z.string(),
    notifications: z.array(z.string()),
    offlineSummary: z.any().optional()
  })
});

export type SavePayload = z.infer<typeof saveSchema>;

export function makeSavePayload(state: GameState): SavePayload {
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state: {
      ...state,
      combat: {
        ...state.combat,
        status: "idle",
        enemy: undefined,
        playerAttackTimer: 0,
        enemyAttackTimer: 0,
        floatingTexts: []
      },
      lastActiveAt: new Date().toISOString()
    }
  };
}

export function saveGameState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(makeSavePayload(state)));
}

export function loadGameState(): GameState | undefined {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return undefined;
  try {
    const parsed = saveSchema.parse(JSON.parse(raw));
    return parsed.state as GameState;
  } catch {
    return undefined;
  }
}

export function exportSave(state: GameState): string {
  return JSON.stringify(makeSavePayload(state), null, 2);
}

export function importSave(raw: string): GameState {
  const parsed = saveSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error("Sauvegarde invalide ou incompatible.");
  }
  const current = localStorage.getItem(STORAGE_KEY);
  if (current) localStorage.setItem(BACKUP_KEY, current);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data));
  return parsed.data.state as GameState;
}

export function resetSave(): void {
  const current = localStorage.getItem(STORAGE_KEY);
  if (current) localStorage.setItem(BACKUP_KEY, current);
  localStorage.removeItem(STORAGE_KEY);
}
