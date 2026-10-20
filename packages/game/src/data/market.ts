import type { BuffId, GameState, ItemSlot } from "../types";
import { SLOTS } from "./items";
import { lookup } from "./lookup";
import { PLACES, shardScale, slotTraits, type PlaceId, type TraitId } from "./traits";
import { seededRng, type Rng } from "../rng";

/** The stall's everyday wares, as the market sold them before save version 20 (their pictures and names). */
export type MarketOfferId = "chest" | "great-chest" | "rage" | "fortune" | "autoclick" | "hourglass";

/** Shard market offer. Names and descriptions live in `content/`. */
export interface MarketOffer {
  id: MarketOfferId;
  cost: number;
}

export const BUFF_DURATION_SECONDS = 600;
/** Longest a boon can run past the last tick, except the stall's own (`MARKET_BUFF_MAX_SECONDS`). */
export const BUFF_MAX_SECONDS = 3600;
/**
 * Longest the stall's boons can run past the last tick: a day. Before save version 20 they
 * piled up without end, and a deep walker's shards bought them for good (thousands of hours
 * each): a boon worn for good is no longer a choice. The time an older save held past it came
 * back as shards (`migrate.ts`).
 */
export const MARKET_BUFF_MAX_SECONDS = 86_400;
/** Boons the stall and the Caravan sell by the draught: their time piles up, up to a day. */
export const MARKET_BUFFS = ["rage", "fortune", "autoclick"] as const satisfies readonly (BuffId & MarketOfferId)[];

export function isMarketBuff(id: BuffId): boolean {
  return (MARKET_BUFFS as readonly BuffId[]).includes(id);
}

/** Whether ten more minutes of a stall boon fit under its day: past it, the stall sells none. */
export function boonFits(state: GameState, id: BuffId, now: number): boolean {
  const buff = state.buffs.find((entry) => entry.id === id);
  const left = buff ? Math.max(0, buff.until - now) / 1000 : 0;
  return left + BUFF_DURATION_SECONDS <= MARKET_BUFF_MAX_SECONDS;
}

/** The everyday wares at their price before depth (`shardScale`): the cheapest the stall ever asks. */
export const MARKET_OFFERS: MarketOffer[] = [
  { id: "chest", cost: 30 },
  { id: "great-chest", cost: 160 },
  { id: "rage", cost: 20 },
  { id: "fortune", cost: 20 },
  { id: "autoclick", cost: 25 },
  { id: "hourglass", cost: 60 }
];

export const MARKET_BY_ID = lookup(MARKET_OFFERS.map((offer) => [offer.id, offer])) as Record<MarketOfferId, MarketOffer>;

// ---------------------------------------------------------------- the stall (save version 20)

/**
 * Every ware the Stallkeeper lays out (BIBLE 10.4): the everyday ones, a crate of one slot, and
 * those of the rare place. Names and descriptions live in `content/`.
 */
export type StallWareId = MarketOfferId | "crate" | "set-piece" | "trait-piece" | "star-coffer";

/** How rare a ware is on the stall: its frame, and how often the road brings it. */
export type WareRarity = "common" | "rare" | "epic" | "legendary";

export interface StallWareDef {
  id: StallWareId;
  rarity: WareRarity;
  /** Shards before depth: the price is `cost × shardScale(best stage)`. */
  cost: number;
  /** How many the stall holds. */
  stock: number;
  /** Odds among the drawn places (0: never drawn there). */
  weight: number;
}

export const STALL_WARES: readonly StallWareDef[] = [
  /** A relic chest: the first place always holds three. */
  { id: "chest", rarity: "common", cost: 30, stock: 3, weight: 0 },
  { id: "rage", rarity: "common", cost: 20, stock: 3, weight: 3 },
  { id: "fortune", rarity: "common", cost: 20, stock: 3, weight: 3 },
  { id: "autoclick", rarity: "common", cost: 25, stock: 3, weight: 3 },
  { id: "hourglass", rarity: "rare", cost: 60, stock: 2, weight: 2 },
  /** A relic of one slot, rare or better. */
  { id: "crate", rarity: "rare", cost: 50, stock: 2, weight: 2 },
  { id: "great-chest", rarity: "epic", cost: 160, stock: 1, weight: 1 },
  /** The rare place: a relic of one place and one slot, legendary or better (to finish a set). */
  { id: "set-piece", rarity: "legendary", cost: 600, stock: 1, weight: 2 },
  /** The rare place: a relic of one slot that remembers one trait, legendary or better. */
  { id: "trait-piece", rarity: "legendary", cost: 600, stock: 1, weight: 2 },
  /** The rare place: a mythic relic. Dearer than the Ledger's share of mythics bought (one per 2000 shards). */
  { id: "star-coffer", rarity: "legendary", cost: 2400, stock: 1, weight: 1 }
];

export const STALL_WARE_BY_ID = lookup(STALL_WARES.map((ware) => [ware.id, ware])) as Record<StallWareId, StallWareDef>;

/** Wares that hold a relic: refused while the pack is full. */
export const RELIC_WARES: readonly StallWareId[] = ["chest", "great-chest", "crate", "set-piece", "trait-piece", "star-coffer"];

/** Wares of the rare place. */
export const RARE_WARES: readonly StallWareId[] = ["set-piece", "trait-piece", "star-coffer"];

/**
 * The stall changes every six hours, at the same hours for every walker (0:00, 6:00, 12:00
 * and 18:00 UTC): the road brings the Stallkeeper new wares, and what was sold is gone until
 * then. Long enough to come back to, short enough that a day of play meets several.
 */
export const STALL_HOURS = 6;
export const STALL_MS = STALL_HOURS * 3_600_000;
/** Places drawn after the chests. */
export const STALL_DRAWN = 3;
/** Share of the stalls that open the rare place: about one a day. */
export const RARE_PLACE_ODDS = 0.25;
/** The rare place stands from the first dusk: by then the walker has crossed all five places. */
export const RARE_PLACE_ASCENSIONS = 1;

/** One place of the stall: its ware, how many it holds, and what the ware is made of. */
export interface StallPlace {
  ware: StallWareId;
  stock: number;
  slot?: ItemSlot;
  place?: PlaceId;
  trait?: TraitId;
}

/** The stall of the six hours `time` falls in. */
export function stallWindow(time: number): number {
  return Math.floor(time / STALL_MS);
}

/** When the stall of `window` gives way to the next. */
export function stallEnds(window: number): number {
  return (window + 1) * STALL_MS;
}

function weighted(rng: Rng, wares: readonly StallWareDef[]): StallWareDef {
  let roll = rng() * wares.reduce((sum, ware) => sum + ware.weight, 0);
  for (const ware of wares) {
    roll -= ware.weight;
    if (roll < 0) return ware;
  }
  return wares[wares.length - 1];
}

/**
 * The stall of a window, the same for everyone, from the window's number alone (so the
 * server lays out the same one): the chests first, three places drawn without repeating a
 * ware, and now and then the rare place last.
 */
export function stallAt(window: number): StallPlace[] {
  // The window's number, spread over 32 bits (murmur3's finalizer), seeds the stall.
  let seed = Math.imul(window ^ (window >>> 16), 0x85ebca6b);
  seed = Math.imul(seed ^ (seed >>> 13), 0xc2b2ae35);
  const rng = seededRng((seed ^ (seed >>> 16)) >>> 0);
  const places: StallPlace[] = [{ ware: "chest", stock: STALL_WARE_BY_ID.chest.stock }];
  const pool = STALL_WARES.filter((ware) => ware.weight > 0 && !RARE_WARES.includes(ware.id));
  for (let drawn = 0; drawn < STALL_DRAWN; drawn += 1) {
    const ware = weighted(rng, pool);
    pool.splice(pool.indexOf(ware), 1);
    places.push(ware.id === "crate" ? { ware: ware.id, stock: ware.stock, slot: SLOTS[Math.floor(rng() * SLOTS.length)] } : { ware: ware.id, stock: ware.stock });
  }
  if (rng() < RARE_PLACE_ODDS) {
    const ware = weighted(rng, STALL_WARES.filter((entry) => RARE_WARES.includes(entry.id)));
    const slot = SLOTS[Math.floor(rng() * SLOTS.length)];
    if (ware.id === "set-piece") places.push({ ware: ware.id, stock: ware.stock, slot, place: PLACES[Math.floor(rng() * PLACES.length)] });
    else if (ware.id === "trait-piece") {
      const traits = slotTraits(slot);
      places.push({ ware: ware.id, stock: ware.stock, slot, trait: traits[Math.floor(rng() * traits.length)].id });
    } else places.push({ ware: ware.id, stock: ware.stock });
  }
  return places;
}

/** Shards a ware asks before discounts: its cost, by the walker's depth. */
export function wareCost(ware: StallWareId, maxStageEver: number): number {
  return STALL_WARE_BY_ID[ware].cost * shardScale(maxStageEver);
}

/** How many of a place the walker already bought from the stall of `window`. */
export function stallBought(state: GameState, window: number, index: number): number {
  return state.stall && state.stall.window === window ? (state.stall.bought[index] ?? 0) : 0;
}

/**
 * The deepest stage within reach whose relic comes from `place` (the five places take ten
 * stages each, loop after loop), or 0 when the walker never went that far.
 */
export function placeLevel(place: PlaceId, maxStageEver: number): number {
  const top = Math.max(1, maxStageEver - 1);
  const offset = PLACES.indexOf(place) * 10;
  const era = Math.floor((top - 1) / 50);
  for (let loop = era; loop >= 0; loop -= 1) {
    const first = loop * 50 + offset + 1;
    if (first <= top) return Math.min(top, first + 9);
  }
  return 0;
}
