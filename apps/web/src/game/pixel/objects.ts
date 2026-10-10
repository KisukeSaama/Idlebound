/**
 * Objects of the world: relic icons (32 × 32), pixel icons of in-world spots (16 × 16) and
 * the wandering crystal (16 × 24). Same pipeline as the creatures: shapes, shading,
 * selective outline.
 */
import { RARITIES, RARITY_INFO, type ItemSlot, type Rarity } from "@idlebound/game";
import {
  C,
  CRYSTAL_FACETS,
  CRYSTAL_MASK,
  ICON_INK,
  NAMED_RELIC_SHAPES,
  RAMPS,
  RELIC_MATERIALS,
  RELIC_SHAPES,
  RELIC_TIERS,
  rampFor,
  type IconRecipe,
  type Material,
  type MaterialId,
  type Pal,
  type RelicRecipe,
  type Shape
} from "@idlebound/game/art";
import { paintMask } from "./mask";
import { applyColors, EMPTY, reduceColors, type Pixels } from "./pixels";
import { moveShape, rasterize, type Placed } from "./raster";
import { darker, materialOf, outline, shade } from "./shade";

export const RELIC_SIZE = 32;

/** Forge runes engraved on a relic: one more every five levels, the fifth at the cap of 20. */
export function forgeRunes(forge: number): number {
  if (forge <= 0) return 0;
  return forge >= 20 ? 5 : 1 + Math.floor(forge / 5);
}

const RUNE_SLOTS = 5;

/** The recipe of a relic: a named relic's own, or its base shape. */
function relicRecipe(slot: ItemSlot, base: number, named?: string): RelicRecipe {
  const shapes = RELIC_SHAPES[slot];
  return (named ? NAMED_RELIC_SHAPES[named] : undefined) ?? shapes[Math.max(0, Math.min(shapes.length - 1, base))];
}

/**
 * A relic icon. Rarity changes the object itself (its parts, its matter), then its light:
 * a moonlit rim on the edges facing the top left, glowing gems, a faint ring of light for a
 * legendary relic, rings of living light for a mythic one. The forge engraves runes of
 * fire along the relic, one more every five levels.
 */
export function renderRelic(slot: ItemSlot, base: number, rarity: Rarity, forge = 0, named?: string): Pixels {
  const tier = named === "crown" ? 0 : RARITIES.indexOf(rarity);
  const recipe = relicRecipe(slot, base, named);
  const placed: Placed[] = recipe.parts.filter((part) => (part.from ?? 0) <= tier && tier <= (part.to ?? 4)).map((shape) => ({ shape: onGrid(shape), layer: 1 }));
  const accent = RAMPS[rampFor(RARITY_INFO[rarity].color)];
  const materials: Record<string, MaterialId | Material> = { ...RELIC_MATERIALS };
  for (const [role, matter] of Object.entries(RELIC_TIERS[tier])) materials[role] = matter === "rarity" ? { ramp: accent, texture: "cloth" } : matter;
  materials.rarity = { ramp: accent, texture: "cloth" };
  materials.gem = { ramp: accent, texture: "smooth" };
  materials.light = { ramp: accent, texture: "smooth" };
  const options = { materials, seed: base + 1 };
  const raster = rasterize(placed, RELIC_SIZE);
  const pixels = shade(raster, placed, options);
  rimLight(pixels, raster.owner, placed, options);
  engraveRunes(pixels, recipe.runes, forge);
  const lined = outline(pixels);
  if (tier >= 3 && named !== "crown") halo(lined, accent, tier);
  // Every pixel solid: the relic is either there or not.
  for (let at = 0; at < lined.idx.length; at += 1) if (lined.idx[at] !== EMPTY) lined.alpha[at] = 255;
  return applyColors(lined, reduceColors(lined));
}

const snapped = new Map<Shape, Shape>();

/**
 * Every part of a relic shows: a detail too thin or too small to cover a pixel center (a
 * rivet, a star, an engraved line) slips half a pixel onto the grid, away from the middle
 * so mirrored pairs stay mirrored.
 */
function onGrid(shape: Shape): Shape {
  if (shape.cut) return shape;
  const known = snapped.get(shape);
  if (known) return known;
  const covers = (candidate: Shape) => rasterize([{ shape: candidate, layer: 1 }], RELIC_SIZE).owner.some((owner) => owner === 0);
  let result = shape;
  if (!covers(shape)) {
    const x = "e" in shape ? shape.e[0] : "c" in shape ? (shape.c[0] + shape.c[2]) / 2 : 32;
    const dx = x < 32 ? -1 : 1;
    result = [[dx, 1], [dx, 0], [0, 1]].map(([mx, my]) => moveShape(shape, mx, my, false)).find(covers) ?? shape;
  }
  snapped.set(shape, result);
  return result;
}

/** The moon from the top left: lit edges take the top of their ramp, the far edges sink a step. */
function rimLight(pixels: Pixels, owner: Int16Array, placed: readonly Placed[], options: { materials: Readonly<Record<string, MaterialId | Material>>; seed: number }) {
  const size = pixels.w;
  const source = pixels.idx.slice();
  const empty = (x: number, y: number) => x < 0 || y < 0 || x >= size || y >= size || source[y * size + x] === EMPTY;
  const lit = (x: number, y: number) => !empty(x, y) && pixels.emit[y * size + x] === 1;
  /** How deep a pixel sits inside its light: 0 on the rim, 1 under it, 2 at the heart. */
  const depth = (x: number, y: number) => {
    const ring = (r: number) => [[r, 0], [-r, 0], [0, r], [0, -r]].every(([dx, dy]) => lit(x + dx, y + dy));
    return ring(1) ? (ring(2) ? 2 : 1) : 0;
  };
  /**
   * Living light burns white at its heart, its color at the rim. A gem is a lit stone: its
   * color, a darker rim away from the moon, one bright spark on its top left.
   */
  const lightColor = (x: number, y: number, ramp: readonly Pal[], living: boolean): Pal => {
    const top = ramp.length - 1;
    const level = depth(x, y);
    if (living) return level === 0 ? ramp[top - 1] : level === 1 ? ramp[top] : C.moon;
    if (!lit(x - 1, y) && !lit(x, y - 1)) return ramp[top];
    if (!lit(x + 1, y) || !lit(x, y + 1)) return ramp[Math.max(0, top - 2)];
    return ramp[top - 1];
  };
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const at = y * size + x;
      if (source[at] === EMPTY) continue;
      const shape = placed[owner[at]].shape;
      const ramp = materialOf(shape.m, options).ramp as readonly Pal[];
      if (pixels.emit[at]) {
        pixels.idx[at] = lightColor(x, y, ramp, shape.m === "light");
        continue;
      }
      const step = ramp.indexOf(source[at]);
      if (step < 0) continue;
      const top = ramp.length - 1;
      // Regular patterns of matter: mail rings in a checker, a grip wrapped in bands.
      if ((shape.m === "chain" && (x + y) % 2 === 1) || (shape.m === "wrap" && (x - y + 99) % 3 === 0)) {
        pixels.idx[at] = ramp[Math.max(0, step - 1)];
        continue;
      }
      if (empty(x - 1, y) || empty(x, y - 1)) pixels.idx[at] = ramp[Math.min(top, Math.max(step + 1, top - 1))];
      else if (empty(x + 1, y) || empty(x, y + 1)) pixels.idx[at] = ramp[Math.max(0, step - 1)];
    }
  }
}

/**
 * Runes of fire along the relic's rune line, one every fifth of it: each a burning stroke
 * cut into the matter, its groove darker around it. At the cap, a seam of fire joins them.
 */
function engraveRunes(pixels: Pixels, line: readonly [number, number, number, number], forge: number) {
  const count = forgeRunes(forge);
  if (count === 0) return;
  const size = pixels.w;
  const scale = size / 64;
  const [x1, y1, x2, y2] = line.map((value) => value * scale);
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < size && y < size && pixels.idx[y * size + x] !== EMPTY;
  const burning = new Set<number>();
  const burn = (x: number, y: number, pal: Pal) => {
    if (!inside(x, y)) return;
    const at = y * size + x;
    pixels.idx[at] = pal;
    pixels.emit[at] = 1;
    burning.add(at);
  };
  const matter = (x: number, y: number) => inside(x, y) && !pixels.emit[y * size + x];
  /** A point of the line, settled on the nearest matter of the relic (a ring's line crosses its hole). */
  const point = (t: number): [number, number] => {
    const x = Math.floor(x1 + (x2 - x1) * t);
    const y = Math.floor(y1 + (y2 - y1) * t);
    for (let reach = 0; reach <= 3; reach += 1) {
      for (let dy = -reach; dy <= reach; dy += 1) {
        for (let dx = -reach; dx <= reach; dx += 1) {
          const at = (y + dy) * size + x + dx;
          if (Math.max(Math.abs(dx), Math.abs(dy)) === reach && matter(x + dx, y + dy) && !taken.has(at)) return [x + dx, y + dy];
        }
      }
    }
    return [x, y];
  };
  const taken = new Set<number>();
  const runes = Array.from({ length: count }, (_, rune) => {
    const [x, y] = point(rune / (RUNE_SLOTS - 1));
    for (const [dx, dy] of [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]]) taken.add((y + dy) * size + x + dx);
    return [x, y];
  });
  if (count === RUNE_SLOTS) {
    const steps = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)));
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps;
      const x = Math.floor(x1 + (x2 - x1) * t);
      const y = Math.floor(y1 + (y2 - y1) * t);
      if (matter(x, y)) burn(x, y, C.ember);
    }
  }
  for (const [x, y] of runes) {
    burn(x, y, C.goldLight);
    if (matter(x, y + 1)) burn(x, y + 1, C.amber);
  }
  // The groove: the matter around each stroke sinks into its shadow.
  for (const at of burning) {
    const x = at % size;
    const y = Math.floor(at / size);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const near = (y + dy) * size + x + dx;
      if (!inside(x + dx, y + dy) || burning.has(near) || pixels.emit[near]) continue;
      pixels.idx[near] = darker(pixels.idx[near]);
    }
  }
}

/**
 * Light around a legendary or mythic relic: rings of dithered pixels about the middle of
 * the icon, in the rarity's ramp, never touching the relic. A legendary relic has one
 * faint ring, a mythic one three, brighter toward the relic.
 */
function halo(pixels: Pixels, ramp: readonly Pal[], tier: number) {
  const size = pixels.w;
  const source = pixels.idx.slice();
  const near = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && source[ny * size + nx] !== EMPTY) return true;
    }
    return false;
  };
  // [radius, step counted down from the top of the ramp, dither]
  const rings = tier >= 4 ? [[15.5, 3, 4], [13, 2, 2], [10.5, 1, 4]] : [[14.5, 1, 4]];
  const middle = (size - 1) / 2;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (source[y * size + x] !== EMPTY || near(x, y)) continue;
      const d = Math.sqrt((x - middle) ** 2 + (y - middle) ** 2);
      for (const [radius, step, dither] of rings) {
        if (Math.abs(d - radius) > 0.6) continue;
        if (dither === 2 ? (x + y) % 2 !== 0 : (x + y) % 4 !== 0 || x % 2 !== 0) continue;
        const at = y * size + x;
        pixels.idx[at] = ramp[Math.max(0, ramp.length - 1 - step)];
        pixels.alpha[at] = 255;
        pixels.emit[at] = 1;
        break;
      }
    }
  }
}

/** A hand-drawn in-world icon (16 × 16): its pixels through `ICON_INK`, then the ink outline. */
export function renderIcon(recipe: IconRecipe): Pixels {
  const pixels = outline(paintMask({ rows: recipe.rows, legend: ICON_INK }, [], recipe.glow ?? ""));
  return applyColors(pixels, reduceColors(pixels));
}

export const CRYSTAL_FRAMES = CRYSTAL_FACETS.length;

/** The crystal at one frame of its shine: one facet at a time takes the lightest step. */
export function renderCrystal(frame: number): Pixels {
  const lit = CRYSTAL_FACETS[((frame % CRYSTAL_FRAMES) + CRYSTAL_FRAMES) % CRYSTAL_FRAMES];
  const legend = { ...CRYSTAL_MASK.legend, [lit]: 3 };
  return outline(paintMask({ rows: CRYSTAL_MASK.rows, legend }, RAMPS.essence, lit));
}
