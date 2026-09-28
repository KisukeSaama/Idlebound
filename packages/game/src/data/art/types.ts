import type { Material, MaterialId, Pal } from "./palette";

/**
 * Shapes (relics, portraits, scene props) are drawn in a 64 × 64 design space, whatever the
 * size of the sprite, scaled to its pixels. Origin top left.
 */
export interface ShapeFlags {
  /** Material slot of the recipe (`body`, `head`, `horn`…). */
  m: string;
  /** Also drawn mirrored around x = 32 (symmetric bodies). */
  mirror?: boolean;
  /** Carves the silhouette instead of adding to it. */
  cut?: boolean;
  /** Far side of the body: one step darker. */
  far?: boolean;
  /** No volume shading: lit as a flat plane. */
  flat?: boolean;
  /** Light it gives off: never shaded, never touched by era palettes. */
  glow?: boolean;
  /** Shading offset in ramp steps (+1 lighter, -1 darker). */
  lift?: number;
}

/** Ellipse: center and radii. */
export type Ellipse = ShapeFlags & { e: readonly [number, number, number, number] };
/** Capsule: a segment from (x1, y1) radius r1 to (x2, y2) radius r2 (limbs, tails, horns). */
export type Capsule = ShapeFlags & { c: readonly [number, number, number, number, number, number] };
/** Polygon: x, y pairs (ears, blades, crowns, wings). */
export type Poly = ShapeFlags & { p: readonly number[] };
/** Rectangle: x, y, width, height. */
export type Rect = ShapeFlags & { r: readonly [number, number, number, number] };

export type Shape = Ellipse | Capsule | Poly | Rect;

export type CreatureRank = "normal" | "elite" | "guardian" | "king" | "treasure";

/**
 * A color of a creature grid: a step of the ramp of a material slot (so era treatments can
 * swap the material and keep the drawing), or a fixed palette entry. `glow` marks light:
 * never shaded, never touched by era palettes. Glow is an eye, closed by a blink, unless
 * `light` marks it as a source of light (a flame, a lantern, a window, runes, a rift), which
 * never goes out. `over` pixels are drawn after the outline and take none (whiskers, hairs).
 */
export type GridInk = { m: string; step: number; over?: boolean } | { pal: Pal; glow?: boolean; light?: boolean };

/**
 * A creature drawn by hand, pixel by pixel: one character per pixel, `.` empty. The last
 * row stands on the ground; the creature faces left, toward the company. No outline in the
 * rows: the generator adds it, in the color of the era.
 */
export interface CreatureGrid {
  rows: readonly string[];
  legend: Readonly<Record<string, GridInk>>;
  idle: {
    /** Rows above this one rise with the breath. */
    waist: number;
    /** Pixels the upper body rises, frame by frame: one entry per idle frame. */
    breath: readonly number[];
    /** Patches drawn over the rows on some frames (a snarl, a flick of the tail): `.` keeps, `_` erases. */
    twitch?: { frames: readonly number[]; patches: readonly { x: number; y: number; rows: readonly string[] }[] };
  };
}

/** A creature: its grid, the material of each slot of its legend, and its rank. */
export interface CreatureRecipe {
  id: string;
  rank?: CreatureRank;
  /** Material of each slot of the legend. */
  materials: Readonly<Record<string, MaterialId>>;
  grid: CreatureGrid;
  /** Seed of its era effects (the Void's holes, the Stars' specks). */
  seed: number;
}

/** A recipe with its rank filled in. */
export type ResolvedRecipe = CreatureRecipe & { rank: CreatureRank };

/**
 * Small hand-authored pixel art: rows of characters, one per pixel. `.` is empty; every
 * other character is a key of the legend.
 */
export interface PixelMask {
  rows: readonly string[];
  /** Character to a ramp step (0 darkest) or to a fixed palette entry (`#` prefix: `{ pal }`). */
  legend: Readonly<Record<string, number | { pal: Pal }>>;
}

/**
 * A companion's portrait (BIBLE 18.8): a 64 × 64 bust painted at a higher resolution and
 * traced into clusters, one character per pixel, `.` empty, turned three-quarters toward
 * the monsters (to the right). The face stays in the middle, so the small frames that crop
 * the edges keep it. No outline in the rows: the generator adds it.
 */
export interface PortraitGrid {
  rows: readonly string[];
  legend: Readonly<Record<string, GridInk>>;
}

/** A portrait: its grid and the material of each slot; `hero` is the ramp of the companion's color. */
export interface PortraitRecipe {
  grid: PortraitGrid;
  materials: Readonly<Record<string, MaterialId | Material | "hero">>;
}
