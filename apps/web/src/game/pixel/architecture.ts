/**
 * The builder of the scenes' structures (BIBLE 18.7): buildings and ruins drawn the way the
 * creatures are, in material ramps. Each piece is a volume shaded by its shape and by the
 * moon's side (a round tower darkens across its width, a roof slope turned away sinks in
 * shade, eaves cast a shadow on the wall below), then its finish is laid in clusters
 * (stones course by course, boards, thatch), the whole is outlined, rimmed in moonlight on
 * its top and its lit side, grown over with moss and ivy, and worn down by the era.
 *
 * Pure and deterministic: the same recipe, colors, era and frame give the same pixels.
 */
import type { DecorGrid, Finish, StructureMaterial, StructurePiece, StructureRecipe } from "@idlebound/game/art";
import type { Pal } from "@idlebound/game/art";
import { applyColors, createPixels, EMPTY, hash2, reduceColors, setPixel, valueNoise, type Pixels } from "./pixels";

/** The colors a scene lends its structures. */
export interface BuildColors {
  /** Ramp of each material, darkest first (3 to 5 steps). */
  ramps: Partial<Record<StructureMaterial, readonly Pal[]>>;
  /** Outside edge of the silhouette, and inside dark openings. */
  outline: Pal;
  /** Moonlight on the top and the lit side. */
  rim: Pal;
  /** Lit windows and flames, and their heart. */
  glow: Pal;
  core?: Pal;
  /** Moss and ivy, darkest first (2 or 3 steps). */
  growth: readonly Pal[];
  /** Side the moon lights from: -1 left, 1 right. */
  side: -1 | 1;
}

/** How far an era has worn a structure down (see `wearOf`). */
export interface Wear {
  /** Share of the fragile rows fallen, 0 to 1. */
  collapse: number;
  /** Extra growth on top of the recipe's, 0 to 1. */
  growth: number;
  /** Burned: timber and thatch charred, embers in the breaks. */
  char?: { ramp: readonly Pal[]; ember: Pal };
  /** A ghost of the building a step behind it (the Echo). */
  echo?: Pal;
  /** Star-shards grown through it (the Astral), their light and their heart. */
  shards?: readonly [Pal, Pal];
  /** Rime on every top (the Elder World's cold). */
  frost?: Pal;
  /** The lights have gone out. */
  dark?: boolean;
}

export const NO_WEAR: Wear = { collapse: 0, growth: 0 };

/** A drawn structure: its pixels, and the bottom middle of its box in them. */
export interface Built {
  pixels: Pixels;
  /** Pixel column and row of the box's bottom middle (where it stands). */
  footX: number;
  footY: number;
}

// ------------------------------------------------------------------ working buffer

const NONE = -1;
/** What a pixel of the working buffer is. */
const SOLID = 0;
const GLOW = 1;
const CORE = 2;
const DARK = 3;
const OUTLINE = 4;
/** A decor pixel: its tone is the exact step of its ramp. */
const STEP = 5;

const MATERIALS: readonly StructureMaterial[] = ["stone", "wood", "roof", "metal", "cloth", "bark", "rock", "crystal", "bone"];

interface Work {
  w: number;
  h: number;
  /** Material index per pixel, NONE when empty. */
  mat: Int8Array;
  /** Light, 0 (deepest shade) to 1 (full light), before it is laid on a ramp. */
  tone: Float32Array;
  kind: Uint8Array;
  /** Pixels a wear may not take (kept decor). */
  keep: Uint8Array;
}

function work(w: number, h: number): Work {
  return { w, h, mat: new Int8Array(w * h).fill(NONE), tone: new Float32Array(w * h), kind: new Uint8Array(w * h), keep: new Uint8Array(w * h) };
}

function put(target: Work, x: number, y: number, material: StructureMaterial | null, tone: number, kind = SOLID) {
  if (x < 0 || y < 0 || x >= target.w || y >= target.h) return;
  const at = y * target.w + x;
  target.mat[at] = material === null ? 0 : MATERIALS.indexOf(material);
  target.tone[at] = tone;
  target.kind[at] = kind;
}

const filled = (target: Work, x: number, y: number) => x >= 0 && y >= 0 && x < target.w && y < target.h && target.mat[y * target.w + x] !== NONE;

/** A sine from turns, by parabolas: plain arithmetic, the same on every engine. */
function sine(turns: number): number {
  const f = turns - Math.floor(turns);
  return f < 0.5 ? 16 * f * (0.5 - f) : -16 * (f - 0.5) * (1 - f);
}

function insidePoly(points: readonly number[], x: number, y: number): boolean {
  let hit = false;
  for (let i = 0, j = points.length - 2; i < points.length; j = i, i += 2) {
    const xi = points[i];
    const yi = points[i + 1];
    const xj = points[j];
    const yj = points[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

// ------------------------------------------------------------------ finishes

/**
 * The finish of a surface at a pixel: a change of light, in clusters laid by rule (stones
 * course by course, boards, strokes of thatch), each cluster its own shade.
 * (x, y) are measured from the piece's own corner so its pattern starts clean.
 */
function finishTone(finish: Finish, x: number, y: number, seed: number): number {
  switch (finish) {
    case "ashlar": {
      // Courses 4 or 5 rows high; stones 5 to 9 long, the joints staggered course to course.
      let top = 0;
      let course = 0;
      for (;;) {
        const tall = 4 + (hash2(course, 0, seed) < 0.35 ? 1 : 0);
        if (y < top + tall) break;
        top += tall;
        course += 1;
      }
      const tall = 4 + (hash2(course, 0, seed) < 0.35 ? 1 : 0);
      const row = y - top;
      let left = -Math.floor(hash2(course, 1, seed) * 6);
      let stone = 0;
      for (;;) {
        const long = 5 + Math.floor(hash2(course, stone + 2, seed) * 5);
        if (x < left + long) break;
        left += long;
        stone += 1;
      }
      if (row === tall - 1 || x === left) return -0.3;
      const own = (hash2(course, stone + 40, seed) - 0.5) * 0.24;
      // A chipped corner on some stones.
      const chipped = hash2(course, stone + 80, seed) < 0.25 && row === 0 && x === left + 1;
      return own + (row === 0 ? 0.12 : 0) + (chipped ? -0.25 : 0);
    }
    case "rubble": {
      // Fieldstones: every pixel belongs to its nearest stone center; mortar where two meet.
      const cell = (px: number, py: number) => {
        const gx = Math.floor(px / 6);
        const gy = Math.floor(py / 4);
        let best = Infinity;
        let id = 0;
        for (let oy = -1; oy <= 1; oy += 1) {
          for (let ox = -1; ox <= 1; ox += 1) {
            const cx = (gx + ox) * 6 + 1 + hash2(gx + ox, gy + oy, seed) * 4;
            const cy = (gy + oy) * 4 + 1 + hash2(gx + ox, gy + oy, seed + 1) * 2;
            const d = ((px - cx) / 1.4) ** 2 + (py - cy) ** 2;
            if (d < best) {
              best = d;
              id = (gx + ox) * 977 + (gy + oy);
            }
          }
        }
        return id;
      };
      const own = cell(x, y);
      if (cell(x + 1, y) !== own || cell(x, y + 1) !== own) return -0.3;
      return (hash2(own, 3, seed) - 0.5) * 0.26 + (cell(x, y - 1) !== own ? 0.12 : 0);
    }
    case "planks":
    case "boards": {
      const [along, across] = finish === "planks" ? [y, x] : [x, y];
      const width = finish === "planks" ? 4 : 3;
      const board = Math.floor(across / width);
      if (across % width === width - 1) return -0.28;
      // A darker streak of grain here and there, a knot on some boards.
      const streak = Math.floor(along / 5);
      const grain = hash2(board, streak, seed) < 0.3 && across % width === 1 ? -0.12 : 0;
      return (hash2(board, 7, seed) - 0.5) * 0.2 + grain + (across % width === 0 ? 0.08 : 0);
    }
    case "thatch": {
      // Combed strokes, 3 to 5 long, alternating; a darker band where each layer overlaps.
      const layer = Math.floor(y / 5);
      if (y % 5 === 4 && hash2(x >> 1, layer, seed) < 0.7) return -0.24;
      const stroke = Math.floor((y + Math.floor(hash2(x, 1, seed) * 5)) / 4);
      return (hash2(x, stroke, seed) < 0.5 ? 0.1 : -0.1) + (x % 3 === 0 ? -0.05 : 0);
    }
    case "shingle": {
      const tall = 3;
      const wide = 4;
      const row = Math.floor(y / tall);
      if (y % tall === tall - 1) return -0.26;
      const shift = row % 2 === 0 ? 0 : Math.floor(wide / 2);
      const tile = Math.floor((x + shift) / wide);
      if ((x + shift) % wide === 0) return -0.14;
      return (hash2(tile, row, seed) - 0.5) * 0.2 + (y % tall === 0 ? 0.06 : 0);
    }
    case "bark": {
      // Plates of bark between deep crevices, each plate its own shade, its grain in short
      // vertical strokes; the crevices wander as they run down the trunk.
      const wander = Math.round(sine(y / 13 + hash2(Math.floor(x / 5), 0, seed)) * 1.2);
      const px = x + wander;
      const plate = Math.floor(px / 5);
      const offset = Math.floor(hash2(plate, 1, seed) * 12);
      const row = Math.floor((y + offset) / 12);
      const across = px - plate * 5;
      if (across === 0 || ((y + offset) % 12 === 0 && hash2(plate, row, seed) < 0.6)) return -0.34;
      const stroke = hash2(px, Math.floor((y + Math.floor(hash2(px, 3, seed) * 4)) / 4), seed + 9);
      return (hash2(plate, row, seed + 2) - 0.5) * 0.3 + (across === 1 ? 0.1 : 0) + (stroke < 0.22 ? -0.13 : stroke > 0.84 ? 0.1 : 0);
    }
    case "rock": {
      // Flat facets, each turned its own way to the light; a crease on their lower edge.
      const facet = (px: number, py: number) => {
        const gx = Math.floor(px / 7);
        const gy = Math.floor(py / 6);
        let best = Infinity;
        let id = 0;
        for (let oy = -1; oy <= 1; oy += 1) {
          for (let ox = -1; ox <= 1; ox += 1) {
            const cx = (gx + ox) * 7 + hash2(gx + ox, gy + oy, seed) * 7;
            const cy = (gy + oy) * 6 + hash2(gx + ox, gy + oy, seed + 2) * 6;
            const d = (px - cx) ** 2 + (py - cy) ** 2;
            if (d < best) {
              best = d;
              id = (gx + ox) * 613 + (gy + oy);
            }
          }
        }
        return id;
      };
      const own = facet(x, y);
      if (facet(x, y + 1) !== own) return -0.24;
      return (hash2(own, 11, seed) - 0.45) * 0.4;
    }
  }
}

// ------------------------------------------------------------------ pieces

/** Light falls from above: a wall is a little lighter at its top than at its foot. */
const fall = (y: number, top: number, bottom: number) => 0.12 - 0.24 * ((y + 0.5 - top) / Math.max(1, bottom - top));

/** Light of a flat wall: lit face toward the moon, shade away, flat light facing the walker. */
function faceLight(side: "left" | "right" | undefined, moon: -1 | 1): number {
  if (!side) return 0.5;
  return (side === "left" ? -1 : 1) === moon ? 0.74 : 0.26;
}

function drawPiece(target: Work, piece: StructurePiece, colors: BuildColors, seed: number, index: number, decor: Readonly<Record<string, DecorGrid>>, frame: number) {
  const moon = colors.side;
  const pieceSeed = seed + index * 31;
  if ("block" in piece || "poly" in piece) {
    const points = "block" in piece ? rect(piece.block) : piece.poly;
    const [x0, y0, x1, y1] = extent(points);
    const base = faceLight(piece.side, moon) + (piece.lift ?? 0) * 0.25;
    for (let y = Math.floor(y0); y < Math.ceil(y1); y += 1) {
      for (let x = Math.floor(x0); x < Math.ceil(x1); x += 1) {
        if (!insidePoly(points, x + 0.5, y + 0.5)) continue;
        const finish = piece.finish ? finishTone(piece.finish, x - Math.floor(x0), y - Math.floor(y0), pieceSeed) : 0;
        put(target, x, y, piece.m, base + finish + fall(y, y0, y1));
      }
    }
    return;
  }
  if ("cyl" in piece) {
    const [x0, y0, w, h] = piece.cyl;
    for (let y = y0; y < y0 + h; y += 1) {
      for (let x = x0; x < x0 + w; x += 1) {
        // Across the width: lit toward the moon, darkening round to the far side.
        const nx = ((x + 0.5 - x0) / w) * 2 - 1;
        const light = 0.46 + 0.42 * nx * moon - 0.12 * nx * nx + (piece.lift ?? 0) * 0.25;
        const finish = piece.finish ? finishTone(piece.finish, x - x0, y - y0, pieceSeed) : 0;
        put(target, x, y, piece.m, light + finish + fall(y, y0, y0 + h));
      }
    }
    return;
  }
  if ("roof" in piece) {
    drawRoof(target, piece, moon, pieceSeed);
    return;
  }
  if ("gap" in piece) {
    drawGap(target, piece, moon, frame);
    return;
  }
  if ("beam" in piece) {
    // Along a curve that sags by `sag` at its middle, thinning from `width` to `taper`:
    // a disc at every step, round across its width, lit on its upper and moon side.
    const [x1, y1, x2, y2] = piece.beam;
    const length = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = -(y2 - y1) / length;
    const ny = (x2 - x1) / length;
    const sag = piece.sag ?? 0;
    const steps = Math.ceil(length * 2);
    for (let step = 0; step <= steps; step += 1) {
      const k = step / steps;
      const bend = sag * 4 * k * (1 - k);
      const cx = x1 + (x2 - x1) * k + nx * bend;
      const cy = y1 + (y2 - y1) * k + ny * bend;
      const r = (piece.width + ((piece.taper ?? piece.width) - piece.width) * k) / 2;
      for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y += 1) {
        for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x += 1) {
          const ex = x + 0.5 - cx;
          const ey = y + 0.5 - cy;
          if (ex * ex + ey * ey > r * r) continue;
          const facing = (-ey + ex * moon) / Math.max(0.5, r);
          const finish = piece.finish ? finishTone(piece.finish, x, y, pieceSeed) * 0.7 : 0;
          put(target, x, y, piece.m, 0.46 + 0.22 * facing + finish + (piece.lift ?? 0) * 0.25);
        }
      }
    }
    return;
  }
  if ("decor" in piece) {
    const grid = decor[piece.decor];
    if (grid) drawDecor(target, grid, piece.at[0], piece.at[1], piece.flip ?? false, frame, piece.keep ?? false);
    return;
  }
  // A cut.
  const [x0, y0, x1, y1] = extent(piece.cut);
  for (let y = Math.floor(y0); y < Math.ceil(y1); y += 1) {
    for (let x = Math.floor(x0); x < Math.ceil(x1); x += 1) {
      if (insidePoly(piece.cut, x + 0.5, y + 0.5) && x >= 0 && y >= 0 && x < target.w && y < target.h) target.mat[y * target.w + x] = NONE;
    }
  }
}

const rect = ([x, y, w, h]: readonly [number, number, number, number]) => [x, y, x + w, y, x + w, y + h, x, y + h];

function extent(points: readonly number[]): [number, number, number, number] {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (let i = 0; i < points.length; i += 2) {
    x0 = Math.min(x0, points[i]);
    x1 = Math.max(x1, points[i]);
    y0 = Math.min(y0, points[i + 1]);
    y1 = Math.max(y1, points[i + 1]);
  }
  return [x0, y0, x1, y1];
}

function drawRoof(target: Work, piece: Extract<StructurePiece, { roof: unknown }>, moon: -1 | 1, seed: number) {
  const [x0, y0, w, h] = piece.roof;
  const lift = (piece.lift ?? 0) * 0.25;
  const mid = x0 + w / 2;
  for (let y = y0; y < y0 + h; y += 1) {
    const k = (y + 1 - y0) / h;
    for (let x = x0; x < x0 + w; x += 1) {
      const px = x + 0.5;
      let inside: boolean;
      let light: number;
      switch (piece.style) {
        case "gable":
          inside = Math.abs(px - mid) <= (w / 2) * k;
          light = (px < mid ? -1 : 1) === moon ? 0.72 : 0.3;
          break;
        case "spire": {
          const half = (w / 2) * k * k;
          inside = Math.abs(px - mid) <= half;
          const nx = half > 0 ? (px - mid) / half : 0;
          light = 0.48 + 0.4 * nx * moon - 0.08 * nx * nx;
          break;
        }
      }
      if (!inside) continue;
      const finish = piece.finish ? finishTone(piece.finish, x - x0, y - y0, seed) : 0;
      // The eaves: a lit edge along the bottom row.
      put(target, x, y, piece.m, light + finish + lift + (y === y0 + h - 1 ? 0.1 : 0));
    }
  }
  // The eaves cast a shadow on the wall below them.
  for (let x = x0; x < x0 + w; x += 1) {
    for (let dy = 0; dy < 2; dy += 1) {
      const y = y0 + h + dy;
      if (!filled(target, x, y)) continue;
      const at = y * target.w + x;
      if (target.kind[at] === SOLID) target.tone[at] -= dy === 0 ? 0.3 : 0.15;
    }
  }
}

function drawGap(target: Work, piece: Extract<StructurePiece, { gap: unknown }>, moon: -1 | 1, frame: number) {
  const [x0, y0, w, h] = piece.gap;
  const shape = (x: number, y: number) => {
    if (x < x0 || x >= x0 + w || y < y0 || y >= y0 + h) return false;
    if (piece.style === "arch" || piece.style === "door") {
      // A rounded head, as tall as half the width.
      const r = w / 2;
      const cy = y0 + r;
      if (y + 0.5 < cy) return ((x + 0.5 - (x0 + r)) / r) ** 2 + ((y + 0.5 - cy) / r) ** 2 <= 1;
    }
    return true;
  };
  for (let y = y0 - 1; y <= y0 + h; y += 1) {
    for (let x = x0 - 1; x <= x0 + w; x += 1) {
      if (shape(x, y)) {
        if (!piece.lit) {
          put(target, x, y, null, 0, DARK);
          continue;
        }
        // Lit: the heart of the light in the middle, flickering from frame to frame.
        const cx = (x + 0.5 - x0) / w - 0.5;
        const cy = (y + 0.5 - y0) / h - 0.55;
        const heart = cx * cx + cy * cy < 0.07 + (frame % 2) * 0.03;
        put(target, x, y, null, 1, heart ? CORE : GLOW);
        continue;
      }
      // The frame: the sill and the moon's side lit, the lintel in shade.
      if (!piece.frame) continue;
      const touches = shape(x + 1, y) || shape(x - 1, y) || shape(x, y + 1) || shape(x, y - 1);
      if (!touches) continue;
      const sill = shape(x, y - 1) && !shape(x, y + 1);
      const lit = sill || (shape(x - moon, y) && !shape(x + moon, y));
      put(target, x, y, piece.frame, lit ? 0.78 : 0.3);
    }
  }
  // Mullions on a lit window wide and tall enough: a cross of the frame.
  if (piece.lit && piece.frame && piece.style === "window" && w >= 4 && h >= 4) {
    const mx = x0 + Math.floor(w / 2);
    const my = y0 + Math.floor(h / 2);
    for (let y = y0; y < y0 + h; y += 1) put(target, mx, y, piece.frame, 0.35);
    for (let x = x0; x < x0 + w; x += 1) put(target, x, my, piece.frame, 0.35);
  }
}

function drawDecor(target: Work, grid: DecorGrid, left: number, bottom: number, flip: boolean, frame: number, keep: boolean) {
  const rows = grid.rows.map((row) => row.split(""));
  const patches = grid.frames?.length ? grid.frames[frame % grid.frames.length] : [];
  for (const patch of patches) {
    patch.rows.forEach((line, dy) => {
      const row = rows[patch.y + dy];
      if (!row) return;
      for (let dx = 0; dx < line.length; dx += 1) {
        const key = line[dx];
        if (key === ",") continue;
        while (row.length <= patch.x + dx) row.push(".");
        row[patch.x + dx] = key;
      }
    });
  }
  const width = Math.max(...rows.map((row) => row.length));
  const top = bottom - rows.length + 1;
  rows.forEach((row, dy) => {
    row.forEach((key, dx) => {
      const ink = grid.legend[key];
      if (!ink) return;
      const x = left + (flip ? width - 1 - dx : dx);
      const y = top + dy;
      if (ink === "glow") put(target, x, y, null, 1, GLOW);
      else if (ink === "core") put(target, x, y, null, 1, CORE);
      else if (ink === "outline") put(target, x, y, null, 0, OUTLINE);
      else put(target, x, y, ink[0], ink[1], STEP);
      if (keep && x >= 0 && y >= 0 && x < target.w && y < target.h) target.keep[y * target.w + x] = 1;
    });
  });
}

// ------------------------------------------------------------------ wear

/**
 * The era's wear: the fragile rows fall along a jagged line in blocks, and the stones of
 * what fell pile up at the foot. Kept decor stays.
 */
function wearDown(target: Work, recipe: StructureRecipe, wear: Wear, seed: number, side: -1 | 1) {
  const { w, h } = target;
  if (wear.collapse > 0) {
    const fallen = recipe.fragile * Math.min(1, wear.collapse);
    let removed = 0;
    for (let x = 0; x < w; x += 1) {
      // The break: blocks three columns wide, stepping down and up.
      const block = Math.floor(x / 3);
      const depth = fallen * (0.55 + 0.9 * valueNoise(block, 0, 3, seed + 21)) + (hash2(block, 1, seed) - 0.5) * 3;
      const line = Math.round(depth);
      for (let y = 0; y < Math.min(h - 3, line); y += 1) {
        const at = y * w + x;
        if (target.mat[at] === NONE || target.keep[at]) continue;
        target.mat[at] = NONE;
        removed += 1;
      }
      // The fresh break catches the light.
      for (let y = line; y < h; y += 1) {
        const at = y * w + x;
        if (target.mat[at] === NONE) continue;
        if (target.kind[at] === SOLID) target.tone[at] += 0.12;
        break;
      }
    }
    // Rubble at the foot, as much as fell.
    const stones = Math.min(Math.floor(w / 3), Math.floor(removed / 14));
    for (let stone = 0; stone < stones; stone += 1) {
      const cx = Math.floor(hash2(stone, 2, seed) * w);
      const r = 1 + Math.floor(hash2(stone, 3, seed) * 2.5);
      for (let y = h - 1 - r; y < h; y += 1) {
        for (let x = cx - r - 1; x <= cx + r + 1; x += 1) {
          if (((x - cx) / (r + 1)) ** 2 + ((y - (h - 1)) / (r + 0.5)) ** 2 > 1) continue;
          // Each stone round: its top and its moon side lit, its foot in shade.
          const light = 0.5 + ((x - cx) * side < 0 ? 0.14 : -0.1) + (y === h - 1 - r ? 0.16 : 0) - (y === h - 1 ? 0.16 : 0);
          put(target, x, y, "stone", light + (hash2(stone, 4, seed) - 0.5) * 0.2);
        }
      }
    }
  }
}

// ------------------------------------------------------------------ growth

/**
 * Moss on what faces the sky, in patches; ivy hanging from the tops down the walls, a leaf
 * every other row; tufts at the foot. Painted after the ramps, in the growth colors.
 */
function grow(out: Pixels, amount: number, colors: BuildColors, seed: number, foot: number, from: number) {
  if (amount <= 0) return;
  const { w, h } = out;
  const ramp = colors.growth;
  const dark = ramp[0];
  const mid = ramp[Math.min(1, ramp.length - 1)];
  const lit = ramp[ramp.length - 1];
  const drawn = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && out.idx[y * w + x] !== EMPTY && !out.emit[y * w + x];
  const tops: [number, number][] = [];
  // Tops below the box's first row: a piece cut by the top of its box runs on out of view.
  for (let y = from + 1; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) if (drawn(x, y) && !drawn(x, y - 1) && out.idx[y * w + x] !== colors.outline) tops.push([x, y]);
  }
  // Moss: cushions along the tops, lit on top, draping two or three rows down in shade.
  for (const [x, y] of tops) {
    const patch = valueNoise(x, y, 6, seed + 13);
    if (patch > amount) continue;
    const thick = 1 + Math.floor((amount - patch) * 6);
    setPixel(out, x, y, lit);
    for (let dy = 1; dy <= Math.min(3, thick); dy += 1) if (drawn(x, y + dy)) setPixel(out, x, y + dy, dy === Math.min(3, thick) ? dark : mid);
  }
  // Ivy: a few long runs down the walls, a stem in shade and leaves in pairs.
  const runs = Math.round((amount * w) / 8);
  for (let run = 0; run < runs; run += 1) {
    const start = tops[Math.floor(hash2(run, 1, seed) * tops.length)];
    if (!start) break;
    let [x, y] = start;
    const long = Math.round((4 + hash2(run, 2, seed) * (h * 0.6)) * Math.min(1, amount + 0.3));
    for (let step = 0; step < long && y < foot; step += 1, y += 1) {
      if (!drawn(x, y)) break;
      setPixel(out, x, y, dark);
      if (step % 3 === 1) {
        // A leaf each side, the one toward the moon lit, now and then a second pixel.
        for (const leaf of [-1, 1]) {
          if (!drawn(x + leaf, y)) continue;
          setPixel(out, x + leaf, y, leaf === colors.side ? lit : mid);
          if (hash2(run, step + leaf, seed) < 0.5 && drawn(x + leaf, y - 1)) setPixel(out, x + leaf, y - 1, mid);
        }
      }
      if (step % 4 === 3) x += hash2(run, step, seed) < 0.4 ? -1 : hash2(run, step, seed) < 0.8 ? 1 : 0;
    }
  }
  // Tufts at the foot.
  for (let x = 0; x < w; x += 1) {
    if (!drawn(x, foot) || valueNoise(x, 0, 4, seed + 17) > amount * 0.8) continue;
    const tall = 1 + Math.floor(hash2(x, 3, seed) * 3);
    for (let dy = 0; dy < tall; dy += 1) setPixel(out, x, foot - dy, dy === tall - 1 ? lit : mid);
  }
}

// ------------------------------------------------------------------ the builder

/** Pixels of margin around the box: room for the outline and the echo. */
const MARGIN = 4;

/**
 * Draws a structure: pieces, eaves' shadows and wear on a buffer of light, laid on the
 * material ramps; then the outline, the moon's rim, the growth and the era's marks.
 */
export function buildStructure(recipe: StructureRecipe, colors: BuildColors, decor: Readonly<Record<string, DecorGrid>>, wear: Wear = NO_WEAR, frame = 0): Built {
  // Twelve colors at most, with one reduction for all its frames (taken from the still one),
  // so nothing flickers from frame to frame.
  const built = drawStructure(recipe, colors, decor, wear, frame);
  const still = frame === 0 ? built : drawStructure(recipe, colors, decor, wear, 0);
  return { ...built, pixels: applyColors(built.pixels, reduceColors(still.pixels)) };
}

function drawStructure(recipe: StructureRecipe, colors: BuildColors, decor: Readonly<Record<string, DecorGrid>>, wear: Wear, frame: number): Built {
  const w = recipe.w + MARGIN * 2;
  const h = recipe.h + MARGIN;
  const box = work(w, h);
  // Drawn in the box's own coordinates, shifted by the margin.
  const shifted = work(recipe.w, recipe.h);
  recipe.pieces.forEach((piece, index) => drawPiece(shifted, piece, colors, recipe.seed, index, decor, frame));
  wearDown(shifted, recipe, wear, recipe.seed + 7, colors.side);
  for (let y = 0; y < recipe.h; y += 1) {
    for (let x = 0; x < recipe.w; x += 1) {
      const from = y * recipe.w + x;
      const to = (y + MARGIN) * w + x + MARGIN;
      box.mat[to] = shifted.mat[from];
      box.tone[to] = shifted.tone[from];
      box.kind[to] = shifted.kind[from];
      box.keep[to] = shifted.keep[from];
    }
  }
  // Ambient shade where the walls meet the ground.
  for (let y = h - 3; y < h; y += 1) for (let x = 0; x < w; x += 1) if (box.kind[y * w + x] === SOLID) box.tone[y * w + x] -= (y - (h - 4)) * 0.07;
  // Moonlight on the tops and the edges turned to the moon, only where the surface is lit
  // (a slope in shade keeps a dark edge); burned structures keep embers on their tops instead.
  const lit = (at: number) => (box.kind[at] === STEP ? box.tone[at] >= 2 : box.tone[at] >= 0.45);
  const rims = new Uint8Array(w * h);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const at = y * w + x;
      if (box.mat[at] === NONE || (box.kind[at] !== SOLID && box.kind[at] !== STEP)) continue;
      // A piece cut by the top of its box runs on out of view: no rim there.
      const top = !filled(box, x, y - 1) && y > MARGIN;
      const side = !filled(box, x + colors.side, y) && filled(box, x - colors.side, y);
      if (wear.char) rims[at] = top && hash2(x, y, recipe.seed) < 0.18 ? 2 : 0;
      // The rim breaks where the surface turns: runs of light, not a drawn line.
      else if ((top || side) && lit(at) && hash2(top ? x >> 1 : x, top ? y : y >> 1, recipe.seed + 5) < 0.78) rims[at] = 1;
    }
  }

  const out = createPixels(w, h);
  const charred = new Set<StructureMaterial>(["wood", "roof", "cloth", "bark"]);
  for (let at = 0; at < w * h; at += 1) {
    const material = box.mat[at];
    if (material === NONE) continue;
    const kind = box.kind[at];
    const x = at % w;
    const y = Math.floor(at / w);
    if (kind === GLOW || kind === CORE) {
      if (wear.dark || wear.char) setPixel(out, x, y, colors.outline);
      else setPixel(out, x, y, kind === CORE ? (colors.core ?? colors.glow) : colors.glow, 255, 1);
      continue;
    }
    if (kind === DARK || kind === OUTLINE) {
      setPixel(out, x, y, colors.outline);
      continue;
    }
    if (rims[at] === 2 && wear.char) {
      setPixel(out, x, y, wear.char.ember, 255, 1);
      continue;
    }
    const name = MATERIALS[material];
    let ramp = colors.ramps[name] ?? colors.ramps.stone ?? [colors.outline];
    if (wear.char && charred.has(name)) ramp = wear.char.ramp;
    const tone = box.tone[at];
    // A decor step is exact; a volume's light falls on the nearest step of its ramp.
    const step = kind === STEP ? tone : Math.round(Math.max(0, Math.min(1, tone)) * (ramp.length - 1));
    // Moonlight: the rim color on the tops, the ramp's lightest step down the lit sides.
    if (rims[at] === 1) setPixel(out, x, y, filled(box, x, y - 1) ? ramp[ramp.length - 1] : colors.rim);
    else setPixel(out, x, y, ramp[Math.max(0, Math.min(ramp.length - 1, step))]);
  }
  const foot = h - 1;
  weather(out, wear, colors, recipe.growth, recipe.seed, MARGIN, true);
  return { pixels: out, footX: MARGIN + Math.floor(recipe.w / 2), footY: foot };
}

/**
 * What time leaves on a drawn structure, once its volumes are laid: moss and ivy, rime,
 * its outline (when it has one), star-shards through it, and its echo behind it. `from` is
 * the first row of its box: what the box cuts at the top runs on out of view.
 */
export function weather(out: Pixels, wear: Wear, colors: BuildColors, growth: number, seed: number, from: number, outlined: boolean) {
  grow(out, Math.min(1, growth + wear.growth), colors, seed + 3, out.h - 1, from);
  if (wear.frost) frost(out, wear.frost);
  if (outlined) outlineAround(out, colors.outline);
  if (wear.shards) plantShards(out, wear.shards, colors.outline, seed);
  if (wear.echo) echoBehind(out, wear.echo, colors.side);
}

/** Rime on everything that faces the sky: its top pixel, and the one below on every other column. */
function frost(out: Pixels, color: Pal) {
  const { w, h } = out;
  const marks: number[] = [];
  for (let y = 1; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const at = y * w + x;
      if (out.idx[at] === EMPTY || out.emit[at] || out.idx[at - w] !== EMPTY) continue;
      marks.push(at);
      if (x % 2 === 0 && y + 1 < h && out.idx[at + w] !== EMPTY) marks.push(at + w);
    }
  }
  for (const at of marks) out.idx[at] = color;
}

/** A one-pixel outline all around the silhouette but along the ground. */
function outlineAround(out: Pixels, color: Pal) {
  const { w, h } = out;
  const drawn = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && out.idx[y * w + x] !== EMPTY;
  const edge: number[] = [];
  for (let y = 0; y < h - 1; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (drawn(x, y)) continue;
      if (drawn(x, y - 1) || drawn(x, y + 1) || drawn(x - 1, y) || drawn(x + 1, y)) edge.push(y * w + x);
    }
  }
  for (const at of edge) setPixel(out, at % w, Math.floor(at / w), color);
}

/** Star-shards grown through the tops: small blades of light, a heart and an edge. */
function plantShards(out: Pixels, [light, heart]: readonly [Pal, Pal], outline: Pal, seed: number) {
  const { w, h } = out;
  const tops: [number, number][] = [];
  for (let y = 2; y < h; y += 1) for (let x = 1; x < w - 1; x += 1) if (out.idx[y * w + x] !== EMPTY && out.idx[(y - 1) * w + x] === EMPTY) tops.push([x, y]);
  const count = Math.max(1, Math.round(w / 14));
  for (let shard = 0; shard < count; shard += 1) {
    const at = tops[Math.floor(hash2(shard, 1, seed) * tops.length)];
    if (!at) return;
    const [x, y] = at;
    const tall = 3 + Math.floor(hash2(shard, 2, seed) * 4);
    const lean = hash2(shard, 3, seed) < 0.5 ? -1 : 1;
    for (let dy = 0; dy < tall; dy += 1) {
      const px = x + (dy > tall / 2 ? lean : 0);
      setPixel(out, px, y - dy, dy === tall - 1 ? heart : light, 255, 1);
      if (dy < tall - 2) setPixel(out, px + 1, y - dy, light, 255, 1);
      setPixel(out, px - 1, y - dy, outline);
    }
  }
}

/** The Echo: the same building a step behind, one flat pale shape. */
function echoBehind(out: Pixels, color: Pal, side: -1 | 1) {
  const { w, h } = out;
  const copy = out.idx.slice();
  const dx = -side * 3;
  const dy = -2;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const sx = x - dx;
      const sy = y - dy;
      if (sx < 0 || sy < 0 || sx >= w || sy >= h || copy[sy * w + sx] === EMPTY) continue;
      if (out.idx[y * w + x] === EMPTY) setPixel(out, x, y, color);
    }
  }
}
