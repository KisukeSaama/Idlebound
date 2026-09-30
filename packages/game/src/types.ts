import type { EventId } from "./data/events";
import type { WeaveId } from "./data/descent";
import type { MilestoneId } from "./data/strata";
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
  | { kind: "treasure"; pct: number }
  | { kind: "idleDps"; pct: number };

/** Visual family of a companion's hit: sword arc, claw marks, arrow, heavy blow or spell. */
export type StrikeStyle = "blade" | "claw" | "arrow" | "blunt" | "magic";

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
  /** How the companion's hits look in the scene (visual only). */
  strike: StrikeStyle;
  upgrades: HeroUpgradeDef[];
}

export type SkillId = "frenzy" | "rally" | "hawkeye" | "goldrain" | "ritual" | "echo" | "unweave";

export interface SkillDef {
  id: SkillId;
  hotkey: string;
  duration: number;
  cooldown: number;
  /** A companion at a level, or a Weave of Eldra's Loom. */
  unlock: { heroId: string; level: number } | { weave: WeaveId };
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
  /** Price of level n, in essences: `costBase × costGrowth^n`. */
  costBase: number;
  costGrowth: number;
  /** "add": the effect is `value × level`; "mult": `(1 + value)^level - 1`. */
  stacking: "add" | "mult";
  valuePerLevel: number;
  format: "pct" | "seconds" | "stages" | "flat";
  /** The night (1: the first) from which the stone answers the walker; one already raised stays open. */
  night: number;
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
  /** Id of a named relic (`data/relics.ts`): its name, legend and unique effect. */
  named?: string;
}

/** A creature of the road. Its look is the art recipe of the same id (`data/art/`). */
export interface MonsterDef {
  id: string;
}

export interface BiomeDef {
  id: string;
  index: number;
  accent: string;
  monsters: MonsterDef[];
  miniBoss: MonsterDef;
  boss: MonsterDef;
}

export type BuffId = "rage" | "fortune" | "autoclick" | "overcharge" | "sharpness" | "walker" | "cheese" | "lantern" | "reunion";

export interface Buff {
  id: BuffId;
  until: number;
}

export interface MonsterState {
  id: string;
  /** Legacy display name, only in saves written before names were localized. */
  name?: string;
  hp: number;
  maxHp: number;
  /** "rare": a biome's rare wanderer, met at most once a run. */
  kind: MonsterKind;
  gold: number;
  /** An event creature: the Seam Warden, the Quiet, the Stray Armor, a half-drawn Remnant. */
  event?: "seam" | "quiet" | "stray" | "unfinished";
  /** Pip's Wager: clicks landed, and when Pip gives up. */
  wager?: { clicks: number; until: number };
  /** The King, shadowed by his Eclipse. */
  eclipse?: boolean;
}

export type MonsterKind = "normal" | "treasure" | "rare" | "miniboss" | "boss";

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
  /** Essences every ascension ever granted (the history keeps only the last ones). */
  ascensionEssences: number;
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
  /** Kings beaten (every 50th stage), Seams closed, threads woven. */
  kings: number;
  seams: number;
  threads: number;
}

export interface AscensionRecord {
  at: number;
  maxStage: number;
  essences: number;
  /** A Descent rather than an ascension: the threads it wove. */
  threads?: number;
}

export interface Crystal {
  id: string;
  expiresAt: number;
  x: number;
  y: number;
  /** During a Crystal Storm: crystals still to come after this one. */
  storm?: number;
}

export type BuyMode = 1 | 10 | 25 | 100 | "max";

export interface Settings {
  notation: Notation;
  sound: boolean;
  /** Volume of the sound effects, 0 to 1. */
  volume: number;
  damageNumbers: boolean;
  reducedMotion: boolean;
  confirmAscension: boolean;
  buyMode: BuyMode;
  /** While away, companions spend the gold they earn on levels and talents. */
  offlineSpending: boolean;
  /** Keep the night of the Kingdom: deeper Ages keep the first Age's sky and scenes. */
  darkNight: boolean;
  /** Colors that eyes blind to red and green still tell apart (rarities, gains and losses). */
  colorblind: boolean;
}

export interface TutorialState {
  done: string[];
}

export interface SkillState {
  activeUntil: number;
  readyAt: number;
}

/** What the Chronicle remembers beyond the Bestiary: counters, never text (BIBLE 17.2). */
export interface LoreState {
  /** Biome echoes brought back, per biome id (the n first authored lines of that biome, then the grammar). */
  echoes: Record<string, number>;
  /** Age echoes brought back, per Age index. */
  ages: Record<string, number>;
  /** Nights the King saw the walker in his Regalia (his Regalia words, in turn). */
  regalia: number;
  /** Crystal songs, dreams and Stallkeeper sayings heard. */
  songs: number;
  dreams: number;
  sayings: number;
  /** Aldric's talents ever bought: each one a Lesson. */
  lessons: string[];
  /** Play time between midnight and four in the morning, local time (the Night Owl secret). */
  nightSeconds: number;
  /** Guardians beaten in the last half second (the Last Second secret). */
  lastSeconds: number;
  /** Runs with Vorn at level 150 (the Good Boy secret). */
  biscuit: number;
  /** Play time in each language (the Two Tongues secret). */
  tongues: { fr: number; en: number };
  /** Second readings of the strata keystones: strata cleared in each Descent (index = Descent - 1). */
  readings: number[];
  /** Events met at least once, and altars whose legend was read (level 5 reached once). */
  events: string[];
  altars: string[];
  /** Chronicle entries already read, per source (the rest shows as new). */
  seen: Record<string, number>;
}

/** What the current run remembers for the story; reset by ascension. */
export interface RunTrail {
  /** Rare wanderers met this run (one each at most). */
  wanderers: string[];
  /** Kills on stages 1 to 10 this run (the Thousandth Notch secret). */
  fieldKills: number;
  /** The King's timer run out in a row at stage 50, untouched (Let Him Rest). */
  rest: number;
  /** Golden rats caught with Thorvald at level 50 or more (Even). */
  evenRats: number;
  /** Essences offered to the altars since dusk (Keep Some, That's How It Starts). */
  offered: number;
  /** Seconds in the Deepvaults, watched and untouched (Listening). */
  listen: number;
  /** A stage crossed by another biome's Remnants (the Migration). */
  migration?: { stage: number; biome: string };
  /** The next King is shadowed (the King's Eclipse). */
  eclipse?: boolean;
  /** Wounds a boss kept from failed fights: its stage and the share of its HP they took. */
  wound?: { stage: number; share: number };
  /** The word given at this dusk (BIBLE 12.11). */
  promise?: PromiseState;
}

/** A promise given for the night: to whom, and how far it has been kept. */
export interface PromiseState {
  /** The companion the walker gave their word to (`data/promises.ts` says what they ask). */
  hero: string;
  /** Kings beaten at the head of the run since the word was given. */
  kings: number;
  /** Broken, by the walker's own choice or by a seam that closed on the company. */
  broken?: boolean;
  /** The guardian the promise waits at fell, its moment of grace honored. */
  waited?: boolean;
  /** The company may grow again: the guardian the promise led it to has fallen. */
  released?: boolean;
  /** The stage the night must go past (how deep the last one went). */
  goal?: number;
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
  /** Stage this run started on: 1, or past the stages the Altar of the Wanderer skips. */
  runStartStage: number;
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

  /** Kills (or sightings) of each creature the Bestiary keeps a page for. */
  bestiary: Record<string, number>;
  lore: LoreState;
  /** Runs in which each companion reached level 100 (Recognition). */
  recognition: Record<string, number>;
  /** Promises kept to each companion (BIBLE 12.11). */
  promises: Record<string, number>;
  /**
   * Recognition tiers companions already held when promises came (save version 10): what
   * they remembered stays remembered, whatever those tiers ask since.
   */
  remembered: Record<string, number>;
  /** The companion the walker means to give their word to at the next dusk. */
  pledge?: string;
  /** The companion who had the walker's word last night: nobody asks two nights running. */
  lastPromise?: string;
  /** Named relics already found (each drops once per save). */
  named: string[];
  /** Secrets found (BIBLE 15). */
  secrets: string[];
  trail: RunTrail;

  /** The Descent (BIBLE 12.7): how many, the threads held, the Weaves of the Loom. */
  descents: number;
  threads: number;
  weaves: Partial<Record<WeaveId, number>>;
  /**
   * Threads woven before save version 11, when a Descent wove them from essences: they stay
   * woven, and the thread of depth only adds past them. Absent from a game begun since.
   */
  legacyThreads?: number;
  /**
   * The highest level of the Altar of the Harvest the essences of a save older than version 11
   * could have bought, when above today's cap: its ascensions of then are checked against it.
   * Absent from a game begun since.
   */
  legacyHarvest?: number;
  /** ISO week of the last Caravan purchase (one ware a week). */
  caravanWeek: string;
  /** The engine's random generator, carried by the save: a reload draws the same fates again. */
  rngState: number;
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
  /** Gold multiplier of biome guardians (Mosshide). */
  guardianGold: number;
  treasureChance: number;
  dpsMultiplier: number;
  essenceMultiplier: number;
  /** The Patience bonus (Altar of Patience + idle talents), a share of companion DPS. */
  idleBonus: number;
  /** Companion damage per second that bonus adds, included in `dps`: the walker's strikes take its place. */
  patienceDps: number;
  /** Share of companion DPS added to each click. */
  clickDpsShare: number;
  autoClicksPerSecond: number;
  /** Damage to the King (Oathcutter, the Regalia), and to the Baron of Rot (Mirelle's ring). */
  kingDamage: number;
  baronDamage: number;
  /** Seconds a wandering crystal stays, and the share of its usual wait. */
  crystalStay: number;
  crystalWait: number;
  /** Fragment chance multiplier (the Frayed Edge, Oriane's Ear, Remembrance Nights). */
  fragmentChance: number;
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
  | { type: "hourglass"; kills: number }
  /** A Bestiary entry unlocked its `tier`-th line. */
  | { type: "bestiary"; id: string; tier: number }
  /** A companion remembers the walker a little more. */
  | { type: "recognition"; heroId: string; tier: number }
  /** A promise through the night: given, its conditions met, kept at dusk, or broken. */
  | { type: "promise"; heroId: string; outcome: "given" | "ready" | "kept" | "broken" }
  /** The walker tried what their word forbids: the engine held them to it. */
  | { type: "promiseHeld"; heroId: string }
  | { type: "secret"; id: string }
  /** A new Chronicle entry. */
  | { type: "fragment"; entry: ChronicleEntry }
  /** A Crystal Storm begins: the Lantern Queen crosses the sky. */
  | { type: "storm" }
  /** An event of the Long Night begins (BIBLE 13); `won` when a timed one ends. */
  | { type: "event"; id: EventId; won?: boolean }
  /** The King's Word of a night, spoken at dusk. */
  | { type: "kingWord"; night: number }
  /** A long absence left one line. */
  | { type: "dream"; index: number }
  /** The walker is back: the Reunion lasts `seconds`. */
  | { type: "reunion"; seconds: number; account?: AbsenceAccount }
  | { type: "descended"; threads: number };

/** One entry of the Chronicle; its words come from `content/` (`chronicleText`). */
export type ChronicleEntry =
  /** A stratum's keystone; after a Descent, its reading in that Descent's voice. */
  | { source: "keystone"; era: number; reading?: number }
  | { source: "milestone"; id: MilestoneId }
  /** The King's Word of the n-th night (1-based). */
  /** A night's Word; with `eclipse`, what he said when the Eclipse armed at that dusk fell. */
  | { source: "king"; night: number; eclipse?: boolean }
  | { source: "echo"; biome: string; index: number }
  | { source: "age"; age: number; index: number }
  | { source: "wanderer"; id: string }
  | { source: "memory"; hero: string; tier: number }
  /** What a companion said the first time a promise to them was kept. */
  | { source: "promise"; hero: string }
  | { source: "lesson"; id: string }
  | { source: "song"; index: number }
  | { source: "dream"; index: number }
  | { source: "saying"; index: number }
  | { source: "relic"; id: string }
  | { source: "altar"; id: AltarId }
  | { source: "secret"; id: string }
  | { source: "event"; id: EventId }
  | { source: "crown" };

/** What a wandering crystal gave: gold, a timed buff (amount = seconds), shards or essences. */
export type CrystalReward = "gold" | "overcharge" | "sharpness" | "shards" | "essence";

/** What the company tells the walker at the Reunion: the road it held alone. */
export interface AbsenceAccount {
  /** Seconds away. */
  seconds: number;
  /** Furthest stage when the walker left, and now. */
  fromStage: number;
  toStage: number;
  gold: number;
  spent: number;
  /** Companions who joined, in order. */
  hired: string[];
  /** Companions who gained levels. */
  levels: { heroId: string; from: number; to: number }[];
  /** Talents learned, in order. */
  talents: string[];
  /** Boss stages that stopped the company, then gave way. */
  walls: number[];
  /** The boss stage that still bars the road, if any. */
  blockedAt: number | null;
}

export interface OfflineSummary {
  seconds: number;
  kills: number;
  gold: number;
  /** New stages reached while away. */
  stages: number;
  shards: number;
  /** Boss stage the companions could not beat in time, if they stopped on one. */
  blockedAt: number | null;
  /** Companion levels and talents bought with offline spending, and their cost. */
  levels: number;
  upgrades: number;
  spent: number;
}
