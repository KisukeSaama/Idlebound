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

/**
 * The same generator, its state kept outside (in the save): each draw reads the state and
 * writes the next one, so a game reloaded from a save draws the same numbers again.
 */
export function storedRng(read: () => number, write: (state: number) => void): Rng {
  return () => {
    const next = ((read() >>> 0) + MULBERRY_STEP) >>> 0;
    write(next);
    return mulberryValue(next);
  };
}

/** A generator state (unsigned 32-bit) spread from any number, such as a creation date. */
export function seedFrom(value: number): number {
  const whole = Number.isFinite(value) ? Math.floor(Math.abs(value)) : 0;
  return Math.floor(mulberryValue(((whole % 4294967296) + MULBERRY_STEP) >>> 0) * 4294967296) >>> 0;
}

export function randomInt(rng: Rng, min: number, max: number): number {
  return Math.floor(min + rng() * (max - min + 1));
}

export function pick<T>(rng: Rng, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)];
}

export function uid(rng: Rng): string {
  return Math.floor(rng() * 2 ** 32).toString(36) + Date.now().toString(36).slice(-4);
}
