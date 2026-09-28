import { lookup } from "./lookup";

/**
 * The Caravan (BIBLE 13, event 5): the Stallkeeper travels between nights and brings one
 * ware a week, the same for every walker (chosen by the ISO week). Priced in shards; each
 * ware is bought once a week, the Token once a save. Numbers only.
 */
export type CaravanWareId =
  | "token"
  | "sealed-coffer"
  | "bottled-night"
  | "pips-cheese"
  | "moth-lantern"
  | "ember-draught"
  | "eldra-thread"
  | "three-chests";

export interface CaravanWare {
  id: CaravanWareId;
  cost: number;
}

export const CARAVAN_WARES: readonly CaravanWare[] = [
  /** The Stallkeeper's Token, a named ring (-10% prices). */
  { id: "token", cost: 300 },
  /** A relic, legendary or better. */
  { id: "sealed-coffer", cost: 400 },
  /** Two hours of gold, now. */
  { id: "bottled-night", cost: 100 },
  /** Golden rats come twice as often for 30 min (inside their cap). */
  { id: "pips-cheese", cost: 45 },
  /** Wandering crystals come every 45 to 90 s for 30 min. */
  { id: "moth-lantern", cost: 60 },
  /** Rage potion and fortune elixir at once (10 min each). */
  { id: "ember-draught", cost: 35 },
  /** Every power ready again. */
  { id: "eldra-thread", cost: 80 },
  /** Three relic chests. */
  { id: "three-chests", cost: 75 }
];

export const CARAVAN_BY_ID = lookup(CARAVAN_WARES.map((ware) => [ware.id, ware])) as Record<CaravanWareId, CaravanWare>;

/** Minutes the Cheese and the Lantern last. */
export const CARAVAN_BUFF_SECONDS = 1_800;

/** ISO 8601 week of a date, as "2026-W40" (weeks start on Monday; UTC). */
export function isoWeek(time: number): string {
  const date = new Date(time);
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const weekday = day.getUTCDay() || 7;
  day.setUTCDate(day.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(day.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((day.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** The ware of a week: the same for everyone, from the week's name alone. */
export function caravanWare(week: string): CaravanWare {
  let hash = 2166136261;
  for (let index = 0; index < week.length; index += 1) {
    hash ^= week.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return CARAVAN_WARES[(hash >>> 0) % CARAVAN_WARES.length];
}
