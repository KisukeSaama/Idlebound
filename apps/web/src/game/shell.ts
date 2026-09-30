import {
  ALTAR_BY_ID,
  CARAVAN_MIN_ASCENSIONS,
  CLICK_HERO_ID,
  MARKET_OFFERS,
  ageForEra,
  ageName,
  canDescend,
  eraForStage,
  eraLabel,
  promisesOpen,
  stratumTag,
  type GameState,
  type Locale
} from "@idlebound/game";

/**
 * The progressive interface (AGENTS.md): each element of the shell appears when the walker
 * can first use it, from the save alone, so every device shows the same interface. The
 * conditions only look at records that never go back (lifetime counters, the deepest stage,
 * what was once hired or earned), so nothing the walker used ever disappears. The account
 * and the settings are not part of it: they are there from the first second, so a walker
 * coming back logged out can find their game again at once.
 */
export type RevealId =
  | "map"
  | "gear"
  | "market"
  | "ascension"
  | "hall"
  | "loom"
  | "caravan"
  | "promise"
  | "altars2"
  | "altars3"
  | "stageBar"
  | "autoToggle"
  | "dps"
  | "click"
  | "shards"
  | "essences"
  | "buyModes"
  | "autoSpend";

/** Elements whose first appearance gets a toast; the others only glow as they arrive. */
export const ANNOUNCED: readonly RevealId[] = ["map", "gear", "market", "ascension", "hall", "loom", "caravan", "promise", "altars2", "altars3"];

/**
 * Elements that arrived after walkers were already past their threshold: a game loaded past
 * it is told once too, instead of finding them unannounced.
 */
export const ANNOUNCED_AT_LOAD: readonly RevealId[] = ["promise"];

/** Id kept in `state.tutorial.done` once an element was announced (short: the list holds 50). */
export function revealMark(id: RevealId): string {
  return `ui:${id}`;
}

export type Reveals = Record<RevealId, boolean>;

/** The stall opens once the walker has earned the price of its cheapest ware. */
const FIRST_WARE = Math.min(...MARKET_OFFERS.map((offer) => offer.cost));
/** The Hall opens once the first guardian (stage 10) has fallen. */
const HALL_STAGE = 11;

export function reveals(state: GameState): Reveals {
  const life = state.lifetime;
  const announced = (id: RevealId) => state.tutorial.done.includes(revealMark(id));
  const companionHired = Object.entries(state.heroLevels).some(([id, level]) => id !== CLICK_HERO_ID && level > 0);
  const hadGear = life.itemsFound > 0 || state.inventory.length > 0 || Object.keys(state.equipment).length > 0;
  const shards = life.shardsEarned > 0 || state.shards > 0;
  const reborn = life.ascensions > 0 || state.descents > 0;
  const map = state.maxStageEver >= 2 || announced("map");
  return {
    map,
    gear: hadGear || announced("gear"),
    market: life.shardsEarned >= FIRST_WARE || announced("market"),
    ascension: state.maxStageEver >= 51 || state.essences > 0 || reborn || announced("ascension"),
    // The Hall opens with the first guardian down: the first deeds and fragments, a few
    // seconds into minute one, wait there for the walker.
    hall: state.maxStageEver >= HALL_STAGE || announced("hall"),
    // Places inside other windows: Eldra's Loom in the Sanctum, the Caravan at the stall.
    loom: canDescend(state) || state.descents > 0,
    caravan: life.ascensions >= CARAVAN_MIN_ASCENSIONS,
    // The Promise, in the Sanctum: from the second night.
    promise: promisesOpen(state),
    // The Sanctum wakes in three times: more stones answer from the third and the fifth night.
    altars2: life.ascensions + 1 >= ALTAR_BY_ID.time.night,
    altars3: life.ascensions + 1 >= ALTAR_BY_ID.harvest.night,
    stageBar: map,
    autoToggle: life.bossFails > 0 || !state.autoAdvance || reborn,
    dps: companionHired || life.bestHired >= 2 || reborn,
    click: (state.heroLevels[CLICK_HERO_ID] ?? 0) > 0 || reborn,
    shards,
    essences: state.essences > 0 || reborn,
    buyModes: life.bestLevelSum >= 10 || state.settings.buyMode !== 1 || reborn,
    autoSpend: companionHired || life.bestHired >= 2 || !state.settings.offlineSpending || reborn
  };
}

/**
 * The name of the stratum a stage belongs to: its era, its tag, and from the second Age on
 * the Age it belongs to.
 */
export function stratumLabel(stage: number, locale: Locale): string {
  return stratumLabelOf(eraForStage(stage), eraLabel(stage, locale), locale);
}

export function stratumLabelOf(era: number, label: string, locale: Locale): string {
  const parts = [label, stratumTag(era, locale)];
  if (ageForEra(era) > 0) parts.push(ageName(era, locale));
  return parts.filter(Boolean).join(" · ");
}
