import type { GameState, PromiseState } from "../types";
import { CLICK_HERO_ID, HERO_BY_ID } from "./heroes";
import { RECOGNITION_HEROES, recognitionTier } from "./lore";
import { lookup } from "./lookup";

/**
 * The Promise (BIBLE 12.11): at dusk the walker gives their word to one companion, and it
 * shapes the night. The engine holds the walker to it (what the word forbids is refused)
 * until dusk, unless they break it on purpose. Kept, the night counts twice for that
 * companion's Recognition. Numbers and ids only; every word lives in `content/`.
 */
export type PromiseDef =
  /** Never hire `other` this night. */
  | { hero: string; kind: "without"; other: string }
  /** Nobody past this companion joins until the night's first guardian, or its King, falls. */
  | { hero: string; kind: "head"; until: "guardian" | "king" }
  /** Every blow is held for `seconds` at the start of each fight with a guardian ("king": the King). */
  | { hero: string; kind: "wait"; guardian: string; seconds: number }
  /** One thing the walker leaves alone all night. */
  | { hero: string; kind: "abstain"; from: PromiseAbstains }
  /** The company never walks into a seam it cannot hold; a seam that closes on it breaks the word. */
  | { hero: string; kind: "unfailing" }
  /** Every seam stays open for `share` of its time. */
  | { hero: string; kind: "seam"; share: number }
  /** The weapon stays on the anvil: it gives nothing this night. */
  | { hero: string; kind: "anvil" }
  /** The night goes deeper than the last one did. */
  | { hero: string; kind: "further" }
  /** This many Kings fall this night. */
  | { hero: string; kind: "strata"; kings: number };

export type PromiseKind = PromiseDef["kind"];
export type PromiseAbstains = "strikes" | "powers" | "shards" | "crystals" | "essences";

/** What each companion asks (BIBLE 10.3): one request each, always the same. */
export const PROMISES: readonly PromiseDef[] = [
  { hero: "maelle", kind: "head", until: "guardian" },
  { hero: "brom", kind: "anvil" },
  { hero: "ysolde", kind: "abstain", from: "strikes" },
  { hero: "cendre", kind: "without", other: "ashka" },
  { hero: "nyx", kind: "abstain", from: "powers" },
  { hero: "garrick", kind: "abstain", from: "shards" },
  { hero: "seraphine", kind: "wait", guardian: "old-grove", seconds: 10 },
  { hero: "thorvald", kind: "seam", share: 0.5 },
  { hero: "mirelle", kind: "wait", guardian: "rot-baron", seconds: 15 },
  { hero: "kaelen", kind: "head", until: "king" },
  { hero: "oriane", kind: "further" },
  { hero: "vorn", kind: "wait", guardian: "stone-devourer", seconds: 10 },
  { hero: "lysandre", kind: "strata", kings: 2 },
  { hero: "ashka", kind: "without", other: "cendre" },
  { hero: "nameless", kind: "abstain", from: "essences" },
  { hero: "eldra", kind: "unfailing" },
  { hero: "morgrath", kind: "without", other: "kaelen" },
  { hero: "celestine", kind: "abstain", from: "crystals" },
  { hero: "aurelion", kind: "wait", guardian: "king", seconds: 10 },
  { hero: "awakened", kind: "without", other: "awakened" }
];

export const PROMISE_BY_HERO: Record<string, PromiseDef> = lookup(PROMISES.map((promise) => [promise.hero, promise]));

/**
 * A companion asks for the walker's word once they half remember them (Recognition 2, three
 * nights walked together): nobody asks a stranger for their word.
 */
export const PROMISE_MIN_TIER = 2;
/**
 * Runs of Recognition a night counts for the companion whose promise was kept: twice, when
 * they also reached the level at which a night counts at all (`RECOGNITION_LEVEL`) and their
 * memories were still waiting for a word (`promisesAwaited`: two per companion). Otherwise
 * the night counts once: a word kept to a companion who stayed below that level, or a third
 * word to one who has had their two.
 */
export const PROMISE_RUNS = 2;
/** The company keeps this many seconds of margin before a seam, the night it promised never to be pushed back. */
export const UNFAILING_MARGIN_SECONDS = 1;

/**
 * A word kept is the one thing that crosses the dusk: the companion carries it and fights
 * for it. Each word kept doubles that companion's damage for good, up to this many words
 * (×32); past them the companion has nothing left to ask.
 */
export const PROMISE_DOUBLINGS = 5;

/** Promises kept to a companion, all nights together. */
export function promisesKept(state: GameState, heroId: string): number {
  return Object.hasOwn(state.promises, heroId) ? state.promises[heroId] : 0;
}

/** Words kept to a companion that still count toward their damage (`PROMISE_DOUBLINGS` at most). */
export function promiseDoublings(state: GameState, heroId: string): number {
  return Math.min(PROMISE_DOUBLINGS, promisesKept(state, heroId));
}

/** Every promise kept. */
export function promisesKeptInAll(state: GameState): number {
  return Object.values(state.promises).reduce((total, count) => total + count, 0);
}

/** Whether the walker has met a companion: hired once, on this night or an earlier one. */
export function companionMet(state: GameState, heroId: string): boolean {
  const hero = Object.hasOwn(HERO_BY_ID, heroId) ? HERO_BY_ID[heroId] : undefined;
  if (!hero || hero.id === CLICK_HERO_ID) return false;
  return (state.heroLevels[hero.id] ?? 0) > 0 || state.lifetime.bestHired > hero.index || (Object.hasOwn(state.recognition, hero.id) && state.recognition[hero.id] > 0);
}

/** Whether a companion remembers the walker enough to ask for their word. */
export function promiseAsker(state: GameState, heroId: string): boolean {
  return recognitionTier(state, heroId) >= PROMISE_MIN_TIER;
}

/** Whether promises are part of this walker's nights yet: someone half remembers them. */
export function promisesOpen(state: GameState): boolean {
  return RECOGNITION_HEROES.some((hero) => promiseAsker(state, hero));
}

/**
 * Whether a companion's request can be granted at all: someone met who half remembers the
 * walker, asking for something the
 * walker has (a companion to leave behind must have been met, a weapon to leave must be
 * worn). Whether the road allows it is `promiseAskable`'s to say (formulas.ts).
 */
export function promiseGrantable(state: GameState, heroId: string): boolean {
  const def = Object.hasOwn(PROMISE_BY_HERO, heroId) ? PROMISE_BY_HERO[heroId] : undefined;
  if (!def || !promiseAsker(state, heroId) || !companionMet(state, heroId)) return false;
  if (promisesKept(state, heroId) >= PROMISE_DOUBLINGS) return false;
  if (def.kind === "without") return companionMet(state, def.other);
  if (def.kind === "anvil") return state.equipment.weapon !== undefined;
  if (def.kind === "further") return state.ascensions.length > 0;
  return true;
}

/** Stages of a stratum: a King stands at the end of each. */
const STRATUM_STAGES = 50;
/** Where each guardian a promise waits at stands in its stratum. */
const GUARDIAN_STAGE: Record<string, number> = { "moss-alpha": 10, "old-grove": 20, "stone-devourer": 30, "rot-baron": 40 };

/**
 * The deepest stage a promise needs cleared, for a night that starts on `start`: its King
 * (or Kings), and the guardian it waits at. A promise is only asked of a walker who has
 * already been past it (see `promiseAskable`).
 */
export function promiseDepth(def: PromiseDef, start: number): number {
  const king = Math.ceil(start / STRATUM_STAGES) * STRATUM_STAGES;
  const last = king + (promiseKings(def) - 1) * STRATUM_STAGES;
  if (def.kind !== "wait" || def.guardian === "king") return last;
  const offset = GUARDIAN_STAGE[def.guardian] ?? STRATUM_STAGES;
  const before = Math.floor((start - 1) / STRATUM_STAGES) * STRATUM_STAGES + offset;
  return Math.max(last, before >= start ? before : before + STRATUM_STAGES);
}

/**
 * Dusk still, for a word to this companion: no word given yet this night, nobody has joined
 * the walker, no stretch of road is cleared, and what the word would forbid has not been
 * done. Later, the word waits for the next dusk.
 */
export function promiseAtDusk(state: GameState, heroId: string): boolean {
  const def = Object.hasOwn(PROMISE_BY_HERO, heroId) ? PROMISE_BY_HERO[heroId] : undefined;
  if (!def || state.trail.promise || state.maxStage !== state.runStartStage) return false;
  if (Object.entries(state.heroLevels).some(([id, level]) => id !== CLICK_HERO_ID && level > 0)) return false;
  if (def.kind !== "abstain") return true;
  switch (def.from) {
    case "strikes": return state.run.clicks === 0;
    case "powers": return state.run.skillsUsed === 0;
    case "crystals": return state.run.crystals === 0;
    case "essences": return state.trail.offered === 0;
    case "shards": return true;
  }
}

/** The word given this night and still standing: what it asks binds until dusk. */
export function standingPromise(state: GameState): { def: PromiseDef; progress: PromiseState } | undefined {
  const progress = state.trail.promise;
  if (!progress || progress.broken) return undefined;
  const def = Object.hasOwn(PROMISE_BY_HERO, progress.hero) ? PROMISE_BY_HERO[progress.hero] : undefined;
  return def ? { def, progress } : undefined;
}

/** The standing promise, when it is of this kind. */
export function promiseOf<K extends PromiseKind>(state: GameState, kind: K): Extract<PromiseDef, { kind: K }> | undefined {
  const standing = standingPromise(state);
  return standing && standing.def.kind === kind ? (standing.def as Extract<PromiseDef, { kind: K }>) : undefined;
}

/** Whether the standing promise keeps the walker from one thing this night. */
export function promiseAbstains(state: GameState, from: PromiseAbstains): boolean {
  return promiseOf(state, "abstain")?.from === from;
}

/** Whether the standing promise keeps a companion from being hired for now. */
export function hireBarred(state: GameState, heroId: string): boolean {
  const standing = standingPromise(state);
  if (!standing) return false;
  const { def, progress } = standing;
  if (def.kind === "without") return heroId === def.other;
  if (def.kind === "head" && !progress.released) return (HERO_BY_ID[heroId]?.index ?? 0) > HERO_BY_ID[def.hero].index;
  return false;
}

/** Kings that must fall in a night for its promise to be kept: the night has to be walked. */
export function promiseKings(def: PromiseDef): number {
  return def.kind === "strata" ? def.kings : 1;
}

/** Whether the word given this night would be kept if dusk came now. */
export function promiseHolds(state: GameState): boolean {
  const standing = standingPromise(state);
  if (!standing) return false;
  const { def, progress } = standing;
  if (progress.kings < promiseKings(def)) return false;
  if (def.kind === "wait") return progress.waited === true;
  if (def.kind === "head") return progress.released === true;
  if (def.kind === "further") return state.maxStage > (progress.goal ?? Number.POSITIVE_INFINITY);
  return true;
}
