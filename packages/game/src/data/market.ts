import type { BuffId } from "../types";
import { lookup } from "./lookup";

export type MarketOfferId = "chest" | "great-chest" | "rage" | "fortune" | "autoclick" | "hourglass";

/** Shard market offer. Names and descriptions live in `content/`. */
export interface MarketOffer {
  id: MarketOfferId;
  cost: number;
}

export const BUFF_DURATION_SECONDS = 600;
/** Longest a boon can run past the last tick, except the stall's own, which stack without end. */
export const BUFF_MAX_SECONDS = 3600;
/** Boons the stall and the Caravan sell by the draught: their time piles up as long as shards last. */
export const MARKET_BUFFS = ["rage", "fortune", "autoclick"] as const satisfies readonly (BuffId & MarketOfferId)[];

export function isMarketBuff(id: BuffId): boolean {
  return (MARKET_BUFFS as readonly BuffId[]).includes(id);
}

export const MARKET_OFFERS: MarketOffer[] = [
  { id: "chest", cost: 30 },
  { id: "great-chest", cost: 160 },
  { id: "rage", cost: 20 },
  { id: "fortune", cost: 20 },
  { id: "autoclick", cost: 25 },
  { id: "hourglass", cost: 60 }
];

export const MARKET_BY_ID = lookup(MARKET_OFFERS.map((offer) => [offer.id, offer])) as Record<MarketOfferId, MarketOffer>;
