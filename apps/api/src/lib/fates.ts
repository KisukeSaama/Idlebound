import { createHmac, randomBytes } from "node:crypto";
import { buildWindow, emptyFates, type FateCounts, type Fates, type FateWindow, type Stream } from "@idlebound/game";

/**
 * The seeds of a game's fates (see `fates.ts` in the game). Each game has a secret the server
 * alone keeps, beside the save and never in it; a slice's seed is the HMAC of its stream and
 * index under that secret. A page receives the seeds of the window it plays in, never the
 * secret: it cannot draw the fates ahead of that window, and the replay draws the same ones.
 */

/** A new game's secret: 32 random bytes, hex. */
export function newSecret(): string {
  return randomBytes(32).toString("hex");
}

/** Slice `index` of `stream` for the game whose secret is `secret` (unsigned 32-bit). */
export function sliceSeed(secret: string, stream: Stream, index: number): number {
  return createHmac("sha256", Buffer.from(secret, "hex")).update(`${stream}:${index}`).digest().readUInt32BE(0);
}

/** What a page needs to play from `counts` on. */
export function fateWindow(secret: string, counts: FateCounts | undefined): FateWindow {
  return buildWindow({ ...emptyFates(), ...counts }, (stream, index) => sliceSeed(secret, stream, index));
}

/** Every slice of a game, for the replay (computed once each). */
export function secretFates(secret: string): Fates {
  const cache = new Map<string, number>();
  return {
    slice(stream, index) {
      const key = `${stream}:${index}`;
      let seed = cache.get(key);
      if (seed === undefined) {
        seed = sliceSeed(secret, stream, index);
        cache.set(key, seed);
      }
      return seed;
    }
  };
}
