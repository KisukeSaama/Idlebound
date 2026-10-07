export type Rng = () => number;

const MULBERRY_STEP = 0x6d2b79f5;

function mulberryValue(t: number): number {
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}

/** Deterministic generator (mulberry32) for tests and simulations. */
export function seededRng(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t += MULBERRY_STEP;
    return mulberryValue(t);
  };
}

export function randomInt(rng: Rng, min: number, max: number): number {
  return Math.floor(min + rng() * (max - min + 1));
}

export function pick<T>(rng: Rng, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)];
}

/** An id drawn from the fates alone (one draw, 52 bits): the same on the device and when the server replays it. */
export function uid(rng: Rng): string {
  return Math.floor(rng() * 2 ** 52).toString(36);
}
