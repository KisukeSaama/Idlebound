/**
 * A chest opened at the stall, on its own grid (80 × 100): the chest drops in and lands,
 * then rattles once for each rarity it climbs through, light leaking from under its lid in
 * that rarity's color with a ring going out at every knock; then the lid bursts open on a
 * column of light, sparks fly, and a reel of relics climbs out of it, fast, then slower and
 * slower between two gold marks, until it stops on the relic the chest held: the others go,
 * and it hangs there in rings of its light. The relics of the reel are drawn by the odds of
 * the chest, never weighted. Every frame is a pure function of the time: the same chest,
 * relic, seed and moment give the same pixels.
 */
import { RARITIES, RARITY_INFO, SLOTS, SLOT_BASE_COUNT, type Item, type Rarity } from "@idlebound/game";
import { C, CHESTS, ICON_INK, RAMPS, rampFor, type ChestId, type Pal } from "@idlebound/game/art";
import { paintMask } from "./mask";
import { RELIC_SIZE, renderRelic } from "./objects";
import { applyColors, bayer, createPixels, EMPTY, fadeStep, hash2, reduceColors, setPixel, veil, type Pixels } from "./pixels";
import { outline } from "./shade";

export const OPENING_WIDTH = 80;
export const OPENING_HEIGHT = 100;
/** Frames a second of the opening: positions move on whole frames. */
export const OPENING_FPS = 30;

const CHEST_WIDTH = 30;
const CHEST_LEFT = (OPENING_WIDTH - CHEST_WIDTH) / 2;
/** Last row of the chest's body. */
const FLOOR = 89;
/** The middle of the grid, between its two middle columns. */
const MIDDLE = (OPENING_WIDTH - 1) / 2;
/** Where the relic hangs once found, the middle of the reel: its top row. */
const RELIC_TOP = 14;
/** Most colors of the whole scene, the reel full of relics included. */
const SCENE_COLORS = 24;

/** The chest falls in from above, then waits a breath. */
const DROP = 0.32;
const FIRST_KNOCK = 0.46;
/** One knock per rarity climbed: a shake, then stillness. */
const KNOCK = 0.42;
const SHAKE = 0.24;
const RING_LIFE = 0.5;
/** After the last knock: the lid bursts up, then hangs tipped back. */
const LIFT = 0.12;
const BEAM = 0.9;
/** The reel starts climbing a moment after the lid bursts, and slows down for this long. */
const SPIN_FROM = 0.15;
const SPIN = 3;
/** Stopped a little off its middle, the reel slides back onto it. */
const SETTLE = 0.25;
/** The other relics of the reel go, an eighth at a time. */
const CLEAR = 0.32;
/** From the reel stopping to the relic told by name. */
const REVEAL = 0.6;
/** The reel: relics one above the other, this many pixels apart; the chest's relic is number `REEL_STOP`. */
const REEL_PITCH = 40;
const REEL_STOP = 24;
const REEL_LENGTH = REEL_STOP + 3;
/** Rows at the top of the grid where the reel thins out into the night. */
const REEL_FADE = 10;

export interface OpeningSpec {
  chest: ChestId;
  item: Pick<Item, "slot" | "base" | "rarity" | "forge" | "named">;
  /** Draws the other relics of the reel and where in its relic the reel first stops. */
  seed?: number;
}

export interface OpeningTimes {
  /** The rarity told by each knock, in order: the chest's lowest up to the relic's. */
  knocks: Rarity[];
  /** When each knock lands, in seconds. */
  knockAt: number[];
  open: number;
  /** When the reel starts climbing, and when it stops. */
  spin: number;
  land: number;
  reveal: number;
}

/** The lowest rarity a chest can hold: the great chest, an epic. */
const FLOOR_RARITY: Record<ChestId, Rarity> = { chest: "common", "great-chest": "epic" };

export function openingTimes(spec: OpeningSpec): OpeningTimes {
  const from = RARITIES.indexOf(FLOOR_RARITY[spec.chest]);
  const to = Math.max(from, RARITIES.indexOf(spec.item.rarity));
  const knocks = RARITIES.slice(from, to + 1);
  const knockAt = knocks.map((_, index) => FIRST_KNOCK + index * KNOCK);
  const open = FIRST_KNOCK + knocks.length * KNOCK;
  const spin = open + SPIN_FROM;
  const land = spin + SPIN;
  return { knocks, knockAt, open, spin, land, reveal: land + REVEAL };
}

export type ReelRelic = Pick<Item, "slot" | "base" | "rarity" | "forge" | "named">;

/**
 * The relics of the reel, from the first to climb out: drawn from what the chest can hold, at
 * its own odds (every slot alike, every rarity by its weight, none below the chest's lowest),
 * with the chest's own relic at `REEL_STOP`.
 */
export function reelRelics(spec: OpeningSpec): ReelRelic[] {
  const seed = spec.seed ?? 1;
  const rarities = RARITIES.slice(RARITIES.indexOf(FLOOR_RARITY[spec.chest]));
  const total = rarities.reduce((sum, rarity) => sum + RARITY_INFO[rarity].weight, 0);
  return Array.from({ length: REEL_LENGTH }, (_, index) => {
    if (index === REEL_STOP) return spec.item;
    let roll = hash2(index, 1, seed) * total;
    const rarity = rarities.find((entry) => (roll -= RARITY_INFO[entry].weight) < 0) ?? rarities[0];
    const slot = SLOTS[Math.floor(hash2(index, 2, seed) * SLOTS.length)];
    return { slot, base: Math.floor(hash2(index, 3, seed) * SLOT_BASE_COUNT[slot]), rarity, forge: 0 };
  });
}

/** How far the reel has climbed at `t`, in pixels: 0 with the chest's relic in the middle. */
function reelLift(spec: OpeningSpec, times: OpeningTimes, t: number, insideY: number): number {
  const target = REEL_STOP * REEL_PITCH;
  // It first stops somewhere in the chest's relic, not always on its middle.
  const off = Math.round((hash2(7, 7, spec.seed ?? 1) - 0.5) * 16);
  const start = RELIC_TOP - (insideY + 6);
  if (t >= times.land) {
    const back = Math.min(1, (t - times.land) / SETTLE);
    return target + Math.round(off * (1 - back) ** 2);
  }
  const share = Math.max(0, (t - times.spin) / SPIN);
  return start + (target + off - start) * (1 - (1 - share) ** 3);
}

/** Which relic of the reel sits on the middle at `t` (a tick is heard each time it changes), or -1 before the reel. */
export function reelPosition(spec: OpeningSpec, t: number): number {
  const times = openingTimes(spec);
  if (t < times.spin) return -1;
  const insideY = FLOOR - CHESTS[spec.chest].body.length;
  return Math.round(reelLift(spec, times, Math.min(t, times.land), insideY) / REEL_PITCH);
}

/** Draws every relic of the reel ahead of time, so the reel never waits on one. */
export function warmOpening(spec: OpeningSpec) {
  chestSprites(spec.chest);
  for (const relic of reelRelics(spec)) relicOf(relic);
}

function rampOf(rarity: Rarity): readonly Pal[] {
  return RAMPS[rampFor(RARITY_INFO[rarity].color)];
}

interface ChestSprites {
  closed: Pixels;
  /** The open chest without its lid, while the lid is in the air. */
  lidless: Pixels;
  open: Pixels;
  lid: Pixels;
  /** Row of each sprite's seam (closed) or dark inside (open), counted from its top. */
  seam: number;
  inside: number;
}

const sprites = new Map<ChestId, ChestSprites>();

/** Rows drawn through the icon ink, with a free row above and below for the outline. */
function paint(rows: readonly string[]): Pixels {
  const blank = ".".repeat(CHEST_WIDTH + 2);
  const padded = [blank, ...rows.map((row) => `.${row}.`), blank];
  const pixels = outline(paintMask({ rows: padded, legend: ICON_INK }, []));
  return applyColors(pixels, reduceColors(pixels));
}

function chestSprites(id: ChestId): ChestSprites {
  const known = sprites.get(id);
  if (known) return known;
  const art = CHESTS[id];
  // The closed lid sits on the body over one dark seam, where the light leaks.
  const seamRow = `.${"1".repeat(CHEST_WIDTH - 2)}.`;
  const made: ChestSprites = {
    closed: paint([...art.lid, seamRow, ...art.body]),
    lidless: paint([...art.mouth, ...art.body]),
    open: paint([...art.lidOpen, ...art.mouth, ...art.body]),
    lid: paint(art.lid),
    seam: 1 + art.lid.length,
    inside: 1 + art.lidOpen.length + art.mouth.length - 1
  };
  sprites.set(id, made);
  return made;
}

const relics = new Map<string, Pixels>();

function relicOf(item: ReelRelic): Pixels {
  const key = `${item.slot}:${item.base ?? 0}:${item.rarity}:${item.forge}:${item.named ?? ""}`;
  let pixels = relics.get(key);
  if (!pixels) {
    pixels = renderRelic(item.slot, item.base ?? 0, item.rarity, item.forge, item.named);
    relics.set(key, pixels);
  }
  return pixels;
}

/**
 * Copies `source` with its top left at (dx, dy), skipping the rows from `below` down; with
 * `fade`, the rows near the top of the grid keep fewer and fewer of their pixels, in the
 * ordered pattern.
 */
function stamp(target: Pixels, source: Pixels, dx: number, dy: number, below = Infinity, fade = 0) {
  for (let y = 0; y < source.h; y += 1) {
    if (dy + y >= below) break;
    for (let x = 0; x < source.w; x += 1) {
      const from = y * source.w + x;
      if (source.idx[from] === EMPTY) continue;
      if (dy + y < fade && bayer(dx + x, dy + y) >= (dy + y) / fade) continue;
      setPixel(target, dx + x, dy + y, source.idx[from], 255, source.emit[from]);
    }
  }
}

function light(target: Pixels, x: number, y: number, pal: Pal) {
  setPixel(target, Math.round(x), Math.round(y), pal, 255, 1);
}

/**
 * A ring of light one pixel wide around (cx, cy). `dither` keeps every other pixel of it
 * (2) or one in four (4), in a fixed pattern, so a ring thins out instead of fading.
 */
function ring(target: Pixels, cx: number, cy: number, radius: number, pal: Pal, dither: 1 | 2 | 4) {
  const reach = Math.ceil(radius) + 1;
  for (let y = Math.max(0, Math.floor(cy - reach)); y <= Math.min(target.h - 1, Math.ceil(cy + reach)); y += 1) {
    for (let x = Math.max(0, Math.floor(cx - reach)); x <= Math.min(target.w - 1, Math.ceil(cx + reach)); x += 1) {
      if (Math.abs(Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) - radius) > 0.55) continue;
      if (dither === 2 && (x + y) % 2 !== 0) continue;
      if (dither === 4 && ((x + y) % 4 !== 0 || x % 2 !== 0)) continue;
      light(target, x, y, pal);
    }
  }
}

/** A ring going out from a knock or the burst: bright and whole, then cooler and thinner. */
function wave(target: Pixels, cx: number, cy: number, age: number, life: number, speed: number, ramp: readonly Pal[]) {
  if (age < 0 || age >= life) return;
  const share = age / life;
  const top = ramp.length - 1;
  const pal = share < 0.25 ? C.moon : ramp[Math.max(0, top - Math.floor(share * 3))];
  ring(target, cx, cy, 3 + age * speed, pal, share < 0.4 ? 1 : share < 0.7 ? 2 : 4);
}

/**
 * Sparks thrown up out of the chest when the lid bursts: each its own angle, speed and life,
 * from a hash of its number, falling back under their weight and blinking out at the end.
 */
function sparks(target: Pixels, x: number, y: number, age: number, ramp: readonly Pal[], count: number) {
  const top = ramp.length - 1;
  for (let index = 0; index < count; index += 1) {
    const life = 0.45 + hash2(index, 1, 71) * 0.45;
    if (age >= life) continue;
    if (age / life > 0.75 && Math.floor(age * OPENING_FPS) % 2 === 0) continue;
    const vx = (hash2(index, 2, 71) - 0.5) * 110;
    const vy = -45 - hash2(index, 3, 71) * 75;
    const px = x + vx * age;
    const py = y + vy * age + 0.5 * 150 * age * age;
    light(target, px, py, index % 3 === 0 ? C.moon : ramp[index % 3 === 1 ? top : Math.max(0, top - 1)]);
  }
}

/**
 * The column of light out of the open chest, from its inside up through the top of the grid:
 * it opens wide in a blink, then narrows to nothing. White at the heart, the rarity's color
 * around it, its edge every other pixel.
 */
function beam(target: Pixels, bottom: number, age: number, ramp: readonly Pal[]) {
  if (age >= BEAM) return;
  const half = age < 0.1 ? 3 + (age / 0.1) * 9 : 12 * (1 - (age - 0.1) / (BEAM - 0.1));
  if (half < 0.5) return;
  const top = ramp.length - 1;
  for (let x = 0; x < target.w; x += 1) {
    const d = Math.abs(x - MIDDLE) - 0.5;
    if (d >= half) continue;
    const share = d / half;
    const pal = share < 0.3 ? C.moon : share < 0.65 ? ramp[top] : ramp[Math.max(0, top - 1)];
    for (let y = 0; y <= bottom; y += 1) {
      if (share >= 0.65 && (x + y) % 2 !== 0) continue;
      light(target, x, y, pal);
    }
  }
}

/** Dust thrown out at the chest's feet as it lands. */
function dust(target: Pixels, age: number) {
  if (age < 0 || age >= 0.3) return;
  for (let index = 0; index < 5; index += 1) {
    const reach = 2 + index * 2 + age * (18 + index * 6);
    const y = FLOOR - Math.round(hash2(index, 4, 73) * 2 + age * 6);
    const pal = index % 2 === 0 ? C.haze : C.dusk;
    setPixel(target, Math.round(CHEST_LEFT - reach), y, pal);
    setPixel(target, Math.round(CHEST_LEFT + CHEST_WIDTH - 1 + reach), y, pal);
  }
}

/**
 * The opening at `t` seconds. `still`: the risen relic holds without bobbing and no mote
 * climbs (reduced motion shows only the end).
 */
export function openingFrame(spec: OpeningSpec, t: number, still = false): Pixels {
  const out = createPixels(OPENING_WIDTH, OPENING_HEIGHT);
  const chest = chestSprites(spec.chest);
  const times = openingTimes(spec);
  const frame = Math.floor(t * OPENING_FPS);
  const left = CHEST_LEFT - 1;

  if (t < times.open) {
    const fall = t < DROP ? (1 - t / DROP) ** 2 : 0;
    const top = FLOOR + 2 - chest.closed.h - Math.round(fall * 90);
    dust(out, t - DROP);
    // The knock under way, if any: its rarity, how hard it shakes.
    let knock = -1;
    for (let index = 0; index < times.knockAt.length; index += 1) if (t >= times.knockAt[index]) knock = index;
    const seamY = top + chest.seam;
    for (let index = 0; index <= knock; index += 1) wave(out, MIDDLE, seamY, t - times.knockAt[index], RING_LIFE, 70 + index * 12, rampOf(times.knocks[index]));
    const since = knock >= 0 ? t - times.knockAt[knock] : Infinity;
    const hard = knock >= 2 ? 2 : 1;
    const dx = since < SHAKE ? (frame % 2 === 0 ? hard : -hard) : 0;
    const dy = since < SHAKE && frame % 4 === 1 ? -1 : 0;
    stamp(out, chest.closed, left + dx, top + dy);
    if (knock >= 0) {
      // The light under the lid, flickering along the seam.
      const ramp = rampOf(times.knocks[knock]);
      const lit = ramp.length - 1;
      for (let x = 3; x < CHEST_WIDTH - 1; x += 1) light(out, left + dx + x, seamY + dy, (x + frame) % 3 === 0 ? ramp[lit - 1] : since < SHAKE ? C.moon : ramp[lit]);
    }
    return out;
  }

  const age = t - times.open;
  const ramp = rampOf(spec.item.rarity);
  const lit = ramp.length - 1;
  const openTop = FLOOR + 2 - chest.open.h;
  const insideY = openTop + chest.inside;
  const relicLeft = Math.round(MIDDLE - (RELIC_SIZE - 1) / 2);
  const relicMiddle = RELIC_TOP + (RELIC_SIZE - 1) / 2;
  /** Seconds since the reel stopped (negative while it turns). */
  const found = still ? Infinity : t - times.land;
  const hold = found < REVEAL || still ? 0 : Math.floor(found / 0.6) % 2 === 0 ? 0 : -1;

  // Behind the reel: the column, the burst of the lid, then the found relic's rings of light.
  if (found >= 0) {
    const shimmer = still ? 0 : Math.floor(found / 0.4) % 2;
    ring(out, MIDDLE, relicMiddle + hold, 19 + shimmer, ramp[lit], 2);
    ring(out, MIDDLE, relicMiddle + hold, 23 - shimmer, ramp[Math.max(0, lit - 1)], 4);
  }
  if (!still) {
    beam(out, insideY, age, ramp);
    wave(out, MIDDLE, insideY, age, 0.45, 150, ramp);
    wave(out, MIDDLE, insideY, age - 0.1, 0.45, 110, ramp);
    wave(out, MIDDLE, relicMiddle, found, 0.5, 120, ramp);
    wave(out, MIDDLE, relicMiddle, found - 0.1, 0.5, 90, ramp);
  }
  if (age < LIFT && !still) {
    stamp(out, chest.lidless, left, FLOOR + 2 - chest.lidless.h);
    stamp(out, chest.lid, left, FLOOR + 2 - chest.closed.h - Math.round((age / LIFT) * 12));
  } else {
    stamp(out, chest.open, left, openTop);
  }
  // The inside of the chest burns with the light.
  for (let x = 3; x < CHEST_WIDTH - 1; x += 1) light(out, left + x, insideY, Math.abs(left + x - MIDDLE) < 5 ? C.moon : ramp[lit]);

  if (still || found >= SETTLE + CLEAR) {
    stamp(out, relicOf(spec.item), relicLeft, RELIC_TOP + hold);
  } else if (t >= times.spin) {
    // The reel climbs out of the chest's mouth: nothing of it shows below, and it thins out at the top.
    const lift = reelLift(spec, times, t, insideY);
    const relics = reelRelics(spec);
    const step = found > SETTLE ? fadeStep(1 - (found - SETTLE) / CLEAR) : 8;
    relics.forEach((relic, index) => {
      const top = Math.round(RELIC_TOP + index * REEL_PITCH - lift);
      if (top >= insideY || top + RELIC_SIZE <= 0) return;
      const shown = index === REEL_STOP ? relicOf(relic) : veil(relicOf(relic), step);
      stamp(out, shown, relicLeft, top, insideY, REEL_FADE);
    });
    // Two gold marks on either side of the middle, while the reel turns.
    if (found < SETTLE) marks(out, relicLeft, Math.round(relicMiddle));
  }
  if (!still) {
    sparks(out, MIDDLE, insideY - 1, age, ramp, 28);
    if (found >= 0) sparks(out, MIDDLE, relicMiddle, found, ramp, 20);
  }
  // Once it hangs there, motes keep climbing out of the open chest.
  if (!still && found >= REVEAL) {
    for (let index = 0; index < 6; index += 1) {
      const phase = (age * 0.5 + index / 6) % 1;
      if (phase > 0.8 && frame % 2 === 0) continue;
      const x = left + 4 + Math.floor(hash2(index, Math.floor(age * 0.5 + index / 6), 79) * (CHEST_WIDTH - 6));
      light(out, x, insideY - 2 - phase * 30, index % 2 === 0 ? ramp[lit] : ramp[Math.max(0, lit - 1)]);
    }
  }
  // A reel full of relics would spend too many colors: the scene keeps its palette.
  return applyColors(out, reduceColors(out, SCENE_COLORS));
}

/** A gold arrowhead on each side of the reel's middle, pointing at it. */
function marks(target: Pixels, relicLeft: number, middle: number) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = 0; dx < 3 - Math.abs(dy); dx += 1) {
      const pal = dx === 0 ? C.gold : C.goldLight;
      light(target, relicLeft - 5 + dx, middle + dy, pal);
      light(target, relicLeft + RELIC_SIZE + 4 - dx, middle + dy, pal);
    }
  }
}
