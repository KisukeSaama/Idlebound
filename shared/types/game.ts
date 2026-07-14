export type EquipmentSlot = "weapon" | "armor" | "accessory";
export type Rarity = "common" | "uncommon" | "rare" | "epic";

export type ItemSource = "shop" | "drop" | "starter";

export interface Stats {
  maxHp: number;
  attack: number;
  defense: number;
  attackSpeed: number;
}

export interface Player {
  name: string;
  level: number;
  experience: number;
  experienceToNext: number;
  currentHp: number;
  baseStats: Stats;
  gold: number;
  essences: number;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  maxHp: number;
  attack: number;
  defense: number;
  attackSpeed: number;
  experienceReward: number;
  goldReward: number;
  lootTable: LootEntry[];
  isBoss: boolean;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  recommendedLevel: number;
  enemiesToBoss: number;
  enemyIds: string[];
  bossId: string;
}

export interface EquipmentItem {
  instanceId?: string;
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: Rarity;
  level: number;
  attackBonus: number;
  defenseBonus: number;
  hpBonus: number;
  price: number;
  upgradeLevel: number;
  upgradeValue: number;
  source: ItemSource;
}

export interface LootEntry {
  kind: "gold" | "essence" | "item";
  chance: number;
  min?: number;
  max?: number;
  itemId?: string;
}

export interface EssenceUpgradeDefinition {
  id: string;
  name: string;
  description: string;
  stat: "attack" | "defense" | "maxHp" | "experienceGain" | "goldGain" | "dropRate";
  baseCost: number;
  costMultiplier: number;
  valuePerRank: number;
  maxRank: number;
}

export interface EssenceUpgradeState {
  [upgradeId: string]: number;
}

export interface ZoneProgress {
  unlockedZoneIds: string[];
  selectedZoneId: string;
  killsByZone: Record<string, number>;
  bossDefeated: Record<string, boolean>;
  bossReady: Record<string, boolean>;
  fightingBoss: boolean;
}

export interface EquipmentState {
  weapon?: EquipmentItem;
  armor?: EquipmentItem;
  accessory?: EquipmentItem;
}

export interface ShopState {
  offeredItemIds: string[];
  lastRefreshAt: string;
}

export interface SettingsState {
  autoContinue: boolean;
  reducedMotion: boolean;
}

export interface CombatantState {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  attackSpeed: number;
  isBoss: boolean;
}

export interface CombatState {
  enemy?: CombatantState;
  playerAttackTimer: number;
  enemyAttackTimer: number;
  status: "idle" | "fighting" | "victory" | "defeat" | "recovering";
  lastRewards?: RewardBundle;
  log: CombatLogEntry[];
  floatingTexts: FloatingText[];
}

export interface ClickerState {
  manualPowerLevel: number;
  autoDamageLevel: number;
  autoSpeedLevel: number;
  critLevel: number;
}

export interface CombatLogEntry {
  id: string;
  message: string;
  tone: "neutral" | "good" | "bad" | "loot";
  createdAt: number;
}

export interface FloatingText {
  id: string;
  target: "player" | "enemy";
  label: string;
  tone: "damage" | "heal" | "loot";
}

export interface RewardBundle {
  experience: number;
  gold: number;
  essences: number;
  items: EquipmentItem[];
}

export interface OfflineSummary {
  secondsAway: number;
  cappedSeconds: number;
  estimatedVictories: number;
  rewards: RewardBundle;
}

export interface GameState {
  player: Player;
  clicker: ClickerState;
  inventory: EquipmentItem[];
  equipment: EquipmentState;
  essenceUpgrades: EssenceUpgradeState;
  zoneProgress: ZoneProgress;
  shop: ShopState;
  combat: CombatState;
  settings: SettingsState;
  lastSavedAt?: string;
  lastActiveAt: string;
  notifications: string[];
  offlineSummary?: OfflineSummary;
}
