import type { StructureMaterial } from "./architecture";
import { C, type Pal } from "./palette";

/**
 * Biome scenes (BIBLE 18.7): one grid, 180 rows high, in three depths. Far off: a sky in
 * dithered bands with its moon, halo and stars, lit clouds, ranges each darker and duller
 * with distance (their faces turned to the moon a step lighter), the landmark where the
 * road leads, far buildings in silhouette. In the middle: the ground and its winding road,
 * what is sown on it, still water, mist, the props and the buildings (architecture.ts,
 * structures/). In front: dark shapes at the edges. Every color is named here: a scene
 * uses 20 colors at most, 24 with any creature of its biome.
 */
export type FarKind = "mountains" | "hills" | "treeline" | "reeds" | "towers" | "canopy" | "trunks" | "boughs" | "cliffs" | "deadwood";
export type PropKind = "fence" | "scarecrow" | "sheaf" | "grave";
export type LightKind = "firefly" | "wisp" | "rune" | "ember";
/** Where the road leads: a far place, small, flat, with a light of its own. */
export type LandmarkKind = "keep" | "great-tree" | "crystal-gate" | "manor" | "throne-tower";
/** The dark shapes of the foreground, at the edges of the frame. */
export type ForegroundKind = "grass" | "branches" | "rocks" | "reeds" | "ruins";

export interface SceneRange {
  kind: FarKind;
  color: Pal;
  /** Row of its foot, and how high it rises. */
  base: number;
  height: number;
  /** Moonlight along its ridge. */
  rim?: Pal;
  /** The faces turned to the moon, a step lighter than the range, down from the ridge. */
  lit?: Pal;
  /** Half width of a clearing left open in the middle (trunks, dead trees): the guardian's ground. */
  clearing?: number;
}

/** What may be sown over the ground. */
export type SowKind = "fern" | "litter" | "mushroom" | "root" | "slab" | "crystal" | "reed" | "lily" | "rubble";

export interface SowRecipe {
  kind: SowKind;
  /** Body, lit side, accent. */
  colors: readonly [Pal, Pal, Pal];
  /** Share of the ground's seeds this kind takes, about 0.2 to 1.5. */
  density: number;
  /** The accent gives light (caps, crystals). */
  glow?: boolean;
  /** The shade under it (the near ground when absent). */
  shade?: Pal;
  /** Also on the road. */
  road?: boolean;
}

/** A building or a ruin (architecture.ts) standing in the scene. */
export interface StructurePlacement {
  /** Key of STRUCTURES. */
  id: string;
  /** Center, on a layer 640 wide, and the row its foot stands on. */
  x: number;
  base: number;
  /** Mirrored (its light is then taken from the other side, still toward the moon). */
  flip?: boolean;
  /** Far off: a silhouette in the colors of the range behind, its lights still lit. */
  far?: boolean;
  /** In the middle distance, behind the guardian: drawn in full but in the scene's air (the build's haze tones), its lights lit. */
  haze?: boolean;
  /** It stands in water: its reflection hangs below it. */
  reflect?: boolean;
}

/** The colors a scene lends its structures (BuildColors without the moon's side). */
export interface SceneBuild {
  ramps: Readonly<Partial<Record<StructureMaterial, readonly Pal[]>>>;
  outline: Pal;
  rim: Pal;
  core?: Pal;
  growth: readonly Pal[];
  /** Silhouette and rim of far structures. */
  far: readonly [Pal, Pal];
  /** The air of the middle distance, dark to light: what hazed structures are drawn in. */
  haze?: readonly [Pal, Pal, Pal];
}

/** Still water: a flooded land from the horizon down to `until`, and its ramp (deep, body, lit ripples, glints). */
export interface SceneWater {
  ramp: readonly [Pal, Pal, Pal, Pal];
  until: number;
  /** How high it stands: more of the land under water (0 by default, about 0.1 to 0.3). */
  level?: number;
}

/** A light standing in the scene (a brazier, a lantern, a window): halo rings in the sky and on the ground. */
export interface SceneHalo {
  x: number;
  y: number;
  r: number;
  color: Pal;
}

/** A flower or a stone placed by hand on the ground (bottom middle at x, y). */
export interface GroundDetail {
  kind: "flower" | "bud" | "pebble";
  x: number;
  y: number;
  /** Petals (flowers): the grass tip color when absent. */
  color?: Pal;
}

export interface SceneProp {
  kind: PropKind;
  /** Center, on a layer 640 wide. Size is the box of shape-drawn props; hand-drawn ones keep their drawing's. */
  x: number;
  /** Row its foot stands on (hanging props: the row they hang down to). */
  base: number;
  size: number;
}

export interface SceneRecipe {
  /** Sky bands, top to horizon. */
  sky: readonly Pal[];
  stars: number;
  starColor: Pal;
  /** The moon: a lit disc and its shaded side; a crescent shows only a sliver (the Hearthfields' until earned). */
  moon?: {
    x: number;
    y: number;
    r: number;
    color: Pal;
    shade: Pal;
    crescent?: boolean;
    /** Rings of halo: regular dithering, each sparser, where the sky turns one band lighter. */
    halo?: number;
  };
  /** Where the light comes from: the creature's shadow falls the other way. */
  source: { x: number; y: number };
  /** A cave: the sky is a rock ceiling of this color. */
  ceiling?: Pal;
  /** Clouds: puffs in two tones, lit on the moon's side. */
  clouds?: { color: Pal; top: number; bottom: number; count: number; lit: Pal };
  /** Row of the horizon. */
  horizon: number;
  /** Far to near. */
  ranges: readonly SceneRange[];
  /** Where the road leads; a place without one sends its road to the middle of the view. */
  landmark?: { kind: LandmarkKind; x: number; base: number; color: Pal; rim?: Pal };
  props: readonly SceneProp[];
  /** Color of the silhouetted props (materials without paint). */
  prop: Pal;
  /** Props in their own colors: each material a lit color and a shade. */
  paint?: Readonly<Record<string, readonly [Pal, Pal]>>;
  /** Moonlight on the top and the lit side of painted props. */
  rim?: Pal;
  /** A thin mist lying over the horizon line, rows above and below it. */
  mist?: { color: Pal; above: number; below: number };
  /** Color of the creature's shadow (the props' color when absent). */
  shadow?: Pal;
  /** How the creatures are set into the scene: a thin moonlit rim of this color, and the air their midtones lean toward (the sky's lowest band when absent). */
  night?: { rim: Pal; ambient?: Pal };
  /** Grass drawn tuft by tuft: lit tips, flower hearts, stones and what is placed by hand. */
  grass?: {
    /** Blade colors in the far fields, the fields and the near ground. */
    blades: readonly [Pal, Pal, Pal];
    tip: Pal;
    heart: Pal;
    rim: Pal;
    stone: readonly [Pal, Pal];
    details: readonly GroundDetail[];
  };
  /** Every light of the scene: windows, flames, eyes of the scarecrow, fireflies. */
  glow: Pal;
  /** The ground: a lit line at the horizon, its fill, and the darker ground near the walker. */
  /** `roadFrom`: the row where the road begins, when it does not run all the way to the horizon. */
  ground: { edge: Pal; fill: Pal; near: Pal; road?: Pal; rut?: Pal; roadFrom?: number };
  /** Details sown over the ground (drawn by hand in the generator), small far off, full in front. */
  sow?: readonly SowRecipe[];
  /** Flagstones laid in perspective over the road, or over the whole ground. */
  paving?: { colors: readonly [Pal, Pal, Pal]; joint: Pal; whole?: boolean };
  /** A glade: the ground lit by the moon around where the guardian stands, its edge dithered. */
  glade?: { color: Pal; x: number; y: number; rx: number; ry: number };
  /** Rails along the road, and their sleepers. */
  rails?: { rail: Pal; sleeper: Pal };
  /** The dark shapes in front; a lighter row behind, and a thin moonlit edge on the near ones. */
  foreground: { kind: ForegroundKind; color: Pal; back?: Pal; rim?: Pal };
  /** Buildings and ruins, drawn by the builder and worn by the eras. */
  structures?: readonly StructurePlacement[];
  build?: SceneBuild;
  water?: SceneWater;
  /** Halos of the lights standing in the scene, on the sky layer: rings a band lighter. */
  halos?: readonly SceneHalo[];
  /** Shafts of moonlight falling through a roof of leaves or rock: columns of regular dithering. */
  shafts?: { color: Pal; count: number; slant: number };
  /** The mist drifts (pixels per second): a moving layer instead of a still one. */
  mistDrift?: number;
  light: { kind: LightKind; count: number };
  accent: Pal;
  seed: number;
}

export const SCENE_WIDTH = 320;
export const SCENE_HEIGHT = 180;
/** Row the creature's feet stand on. */
export const SCENE_FLOOR = 140;

export const SCENES: Record<string, SceneRecipe> = {
  "green-plains": {
    sky: [C.night1, C.night2, C.plum, C.keepStone, C.amethyst],
    stars: 44,
    starColor: C.lilac,
    // A low moon over the fields, a crescent until someone walks them at the darkest hour.
    moon: { x: 252, y: 26, r: 10, color: C.goldLight, shade: C.lilac, crescent: true, halo: 2 },
    source: { x: 252, y: 26 },
    clouds: { color: C.keepStone, lit: C.amethyst, top: 30, bottom: 44, count: 3 },
    horizon: 74,
    ranges: [
      { kind: "mountains", color: C.night4, base: 74, height: 22, rim: C.keepStone },
      { kind: "hills", color: C.night3, base: 74, height: 10, rim: C.night4 },
      { kind: "treeline", color: C.woodNight2, base: 74, height: 9 }
    ],
    // Far across the fields, on its hill, the Keep: one window still lit.
    landmark: { kind: "keep", x: 206, base: 76, color: C.night3, rim: C.keepStone },
    mist: { color: C.keepStone, above: 2, below: 5 },
    // Everything that matters stands between columns 50 and 270: a view as narrow as 200
    // columns still shows it. The scarecrow is drawn by hand (its size is its drawing's).
    props: [
      { kind: "grave", x: 48, base: 122, size: 18 },
      { kind: "scarecrow", x: 88, base: 114, size: 25 },
      { kind: "sheaf", x: 330, base: 110, size: 16 },
      { kind: "fence", x: 380, base: 100, size: 24 },
      { kind: "sheaf", x: 470, base: 100, size: 16 }
    ],
    prop: C.night3,
    paint: {
      wood: [C.fur1, C.flesh0],
      door: [C.night3, C.night3],
      stone: [C.keepStone, C.night4],
      roof: [C.goldDeep, C.fur1],
      cloth: [C.fur1, C.flesh0],
      hat: [C.flesh0, C.night3],
      straw: [C.goldDeep, C.fur1]
    },
    rim: C.lilac,
    // Far up the road, in the mist of the fields: Brom's forge at the crossroads, the barn and the chapel.
    structures: [
      { id: "hearth-barn", x: 60, base: 88, haze: true },
      { id: "hearth-barn", x: 150, base: 84, haze: true, flip: true },
      { id: "hearth-chapel", x: 186, base: 84, haze: true },
      { id: "hearth-barn", x: 460, base: 88, haze: true, flip: true },
      { id: "brom-forge", x: 232, base: 98, haze: true, flip: true }
    ],
    build: {
      ramps: {
        stone: [C.night3, C.night4, C.keepStone, C.haze],
        wood: [C.night3, C.flesh0, C.fur1],
        roof: [C.flesh0, C.fur1, C.goldDeep],
        metal: [C.night3, C.keepStone, C.haze, C.lilac]
      },
      outline: C.ink,
      rim: C.lilac,
      growth: [C.woodFloor2, C.field2, C.woodLeaf],
      far: [C.night3, C.keepStone],
      haze: [C.night3, C.night4, C.keepStone]
    },
    glow: C.goldLight,
    // The fields at night: dark, dull, pulled toward blue-green; only the lights warm them.
    ground: { edge: C.woodFloor2, fill: C.woodFloor2, near: C.woodNight2, road: C.keepStone, rut: C.night4 },
    shadow: C.ink,
    night: { rim: C.lilac },
    grass: {
      blades: [C.woodLeaf, C.woodLeaf, C.woodFloor2],
      tip: C.woodLeaf,
      heart: C.lilac,
      rim: C.lilac,
      stone: [C.keepStone, C.night4],
      details: [
        { kind: "bud", x: 58, y: 92 },
        { kind: "pebble", x: 100, y: 95 },
        { kind: "bud", x: 276, y: 95, color: C.haze },
        { kind: "bud", x: 238, y: 100 },
        { kind: "flower", x: 88, y: 105, color: C.haze },
        { kind: "bud", x: 62, y: 110, color: C.haze },
        { kind: "pebble", x: 234, y: 113 },
        { kind: "flower", x: 266, y: 115, color: C.haze },
        { kind: "flower", x: 76, y: 118, color: C.haze },
        { kind: "flower", x: 244, y: 123, color: C.haze },
        { kind: "bud", x: 54, y: 126 },
        { kind: "pebble", x: 70, y: 131 },
        { kind: "flower", x: 256, y: 131, color: C.haze },
        { kind: "flower", x: 92, y: 136, color: C.haze },
        { kind: "pebble", x: 262, y: 141 },
        { kind: "flower", x: 216, y: 139, color: C.haze },
        { kind: "flower", x: 106, y: 146, color: C.haze },
        { kind: "flower", x: 118, y: 157, color: C.haze }
      ]
    },
    foreground: { kind: "grass", color: C.ink, back: C.night2, rim: C.keepStone },
    light: { kind: "firefly", count: 14 },
    accent: C.plainsAccent,
    seed: 101
  },
  "dark-forest": {
    sky: [C.woodNight, C.woodNight2, C.woodFloor, C.woodFloor2],
    stars: 26,
    starColor: C.pale,
    // A small cold moon seen through a gap in the leaves.
    moon: { x: 236, y: 26, r: 8, color: C.wisp, shade: C.pale, halo: 2 },
    source: { x: 236, y: 26 },
    clouds: { color: C.woodFloor, lit: C.woodFloor2, top: 34, bottom: 54, count: 3 },
    horizon: 100,
    ranges: [
      { kind: "canopy", color: C.woodFloor2, lit: C.woodLeaf, base: 100, height: 34 },
      { kind: "trunks", color: C.woodFloor, lit: C.woodFloor2, base: 106, height: 60, clearing: 62 },
      { kind: "trunks", color: C.woodNight2, lit: C.woodFloor, base: 112, height: 90, clearing: 84 },
      { kind: "boughs", color: C.woodNight, lit: C.woodFloor2, base: 0, height: 26 }
    ],
    // Far down the path, the mother tree, a light in her hollow.
    landmark: { kind: "great-tree", x: 190, base: 101, color: C.woodNight2, rim: C.woodLeaf },
    shafts: { color: C.woodLeaf, count: 2, slant: -0.4 },
    glade: { color: C.woodFloor2, x: 168, y: 136, rx: 70, ry: 16 },
    mist: { color: C.woodFloor2, above: 3, below: 9 },
    mistDrift: 2,
    props: [],
    structures: [
      // Deeper in the wood, in its air behind the guardian: a watch-hut, a bridge, old stones.
      { id: "grove-bridge", x: 122, base: 108, haze: true },
      { id: "grove-watch", x: 160, base: 106, haze: true },
      { id: "grove-stones", x: 204, base: 105, haze: true },
      { id: "grove-watch", x: 470, base: 104, haze: true, flip: true },
      { id: "grove-hut", x: 74, base: 112, haze: true },
      { id: "grove-dolmen", x: 252, base: 121 },
      { id: "wayshrine", x: 294, base: 113 },
      { id: "grove-dolmen", x: 430, base: 117, flip: true },
      { id: "wayshrine", x: 540, base: 111, flip: true }
    ],
    build: {
      ramps: {
        bark: [C.night1, C.night3, C.flesh0, C.fur1],
        wood: [C.night1, C.flesh0, C.fur1, C.fur2],
        stone: [C.night1, C.night3, C.keepStone, C.haze],
        rock: [C.night1, C.night3, C.keepStone, C.haze],
        roof: [C.woodNight, C.woodNight2, C.woodFloor2, C.woodLeaf],
        metal: [C.night1, C.night3, C.haze, C.pale],
        cloth: [C.woodNight2, C.woodFloor2, C.woodLeaf],
        bone: [C.night3, C.haze, C.pale, C.moon]
      },
      outline: C.ink,
      rim: C.pale,
      core: C.moon,
      growth: [C.woodNight2, C.woodLeaf, C.mint],
      far: [C.woodNight2, C.woodFloor2],
      haze: [C.woodFloor, C.woodFloor2, C.woodLeaf]
    },
    prop: C.woodNight,
    glow: C.wisp,
    ground: { edge: C.woodFloor2, fill: C.woodFloor, near: C.woodNight2, road: C.flesh0, rut: C.night1 },
    sow: [
      { kind: "litter", colors: [C.woodFloor2, C.woodLeaf, C.fur1], density: 1.2 },
      { kind: "fern", colors: [C.woodFloor2, C.woodLeaf, C.mint], density: 0.6 },
      { kind: "root", colors: [C.night1, C.fur1, C.fur1], density: 0.35, road: true },
      { kind: "mushroom", colors: [C.night3, C.haze, C.wisp], density: 0.08, glow: true }
    ],
    shadow: C.ink,
    night: { rim: C.pale },
    foreground: { kind: "branches", color: C.ink, back: C.woodNight2, rim: C.woodLeaf },
    light: { kind: "wisp", count: 12 },
    accent: C.mint,
    seed: 202
  },
  "forgotten-caves": {
    // No sky: the far wall of the vault, faintly lit from below by the crystals.
    sky: [C.ink, C.vaultNight, C.vault1, C.vault2],
    stars: 0,
    starColor: C.shard,
    // The light is the crystal gate's, down the rails.
    source: { x: 188, y: 88 },
    ceiling: C.ink,
    horizon: 102,
    ranges: [
      { kind: "cliffs", color: C.vault1, lit: C.vault2, base: 102, height: 46 },
      { kind: "cliffs", color: C.vaultNight, lit: C.vault1, base: 104, height: 18 },
      { kind: "boughs", color: C.ink, lit: C.vault1, base: 0, height: 40 }
    ],
    landmark: { kind: "crystal-gate", x: 188, base: 103, color: C.vaultNight, rim: C.vault3 },
    mist: { color: C.vault2, above: 2, below: 6 },
    mistDrift: 1,
    props: [],
    structures: [
      { id: "vault-far-gallery", x: 98, base: 101, far: true },
      { id: "vault-far-gallery", x: 228, base: 100, far: true, flip: true },
      { id: "vault-far-gallery", x: 372, base: 101, far: true },
      { id: "vault-far-gallery", x: 520, base: 100, far: true, flip: true },
      // Across the vault, behind the guardian: a scaffold, a fallen head-frame, a pillar, in the vault's air.
      { id: "vault-scaffold", x: 136, base: 106, haze: true },
      { id: "vault-fallen-frame", x: 192, base: 104, haze: true, flip: true },
      { id: "vault-pillar", x: 164, base: 103, haze: true },
      { id: "vault-scaffold", x: 440, base: 104, haze: true, flip: true },
      { id: "vault-pillar", x: 8, base: 112 },
      { id: "vault-winding-house", x: 84, base: 112, haze: true, flip: true },
      { id: "vault-pillar", x: 306, base: 114, flip: true },
      { id: "vault-gallery", x: 262, base: 114, haze: true },
      { id: "vault-cart", x: 232, base: 116, haze: true },
      { id: "vault-crystals", x: 290, base: 138 },
      { id: "vault-gallery", x: 404, base: 112, haze: true, flip: true },
      { id: "vault-crystals", x: 470, base: 128, flip: true },
      { id: "vault-pillar", x: 530, base: 112 },
      { id: "vault-headframe", x: 596, base: 110, haze: true, flip: true }
    ],
    build: {
      ramps: {
        wood: [C.night1, C.flesh0, C.fur1, C.fur2],
        roof: [C.vaultNight, C.vault1, C.vault2, C.vault3],
        stone: [C.vaultNight, C.vault1, C.vault2, C.vault3],
        rock: [C.vaultNight, C.vault1, C.vault2, C.vault3],
        metal: [C.vaultNight, C.vault1, C.vault3, C.vaultAccent],
        cloth: [C.night1, C.flesh0, C.fur1],
        crystal: [C.vault1, C.vault2, C.vaultAccent, C.shard]
      },
      outline: C.ink,
      rim: C.vaultAccent,
      core: C.amber,
      growth: [C.vault1, C.vault3, C.vaultAccent],
      far: [C.vault1, C.vault2],
      haze: [C.vault1, C.vault2, C.vault3]
    },
    halos: [{ x: 288, y: 122, r: 13, color: C.vault3 }],
    prop: C.vaultNight,
    glow: C.shard,
    ground: { edge: C.vault2, fill: C.vault1, near: C.vaultNight, road: C.vaultNight },
    rails: { rail: C.vault3, sleeper: C.flesh0 },
    glade: { color: C.vault2, x: 160, y: 136, rx: 64, ry: 14 },
    sow: [
      { kind: "slab", colors: [C.vault2, C.vault3, C.vault3], density: 0.7, shade: C.vaultNight },
      { kind: "rubble", colors: [C.vault1, C.vault2, C.vault2], density: 0.5, shade: C.vaultNight },
      { kind: "crystal", colors: [C.vault1, C.vault3, C.shard], density: 0.1, glow: true }
    ],
    shadow: C.ink,
    night: { rim: C.vaultAccent },
    foreground: { kind: "rocks", color: C.ink, back: C.vault1, rim: C.vault2 },
    light: { kind: "rune", count: 12 },
    accent: C.vaultAccent,
    seed: 303
  },
  "corrupted-marsh": {
    sky: [C.ink, C.mire0, C.mire1, C.mire2],
    stars: 24,
    starColor: C.pale,
    // A sick moon behind the fog, low over the drowned fields.
    moon: { x: 226, y: 32, r: 10, color: C.mireLight, shade: C.mireAccent, halo: 2 },
    source: { x: 226, y: 32 },
    clouds: { color: C.mire1, lit: C.mire2, top: 40, bottom: 64, count: 3 },
    horizon: 100,
    ranges: [
      { kind: "hills", color: C.mire2, lit: C.mire3, base: 100, height: 8 },
      { kind: "deadwood", color: C.mire1, base: 101, height: 30, clearing: 58 },
      { kind: "reeds", color: C.mire0, base: 101, height: 8 }
    ],
    // The Baron's manor, far across the water, leaning a little more every night.
    landmark: { kind: "manor", x: 176, base: 101, color: C.mire0, rim: C.mire2 },
    mist: { color: C.mire2, above: 6, below: 10 },
    mistDrift: 3,
    water: { ramp: [C.ink, C.mire0, C.mire2, C.mireLight], until: 172, level: 0.28 },
    props: [],
    structures: [
      // The middle distance, in the fog behind the Baron.
      { id: "mire-sunk-barn", x: 150, base: 103, haze: true },
      { id: "mire-posts", x: 186, base: 106, haze: true },
      { id: "mire-drowned-cottage", x: 228, base: 108, haze: true },
      { id: "mire-drowned-cottage", x: 118, base: 106, haze: true, flip: true },
      { id: "mire-alchemist", x: 84, base: 112, haze: true },
      { id: "mire-lantern-post", x: 14, base: 112, reflect: true },
      { id: "mire-sluice", x: 256, base: 114, reflect: true },
      { id: "mire-jetty", x: 262, base: 132, reflect: true },
      { id: "mire-lantern-post", x: 234, base: 106, reflect: true, flip: true },
      { id: "mire-stilt-hut", x: 440, base: 110, haze: true, flip: true },
      { id: "mire-sluice", x: 560, base: 110, reflect: true }
    ],
    halos: [
      { x: 33, y: 80, r: 10, color: C.mire2 },
      { x: 230, y: 74, r: 10, color: C.mire2 }
    ],
    build: {
      ramps: {
        wood: [C.night1, C.flesh0, C.fur1, C.fur2],
        stone: [C.night1, C.night3, C.night4, C.haze],
        rock: [C.mire0, C.mire1, C.mire2, C.mire3],
        roof: [C.mire0, C.mire1, C.mire2, C.mire3],
        metal: [C.night1, C.night3, C.haze, C.pale],
        cloth: [C.mire1, C.mire2, C.mire3]
      },
      outline: C.ink,
      rim: C.mire4,
      core: C.mireLight,
      growth: [C.mire2, C.mire3, C.mire4],
      far: [C.mire1, C.mire2],
      haze: [C.mire1, C.mire2, C.mire3]
    },
    prop: C.mire0,
    glow: C.mireAccent,
    ground: { edge: C.mire3, fill: C.mire2, near: C.mire1, road: C.fur1, rut: C.flesh0 },
    sow: [
      { kind: "reed", colors: [C.mire2, C.mire4, C.fur1], density: 0.45 },
      { kind: "lily", colors: [C.mire2, C.mire3, C.pale], density: 1.2 }
    ],
    shadow: C.ink,
    night: { rim: C.mire4 },
    foreground: { kind: "reeds", color: C.ink, back: C.mire1, rim: C.mire3 },
    light: { kind: "wisp", count: 12 },
    accent: C.mireAccent,
    seed: 404
  },
  "fallen-king-ruins": {
    sky: [C.night1, C.night2, C.night3, C.plum, C.keepStone],
    stars: 50,
    starColor: C.lilac,
    // A cold moon over the Keep; the only warm light here is violet, and it is fire.
    moon: { x: 250, y: 30, r: 11, color: C.moon, shade: C.lilac, halo: 2 },
    source: { x: 250, y: 30 },
    clouds: { color: C.night3, lit: C.night4, top: 38, bottom: 62, count: 3 },
    horizon: 100,
    ranges: [
      { kind: "mountains", color: C.night3, lit: C.night4, rim: C.dusk, base: 100, height: 44 },
      { kind: "towers", color: C.night2, rim: C.night4, base: 100, height: 28 },
      { kind: "hills", color: C.night1, base: 101, height: 6 }
    ],
    // Up the stair, the throne tower: its window lit violet, the throne turned to it.
    landmark: { kind: "throne-tower", x: 200, base: 101, color: C.night2, rim: C.night4 },
    mist: { color: C.dusk, above: 3, below: 5 },
    mistDrift: 1,
    props: [],
    structures: [
      { id: "keep-far-tower", x: 30, base: 100, far: true },
      { id: "keep-far-hall", x: 110, base: 100, far: true },
      { id: "keep-far-tower", x: 296, base: 99, far: true, flip: true },
      { id: "keep-far-hall", x: 420, base: 100, far: true, flip: true },
      { id: "keep-hall-wall", x: 162, base: 106, haze: true },
      { id: "keep-warden", x: 204, base: 109, haze: true },
      { id: "keep-pillars", x: 250, base: 108, haze: true },
      { id: "keep-gatehouse", x: 62, base: 112, haze: true },
      { id: "keep-brazier", x: 72, base: 140 },
      { id: "keep-brazier", x: 224, base: 122 },
      { id: "keep-warden", x: 252, base: 121 },
      { id: "keep-fallen", x: 36, base: 146 },
      { id: "keep-fallen", x: 270, base: 150, flip: true },
      { id: "keep-arch", x: 292, base: 118 },
      { id: "keep-warden", x: 400, base: 119, flip: true },
      { id: "keep-colonnade", x: 520, base: 126, flip: true }
    ],
    build: {
      ramps: {
        stone: [C.night2, C.night3, C.night4, C.dusk, C.haze],
        rock: [C.night4, C.dusk, C.haze, C.lilac],
        metal: [C.night1, C.night3, C.dusk, C.lilac],
        cloth: [C.night4, C.dusk, C.haze, C.lilac],
        roof: [C.night1, C.night2, C.night3, C.night4]
      },
      outline: C.ink,
      rim: C.lilac,
      core: C.essenceLight,
      growth: [C.night3, C.field1, C.field2],
      far: [C.night2, C.night4],
      haze: [C.night4, C.dusk, C.haze]
    },
    halos: [
      { x: 71, y: 102, r: 18, color: C.royal },
      { x: 223, y: 85, r: 18, color: C.royal }
    ],
    prop: C.night1,
    glow: C.violetFire,
    ground: { edge: C.night4, fill: C.night3, near: C.night2, road: C.night4 },
    // The processional way to the throne tower, its flagstones lifted by the grass.
    paving: { colors: [C.night4, C.dusk, C.haze], joint: C.night2 },
    glade: { color: C.night4, x: 162, y: 138, rx: 80, ry: 15 },
    sow: [
      { kind: "litter", colors: [C.field1, C.field2, C.field2], density: 1.1, road: true },
      { kind: "rubble", colors: [C.night4, C.dusk, C.haze], shade: C.night1, density: 0.6 }
    ],
    shadow: C.ink,
    night: { rim: C.lilac },
    foreground: { kind: "ruins", color: C.ink, back: C.night3, rim: C.dusk },
    light: { kind: "ember", count: 12 },
    accent: C.keepAccent,
    seed: 505
  }
};

/** Where the thirteen altars stand on the ring of the Sanctum: around its near half, the way in left open. */
const ALTAR_RING: readonly (readonly [string, number])[] = [
  ["might", 172], ["blade", 160], ["fortune", 148], ["patience", 136], ["time", 124], ["fate", 112],
  ["precision", 68], ["treasure", 57], ["bargain", 46], ["echoes", 35], ["harvest", 24], ["wanderer", 13], ["memory", 2]
];

/** A point of the Sanctum's ring at an angle (degrees, 0 on the right, 90 nearest the walker). */
function onRing(degrees: number, rx: number, ry: number): [number, number] {
  const turn = degrees / 360;
  // Plain arithmetic for the same numbers everywhere: a cosine and a sine by parabolas.
  const sin = (t: number) => {
    const f = t - Math.floor(t);
    return f < 0.5 ? 16 * f * (0.5 - f) : -16 * (f - 0.5) * (1 - f);
  };
  return [Math.round(160 + rx * sin(turn + 0.25)), Math.round(124 + ry * sin(turn))];
}

/**
 * The places of the story, drawn by the same pipeline as the biomes (BIBLE 3.4, 3.9, 12.7).
 * The Sanctum of Dusk: the only sky that is not the night's deepest purple, a hilltop above
 * the dark lands, a ring of standing stones, the thirteen altars among them. Eldra's Loom:
 * the night woven on a frame, its warp running from the ground up into the sky. The Dawn:
 * almost nothing, a pale sky, one line of light, the road ending.
 */
export const PLACES = {
  sanctum: {
    sky: [C.plum, C.keepStone, C.amethyst, C.royal, C.flesh2, C.amber],
    stars: 14,
    starColor: C.lilac,
    // The sun just gone under the far hills: the last of its disc, its light in rings.
    moon: { x: 226, y: 99, r: 12, color: C.goldLight, shade: C.gold, halo: 3 },
    source: { x: 226, y: 99 },
    clouds: { color: C.keepStone, lit: C.flesh2, top: 34, bottom: 70, count: 3 },
    horizon: 100,
    ranges: [
      { kind: "mountains", color: C.dusk, lit: C.amethyst, base: 100, height: 14 },
      { kind: "hills", color: C.night3, base: 101, height: 5 }
    ],
    props: [],
    prop: C.night3,
    structures: [
      // The far side of the ring, small against the dusk, a gap where the sun went down.
      { id: "sanctum-far-menhir", x: 60, base: 106, haze: true },
      { id: "sanctum-far-trilithon", x: 92, base: 104, haze: true },
      { id: "sanctum-far-low", x: 122, base: 103, haze: true },
      { id: "sanctum-far-menhir", x: 146, base: 102, haze: true },
      { id: "sanctum-far-low", x: 170, base: 102, haze: true },
      { id: "sanctum-far-menhir", x: 194, base: 102, haze: true },
      { id: "sanctum-far-trilithon", x: 256, base: 104, haze: true },
      { id: "sanctum-far-menhir", x: 286, base: 106, haze: true },
      // Its near side, where the altars stand, taller toward the edges of the view.
      { id: "sanctum-menhir", x: 52, base: 114 },
      { id: "sanctum-menhir", x: 270, base: 114, flip: true },
      { id: "sanctum-menhir-tall", x: 22, base: 124 },
      { id: "sanctum-menhir-tall", x: 300, base: 124, flip: true },
      { id: "sanctum-menhir-great", x: 2, base: 176 },
      { id: "sanctum-menhir-great", x: 318, base: 178, flip: true },
      { id: "sanctum-broken", x: 42, base: 162 },
      { id: "sanctum-menhir", x: 282, base: 160, flip: true },
      ...ALTAR_RING.map(([id, degrees]) => {
        const [x, base] = onRing(degrees, 132, 30);
        return { id: `altar-${id}`, x, base };
      })
    ],
    build: {
      ramps: {
        rock: [C.night2, C.night3, C.keepStone, C.amethyst, C.royal],
        stone: [C.night2, C.night3, C.keepStone, C.amethyst, C.royal]
      },
      outline: C.ink,
      rim: C.flesh2,
      core: C.essenceLight,
      growth: [C.field1, C.field2],
      far: [C.dusk, C.amethyst],
      haze: [C.night3, C.keepStone, C.amethyst]
    },
    halos: [],
    glow: C.essenceBright,
    // The hilltop: grass lit rose by the dusk on its far edge, a path worn to the ring's heart.
    ground: { edge: C.flesh1, fill: C.field1, near: C.night3, road: C.night2, roadFrom: 126 },
    grass: {
      blades: [C.flesh1, C.field2, C.field1],
      tip: C.flesh1,
      heart: C.essenceBright,
      rim: C.flesh2,
      stone: [C.keepStone, C.night3],
      details: []
    },
    glade: { color: C.field2, x: 160, y: 128, rx: 60, ry: 10 },
    shadow: C.ink,
    foreground: { kind: "grass", color: C.ink, back: C.night2, rim: C.flesh1 },
    light: { kind: "firefly", count: 0 },
    accent: C.essenceBright,
    seed: 601
  },
  loom: {
    sky: [C.ink, C.night1, C.night2, C.plum],
    stars: 34,
    starColor: C.lilac,
    source: { x: 160, y: 40 },
    horizon: 132,
    ranges: [{ kind: "hills", color: C.night1, base: 132, height: 6 }],
    props: [],
    prop: C.night1,
    structures: [
      { id: "loom-frame", x: 160, base: 172 },
      { id: "loom-bench", x: 92, base: 160 }
    ],
    build: {
      ramps: {
        wood: [C.night1, C.flesh0, C.fur1, C.fur2],
        stone: [C.night1, C.night3, C.night4, C.keepStone],
        cloth: [C.essenceDeep, C.essence, C.essenceBright]
      },
      outline: C.ink,
      rim: C.lilac,
      core: C.moon,
      growth: [C.night3],
      far: [C.night1, C.night3],
      haze: [C.night2, C.night3, C.night4]
    },
    glow: C.essenceLight,
    // An old threshing floor of flagstones under the loom.
    ground: { edge: C.night3, fill: C.night2, near: C.night1 },
    paving: { colors: [C.night2, C.night3, C.night4], joint: C.night1, whole: true },
    shadow: C.ink,
    foreground: { kind: "grass", color: C.ink, back: C.night1, rim: C.night4 },
    light: { kind: "firefly", count: 0 },
    accent: C.essenceLight,
    seed: 602
  },
  dawn: {
    // The last of the night at the top, thinning to the palest lilac at the line.
    sky: [C.haze, C.lilac, C.lilac, C.pale, C.pale],
    stars: 0,
    starColor: C.moon,
    source: { x: 160, y: 100 },
    horizon: 100,
    ranges: [],
    props: [],
    prop: C.haze,
    // Almost nothing: the land darkening toward the walker, the road running out before the line.
    ground: { edge: C.pale, fill: C.lilac, near: C.haze, road: C.pale, roadFrom: 116 },
    // A few stones of the road scattered past its end, and nothing else.
    sow: [{ kind: "rubble", colors: [C.lilac, C.pale, C.pale], shade: C.haze, density: 0.12 }],
    mist: { color: C.moon, above: 3, below: 4 },
    shadow: C.haze,
    foreground: { kind: "grass", color: C.haze, back: C.lilac, rim: C.pale },
    glow: C.moon,
    light: { kind: "firefly", count: 0 },
    accent: C.pale,
    seed: 603
  }
} satisfies Record<string, SceneRecipe>;
