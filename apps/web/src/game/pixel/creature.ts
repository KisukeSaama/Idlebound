/**
 * The monster generator (BIBLE 18.4): every creature is drawn by hand (`grids/`), one
 * character per pixel. The generator lays its rows in the ramps of their materials, adds
 * the breath and the twitch, the ink outline and the era treatment. Pure and
 * deterministic: the same recipe, era and frame give the same pixels everywhere.
 */
import { C, resolveCreature, type CreatureGrid, type ResolvedRecipe } from "@idlebound/game/art";
import { ERAS_PER_AGE, treatment, type Treatment } from "./eras";
import { applyColors, bounds, clonePixels, closeColors, createPixels, EMPTY, reduceColors, type Pixels } from "./pixels";
import { materialOf, outline, type ShadeOptions } from "./shade";

/** Idle frames of a creature: its own breath cycle. */
export function idleFrames(id: string): number {
  return resolveCreature(id).grid.idle.breath.length;
}

export interface CreatureOptions {
  era?: number;
  frame?: number;
  blink?: boolean;
}

export interface CreatureSprite {
  pixels: Pixels;
  /** Pixel row of the ground line. */
  feet: number;
  treatment: Treatment;
}

/** Moves the rows above the waist up by `lift` pixels (the breath); the waist row stretches. */
function breathe(source: Pixels, lift: number, waist: number): Pixels {
  if (lift === 0) return source;
  const box = bounds(source);
  if (!box) return source;
  const out = clonePixels(source);
  for (let y = box.y - lift; y < waist; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const to = y * source.w + x;
      const from = (y + lift) * source.w + x;
      if (y < 0) continue;
      out.idx[to] = source.idx[from];
      out.alpha[to] = source.alpha[from];
      out.emit[to] = source.emit[from];
    }
  }
  return out;
}

/** One frame of a creature, in the palette of its era. */
export function renderCreature(id: string, options: CreatureOptions = {}): CreatureSprite {
  return renderRecipe(resolveCreature(id), options);
}

/** One frame of a recipe; twelve colors at most, with one reduction for all its frames. */
export function renderRecipe(recipe: ResolvedRecipe, options: CreatureOptions = {}): CreatureSprite {
  const sprite = renderGrid(recipe, recipe.grid, options);
  // The reduction is taken from the still frame, so every frame keeps the same colors.
  const key = `${recipe.id}:${options.era ?? 0}`;
  let table = REDUCTIONS.get(key);
  if (!table) {
    const still = options.frame || options.blink ? renderGrid(recipe, recipe.grid, { ...options, frame: 0, blink: false }) : sprite;
    table = closeColors(reduceColors(still.pixels), still.pixels);
    if (REDUCTIONS.size > 256) REDUCTIONS.clear();
    REDUCTIONS.set(key, table);
  }
  return { ...sprite, pixels: applyColors(sprite.pixels, table) };
}

const REDUCTIONS = new Map<string, Uint8Array>();

/** Margin around a grid: room for the outline, and above it for the breath. */
const PAD = 1;
const HEADROOM = 2;

/**
 * One frame of a hand-drawn creature: the rows (with the twitch patch on its frames) in
 * the ramps of their materials, the breath, the outline, then the era. Nothing is
 * generated: no mutation, no resizing, only the pixels as drawn.
 */
function renderGrid(recipe: ResolvedRecipe, grid: CreatureGrid, options: CreatureOptions): CreatureSprite {
  const era = options.era ?? 0;
  const count = grid.idle.breath.length;
  const frame = (((options.frame ?? 0) % count) + count) % count;
  const seed = recipe.seed;
  const treat = treatment(era, recipe);
  const rows = grid.rows.map((row) => row.split(""));
  const twitch = grid.idle.twitch;
  if (twitch && twitch.frames.includes(frame) && !options.blink) {
    for (const patch of twitch.patches) {
      patch.rows.forEach((line, dy) => {
        const row = rows[patch.y + dy];
        if (!row) return;
        for (let dx = 0; dx < line.length; dx += 1) {
          const key = line[dx];
          if (key === ".") continue;
          while (row.length <= patch.x + dx) row.push(".");
          row[patch.x + dx] = key === "_" ? "." : key;
        }
      });
    }
  }
  const w = Math.max(...rows.map((row) => row.length)) + PAD * 2;
  const h = rows.length + PAD + HEADROOM;
  let pixels = createPixels(w, h);
  let over = createPixels(w, h);
  const shadeOptions: ShadeOptions = { materials: recipe.materials, seed, swap: treat.swap };
  const single = Object.keys(recipe.materials).length < 2;
  // Each key of the legend is resolved once: its color, whether it lies over the outline, its light.
  const inks = new Map<string, { pal: number; over: boolean; emit: number } | null>();
  const inkOf = (key: string) => {
    let resolved = inks.get(key);
    if (resolved !== undefined) return resolved;
    const ink = grid.legend[key];
    if (!ink) resolved = null;
    // 1: an eye (it blinks); 2: a source of light (it never goes out).
    else if ("pal" in ink) resolved = { pal: ink.pal, over: false, emit: ink.glow ? (ink.light ? 2 : 1) : 0 };
    else {
      const ramp = materialOf(ink.m, shadeOptions).ramp;
      const top = ramp.length - 1;
      let step = Math.round(ink.step + (treat.bias ?? 0));
      // Soft ramps flatten a body of several materials; one drawn in a single material keeps its ramp.
      if (treat.steps && treat.steps < ramp.length && !single) step = step >= top / 2 ? top - 1 : 1;
      resolved = { pal: ramp[step < 0 ? 0 : step > top ? top : step], over: Boolean(ink.over), emit: 0 };
    }
    inks.set(key, resolved);
    return resolved;
  };
  rows.forEach((row, y) => {
    row.forEach((key, x) => {
      const ink = inkOf(key);
      if (!ink) return;
      const at = (y + HEADROOM) * w + x + PAD;
      const target = ink.over ? over : pixels;
      target.idx[at] = ink.pal;
      target.alpha[at] = 255;
      target.emit[at] = ink.emit;
    });
  });
  closeEyes(pixels, options.blink ?? false, treat.halfClosed ?? false);
  const lift = grid.idle.breath[frame];
  pixels = outline(breathe(pixels, lift, grid.idle.waist + HEADROOM), treat.line ?? C.ink);
  over = breathe(over, lift, grid.idle.waist + HEADROOM);
  for (let at = 0; at < over.idx.length; at += 1) {
    if (over.idx[at] === EMPTY) continue;
    pixels.idx[at] = over.idx[at];
    pixels.alpha[at] = 255;
    pixels.emit[at] = 0;
  }
  if (treat.post) pixels = treat.post(pixels, { seed, rank: recipe.rank, step: Math.max(0, era) % ERAS_PER_AGE });
  return { pixels, feet: h - 1, treatment: treat };
}

/**
 * A blink pulls the lid (the color above) over every eye pixel; half-closed eyes lose their
 * top row. Sources of light (flames, lanterns, windows, runes) are not eyes: they stay lit.
 */
function closeEyes(target: Pixels, blink: boolean, halfClosed: boolean) {
  if (!blink && !halfClosed) return;
  const { w } = target;
  // The eyes as they were: a row closed above must not make the next one look like the top.
  const eye = target.emit.slice();
  for (let at = w; at < target.idx.length; at += 1) {
    if (eye[at] !== 1 || target.idx[at] === EMPTY) continue;
    let above = at - w;
    while (above >= 0 && eye[above]) above -= w;
    if (halfClosed && !blink && (eye[at - w] || !eye[at + w])) continue;
    const lid = above >= 0 && target.idx[above] !== EMPTY ? target.idx[above] : C.ink;
    target.idx[at] = lid;
    target.emit[at] = 0;
  }
}
