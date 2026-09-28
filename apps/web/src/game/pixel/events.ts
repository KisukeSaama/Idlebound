/**
 * How the events of the Long Night look in the arena (BIBLE 13): the Seam's crack of pale
 * light, the Quiet's grey world, the Unfinished half drawn, the King's Eclipse, and the
 * lanterns of a Remembrance Night. Pure and deterministic: indexed pixels, solid colors
 * only, integer hashing and ordered dithering, never Math.random. The arena caches what
 * these give and turns it into surfaces.
 */
import { C, palLuma, type Pal } from "@idlebound/game/art";
import { bayer, clonePixels, createPixels, EMPTY, hash2, setPixel, valueNoise, type Pixels } from "./pixels";
import type { Scene } from "./scene";

// ---------------------------------------------------------------- the Quiet

/** The night's own greys, darkest first: the ramp the Quiet is drawn in. */
export const GREYS: readonly Pal[] = [C.ink, C.night1, C.night2, C.night3, C.night4, C.dusk, C.haze, C.lilac, C.pale, C.moon];

/** Every palette entry mapped to the grey nearest to it in lightness. */
export const GREY_TABLE: Uint8Array = (() => {
  const table = new Uint8Array(256);
  for (let pal = 0; pal < 256; pal += 1) {
    if (pal === EMPTY || pal >= 64) {
      table[pal] = pal;
      continue;
    }
    const luma = palLuma(pal);
    let best: Pal = GREYS[0];
    for (const grey of GREYS) if (Math.abs(palLuma(grey) - luma) < Math.abs(palLuma(best) - luma)) best = grey;
    table[pal] = best;
  }
  return table;
})();

/** A buffer in greys only, its lights too: while the Quiet stands, nothing keeps its color. */
export function greyPixels(source: Pixels): Pixels {
  const out = clonePixels(source);
  for (let at = 0; at < out.idx.length; at += 1) if (out.idx[at] !== EMPTY) out.idx[at] = GREY_TABLE[out.idx[at]];
  return out;
}

/** A whole scene in greys: its layers, its sky, its lights and its stone. */
export function greyScene(scene: Scene): Scene {
  const grey = (pal: Pal) => GREY_TABLE[pal];
  return {
    ...scene,
    layers: scene.layers.map((layer) => ({ ...layer, frames: layer.frames.map(greyPixels) })),
    skyTop: grey(scene.skyTop),
    light: scene.light ? { ...scene.light, color: grey(scene.light.color) } : null,
    shadow: grey(scene.shadow),
    twinkleDim: grey(scene.twinkleDim),
    milestone: scene.milestone ? { ...scene.milestone, off: greyPixels(scene.milestone.off), on: greyPixels(scene.milestone.on) } : undefined
  };
}

// ---------------------------------------------------------------- the King's Eclipse

/** The darkest steps of the night, which an eclipsed King is drawn in. */
const ECLIPSE_STEPS: readonly Pal[] = [C.ink, C.night1, C.night2, C.night3];

/** A body in shadow: every color to the darkest steps by lightness; the eyes keep their light. */
export function eclipsePixels(source: Pixels): Pixels {
  const out = clonePixels(source);
  for (let at = 0; at < out.idx.length; at += 1) {
    if (out.idx[at] === EMPTY || out.emit[at]) continue;
    const luma = palLuma(out.idx[at]);
    out.idx[at] = ECLIPSE_STEPS[luma < 40 ? 0 : luma < 90 ? 1 : luma < 150 ? 2 : 3];
  }
  return out;
}

/**
 * The dark ring behind an eclipsed King: a band of ink, dithered in regular steps on both
 * edges, and a dotted rim of dusk just outside, like the last of a light behind it.
 */
export function eclipseRing(radius: number): Pixels {
  const size = radius * 2 + 7;
  const center = (size - 1) / 2;
  const out = createPixels(size, size);
  const band = Math.max(3, Math.round(radius * 0.18));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const d = Math.round(Math.hypot(x - center, y - center));
      const inner = radius - band;
      if (d > inner && d < radius) setPixel(out, x, y, C.ink);
      else if ((d === radius || d === inner) && (x + y) % 2 === 0) setPixel(out, x, y, C.ink);
      else if (d === inner - 1 && bayer(x, y) < 0.25) setPixel(out, x, y, C.ink);
      else if (d === radius + 2 && (x + y) % 2 === 0) setPixel(out, x, y, C.dusk, 255, 1);
    }
  }
  return out;
}

// ---------------------------------------------------------------- the Seam

/** Pixels of glow around the crack, how far its zigzag strays from the middle, and its seed. */
const SEAM_GLOW = 8;
const SEAM_STRAY = 4;
const SEAM_SEED = 8101;

/**
 * The Seam: a vertical crack of pale light, `length` rows long, with regular dithered
 * rings of glow around it. `frame` 0 or 1 is its flicker (the rings breathe by a pixel);
 * `open` from 0 to 1 is how much of it is open (it closes toward its middle).
 */
export function seamPixels(length: number, frame: number, open: number): Pixels {
  const w = (SEAM_GLOW + SEAM_STRAY) * 2 + 5;
  const h = length + SEAM_GLOW * 2;
  const out = createPixels(w, h);
  const mid = Math.floor(length / 2);
  const half = Math.round((Math.max(0, Math.min(1, open)) * length) / 2);
  if (half <= 0) return out;
  const center = Math.floor(w / 2);
  // The crack's path: a zigzag of short diagonal runs, each leaning one way for a few rows,
  // the same on every device.
  const core: { x: number; y: number; width: number }[] = [];
  let offset = 0;
  let lean = 0;
  for (let y = 0; y < length; y += 1) {
    if (y % 4 === 0) {
      const turn = hash2(Math.floor(y / 4), 0, SEAM_SEED);
      lean = offset >= SEAM_STRAY - 1 ? -1 : offset <= 1 - SEAM_STRAY ? 1 : turn < 0.4 ? -1 : turn > 0.6 ? 1 : 0;
    }
    if (y % 2 === 0) offset = Math.max(-SEAM_STRAY, Math.min(SEAM_STRAY, offset + lean));
    const from = Math.abs(y - mid);
    if (from > half) continue;
    const taper = from / Math.max(1, half);
    core.push({ x: center + offset, y: y + SEAM_GLOW, width: taper < 0.7 ? 3 : 1 });
  }
  // Glow: concentric rings, each a sparser regular pattern than the one inside it.
  const grow = frame % 2;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let best = Infinity;
      for (const point of core) {
        const d = (point.x - x) ** 2 + (point.y - y) ** 2;
        if (d < best) best = d;
      }
      const d = Math.sqrt(best);
      if (d <= 2 + grow) {
        if ((x + y) % 2 === 0) setPixel(out, x, y, C.lilac, 255, 1);
      } else if (d <= 4 + grow) {
        if (bayer(x, y) < 0.25) setPixel(out, x, y, C.haze, 255, 1);
      } else if (d <= 6 + grow && bayer(x, y) < 0.0625) setPixel(out, x, y, C.haze, 255, 1);
    }
  }
  // The crack itself: white at the heart, pale at the sides, a single thread at its ends.
  for (const point of core) {
    if (point.width === 3) {
      setPixel(out, point.x - 1, point.y, C.pale, 255, 1);
      setPixel(out, point.x + 1, point.y, C.pale, 255, 1);
    }
    setPixel(out, point.x, point.y, point.width === 3 ? C.moon : C.pale, 255, 1);
  }
  return out;
}

/** Top of the crack's buffer above its first row: where to place it. */
export const SEAM_MARGIN = SEAM_GLOW;

/**
 * The crack behind a Warden `height` pixels tall: its length, and its middle's row below the
 * Warden's top. It rises well above the head and runs on into the ground at its feet.
 */
export function seamSpan(height: number): { length: number; middle: number } {
  return { length: Math.round(height * 1.4), middle: Math.round(height * 0.4) };
}

// ---------------------------------------------------------------- the Unfinished

/** Share of an Unfinished's body drawn at this much of its life left: half, then all of it. */
export function unfinishedShare(hp: number, maxHp: number): number {
  const damage = maxHp > 0 ? 1 - Math.max(0, Math.min(1, hp / maxHp)) : 1;
  return 0.5 + 0.5 * damage;
}

/** Steps the share is counted in, so the drawing fills in without a new frame at every hit. */
export const UNFINISHED_STEPS = 48;

/** A pixel is inside the silhouette when its four neighbors are drawn too. */
function interior(source: Pixels, at: number): boolean {
  const { w, h } = source;
  const x = at % w;
  const y = (at - x) / w;
  if (x === 0 || y === 0 || x === w - 1 || y === h - 1) return false;
  return source.idx[at - 1] !== EMPTY && source.idx[at + 1] !== EMPTY && source.idx[at - w] !== EMPTY && source.idx[at + w] !== EMPTY;
}

/**
 * The order an Unfinished's inside is drawn in: patches first (a slow noise), their edges
 * in a regular dither, the same for the same pixels and seed. Returns the interior pixels.
 */
export function unfinishedOrder(source: Pixels, seed: number): Int32Array {
  const cells: { at: number; rank: number }[] = [];
  for (let at = 0; at < source.idx.length; at += 1) {
    if (source.idx[at] === EMPTY || source.emit[at] || !interior(source, at)) continue;
    const x = at % source.w;
    const y = (at - x) / source.w;
    cells.push({ at, rank: valueNoise(x, y, 5, seed) * 0.75 + bayer(x, y) * 0.25 });
  }
  cells.sort((a, b) => a.rank - b.rank || a.at - b.at);
  return Int32Array.from(cells, (cell) => cell.at);
}

/**
 * An Unfinished at a share of its body: its outline and eyes always, its inside drawn in
 * `order` up to `share`; the rest not drawn yet (the scene shows through).
 */
export function unfinishedPixels(source: Pixels, order: Int32Array, share: number): Pixels {
  const out = clonePixels(source);
  const shown = Math.round(Math.max(0, Math.min(1, share)) * order.length);
  for (let index = shown; index < order.length; index += 1) {
    const at = order[index];
    out.idx[at] = EMPTY;
    out.alpha[at] = 0;
    out.emit[at] = 0;
  }
  return out;
}

// ---------------------------------------------------------------- Remembrance Nights

/** A lantern: its dark frame, amber panes, a white flame at the heart, a spark below. */
const LANTERN = ["..k..", ".kkk.", "kagak", "kgwgk", "kgwgk", "kagak", ".kkk.", "..e.."];

/** Row of the string at `u` (0 at the view's edge, 1 at the end of its reach). */
const sagAt = (u: number) => 1 + Math.round(36 * u * u * (1 - u));
/** Rows of the garland buffer: the sag, the longest cord, the lantern and its halo. */
const GARLAND_HEIGHT = 30;

/** Where the lanterns hang on a view `width` wide: the upper corners, never over the middle. */
export function lanternPlaces(width: number): { x: number; y: number; cord: number }[] {
  const reach = Math.floor(width * 0.3);
  const places: { x: number; y: number; cord: number }[] = [];
  [0.4, 0.8].forEach((u, index) => {
    const x = Math.round(reach * u);
    const y = sagAt(x / Math.max(1, reach));
    const cord = 3 + index * 3;
    places.push({ x, y, cord });
    places.push({ x: width - 1 - x, y, cord: cord + 1 });
  });
  return places;
}

/**
 * The garland of a Remembrance Night, `width` wide: a sagging string from each edge of the
 * view to its outer third, small lit lanterns on short cords, each in a dotted halo of
 * gold. `frame` 0 or 1 is the flames' flicker.
 */
export function remembrancePixels(width: number, frame: number): Pixels {
  const out = createPixels(width, GARLAND_HEIGHT);
  const reach = Math.floor(width * 0.3);
  // The strings: a gentle sag, from the edge to the outer third, on both sides.
  for (let x = 0; x <= reach; x += 1) {
    const y = sagAt(x / Math.max(1, reach));
    setPixel(out, x, y, C.haze);
    setPixel(out, width - 1 - x, y, C.haze);
  }
  const flicker = frame % 2;
  for (const place of lanternPlaces(width)) {
    const top = place.y + place.cord;
    const cx = place.x;
    const cy = top + 4;
    // The halo first: two rings of dots, the outer sparser, the lantern drawn over them.
    for (let y = cy - 8; y <= cy + 8; y += 1) {
      for (let x = cx - 8; x <= cx + 8; x += 1) {
        const d = Math.round(Math.hypot(x - cx, y - cy));
        if (d === 6 && (x + y + flicker) % 2 === 0) setPixel(out, x, y, C.gold, 255, 1);
        else if (d === 8 && (x + 2 * y) % 4 === 0) setPixel(out, x, y, C.goldDark, 255, 1);
      }
    }
    for (let y = place.y + 1; y < top; y += 1) setPixel(out, cx, y, C.haze);
    LANTERN.forEach((row, dy) => {
      for (let dx = 0; dx < row.length; dx += 1) {
        const key = row[dx];
        const pal = key === "k" ? C.goldInk : key === "a" ? (flicker ? C.gold : C.amber) : key === "g" ? C.goldLight : key === "w" ? (flicker ? C.goldLight : C.moon) : key === "e" ? C.ember : EMPTY;
        if (pal !== EMPTY) setPixel(out, cx - 2 + dx, top + dy, pal, 255, key === "k" ? 0 : 1);
      }
    });
  }
  return out;
}
