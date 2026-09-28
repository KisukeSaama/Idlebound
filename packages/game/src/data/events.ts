/**
 * Events of the Long Night (BIBLE 13): each with a trigger the engine sees, a bounded reward
 * and a fragment the first time. They only happen in a watched tab (like crystals), never
 * during a catch-up, and draw on the engine's RNG. Numbers only; words live in `content/`.
 */
export type EventId =
  | "seam"
  | "storm"
  | "wager"
  | "walker"
  | "caravan"
  | "quiet"
  | "stray"
  | "eclipse"
  | "tide"
  | "remembrance"
  | "migration"
  | "unfinished";

export const EVENTS: readonly EventId[] = ["storm", "seam", "wager", "walker", "caravan", "quiet", "stray", "eclipse", "tide", "remembrance", "migration", "unfinished"];

/** Crystal Storm: one wandering crystal in this many brings the Lantern Queen and four more. */
export const STORM_ODDS = 20;
export const STORM_CRYSTALS = 5;
/** Seconds each crystal of a storm stays. */
export const STORM_CRYSTAL_SECONDS = 3;

/** The Seam: on normal stages from this one, one spawn in this many; its own timer; elite HP. */
export const SEAM_MIN_STAGE = 60;
export const SEAM_ODDS = 400;
export const SEAM_SECONDS = 20;

/** Pip's Wager: one golden rat in this many stops and dares the walker. */
export const WAGER_ODDS = 10;
export const WAGER_CLICKS = 13;
export const WAGER_SECONDS = 5;
/** A won wager pays this much more than a golden rat (×10 becomes ×30). */
export const WAGER_GOLD = 3;

/** Echo of a Walker: from this many ascensions, a chance per first clear of a guardian. */
export const WALKER_MIN_ASCENSIONS = 5;
export const WALKER_CHANCE = 0.01;
export const WALKER_SECONDS = 30;
export const WALKER_DPS = 1.25;

/** The Caravan: from this many ascensions, one ware a week, the same for everyone. */
export const CARAVAN_MIN_ASCENSIONS = 3;

/** The Quiet: from the Void stratum (era 3), one spawn in this many; its own timer. */
export const QUIET_MIN_ERA = 3;
export const QUIET_ODDS = 1_000;
export const QUIET_SECONDS = 10;

/** Stray Armor: once the Nameless is hired, one spawn in this many; elite HP. */
export const STRAY_ODDS = 2_000;
export const STRAY_HERO = "nameless";

/** The King's Eclipse: every this many ascensions, the next King is shadowed and heavier. */
export const ECLIPSE_EVERY = 7;
export const ECLIPSE_HP = 1.5;

/** Dream-tide: after a catch-up this long, the next crystal comes this soon. */
export const TIDE_MIN_SECONDS = 4 * 3_600;
export const TIDE_CRYSTAL_SECONDS = 20;

/**
 * Remembrance Nights: the launch anniversary and the winter solstice, by the walker's own
 * calendar (month 1 to 12, day). Fragments come twice as often; no power is given.
 */
export const REMEMBRANCE_DAYS: readonly { month: number; day: number; id: "launch" | "solstice" }[] = [
  { month: 10, day: 1, id: "launch" },
  { month: 12, day: 21, id: "solstice" }
];
export const REMEMBRANCE_FRAGMENTS = 2;

export function remembranceNight(date: Date): "launch" | "solstice" | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return REMEMBRANCE_DAYS.find((entry) => entry.month === month && entry.day === day)?.id ?? null;
}

/** The Migration: from era 1, one stage in this many is crossed by another biome's Remnants. */
export const MIGRATION_MIN_ERA = 1;
export const MIGRATION_ODDS = 50;

/** The Unfinished: from the Draft (Age VI, index 5), one spawn in this many comes half drawn. */
export const UNFINISHED_MIN_AGE = 5;
export const UNFINISHED_ODDS = 200;
