import type { ItemSlot } from "../../types";
import { C, type Material, type MaterialId } from "./palette";
import type { Shape, ShapeFlags } from "./types";

/**
 * Relic icons (BIBLE 18.8), drawn at 32 × 32 in the 64-unit design space (2 units a pixel).
 * A base is one object drawn five times: each part says from which rarity (0 common to 4
 * mythic) it appears and until which it stays, so a common blade is short, chipped and
 * dull, a rare one gains a guard and a set stone, an epic one engravings and gems, a
 * legendary one gold filigree and a heroic size, a mythic one sky-glass and living light.
 * `runes` is the line the forge engraves its runes along.
 */
export type RelicPart = Shape & {
  /** First rarity drawing this part (0 common … 4 mythic). */
  from?: number;
  /** Last rarity drawing it. */
  to?: number;
};

export interface RelicRecipe {
  parts: readonly RelicPart[];
  /** Where the forge's runes are engraved: x1, y1, x2, y2 in design units. */
  runes: readonly [number, number, number, number];
}

type Flags = Omit<ShapeFlags, "m"> & { from?: number; to?: number };

// ---------------------------------------------------------------------------------------
// Drawing helpers: blades are authored along their own axis, from the pommel (bottom left)
// to the point (top right), and turned onto the diagonal of the icon.

const H = Math.SQRT1_2;
/** Origin of the diagonal axis, the pommel's corner. */
const AX = 7;
const AY = 57;

/** A point `t` units along the diagonal and `s` units across it (positive: down right). */
function at(t: number, s: number): [number, number] {
  return [AX + (t + s) * H, AY + (s - t) * H];
}

/** A polygon authored along the diagonal: pairs of (t, s). */
export function along(points: readonly number[], m: string, flags: Flags = {}): RelicPart {
  const p: number[] = [];
  for (let i = 0; i < points.length; i += 2) p.push(...at(points[i], points[i + 1]));
  return { p, m, ...flags };
}

/** A capsule authored along the diagonal. */
export function rod(t1: number, s1: number, t2: number, s2: number, r1: number, r2: number, m: string, flags: Flags = {}): RelicPart {
  const [x1, y1] = at(t1, s1);
  const [x2, y2] = at(t2, s2);
  return { c: [x1, y1, x2, y2, r1, r2], m, ...flags };
}

/** A round part (pommel, gem, stud) on the diagonal. */
export function knob(t: number, s: number, rx: number, ry: number, m: string, flags: Flags = {}): RelicPart {
  const [x, y] = at(t, s);
  return { e: [x, y, rx, ry], m, ...flags };
}

/** A polygon mirrored around the vertical middle line (x = 32): only the left half is authored. */
export function sym(points: readonly number[], m: string, flags: Flags = {}): RelicPart {
  const p: number[] = [...points];
  for (let i = points.length - 2; i >= 0; i -= 2) if (points[i] !== 32) p.push(64 - points[i], points[i + 1]);
  return { p, m, ...flags };
}

/** A shape and its mirror image around x = 32 (pauldrons, studs, chains). */
export function pair(shape: RelicPart): RelicPart[] {
  if ("e" in shape) return [shape, { ...shape, e: [64 - shape.e[0], shape.e[1], shape.e[2], shape.e[3]] }];
  if ("c" in shape) return [shape, { ...shape, c: [64 - shape.c[0], shape.c[1], 64 - shape.c[2], shape.c[3], shape.c[4], shape.c[5]] }];
  if ("r" in shape) return [shape, { ...shape, r: [64 - shape.r[0] - shape.r[2], shape.r[1], shape.r[2], shape.r[3]] }];
  const p: number[] = [];
  for (let i = 0; i < shape.p.length; i += 2) p.push(64 - shape.p[i], shape.p[i + 1]);
  return [shape, { ...shape, p }];
}

/** One pixel of the 32 × 32 grid, or a block of them (engravings, glints, stars). */
export function px(x: number, y: number, m: string, flags: Flags = {}, w = 1, h = 1): RelicPart {
  return { r: [x * 2 + 0.2, y * 2 + 0.2, w * 2 - 0.4, h * 2 - 0.4], m, ...flags };
}

// ---------------------------------------------------------------------------------------
// Matter by rarity. Recipes name a role (`steel`, `trim`, `wrap`…); each rarity gives the
// role its matter: dull iron and old leather, then steel and brass, silver, gold, and the
// Sky-Glass. `gem` and `light` always take the rarity's own ramp (its color of RARITY_INFO).

const IRON: Material = { ramp: [C.night3, C.dusk, C.haze, C.lilac], texture: "smooth" };
const STEEL: Material = { ramp: [C.vault1, C.vault2, C.haze, C.lilac, C.moon], texture: "smooth" };
/** Blued steel: darker, cooler, so silver rims and gems stand out on it. */
const BLUED: Material = { ramp: [C.night3, C.night4, C.keepStone, C.haze, C.pale], texture: "smooth" };
const SILVER: Material = { ramp: [C.night4, C.haze, C.lilac, C.pale, C.moon], texture: "smooth" };
const BRASS: Material = { ramp: [C.goldInk, C.goldDeep, C.goldDark, C.gold], texture: "smooth" };
const GOLD: Material = { ramp: [C.goldInk, C.goldDeep, C.goldDark, C.gold, C.goldLight], texture: "smooth" };
const OLD_LEATHER: Material = { ramp: [C.night1, C.flesh0, C.fur1, C.fur2], texture: "smooth" };
const LEATHER: Material = { ramp: [C.flesh0, C.fur1, C.fur2, C.fur3], texture: "smooth" };
const OLD_WOOD: Material = { ramp: [C.night1, C.flesh0, C.fur1, C.fur2], texture: "bark" };
const WOOD: Material = { ramp: [C.flesh0, C.fur1, C.fur2, C.fur3], texture: "bark" };
const EBONY: Material = { ramp: [C.ink, C.night2, C.night4, C.dusk], texture: "bark" };
const ROSEWOOD: Material = { ramp: [C.night1, C.flesh0, C.flesh1, C.fur2], texture: "bark" };
const RUST: Material = { ramp: [C.night1, C.flesh0, C.flesh1], texture: "smooth" };
const SACKCLOTH: Material = { ramp: [C.night2, C.flesh0, C.fur1, C.fur2], texture: "cloth" };
/** The Sky-Glass: night held in a pane, cut in facets. */
const SKY: Material = { ramp: [C.night2, C.vault1, C.vault2, C.vault3, C.shard], texture: "crystal" };
const VOID_METAL: Material = { ramp: [C.night2, C.night4, C.dusk, C.amethyst], texture: "smooth" };
const GLINT: Material = { ramp: [C.moon], texture: "smooth" };
const STAR: Material = { ramp: [C.shardLight, C.moon], texture: "smooth" };

/** A matter, or `rarity`: the ramp of the relic's rarity color. */
export type RelicMatter = MaterialId | Material | "rarity";

/** The matter of each role, rarity by rarity (common, rare, epic, legendary, mythic). */
export const RELIC_TIERS: readonly Readonly<Record<string, RelicMatter>>[] = [
  { steel: IRON, edge: IRON, trim: IRON, wrap: OLD_LEATHER, strap: OLD_LEATHER, wood: OLD_WOOD, cloth: SACKCLOTH, chain: IRON, rust: RUST, glint: GLINT, star: STAR },
  { steel: STEEL, edge: STEEL, trim: BRASS, wrap: LEATHER, strap: LEATHER, wood: WOOD, cloth: "rarity", chain: STEEL, rust: RUST, glint: GLINT, star: STAR },
  { steel: BLUED, edge: SILVER, trim: SILVER, wrap: "royal", strap: LEATHER, wood: EBONY, cloth: "rarity", chain: SILVER, rust: RUST, glint: GLINT, star: STAR },
  { steel: SILVER, edge: SILVER, trim: GOLD, wrap: "cloth-red", strap: GOLD, wood: ROSEWOOD, cloth: "cloth-red", chain: GOLD, rust: RUST, glint: GLINT, star: STAR },
  { steel: SKY, edge: SILVER, trim: SILVER, wrap: VOID_METAL, strap: VOID_METAL, wood: VOID_METAL, cloth: SKY, chain: SKY, rust: RUST, glint: GLINT, star: STAR }
];

// ---------------------------------------------------------------------------------------
// The 20 base shapes of `SLOT_BASE_COUNT`.

/** Flags of a part drawn by one rarity only, or from one rarity on. */
const only = (tier: number, flags: Flags = {}): Flags => ({ from: tier, to: tier, ...flags });
const upFrom = (tier: number, flags: Flags = {}): Flags => ({ from: tier, ...flags });
const line = (t1: number, t2: number, s = 0): [number, number, number, number] => [...at(t1, s), ...at(t2, s)];

/** A short single-edged blade that grows into a great cleaver. */
const blade: RelicRecipe = {
  runes: line(20, 40, -1),
  parts: [
    // Common: a plain seax, a wooden grip, no guard, two chips and a spot of rust.
    along([14, -3, 42, -3, 47, -1, 42, 3.6, 26, 4, 14, 3.2], "steel", only(0)),
    along([14, 0.5, 26, 1.2, 42, 1.2, 46, -1, 14, -1], "edge", only(0, { lift: 1 })),
    along([23, 4.5, 25, 2.2, 27, 4.5], "steel", only(0, { cut: true })),
    along([35, 4.5, 36.5, 2.6, 38, 4.5], "steel", only(0, { cut: true })),
    knob(31, -1, 1.5, 1.5, "rust", only(0)),
    rod(13, -3.6, 13, 3.6, 1.4, 1.4, "trim", only(0)),
    rod(4, 0, 12, 0, 2.4, 2.4, "wood", only(0)),
    knob(8, 0, 1, 1, "trim", only(0)),
    // Rare: a falchion, a fuller, a brass guard, a wrapped grip, a set stone in the pommel.
    along([15, -3.4, 50, -3.4, 56, -2, 55, 2, 46, 6.5, 30, 5, 15, 3.6], "steel", only(1)),
    along([15, 0.5, 30, 2, 46, 4, 54, 1, 54, -1, 15, -1], "edge", only(1, { lift: 1 })),
    rod(18, -1.4, 46, -1.4, 0.8, 0.8, "steel", only(1, { lift: -2 })),
    rod(14, -6.5, 14, 6.5, 2, 2, "trim", only(1)),
    rod(5, 0, 12.5, 0, 2.6, 2.6, "wrap", only(1)),
    knob(3, 0, 3.2, 3.2, "trim", only(1)),
    knob(3, 0, 1.5, 1.5, "gem", only(1, { glow: true })),
    // Epic: a clipped point and a spine tooth, engraved diamonds, an S-guard, a gem at the heart.
    along([16, -3.8, 56, -3.8, 60, -3, 63, -7, 62, 0.5, 52, 7.5, 32, 6, 16, 4], "steel", only(2)),
    along([16, 1.2, 32, 3, 50, 5, 60, 0.5, 60, -1, 16, -1], "edge", only(2, { lift: 1 })),
    knob(28, -1.8, 1.2, 1.2, "steel", only(2, { lift: -3 })),
    knob(37, -1.8, 1.2, 1.2, "steel", only(2, { lift: -3 })),
    knob(46, -1.8, 1.2, 1.2, "steel", only(2, { lift: -3 })),
    along([11, -9, 15, -11, 17.5, -4, 17.5, 4, 15, 11, 11, 9, 14, 4, 14, -4], "trim", only(2)),
    knob(20.5, 0, 1.9, 1.9, "gem", only(2, { glow: true })),
    rod(5, 0, 12, 0, 2.6, 2.6, "wrap", only(2)),
    knob(2.6, 0, 3.4, 3.4, "trim", only(2)),
    knob(2.6, 0, 1.5, 1.5, "gem", only(2, { glow: true })),
    // Legendary: a great cleaver, gold along its spine and curling off it, a gold shell guard.
    along([17, -4.5, 58, -4.5, 66, -3, 71, -9, 69, 0, 59, 10, 36, 8.5, 17, 5.5], "steel", only(3)),
    along([17, 2, 36, 4.5, 57, 6, 67, 0, 67, -1.5, 17, -1.5], "edge", only(3, { lift: 1 })),
    rod(20, -3.2, 60, -3.2, 1, 1, "trim", only(3)),
    knob(30, -6, 1.8, 1.8, "trim", only(3)),
    knob(42, -6, 1.8, 1.8, "trim", only(3)),
    knob(54, -6, 1.8, 1.8, "trim", only(3)),
    along([10, -8, 13, -15, 19, -18, 18, -10, 21, -5, 21, 5, 18, 10, 19, 18, 13, 15, 10, 8], "trim", only(3)),
    knob(16, 0, 2.8, 2.8, "gem", only(3, { glow: true })),
    rod(5, 0, 10, 0, 2.8, 2.8, "wrap", only(3)),
    knob(2.4, 0, 4, 4, "trim", only(3)),
    knob(2.4, 0, 1.8, 1.8, "gem", only(3, { glow: true })),
    // Mythic: a curve of Sky-Glass, a light along its edge, shards flying off its spine.
    along([17, -4, 56, -4, 64, -9, 67, -2, 58, 8.5, 36, 7.5, 17, 4.5], "steel", upFrom(4)),
    rod(21, 2, 56, 2.5, 1.2, 0.6, "light", upFrom(4, { glow: true })),
    along([62, -14, 68, -12, 64, -9.5], "steel", upFrom(4)),
    along([50, -9, 55, -8, 51, -6.5], "steel", upFrom(4)),
    along([69, 3, 73, 6, 68, 7], "steel", upFrom(4)),
    knob(44, -1, 0.9, 0.9, "star", upFrom(4, { glow: true })),
    knob(32, 1, 0.9, 0.9, "star", upFrom(4, { glow: true })),
    along([11, -6, 12, -15, 19, -11, 20, -4, 20, 4, 19, 11, 12, 15, 11, 6], "trim", upFrom(4)),
    rod(5, 0, 10.5, 0, 2.6, 2.6, "wrap", upFrom(4)),
    knob(2.4, 0, 3.4, 3.4, "light", upFrom(4, { glow: true }))
  ]
};

/** A woodsman's axe that grows into a crescent double-bit. */
const axe: RelicRecipe = {
  runes: line(8, 44),
  parts: [
    // Common: a plain haft, a small iron wedge, a chip and rust.
    rod(2, 0, 60, 0, 1.8, 1.8, "wood", only(0)),
    along([49, 1.5, 58, 1.5, 61, 10, 54, 12, 47, 9], "steel", only(0)),
    along([50, -1.5, 57, -1.5, 56.5, -4.5, 50.5, -4.5], "steel", only(0)),
    along([56, 12.5, 57.5, 10, 59, 12], "steel", only(0, { cut: true })),
    knob(53, 5, 1.6, 1.6, "rust", only(0)),
    // Rare: a bearded head, a brass collar, a wrapped grip, a stone in the cheek.
    rod(2, 0, 64, 0, 2, 2, "wood", only(1)),
    rod(3, 0, 15, 0, 2.5, 2.5, "wrap", only(1)),
    along([50, 1.5, 61, 1.5, 67, 12, 61, 16, 45, 14, 49, 8], "steel", only(1)),
    along([51, -1.5, 60, -1.5, 59, -5, 52, -5], "steel", only(1)),
    rod(49, -3.4, 49, 3.4, 1.2, 1.2, "trim", only(1)),
    rod(62, -3.4, 62, 3.4, 1.2, 1.2, "trim", only(1)),
    knob(56, 6, 1.6, 1.6, "gem", only(1, { glow: true })),
    // Epic: a double-bit, engraved, silver bands, a spike on top, a gem at the eye.
    rod(2, 0, 66, 0, 2, 2, "wood", only(2)),
    rod(3, 0, 15, 0, 2.5, 2.5, "wrap", only(2)),
    along([49, 1.5, 61, 1.5, 67, 12, 60, 16, 46, 13, 50, 7], "steel", only(2)),
    along([49, -1.5, 61, -1.5, 67, -12, 60, -16, 46, -13, 50, -7], "steel", only(2)),
    rod(53, 5, 60, 9, 0.7, 0.7, "steel", only(2, { lift: -3 })),
    rod(53, -5, 60, -9, 0.7, 0.7, "steel", only(2, { lift: -3 })),
    rod(66, 0, 72, 0, 1.8, 0.5, "edge", only(2)),
    rod(48, -3.6, 48, 3.6, 1.2, 1.2, "trim", only(2)),
    rod(62.5, -3.6, 62.5, 3.6, 1.2, 1.2, "trim", only(2)),
    knob(55.5, 0, 2, 2, "gem", only(2, { glow: true })),
    // Legendary: a great crescent double-bit, gold along its edges, a gold-shod haft.
    rod(1, 0, 64, 0, 2.2, 2.2, "wood", only(3)),
    rod(2, 0, 13, 0, 2.7, 2.7, "wrap", only(3)),
    along([47, 1.5, 63, 1.5, 73, 10, 68, 20, 56, 16, 42, 18, 47, 8], "steel", only(3)),
    along([47, -1.5, 63, -1.5, 73, -10, 68, -20, 56, -16, 42, -18, 47, -8], "steel", only(3)),
    rod(47, 8, 56, 14, 0.9, 0.9, "trim", only(3)),
    rod(47, -8, 56, -14, 0.9, 0.9, "trim", only(3)),
    rod(64, 0, 71, 0, 2.4, 0.6, "trim", only(3)),
    rod(28, -2.8, 28, 2.8, 1, 1, "trim", only(3)),
    knob(1, 0, 3, 3, "trim", only(3)),
    knob(55, 0, 2.8, 2.8, "gem", only(3, { glow: true })),
    // Mythic: two crescents of Sky-Glass held apart from the haft by light alone.
    rod(1, 0, 62, 0, 2, 2, "wood", upFrom(4)),
    along([50, 4, 62, 4, 71, 13, 66, 20, 55, 16, 44, 18, 49, 10], "steel", upFrom(4)),
    along([50, -4, 62, -4, 71, -13, 66, -20, 55, -16, 44, -18, 49, -10], "steel", upFrom(4)),
    rod(51, 2.4, 61, 2.4, 0.7, 0.7, "light", upFrom(4, { glow: true })),
    rod(51, -2.4, 61, -2.4, 0.7, 0.7, "light", upFrom(4, { glow: true })),
    knob(56, 0, 2.2, 2.2, "light", upFrom(4, { glow: true })),
    along([72, -2, 76, 0, 72, 2, 69, 0], "steel", upFrom(4)),
    along([38, 20, 42, 23, 37, 24], "steel", upFrom(4)),
    knob(60, 10, 0.9, 0.9, "star", upFrom(4, { glow: true })),
    knob(58, -12, 0.9, 0.9, "star", upFrom(4, { glow: true })),
    knob(1, 0, 2.8, 2.8, "light", upFrom(4, { glow: true }))
  ]
};

/** A soldier's sword that grows into a Sky-Glass blade. */
const sword: RelicRecipe = {
  runes: line(22, 50, -2.2),
  parts: [
    // Common: a plain blade, a straight iron bar, a leather grip, a chip in the edge.
    along([15, -3.2, 48, -3.2, 54, 0, 48, 3.2, 15, 3.2], "steel", only(0)),
    along([15, 0, 48, 0, 54, 0, 48, -3.2, 15, -3.2], "edge", only(0, { lift: 1 })),
    along([32, 3.8, 34, 1.4, 36, 3.8], "steel", only(0, { cut: true })),
    knob(41, 1, 1.4, 1.4, "rust", only(0)),
    rod(14, -7, 14, 7, 1.8, 1.8, "trim", only(0)),
    rod(5, 0, 13, 0, 2.4, 2.4, "strap", only(0)),
    knob(3.5, 0, 2.8, 2.8, "trim", only(0)),
    // Rare: longer, a fuller, a curved brass guard, a set stone, a wrapped grip.
    along([15, -3.6, 54, -3.6, 61, 0, 54, 3.6, 15, 3.6], "steel", only(1)),
    along([15, 0, 54, 0, 61, 0, 54, -3.6, 15, -3.6], "edge", only(1, { lift: 1 })),
    rod(19, 0, 50, 0, 0.8, 0.8, "steel", only(1, { lift: -2 })),
    along([12, -10, 16.5, -9, 17, 0, 16.5, 9, 12, 10, 14.5, 0], "trim", only(1)),
    rod(5, 0, 13, 0, 2.6, 2.6, "wrap", only(1)),
    knob(3, 0, 3.2, 3.2, "trim", only(1)),
    knob(15.5, 0, 2, 2, "gem", only(1, { glow: true })),
    // Epic: long and keen, an engraved fuller, a swept silver guard, gems in guard and pommel.
    along([16, -4, 58, -4, 66, 0, 58, 4, 16, 4], "steel", only(2)),
    along([16, 0, 58, 0, 66, 0, 58, -4, 16, -4], "edge", only(2, { lift: 1 })),
    rod(21, 0, 54, 0, 0.8, 0.8, "steel", only(2, { lift: -3 })),
    along([11, -12, 15, -15, 18, -6, 18, 6, 15, 15, 11, 12, 14.5, 5, 14.5, -5], "trim", only(2)),
    rod(5, 0, 13, 0, 2.6, 2.6, "wrap", only(2)),
    knob(2.6, 0, 3.6, 3.6, "trim", only(2)),
    knob(2.6, 0, 1.7, 1.7, "gem", only(2, { glow: true })),
    knob(16, 0, 2.5, 2.5, "gem", only(2, { glow: true })),
    // Legendary: a broad heroic blade to the corner, gold wings for a guard, gold inlay.
    along([17, -5.5, 61, -5.5, 72, 0, 61, 5.5, 17, 5.5], "steel", only(3)),
    along([17, 0, 61, 0, 72, 0, 61, -5.5, 17, -5.5], "edge", only(3, { lift: 1 })),
    rod(20, 0, 52, 0, 1.2, 0.4, "trim", only(3)),
    along([11, -6, 13, -16, 19, -20, 17, -12, 21, -6, 21, 6, 17, 12, 19, 20, 13, 16, 11, 6], "trim", only(3)),
    rod(5, 0, 11, 0, 2.8, 2.8, "wrap", only(3)),
    knob(2.2, 0, 4, 4, "trim", only(3)),
    knob(2.2, 0, 2, 2, "gem", only(3, { glow: true })),
    knob(16, 0, 3, 3, "gem", only(3, { glow: true })),
    // Mythic: Sky-Glass, a living light in its heart, shards flying off the point.
    along([17, -5, 58, -5, 66, 0, 58, 5, 17, 5], "steel", upFrom(4)),
    rod(22, 0, 56, 0, 1.4, 0.6, "light", upFrom(4, { glow: true })),
    along([69, -3, 75, 0, 69, 3, 67, 0], "steel", upFrom(4)),
    along([61, -10, 66, -9, 62, -7], "steel", upFrom(4)),
    along([55, 9, 60, 10, 55, 12], "steel", upFrom(4)),
    knob(40, -3, 0.9, 0.9, "star", upFrom(4, { glow: true })),
    knob(30, 3, 0.9, 0.9, "star", upFrom(4, { glow: true })),
    along([12, -8, 15, -18, 20, -10, 20, 10, 15, 18, 12, 8], "trim", upFrom(4)),
    rod(5, 0, 12, 0, 2.6, 2.6, "wrap", upFrom(4)),
    knob(2.2, 0, 3.4, 3.4, "light", upFrom(4, { glow: true })),
    knob(16, 0, 2.8, 2.8, "light", upFrom(4, { glow: true }))
  ]
};

/** A mallet that grows into a war hammer, then a great maul. */
const hammer: RelicRecipe = {
  runes: line(8, 40),
  parts: [
    // Common: a plain haft and a square iron head, dented, rusted.
    rod(2, 0, 52, 0, 1.8, 1.8, "wood", only(0)),
    along([49, -7, 58, -7, 58, 7, 49, 7], "steel", only(0, { flat: true })),
    along([49, -7, 58, -7, 58, 0, 49, 0], "edge", only(0, { lift: 1, flat: true })),
    along([55, 7.6, 56.5, 5.5, 58, 7.6], "steel", only(0, { cut: true })),
    knob(52, 3, 1.5, 1.5, "rust", only(0)),
    // Rare: a heavier head banded in brass, a wrapped grip, a stone on the cheek.
    rod(2, 0, 54, 0, 2, 2, "wood", only(1)),
    rod(3, 0, 15, 0, 2.5, 2.5, "wrap", only(1)),
    along([48, -9, 60, -9, 60, 9, 48, 9], "steel", only(1, { flat: true })),
    along([48, -9, 60, -9, 60, 0, 48, 0], "edge", only(1, { lift: 1, flat: true })),
    along([47, -9.8, 50, -9.8, 50, 9.8, 47, 9.8], "trim", only(1, { flat: true })),
    along([58, -9.8, 61, -9.8, 61, 9.8, 58, 9.8], "trim", only(1, { flat: true })),
    knob(54, 0, 1.8, 1.8, "gem", only(1, { glow: true })),
    // Epic: a war hammer, a beak on its back, an engraved face, silver bands, a spike on top.
    rod(2, 0, 56, 0, 2, 2, "wood", only(2)),
    rod(3, 0, 15, 0, 2.5, 2.5, "wrap", only(2)),
    along([48, -5, 60, -5, 60, 7, 48, 7], "steel", only(2, { flat: true })),
    along([46.5, 6, 61.5, 6, 62.5, 12, 45.5, 12], "steel", only(2, { flat: true })),
    along([49.5, -5, 58.5, -5, 55, -18], "steel", only(2, { flat: true })),
    along([49.5, -5, 55, -5, 55, -18], "edge", only(2, { lift: 1, flat: true })),
    rod(48, 9, 60, 9, 0.6, 0.6, "steel", only(2, { lift: -3 })),
    rod(60, 0, 67, 0, 1.8, 0.5, "edge", only(2)),
    along([47, -6, 49, -6, 49, 7, 47, 7], "trim", only(2, { flat: true })),
    along([59, -6, 61, -6, 61, 7, 59, 7], "trim", only(2, { flat: true })),
    knob(54, 1, 2, 2, "gem", only(2, { glow: true })),
    // Legendary: a great maul, gold at every corner and a band of gold across, a heroic haft.
    rod(1, 0, 52, 0, 2.3, 2.3, "wood", only(3)),
    rod(2, 0, 13, 0, 2.8, 2.8, "wrap", only(3)),
    along([45, -12, 63, -12, 65, -10, 65, 10, 63, 12, 45, 12, 43, 10, 43, -10], "steel", only(3, { flat: true })),
    along([45, -12, 63, -12, 65, -10, 65, 0, 43, 0, 43, -10], "edge", only(3, { lift: 1, flat: true })),
    along([51.5, -13, 56.5, -13, 56.5, 13, 51.5, 13], "trim", only(3, { flat: true })),
    knob(44, -11, 2.4, 2.4, "trim", only(3)),
    knob(64, -11, 2.4, 2.4, "trim", only(3)),
    knob(44, 11, 2.4, 2.4, "trim", only(3)),
    knob(64, 11, 2.4, 2.4, "trim", only(3)),
    rod(30, -3, 30, 3, 1.1, 1.1, "trim", only(3)),
    knob(1, 0, 3, 3, "trim", only(3)),
    knob(54, 0, 3, 3, "gem", only(3, { glow: true })),
    // Mythic: a cluster of Sky-Glass grown on the haft, light at its heart, shards thrown off.
    rod(1, 0, 50, 0, 2, 2, "wood", upFrom(4)),
    along([46, -4, 52, -14, 56, -6, 60, -16, 62, -4, 70, -2, 70, 3, 62, 5, 60, 16, 56, 7, 52, 14, 46, 4], "steel", upFrom(4)),
    knob(56, 0, 3, 3, "light", upFrom(4, { glow: true })),
    rod(50, 0, 66, 0, 0.8, 0.8, "light", upFrom(4, { glow: true })),
    along([64, -14, 69, -12, 65, -10], "steel", upFrom(4)),
    along([64, 12, 69, 14, 64, 16], "steel", upFrom(4)),
    knob(54, -8, 0.9, 0.9, "star", upFrom(4, { glow: true })),
    knob(1, 0, 2.8, 2.8, "light", upFrom(4, { glow: true }))
  ]
};

/** A stick bow that grows into a great recurve, an arrow on its string. */
const bow: RelicRecipe = {
  runes: [36, 20, 36, 44],
  parts: [
    // Common: a bent stick and a string.
    { c: [22, 8, 32, 20, 1.6, 2], m: "wood", ...only(0) },
    { c: [32, 20, 34, 32, 2, 2.2], m: "wood", ...only(0) },
    { c: [34, 32, 32, 44, 2.2, 2], m: "wood", ...only(0) },
    { c: [32, 44, 22, 56, 2, 1.6], m: "wood", ...only(0) },
    { c: [22, 8, 22, 56, 0.9, 0.9], m: "string", ...only(0) },
    { c: [33, 29, 34, 35, 2.6, 2.6], m: "strap", ...only(0) },
    // Rare: a recurve, brass nocks, a wrapped grip, a stone at the heart.
    { c: [18, 6, 30, 14, 1.6, 2], m: "wood", ...only(1) },
    { c: [30, 14, 37, 32, 2, 2.4], m: "wood", ...only(1) },
    { c: [37, 32, 30, 50, 2.4, 2], m: "wood", ...only(1) },
    { c: [30, 50, 18, 58, 2, 1.6], m: "wood", ...only(1) },
    { c: [18, 6, 14, 2, 1.4, 1], m: "wood", ...only(1) },
    { c: [18, 58, 14, 62, 1.4, 1], m: "wood", ...only(1) },
    { c: [18, 6, 18, 58, 0.9, 0.9], m: "string", ...only(1) },
    { e: [18, 6, 2.2, 2.2], m: "trim", ...only(1) },
    { e: [18, 58, 2.2, 2.2], m: "trim", ...only(1) },
    { c: [37, 27, 37, 37, 2.9, 2.9], m: "wrap", ...only(1) },
    { e: [40, 32, 1.8, 1.8], m: "gem", ...only(1, { glow: true }) },
    // Epic: a longer recurve, silver caps, engraved limbs, an arrow nocked.
    { c: [16, 4, 30, 12, 1.8, 2.2], m: "wood", ...only(2) },
    { c: [30, 12, 38, 32, 2.2, 2.6], m: "wood", ...only(2) },
    { c: [38, 32, 30, 52, 2.6, 2.2], m: "wood", ...only(2) },
    { c: [30, 52, 16, 60, 2.2, 1.8], m: "wood", ...only(2) },
    { c: [16, 4, 11, 2, 1.6, 1], m: "trim", ...only(2) },
    { c: [16, 60, 11, 62, 1.6, 1], m: "trim", ...only(2) },
    { c: [24, 9, 33, 20, 0.6, 0.6], m: "wood", ...only(2, { lift: -3 }) },
    { c: [24, 55, 33, 44, 0.6, 0.6], m: "wood", ...only(2, { lift: -3 }) },
    { c: [16, 4, 18, 32, 0.9, 0.9], m: "string", ...only(2) },
    { c: [18, 32, 16, 60, 0.9, 0.9], m: "string", ...only(2) },
    { c: [12, 32, 52, 32, 0.8, 0.8], m: "wood", ...only(2, { lift: 1 }) },
    { p: [51, 28.5, 60, 32, 51, 35.5], m: "edge", ...only(2) },
    { p: [12, 32, 7, 28, 10, 32, 7, 36], m: "cloth", ...only(2) },
    { c: [38, 27, 38, 37, 3, 3], m: "wrap", ...only(2) },
    { e: [41.5, 32, 2, 2], m: "gem", ...only(2, { glow: true }) },
    // Legendary: a great bow, gold wings at the grip and the tips, a gold-headed arrow.
    { c: [14, 2, 30, 10, 2, 2.6], m: "wood", ...only(3) },
    { c: [30, 10, 40, 32, 2.6, 3], m: "wood", ...only(3) },
    { c: [40, 32, 30, 54, 3, 2.6], m: "wood", ...only(3) },
    { c: [30, 54, 14, 62, 2.6, 2], m: "wood", ...only(3) },
    { p: [14, 2, 6, 1, 10, 5, 4, 8, 14, 7], m: "trim", ...only(3) },
    { p: [14, 62, 6, 63, 10, 59, 4, 56, 14, 57], m: "trim", ...only(3) },
    { p: [41, 25, 48, 18, 46, 26, 50, 24, 44, 32, 50, 40, 46, 38, 48, 46, 41, 39], m: "trim", ...only(3) },
    { c: [26, 7, 36, 20, 0.8, 0.8], m: "trim", ...only(3) },
    { c: [26, 57, 36, 44, 0.8, 0.8], m: "trim", ...only(3) },
    { c: [14, 4, 18, 32, 0.9, 0.9], m: "string", ...only(3) },
    { c: [18, 32, 14, 60, 0.9, 0.9], m: "string", ...only(3) },
    { c: [10, 32, 54, 32, 0.8, 0.8], m: "wood", ...only(3, { lift: 1 }) },
    { p: [53, 28, 63, 32, 53, 36], m: "trim", ...only(3) },
    { p: [10, 32, 4, 27, 8, 32, 4, 37], m: "cloth", ...only(3) },
    { e: [40, 32, 2.8, 2.8], m: "gem", ...only(3, { glow: true }) },
    // Mythic: a bow of Sky-Glass strung with light, an arrow of light, shards off its tips.
    { c: [16, 4, 30, 12, 1.8, 2.4], m: "steel", ...upFrom(4) },
    { c: [30, 12, 39, 32, 2.4, 3], m: "steel", ...upFrom(4) },
    { c: [39, 32, 30, 52, 3, 2.4], m: "steel", ...upFrom(4) },
    { c: [30, 52, 16, 60, 2.4, 1.8], m: "steel", ...upFrom(4) },
    { c: [16, 4, 18, 32, 0.9, 0.9], m: "light", ...upFrom(4, { glow: true }) },
    { c: [18, 32, 16, 60, 0.9, 0.9], m: "light", ...upFrom(4, { glow: true }) },
    { c: [12, 32, 58, 32, 0.7, 0.7], m: "light", ...upFrom(4, { glow: true }) },
    { p: [55, 29, 63, 32, 55, 35], m: "light", ...upFrom(4, { glow: true }) },
    { p: [9, 0, 13, 1, 10, 3], m: "steel", ...upFrom(4) },
    { p: [9, 64, 13, 63, 10, 61], m: "steel", ...upFrom(4) },
    { p: [44, 16, 48, 14, 47, 19], m: "steel", ...upFrom(4) },
    { p: [44, 48, 48, 50, 47, 45], m: "steel", ...upFrom(4) },
    { e: [39.5, 32, 2.6, 2.6], m: "light", ...upFrom(4, { glow: true }) }
  ]
};

/** A shepherd's pike that grows into a winged partisan. */
const spear: RelicRecipe = {
  runes: line(14, 44),
  parts: [
    // Common: a long plain shaft, a small leaf of iron tied on with cord.
    rod(0, 0, 60, 0, 1.5, 1.5, "wood", only(0)),
    along([57, -2.8, 67, 0, 57, 2.8, 55, 0], "steel", only(0)),
    rod(53, 0, 56, 0, 2, 2, "strap", only(0)),
    knob(60, 1, 1.1, 1.1, "rust", only(0)),
    // Rare: a steel head on a brass socket, a wrapped grip, a stone, a shod butt.
    rod(1, 0, 62, 0, 1.7, 1.7, "wood", only(1)),
    along([57, -3.8, 71, 0, 57, 3.8, 54, 0], "steel", only(1)),
    along([57, -3.8, 71, 0, 54, 0], "edge", only(1, { lift: 1 })),
    rod(50, 0, 56, 0, 2.2, 1.6, "trim", only(1)),
    rod(20, 0, 30, 0, 2.2, 2.2, "wrap", only(1)),
    knob(1.5, 0, 2.2, 2.2, "trim", only(1)),
    knob(52, 0, 1.4, 1.4, "gem", only(1, { glow: true })),
    // Epic: a winged spear, an engraved head, a pennon in the rarity's color, gems.
    rod(1, 0, 62, 0, 1.7, 1.7, "wood", only(2)),
    along([57, -4.4, 73, 0, 57, 4.4, 54, 0], "steel", only(2)),
    along([57, -4.4, 73, 0, 54, 0], "edge", only(2, { lift: 1 })),
    rod(58, 0, 67, 0, 0.6, 0.6, "steel", only(2, { lift: -3 })),
    along([48, -2, 52, -9, 54, -2], "edge", only(2)),
    along([48, 2, 52, 9, 54, 2], "edge", only(2)),
    rod(48, 0, 55, 0, 2.2, 1.6, "trim", only(2)),
    along([46, 2, 38, 13, 43, 11, 36, 18, 47, 7], "cloth", only(2)),
    rod(20, 0, 30, 0, 2.2, 2.2, "wrap", only(2)),
    knob(51, 0, 1.6, 1.6, "gem", only(2, { glow: true })),
    // Legendary: a great partisan, gold side-blades, a crimson tassel, a gold-shod shaft.
    rod(0, 0, 60, 0, 2, 2, "wood", only(3)),
    along([56, -5, 75, 0, 56, 5, 53, 0], "steel", only(3)),
    along([56, -5, 75, 0, 53, 0], "edge", only(3, { lift: 1 })),
    along([49, -2, 51, -14, 57, -12, 55, -3], "trim", only(3)),
    along([49, 2, 51, 14, 57, 12, 55, 3], "trim", only(3)),
    rod(44, 0, 53, 0, 2.6, 2, "trim", only(3)),
    rod(44, 3, 36, 13, 1.6, 2.4, "cloth", only(3)),
    rod(18, -2.6, 18, 2.6, 1, 1, "trim", only(3)),
    rod(28, -2.6, 28, 2.6, 1, 1, "trim", only(3)),
    knob(1, 0, 2.6, 2.6, "trim", only(3)),
    knob(52, 0, 2.4, 2.4, "gem", only(3, { glow: true })),
    // Mythic: a head of Sky-Glass on a thread of light, shards turning around it.
    rod(0, 0, 54, 0, 1.7, 1.7, "wood", upFrom(4)),
    along([57, -5, 75, 0, 57, 5, 53, 0], "steel", upFrom(4)),
    rod(49, 0, 62, 0, 1, 0.5, "light", upFrom(4, { glow: true })),
    along([50, -7, 54, -13, 55, -7], "steel", upFrom(4)),
    along([50, 7, 54, 13, 55, 7], "steel", upFrom(4)),
    along([66, -9, 70, -10, 68, -6], "steel", upFrom(4)),
    along([66, 9, 70, 10, 68, 6], "steel", upFrom(4)),
    knob(64, 0, 0.9, 0.9, "star", upFrom(4, { glow: true })),
    knob(1, 0, 2.6, 2.6, "light", upFrom(4, { glow: true }))
  ]
};

/** A field scythe that grows into a great reaper's crescent. */
const scythe: RelicRecipe = {
  runes: [22, 58, 34, 14],
  parts: [
    // Common: a plain snath, a small rusted blade.
    { c: [22, 60, 36, 8, 1.8, 1.8], m: "wood", ...only(0) },
    { c: [25, 46, 31, 44, 1.4, 1.4], m: "wood", ...only(0) },
    { p: [36, 8, 24, 7, 14, 10, 8, 16, 16, 13, 26, 12, 35, 12], m: "steel", ...only(0) },
    { e: [22, 10, 1.6, 1.4], m: "rust", ...only(0) },
    { p: [13, 12, 15, 9.5, 17, 12], m: "steel", ...only(0, { cut: true }) },
    // Rare: a longer blade with a keen edge, a brass collar, a wrapped grip, a stone.
    { c: [22, 62, 38, 6, 1.9, 1.9], m: "wood", ...only(1) },
    { c: [25, 44, 32, 42, 1.5, 1.5], m: "wood", ...only(1) },
    { c: [26, 50, 29, 38, 2.4, 2.4], m: "wrap", ...only(1) },
    { p: [38, 6, 26, 4, 14, 6, 5, 13, 4, 20, 13, 12, 24, 10, 37, 11], m: "steel", ...only(1) },
    { p: [4, 20, 13, 12, 24, 10, 37, 11, 37, 9, 24, 8, 12, 10], m: "edge", ...only(1, { lift: 1 }) },
    { c: [35, 12, 37, 6, 2, 2], m: "trim", ...only(1) },
    { e: [36, 9, 1.4, 1.4], m: "gem", ...only(1, { glow: true }) },
    // Epic: a longer blade with a hooked beard, engraved, a silver collar, gems.
    { c: [22, 62, 39, 5, 2, 2], m: "wood", ...only(2) },
    { c: [25, 44, 33, 42, 1.5, 1.5], m: "wood", ...only(2) },
    { c: [26, 50, 30, 36, 2.4, 2.4], m: "wrap", ...only(2) },
    { p: [40, 4, 26, 2, 12, 5, 4, 12, 1, 24, 10, 14, 22, 10, 32, 10, 36, 14, 39, 10], m: "steel", ...only(2) },
    { p: [1, 24, 10, 14, 22, 10, 32, 10, 32, 8, 22, 8, 9, 12], m: "edge", ...only(2, { lift: 1 }) },
    { c: [14, 7, 30, 5, 0.6, 0.6], m: "steel", ...only(2, { lift: -3 }) },
    { c: [36, 11, 39, 4, 2.2, 2.2], m: "trim", ...only(2) },
    { e: [37.5, 7.5, 1.7, 1.7], m: "gem", ...only(2, { glow: true }) },
    { e: [28, 43, 1.4, 1.4], m: "gem", ...only(2, { glow: true }) },
    // Legendary: a great crescent reaching the edge, gold along its back, gold wings at the collar.
    { c: [20, 63, 40, 5, 2.3, 2.3], m: "wood", ...only(3) },
    { c: [24, 45, 34, 42, 1.7, 1.7], m: "trim", ...only(3) },
    { c: [25, 52, 30, 36, 2.7, 2.7], m: "wrap", ...only(3) },
    { p: [42, 3, 26, 0, 10, 3, 1, 12, 0, 30, 7, 18, 18, 11, 30, 10, 40, 11], m: "steel", ...only(3) },
    { p: [0, 30, 7, 18, 18, 11, 30, 10, 40, 11, 40, 8, 28, 8, 16, 9, 5, 16], m: "edge", ...only(3, { lift: 1 }) },
    { c: [10, 3, 28, 1.5, 1, 1], m: "trim", ...only(3) },
    { c: [2, 11, 10, 3, 1, 1], m: "trim", ...only(3) },
    { p: [38, 12, 46, 2, 44, 10, 50, 8, 42, 16], m: "trim", ...only(3) },
    { e: [40, 8, 2.6, 2.6], m: "gem", ...only(3, { glow: true }) },
    // Mythic: a crescent of Sky-Glass edged with light, shards drifting off it.
    { c: [22, 63, 40, 5, 2, 2], m: "wood", ...upFrom(4) },
    { p: [40, 4, 26, 1, 12, 4, 3, 12, 0, 28, 9, 16, 20, 10, 32, 9, 39, 10], m: "steel", ...upFrom(4) },
    { c: [4, 22, 10, 13, 0.7, 0.7], m: "light", ...upFrom(4, { glow: true }) },
    { c: [10, 13, 30, 9.5, 0.7, 0.7], m: "light", ...upFrom(4, { glow: true }) },
    { p: [2, 34, 6, 33, 3, 38], m: "steel", ...upFrom(4) },
    { p: [48, 2, 52, 4, 48, 6], m: "steel", ...upFrom(4) },
    { p: [16, 16, 20, 15, 17, 19], m: "steel", ...upFrom(4) },
    { e: [22, 5, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) },
    { e: [39, 7, 2.6, 2.6], m: "light", ...upFrom(4, { glow: true }) },
    { e: [26, 44, 2, 2], m: "light", ...upFrom(4, { glow: true }) }
  ]
};

/** Boiled leather that grows into a breastplate of Sky-Glass. */
const cuirass: RelicRecipe = {
  runes: [32, 22, 32, 50],
  parts: [
    // Common: boiled leather, a seam down the middle, a scratch, plain straps.
    sym([32, 17, 23, 14, 15, 18, 14, 30, 18, 52, 32, 54], "strap", only(0)),
    { e: [32, 13, 8, 5], m: "strap", ...only(0, { cut: true }) },
    ...pair({ c: [19, 16, 21, 8, 1.8, 1.8], m: "strap", ...only(0, { lift: -1 }) }),
    { c: [32, 20, 32, 52, 0.7, 0.7], m: "strap", ...only(0, { lift: -2 }) },
    { c: [20, 26, 26, 36, 0.6, 0.6], m: "strap", ...only(0, { lift: -2 }) },
    { e: [42, 42, 1.8, 1.6], m: "rust", ...only(0) },
    // Rare: a steel breastplate, a brass rim at the neck and belt, leather straps, a stone.
    sym([32, 15, 21, 12, 12, 16, 11, 29, 16, 53, 32, 56], "steel", only(1)),
    { e: [32, 12, 9.5, 6], m: "trim", ...only(1) },
    { e: [32, 11, 7.5, 5], m: "trim", ...only(1, { cut: true }) },
    ...pair({ c: [18, 15, 21, 5, 2, 2], m: "strap", ...only(1) }),
    { r: [15, 44, 34, 4.5], m: "trim", ...only(1) },
    { c: [32, 18, 32, 42, 1, 1], m: "edge", ...only(1, { lift: 1 }) },
    { e: [32, 46.2, 2.2, 2.2], m: "gem", ...only(1, { glow: true }) },
    // Epic: pauldrons, a ridge down the middle, engraved arcs, silver rims, a gem at the heart.
    ...pair({ e: [13, 19, 8, 7], m: "steel", ...only(2) }),
    ...pair({ e: [13, 19, 5, 4], m: "trim", ...only(2, { lift: -1 }) }),
    sym([32, 15, 21, 12, 14, 18, 13, 30, 17, 54, 32, 57], "steel", only(2)),
    { e: [32, 12, 10, 6], m: "trim", ...only(2) },
    { e: [32, 11, 8, 5], m: "trim", ...only(2, { cut: true }) },
    { c: [32, 18, 32, 52, 1.1, 1.1], m: "edge", ...only(2, { lift: 1 }) },
    ...pair({ c: [22, 22, 26, 44, 0.7, 0.7], m: "steel", ...only(2, { lift: -3 }) }),
    ...pair({ c: [20, 48, 28, 52, 0.7, 0.7], m: "steel", ...only(2, { lift: -3 }) }),
    { r: [17, 53, 30, 4], m: "trim", ...only(2) },
    { e: [32, 28, 2.8, 2.8], m: "gem", ...only(2, { glow: true }) },
    // Legendary: winged gold pauldrons, a gold sun on the chest, a heroic breadth.
    ...pair({ p: [18, 14, 4, 12, 1, 20, 6, 30, 16, 26], m: "trim", ...only(3) }),
    ...pair({ p: [8, 16, 2, 10, 6, 14], m: "trim", ...only(3) }),
    sym([32, 14, 20, 11, 12, 17, 11, 32, 16, 56, 32, 60], "steel", only(3)),
    { e: [32, 11, 10.5, 6], m: "trim", ...only(3) },
    { e: [32, 10, 8, 5], m: "trim", ...only(3, { cut: true }) },
    { e: [32, 31, 7, 7], m: "trim", ...only(3) },
    ...pair({ c: [22, 31, 16, 31, 1, 0.5], m: "trim", ...only(3) }),
    { c: [32, 22, 32, 16, 1, 0.5], m: "trim", ...only(3) },
    { c: [32, 40, 32, 50, 1, 0.5], m: "trim", ...only(3) },
    ...pair({ c: [25, 24, 21, 20, 0.9, 0.5], m: "trim", ...only(3) }),
    ...pair({ c: [25, 38, 21, 42, 0.9, 0.5], m: "trim", ...only(3) }),
    { r: [15, 54, 34, 4], m: "trim", ...only(3) },
    { e: [32, 31, 3.4, 3.4], m: "gem", ...only(3, { glow: true }) },
    // Mythic: a breastplate of Sky-Glass, a heart of light, pauldrons of shards held by nothing.
    ...pair({ p: [14, 12, 4, 16, 2, 26, 10, 22], m: "steel", ...upFrom(4) }),
    ...pair({ p: [6, 6, 10, 4, 9, 9], m: "steel", ...upFrom(4) }),
    ...pair({ p: [2, 32, 5, 30, 4, 36], m: "steel", ...upFrom(4) }),
    sym([32, 14, 21, 12, 14, 17, 13, 32, 18, 56, 32, 60], "steel", upFrom(4)),
    { e: [32, 11, 8, 4.5], m: "steel", ...upFrom(4, { cut: true }) },
    { e: [32, 31, 4, 4], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ c: [29, 34, 22, 48, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) }),
    ...pair({ c: [29, 28, 20, 20, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) }),
    { c: [32, 36, 32, 56, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) },
    { e: [22, 40, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) },
    { e: [42, 24, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) }
  ]
};

/** A short shirt of iron rings that grows into a long coat of glass links. */
const hauberk: RelicRecipe = {
  runes: [32, 24, 32, 48],
  parts: [
    // Common: a short mail shirt, short sleeves, a ragged hem.
    sym([32, 16, 22, 14, 16, 16, 9, 28, 14, 32, 17, 26, 18, 44, 22, 48, 26, 45, 29, 49, 32, 47], "chain", only(0)),
    { e: [32, 13, 8, 5], m: "chain", ...only(0, { cut: true }) },
    { e: [22, 36, 1.8, 1.6], m: "rust", ...only(0) },
    // Rare: longer, a brass collar, a leather belt with a buckle stone.
    sym([32, 14, 21, 12, 14, 15, 6, 32, 12, 36, 16, 28, 16, 54, 32, 55], "chain", only(1)),
    { e: [32, 11, 9, 5], m: "chain", ...only(1, { cut: true }) },
    { e: [32, 13, 10, 5], m: "trim", ...only(1) },
    { e: [32, 12, 8, 4], m: "trim", ...only(1, { cut: true }) },
    { r: [15, 38, 34, 4.5], m: "strap", ...only(1) },
    { e: [32, 40.2, 2.4, 2.4], m: "gem", ...only(1, { glow: true }) },
    // Epic: long sleeves, silver rims at collar, cuffs and hem, a gem clasp.
    sym([32, 13, 20, 11, 12, 15, 4, 38, 11, 41, 15, 28, 15, 57, 32, 58], "chain", only(2)),
    { e: [32, 10, 9, 5], m: "chain", ...only(2, { cut: true }) },
    { e: [32, 12, 11, 5.5], m: "trim", ...only(2) },
    { e: [32, 11, 8.5, 4.5], m: "trim", ...only(2, { cut: true }) },
    ...pair({ c: [4, 38, 11, 41, 1.4, 1.4], m: "trim", ...only(2) }),
    { r: [15, 55, 34, 3.5], m: "trim", ...only(2) },
    { r: [15, 36, 34, 4], m: "strap", ...only(2) },
    { e: [32, 38, 2.8, 2.8], m: "gem", ...only(2, { glow: true }) },
    // Legendary: gilded rings, a gold collar of filigree, a tabard in its color.
    sym([32, 12, 19, 10, 10, 14, 2, 40, 10, 44, 14, 28, 13, 60, 32, 61], "chain", only(3)),
    { e: [32, 9, 9, 5], m: "chain", ...only(3, { cut: true }) },
    sym([32, 18, 25, 18, 24, 58, 28, 62, 32, 58], "cloth", only(3)),
    { e: [32, 12, 12, 6], m: "trim", ...only(3) },
    { e: [32, 11, 9, 4.5], m: "trim", ...only(3, { cut: true }) },
    ...pair({ e: [20, 16, 2, 2], m: "trim", ...only(3) }),
    ...pair({ c: [2, 40, 10, 44, 1.5, 1.5], m: "trim", ...only(3) }),
    { c: [32, 24, 32, 54, 0.8, 0.8], m: "trim", ...only(3) },
    { e: [32, 30, 3.2, 3.2], m: "gem", ...only(3, { glow: true }) },
    // Mythic: links of Sky-Glass, light running in them, the hem coming apart into shards.
    sym([32, 12, 20, 10, 11, 14, 4, 38, 11, 42, 15, 28, 15, 52, 20, 56, 26, 53, 32, 57], "chain", upFrom(4)),
    { e: [32, 9, 8.5, 4.5], m: "chain", ...upFrom(4, { cut: true }) },
    ...pair({ p: [16, 58, 19, 60, 16, 63], m: "chain", ...upFrom(4) }),
    ...pair({ p: [26, 58, 29, 60, 26, 63], m: "chain", ...upFrom(4) }),
    ...pair({ p: [2, 44, 5, 46, 2, 49], m: "chain", ...upFrom(4) }),
    { c: [22, 20, 22, 50, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) },
    { c: [42, 20, 42, 50, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) },
    { e: [32, 30, 3.4, 3.4], m: "light", ...upFrom(4, { glow: true }) }
  ]
};

/** A sack thrown over the shoulders that grows into a cloak of night. */
const cloak: RelicRecipe = {
  runes: [32, 22, 32, 52],
  parts: [
    // Common: sackcloth, a torn hem, a wooden toggle.
    sym([32, 12, 25, 12, 18, 28, 15, 52, 19, 50, 22, 55, 27, 51, 32, 54], "cloth", only(0)),
    { c: [27, 14, 24, 50, 0.7, 0.7], m: "cloth", ...only(0, { lift: -2 }) },
    { c: [37, 14, 40, 50, 0.7, 0.7], m: "cloth", ...only(0, { lift: -2 }) },
    { c: [28, 14, 36, 14, 1.4, 1.4], m: "wood", ...only(0) },
    // Rare: dyed, a wider fall, a hood, a brass clasp with a stone.
    sym([32, 10, 24, 10, 14, 28, 9, 56, 18, 55, 25, 58, 32, 56], "cloth", only(1)),
    sym([32, 6, 26, 7, 22, 14, 26, 20, 32, 19], "cloth", only(1, { lift: -1 })),
    ...pair({ c: [25, 22, 20, 54, 0.8, 0.8], m: "cloth", ...only(1, { lift: -2 }) }),
    { e: [32, 18, 3.4, 3], m: "trim", ...only(1) },
    { e: [32, 18, 1.8, 1.6], m: "gem", ...only(1, { glow: true }) },
    // Epic: a deep hood, folds, a silver-embroidered hem, a gem clasp.
    sym([32, 9, 23, 9, 12, 28, 6, 58, 15, 57, 22, 60, 32, 58], "cloth", only(2)),
    sym([32, 4, 25, 5, 20, 12, 22, 20, 32, 20], "cloth", only(2, { lift: -1 })),
    { e: [32, 13, 4.5, 5], m: "cloth", ...only(2, { lift: -3 }) },
    ...pair({ c: [24, 24, 17, 56, 0.8, 0.8], m: "cloth", ...only(2, { lift: -2 }) }),
    sym([32, 55, 22, 57.5, 15, 54, 6, 55.5, 6, 58, 15, 57, 22, 60, 32, 58], "trim", only(2)),
    ...pair({ e: [26, 22, 3, 2.6], m: "trim", ...only(2) }),
    { c: [26, 22, 38, 22, 0.8, 0.8], m: "trim", ...only(2) },
    { e: [26, 22, 1.6, 1.4], m: "gem", ...only(2, { glow: true }) },
    { e: [38, 22, 1.6, 1.4], m: "gem", ...only(2, { glow: true }) },
    // Legendary: a great sweeping mantle, a fur collar, a gold border, a gold clasp and stone.
    sym([32, 8, 20, 8, 8, 30, 1, 60, 12, 58, 20, 62, 32, 60], "cloth", only(3)),
    ...pair({ c: [22, 22, 13, 58, 0.9, 0.9], m: "cloth", ...only(3, { lift: -2 }) }),
    sym([32, 57, 20, 59.5, 12, 55.5, 1, 57.5, 1, 60, 12, 58, 20, 62, 32, 60], "trim", only(3)),
    ...pair({ c: [8, 30, 2, 58, 1, 1], m: "trim", ...only(3) }),
    { e: [32, 13, 17, 7], m: "fur", ...only(3) },
    { e: [32, 11, 9, 4], m: "fur", ...only(3, { lift: -2 }) },
    { e: [32, 20, 5, 4], m: "trim", ...only(3) },
    ...pair({ c: [27, 20, 22, 26, 0.9, 0.5], m: "trim", ...only(3) }),
    { e: [32, 20, 2.6, 2.2], m: "gem", ...only(3, { glow: true }) },
    // Mythic: a cloak of night with stars in it, its hem breaking into glass and light.
    sym([32, 8, 21, 8, 10, 30, 5, 54, 12, 50, 18, 56, 24, 52, 32, 56], "cloth", upFrom(4)),
    sym([32, 4, 24, 5, 19, 12, 22, 20, 32, 20], "cloth", upFrom(4, { lift: -1 })),
    { e: [32, 13, 4.5, 5], m: "void", ...upFrom(4) },
    ...pair({ e: [30, 12.5, 0.9, 0.9], m: "light", ...upFrom(4, { glow: true }) }),
    ...pair({ p: [6, 58, 9, 60, 6, 63], m: "cloth", ...upFrom(4) }),
    ...pair({ p: [14, 58, 17, 59, 15, 62], m: "cloth", ...upFrom(4) }),
    ...pair({ p: [22, 57, 25, 59, 22, 61], m: "cloth", ...upFrom(4) }),
    { e: [22, 32, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) },
    { e: [40, 26, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) },
    { e: [30, 44, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) },
    { e: [44, 46, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) },
    { c: [8, 52, 56, 52, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) },
    { e: [32, 22, 2.6, 2.4], m: "light", ...upFrom(4, { glow: true }) }
  ]
};

/** A dented iron shell that grows into a knight's full plate. */
const plate: RelicRecipe = {
  runes: [32, 20, 32, 42],
  parts: [
    // Common: plain iron, small round shoulders, a dent.
    ...pair({ e: [17, 20, 5.5, 5], m: "steel", ...only(0) }),
    sym([32, 16, 22, 15, 18, 20, 18, 42, 22, 48, 32, 50], "steel", only(0)),
    { e: [32, 14, 6, 4], m: "steel", ...only(0, { cut: true }) },
    ...pair({ r: [20, 49, 10, 4], m: "steel", ...only(0, { lift: -1 }) }),
    { e: [37, 32, 2.4, 2], m: "steel", ...only(0, { lift: -2 }) },
    { e: [25, 40, 1.6, 1.4], m: "rust", ...only(0) },
    // Rare: steel, riveted, the shoulders strapped on, lames below, a stone.
    ...pair({ e: [15, 20, 7.5, 6.5], m: "steel", ...only(1) }),
    ...pair({ c: [16, 26, 20, 28, 1.4, 1.4], m: "strap", ...only(1) }),
    sym([32, 15, 22, 14, 17, 20, 17, 42, 21, 48, 32, 50], "steel", only(1)),
    { e: [32, 13, 7, 4.5], m: "steel", ...only(1, { cut: true }) },
    ...pair({ r: [19, 49, 13, 4], m: "steel", ...only(1, { lift: -1 }) }),
    ...pair({ r: [20, 53, 12, 4], m: "steel", ...only(1, { lift: -1 }) }),
    ...pair({ e: [20.5, 22, 1.1, 1.1], m: "trim", ...only(1) }),
    ...pair({ e: [20.5, 40, 1.1, 1.1], m: "trim", ...only(1) }),
    { c: [32, 18, 32, 46, 1, 1], m: "edge", ...only(1, { lift: 1 }) },
    { e: [32, 30, 2.2, 2.2], m: "gem", ...only(1, { glow: true }) },
    // Epic: fluted, a gorget, layered pauldrons with silver rims, a gem.
    ...pair({ e: [14, 20, 9, 8], m: "steel", ...only(2) }),
    ...pair({ e: [14, 26, 8, 4], m: "steel", ...only(2, { lift: -1 }) }),
    ...pair({ c: [7, 16, 18, 13, 1, 1], m: "trim", ...only(2) }),
    sym([32, 14, 22, 13, 17, 20, 16, 42, 20, 49, 32, 52], "steel", only(2)),
    { e: [32, 13, 8, 5], m: "trim", ...only(2) },
    { e: [32, 12, 6, 3.5], m: "trim", ...only(2, { cut: true }) },
    ...pair({ c: [25, 22, 24, 44, 0.7, 0.7], m: "steel", ...only(2, { lift: -3 }) }),
    { c: [32, 20, 32, 48, 1, 1], m: "edge", ...only(2, { lift: 1 }) },
    ...pair({ r: [18, 51, 14, 4], m: "steel", ...only(2, { lift: -1 }) }),
    ...pair({ r: [19, 55, 13, 4], m: "trim", ...only(2) }),
    { e: [32, 30, 2.6, 2.6], m: "gem", ...only(2, { glow: true }) },
    // Legendary: great winged pauldrons edged in gold, gold filigree over the heart, heroic.
    ...pair({ p: [22, 14, 8, 10, 1, 18, 2, 30, 10, 32, 18, 26], m: "steel", ...only(3) }),
    ...pair({ c: [2, 18, 12, 10, 1.2, 1.2], m: "trim", ...only(3) }),
    ...pair({ c: [2, 30, 10, 32, 1.2, 1.2], m: "trim", ...only(3) }),
    ...pair({ p: [8, 10, 4, 2, 12, 8], m: "trim", ...only(3) }),
    sym([32, 13, 22, 12, 16, 20, 15, 44, 19, 52, 32, 56], "steel", only(3)),
    { e: [32, 12, 9, 5], m: "trim", ...only(3) },
    { e: [32, 11, 6.5, 3.5], m: "trim", ...only(3, { cut: true }) },
    ...pair({ c: [31, 22, 22, 26, 0.9, 0.6], m: "trim", ...only(3) }),
    ...pair({ c: [22, 26, 24, 32, 0.8, 0.6], m: "trim", ...only(3) }),
    { c: [32, 20, 32, 50, 1, 1], m: "edge", ...only(3, { lift: 1 }) },
    ...pair({ r: [17, 54, 15, 4], m: "trim", ...only(3) }),
    ...pair({ r: [18, 58, 14, 4], m: "steel", ...only(3, { lift: -1 }) }),
    { e: [32, 24, 3.2, 3.2], m: "gem", ...only(3, { glow: true }) },
    // Mythic: plates of Sky-Glass, seams of light, the pauldrons floating off the body.
    ...pair({ p: [14, 10, 2, 14, 1, 26, 10, 24], m: "steel", ...upFrom(4) }),
    ...pair({ p: [4, 30, 8, 28, 7, 34], m: "steel", ...upFrom(4) }),
    ...pair({ p: [10, 4, 14, 3, 12, 7], m: "steel", ...upFrom(4) }),
    sym([32, 13, 22, 12, 16, 20, 15, 44, 19, 52, 32, 56], "steel", upFrom(4)),
    { e: [32, 11, 6.5, 3.5], m: "steel", ...upFrom(4, { cut: true }) },
    { c: [32, 18, 32, 54, 0.9, 0.9], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ c: [17, 34, 30, 34, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) }),
    ...pair({ r: [18, 57, 14, 4], m: "steel", ...upFrom(4) }),
    { e: [32, 26, 3.4, 3.4], m: "light", ...upFrom(4, { glow: true }) },
    { e: [24, 44, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) }
  ]
};

/** A studded jerkin that grows into a coat whose rivets are stars. */
const brigandine: RelicRecipe = {
  runes: [22, 24, 22, 48],
  parts: [
    // Common: sackcloth, a few iron rivets, a sagging hem.
    sym([32, 16, 22, 14, 15, 18, 15, 48, 20, 50, 32, 49], "cloth", only(0)),
    { e: [32, 13, 7, 5], m: "cloth", ...only(0, { cut: true }) },
    ...pair({ e: [21, 24, 1.3, 1.3], m: "trim", ...only(0) }),
    ...pair({ e: [21, 36, 1.3, 1.3], m: "trim", ...only(0) }),
    ...pair({ e: [27, 30, 1.3, 1.3], m: "trim", ...only(0) }),
    { c: [32, 18, 32, 48, 0.6, 0.6], m: "cloth", ...only(0, { lift: -2 }) },
    // Rare: dyed cloth, rows of brass rivets, leather straps.
    sym([32, 14, 21, 12, 13, 17, 12, 50, 18, 53, 32, 53], "cloth", only(1)),
    { e: [32, 11, 8, 5], m: "cloth", ...only(1, { cut: true }) },
    ...[22, 30, 38, 46].flatMap((y) => pair({ e: [19, y, 1.3, 1.3], m: "trim", ...only(1) })),
    ...[26, 34, 42].flatMap((y) => pair({ e: [26, y, 1.3, 1.3], m: "trim", ...only(1) })),
    ...pair({ c: [22, 14, 24, 6, 1.8, 1.8], m: "strap", ...only(1) }),
    { r: [13, 48, 38, 3.5], m: "strap", ...only(1) },
    { e: [32, 49.7, 2, 2], m: "gem", ...only(1, { glow: true }) },
    // Epic: a high collar, silver rivets in a lattice, an embroidered line, gems.
    sym([32, 13, 20, 11, 11, 16, 10, 52, 16, 56, 32, 56], "cloth", only(2)),
    sym([32, 16, 26, 6, 20, 8, 22, 14], "cloth", only(2, { lift: -1 })),
    ...[20, 28, 36, 44].flatMap((y) => pair({ e: [17, y, 1.3, 1.3], m: "trim", ...only(2) })),
    ...[24, 32, 40, 48].flatMap((y) => pair({ e: [24, y, 1.3, 1.3], m: "trim", ...only(2) })),
    { c: [32, 18, 32, 54, 0.8, 0.8], m: "trim", ...only(2) },
    { r: [11, 52, 42, 3], m: "trim", ...only(2) },
    ...pair({ e: [26, 12, 1.8, 1.8], m: "gem", ...only(2, { glow: true }) }),
    // Legendary: crimson velvet, gold rivets, gold shoulders and collar, broad.
    ...pair({ e: [11, 18, 8, 6], m: "trim", ...only(3) }),
    sym([32, 13, 20, 11, 11, 17, 9, 54, 15, 59, 32, 60], "cloth", only(3)),
    sym([32, 17, 26, 6, 19, 8, 21, 15], "trim", only(3)),
    ...[24, 32, 40, 48].flatMap((y) => pair({ e: [16, y, 1.3, 1.3], m: "trim", ...only(3) })),
    ...[28, 36, 44, 52].flatMap((y) => pair({ e: [24, y, 1.3, 1.3], m: "trim", ...only(3) })),
    { c: [32, 20, 32, 58, 1, 1], m: "trim", ...only(3) },
    { r: [9, 56, 46, 3.5], m: "trim", ...only(3) },
    { e: [32, 22, 3, 3], m: "gem", ...only(3, { glow: true }) },
    // Mythic: cloth of night, its rivets stars, a seam of light, the shoulders drifting.
    ...pair({ p: [14, 10, 4, 14, 3, 24, 11, 22], m: "steel", ...upFrom(4) }),
    sym([32, 13, 20, 11, 12, 17, 10, 52, 16, 58, 32, 58], "cloth", upFrom(4)),
    { e: [32, 10, 7, 4.5], m: "cloth", ...upFrom(4, { cut: true }) },
    ...[24, 36, 48].flatMap((y) => pair({ e: [17, y, 1.1, 1.1], m: "star", ...upFrom(4, { glow: true }) })),
    ...[30, 42].flatMap((y) => pair({ e: [24, y, 1.1, 1.1], m: "star", ...upFrom(4, { glow: true }) })),
    { c: [32, 16, 32, 56, 0.9, 0.9], m: "light", ...upFrom(4, { glow: true }) },
    { e: [32, 26, 3, 3], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ p: [4, 30, 7, 28, 6, 33], m: "steel", ...upFrom(4) })
  ]
};

/** A disc on a cord that grows into an orb of living light. */
const amulet: RelicRecipe = {
  runes: [19, 12, 28, 32],
  parts: [
    // Common: a leather cord, a plain iron disc with a hole.
    ...pair({ c: [16, 6, 28, 34, 1, 1], m: "strap", ...only(0) }),
    { e: [32, 42, 8, 8], m: "steel", ...only(0) },
    { e: [32, 42, 2, 2], m: "steel", ...only(0, { cut: true }) },
    { e: [36, 46, 1.5, 1.4], m: "rust", ...only(0) },
    // Rare: a brass chain, a brass setting, a blue stone.
    ...pair({ c: [14, 5, 28, 32, 1.2, 1.2], m: "chain", ...only(1) }),
    { e: [32, 42, 9.5, 9.5], m: "trim", ...only(1) },
    { e: [32, 42, 5.5, 5.5], m: "gem", ...only(1, { glow: true }) },
    // Epic: a silver chain, an engraved rim with claws, beads on the chain, a larger stone.
    ...pair({ c: [12, 4, 28, 30, 1.2, 1.2], m: "chain", ...only(2) }),
    ...pair({ e: [20, 18, 2, 2], m: "gem", ...only(2, { glow: true }) }),
    { e: [32, 42, 12, 12], m: "trim", ...only(2) },
    { e: [32, 42, 9.5, 9.5], m: "trim", ...only(2, { lift: -2 }) },
    ...pair({ e: [25, 35, 2, 2], m: "trim", ...only(2, { lift: 1 }) }),
    ...pair({ e: [25, 49, 2, 2], m: "trim", ...only(2, { lift: 1 }) }),
    { e: [32, 42, 7, 7], m: "gem", ...only(2, { glow: true }) },
    // Legendary: a gold chain, a gold sunburst of filigree, a great amber stone.
    ...pair({ c: [10, 3, 28, 26, 1.4, 1.4], m: "chain", ...only(3) }),
    ...[[32, 22, 32, 62], [14, 40, 50, 40], [19, 27, 45, 55], [45, 27, 19, 55]].map(([x1, y1, x2, y2]) => ({ c: [x1, y1, x2, y2, 1.4, 1.4] as const, m: "trim", ...only(3) })),
    { e: [32, 41, 13, 13], m: "trim", ...only(3) },
    { e: [32, 41, 10.5, 10.5], m: "trim", ...only(3, { lift: -2 }) },
    { e: [32, 26, 3, 3], m: "trim", ...only(3) },
    { e: [32, 41, 8, 8], m: "gem", ...only(3, { glow: true }) },
    // Mythic: an orb of living light held in petals of Sky-Glass that do not touch it.
    ...pair({ c: [12, 3, 28, 24, 1.2, 1.2], m: "chain", ...upFrom(4) }),
    ...pair({ p: [28, 24, 22, 30, 20, 38, 26, 32], m: "steel", ...upFrom(4) }),
    ...pair({ p: [18, 44, 20, 52, 26, 56, 24, 48], m: "steel", ...upFrom(4) }),
    { p: [29, 58, 32, 63, 35, 58, 32, 56], m: "steel", ...upFrom(4) },
    { e: [32, 42, 8, 8], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ e: [14, 40, 1, 1], m: "star", ...upFrom(4, { glow: true }) })
  ]
};

/** A carved bone on a cord that grows into a talisman of Sky-Glass. */
const talisman: RelicRecipe = {
  runes: [32, 34, 32, 52],
  parts: [
    // Common: a cord, a plain bone token, one notch.
    ...pair({ c: [18, 6, 29, 28, 1, 1], m: "strap", ...only(0) }),
    { p: [32, 28, 40, 42, 32, 56, 24, 42], m: "bone", ...only(0) },
    { r: [28, 41, 8, 2], m: "bone", ...only(0, { lift: -2 }) },
    // Rare: a bone claw capped in brass, a blue bead.
    ...pair({ c: [16, 5, 29, 24, 1, 1], m: "strap", ...only(1) }),
    { e: [32, 25, 3, 3], m: "gem", ...only(1, { glow: true }) },
    { r: [26, 28, 12, 4], m: "trim", ...only(1) },
    { p: [26, 32, 38, 32, 40, 42, 34, 58, 30, 50, 26, 42], m: "bone", ...only(1) },
    { r: [27, 40, 10, 2], m: "bone", ...only(1, { lift: -2 }) },
    // Epic: engraved runes on the bone, silver caps, feathers, a violet bead.
    ...pair({ c: [14, 4, 29, 22, 1, 1], m: "chain", ...only(2) }),
    { e: [32, 23, 3.2, 3.2], m: "gem", ...only(2, { glow: true }) },
    { r: [25, 26, 14, 4], m: "trim", ...only(2) },
    { p: [25, 30, 39, 30, 42, 44, 32, 60, 22, 44], m: "bone", ...only(2) },
    { c: [28, 36, 36, 36, 0.6, 0.6], m: "bone", ...only(2, { lift: -3 }) },
    { c: [32, 36, 32, 50, 0.6, 0.6], m: "bone", ...only(2, { lift: -3 }) },
    { c: [28, 44, 36, 44, 0.6, 0.6], m: "bone", ...only(2, { lift: -3 }) },
    ...pair({ p: [24, 32, 14, 42, 16, 48, 24, 38], m: "cloth", ...only(2) }),
    // Legendary: a great fang bound in gold filigree, gold wings, an amber eye.
    ...pair({ c: [12, 3, 29, 20, 1.3, 1.3], m: "chain", ...only(3) }),
    ...pair({ p: [26, 24, 8, 18, 4, 26, 12, 30, 6, 36, 20, 34, 27, 30], m: "trim", ...only(3) }),
    { p: [24, 26, 40, 26, 44, 42, 32, 63, 20, 42], m: "bone", ...only(3) },
    { e: [32, 24, 5, 4], m: "trim", ...only(3) },
    { c: [22, 40, 42, 40, 1, 1], m: "trim", ...only(3) },
    { c: [25, 50, 39, 50, 0.9, 0.9], m: "trim", ...only(3) },
    { e: [32, 33, 3.4, 3.4], m: "gem", ...only(3, { glow: true }) },
    // Mythic: a long shard of Sky-Glass, a vein of light, splinters turning around it.
    ...pair({ c: [14, 3, 29, 20, 1, 1], m: "chain", ...upFrom(4) }),
    { p: [32, 20, 42, 36, 36, 60, 32, 64, 28, 60, 22, 36], m: "steel", ...upFrom(4) },
    { c: [32, 26, 32, 56, 1, 0.6], m: "light", ...upFrom(4, { glow: true }) },
    { e: [32, 36, 2.8, 2.8], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ p: [14, 38, 18, 36, 17, 42], m: "steel", ...upFrom(4) }),
    ...pair({ p: [18, 54, 22, 52, 21, 58], m: "steel", ...upFrom(4) }),
    ...pair({ e: [12, 50, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) })
  ]
};

/** A stone drop on a cord that grows into a tear of pure light. */
const pendant: RelicRecipe = {
  runes: [19, 12, 29, 30],
  parts: [
    // Common: a cord, a plain grey drop of stone.
    ...pair({ c: [18, 6, 30, 30, 1, 1], m: "strap", ...only(0) }),
    { e: [32, 32, 2.4, 2.4], m: "trim", ...only(0) },
    { p: [32, 34, 39, 46, 36, 53, 28, 53, 25, 46], m: "stone", ...only(0) },
    // Rare: a brass cap, a drop of blue glass.
    ...pair({ c: [16, 5, 30, 28, 1.2, 1.2], m: "chain", ...only(1) }),
    { e: [32, 30, 3.5, 3], m: "trim", ...only(1) },
    { p: [32, 32, 41, 46, 37, 56, 27, 56, 23, 46], m: "gem", ...only(1, { glow: true }) },
    { p: [27, 35, 37, 35, 32, 38], m: "trim", ...only(1) },
    // Epic: a silver cage around a violet drop, beads.
    ...pair({ c: [14, 4, 30, 26, 1.2, 1.2], m: "chain", ...only(2) }),
    { e: [32, 28, 3.5, 3.5], m: "trim", ...only(2) },
    { p: [32, 31, 43, 46, 38, 58, 26, 58, 21, 46], m: "gem", ...only(2, { glow: true }) },
    { c: [32, 31, 32, 58, 0.8, 0.8], m: "trim", ...only(2) },
    ...pair({ c: [32, 31, 22, 46, 0.8, 0.8], m: "trim", ...only(2) }),
    ...pair({ c: [22, 46, 27, 58, 0.8, 0.8], m: "trim", ...only(2) }),
    { c: [22, 46, 42, 46, 0.8, 0.8], m: "trim", ...only(2) },
    { e: [32, 61, 1.8, 1.8], m: "trim", ...only(2) },
    // Legendary: a gold cage with filigree wings, a great amber drop.
    ...pair({ c: [12, 3, 30, 22, 1.4, 1.4], m: "chain", ...only(3) }),
    ...pair({ p: [26, 28, 10, 22, 4, 30, 14, 34, 8, 42, 22, 38], m: "trim", ...only(3) }),
    { e: [32, 26, 4.5, 4], m: "trim", ...only(3) },
    { p: [32, 29, 45, 46, 40, 60, 24, 60, 19, 46], m: "gem", ...only(3, { glow: true }) },
    ...pair({ c: [32, 30, 20, 46, 1, 1], m: "trim", ...only(3) }),
    { c: [20, 46, 44, 46, 1, 1], m: "trim", ...only(3) },
    { p: [28, 60, 36, 60, 32, 64], m: "trim", ...only(3) },
    // Mythic: a tear of living light, rings of glass around it that touch nothing.
    ...pair({ c: [14, 3, 30, 20, 1, 1], m: "chain", ...upFrom(4) }),
    { p: [32, 26, 44, 44, 40, 56, 24, 56, 20, 44], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ p: [14, 44, 16, 36, 18, 44, 16, 52], m: "steel", ...upFrom(4) }),
    { p: [26, 60, 38, 60, 32, 64], m: "steel", ...upFrom(4) },
    { p: [28, 20, 36, 20, 32, 24], m: "steel", ...upFrom(4) },
    ...pair({ e: [10, 30, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) })
  ]
};

/** A stamped iron disc that grows into a sun, then a star of light. */
const medallion: RelicRecipe = {
  runes: [22, 44, 42, 44],
  parts: [
    // Common: a cord, a plain iron disc, a cross stamped in it.
    ...pair({ c: [16, 6, 29, 30, 1, 1], m: "strap", ...only(0) }),
    { e: [32, 42, 10, 10], m: "steel", ...only(0) },
    { c: [32, 36, 32, 48, 0.8, 0.8], m: "steel", ...only(0, { lift: -2 }) },
    { c: [26, 42, 38, 42, 0.8, 0.8], m: "steel", ...only(0, { lift: -2 }) },
    { e: [26, 48, 1.6, 1.5], m: "rust", ...only(0) },
    // Rare: a brass disc, a raised boss, a blue stone.
    ...pair({ c: [14, 5, 28, 28, 1.2, 1.2], m: "chain", ...only(1) }),
    { e: [32, 42, 12, 12], m: "trim", ...only(1) },
    { e: [32, 42, 9, 9], m: "trim", ...only(1, { lift: -1 }) },
    { e: [32, 42, 4, 4], m: "gem", ...only(1, { glow: true }) },
    // Epic: a silver disc engraved with a star, a violet stone.
    ...pair({ c: [12, 4, 28, 26, 1.2, 1.2], m: "chain", ...only(2) }),
    { e: [32, 42, 14, 14], m: "trim", ...only(2) },
    { e: [32, 42, 11.5, 11.5], m: "trim", ...only(2, { lift: -2 }) },
    ...[[32, 31, 32, 53], [21, 42, 43, 42], [24, 34, 40, 50], [40, 34, 24, 50]].map(([x1, y1, x2, y2]) => ({ c: [x1, y1, x2, y2, 0.7, 0.7] as const, m: "trim", ...only(2) })),
    { e: [32, 42, 4.5, 4.5], m: "gem", ...only(2, { glow: true }) },
    // Legendary: a gold sun, its rays past the rim, an amber heart.
    ...pair({ c: [10, 3, 28, 22, 1.4, 1.4], m: "chain", ...only(3) }),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((ray) => {
      const [dx, dy] = [[0, -1], [0.7, -0.7], [1, 0], [0.7, 0.7], [0, 1], [-0.7, 0.7], [-1, 0], [-0.7, -0.7]][ray];
      return { p: [32 + dx * 20, 42 + dy * 20, 32 - dy * 4 + dx * 12, 42 + dx * 4 + dy * 12, 32 + dy * 4 + dx * 12, 42 - dx * 4 + dy * 12], m: "trim", ...only(3) };
    }),
    { e: [32, 42, 14, 14], m: "trim", ...only(3) },
    { e: [32, 42, 11, 11], m: "trim", ...only(3, { lift: -2 }) },
    { e: [32, 42, 6, 6], m: "gem", ...only(3, { glow: true }) },
    // Mythic: a disc of Sky-Glass, a four-pointed star of light burning through it.
    ...pair({ c: [12, 3, 28, 22, 1, 1], m: "chain", ...upFrom(4) }),
    { e: [32, 42, 14, 14], m: "steel", ...upFrom(4) },
    { p: [32, 22, 35, 39, 52, 42, 35, 45, 32, 62, 29, 45, 12, 42, 29, 39], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ e: [22, 32, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) }),
    ...pair({ e: [42, 52, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) })
  ]
};

/** An iron band that grows into a ring of glass holding a star. */
const ring: RelicRecipe = {
  runes: [20, 50, 44, 50],
  parts: [
    // Common: a plain iron band, a little bent.
    { e: [32, 40, 13, 12], m: "steel", ...only(0) },
    { e: [32, 40, 8, 7], m: "steel", ...only(0, { cut: true }) },
    { e: [23, 46, 1.4, 1.4], m: "rust", ...only(0) },
    // Rare: a brass band, a small blue stone in a cup.
    { e: [32, 42, 14, 13], m: "trim", ...only(1) },
    { e: [32, 42, 9, 8], m: "trim", ...only(1, { cut: true }) },
    { e: [32, 28, 5, 4], m: "trim", ...only(1) },
    { e: [32, 26, 3.5, 3.5], m: "gem", ...only(1, { glow: true }) },
    // Epic: a silver band engraved along, claws holding a larger violet stone.
    { e: [32, 43, 15, 14], m: "trim", ...only(2) },
    { e: [32, 43, 10, 9], m: "trim", ...only(2, { cut: true }) },
    { e: [32, 43, 12.5, 11.5], m: "trim", ...only(2, { lift: -2 }) },
    { e: [32, 43, 10.5, 9.5], m: "trim", ...only(2, { cut: true }) },
    ...pair({ p: [24, 30, 26, 16, 30, 26], m: "trim", ...only(2) }),
    { e: [32, 23, 6, 6], m: "gem", ...only(2, { glow: true }) },
    // Legendary: a gold band with filigree shoulders, a great amber stone, heroic.
    { e: [32, 44, 16, 15], m: "trim", ...only(3) },
    { e: [32, 44, 10.5, 9.5], m: "trim", ...only(3, { cut: true }) },
    ...pair({ p: [14, 36, 12, 26, 20, 22, 24, 28, 18, 30], m: "trim", ...only(3) }),
    ...pair({ e: [16, 24, 2, 2], m: "trim", ...only(3) }),
    { e: [32, 22, 9, 8], m: "trim", ...only(3) },
    { e: [32, 21, 6.5, 6], m: "gem", ...only(3, { glow: true }) },
    // Mythic: a band of Sky-Glass, above it a stone of light held by nothing, shards round it.
    { e: [32, 45, 15, 14], m: "steel", ...upFrom(4) },
    { e: [32, 45, 10, 9], m: "steel", ...upFrom(4, { cut: true }) },
    { c: [21, 36, 43, 36, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) },
    { e: [32, 18, 6, 6], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ p: [18, 20, 22, 14, 23, 20], m: "steel", ...upFrom(4) }),
    { p: [29, 6, 32, 2, 35, 6], m: "steel", ...upFrom(4) },
    ...pair({ e: [14, 30, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) })
  ]
};

/** An iron ring with a flat face that grows into a crested seal. */
const seal: RelicRecipe = {
  runes: [22, 20, 42, 20],
  parts: [
    // Common: an iron band and a plain square face, scratched.
    { e: [32, 44, 12, 11], m: "steel", ...only(0) },
    { e: [32, 44, 7.5, 6.5], m: "steel", ...only(0, { cut: true }) },
    { r: [22, 16, 20, 14], m: "steel", ...only(0) },
    { c: [25, 20, 32, 26, 0.6, 0.6], m: "steel", ...only(0, { lift: -2 }) },
    // Rare: brass, a blue inlay in the face.
    { e: [32, 44, 13, 12], m: "trim", ...only(1) },
    { e: [32, 44, 8, 7], m: "trim", ...only(1, { cut: true }) },
    { r: [20, 14, 24, 16], m: "trim", ...only(1) },
    { r: [24, 17.5, 16, 9], m: "gem", ...only(1, { glow: true }) },
    // Epic: silver, a sigil engraved in the face, gems at the shoulders.
    { e: [32, 45, 14, 13], m: "trim", ...only(2) },
    { e: [32, 45, 9, 8], m: "trim", ...only(2, { cut: true }) },
    { p: [18, 16, 46, 16, 44, 32, 20, 32], m: "trim", ...only(2) },
    { r: [22, 19, 20, 10], m: "trim", ...only(2, { lift: -2 }) },
    { c: [32, 20, 32, 28, 0.7, 0.7], m: "trim", ...only(2, { lift: 1 }) },
    { c: [27, 22, 37, 22, 0.7, 0.7], m: "trim", ...only(2, { lift: 1 }) },
    ...pair({ e: [19, 37, 2.2, 2.2], m: "gem", ...only(2, { glow: true }) }),
    // Legendary: gold, a crested face with a crown in relief, an amber stone, heroic.
    { e: [32, 46, 15, 14], m: "trim", ...only(3) },
    { e: [32, 46, 9.5, 8.5], m: "trim", ...only(3, { cut: true }) },
    { p: [14, 14, 22, 8, 32, 12, 42, 8, 50, 14, 48, 32, 32, 38, 16, 32], m: "trim", ...only(3) },
    { p: [20, 16, 44, 16, 42, 28, 32, 33, 22, 28], m: "trim", ...only(3, { lift: -2 }) },
    { p: [25, 26, 25, 19, 28.5, 22, 32, 18, 35.5, 22, 39, 19, 39, 26], m: "trim", ...only(3, { lift: 1 }) },
    { e: [32, 11, 2.4, 2.4], m: "gem", ...only(3, { glow: true }) },
    // Mythic: a face of Sky-Glass with a sigil of light in it, floating over its band.
    { e: [32, 47, 14, 13], m: "steel", ...upFrom(4) },
    { e: [32, 47, 9, 8], m: "steel", ...upFrom(4, { cut: true }) },
    { p: [16, 12, 48, 12, 46, 30, 32, 36, 18, 30], m: "steel", ...upFrom(4) },
    { c: [32, 16, 32, 30, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) },
    { c: [24, 20, 40, 20, 0.8, 0.8], m: "light", ...upFrom(4, { glow: true }) },
    { e: [32, 20, 2.2, 2.2], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ p: [8, 22, 12, 20, 11, 25], m: "steel", ...upFrom(4) }),
    { p: [29, 4, 32, 1, 35, 4, 32, 7], m: "steel", ...upFrom(4) }
  ]
};

/** A thick iron ring with an oval face that grows into a lord's signet. */
const signet: RelicRecipe = {
  runes: [22, 24, 42, 24],
  parts: [
    // Common: a thick iron band, a plain oval face.
    { e: [32, 44, 12, 11], m: "steel", ...only(0) },
    { e: [32, 44, 7, 6], m: "steel", ...only(0, { cut: true }) },
    { e: [32, 26, 10, 7], m: "steel", ...only(0) },
    { e: [32, 26, 6.5, 4], m: "steel", ...only(0, { lift: -1 }) },
    // Rare: brass, a blue oval stone.
    { e: [32, 44, 13, 12], m: "trim", ...only(1) },
    { e: [32, 44, 8, 7], m: "trim", ...only(1, { cut: true }) },
    { e: [32, 25, 12, 8], m: "trim", ...only(1) },
    { e: [32, 25, 7.5, 4.8], m: "gem", ...only(1, { glow: true }) },
    // Epic: silver, a stone ringed with small gems, engraved shoulders.
    { e: [32, 45, 14, 13], m: "trim", ...only(2) },
    { e: [32, 45, 9, 8], m: "trim", ...only(2, { cut: true }) },
    ...pair({ c: [20, 38, 24, 32, 0.7, 0.7], m: "trim", ...only(2, { lift: -3 }) }),
    { e: [32, 24, 14, 10], m: "trim", ...only(2) },
    { e: [32, 24, 8, 5.5], m: "gem", ...only(2, { glow: true }) },
    ...pair({ e: [20.5, 24, 1.4, 1.4], m: "gem", ...only(2, { glow: true }) }),
    // Legendary: a gold signet in a filigree frame of leaves, an amber stone, heroic.
    { e: [32, 46, 15, 14], m: "trim", ...only(3) },
    { e: [32, 46, 9.5, 8.5], m: "trim", ...only(3, { cut: true }) },
    ...pair({ p: [18, 32, 6, 28, 8, 20, 14, 22, 18, 16], m: "trim", ...only(3) }),
    { e: [32, 22, 16, 12], m: "trim", ...only(3) },
    { e: [32, 22, 13, 9.5], m: "trim", ...only(3, { lift: -2 }) },
    { e: [32, 22, 9.5, 6.5], m: "gem", ...only(3, { glow: true }) },
    // Mythic: an eye of light in a lens of Sky-Glass, splinters raying from it.
    { e: [32, 47, 14, 13], m: "steel", ...upFrom(4) },
    { e: [32, 47, 9, 8], m: "steel", ...upFrom(4, { cut: true }) },
    { e: [32, 22, 16, 11], m: "steel", ...upFrom(4) },
    { e: [32, 22, 9, 5.5], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ p: [8, 22, 12, 19, 13, 25], m: "steel", ...upFrom(4) }),
    ...pair({ p: [14, 6, 18, 6, 17, 10], m: "steel", ...upFrom(4) }),
    { p: [30, 2, 34, 2, 32, 7], m: "steel", ...upFrom(4) }
  ]
};

/** A wide iron band that grows into a crown-like band of light. */
const band: RelicRecipe = {
  runes: [18, 50, 46, 50],
  parts: [
    // Common: a wide plain band, dented.
    { e: [32, 38, 15, 13], m: "steel", ...only(0) },
    { e: [32, 40, 10, 8], m: "steel", ...only(0, { cut: true }) },
    { e: [20, 30, 1.6, 1.6], m: "steel", ...only(0, { lift: -2 }) },
    // Rare: brass, a row of three blue stones.
    { e: [32, 38, 17, 15], m: "trim", ...only(1) },
    { e: [32, 41, 11, 9], m: "trim", ...only(1, { cut: true }) },
    ...[20, 32, 44].map((x) => ({ e: [x, x === 32 ? 25 : 28, 2.2, 2.2] as const, m: "gem", ...only(1, { glow: true }) })),
    // Epic: silver, an engraved wave between its rims, violet stones.
    { e: [32, 38, 18, 16], m: "trim", ...only(2) },
    { e: [32, 41, 11.5, 9.5], m: "trim", ...only(2, { cut: true }) },
    { e: [32, 38, 16, 14], m: "trim", ...only(2, { lift: -2 }) },
    { e: [32, 40, 13, 11], m: "trim", ...only(2, { cut: true }) },
    ...[[18, 30], [25, 25], [32, 24], [39, 25], [46, 30]].map(([x, y]) => ({ e: [x, y, 1.9, 1.9] as const, m: "gem", ...only(2, { glow: true }) })),
    // Legendary: a band of gold like a small crown, points and filigree, amber stones.
    { e: [32, 40, 19, 17], m: "trim", ...only(3) },
    { e: [32, 43, 12, 10], m: "trim", ...only(3, { cut: true }) },
    { p: [14, 32, 14, 14, 22, 22, 32, 8, 42, 22, 50, 14, 50, 32], m: "trim", ...only(3) },
    { e: [32, 16, 2.8, 2.8], m: "gem", ...only(3, { glow: true }) },
    ...pair({ e: [20, 27, 2.4, 2.4], m: "gem", ...only(3, { glow: true }) }),
    ...pair({ e: [14, 14, 1.8, 1.8], m: "trim", ...only(3) }),
    // Mythic: a band of Sky-Glass, a line of light round it, points of glass rising free.
    { e: [32, 42, 18, 16], m: "steel", ...upFrom(4) },
    { e: [32, 45, 11.5, 9.5], m: "steel", ...upFrom(4, { cut: true }) },
    { c: [16, 38, 48, 38, 0.9, 0.9], m: "light", ...upFrom(4, { glow: true }) },
    { p: [28, 22, 32, 6, 36, 22], m: "steel", ...upFrom(4) },
    ...pair({ p: [16, 26, 16, 12, 22, 24], m: "steel", ...upFrom(4) }),
    { e: [32, 28, 2.6, 2.6], m: "light", ...upFrom(4, { glow: true }) },
    ...pair({ e: [10, 22, 0.9, 0.9], m: "star", ...upFrom(4, { glow: true }) })
  ]
};

export const RELIC_SHAPES: Record<ItemSlot, readonly RelicRecipe[]> = {
  weapon: [blade, axe, sword, hammer, bow, spear, scythe],
  armor: [cuirass, hauberk, cloak, plate, brigandine],
  amulet: [amulet, talisman, pendant, medallion],
  ring: [ring, seal, signet, band]
};

/**
 * Named relics (BIBLE 11) have their own icon instead of a base shape; slot `rarity` still
 * takes their rarity ramp. Same 64-unit space, drawn at 24 × 24. `crown` is the Crown of
 * Orvane, the fifth slot that can never be filled.
 */
export const NAMED_RELIC_SHAPES: Record<string, RelicRecipe> = {
  // A long arrow, fletched in the rarity's color, a notch cut in its shaft for every night.
  "thousandth-arrow": {
    runes: [14, 52, 40, 26],
    parts: [
      { c: [8, 58, 50, 16, 1.6, 1.6], m: "grip" },
      { p: [46, 12, 60, 4, 54, 18], m: "blade" },
      { p: [8, 58, 4, 46, 14, 50], m: "rarity" },
      { p: [8, 58, 20, 60, 16, 50], m: "rarity", lift: -1 },
      { r: [26, 38, 2, 2], m: "notch" },
      { r: [32, 32, 2, 2], m: "notch" },
      { e: [53, 11, 2.4, 2.4], m: "gold", glow: true }
    ]
  },
  // The Alpha's winter coat: a hide, moss growing along its back.
  mosshide: {
    runes: [32, 20, 32, 50],
    parts: [
      { p: [16, 8, 48, 8, 58, 30, 52, 58, 40, 50, 32, 60, 24, 50, 12, 58, 6, 30], m: "fur" },
      { e: [32, 12, 12, 5], m: "moss" },
      { e: [22, 22, 5, 3], m: "moss", lift: -1 },
      { e: [44, 26, 4, 3], m: "moss", lift: -1 },
      { r: [14, 8, 36, 3], m: "rarity" },
      { e: [32, 10, 3, 3], m: "gold", glow: true }
    ]
  },
  // A smith's hammer, its head still glowing from the forge, a new mark on its cheek.
  "unfinished-hammer": {
    runes: [14, 55, 30, 32],
    parts: [
      { c: [12, 58, 34, 26, 2.8, 2.6], m: "grip" },
      { p: [20, 16, 40, 4, 58, 22, 38, 36], m: "blade" },
      { p: [44, 12, 50, 8, 56, 20, 50, 24], m: "ember", glow: true },
      { e: [34, 22, 3, 3], m: "rarity", glow: true },
      { r: [30, 34, 8, 3], m: "gold" }
    ]
  },
  // Kaelen's sword, snapped on the throne steps: the stump, a splinter, and the point
  // lying apart, still turned up the stairs.
  oathcutter: {
    runes: [24, 40, 38, 27],
    parts: [
      { p: [21, 37, 35, 23, 36.5, 27, 39.5, 25.5, 41, 29, 27, 43], m: "blade" },
      { p: [40, 22, 43, 20, 44, 23], m: "blade", lift: 1 },
      { p: [45, 16, 57, 4, 61, 2, 59, 7, 48, 20, 47.5, 16.5], m: "blade" },
      { c: [14, 34, 28, 48, 2.6, 2.6], m: "gold" },
      { c: [17, 45, 10, 52, 2.4, 2.4], m: "grip" },
      { e: [8, 55, 3.4, 3.4], m: "rarity", glow: true }
    ]
  },
  // A long scythe of bone, its dark blade clean along the edge: it has never been swung.
  quietus: {
    runes: [22, 54, 33, 18],
    parts: [
      { c: [20, 60, 36, 8, 2, 2], m: "bone" },
      { p: [37, 6, 24, 3, 12, 7, 5, 16, 2, 32, 8, 20, 16, 13, 26, 11, 37, 12], m: "dark" },
      { c: [3, 29, 8, 20, 1, 1], m: "blade", lift: 1 },
      { c: [8, 20, 16, 13, 1, 1], m: "blade", lift: 1 },
      { c: [16, 13, 27, 11, 1, 1], m: "blade", lift: 1 },
      { r: [22, 40, 8, 4], m: "rarity" },
      { e: [36, 9, 3, 3], m: "rarity", glow: true }
    ]
  },
  // A blade cut from the Sky-Glass, stars in it, and deep inside a small warm lamp.
  "splinter-of-sky": {
    runes: [28, 42, 50, 16],
    parts: [
      { p: [20, 40, 30, 26, 40, 20, 50, 8, 62, 2, 56, 16, 46, 24, 42, 34, 26, 46], m: "sky" },
      { c: [25, 42, 58, 5, 0.7, 0.7], m: "glass" },
      px(23, 7, "star", { glow: true }),
      px(17, 12, "star", { glow: true }),
      { e: [41, 25, 2, 2], m: "ember", glow: true },
      { c: [14, 36, 28, 50, 2.2, 2.2], m: "dark" },
      { c: [18, 46, 10, 54, 2.4, 2.4], m: "rarity" },
      { e: [8, 56, 3, 3], m: "glass" }
    ]
  },
  // A broad blade the color of morning, a small sun for its guard.
  dawnbreak: {
    runes: [25, 39, 52, 12],
    parts: [
      { p: [19, 37, 50, 6, 60, 4, 58, 14, 27, 45], m: "dawn" },
      { c: [26, 38, 53, 11, 0.8, 0.8], m: "dawn", lift: 1 },
      { c: [13, 33, 31, 51, 2.6, 2.6], m: "gold" },
      { e: [22, 42, 4, 4], m: "ember", glow: true },
      { c: [17, 47, 10, 54, 2.4, 2.4], m: "grip" },
      { e: [8, 57, 3.2, 3.2], m: "rarity", glow: true }
    ]
  },
  // An empty breastplate: through its collar, only the dark it walked here with.
  "hollow-plate": {
    runes: [32, 24, 32, 44],
    parts: [
      { e: [32, 14, 15, 6], m: "blade", lift: -1 },
      { p: [12, 14, 52, 14, 54, 28, 48, 48, 16, 48, 10, 28], m: "blade" },
      { r: [16, 47, 32, 5], m: "lame" },
      { r: [18, 52, 28, 5], m: "lame" },
      { e: [32, 17, 11, 5.5], m: "void" },
      { e: [10, 25, 3.5, 7], m: "void" },
      { e: [54, 25, 3.5, 7], m: "void" },
      { c: [32, 26, 32, 44, 1.2, 1.2], m: "blade", lift: 1 },
      { r: [16, 38, 32, 4], m: "rarity" }
    ]
  },
  // A mantle of green briars, woven across with thorned stems, a rose for its clasp.
  "briar-mantle": {
    runes: [32, 22, 32, 50],
    parts: [
      { p: [20, 8, 44, 8, 56, 54, 50, 50, 44, 58, 38, 52, 32, 60, 26, 52, 20, 58, 14, 50, 8, 54], m: "briar" },
      { c: [18, 18, 46, 52, 1.5, 1.5], m: "thorn" },
      { c: [46, 18, 18, 52, 1.5, 1.5], m: "thorn" },
      { p: [15, 24, 8, 23, 14, 29], m: "thorn" },
      { p: [49, 24, 56, 23, 50, 29], m: "thorn" },
      { p: [11, 40, 3, 41, 10, 45], m: "thorn" },
      { p: [53, 40, 61, 41, 54, 45], m: "thorn" },
      { p: [30, 36, 32, 30, 34, 36], m: "thorn" },
      { e: [25, 13, 3, 2], m: "leaf" },
      { e: [39, 13, 3, 2], m: "leaf" },
      { e: [32, 12, 4.5, 4.5], m: "rarity" },
      { e: [32, 12, 2, 2], m: "rarity", glow: true }
    ]
  },
  // A cuirass of shed gold scales, row over row, a red heart-scale at the throat.
  "aurelion-scales": {
    runes: [32, 26, 32, 50],
    parts: [
      { p: [14, 12, 50, 12, 52, 26, 46, 54, 18, 54, 12, 26], m: "scale", lift: -2 },
      { e: [20, 50, 6.5, 6], m: "scale", lift: -2 }, { e: [20, 49, 5, 4.5], m: "scale" },
      { e: [32, 50, 6.5, 6], m: "scale", lift: -2 }, { e: [32, 49, 5, 4.5], m: "scale" },
      { e: [44, 50, 6.5, 6], m: "scale", lift: -2 }, { e: [44, 49, 5, 4.5], m: "scale" },
      { e: [14, 43, 6.5, 6], m: "scale", lift: -2 }, { e: [14, 42, 5, 4.5], m: "scale" },
      { e: [26, 43, 6.5, 6], m: "scale", lift: -2 }, { e: [26, 42, 5, 4.5], m: "scale" },
      { e: [38, 43, 6.5, 6], m: "scale", lift: -2 }, { e: [38, 42, 5, 4.5], m: "scale" },
      { e: [50, 43, 6.5, 6], m: "scale", lift: -2 }, { e: [50, 42, 5, 4.5], m: "scale" },
      { e: [20, 36, 6.5, 6], m: "scale", lift: -2 }, { e: [20, 35, 5, 4.5], m: "scale" },
      { e: [32, 36, 6.5, 6], m: "scale", lift: -2 }, { e: [32, 35, 5, 4.5], m: "scale" },
      { e: [44, 36, 6.5, 6], m: "scale", lift: -2 }, { e: [44, 35, 5, 4.5], m: "scale" },
      { e: [14, 29, 6.5, 6], m: "scale", lift: -2 }, { e: [14, 28, 5, 4.5], m: "scale" },
      { e: [26, 29, 6.5, 6], m: "scale", lift: -2 }, { e: [26, 28, 5, 4.5], m: "scale" },
      { e: [38, 29, 6.5, 6], m: "scale", lift: -2 }, { e: [38, 28, 5, 4.5], m: "scale" },
      { e: [50, 29, 6.5, 6], m: "scale", lift: -2 }, { e: [50, 28, 5, 4.5], m: "scale" },
      { e: [20, 22, 6.5, 6], m: "scale", lift: -2 }, { e: [20, 21, 5, 4.5], m: "scale" },
      { e: [32, 22, 6.5, 6], m: "scale", lift: -2 }, { e: [32, 21, 5, 4.5], m: "scale" },
      { e: [44, 22, 6.5, 6], m: "scale", lift: -2 }, { e: [44, 21, 5, 4.5], m: "scale" },
      { p: [0, 0, 64, 0, 64, 26, 52, 26, 50, 12, 14, 12, 12, 26, 0, 26], m: "scale", cut: true },
      { p: [0, 26, 12, 26, 18, 56, 0, 64], m: "scale", cut: true },
      { p: [64, 26, 52, 26, 46, 56, 64, 64], m: "scale", cut: true },
      { r: [0, 56, 64, 8], m: "scale", cut: true },
      { e: [32, 10, 9, 6], m: "scale", cut: true },
      { e: [32, 19, 2.8, 2.8], m: "rarity", glow: true }
    ]
  },
  // An ash-grey robe, its hem and cuffs still burning.
  "ash-vestment": {
    runes: [32, 22, 32, 50],
    parts: [
      { p: [22, 8, 42, 8, 60, 30, 52, 34, 46, 26, 52, 58, 12, 58, 18, 26, 12, 34, 4, 30], m: "ash", lift: 1 },
      { p: [26, 8, 38, 8, 32, 20], m: "ash", lift: -2 },
      { r: [18, 30, 28, 4], m: "rarity" },
      { c: [32, 34, 30, 50, 0.8, 0.8], m: "ash", lift: -1 },
      { p: [12, 54, 52, 54, 53, 58, 11, 58], m: "ember", glow: true },
      { p: [4, 30, 12, 34, 10, 36, 3, 32], m: "ember", glow: true },
      { p: [60, 30, 52, 34, 54, 36, 61, 32], m: "ember", glow: true }
    ]
  },
  // A royal mantle with an ermine collar, its purple gone the grey of old ash.
  "mantle-of-the-last-court": {
    runes: [32, 24, 32, 54],
    parts: [
      { p: [16, 12, 48, 12, 60, 58, 40, 56, 32, 60, 24, 56, 4, 58], m: "court" },
      { p: [26, 18, 38, 18, 42, 56, 32, 60, 22, 56], m: "court", lift: -2 },
      { c: [26, 18, 21, 55, 2.4, 2.8], m: "ermine" },
      { c: [38, 18, 43, 55, 2.4, 2.8], m: "ermine" },
      { e: [32, 14, 18, 6], m: "ermine" },
      { c: [12, 30, 8, 54, 0.8, 0.8], m: "court", lift: -1 },
      { c: [52, 30, 56, 54, 0.8, 0.8], m: "court", lift: -1 },
      px(9, 7, "spot"),
      px(21, 7, "spot"),
      px(11, 17, "spot"),
      px(21, 21, "spot"),
      { e: [32, 18, 4, 4], m: "gold" },
      { e: [32, 18, 2, 2], m: "rarity", glow: true }
    ]
  },
  // An hourglass the size of a tear. The sand has gathered at the top, and more rises.
  "eldra-locket": {
    runes: [22.5, 26, 22.5, 54],
    parts: [
      { c: [14, 4, 28, 16, 1.2, 1.2], m: "gold" },
      { c: [50, 4, 36, 16, 1.2, 1.2], m: "gold" },
      { r: [20, 19, 24, 5], m: "gold" },
      { r: [20, 55, 24, 5], m: "gold" },
      { r: [21, 23, 3, 33], m: "gold", lift: -1 },
      { r: [40, 23, 3, 33], m: "gold", lift: -1 },
      { p: [25, 24, 39, 24, 39, 30, 33, 39, 39, 48, 39, 55, 25, 55, 25, 48, 31, 39, 25, 30], m: "glass" },
      { p: [25, 24, 39, 24, 39, 29, 32, 34, 25, 29], m: "sand", glow: true },
      px(16, 19, "sand", { glow: true }, 1, 4),
      px(15, 25, "sand", { glow: true }),
      { e: [32, 17, 2.6, 2.6], m: "rarity", glow: true }
    ]
  },
  // A rough grey stone on a cord, humming: a vein of light, and the air rings around it.
  "singing-stone": {
    runes: [30, 32, 34, 54],
    parts: [
      { c: [16, 4, 28, 26, 1.2, 1.2], m: "grip" },
      { c: [48, 4, 36, 26, 1.2, 1.2], m: "grip" },
      { p: [24, 28, 38, 24, 46, 34, 44, 52, 30, 58, 18, 46, 20, 34], m: "stone", lift: 1 },
      px(12, 16, "rarity", { glow: true }),
      px(13, 17, "rarity", { glow: true }, 3, 1),
      px(16, 19, "rarity", { glow: true }, 1, 3),
      px(17, 21, "rarity", { glow: true }),
      px(19, 23, "rarity", { glow: true }, 1, 3),
      { c: [12, 34, 9, 41, 1, 1], m: "rarity", glow: true },
      { c: [9, 41, 12, 48, 1, 1], m: "rarity", glow: true },
      { c: [52, 34, 55, 41, 1, 1], m: "rarity", glow: true },
      { c: [55, 41, 52, 48, 1, 1], m: "rarity", glow: true },
      { c: [5, 29, 2, 41, 1, 1], m: "rarity", glow: true },
      { c: [2, 41, 5, 53, 1, 1], m: "rarity", glow: true },
      { c: [59, 29, 62, 41, 1, 1], m: "rarity", glow: true },
      { c: [62, 41, 59, 53, 1, 1], m: "rarity", glow: true }
    ]
  },
  // A spiral shell of pale stone on a cord, its mouth faintly lit.
  "oriane-ear": {
    runes: [20, 46, 40, 46],
    parts: [
      { c: [16, 4, 28, 24, 1.2, 1.2], m: "grip" },
      { c: [48, 4, 36, 24, 1.2, 1.2], m: "grip" },
      { e: [30, 42, 17, 15], m: "shell", lift: 1 },
      { c: [30, 40, 35, 40, 1, 1], m: "shell", lift: -2 },
      { c: [35, 40, 34, 46, 1, 1], m: "shell", lift: -2 },
      { c: [34, 46, 26, 47, 1, 1], m: "shell", lift: -2 },
      { c: [26, 47, 22, 39, 1, 1], m: "shell", lift: -2 },
      { c: [22, 39, 28, 32, 1, 1], m: "shell", lift: -2 },
      { c: [28, 32, 40, 33, 1, 1], m: "shell", lift: -2 },
      { c: [40, 33, 44, 42, 1, 1], m: "shell", lift: -2 },
      { p: [45, 38, 52, 32, 54, 50, 46, 56, 44, 48], m: "rarity", glow: true }
    ]
  },
  // The mother-tree's last seed, split by a green light, a leaf at its tip.
  "grove-seed": {
    runes: [24, 36, 24, 52],
    parts: [
      { c: [16, 4, 28, 20, 1.2, 1.2], m: "moss" },
      { c: [48, 4, 36, 20, 1.2, 1.2], m: "moss" },
      { e: [32, 21, 3, 3], m: "rarity" },
      { p: [32, 22, 40, 30, 46, 42, 44, 52, 36, 59, 28, 59, 20, 52, 18, 42, 24, 30], m: "husk" },
      { p: [32, 30, 37, 42, 35, 54, 32, 57, 29, 54, 27, 42], m: "sprout", glow: true },
      { p: [34, 24, 44, 16, 48, 20, 40, 27], m: "leaf" }
    ]
  },
  // A dark reliquary on a chain; behind its glass, what he keeps of his life.
  phylactery: {
    runes: [25, 30, 25, 48],
    parts: [
      { c: [14, 4, 28, 18, 1.4, 1.4], m: "dark" },
      { c: [50, 4, 36, 18, 1.4, 1.4], m: "dark" },
      { p: [26, 18, 38, 18, 42, 24, 22, 24], m: "bone" },
      { p: [22, 24, 42, 24, 46, 34, 42, 52, 22, 52, 18, 34], m: "dark" },
      { e: [32, 38, 7, 10], m: "soul", glow: true },
      { p: [22, 52, 42, 52, 36, 60, 28, 60], m: "bone" },
      { e: [32, 56, 2.6, 2.6], m: "rarity", glow: true }
    ]
  },
  // A rolled scroll, tied, its wax seal unbroken.
  "last-decree": {
    runes: [16, 40, 44, 16],
    parts: [
      { c: [12, 44, 48, 12, 8, 8], m: "paper" },
      { e: [48, 12, 5, 7], m: "paper", lift: -1 },
      { e: [48, 12, 2, 3], m: "notch" },
      { c: [24, 22, 38, 38, 1.2, 1.2], m: "string" },
      { e: [30, 34, 8, 8], m: "rarity" },
      { e: [30, 34, 4, 4], m: "rarity", lift: -1 },
      { p: [26, 40, 24, 50, 30, 46], m: "rarity", lift: -1 },
      { p: [34, 40, 38, 50, 32, 46], m: "rarity", lift: -1 }
    ]
  },
  // The King's seal ring: a crown, and under it a letter worn almost away.
  "signet-of-orvane": {
    runes: [22, 54, 42, 54],
    parts: [
      { e: [32, 46, 14, 13], m: "gold" },
      { e: [32, 46, 8, 7], m: "gold", cut: true },
      { e: [32, 24, 17, 14], m: "gold" },
      { e: [32, 24, 12.5, 10.5], m: "rarity" },
      px(13, 8, "gold", { lift: 1 }),
      px(15, 8, "gold", { lift: 1 }, 2, 1),
      px(18, 8, "gold", { lift: 1 }),
      px(13, 9, "gold", { lift: 1 }, 6, 2),
      px(15, 12, "gold", { lift: -1 }, 2, 1),
      px(14, 13, "gold", { lift: -1 }),
      px(17, 13, "gold", { lift: -1 }),
      px(14, 14, "gold", { lift: -1 }, 4, 1),
      px(14, 15, "gold", { lift: -1 }),
      px(17, 15, "gold", { lift: -1 })
    ]
  },
  // A tiny gold ring, a bite taken out of it.
  "rat-ring": {
    runes: [22, 48, 42, 48],
    parts: [
      { e: [32, 40, 13, 13], m: "gold" },
      { e: [32, 40, 7.5, 7.5], m: "gold", cut: true },
      { e: [45, 30, 4.5, 4.5], m: "gold", cut: true },
      { e: [47, 37, 3.5, 3.5], m: "gold", cut: true },
      { e: [23, 29, 2.8, 2.8], m: "rarity", glow: true }
    ]
  },
  // An iron band set with the shard he buried; the eye in it has closed.
  "lodestone-band": {
    runes: [22, 52, 42, 52],
    parts: [
      { e: [32, 44, 15, 13], m: "dark" },
      { e: [32, 44, 9, 7], m: "dark", cut: true },
      { r: [17, 26, 5, 8], m: "rarity" },
      { r: [42, 26, 5, 8], m: "rarity" },
      { p: [32, 6, 47, 22, 32, 38, 17, 22], m: "glass" },
      px(13, 11, "notch"),
      px(18, 11, "notch"),
      px(14, 12, "notch", {}, 4, 1),
      px(15, 13, "notch", {}, 2, 1)
    ]
  },
  // A plain wedding band, tilted to show the letters engraved inside.
  "mirelle-ring": {
    runes: [14, 44, 50, 44],
    parts: [
      { e: [32, 38, 23, 16], m: "gold" },
      { e: [32, 35, 18, 10], m: "inner" },
      { e: [32, 39.5, 15, 7], m: "gold", cut: true },
      px(10, 13, "gold", { lift: -2 }),
      px(13, 13, "gold", { lift: -2 }),
      px(18, 13, "gold", { lift: -2 }),
      px(21, 13, "gold", { lift: -2 }),
      { e: [32, 52, 3, 2.4], m: "rarity", glow: true }
    ]
  },
  // A brass token with a hole in it, threaded on a plain band.
  "stallkeeper-band": {
    runes: [24, 54, 40, 54],
    parts: [
      { e: [32, 46, 13, 13], m: "gold" },
      { e: [32, 47, 9, 9], m: "gold", lift: -1 },
      { e: [32, 40, 4.5, 4], m: "gold", cut: true },
      { e: [32, 22, 12, 14], m: "blade" },
      { e: [32, 22, 7, 9], m: "blade", cut: true },
      { e: [32, 49, 3, 3], m: "rarity", glow: true }
    ]
  },
  // A wide band with two suns engraved: one shines, one is scratched out.
  "second-morning": {
    runes: [14, 46, 50, 46],
    parts: [
      { e: [32, 36, 23, 21], m: "dark", lift: 1 },
      { e: [32, 41, 13, 11], m: "dark", cut: true },
      px(9, 10, "ember", { glow: true }, 3, 3),
      px(10, 8, "ember", { glow: true }),
      px(7, 11, "ember", { glow: true }),
      px(13, 11, "ember", { glow: true }),
      px(20, 10, "dark", { lift: -1 }, 3, 3),
      px(21, 8, "dark", { lift: -1 }),
      px(18, 11, "dark", { lift: -1 }),
      px(24, 11, "dark", { lift: -1 }),
      { c: [37, 15, 51, 29, 0.9, 0.9], m: "string", lift: 1 },
      { c: [51, 15, 37, 29, 0.9, 0.9], m: "string", lift: 1 },
      { e: [32, 55, 3, 2.4], m: "rarity", glow: true }
    ]
  },
  // The Crown of Orvane, whose points outnumber the gems left in it.
  crown: {
    runes: [14, 46, 50, 46],
    parts: [
      { p: [10, 44, 10, 20, 20, 32, 26, 14, 32, 26, 38, 14, 44, 32, 54, 20, 54, 44], m: "dim" },
      { r: [8, 42, 48, 10], m: "dim", lift: -1 },
      { e: [26, 14, 2.6, 2.6], m: "dim" },
      { e: [38, 14, 2.6, 2.6], m: "dim" },
      { e: [10, 20, 2.6, 2.6], m: "dim" },
      { e: [54, 20, 2.6, 2.6], m: "dim" },
      { e: [32, 47, 3.4, 3], m: "void" },
      { e: [18, 47, 2.4, 2.4], m: "void" },
      { e: [46, 47, 2.6, 2.6], m: "garnet" }
    ]
  }
};

export const RELIC_MATERIALS: Record<string, MaterialId | Material> = {
  blade: "metal",
  chain: "metal",
  lame: "metal",
  gold: "gold",
  inner: "gold",
  scale: "gold",
  sand: "gold",
  star: "gold",
  grip: "bark",
  thorn: "bark",
  husk: "bark",
  bone: "bone",
  string: "bone",
  paper: "bone",
  ermine: "bone",
  shell: "bone",
  notch: "fur-shadow",
  spot: "fur-shadow",
  void: "fur-shadow",
  fur: "fur-brown",
  moss: "moss",
  briar: "moss",
  leaf: "leaf",
  ember: "ember",
  dark: "dark-metal",
  glass: "crystal",
  stone: "stone",
  ash: "stone",
  court: "fur-grey",
  wisp: "wisp",
  sprout: "leaf",
  soul: "essence",
  /** The Sky-Glass: night held in a pane, cut in facets. */
  sky: SKY,
  /** The Crown's gold, gone dull; its last gem, unlit. */
  dim: { ramp: [C.goldInk, C.goldDeep, C.goldDark, C.gold], texture: "smooth" },
  garnet: { ramp: [C.night1, C.blood, C.red], texture: "smooth" },
  /** Dawnbreak's steel, the warm pale of a window in the morning. */
  dawn: { ramp: [C.flesh1, C.flesh2, C.flesh3, C.paper, C.goldLight], texture: "metal" }
};


