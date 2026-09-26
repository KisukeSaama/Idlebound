import type { Notation } from "./numbers";

export type HeroEffect =
  | { kind: "heroDps"; mult: number }
  | { kind: "globalDps"; pct: number }
  | { kind: "click"; mult: number }
  | { kind: "clickDps"; pct: number }
  | { kind: "critChance"; pct: number }
  | { kind: "critDamage"; add: number }
  | { kind: "gold"; pct: number }
  | { kind: "bossTimer"; seconds: number }
  | { kind: "treasure"; pct: number };

export interface HeroUpgradeDef {
  id: string;
  level: number;
  costMult: number;
  effect: HeroEffect;
}

export interface HeroDef {
  id: string;
  index: number;
  baseCost: number;
  /** Cost growth per level (1.07 by default). */
  costGrowth: number;
  /** DPS per level (0 for the click hero). */
  baseDps: number;
  /** Click damage per level (click hero only). */
  baseClick: number;
  color: string;
  glyph: string;
  upgrades: HeroUpgradeDef[];
}

export type SkillId = "frenzy" | "rally" | "hawkeye" | "goldrain" | "ritual" | "echo";

export interface SkillDef {
  id: SkillId;
  hotkey: string;
  duration: number;
  cooldown: number;
  unlock: { heroId: string; level: number };
  icon: string;
}

export type AltarId =
  | "might"
  | "blade"
  | "fortune"
  | "time"
  | "fate"
  | "precision"
  | "patience"
  | "treasure"
  | "bargain"
  | "echoes"
  | "harvest"
  | "wanderer"
  | "memory";

export interface AltarDef {
  id: AltarId;
  maxLevel: number;
  /** Cost of the next level, in essences. */
  costBase: number;
  costGrowth: number;
  /** "linear": cost = base × (level + 1). "exp": base × growth^level. */
  costCurve: "linear" | "exp";
  valuePerLevel: number;
  format: "pct" | "seconds" | "flat";
}

export type ItemSlot = "weapon" | "armor" | "amulet" | "ring";
export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";
export type AffixStat = "dps" | "click" | "gold" | "critChance" | "critDamage" | "bossDamage" | "essence";

export interface Affix {
  stat: AffixStat;
  value: number;
}

export interface Item {
  uid: string;
  slot: ItemSlot;
  rarity: Rarity;
  level: number;
  /** Index of the base noun in `content/` (see SLOT_BASE_COUNT). */
  base?: number;
  /** Legacy French name, only on items created before `base` existed. */
  name?: string;
  affixes: Affix[];
  forge: number;
  locked?: boolean;
}

export interface MonsterDef {
  id: string;
  image: string;
  /** CSS filter applied to the sprite to create variants. */
  filter?: string;
  scale?: number;
}

export interface BiomeDef {
  id: string;
  index: number;
  background: string;
  accent: string;
  monsters: MonsterDef[];
  miniBoss: MonsterDef;
  boss: MonsterDef;
}

export type BuffId = "rage" | "fortune" | "autoclick" | "overcharge" | "sharpness";

export interface Buff {
  id: BuffId;
  until: number;
}

export interface MonsterState {
  id: string;
  /** Legacy display name, only in saves written before names were localized. */
  name?: string;
  image: string;
  filter?: string;
  scale: number;
  hp: number;
  maxHp: number;
  kind: "normal" | "treasure" | "miniboss" | "boss";
  gold: number;
}

export interface StatBlock {
  clicks: number;
  crits: number;
  kills: number;
  bosses: number;
  treasures: number;
  goldEarned: number;
  crystals: number;
  skillsUsed: number;
  maxHit: number;
  playTime: number;
}

export interface LifetimeStats extends StatBlock {
  ascensions: number;
  essencesEarned: number;
  shardsEarned: number;
  itemsFound: number;
  legendaries: number;
  mythics: number;
  bossFails: number;
  offlineSeconds: number;
  hourglasses: number;
  /** All-time records (hero levels are reset by ascension). */
  bestLevelSum: number;
  bestHired: number;
}

export interface AscensionRecord {
  at: number;
  maxStage: number;
  essences: number;
}

export interface Crystal {
  id: string;
  expiresAt: number;
  x: number;
  y: number;
}

export type BuyMode = 1 | 10 | 25 | 100 | "max";

export interface Settings {
  notation: Notation;
  sound: boolean;
  volume: number;
  damageNumbers: boolean;
  reducedMotion: boolean;
  confirmAscension: boolean;
  buyMode: BuyMode;
}

export interface TutorialState {
  done: string[];
}

export interface SkillState {
  activeUntil: number;
  readyAt: number;
}

export interface GameState {
  version: number;
  createdAt: number;
  lastTickAt: number;
  lastClickAt: number;

  gold: number;
  essences: number;
  shards: number;

  stage: number;
  maxStage: number;
  maxStageEver: number;
  kills: number;
  autoAdvance: boolean;
  monster: MonsterState | null;
  respawnIn: number;
  bossTimeLeft: number;

  heroLevels: Record<string, number>;
  heroUpgrades: string[];
  skills: Partial<Record<SkillId, SkillState>>;
  lastSkill?: SkillId;
  ritualStacks: number;
  buffs: Buff[];

  altars: Partial<Record<AltarId, number>>;
  achievements: string[];

  equipment: Partial<Record<ItemSlot, Item>>;
  inventory: Item[];

  crystal: Crystal | null;
  nextCrystalAt: number;

  run: StatBlock;
  lifetime: LifetimeStats;
  ascensions: AscensionRecord[];

  settings: Settings;
  tutorial: TutorialState;
}

export interface Derived {
  dps: number;
  heroDps: Record<string, number>;
  click: number;
  critChance: number;
  critMultiplier: number;
  goldMultiplier: number;
  bossTimer: number;
  bossDamage: number;
  treasureChance: number;
  dpsMultiplier: number;
  essenceMultiplier: number;
  idle: boolean;
  autoClicksPerSecond: number;
}

export type GameEvent =
  | { type: "hit"; damage: number; crit: boolean; source: "click" | "auto" }
  | { type: "dps"; damage: number }
  | { type: "kill"; monster: MonsterState; gold: number; shards: number }
  | { type: "spawn"; monster: MonsterState }
  | { type: "stage"; stage: number; biomeChanged: boolean }
  | { type: "bossFailed"; stage: number }
  | { type: "loot"; item: Item }
  | { type: "heroBought"; heroId: string; levels: number; firstTime: boolean }
  | { type: "upgradeBought"; upgradeId: string }
  | { type: "skill"; skillId: SkillId }
  | { type: "skillUnlocked"; skillId: SkillId }
  | { type: "achievement"; id: string }
  | { type: "crystal"; reward: CrystalReward; amount: number }
  | { type: "crystalSpawned" }
  | { type: "ascended"; essences: number }
  | { type: "inventoryFull"; item: Item; shards: number }
  | { type: "hourglass"; kills: number };

/** What a wandering crystal gave: gold, a timed buff (amount = seconds), shards or essences. */
export type CrystalReward = "gold" | "overcharge" | "sharpness" | "shards" | "essence";

export interface OfflineSummary {
  seconds: number;
  kills: number;
  gold: number;
  efficiency: number;
}
