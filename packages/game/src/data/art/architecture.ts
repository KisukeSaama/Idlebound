/**
 * Buildings and ruins of the scenes (BIBLE 7, 18.7): built from pieces the way the
 * creatures are drawn from materials. A piece is a volume (a wall facing the walker, a
 * wall turned to the side, a round tower, a roof), a finish (how its stones, boards or
 * thatch are laid), and a material slot the scene's ramps color. Openings, beams and small
 * hand-drawn details (decor) go on top. The generator shades each volume by its shape and
 * the moon's side, lays the finish in clusters, outlines it, rims it in moonlight, grows
 * moss and ivy over it, and wears it down era after era.
 *
 * Coordinates are pixels of the structure's own box, origin top left; the last row stands
 * on the ground. Numbers only: no text.
 */

/** Material slots: each scene gives every slot a ramp, darkest first. */
export type StructureMaterial = "stone" | "wood" | "roof" | "metal" | "cloth" | "bark" | "rock" | "crystal" | "bone";

/** How a surface is laid. Every finish is a regular pattern of clusters, never noise. */
export type Finish =
  | "ashlar" // courses of dressed stone
  | "rubble" // fieldstones of every size, mortared
  | "planks" // vertical boards
  | "boards" // horizontal boards
  | "thatch" // straw in combed strokes
  | "shingle" // wooden shingles in staggered rows
  | "bark" // wavy vertical grain
  | "rock"; // raw rock in flat facets

/** A wall facing the walker, lit flat; the finish carries its shading. */
export interface BlockPiece {
  block: readonly [number, number, number, number];
  m: StructureMaterial;
  finish?: Finish;
  /** A wall turned to the side: lit when it faces the moon, in shade otherwise. */
  side?: "left" | "right";
  /** Ramp steps added to the whole piece (+ lighter, - darker). */
  lift?: number;
}

/** A free shape (a leaning wall, a broken gable), lit like a block. */
export interface PolyPiece {
  poly: readonly number[];
  m: StructureMaterial;
  finish?: Finish;
  side?: "left" | "right";
  lift?: number;
}

/** A round volume (a tower, a trunk, a pillar): shaded across its width. */
export interface CylinderPiece {
  cyl: readonly [number, number, number, number];
  m: StructureMaterial;
  finish?: Finish;
  lift?: number;
}

/** A roof over a box: two slopes (gable), or a spire. */
export interface RoofPiece {
  roof: readonly [number, number, number, number];
  m: StructureMaterial;
  style: "gable" | "spire";
  finish?: Finish;
  lift?: number;
}

/** A window, a door, an arch: dark inside, or lit (it then gives light). */
export interface GapPiece {
  gap: readonly [number, number, number, number];
  style: "window" | "arch" | "door" | "slit";
  lit?: boolean;
  /** Frame and mullions: a material, or none. */
  frame?: StructureMaterial;
}

/** A beam, a post, a root, a bough: a thick line, curved by `sag`, thinning to `taper`. */
export interface BeamPiece {
  beam: readonly [number, number, number, number];
  width: number;
  taper?: number;
  /** Pixels its middle bows out, to the left of its direction (negative: to the right). */
  sag?: number;
  m: StructureMaterial;
  finish?: Finish;
  lift?: number;
}

/** A small detail drawn by hand (a lantern, a banner, an owl), bottom left at `at`. */
export interface DecorPiece {
  decor: string;
  at: readonly [number, number];
  flip?: boolean;
  /** Kept whole when the structure wears down (a lantern on the post that still stands). */
  keep?: boolean;
}

/** Carves the shape out of what is drawn before it (a breach, a fallen corner). */
export interface CutPiece {
  cut: readonly number[];
}

export type StructurePiece = BlockPiece | PolyPiece | CylinderPiece | RoofPiece | GapPiece | BeamPiece | DecorPiece | CutPiece;

export interface StructureRecipe {
  w: number;
  h: number;
  pieces: readonly StructurePiece[];
  /** Rows (from the top) that fall first as the eras wear it down: roofs, crenels, upper floors. */
  fragile: number;
  /** How much ivy and moss it carries at the present night, 0 to 1. */
  growth: number;
  seed: number;
}

/**
 * A detail drawn by hand, one character per pixel, `.` empty. Each other character is a
 * key of the legend: a material and its ramp step (0 darkest, clamped to the ramp), the
 * scene's light or its heart, or the outline.
 */
export interface DecorGrid {
  rows: readonly string[];
  legend: Readonly<Record<string, readonly [StructureMaterial, number] | "glow" | "core" | "outline">>;
  /** Frames of its own motion (a banner in the wind, a flame, an owl's blink): patches over the rows. */
  frames?: readonly (readonly { x: number; y: number; rows: readonly string[] }[])[];
}
