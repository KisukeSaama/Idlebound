/**
 * The props of a scene: shapes painted in their own colors with a moonlit rim, props drawn
 * by hand pixel by pixel (the scarecrow), the buildings (architecture.ts), and the
 * Hearthfields' milestone stone.
 */
import { DECOR, SCENES, SCENE_HEIGHT, SCENE_WIDTH, STRUCTURES, palLuma, type Pal, type PropKind, type SceneRecipe, type Shape, type StructurePlacement } from "@idlebound/game/art";
import { buildStructure, NO_WEAR, type BuildColors, type Built, type Wear } from "./architecture";
import { dottedCircle, inside, moonlit, stamp, towardMoon } from "./draw";
import { TUFTS } from "./ground";
import { bayer, blit, createPixels, EMPTY, setPixel, type Pixels } from "./pixels";
import { wearOf, wearSprite } from "./wear";


const H = SCENE_HEIGHT;
const WIDE = SCENE_WIDTH * 2;

/** Horizontal middle and width of a shape, in its units. */
function span(shape: Shape): [number, number] {
  if ("e" in shape) return [shape.e[0], shape.e[2] * 2];
  if ("r" in shape) return [shape.r[0] + shape.r[2] / 2, shape.r[2]];
  if ("c" in shape) return [(shape.c[0] + shape.c[2]) / 2, Math.abs(shape.c[2] - shape.c[0]) + shape.c[4] + shape.c[5]];
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < shape.p.length; i += 2) {
    min = Math.min(min, shape.p[i]);
    max = Math.max(max, shape.p[i]);
  }
  return [(min + max) / 2, max - min];
}

/**
 * A prop painted in its own colors (the recipe's `paint`): each material flat, rounded
 * shapes (ellipses, capsules, polygons) in two halves, the one away from the moon in the
 * material's shade; walls and boards (rectangles) stay one flat plane. Then the moon rims
 * its top and its lit side. Materials the recipe does not paint stay a silhouette.
 */
function paintSprite(shapes: readonly Shape[], size: number, recipe: SceneRecipe, light: number): Pixels {
  const out = createPixels(size, size);
  const scale = size / 64;
  const rimmed = new Uint8Array(size * size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = (x + 0.5) / scale;
      const v = (y + 0.5) / scale;
      let hit: Shape | null = null;
      for (const shape of shapes) {
        if (!inside(shape, u, v) && !(shape.mirror && inside(shape, 64 - u, v))) continue;
        hit = shape.cut ? null : shape;
      }
      if (!hit) continue;
      if (hit.glow) {
        setPixel(out, x, y, recipe.glow, 255, 1);
        continue;
      }
      const paint = recipe.paint?.[hit.m];
      if (!paint) {
        setPixel(out, x, y, recipe.prop);
        continue;
      }
      const [middle, width] = span(hit);
      const rounded = !("r" in hit) && !hit.flat && width * scale >= 3;
      const shaded = hit.far || (rounded && (u - middle) * light < 0);
      setPixel(out, x, y, shaded ? paint[1] : paint[0]);
      if (!hit.flat) rimmed[y * size + x] = 1;
    }
  }
  if (recipe.rim !== undefined) moonlit(out, recipe.rim, light, (at) => rimmed[at] === 1);
  return out;
}

// ------------------------------------------------------------------ props
/** Shapes of each prop in a 64-unit box standing on its bottom edge; `sway` frames move them. */
function propShapes(kind: Exclude<PropKind, HandKind>, frame: number): Shape[] {
  const s = frame === 0 ? 0 : 1.6;
  switch (kind) {
    case "fence":
      return [
        { r: [4, 44, 3, 20], m: "wood" }, { r: [30, 42, 3, 22], m: "wood" }, { r: [56, 45, 3, 19], m: "wood" },
        { c: [2, 50, 62, 52, 1.2, 1.2], m: "wood" }, { c: [2, 57, 62, 58, 1.2, 1.2], m: "wood" }
      ];
    case "grave":
      // The farm's graves by the road: two stones and a wooden cross, leaning.
      return [
        { r: [6, 30, 18, 34], m: "stone" },
        { e: [15, 30, 9, 7], m: "stone", flat: true },
        { r: [36, 26, 5, 38], m: "wood" },
        { r: [29, 34, 19, 5], m: "wood" },
        { p: [48, 64, 49, 46, 54, 42, 60, 45, 62, 64], m: "stone" },
        { r: [12, 36, 7, 2], m: "door" }
      ];
    case "sheaf":
      // A stook of the last harvest, never brought in.
      return [
        { p: [18, 64, 30, 24, 34, 24, 46, 64], m: "straw" },
        { p: [24, 64, 32, 30, 40, 64], m: "straw", lift: -1 },
        { r: [23, 44, 18, 2.4], m: "wood" },
        { p: [28, 26, 26 - s, 16, 31, 24, 33, 14, 35, 24, 39 - s, 17, 36, 26], m: "straw", lift: 1 }
      ];
  }
}

// ------------------------------------------------------------------ hand-drawn props

/**
 * Props drawn by hand, pixel by pixel, at the scene's own pixel size: each letter a
 * material, lowercase lit and uppercase in shade (w wood, h straw, k cloth, t hat), e its
 * lights. Drawn lit from the right; mirrored when the moon is on the left.
 */
const INKS: Record<string, readonly [string, 0 | 1] | "glow"> = {
  w: ["wood", 0], W: ["wood", 1], h: ["straw", 0], H: ["straw", 1], k: ["cloth", 0], K: ["cloth", 1], t: ["hat", 0], T: ["hat", 1], e: "glow"
};

/** The scarecrow: hat, sack head with lit eyes, coat on its cross, straw at the cuffs and hem. */
const SCARECROW: readonly string[] = [
  "........tT..........",
  ".......tTTT.........",
  ".......tTTT.........",
  ".....ttttTTTTT......",
  "......hhhhHHH.......",
  "......hehhHeH.......",
  "......hhhhHHH.......",
  ".......hhhHH........",
  ".........wW.........",
  "hwwwwwkkkkKKKKWWWWWH",
  "h.h..kkkkkKKKKK..H.H",
  ".....kkkkkKKKKK.....",
  ".....kkwkkKKKKK.....",
  ".....kkkkkKKKKK.....",
  ".....wwwwwWWWWW.....",
  ".....kkkkkKKKKK.....",
  "....kkkkk..KKKKK....",
  "....h.hk...KH.H.....",
  ".........wW.........",
  ".........wW.........",
  ".........wW.........",
  ".........wW.........",
  ".........wW.........",
  ".........wW.........",
  "........WwWW........"
];

/** Frames of each hand-drawn prop: the scarecrow turns its head toward the road. */
type HandKind = "scarecrow";
const HAND_DRAWN: Record<HandKind, readonly (readonly string[])[]> = {
  scarecrow: [SCARECROW, SCARECROW.map((row, y) => (y < 8 ? row.slice(1) + "." : row))]
};

function paintHand(rows: readonly string[], recipe: SceneRecipe, light: number): Pixels {
  const w = rows[0].length;
  const out = createPixels(w, rows.length);
  rows.forEach((row, y) => {
    for (let x = 0; x < w; x += 1) {
      const ink = INKS[row[x]];
      if (!ink) continue;
      const px = light < 0 ? w - 1 - x : x;
      if (ink === "glow") setPixel(out, px, y, recipe.glow, 255, 1);
      else setPixel(out, px, y, recipe.paint?.[ink[0]]?.[ink[1]] ?? recipe.prop);
    }
  });
  return out;
}

/** What the eras have done to a scene's props and structures, and where its water lies. */
export interface PropContext {
  wear: Wear;
  /** The ground's water (320 wide, tiling), for reflections. */
  water: Uint8Array | null;
  /** Structures already drawn for another frame of the same scene, by placement and frame of their own cycle. */
  memo?: Map<string, Built | null>;
}

/**
 * Props and structures, back to front, in their own colors or as silhouettes, their lights
 * lit; behind them the halos of their lights; under those standing in water, their
 * reflection. Hand-drawn props turn on every other frame; the structures' lights and
 * banners move on every frame.
 */
export function paintProps(recipe: SceneRecipe, frame: number, context: PropContext = { wear: NO_WEAR, water: null }): Pixels {
  const out = createPixels(WIDE, H);
  const place = (sprite: Pixels, x: number, top: number) => {
    blit(out, sprite, x, top);
    if (x + sprite.w > WIDE) blit(out, sprite, x - WIDE, top);
    if (x < 0) blit(out, sprite, x + WIDE, top);
  };
  if (!context.wear.dark && !context.wear.char) for (const halo of recipe.halos ?? []) paintHalo(out, halo.x, halo.y, halo.r, halo.color);
  const slow = frame >> 1;
  const items: { base: number; draw: () => void }[] = recipe.props.map((prop) => ({
    base: prop.base,
    draw: () => {
      const size = prop.size;
      const kind = prop.kind;
      const light = towardMoon(recipe, prop.x);
      const drawn =
        kind === "scarecrow"
          ? paintHand(HAND_DRAWN[kind][slow % HAND_DRAWN[kind].length], recipe, light)
          : paintSprite(propShapes(kind, slow), size, recipe, light);
      const sprite = wearSprite(drawn, context.wear, 0.55, recipe.seed + Math.round(prop.x), buildColors(recipe, light as -1 | 1));
      const x = Math.round(prop.x - sprite.w / 2);
      const top = prop.base - sprite.h + 1;
      place(sprite, x, top);
    }
  }));
  (recipe.structures ?? []).forEach((placement, index) => {
    if (placement.far || placement.haze) return;
    items.push({
      base: placement.base,
      draw: () => {
        // A structure with nothing moving looks the same on every frame: drawn once.
        const own = frame % structureCycle(placement.id);
        const key = `${index}:${own}`;
        let built = context.memo?.get(key);
        if (built === undefined) {
          built = structurePixels(recipe, placement, context.wear, own);
          context.memo?.set(key, built);
        }
        if (!built) return;
        const x = placement.x - built.footX;
        if (placement.reflect && context.water) reflect(out, built.pixels, x, placement.base, context.water, recipe, frame);
        place(built.pixels, x, placement.base - built.footY);
      }
    });
  });
  for (const item of items.sort((a, b) => a.base - b.base)) item.draw();
  return out;
}

/**
 * The structures of the middle distance, behind the guardian: drawn in full, then laid on
 * the three tones of the scene's air by lightness, so their shapes and their stones still
 * read but at a lower contrast than anything near; their lights stay lit and move.
 */
export function paintHazeStructures(recipe: SceneRecipe, wear: Wear, frame: number): Pixels | null {
  const hazed = (recipe.structures ?? []).filter((placement) => placement.haze);
  const haze = recipe.build?.haze;
  if (hazed.length === 0 || !haze) return null;
  const out = createPixels(WIDE, H);
  for (const placement of [...hazed].sort((a, b) => a.base - b.base)) {
    const built = structurePixels(recipe, placement, wear, frame % structureCycle(placement.id));
    if (!built) continue;
    const { pixels } = built;
    const aired = createPixels(pixels.w, pixels.h);
    for (let at = 0; at < pixels.idx.length; at += 1) {
      const pal = pixels.idx[at];
      if (pal === EMPTY) continue;
      const luma = palLuma(pal);
      aired.idx[at] = pixels.emit[at] ? pal : luma < 40 ? haze[0] : luma < 85 ? haze[1] : haze[2];
      aired.alpha[at] = 255;
      aired.emit[at] = pixels.emit[at];
    }
    const x = placement.x - built.footX;
    const top = placement.base - built.footY;
    blit(out, aired, x, top);
    if (x + aired.w > WIDE) blit(out, aired, x - WIDE, top);
    if (x < 0) blit(out, aired, x + WIDE, top);
  }
  return out;
}

/** The far structures: silhouettes in the colors of what stands behind them, their lights lit. */
export function paintFarStructures(recipe: SceneRecipe, wear: Wear): Pixels | null {
  const far = (recipe.structures ?? []).filter((placement) => placement.far);
  if (far.length === 0 || !recipe.build) return null;
  const out = createPixels(WIDE, H);
  const [body, rim] = recipe.build.far;
  for (const placement of far) {
    const built = structurePixels(recipe, placement, wear, 0);
    if (!built) continue;
    const { pixels } = built;
    const flat = createPixels(pixels.w, pixels.h);
    for (let at = 0; at < pixels.idx.length; at += 1) {
      if (pixels.idx[at] === EMPTY) continue;
      flat.idx[at] = pixels.emit[at] ? pixels.idx[at] : body;
      flat.alpha[at] = 255;
      flat.emit[at] = pixels.emit[at];
    }
    moonlit(flat, rim, towardMoon(recipe, placement.x));
    const x = placement.x - built.footX;
    const top = placement.base - built.footY;
    blit(out, flat, x, top);
    if (x + flat.w > WIDE) blit(out, flat, x - WIDE, top);
    if (x < 0) blit(out, flat, x + WIDE, top);
  }
  return out;
}

/** A structure of a biome alone, in the scene's colors and the era's wear (the workshop's view). */
export function structureView(biomeId: string, id: string, era: number, frame: number): Pixels | null {
  const recipe = SCENES[biomeId];
  if (!recipe) return null;
  return structurePixels(recipe, { id, x: Math.round(SCENE_WIDTH / 3), base: 0 }, wearOf(era, recipe), frame)?.pixels ?? null;
}

/** Frames after which a structure looks the same again: its lit windows flicker on two, its details on their own. */
function structureCycle(id: string): number {
  const structure = STRUCTURES[id];
  if (!structure) return 1;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  let cycle = 1;
  for (const piece of structure.pieces) {
    const own = "gap" in piece && piece.lit ? 2 : "decor" in piece ? (DECOR[piece.decor]?.frames?.length ?? 1) : 1;
    cycle = (cycle * own) / gcd(cycle, own);
  }
  return cycle;
}

/** The colors a scene lends what stands in it, lit from `side`; a scene without its own lends its props' color. */
function buildColors(recipe: SceneRecipe, side: -1 | 1): BuildColors {
  const build = recipe.build;
  if (!build) return { ramps: {}, outline: recipe.prop, rim: recipe.rim ?? recipe.prop, growth: [recipe.prop], glow: recipe.glow, side };
  return { ramps: build.ramps, outline: build.outline, rim: build.rim, core: build.core, growth: build.growth, glow: recipe.glow, side };
}

/** A structure of the scene drawn in its colors, lit from the moon's side, mirrored on demand. */
function structurePixels(recipe: SceneRecipe, placement: StructurePlacement, wear: Wear, frame: number): Built | null {
  const structure = STRUCTURES[placement.id];
  if (!structure || !recipe.build) return null;
  const moon = towardMoon(recipe, placement.x) as -1 | 1;
  // A mirrored structure is built lit from the other side, so once mirrored the moon is right.
  const side = (placement.flip ? -moon : moon) as -1 | 1;
  const built = buildStructure(structure, buildColors(recipe, side), DECOR, wear, frame);
  if (!placement.flip) return built;
  const { pixels } = built;
  const mirrored = createPixels(pixels.w, pixels.h);
  for (let y = 0; y < pixels.h; y += 1) {
    for (let x = 0; x < pixels.w; x += 1) {
      const from = y * pixels.w + x;
      if (pixels.idx[from] !== EMPTY) setPixel(mirrored, pixels.w - 1 - x, y, pixels.idx[from], 255, pixels.emit[from]);
    }
  }
  return { pixels: mirrored, footX: pixels.w - 1 - built.footX, footY: built.footY };
}

/**
 * A structure's reflection in the water it stands in: mirrored under its foot, laid on the
 * water's ramp by lightness, wavering a pixel on every other row, broken on every fourth,
 * only where there is water.
 */
function reflect(out: Pixels, sprite: Pixels, left: number, base: number, water: Uint8Array, recipe: SceneRecipe, frame: number) {
  const [deep, body, lit, glint] = recipe.water!.ramp;
  for (let y = 0; y < sprite.h; y += 1) {
    const ty = base + (sprite.h - 1 - y) + 1;
    if (ty >= H || (ty + frame) % 4 === 0) continue;
    const sway = ((ty >> 1) + frame) % 2 === 0 ? 1 : 0;
    for (let x = 0; x < sprite.w; x += 1) {
      const from = y * sprite.w + x;
      if (sprite.idx[from] === EMPTY) continue;
      const tx = left + x + sway;
      if (!water[ty * SCENE_WIDTH + (((tx % SCENE_WIDTH) + SCENE_WIDTH) % SCENE_WIDTH)]) continue;
      const luma = palLuma(sprite.idx[from]);
      const color = sprite.emit[from] ? glint : luma > 110 ? lit : luma > 45 ? body : deep;
      setPixel(out, ((tx % WIDE) + WIDE) % WIDE, ty, color, 255, sprite.emit[from]);
    }
  }
}

/**
 * The halo of a light standing in the scene: a dense checker around it, then dotted true
 * circles farther and farther apart (light in rings, never in squares).
 */
function paintHalo(out: Pixels, cx: number, cy: number, r: number, color: Pal) {
  const inner = Math.max(2, Math.round(r * 0.45));
  for (let y = -inner; y <= inner; y += 1) {
    for (let x = -inner; x <= inner; x += 1) {
      if (x * x + y * y <= inner * inner && (x + y) % 2 === 0) setPixel(out, (((cx + x) % WIDE) + WIDE) % WIDE, cy + y, color);
    }
  }
  for (let ring = inner + 2, gap = 2; ring <= r; ring += gap, gap += 1) {
    for (const [x, y] of dottedCircle(ring)) setPixel(out, (((cx + x) % WIDE) + WIDE) % WIDE, cy + y, color);
  }
}




/** The Hearthfields' milestone stone: a flat standing stone, its rune lit once the stretch is cleared. */
export function milestone(recipe: SceneRecipe, lit: boolean): Pixels {
  const shapes: Shape[] = [{ p: [16, 64, 48, 64, 44, 12, 32, 4, 20, 12], m: "stone" }, ...(lit ? [{ r: [29, 20, 6, 28], m: "rune", glow: true } as Shape] : [])];
  return paintSprite(shapes, 16, recipe, towardMoon(recipe, SCENE_WIDTH / 2 + MILESTONE_X));
}

/** Where the milestone stands, from the middle of the view. */
export const MILESTONE_X = 44;
