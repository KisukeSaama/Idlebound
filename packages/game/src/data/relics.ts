import type { GameState, Item, ItemSlot, Rarity } from "../types";
import { eraForStage } from "./biomes";
import { HERO_BY_ID } from "./heroes";
import { bestiaryKills, recognitionTier } from "./lore";
import { lookup } from "./lookup";
import { promiseOf } from "./promises";

/**
 * Named relics (BIBLE 11): relics with a name, a legend and one unique effect, found once
 * per save from a fixed source. Their rarity is fixed; they roll the normal affixes of
 * their slot at the level of the walker's best stage. Legends and names live in `content/`.
 */
export type NamedEffect =
  /** Critical chance, counted inside the relics' crit chance cap. */
  | { kind: "critChance"; pct: number }
  /** Gold from biome guardians. */
  | { kind: "guardianGold"; pct: number }
  /** Shards the forge asks for. */
  | { kind: "forgeDiscount"; pct: number }
  /** Damage dealt to the King (the guardian of every 50th stage). */
  | { kind: "kingDamage"; pct: number }
  /** The walker's strikes take this much less of the Patience bonus's place. */
  | { kind: "quietStrike"; pct: number }
  /** Shards on every guardian kill. */
  | { kind: "guardianShards"; pct: number }
  /** DPS while a Seam is open. */
  | { kind: "seamDps"; pct: number }
  /** Seconds on the boss timer. */
  | { kind: "bossTimer"; pct: number }
  /** The idle bonus, raised. */
  | { kind: "idleBonus"; pct: number }
  /** Damage to elites and guardians. */
  | { kind: "bossDamage"; pct: number }
  /** Golden Rain lasts this many seconds. */
  | { kind: "rainSeconds"; pct: number }
  /** Power cooldowns, lowered (with the Altar of Echoes, at most -60%). */
  | { kind: "cooldown"; pct: number }
  /** Seconds a wandering crystal stays. */
  | { kind: "crystalStay"; pct: number }
  /** Fragment chance from guardians. */
  | { kind: "fragments"; pct: number }
  /** Click damage per companion who fully remembers the walker (at most +100%). */
  | { kind: "clickPerRemembered"; pct: number }
  /** The idle bonus raised by half, click damage halved. */
  | { kind: "phylactery"; pct: number }
  /** Golden rat chance, inside its cap. */
  | { kind: "treasure"; pct: number }
  /** Wandering crystals come sooner. */
  | { kind: "crystalSooner"; pct: number }
  /** Gold, and damage to the Baron of Rot. */
  | { kind: "mirelle"; pct: number }
  /** Shard prices at the stall and the Caravan. */
  | { kind: "marketDiscount"; pct: number }
  /** Stages the Altar of the Wanderer clears, within its caps. */
  | { kind: "wandererStages"; pct: number }
  /** One of the Regalia of Orvane: the three together, and the King knows the walker. */
  | { kind: "regalia"; pct: number };

export type NamedSource =
  /** Given on the kill of `monster` that brings its lifetime kills to `kills`. */
  | { kind: "kills"; monster: string; kills: number }
  /** A chance on each first-clear kill of `monster` from era `era` on. */
  | { kind: "boss"; monster: string; era: number; chance: number }
  /** A chance on each first-clear kill of any biome guardian or King in stratum `era` exactly. */
  | { kind: "stratum"; era: number; chance: number }
  /** A chance on each first-clear kill of the King in Age `age` or deeper (index from 0). */
  | { kind: "king"; age: number; chance: number }
  /** A companion's gift at the last tier of Recognition. */
  | { kind: "gift"; hero: string }
  /** A chance on each kill of a creature (a wanderer, Pip). */
  | { kind: "creature"; monster: string; chance: number }
  /** A chance on each guardian kill while `hero` stands at `level` or more. */
  | { kind: "hired"; hero: string; level: number; chance: number }
  /** Given by an event (the Stray Armor's first defeat, the Caravan). */
  | { kind: "event"; event: "stray" | "caravan" }
  /** Beating the Dawn after this many Descents. */
  | { kind: "dawn"; descents: number };

export interface NamedRelicDef {
  id: string;
  slot: ItemSlot;
  rarity: Rarity;
  effect: NamedEffect;
  source: NamedSource;
}

export const NAMED_RELICS: readonly NamedRelicDef[] = [
  // ---- weapons
  { id: "oathcutter", slot: "weapon", rarity: "legendary", effect: { kind: "kingDamage", pct: 1 }, source: { kind: "king", age: 0, chance: 0.02 } },
  { id: "thousandth-arrow", slot: "weapon", rarity: "legendary", effect: { kind: "critChance", pct: 0.03 }, source: { kind: "kills", monster: "moss-alpha", kills: 1_000 } },
  { id: "quietus", slot: "weapon", rarity: "mythic", effect: { kind: "quietStrike", pct: 0.5 }, source: { kind: "gift", hero: "morgrath" } },
  { id: "unfinished-hammer", slot: "weapon", rarity: "legendary", effect: { kind: "forgeDiscount", pct: 0.15 }, source: { kind: "gift", hero: "brom" } },
  { id: "splinter-of-sky", slot: "weapon", rarity: "mythic", effect: { kind: "guardianShards", pct: 1 }, source: { kind: "stratum", era: 4, chance: 0.01 } },
  { id: "dawnbreak", slot: "weapon", rarity: "mythic", effect: { kind: "seamDps", pct: 0.25 }, source: { kind: "dawn", descents: 5 } },
  // ---- armor
  { id: "hollow-plate", slot: "armor", rarity: "mythic", effect: { kind: "bossTimer", pct: 2 }, source: { kind: "event", event: "stray" } },
  { id: "mosshide", slot: "armor", rarity: "legendary", effect: { kind: "guardianGold", pct: 0.1 }, source: { kind: "boss", monster: "moss-alpha", era: 1, chance: 0.03 } },
  { id: "briar-mantle", slot: "armor", rarity: "legendary", effect: { kind: "idleBonus", pct: 0.1 }, source: { kind: "boss", monster: "old-grove", era: 1, chance: 0.03 } },
  { id: "aurelion-scales", slot: "armor", rarity: "mythic", effect: { kind: "bossDamage", pct: 0.2 }, source: { kind: "gift", hero: "aurelion" } },
  { id: "ash-vestment", slot: "armor", rarity: "legendary", effect: { kind: "rainSeconds", pct: 45 }, source: { kind: "stratum", era: 2, chance: 0.02 } },
  { id: "mantle-of-the-last-court", slot: "armor", rarity: "mythic", effect: { kind: "regalia", pct: 0 }, source: { kind: "king", age: 2, chance: 0.01 } },
  // ---- amulets
  { id: "eldra-locket", slot: "amulet", rarity: "mythic", effect: { kind: "cooldown", pct: 0.1 }, source: { kind: "gift", hero: "eldra" } },
  { id: "singing-stone", slot: "amulet", rarity: "legendary", effect: { kind: "crystalStay", pct: 18 }, source: { kind: "creature", monster: "singing-geode", chance: 0.05 } },
  { id: "oriane-ear", slot: "amulet", rarity: "legendary", effect: { kind: "fragments", pct: 0.25 }, source: { kind: "gift", hero: "oriane" } },
  { id: "grove-seed", slot: "amulet", rarity: "legendary", effect: { kind: "clickPerRemembered", pct: 0.1 }, source: { kind: "gift", hero: "seraphine" } },
  { id: "phylactery", slot: "amulet", rarity: "mythic", effect: { kind: "phylactery", pct: 0.25 }, source: { kind: "hired", hero: "morgrath", level: 150, chance: 0.01 } },
  { id: "last-decree", slot: "amulet", rarity: "mythic", effect: { kind: "regalia", pct: 0 }, source: { kind: "king", age: 4, chance: 0.01 } },
  // ---- rings
  { id: "signet-of-orvane", slot: "ring", rarity: "mythic", effect: { kind: "regalia", pct: 0 }, source: { kind: "king", age: 1, chance: 0.01 } },
  { id: "rat-ring", slot: "ring", rarity: "legendary", effect: { kind: "treasure", pct: 0.02 }, source: { kind: "creature", monster: "golden-rat", chance: 0.005 } },
  { id: "lodestone-band", slot: "ring", rarity: "legendary", effect: { kind: "crystalSooner", pct: 0.15 }, source: { kind: "gift", hero: "garrick" } },
  { id: "mirelle-ring", slot: "ring", rarity: "legendary", effect: { kind: "mirelle", pct: 0.25 }, source: { kind: "gift", hero: "mirelle" } },
  { id: "stallkeeper-band", slot: "ring", rarity: "legendary", effect: { kind: "marketDiscount", pct: 0.1 }, source: { kind: "event", event: "caravan" } },
  { id: "second-morning", slot: "ring", rarity: "mythic", effect: { kind: "wandererStages", pct: 5 }, source: { kind: "stratum", era: 19, chance: 0.01 } }
];

export const NAMED_BY_ID: Record<string, NamedRelicDef> = lookup(NAMED_RELICS.map((relic) => [relic.id, relic]));

/** The Regalia of Orvane (BIBLE 11.5): the three worn together, and the King knows the walker. */
export const REGALIA: readonly string[] = ["signet-of-orvane", "mantle-of-the-last-court", "last-decree"];
/** Damage to the King while the walker wears the Regalia. */
export const REGALIA_KING_DAMAGE = 0.1;
/** Grove Seed: at most this much click damage. */
export const GROVE_SEED_MAX = 1;
/** Mirelle's ring: damage to the Baron of Rot. */
export const MIRELLE_BARON_DAMAGE = 0.5;
/** Power cooldowns never drop below this share (Altar of Echoes and Eldra's Locket together). */
export const COOLDOWN_FLOOR = 0.4;

/**
 * Whether a save could have met a named relic's source: the anti-cheat refuses a relic
 * whose source the walker never reached.
 */
export function namedSourceReached(state: GameState, def: NamedRelicDef): boolean {
  const source = def.source;
  const deepestEra = eraForStage(Math.max(1, state.maxStageEver - 1));
  switch (source.kind) {
    case "kills":
      return bestiaryKills(state, source.monster) >= source.kills;
    case "boss":
      // A guardian of that era: stage 10 of its loop, or deeper.
      return state.maxStageEver > source.era * 50 + 10 && bestiaryKills(state, source.monster) > 0;
    case "stratum":
      return state.maxStageEver > source.era * 50 + 10;
    case "king":
      return state.maxStageEver > (source.age * 5 + 1) * 50 && deepestEra >= source.age * 5;
    case "gift":
      return recognitionTier(state, source.hero) >= 5;
    case "creature":
      return bestiaryKills(state, source.monster) > 0;
    case "hired":
      // Hired at least once (companions are hired in order), and a guardian met since.
      return state.lifetime.bestHired > (HERO_BY_ID[source.hero]?.index ?? Infinity) && state.lifetime.bosses > 0;
    case "event":
      return source.event === "stray" ? bestiaryKills(state, "stray-armor") > 0 : state.lifetime.ascensions >= 3;
    case "dawn":
      return state.descents >= source.descents && bestiaryKills(state, "the-dawn") > 0;
  }
}

/**
 * The relics that count this night: everything worn, less the weapon while it stays on
 * Brom's anvil (his promise, BIBLE 12.11).
 */
export function wornItems(state: GameState): Item[] {
  const anvil = promiseOf(state, "anvil") !== undefined;
  return Object.values(state.equipment).filter((item) => item !== undefined && !(anvil && item.slot === "weapon"));
}

/** Sum of an effect over the equipped named relics. */
export function namedEffect(state: GameState, kind: NamedEffect["kind"]): number {
  let total = 0;
  for (const item of wornItems(state)) {
    const def = item.named ? NAMED_BY_ID[item.named] : undefined;
    if (def && def.effect.kind === kind) total += def.effect.pct;
  }
  return total;
}

/** Whether a named relic is worn. */
export function wearing(state: GameState, id: string): boolean {
  return wornItems(state).some((item) => item.named === id);
}

/** The Regalia, all three worn. */
export function wearsRegalia(state: GameState): boolean {
  return REGALIA.every((id) => wearing(state, id));
}
