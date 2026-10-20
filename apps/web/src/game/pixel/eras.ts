/**
 * Era and Age treatments (BIBLE 18.6): how each stratum transforms a base recipe. The
 * deeper the night, the less finished the world looks. Every treatment stays inside the
 * Orvane 64 (colors are remapped to palette entries, never computed), and emissive pixels
 * (eyes, flames) are never recolored: a Remnant's eyes are always its own. Only the First
 * Mark takes some away, the thin lines of light with the other thin parts.
 */
import { C, palLuma, type CreatureRank, type MaterialId, type Pal, type ResolvedRecipe } from "@idlebound/game/art";
import { bayer, clonePixels, createPixels, EMPTY, hash2, type Pixels } from "./pixels";
import { GILDED_TABLE, GREY_TABLE, WARM_TABLE } from "./tables";

export const AGE_COUNT = 12;
export const ERAS_PER_AGE = 5;

/** Age of an era: I (0) to XII (11). */
export function ageOf(era: number): number {
  return Math.min(AGE_COUNT - 1, Math.floor(Math.max(0, era) / ERAS_PER_AGE));
}

export interface TreatContext {
  seed: number;
  /** Era within its Age, 0 to 4: each stratum goes a little further than the one above. */
  step: number;
  rank: CreatureRank;
}

export interface Treatment {
  age: number;
  era: number;
  bias?: number;
  steps?: number;
  swap?: (id: MaterialId, slot: string) => MaterialId;
  /** Color of the whole outline. */
  line?: Pal;
  halfClosed?: boolean;
  /** Animation speed factor (Age VIII: slower). */
  speed: number;
  /** Embers rise from the sprite (Ash). */
  embers?: boolean;
  /** The sprite flickers as if woven (Loom). */
  flicker?: boolean;
  post?: (pixels: Pixels, context: TreatContext) => Pixels;
}

const WARM = WARM_TABLE;
const GREY = GREY_TABLE;
const GILDED = GILDED_TABLE;

function remap(source: Pixels, table: readonly Pal[], when: (x: number, y: number, pal: Pal) => boolean = () => true): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      const pal = source.idx[at];
      if (pal === EMPTY || source.emit[at] || !when(x, y, pal)) continue;
      out.idx[at] = table[pal];
    }
  }
  return out;
}

/** Pixels that belong to the body (not its outline): at least 3 drawn neighbors. */
function interior(source: Pixels, x: number, y: number): boolean {
  const { w, h, idx } = source;
  if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) return false;
  const at = y * w + x;
  return idx[at - w] !== EMPTY && idx[at - 1] !== EMPTY && idx[at + 1] !== EMPTY && idx[at + w] !== EMPTY;
}

/**
 * Echo: a ghost copy one pixel behind, up and to the right. Where it shows past the body it
 * is a checker of cold dusk, never a translucent pixel: the eye mixes it with the night.
 */
function echo(source: Pixels): Pixels {
  const out = clonePixels(source);
  const { w, h } = source;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const from = y * w + x;
      const tx = x + 1;
      const ty = y - 1;
      if (source.idx[from] === EMPTY || tx >= w || ty < 0) continue;
      const to = ty * w + tx;
      if (source.idx[to] !== EMPTY || ((tx + ty) & 1) === 1) continue;
      out.idx[to] = palLuma(source.idx[from]) > 70 ? C.amethyst : C.dusk;
      out.alpha[to] = 255;
    }
  }
  return out;
}

/** Ash: warm ramps, and embers caught on the upper edges at a steady step, ember and amber in turn. */
function ash(source: Pixels, { seed }: TreatContext): Pixels {
  const out = remap(source, WARM);
  const gap = 5;
  const phase = seed % gap;
  for (let y = 1; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      if (source.idx[at] === EMPTY || source.idx[at - source.w] !== EMPTY || (x + phase) % gap !== 0) continue;
      out.idx[at] = Math.floor((x + phase) / gap) % 2 === 0 ? C.ember : C.amber;
      out.emit[at] = 1;
    }
  }
  return out;
}

/**
 * Void: round pieces of the body taken away, cut clean: discs of the dark beneath the
 * world, a star in them, a pale ring along each cut. Placed where they fit whole inside
 * the body, clear of the eyes.
 */
function voidHoles(source: Pixels, { seed }: TreatContext): Pixels {
  const out = clonePixels(source);
  const { w, h } = source;
  const r = Math.max(2, Math.round(Math.min(w, h) * 0.07));
  const solid = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && source.idx[y * w + x] !== EMPTY && !source.emit[y * w + x];
  const fits = (cx: number, cy: number) => {
    for (let y = -r - 2; y <= r + 2; y += 1) for (let x = -r - 2; x <= r + 2; x += 1) if (x * x + y * y <= (r + 2) ** 2 && !solid(cx + x, cy + y)) return false;
    return true;
  };
  const placed: [number, number][] = [];
  for (let attempt = 0; attempt < 400 && placed.length < 2; attempt += 1) {
    const cx = Math.floor(hash2(attempt, 1, seed + 5) * w);
    const cy = Math.floor(hash2(attempt, 2, seed + 5) * h);
    if (!fits(cx, cy) || placed.some(([px, py]) => (px - cx) ** 2 + (py - cy) ** 2 < (r * 3) ** 2)) continue;
    placed.push([cx, cy]);
  }
  for (const [cx, cy] of placed) {
    for (let y = -r - 1; y <= r + 1; y += 1) {
      for (let x = -r - 1; x <= r + 1; x += 1) {
        const d = Math.sqrt(x * x + y * y);
        if (d > r + 0.9) continue;
        const at = (cy + y) * w + cx + x;
        out.idx[at] = d > r - 0.1 ? C.pale : x === -1 && y === -1 ? C.lilac : C.ink;
      }
    }
  }
  return out;
}

/**
 * A patch of sky, laid like tiles (each row of tiles shifted by half): `O` a bright star,
 * a digit a small star that shows from that era of its Age on. The deeper the stratum,
 * the fuller the field; the same stars every time.
 */
const STAR_TILE = [
  "................",
  "..0........3....",
  "........1.......",
  "....O...........",
  "............0...",
  "..2.......4.....",
  "......0.........",
  "...........O....",
  ".1..............",
  "........2...3...",
  "...4..0.........",
  "................"
];
const TILE_W = STAR_TILE[0].length;
const TILE_H = STAR_TILE.length;
/** The tile as numbers: 0 nothing, 9 a bright star, 1 + n a small star from era n of the Age. */
const STAR_CELLS = Uint8Array.from(STAR_TILE.join(""), (key) => (key === "O" ? 9 : key === "." ? 0 : 1 + Number(key)));

function starCell(x: number, y: number, seed: number): number {
  const ty = y + TILE_H + (seed % TILE_H);
  const row = (ty / TILE_H) | 0;
  const tx = x + TILE_W + ((seed >> 4) % TILE_W) + (row & 1 ? TILE_W >> 1 : 0);
  return STAR_CELLS[(ty % TILE_H) * TILE_W + (tx % TILE_W)];
}

/** The star at `x`, `y`: 0 none, 1 a small star, 2 a bright one, 3 a point of a bright star's cross. */
function starAt(x: number, y: number, step: number, seed: number): 0 | 1 | 2 | 3 {
  const here = starCell(x, y, seed);
  if (here === 9) return 2;
  if (here !== 0 && here - 1 <= step) return 1;
  return starCell(x + 1, y, seed) === 9 || starCell(x - 1, y, seed) === 9 || starCell(x, y + 1, seed) === 9 || starCell(x, y - 1, seed) === 9 ? 3 : 0;
}

/** Astral: small stars inside the body, set in a regular field. */
function astral(source: Pixels, { seed }: TreatContext): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      if (source.idx[at] === EMPTY || source.emit[at] || !interior(source, x, y)) continue;
      const star = starAt(x, y, 0, seed + 21);
      if (star === 0 || star === 3) continue;
      out.idx[at] = star === 2 ? C.moon : C.shardLight;
      out.emit[at] = 1;
    }
  }
  return out;
}

/** Hallowed: gilded highlights, a halo, a column of light behind the great ones. */
function hallowed(source: Pixels, { rank, step }: TreatContext): Pixels {
  const gilded = remap(source, GILDED, (_x, _y, pal) => palLuma(pal) > 120);
  const out = createPixels(source.w, source.h);
  let top = source.h;
  let left = source.w;
  let right = 0;
  for (let at = 0; at < source.idx.length; at += 1) {
    if (source.idx[at] === EMPTY) continue;
    const x = at % source.w;
    top = Math.min(top, Math.floor(at / source.w));
    left = Math.min(left, x);
    right = Math.max(right, x);
  }
  const center = Math.round((left + right) / 2);
  if (rank === "guardian" || rank === "king" || rank === "elite") {
    const half = Math.max(2, Math.round((right - left) * (0.14 + step * 0.03)));
    for (let y = 0; y < source.h; y += 1) {
      for (let x = center - half; x <= center + half; x += 1) {
        if (x < 0 || x >= source.w || bayer(x, y) > 0.35 - (y / source.h) * 0.2) continue;
        const at = y * source.w + x;
        out.idx[at] = C.goldDark;
        out.alpha[at] = 255;
      }
    }
  }
  for (let at = 0; at < gilded.idx.length; at += 1) {
    if (gilded.idx[at] === EMPTY) continue;
    out.idx[at] = gilded.idx[at];
    out.alpha[at] = gilded.alpha[at];
    out.emit[at] = gilded.emit[at];
  }
  // The halo: a thin ring floating above the head.
  const radius = Math.max(3, Math.round(source.w / (13 - step)));
  const cy = top - 3;
  for (let dx = -radius; dx <= radius; dx += 1) {
    const edge = Math.round(Math.sqrt(Math.max(0, radius * radius - dx * dx)) / 3);
    for (const dy of [-edge, edge]) {
      const x = center + dx;
      const y = cy + dy;
      if (x < 0 || y < 0 || x >= source.w || y >= source.h) continue;
      const at = y * source.w + x;
      out.idx[at] = C.goldLight;
      out.alpha[at] = 255;
      out.emit[at] = 1;
    }
  }
  return out;
}

/**
 * Stars: the body turns to night glass (two deep blues woven in a checker, the lighter pair
 * where the body was light) and fills with a star field that thickens era by era.
 */
function starry(source: Pixels, { seed, step }: TreatContext): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      if (source.idx[at] === EMPTY || source.emit[at] || !interior(source, x, y)) continue;
      const star = starAt(x, y, step, seed + 31);
      out.alpha[at] = 255;
      if (star === 1 || star === 2) {
        out.idx[at] = star === 2 ? C.moon : C.shardLight;
        out.emit[at] = 1;
      } else if (star === 3) {
        out.idx[at] = C.shard;
      } else {
        const odd = ((x + y) & 1) === 1;
        out.idx[at] = palLuma(source.idx[at]) > 90 ? (odd ? C.vault3 : C.vault2) : odd ? C.vault1 : C.vaultNight;
      }
    }
  }
  return out;
}

/** Lengths of the loose ends, thread after thread: some hang, some do not. */
const LOOSE = [0, 4, 2, 0, 6, 3, 0, 5];

/**
 * Loom: vertical threads through everything at a steady spacing, closer era by era, some
 * hanging loose below the body and rising above it, the upper ends dotted where they fray.
 */
function woven(source: Pixels, { seed, step }: TreatContext): Pixels {
  const out = clonePixels(source);
  let top = source.h;
  let bottom = 0;
  for (let at = 0; at < source.idx.length; at += 1) {
    if (source.idx[at] === EMPTY) continue;
    const y = Math.floor(at / source.w);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  }
  const gap = 14 - step * 2;
  const phase = seed % gap;
  for (let x = 0; x < source.w; x += 1) {
    if ((x + phase) % gap !== 0) continue;
    const loose = LOOSE[(Math.floor((x + phase) / gap) + seed) % LOOSE.length];
    let touched = false;
    for (let y = 0; y < source.h; y += 1) {
      const at = y * source.w + x;
      if (source.idx[at] !== EMPTY) {
        touched = true;
        if (!source.emit[at]) out.idx[at] = (y & 1) === 0 ? C.pale : C.lilac;
      }
    }
    if (!touched || loose === 0) continue;
    for (let y = bottom + 1; y <= Math.min(source.h - 1, bottom + loose); y += 1) {
      const at = y * source.w + x;
      out.idx[at] = C.lilac;
      out.alpha[at] = 255;
    }
    for (let y = Math.max(0, top - loose); y < top; y += 1) {
      if (((top - y) & 1) === 0) continue;
      const at = y * source.w + x;
      out.idx[at] = C.lilac;
      out.alpha[at] = 255;
    }
  }
  return out;
}

/** A charcoal smudge: a short stroke of the thumb, down and to the right. */
const SMUDGE = ["##..", ".###", "..##"];

/** True where a smudge falls: one per cell of a staggered grid, the cells smaller era by era. */
function smudged(x: number, y: number, step: number, seed: number): boolean {
  const cw = 16 - step * 2;
  const ch = 10 - step;
  const row = Math.floor((y + (seed % ch)) / ch);
  const sx = (x + (row & 1 ? cw >> 1 : 0) + (seed % cw)) % cw;
  const sy = (y + (seed % ch)) % ch;
  return sy < SMUDGE.length && sx < SMUDGE[0].length && SMUDGE[sy][sx] === "#";
}

/** Draft: paper and charcoal, cross-hatching where the shading was, a few lilac smudges. */
function sketched(source: Pixels, { seed, step }: TreatContext): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      const pal = source.idx[at];
      if (pal === EMPTY || source.emit[at]) continue;
      if (!interior(source, x, y)) {
        out.idx[at] = C.night3;
        continue;
      }
      const luma = palLuma(pal);
      let color: Pal = C.paper;
      if (luma < 110 && (x + y) % 3 === 0) color = C.haze;
      if (luma < 60 && (x - y + 300) % 3 === 0) color = C.haze;
      if (smudged(x, y, step, seed + 51)) color = C.lilac;
      out.idx[at] = color;
    }
  }
  return out;
}

/** 3 × 5 runes of no known alphabet: the Words fill every silhouette with writing. */
export const RUNES: readonly (readonly number[])[] = [
  [0b010, 0b111, 0b010, 0b010, 0b010],
  [0b110, 0b101, 0b110, 0b100, 0b100],
  [0b111, 0b001, 0b010, 0b100, 0b111],
  [0b101, 0b101, 0b111, 0b001, 0b001],
  [0b011, 0b100, 0b010, 0b001, 0b110],
  [0b111, 0b101, 0b101, 0b101, 0b111],
  [0b100, 0b110, 0b101, 0b110, 0b100],
  [0b010, 0b101, 0b010, 0b101, 0b010]
];

const RUNE_INK = [C.goldLight, C.pale, C.shardLight, C.essenceLight, C.amber];

function worded(source: Pixels, { seed, step }: TreatContext): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      const pal = source.idx[at];
      if (pal === EMPTY || source.emit[at] || !interior(source, x, y)) continue;
      const cellX = Math.floor(x / 4);
      const cellY = Math.floor(y / 6);
      const rune = RUNES[Math.floor(hash2(cellX, cellY, seed + 61) * RUNES.length)];
      const gx = x % 4;
      const gy = y % 6;
      const ink = gx < 3 && gy < 5 && ((rune[gy] >> (2 - gx)) & 1) === 1;
      out.idx[at] = ink ? RUNE_INK[step] : palLuma(pal) > 80 ? C.dusk : C.night2;
    }
  }
  return out;
}

/** The Room: the side facing the lamp turns warm. */
function lamplit(source: Pixels, { step }: TreatContext): Pixels {
  return remap(source, WARM, (_x, _y, pal) => palLuma(pal) > 90 - step * 12);
}

/** Unmaking: colors drain toward grey, more with every era; the outline stays. */
function drained(amount: number) {
  return (source: Pixels): Pixels => remap(source, GREY, (x, y) => bayer(x, y) < amount);
}

/**
 * Blank: the creature becomes a pen drawing on the page, the one thing still being written.
 * The ink outline holds, the body is the white of the paper, and its shadows turn to
 * hatching. Each stratum takes a little more: Pale keeps three pale tones, Faint two, then
 * only the paper and the ink's strokes, fewer with every page.
 */
function inked(step: number) {
  // Hatching: a tone darker than `sparse` gets a light stroke every 6 pixels, darker than
  // `dense` a dark one between them.
  const dense = [0, 0.25, 0.3, 0.2, 0.35][step];
  const sparse = [0, 0, 0.5, 0.45, 0.6][step];
  // The dense strokes are darker than the sparse ones; the Blank's are pencil-light, the Ink's fresh ink.
  const strokes = step === 3 ? [C.haze, C.lilac] : [C.night3, C.haze];
  return (source: Pixels): Pixels => {
    const { w, h } = source;
    let low = 255;
    let high = 0;
    for (let at = 0; at < source.idx.length; at += 1) {
      if (source.idx[at] === EMPTY || source.emit[at]) continue;
      const luma = palLuma(source.idx[at]);
      low = Math.min(low, luma);
      high = Math.max(high, luma);
    }
    const span = Math.max(1, high - low);
    const out = createPixels(w, h);
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const at = y * w + x;
        const pal = source.idx[at];
        if (pal === EMPTY) continue;
        out.alpha[at] = 255;
        if (source.emit[at]) {
          out.idx[at] = pal;
          out.emit[at] = source.emit[at];
          continue;
        }
        if (!interior(source, x, y)) {
          // The pen's line: lighter where it faces the sky, deepest underneath.
          const open = (dy: number) => y + dy < 0 || y + dy >= h || source.idx[at + dy * w] === EMPTY;
          out.idx[at] = open(-1) ? C.dusk : open(1) ? C.ink : C.night3;
          continue;
        }
        const tone = (palLuma(pal) - low) / span;
        if (step === 0) out.idx[at] = tone < 0.3 ? C.haze : tone < 0.6 ? C.lilac : C.moon;
        else if (step === 1) out.idx[at] = tone < 0.3 ? C.lilac : C.moon;
        else out.idx[at] = C.moon;
        if (step === 0) continue;
        const diagonal = (x + y) % 6;
        if (diagonal === 0 && tone < Math.max(dense, sparse)) out.idx[at] = strokes[1];
        else if (diagonal === 3 && tone < dense) out.idx[at] = strokes[0];
      }
    }
    return out;
  };
}

/** One pass of erosion (`grow` false) or dilation of a mask, by a cross or by a 3 x 3 square. */
function morph(mask: Uint8Array, w: number, h: number, grow: boolean, square: boolean): Uint8Array {
  const out = new Uint8Array(mask.length);
  const want = grow ? 1 : 0;
  for (let y = 0; y < h; y += 1) {
    const up = y > 0;
    const down = y < h - 1;
    for (let x = 0; x < w; x += 1) {
      const at = y * w + x;
      const left = x > 0;
      const right = x < w - 1;
      // Past the edge counts as empty: it erodes, it never grows.
      let hit =
        mask[at] === want ||
        (left ? mask[at - 1] === want : !grow) ||
        (right ? mask[at + 1] === want : !grow) ||
        (up ? mask[at - w] === want : !grow) ||
        (down ? mask[at + w] === want : !grow);
      if (!hit && square) {
        hit =
          (up && left ? mask[at - w - 1] === want : !grow) ||
          (up && right ? mask[at - w + 1] === want : !grow) ||
          (down && left ? mask[at + w - 1] === want : !grow) ||
          (down && right ? mask[at + w + 1] === want : !grow);
      }
      out[at] = hit ? want : 1 - want;
    }
  }
  return out;
}

/**
 * The 4-connected pieces of `cells`, each of a single value (a negative cell is empty):
 * every pixel's piece (-1 where empty) and the size of each piece.
 */
function pieces(cells: Int16Array, w: number, h: number): { piece: Int32Array; sizes: number[] } {
  const piece = new Int32Array(cells.length).fill(-1);
  const sizes: number[] = [];
  const stack: number[] = [];
  for (let start = 0; start < cells.length; start += 1) {
    if (cells[start] < 0 || piece[start] >= 0) continue;
    const id = sizes.length;
    const value = cells[start];
    let size = 0;
    piece[start] = id;
    stack.push(start);
    while (stack.length) {
      const at = stack.pop()!;
      size += 1;
      const x = at % w;
      for (const next of [x > 0 ? at - 1 : -1, x < w - 1 ? at + 1 : -1, at >= w ? at - w : -1, at + w < w * h ? at + w : -1]) {
        if (next < 0 || cells[next] !== value || piece[next] >= 0) continue;
        piece[next] = id;
        stack.push(next);
      }
    }
    sizes.push(size);
  }
  return { piece, sizes };
}

/** Clears the crumbs an opening leaves behind: pieces under a twentieth of the largest one. */
function dropCrumbs(mask: Uint8Array, w: number, h: number) {
  const { piece, sizes } = pieces(Int16Array.from(mask, (on) => (on ? 1 : -1)), w, h);
  const largest = Math.max(0, ...sizes);
  for (let at = 0; at < mask.length; at += 1) if (mask[at] && sizes[piece[at]] * 20 < largest) mask[at] = 0;
}

/**
 * The flat tones of a sprite: its body colors ordered by lightness and cut into `count`
 * groups of about as many pixels, each group taking its most used color.
 */
function flatTones(source: Pixels, count: number): Map<number, number> {
  const counts = new Map<number, number>();
  let total = 0;
  for (let at = 0; at < source.idx.length; at += 1) {
    const pal = source.idx[at];
    if (pal === EMPTY || pal === C.ink || source.emit[at]) continue;
    counts.set(pal, (counts.get(pal) ?? 0) + 1);
    total += 1;
  }
  const colors = [...counts.keys()].sort((a, b) => palLuma(a) - palLuma(b) || a - b);
  const groups: number[][] = Array.from({ length: count }, () => []);
  let seen = 0;
  for (const pal of colors) {
    const n = counts.get(pal)!;
    groups[Math.min(count - 1, Math.floor(((seen + n / 2) / total) * count))].push(pal);
    seen += n;
  }
  const tones = new Map<number, number>();
  for (const group of groups) {
    if (!group.length) continue;
    let best = group[0];
    for (const pal of group) if (counts.get(pal)! > counts.get(best)!) best = pal;
    for (const pal of group) tones.set(pal, best);
  }
  return tones;
}

/**
 * Each cell takes the value most of its neighbours within `reach` hold (empty and unknown
 * cells, below 0, give no vote); a tie keeps its own. With `unknownOnly`, only the unknown
 * cells (-2) are filled.
 */
function majority(cells: Int16Array, w: number, h: number, reach: number, kinds: number, unknownOnly = false): Int16Array {
  const out = cells.slice();
  const votes = new Int32Array(kinds);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const at = y * w + x;
      if (cells[at] === -1 || (unknownOnly && cells[at] !== -2)) continue;
      votes.fill(0);
      for (let dy = -reach; dy <= reach; dy += 1) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -reach; dx <= reach; dx += 1) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const value = cells[ny * w + nx];
          if (value >= 0) votes[value] += 1;
        }
      }
      let best = cells[at];
      for (let kind = 0; kind < kinds; kind += 1) if (votes[kind] > (best >= 0 ? votes[best] : 0)) best = kind;
      out[at] = best;
    }
  }
  return out;
}

/**
 * Pieces of one value under `least` pixels join the value that borders them most; the largest
 * piece of each value stays, so no tone leaves the body.
 */
function mergeIslands(cells: Int16Array, w: number, h: number, least: number, kinds: number) {
  const { piece, sizes } = pieces(cells, w, h);
  const largest = new Int32Array(kinds).fill(-1);
  for (let at = 0; at < cells.length; at += 1) {
    const kind = cells[at];
    if (piece[at] >= 0 && (largest[kind] < 0 || sizes[piece[at]] > sizes[largest[kind]])) largest[kind] = piece[at];
  }
  const merged = (at: number) => piece[at] >= 0 && sizes[piece[at]] < least && largest[cells[at]] !== piece[at];
  const borders = new Int32Array(sizes.length * kinds);
  for (let at = 0; at < cells.length; at += 1) {
    if (!merged(at)) continue;
    const x = at % w;
    for (const next of [x > 0 ? at - 1 : -1, x < w - 1 ? at + 1 : -1, at >= w ? at - w : -1, at + w < w * h ? at + w : -1]) {
      if (next >= 0 && cells[next] >= 0 && piece[next] !== piece[at]) borders[piece[at] * kinds + cells[next]] += 1;
    }
  }
  const merges = Uint8Array.from(cells, (_, at) => (merged(at) ? 1 : 0));
  for (let at = 0; at < cells.length; at += 1) {
    if (!merges[at]) continue;
    let best = cells[at];
    let most = 0;
    for (let kind = 0; kind < kinds; kind += 1) {
      if (borders[piece[at] * kinds + kind] > most) {
        most = borders[piece[at] * kinds + kind];
        best = kind;
      }
    }
    cells[at] = best;
  }
}

/** The most pixels a point of light holds (an eye, a spark); a longer light is a line. */
const LIGHT_POINT = 9;

/**
 * First Mark: fewer and fewer pixels, at the same size. Thin parts fall away era by era
 * (whiskers and veins, then tails and claws), the masses merge into a few flat tones inside a
 * fresh outline, broader with every era; what the creature is stays readable to the last
 * stratum (a bat keeps its wings, a wolf its legs). The eyes stay with what is left of the
 * body; thin lines of light (veins, threads, runes) fall away with the other thin parts.
 */
function fewer(source: Pixels, { step }: TreatContext): Pixels {
  const { w, h } = source;
  const drawn: Uint8Array = new Uint8Array(w * h);
  let total = 0;
  for (let at = 0; at < drawn.length; at += 1) {
    drawn[at] = source.idx[at] === EMPTY ? 0 : 1;
    total += drawn[at];
  }
  // At least two thirds of the drawing stay: a thin one loses less, one already down to lines and dots nothing.
  let mask: Uint8Array | null = null;
  for (let passes = 1 + (step >> 1); passes > 0 && !mask; passes -= 1) {
    let open = drawn;
    for (let pass = 0; pass < passes; pass += 1) open = morph(open, w, h, false, (pass & 1) === 1);
    for (let pass = passes - 1; pass >= 0; pass -= 1) open = morph(open, w, h, true, (pass & 1) === 1);
    let kept = 0;
    for (let at = 0; at < open.length; at += 1) kept += open[at];
    if (kept * 3 >= total * 2) mask = open;
  }
  if (!mask) return source;
  dropCrumbs(mask, w, h);
  const shape = mask;
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && shape[y * w + x] === 1;
  // The eyes (1) stay on what is left of the body. Of the lights (2), the points stay (an eye
  // that never closes, a spark), and of the longer ones what is broad enough to survive an
  // opening: a flame, not a vein.
  const near = morph(shape, w, h, true, true);
  const lights = Uint8Array.from(source.emit, (lit, at) => (lit === 2 && source.idx[at] !== EMPTY ? 1 : 0));
  const broad = morph(morph(lights, w, h, false, false), w, h, true, false);
  const { piece: light, sizes: lightSizes } = pieces(Int16Array.from(lights, (on) => (on ? 1 : -1)), w, h);
  const kept = (at: number) => (source.emit[at] === 1 ? near[at] === 1 : lights[at] === 1 && shape[at] === 1 && (broad[at] === 1 || lightSizes[light[at]] <= LIGHT_POINT));
  const lit = (at: number) => source.idx[at] !== EMPTY && source.emit[at] !== 0 && kept(at);
  // The masses: each pixel's flat tone (0 is the ink), then the tones gathered into broad areas.
  const tones = flatTones(source, step < 2 ? 3 : 2);
  const kinds = [C.ink as number, ...new Set([...tones.values()].sort((a, b) => palLuma(a) - palLuma(b) || a - b))];
  let cells: Int16Array = new Int16Array(w * h).fill(-1);
  for (let at = 0; at < cells.length; at += 1) {
    if (!shape[at]) continue;
    const tone = source.emit[at] ? undefined : tones.get(source.idx[at]);
    cells[at] = source.idx[at] === C.ink ? 0 : tone === undefined ? -2 : kinds.indexOf(tone);
  }
  // The first stratum only loses its specks; the areas then broaden era by era.
  const reach = (step + 1) >> 1;
  cells = majority(cells, w, h, 2, kinds.length, true);
  for (let pass = 0; reach && pass < 2; pass += 1) cells = majority(cells, w, h, reach, kinds.length);
  mergeIslands(cells, w, h, 6 + step * 6, kinds.length);
  const out = createPixels(w, h);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const at = y * w + x;
      if (lit(at)) {
        out.idx[at] = source.idx[at];
        out.emit[at] = source.emit[at];
      } else if (!shape[at]) continue;
      else if (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1)) out.idx[at] = C.ink;
      else out.idx[at] = cells[at] >= 0 ? kinds[cells[at]] : C.ink;
      out.alpha[at] = 255;
    }
  }
  return out;
}

const SOFT_MATERIALS = new Set<MaterialId>(["fur-grey", "fur-brown", "fur-rust", "fur-shadow", "hide", "flesh", "moss", "leaf", "bark", "mud", "slime", "feather"]);

/** How an era transforms a recipe. Pip is the same in every stratum. */
export function treatment(era: number, recipe: Pick<ResolvedRecipe, "rank">): Treatment {
  const age = ageOf(era);
  const step = Math.max(0, era) % ERAS_PER_AGE;
  const base: Treatment = { age, era, speed: 1 };
  if (recipe.rank === "treasure" || era <= 0) return base;
  switch (age) {
    case 0:
      if (step === 1) return { ...base, post: echo };
      if (step === 2) return { ...base, post: ash, embers: true };
      if (step === 3) return { ...base, post: voidHoles };
      return { ...base, post: astral };
    case 1: {
      const matter: MaterialId = step <= 1 ? "stone" : step === 2 ? "bone" : step === 3 ? "cave-stone" : "crystal";
      return { ...base, bias: -0.5, swap: (id) => (SOFT_MATERIALS.has(id) ? matter : id) };
    }
    case 2:
      return { ...base, post: hallowed };
    case 3:
      return { ...base, line: C.shard, post: starry };
    case 4:
      return { ...base, post: woven, flicker: true };
    case 5:
      return { ...base, steps: 2, post: sketched };
    case 6:
      return { ...base, post: worded };
    case 7:
      return { ...base, steps: 2, halfClosed: true, speed: 0.6 - step * 0.04, bias: -step * 0.15 };
    case 8:
      return { ...base, post: lamplit };
    case 9:
      return { ...base, post: drained(0.25 + step * 0.18) };
    case 10:
      return { ...base, post: inked(step) };
    default:
      return { ...base, post: fewer };
  }
}
