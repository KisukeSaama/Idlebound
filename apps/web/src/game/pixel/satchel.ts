/**
 * The company's satchel opened at the walker's return, on the chest's grid (80 × 100): it
 * drops in and waits, a thread of light under its flap already in the color of the best relic
 * inside; touched, it tugs twice and throws its flap back on a column of that light. Then its
 * relics climb out one by one, the humblest first, each hidden in its own shadow (its rim lit
 * in its rarity) until the walker touches it: it fills in by eighths, and rings, sparks and,
 * for a legend, a column of light greet it. Every frame is a pure function of the moment.
 */
import { RARITIES, type Item, type Rarity } from "@idlebound/game";
import { C, ICON_INK, SATCHEL, type Pal } from "@idlebound/game/art";
import { CHEST_LEFT, CHEST_WIDTH, DROP, FLOOR, MIDDLE, OPENING_FPS, OPENING_HEIGHT, OPENING_WIDTH, RELIC_TOP, SCENE_COLORS, SHAKE, beam, dust, light, rampOf, relicOf, ring, sparks, stamp, wave } from "./chest";
import { paintMask } from "./mask";
import { RELIC_SIZE } from "./objects";
import { applyColors, bayer, createPixels, EMPTY, fadeStep, FADE_STEPS, reduceColors, setPixel, type Pixels } from "./pixels";
import { outline } from "./shade";

/** The satchel tugs twice before it opens. */
export const TUG = 0.45;
/** From the flap thrown back to the first relic climbing out. */
export const OPEN = 1.1;
/** A relic climbs out of the mouth in this long. */
export const RISE = 0.4;
/** A relic fills in by eighths in this long, longer for a rarer one. */
export const REVEAL: Record<Rarity, number> = { common: 0.25, rare: 0.4, epic: 0.6, legendary: 0.9, mythic: 1 };
/** The flap goes up this fast. */
const LIFT = 0.12;

export type SatchelMoment =
  /** Falling in, then resting closed: `t` since it began to fall. */
  | { phase: "drop"; t: number }
  /** Touched: it tugs, `t` since the touch. */
  | { phase: "tug"; t: number }
  /** The flap thrown back: `t` since. */
  | { phase: "open"; t: number }
  /** A relic: `rise` seconds since it began to climb out, `reveal` since the walker touched it (negative while hidden). */
  | { phase: "relic"; relic: Item; rise: number; reveal: number };

interface SatchelSprites {
  closed: Pixels;
  open: Pixels;
  /** Under the flap's edge, where the light leaks: points from the closed sprite's top left. */
  seam: { x: number; y: number }[];
  /** Row of the open mouth's dark inside from the open sprite's top, and its first and last column. */
  inside: number;
  mouth: [number, number];
}

let sprites: SatchelSprites | null = null;

/** Rows drawn through the icon ink, with a free row above and below for the outline. */
function paint(rows: readonly string[]): Pixels {
  const blank = ".".repeat(CHEST_WIDTH + 2);
  const padded = [blank, ...rows.map((row) => `.${row}.`), blank];
  const pixels = outline(paintMask({ rows: padded, legend: ICON_INK }, []));
  return applyColors(pixels, reduceColors(pixels));
}

function satchelSprites(): SatchelSprites {
  if (sprites) return sprites;
  const art = SATCHEL;
  // The flap lies over the top of the body: where it leaves a pixel empty, the body shows.
  const covered = art.body.map((row, index) => {
    const flap = art.flap[index];
    if (!flap) return row;
    return [...row].map((char, x) => (flap[x] !== "." ? flap[x] : char)).join("");
  });
  // Just under the flap's leather (never under its gold clasp), on the body it covers.
  const seam: { x: number; y: number }[] = [];
  for (let x = 0; x < CHEST_WIDTH; x += 1) {
    let lowest = -1;
    for (let row = 0; row < art.flap.length; row += 1) if (art.flap[row][x] !== ".") lowest = row;
    const below = art.body[lowest + 1]?.[x];
    if (lowest < 0 || !below || below === "." || "gGY".includes(art.flap[lowest][x])) continue;
    seam.push({ x: x + 1, y: 1 + art.strap.length + lowest + 1 });
  }
  const inside = art.mouth[art.mouth.length - 1];
  sprites = {
    closed: paint([...art.strap, ...covered]),
    open: paint([...art.flapOpen, ...art.mouth, ...art.body.slice(1)]),
    seam,
    inside: 1 + art.flapOpen.length + art.mouth.length - 1,
    mouth: [inside.indexOf("1") + 1, inside.lastIndexOf("1") + 1]
  };
  return sprites;
}

const shadows = new Map<string, Pixels>();

/**
 * A relic hidden in its own shadow: its inside the night, its rim lit, in its rarity's light
 * from rare up (a common's rim stays grey). `bright`: the rim of a legend flickering to white.
 */
function shadowOf(relic: Item, bright: boolean): Pixels {
  const key = `${relic.slot}:${relic.base ?? 0}:${relic.rarity}:${relic.forge}:${relic.named ?? ""}:${bright}`;
  const known = shadows.get(key);
  if (known) return known;
  const source = relicOf(relic);
  const out = createPixels(source.w, source.h);
  const ramp = rampOf(relic.rarity);
  const rim: Pal = relic.rarity === "common" ? C.haze : bright ? C.moon : ramp[ramp.length - 1];
  const filled = (x: number, y: number) => x >= 0 && y >= 0 && x < source.w && y < source.h && source.idx[y * source.w + x] !== EMPTY;
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      if (!filled(x, y)) continue;
      const edge = !filled(x - 1, y) || !filled(x + 1, y) || !filled(x, y - 1) || !filled(x, y + 1);
      setPixel(out, x, y, edge ? rim : C.night2, 255, edge ? 1 : 0);
    }
  }
  shadows.set(key, out);
  return out;
}

/** The relic between its shadow and itself: `step` eighths of its pixels shown, the same ones every time. */
function revealing(relic: Item, step: number, bright: boolean): Pixels {
  const real = relicOf(relic);
  const shadow = shadowOf(relic, bright);
  if (step >= FADE_STEPS) return real;
  const out = createPixels(real.w, real.h);
  const level = step / FADE_STEPS;
  for (let y = 0; y < real.h; y += 1) {
    for (let x = 0; x < real.w; x += 1) {
      const at = y * real.w + x;
      const from = real.idx[at] !== EMPTY && bayer(x, y) < level ? real : shadow;
      if (from.idx[at] === EMPTY) continue;
      setPixel(out, x, y, from.idx[at], 255, from.emit[at]);
    }
  }
  return out;
}

/** The satchel closed, as the Reunion and the bag show it. */
export function satchelIcon(): Pixels {
  return satchelSprites().closed;
}

/** The relics a satchel opening draws, ahead of time. */
export function warmSatchel(relics: readonly Item[]) {
  satchelSprites();
  for (const relic of relics) {
    relicOf(relic);
    shadowOf(relic, false);
    shadowOf(relic, true);
  }
}

/**
 * The satchel at a moment of its opening. `best`: the rarest relic inside, whose light leaks
 * under the flap and climbs out when it opens. `still`: no bob, no spark, no mote (reduced motion).
 */
export function satchelFrame(best: Rarity, moment: SatchelMoment, still = false): Pixels {
  const out = createPixels(OPENING_WIDTH, OPENING_HEIGHT);
  const bag = satchelSprites();
  const left = CHEST_LEFT - 1;
  const bestRamp = rampOf(best);
  const lit = bestRamp.length - 1;
  const tier = RARITIES.indexOf(best);

  if (moment.phase === "drop" || moment.phase === "tug") {
    const t = moment.t;
    const frame = Math.floor(t * OPENING_FPS);
    const falling = moment.phase === "drop" && t < DROP && !still;
    const fall = falling ? (1 - t / DROP) ** 2 : 0;
    const resting = moment.phase === "drop" && t >= DROP;
    const bob = resting && !still && Math.floor((t - DROP) / 0.8) % 2 === 1 ? -1 : 0;
    const top = FLOOR + 2 - bag.closed.h - Math.round(fall * 90) + bob;
    if (moment.phase === "drop" && !still) dust(out, t - DROP);
    const seamY = top + (bag.seam[0]?.y ?? 0);
    let dx = 0;
    if (moment.phase === "tug") {
      wave(out, MIDDLE, seamY, t, 0.5, 70, bestRamp);
      wave(out, MIDDLE, seamY, t - 0.22, 0.5, 82, bestRamp);
      const since = t < 0.22 ? t : t - 0.22;
      dx = since < SHAKE && !still ? (frame % 2 === 0 ? 1 + (tier >= 3 ? 1 : 0) : -1) : 0;
    }
    stamp(out, bag.closed, left + dx, top);
    // A thread of light under the flap, in the color of the best relic inside; brighter as it tugs.
    if (tier >= 1 || moment.phase === "tug") {
      for (const point of bag.seam) {
        const flicker = still ? 0 : (point.x + frame) % 3;
        const pal = moment.phase === "tug" ? (flicker === 0 ? bestRamp[lit] : C.moon) : flicker === 0 ? bestRamp[Math.max(0, lit - 1)] : bestRamp[lit];
        light(out, left + dx + point.x, top + point.y, pal);
      }
    }
    return applyColors(out, reduceColors(out, SCENE_COLORS));
  }

  const openTop = FLOOR + 2 - bag.open.h;
  const insideY = openTop + bag.inside;

  if (moment.phase === "open") {
    const age = moment.t;
    if (!still) {
      beam(out, insideY, age, bestRamp);
      wave(out, MIDDLE, insideY, age, 0.45, 150, bestRamp);
      wave(out, MIDDLE, insideY, age - 0.1, 0.45, 110, bestRamp);
    }
    // The flap rises from where it lay, then hangs thrown back.
    const rising = age < LIFT && !still ? Math.round((1 - age / LIFT) * 6) : 0;
    stamp(out, bag.open, left, openTop + rising);
    for (let x = bag.mouth[0]; x <= bag.mouth[1]; x += 1) light(out, left + x, insideY, Math.abs(left + x - MIDDLE) < 5 ? C.moon : bestRamp[lit]);
    if (!still) sparks(out, MIDDLE, insideY - 1, age, bestRamp, 10 + tier * 6);
    return applyColors(out, reduceColors(out, SCENE_COLORS));
  }

  // A relic out of the satchel.
  const relic = moment.relic;
  const ramp = rampOf(relic.rarity);
  const top = ramp.length - 1;
  const rank = RARITIES.indexOf(relic.rarity);
  const relicLeft = Math.round(MIDDLE - (RELIC_SIZE - 1) / 2);
  const relicMiddle = RELIC_TOP + (RELIC_SIZE - 1) / 2;
  const duration = REVEAL[relic.rarity];
  const shown = moment.reveal >= 0 ? Math.min(1, moment.reveal / duration) : 0;
  /** Seconds since it showed itself whole (negative before). */
  const found = moment.reveal >= 0 ? moment.reveal - duration : -1;
  const frame = still ? 0 : Math.floor(Math.max(0, moment.rise) * OPENING_FPS);
  const hold = still || found < 0 ? 0 : Math.floor(found / 0.6) % 2 === 0 ? 0 : -1;

  if (found >= 0) {
    const shimmer = still ? 0 : Math.floor(found / 0.4) % 2;
    if (rank >= 1) ring(out, MIDDLE, relicMiddle + hold, 19 + shimmer, ramp[top], 2);
    if (rank >= 2) ring(out, MIDDLE, relicMiddle + hold, 23 - shimmer, ramp[Math.max(0, top - 1)], 4);
    if (!still) {
      // A legend climbs into its own column of light, as the chests' do.
      if (rank >= 3) beam(out, insideY, found, ramp);
      wave(out, MIDDLE, relicMiddle, found, 0.5, 120, ramp);
      if (rank >= 2) wave(out, MIDDLE, relicMiddle, found - 0.1, 0.5, 90, ramp);
    }
  }
  stamp(out, bag.open, left, openTop);
  // The inside of the satchel glows with what is still in it.
  for (let x = bag.mouth[0]; x <= bag.mouth[1]; x += 1) light(out, left + x, insideY, (x + frame) % 4 === 0 ? ramp[top] : bestRamp[Math.max(0, lit - 1)]);
  const climb = still ? 1 : Math.min(1, Math.max(0, moment.rise) / RISE);
  const relicTop = Math.round(insideY - (insideY - RELIC_TOP) * (1 - (1 - climb) ** 3)) + hold;
  // Hidden, a legend's rim flickers to white, slower than three times a second.
  const bright = rank >= 3 && moment.reveal < 0 && !still && Math.floor(moment.rise / 0.35) % 2 === 1;
  const picture = revealing(relic, still && moment.reveal >= 0 ? FADE_STEPS : fadeStep(shown), bright);
  stamp(out, picture, relicLeft, relicTop, insideY);
  if (!still && found >= 0) sparks(out, MIDDLE, relicMiddle, found, ramp, 8 + rank * 6);
  return applyColors(out, reduceColors(out, SCENE_COLORS));
}
