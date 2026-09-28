/**
 * Indexed pixel buffers: the working surface of the whole generator. A pixel is a palette
 * index into the Orvane 64 (EMPTY when transparent), an alpha, and an emissive flag (eyes,
 * glows) that era palettes and hit flashes never touch. Only `toRgba` turns it into colors.
 *
 * Everything here is pure and deterministic: integer hashing and plain arithmetic, no
 * Math.random, no trigonometry, so the same recipe gives the same pixels on every engine.
 */
import { palRgb, type Pal } from "@idlebound/game/art";

export const EMPTY = 255;

export interface Pixels {
  w: number;
  h: number;
  /** Palette index per pixel, EMPTY when nothing is drawn. */
  idx: Uint8Array;
  /** Opacity per pixel, 0 to 255 (255 for almost everything). */
  alpha: Uint8Array;
  /** 1 on light-giving pixels. */
  emit: Uint8Array;
}

export interface Bitmap {
  w: number;
  h: number;
  /** RGBA, row by row (ImageData layout). */
  data: Uint8ClampedArray<ArrayBuffer>;
}

export function createPixels(w: number, h: number): Pixels {
  return { w, h, idx: new Uint8Array(w * h).fill(EMPTY), alpha: new Uint8Array(w * h), emit: new Uint8Array(w * h) };
}

export function clonePixels(source: Pixels): Pixels {
  return { w: source.w, h: source.h, idx: source.idx.slice(), alpha: source.alpha.slice(), emit: source.emit.slice() };
}

export function setPixel(target: Pixels, x: number, y: number, pal: Pal, alpha = 255, emit = 0) {
  if (x < 0 || y < 0 || x >= target.w || y >= target.h) return;
  const at = y * target.w + x;
  target.idx[at] = pal;
  target.alpha[at] = alpha;
  target.emit[at] = emit;
}

/** Copies `source` onto `target` at (dx, dy), transparent pixels skipped. */
export function blit(target: Pixels, source: Pixels, dx: number, dy: number) {
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const from = y * source.w + x;
      if (source.idx[from] === EMPTY) continue;
      setPixel(target, x + dx, y + dy, source.idx[from], source.alpha[from], source.emit[from]);
    }
  }
}

/** Colors of a buffer, ready for `ImageData`. */
export function toRgba(source: Pixels): Bitmap {
  const data = new Uint8ClampedArray(source.w * source.h * 4);
  for (let at = 0; at < source.idx.length; at += 1) {
    const pal = source.idx[at];
    if (pal === EMPTY) continue;
    const [r, g, b] = palRgb(pal);
    data[at * 4] = r;
    data[at * 4 + 1] = g;
    data[at * 4 + 2] = b;
    data[at * 4 + 3] = source.alpha[at];
  }
  return { w: source.w, h: source.h, data };
}

/** Bounding box of the drawn pixels, or null when the buffer is empty. */
export function bounds(source: Pixels): { x: number; y: number; w: number; h: number } | null {
  let minX = source.w;
  let minY = source.h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      if (source.idx[y * source.w + x] === EMPTY) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/** Integer hash of a position and a seed, in [0, 1). */
export function hash2(x: number, y: number, seed: number): number {
  let h = Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul(seed | 0, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smooth value noise in [0, 1): hashed lattice every `cell` pixels, bilinear in between. */
export function valueNoise(x: number, y: number, cell: number, seed: number, period = 0): number {
  const gx = Math.floor(x / cell);
  const gy = Math.floor(y / cell);
  const fx = (x - gx * cell) / cell;
  const fy = (y - gy * cell) / cell;
  const wrap = (value: number) => (period > 0 ? ((value % period) + period) % period : value);
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(wrap(gx), gy, seed);
  const b = hash2(wrap(gx + 1), gy, seed);
  const c = hash2(wrap(gx), gy + 1, seed);
  const d = hash2(wrap(gx + 1), gy + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

/** 4 × 4 ordered dithering threshold at a pixel, in [0, 1). */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export function bayer(x: number, y: number): number {
  return (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
}

/** FNV-1a hash of the colors of a bitmap: the snapshot of a sprite in tests. */
export function hashBitmap(bitmap: Bitmap): string {
  let h = 0x811c9dc5;
  h = Math.imul(h ^ bitmap.w, 0x01000193);
  h = Math.imul(h ^ bitmap.h, 0x01000193);
  for (let at = 0; at < bitmap.data.length; at += 1) h = Math.imul(h ^ bitmap.data[at], 0x01000193);
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** Most colors a sprite may use (BIBLE 18.3: 4 to 12 colors per sprite). */
export const MAX_COLORS = 12;

/**
 * The palette reduction of a sprite: the least used colors merge into their nearest kept
 * neighbor until `max` remain. Returns a table (palette index to palette index) so every
 * frame of an animation shares the same reduction and nothing flickers.
 */
export function reduceColors(source: Pixels, max = MAX_COLORS): Uint8Array {
  const table = new Uint8Array(256);
  for (let index = 0; index < 256; index += 1) table[index] = index;
  // Light (eyes, flames) is never merged away; it counts against the budget.
  const counts = new Map<number, number>();
  const lights = new Set<number>();
  for (let at = 0; at < source.idx.length; at += 1) {
    const pal = source.idx[at];
    if (pal === EMPTY) continue;
    if (source.emit[at]) lights.add(pal);
    else counts.set(pal, (counts.get(pal) ?? 0) + 1);
  }
  const kept = new Set(counts.keys());
  const total = () => kept.size + [...lights].filter((pal) => !kept.has(pal)).length;
  while (total() > max && kept.size > 4) {
    let weakest = -1;
    let fewest = Infinity;
    for (const pal of kept) {
      const count = counts.get(pal) ?? 0;
      if (count < fewest || (count === fewest && pal > weakest)) {
        weakest = pal;
        fewest = count;
      }
    }
    kept.delete(weakest);
    const [r, g, b] = palRgb(weakest);
    let nearest = -1;
    let best = Infinity;
    for (const pal of kept) {
      const [pr, pg, pb] = palRgb(pal);
      const distance = 2 * (pr - r) ** 2 + 4 * (pg - g) ** 2 + 3 * (pb - b) ** 2;
      if (distance < best || (distance === best && pal < nearest)) {
        nearest = pal;
        best = distance;
      }
    }
    counts.set(nearest, (counts.get(nearest) ?? 0) + fewest);
    for (let index = 0; index < 256; index += 1) if (table[index] === weakest) table[index] = nearest;
  }
  return table;
}

/** Applies a color table to every drawn pixel but the light-giving ones. */
export function applyColors(source: Pixels, table: Uint8Array): Pixels {
  const out = clonePixels(source);
  for (let at = 0; at < out.idx.length; at += 1) if (out.idx[at] !== EMPTY && !out.emit[at]) out.idx[at] = table[out.idx[at]];
  return out;
}
