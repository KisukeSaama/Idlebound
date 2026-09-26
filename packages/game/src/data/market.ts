import { lookup } from "./lookup";

export type MarketOfferId = "chest" | "great-chest" | "rage" | "fortune" | "autoclick" | "hourglass";

/** Shard market offer. Names and descriptions live in `content/`. */
export interface MarketOffer {
  id: MarketOfferId;
  cost: number;
  icon: string;
}

export const BUFF_DURATION_SECONDS = 600;
export const BUFF_MAX_SECONDS = 3600;

export const MARKET_OFFERS: MarketOffer[] = [
  { id: "chest", cost: 30, icon: "🎁" },
  { id: "great-chest", cost: 160, icon: "👑" },
  { id: "rage", cost: 20, icon: "🧪" },
  { id: "fortune", cost: 20, icon: "⚱️" },
  { id: "autoclick", cost: 25, icon: "📜" },
  { id: "hourglass", cost: 60, icon: "⌛" }
];

export const MARKET_BY_ID = lookup(MARKET_OFFERS.map((offer) => [offer.id, offer])) as Record<MarketOfferId, MarketOffer>;
