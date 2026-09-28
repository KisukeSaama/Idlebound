/**
 * Materials to palette colors: light from the top left on the normals left by the
 * rasterizer, a surface texture per material (fur strokes, stone cracks, bark streaks…),
 * quantized to the material's hue-shifted ramp, then the 1 px selective outline.
 */
import { C, MATERIALS, ORVANE_64, palLuma, palRgb, type Material, type MaterialId, type Pal, type Texture } from "@idlebound/game/art";
import { createPixels, EMPTY, type Pixels } from "./pixels";
import type { Placed, Raster } from "./raster";

export interface Light {
  x: number;
  y: number;
  z: number;
}

/** Top left, a little toward the viewer. */
export const TOP_LEFT: Light = { x: -0.55, y: -0.7, z: 0.45 };

export interface ShadeOptions {
  /** Material of each slot: a shared material, or one made on the spot (portraits). */
  materials: Readonly<Record<string, MaterialId | Material>>;
  seed: number;
  light?: Light;
  /** Shift of every pixel along its ramp (negative: heavier, darker). */
  bias?: number;
  /** Limits every ramp to this many steps (soft ramps). */
  steps?: number;
  /** Replaces a material by another one (era treatments). */
  swap?: (id: MaterialId, slot: string) => MaterialId;
}

export function materialOf(slot: string, options: ShadeOptions): Material {
  const base = options.materials[slot] ?? options.materials.body ?? "stone";
  if (typeof base !== "string") return base;
  return MATERIALS[options.swap ? options.swap(base, slot) : base];
}

/**
 * Offset along the ramp added by a material's surface. The world is flat pixel art: no
 * grain, no per-pixel noise, only volumes in bands of color; metal keeps its sharp glint.
 */
function texture(kind: Texture, light: number): number {
  return kind === "metal" && light > 0.78 ? 2 : 0;
}

/** Shades a raster into palette colors (no outline yet). */
export function shade(raster: Raster, placed: readonly Placed[], options: ShadeOptions): Pixels {
  const size = raster.size;
  const out = createPixels(size, size);
  const light = options.light ?? TOP_LEFT;
  const norm = Math.sqrt(light.x * light.x + light.y * light.y + light.z * light.z);
  const lx = light.x / norm;
  const ly = light.y / norm;
  const lz = light.z / norm;
  // Lowest drawn row: the underside of a creature sits in its own shadow.
  let bottom = 0;
  for (let at = 0; at < raster.owner.length; at += 1) if (raster.owner[at] >= 0) bottom = Math.floor(at / size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const at = y * size + x;
      const owner = raster.owner[at];
      if (owner < 0) continue;
      const shape = placed[owner].shape;
      const material = materialOf(shape.m, options);
      const ramp = material.ramp;
      const top = ramp.length - 1;
      if (shape.glow) {
        // Light sources are flat and bright: the two lightest steps, brighter at the core.
        const core = raster.nz[at] > 0.55 ? top : top - 1;
        out.idx[at] = ramp[Math.max(0, core)];
        out.alpha[at] = 255;
        out.emit[at] = 1;
        continue;
      }
      let diffuse = raster.nx[at] * lx + raster.ny[at] * ly + raster.nz[at] * lz;
      if (shape.flat) diffuse = 0.35 + diffuse * 0.25;
      if (material.texture === "crystal") {
        // Facets: the normal snapped to a few directions, each lit as one plane.
        const facet = Math.floor((raster.nx[at] + 1) * 1.5) + Math.floor((raster.ny[at] + 1) * 1.5) * 3;
        diffuse = [0.9, 0.7, 0.4, 0.75, 0.55, 0.1, 0.45, 0.2, -0.3][Math.min(8, facet)];
      }
      if (material.texture === "metal") diffuse *= 1.35;
      // A face turned to the viewer sits mid-ramp; the rims toward the light reach the top.
      let pos = (0.5 + (diffuse - 0.45) * 0.75) * top;
      pos += texture(material.texture, diffuse);
      if (shape.far) pos -= 1;
      if (shape.lift) pos += shape.lift;
      if (bottom > 0 && y > bottom - size * 0.12) pos -= 0.7;
      pos += options.bias ?? 0;
      // Separation line where another part lies over this one.
      for (const [nx, ny] of [[0, -1], [-1, 0], [1, 0], [0, 1]] as const) {
        if (x + nx < 0 || x + nx >= size || y + ny < 0 || y + ny >= size) continue;
        const other = raster.owner[(y + ny) * size + (x + nx)];
        if (other > owner && placed[other].shape.m !== shape.m && !placed[other].shape.glow) {
          pos -= 1.1;
          break;
        }
      }
      let step = Math.round(pos);
      if (options.steps && options.steps < ramp.length) {
        // Soft ramps: only a dark and a light step survive.
        step = step >= top / 2 ? top - 1 : 1;
      }
      step = step < 0 ? 0 : step > top ? top : step;
      out.idx[at] = ramp[step];
      out.alpha[at] = material.texture === "ghost" ? (raster.nz[at] > 0.35 ? 235 : 160) : 255;
    }
  }
  return out;
}

/**
 * The darker neighbor of every palette entry: the color an outline takes next to it. Found
 * by hue-shifting toward violet and darkening, then snapping back into the Orvane 64.
 */
const DARKER: Pal[] = ORVANE_64.map((_, index) => {
  const [r, g, b] = palRgb(index);
  const target = [r * 0.38, g * 0.32, b * 0.42 + 12];
  let best: Pal = C.ink;
  let bestDistance = Infinity;
  for (let other = 0; other < ORVANE_64.length; other += 1) {
    if (palLuma(other) >= palLuma(index) - 12 && other !== C.ink) continue;
    const [pr, pg, pb] = palRgb(other);
    const distance = 2 * (pr - target[0]) ** 2 + 4 * (pg - target[1]) ** 2 + 3 * (pb - target[2]) ** 2;
    if (distance < bestDistance) {
      best = other;
      bestDistance = distance;
    }
  }
  return best;
});

export function darker(pal: Pal): Pal {
  return DARKER[pal];
}

/**
 * The selective outline: every empty pixel touching the sprite takes a darker version of
 * the color it touches; under the sprite, where it meets the ground, pure ink. Pixels next
 * to light only (flames, wisps) get no outline, so light keeps a soft edge.
 */
export function outline(source: Pixels, override?: Pal): Pixels {
  const { w, h } = source;
  const out: Pixels = { w, h, idx: source.idx.slice(), alpha: source.alpha.slice(), emit: source.emit.slice() };
  const filled = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && source.idx[y * w + x] !== EMPTY;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const at = y * w + x;
      if (source.idx[at] !== EMPTY) continue;
      let color: number = EMPTY;
      for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]] as const) {
        if (!filled(x + dx, y + dy)) continue;
        const near = (y + dy) * w + (x + dx);
        if (source.emit[near]) continue;
        color = DARKER[source.idx[near]];
        break;
      }
      if (color === EMPTY) continue;
      // The underside meets the ground: pure ink.
      if (filled(x, y - 1) && !filled(x, y + 1)) color = C.ink;
      out.idx[at] = override ?? color;
      out.alpha[at] = 255;
    }
  }
  return out;
}
