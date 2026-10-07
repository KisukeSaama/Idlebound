import type { Rng } from "./rng";

/**
 * The game's randomness, split by use. Each stream counts its occasions (a strike, a spawn, a
 * kill's spoils, a crystal, a chest…), and the n-th occasion of a stream always draws the
 * same numbers, whatever happened before it in the other streams: the n-th chest opened gives
 * the same relic whether the walker struck a thousand times before or not at all.
 *
 * The occasions of a stream come in slices. Each slice has its own seed, which the server
 * derives from a secret it keeps per game and hands out a window at a time (see `FateWindow`):
 * the device can draw what the walker is about to live, never simulate far ahead offline. The
 * save only counts the occasions used (`GameState.fates`), never the secret.
 */
export const STREAMS = ["strike", "spawn", "loot", "crystal", "catch", "chest", "road"] as const;
export type Stream = (typeof STREAMS)[number];

/** Occasions used so far in each stream. */
export type FateCounts = Record<Stream, number>;

/**
 * Occasions per slice: about two minutes of the busiest play each, so a window of
 * `WINDOW_SLICES` lasts at least twenty minutes of the fastest hands (strikes at full
 * autoclick, a kill every few steps).
 */
export const SLICE_SIZE: Record<Stream, number> = { strike: 8192, spawn: 2048, loot: 2048, crystal: 32, catch: 32, chest: 64, road: 256 };

/** Slices the device knows ahead of the occasion it stands at, in each stream. */
export const WINDOW_SLICES = 16;

/**
 * Occasions that must stay known ahead for the game to go on live: more than a single step,
 * an action or a storm can use. Below it, the road waits for the Ledger (`Fates.starved`).
 */
export const FATE_MARGIN: Record<Stream, number> = { strike: 1024, spawn: 128, loot: 128, crystal: 8, catch: 8, chest: 8, road: 16 };

export function emptyFates(): FateCounts {
  return { strike: 0, spawn: 0, loot: 0, crystal: 0, catch: 0, chest: 0, road: 0 };
}

/** Where the seeds of the slices come from. */
export interface Fates {
  /** The seed (unsigned 32-bit) of slice `index` of `stream`, or null when it is not known here. */
  slice(stream: Stream, index: number): number | null;
}

/** One stream's known slices: `seeds[i]` is slice `from + i`. */
export interface FateSlices {
  from: number;
  seeds: number[];
}

/** What the server hands a device: a window of slices in every stream. */
export type FateWindow = Record<Stream, FateSlices>;

function mix(value: number): number {
  let t = (value + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
  return (t ^ (t >>> 14)) >>> 0;
}

/** The generator of occasion `index` of a slice: mulberry32 from a seed spread from both. */
export function occasionRng(sliceSeed: number, index: number): Rng {
  let t = mix(sliceSeed ^ mix(index >>> 0)) >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** The generator of occasion `count` of `stream`, or null when its slice is not known. */
export function occasion(fates: Fates, stream: Stream, count: number): Rng | null {
  const size = SLICE_SIZE[stream];
  const seed = fates.slice(stream, Math.floor(count / size));
  return seed === null ? null : occasionRng(seed, count);
}

/** Every slice known, from one number: tests, simulations, and games played without a server. */
export function localFates(seed: number): Fates {
  return {
    slice: (stream, index) => mix(mix(seed >>> 0) ^ mix(STREAMS.indexOf(stream) * 0x10000 + index))
  };
}

/** The slices a server handed out. */
export function windowFates(window: FateWindow): Fates {
  return {
    slice(stream, index) {
      const known = window[stream];
      if (!known) return null;
      const seed = known.seeds[index - known.from];
      return seed === undefined ? null : seed;
    }
  };
}

/** The slices of a stream a window must hold for a device at `count` occasions. */
export function windowRange(stream: Stream, count: number): { from: number; to: number } {
  const from = Math.floor(count / SLICE_SIZE[stream]);
  return { from, to: from + WINDOW_SLICES };
}

/** Builds the window for counts `counts` from a function that derives a slice's seed. */
export function buildWindow(counts: FateCounts, seed: (stream: Stream, index: number) => number): FateWindow {
  const window = {} as FateWindow;
  for (const stream of STREAMS) {
    const { from, to } = windowRange(stream, counts[stream] ?? 0);
    const seeds: number[] = [];
    for (let index = from; index < to; index += 1) seeds.push(seed(stream, index) >>> 0);
    window[stream] = { from, seeds };
  }
  return window;
}

/** Whether some stream has fewer occasions known ahead than a step may use. */
export function starved(fates: Fates, counts: FateCounts): boolean {
  for (const stream of STREAMS) {
    const ahead = (counts[stream] ?? 0) + FATE_MARGIN[stream];
    if (fates.slice(stream, Math.floor(ahead / SLICE_SIZE[stream])) === null) return true;
  }
  return false;
}
