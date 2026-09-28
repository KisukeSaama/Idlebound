/**
 * The ground of a scene: bands of fields with wavy, dithered edges, the road winding toward
 * the landmark, grass tuft by tuft, flowers and stones placed by hand, and the mist lying
 * on the horizon.
 */
import { C, SCENE_FLOOR, SCENE_HEIGHT, SCENE_WIDTH, palLuma, type Pal, type SceneRecipe, type SowKind, type SowRecipe } from "@idlebound/game/art";
import { sine, stamp } from "./draw";
import { bayer, clonePixels, createPixels, EMPTY, hash2, setPixel, valueNoise, type Pixels } from "./pixels";

const H = SCENE_HEIGHT;

// ------------------------------------------------------------------ ground

/** Center of the road at a depth `t` (0 at the horizon, 1 at the bottom): it winds toward the landmark. */
function roadCenter(recipe: SceneRecipe, t: number): number {
  const far = recipe.landmark?.x ?? SCENE_WIDTH / 2;
  const near = SCENE_WIDTH / 2;
  const wind = sine(t * 1.2 + recipe.seed / 7) * 22 * sine(Math.min(1, t * 1.15) / 2);
  return far + (near - far) * t * (1.1 - 0.1 * t) + wind;
}

/** Half width of the road at a depth `t`. */
const roadHalf = (t: number) => 0.6 + 26 * t * (0.65 + 0.35 * t);

/** Half width of the road on row `y` of a scene: 0 above where it begins, its end rounded off. */
function roadWidth(recipe: SceneRecipe, y: number): number {
  const t = (y - recipe.horizon) / (H - recipe.horizon);
  const from = recipe.ground.roadFrom;
  if (from === undefined) return roadHalf(t);
  if (y < from) return 0;
  return roadHalf(t) * Math.min(1, Math.sqrt((y - from + 1) / 6));
}

/**
 * Hand-drawn stamps, bottom row on the ground: `a` the blades, `b` their moonlit tips, `c`
 * a flower's heart, `s` a stem, `d` a stone's shaded side. Grass grows from fine marks on
 * the horizon to full tufts at the front.
 */
export const TUFTS = {
  small: [["a.a", ".a."], ["a", "a"], [".b", ".a", "a."]],
  medium: [["..b..", "b.a.b", ".aaa."], [".b...", ".a.b.", "a.aa.", ".aa.."], ["...b", "b..a", ".a.a", "..aa"]],
  large: [
    ["...b...", ".b.a...", "..aa.b.", "a.aaa..", ".aaaaa."],
    ["....b..", "..b.a..", "b.a.a.b", ".aaa.a.", "..aaa.."],
    ["..b....", "..a.b..", "b.a.a..", ".aaa.a.", "..aaa..", "...a..."]
  ],
  huge: [
    ["....b....", ".b..a....", "..a.a..b.", "..a.aa.a.", "b.aa.aa..", ".a.aaa...", "..aaaaa.."],
    ["...b.....", "...a..b..", "b..a.a...", ".a.aa.a.b", "..aaa.aa.", "..aaaaa..", "...aaa..."],
    ["......b..", "..b...a..", "..a..a..b", "b.a.aa.a.", ".aa.aaa..", "..aaaaa..", "...aaa..."]
  ]
} as const;
/** Places a tuft may be sown; clusters and bare patches keep only some. */
const TUFT_SEEDS = 900;
const DETAILS = {
  flower: [".b.", "bcb", ".s."],
  bud: ["b", "s"],
  pebble: [".ab", "daa"]
} as const;


/** The ground, and where its still water lies (1 per pixel of water), when it has any. */
export interface Ground {
  pixels: Pixels;
  water: Uint8Array | null;
}

export function paintGround(recipe: SceneRecipe): Ground {
  const width = SCENE_WIDTH;
  const out = createPixels(width, H);
  const { edge, fill, near, road } = recipe.ground;
  const horizon = recipe.horizon;
  const water = recipe.water ? new Uint8Array(width * H) : null;
  // Three bands: the far fields catching the last light, the fields, and the near ground
  // where the creature stands. Between two bands, a wavy edge and three thin rows of
  // regular dithering along it.
  const farRow = horizon + 5;
  const nearRow = SCENE_FLOOR - 8;
  const banded = recipe.grass !== undefined || recipe.sow !== undefined;
  const waves = [0, 1].map((edgeIndex) => Int8Array.from({ length: width }, (_, x) => groundWave(x, edgeIndex, recipe.seed)));
  const bandAt = (x: number, y: number): Pal => {
    const far = y < farRow + 4;
    const k = y - (far ? farRow + waves[0][x] : nearRow + waves[1][x]) + 2;
    const [before, after] = far ? [edge, fill] : [fill, near];
    return k <= 0 ? before : k >= 4 ? after : bayer(x, y) < k / 4 ? after : before;
  };
  for (let y = horizon; y < H; y += 1) {
    const t = (y - horizon) / (H - horizon);
    const center = roadCenter(recipe, t);
    const half = roadWidth(recipe, y);
    for (let x = 0; x < width; x += 1) {
      let color: Pal = y === horizon ? edge : banded ? bandAt(x, y) : y >= nearRow + 2 ? near : fill;
      const onRoad = road !== undefined && Math.abs(x - center) < half;
      if (water && !onRoad && isWater(recipe, x, y)) {
        water[y * width + x] = 1;
        color = recipe.water!.ramp[1];
      }
      if (onRoad) {
        // Two cart ruts, where the road is wide enough to show them.
        const rut = recipe.ground.rut !== undefined && half > 7 && Math.abs(Math.abs(x - center) - half * 0.45) < 0.5;
        color = rut ? recipe.ground.rut! : road;
      }
      setPixel(out, x, y, color);
    }
  }
  if (recipe.glade) glade(out, water, recipe);
  if (water) banks(out, water, recipe);
  if (recipe.paving) pave(out, recipe);
  if (recipe.rails) lay(out, recipe);
  if (recipe.grass) paintGrass(out, recipe);
  if (recipe.sow) sow(out, water, recipe, recipe.sow);
  return { pixels: out, water };
}

/**
 * A glade: the ground where the moon falls, around the guardian's feet, one tone lighter,
 * its edge thinning out in quarters of regular dithering. The road keeps its own color.
 */
function glade(out: Pixels, water: Uint8Array | null, recipe: SceneRecipe) {
  const { color, x: cx, y: cy, rx, ry } = recipe.glade!;
  const road = recipe.ground.road;
  for (let y = Math.max(recipe.horizon + 1, cy - ry); y < Math.min(H, cy + ry + 1); y += 1) {
    for (let x = cx - rx; x <= cx + rx; x += 1) {
      const px = ((x % SCENE_WIDTH) + SCENE_WIDTH) % SCENE_WIDTH;
      const at = y * SCENE_WIDTH + px;
      if ((water && water[at]) || out.idx[at] === road || out.idx[at] === recipe.ground.rut) continue;
      const d = Math.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2);
      const cover = Math.floor(Math.min(1, (1 - d) * 2.2) * 4) / 4;
      if (cover > 0 && bayer(px, y) < cover) out.idx[at] = color;
    }
  }
}

// ------------------------------------------------------------------ water

/**
 * Where still water lies: a flooded land from the horizon down, its shores wavy, less of
 * it toward the front where the ground rises; the drowned road stands out of it.
 */
function isWater(recipe: SceneRecipe, x: number, y: number): boolean {
  const water = recipe.water!;
  const horizon = recipe.horizon;
  if (y <= horizon || y >= water.until) return false;
  const t = (y - horizon) / (H - horizon);
  return valueNoise(x, y * 3, 16, recipe.seed + 41, SCENE_WIDTH / 16) > 0.18 + t * 0.9 - (water.level ?? 0);
}

/** The shores: the far edge of the water in the bank's shadow, the near edge a lit lip of mud. */
function banks(out: Pixels, water: Uint8Array, recipe: SceneRecipe) {
  const w = SCENE_WIDTH;
  const deep = recipe.water!.ramp[0];
  const marks: [number, Pal][] = [];
  for (let y = recipe.horizon + 1; y < H - 1; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const at = y * w + x;
      if (water[at] && !water[at - w]) marks.push([at, deep]);
      else if (!water[at] && water[at - w] && out.idx[at] !== recipe.ground.road) marks.push([at, recipe.ground.edge]);
    }
  }
  for (const [at, pal] of marks) out.idx[at] = pal;
}

/**
 * One frame of the water: what stands above the horizon, mirrored and laid on the water's
 * ramp by its lightness (the moon and the lights become glints), then ripples, short lit
 * dashes that slide sideways frame to frame, and the moon's broken path on the water.
 */
export function paintWater(ground: Pixels, water: Uint8Array, above: Pixels, recipe: SceneRecipe, frame: number): Pixels {
  const out = clonePixels(ground);
  const [deep, body, lit, glint] = recipe.water!.ramp;
  const horizon = recipe.horizon;
  const w = SCENE_WIDTH;
  const moon = recipe.moon;
  for (let y = horizon + 1; y < H; y += 1) {
    const mirror = 2 * horizon - y;
    const t = (y - horizon) / (H - horizon);
    for (let x = 0; x < w; x += 1) {
      const at = y * w + x;
      if (!water[at] || !water[at - w]) continue;
      // The reflection wavers: every other row shifts a pixel, the other way next frame.
      const sway = ((y >> 1) + frame) % 2 === 0 ? 1 : 0;
      const from = mirror >= 0 ? mirror * w + ((x + sway) % w) : -1;
      let color = body;
      if (from >= 0 && above.idx[from] !== EMPTY) {
        const luma = palLuma(above.idx[from]);
        color = above.emit[from] || luma > 190 ? glint : luma > 70 ? lit : luma > 34 ? body : deep;
      }
      // Ripples: dashes 2 to 5 long, sliding with the frames, farther apart near the front.
      const row = Math.floor((y - horizon) / Math.max(1, Math.round(1 + t * 3)));
      const phase = Math.floor(hash2(row, 0, recipe.seed) * 40) + frame * (row % 2 === 0 ? 2 : -2);
      const dash = (((x + phase) % 23) + 23) % 23;
      if (dash < 2 + Math.floor(t * 3) && hash2(row, Math.floor((x + phase) / 23), recipe.seed) < 0.45 && color !== glint) color = lit;
      // The moon's path: short broken bars straight below it, bright at the heart, lit at the sides.
      if (moon && (y + frame) % 2 === 0) {
        const off = Math.abs(x - moon.x + Math.round((hash2(y, frame, recipe.seed) - 0.5) * 3 * t));
        if (off < 1 + t * 5 && hash2(y >> 1, frame, recipe.seed + 1) < 0.55) color = off < 1 + t * 2 ? glint : lit;
      }
      setPixel(out, x, y, color, 255, color === glint ? 1 : 0);
    }
  }
  return out;
}

// ------------------------------------------------------------------ paving and rails

/**
 * Flagstones in perspective over the road (or all the ground): courses that grow taller
 * toward the front, stones wider, joints staggered, each stone its own shade and its far
 * edge catching the light; some stones gone, the ground showing through.
 */
function pave(out: Pixels, recipe: SceneRecipe) {
  const paving = recipe.paving!;
  const horizon = recipe.horizon;
  const [dark, mid, lit] = paving.colors;
  let course = 0;
  let courseTop = horizon + 1;
  for (let y = horizon + 1; y < H; y += 1) {
    const t = (y - horizon) / (H - horizon);
    const tall = Math.max(1, Math.round(1 + t * 6));
    if (y - courseTop >= tall) {
      course += 1;
      courseTop = y;
    }
    const row = y - courseTop;
    const center = roadCenter(recipe, t);
    const half = roadHalf(t) + 1;
    const wide = 3 + Math.round(t * 16);
    for (let x = 0; x < SCENE_WIDTH; x += 1) {
      if (!paving.whole && Math.abs(x - center) >= half) continue;
      const shifted = Math.round(x - center) + (course % 2) * Math.floor(wide / 2) + 1000 * wide;
      const stone = Math.floor(shifted / wide);
      if (hash2(stone, course, recipe.seed + 3) < 0.07) continue;
      const joint = row === tall - 1 || shifted % wide === 0;
      const shade = hash2(stone, course, recipe.seed + 4);
      const color = joint ? paving.joint : row === 0 && tall > 1 ? lit : shade < 0.25 ? dark : shade > 0.85 ? lit : mid;
      setPixel(out, x, y, color);
    }
  }
}

/** Rails along the road: sleepers spaced in perspective, two rails lit along their tops. */
function lay(out: Pixels, recipe: SceneRecipe) {
  const { rail, sleeper } = recipe.rails!;
  const horizon = recipe.horizon;
  for (let y = horizon + 2; y < H; y += 1) {
    const t = (y - horizon) / (H - horizon);
    const next = (y + 1 - horizon) / (H - horizon);
    const center = roadCenter(recipe, t);
    const gauge = roadHalf(t) * 0.5;
    // A sleeper where the spacing, even on the ground, crosses a whole step.
    if (Math.floor(4 / (t + 0.1)) !== Math.floor(4 / (next + 0.1))) {
      for (let x = Math.round(center - gauge * 1.5); x <= Math.round(center + gauge * 1.5); x += 1) setPixel(out, x, y, sleeper);
    }
    for (const side of [-1, 1]) setPixel(out, Math.round(center + side * gauge), y, rail);
  }
}

// ------------------------------------------------------------------ sown details

/**
 * Hand-drawn stamps sown over the ground, three sizes by distance: `a` the body, `b` its
 * lit side, `c` an accent (a cap, a head; light when the recipe says so), `d` the shade
 * under it.
 */
const SOWN: Record<SowKind, readonly (readonly (readonly string[])[])[]> = {
  fern: [
    [["b.b", ".a."], ["b..", ".aa"]],
    [["..b.b..", ".b.a.b.", "b.aaa.b", "..aaa.."], [".b...b.", "..b.b..", "b.aaa..", ".a.a.a."]],
    [["...b...b...", ".bb.b.b.bb.", "b..baaab..b", "..aa.a.aa..", ".a..aaa..a.", "....aaa...."], ["..b.....b..", "...b.b.b...", ".bb.aaa.bb.", "b..a.a.a..b", "..a..a..a..", "....aaa...."]]
  ],
  litter: [
    [["ab"], ["ba"]],
    [[".ab", "aab"], ["ba.", "aaa"]],
    [[".abb.", "aabaa", ".aa.."], ["..bb.", ".abaa", "aaa.."]]
  ],
  mushroom: [
    [["c", "a"]],
    [[".c..", "ccc.", ".a.c", ".a.a"], ["cc..", ".a.c", ".a.a"]],
    [["..cc...", ".cccc..", "..a..cc", "..a..a.", ".aa..a."], [".ccc.c.", "ccccc.c", "..a..a.", "..a..a."]]
  ],
  root: [
    [["aab"]],
    [["aab...", "..aab."], ["...baa", ".baa.."]],
    [["aaab.....", "...aabb..", ".....aaab"], [".....baaa", "..bbaa...", "baaa....."]]
  ],
  slab: [
    [[".b.", "aad"]],
    [["..bbb.", ".baaad", "daaadd"], [".bbb..", "baaad.", "ddaadd"]],
    [["...bbbb..", ".bbaaaaad", "baaaaaadd", ".ddddddd."], ["..bbb.....", ".baaabbb..", "daaaaaaaad", ".dddddddd."]]
  ],
  crystal: [
    [["c", "a"]],
    [[".c.", ".cc", "acc", "aa."], ["c..", "cc.", "cac", ".aa"]],
    [["..c..", ".cc.c", ".ccac", "accaa", ".aaa."], ["c...", "cc.c", "ccac", "aaca", ".aa."]]
  ],
  reed: [
    [["b", "a"], ["b.", ".a"]],
    [["..c.", ".bc.", "b.a.", ".aa."], [".c..", ".cb.", ".a.b", ".aa."]],
    [["...c...", "..bc.c.", ".b.a.cb", "b..a.a.", ".a.a.a.", "..aaa.."], [".c.....", ".cb..c.", ".a.b.c.", ".a..ba.", "..a.a..", "..aaa.."]]
  ],
  lily: [
    [["ba"]],
    [["bba", ".aa"], ["abb", "aa."]],
    [[".bbc.", "bbaaa", ".aaa."], ["..bb.", "cbaab", ".aaa."]]
  ],
  rubble: [
    [["b.", "ad"]],
    [["..b..", ".bab.", "baaad"], [".b.b.", "baaba", "daadd"]],
    [["...bb...", ".bbaab..", "baaaaabb", "daaadaaa", ".dddd.dd"], ["..bb....", ".baab.b.", "baaadbab", "dddd.ddd"]]
  ]
};

/**
 * The details sown over the ground: clustered, bare patches between; small far off and
 * full near the walker; off the road unless the recipe lets them onto it; lilies only on
 * water, the rest only off it.
 */
function sow(out: Pixels, water: Uint8Array | null, recipe: SceneRecipe, kinds: readonly SowRecipe[]) {
  const horizon = recipe.horizon;
  kinds.forEach((kind, index) => {
    const seed = recipe.seed + 100 + index * 17;
    const places: { x: number; y: number; id: number }[] = [];
    const seeds = Math.round(600 * kind.density);
    for (let id = 0; id < seeds; id += 1) {
      const x = Math.floor(hash2(id, 1, seed) * SCENE_WIDTH);
      const y = horizon + 3 + Math.floor(hash2(id, 2, seed) * (H - 2 - horizon - 3));
      const t = (y - horizon) / (H - horizon);
      const cluster = valueNoise(x, y * 2, 26, seed + 5, SCENE_WIDTH / 26);
      if (cluster < 0.42 || hash2(id, 3, seed) > (cluster - 0.3) * 1.6) continue;
      if (!kind.road && roadWidth(recipe, y) > 0 && Math.abs(x - roadCenter(recipe, t)) < roadWidth(recipe, y) + 1 + t * 3) continue;
      const wet = water ? water[y * SCENE_WIDTH + x] === 1 : false;
      if ((kind.kind === "lily") !== wet) continue;
      places.push({ x, y, id });
    }
    places.sort((a, b) => a.y - b.y);
    for (const place of places) {
      const t = (place.y - horizon) / (H - horizon) + (hash2(place.id, 4, seed) - 0.5) * 0.12;
      const sizes = SOWN[kind.kind];
      const shapes = sizes[t < 0.2 ? 0 : t < 0.55 ? 1 : 2];
      const shape = shapes[Math.floor(hash2(place.id, 5, seed) * shapes.length)];
      const [a, b, c] = kind.colors;
      stampLit(out, shape, place.x, place.y, a, b, c, kind.shade ?? recipe.ground.near, kind.glow ?? false, hash2(place.id, 6, seed) < 0.5);
    }
  });
}

/** The Astral's star-shards, grown out of the ground everywhere but the road. */
export function sowShards(out: Pixels, water: Uint8Array | null, recipe: SceneRecipe) {
  sow(out, water, recipe, [{ kind: "crystal", colors: [C.vault2, C.shard, C.shardLight], density: 0.16, glow: true }]);
}

/** A stamp whose accent may give light (glowing caps, crystals). */
function stampLit(target: Pixels, rows: readonly string[], x: number, y: number, a: Pal, b: Pal, c: Pal, d: Pal, glow: boolean, mirror: boolean) {
  const w = rows[0].length;
  const left = x - Math.floor(w / 2);
  const top = y - rows.length + 1;
  rows.forEach((row, dy) => {
    for (let dx = 0; dx < w; dx += 1) {
      const key = row[mirror ? w - 1 - dx : dx];
      const color = key === "a" ? a : key === "b" ? b : key === "c" ? c : key === "d" ? d : undefined;
      if (color === undefined) continue;
      setPixel(target, (((left + dx) % target.w) + target.w) % target.w, top + dy, color, 255, key === "c" && glow ? 1 : 0);
    }
  });
}

/** The waviness of the edge between two bands of ground at column x: a few rows up or down. */
function groundWave(x: number, edge: number, seed: number): number {
  const turns = x / SCENE_WIDTH;
  return Math.round(1.6 * sine(turns * 5 + edge * 0.37 + seed / 11) + 1.1 * sine(turns * 13 + edge * 0.61 + seed / 7));
}

/**
 * Grass drawn tuft by tuft, in rows that open up toward the front: fine marks at the
 * horizon, full tufts at the walker's feet, never on the road. Then the flowers and stones
 * the recipe places by hand.
 */
function paintGrass(out: Pixels, recipe: SceneRecipe) {
  const { fill } = recipe.ground;
  const grass = recipe.grass!;
  const horizon = recipe.horizon;
  const seed = recipe.seed;
  // Tufts sown at random over the fields, nearer ones drawn over farther ones: small far
  // off, full at the front, gathered in clusters with bare patches between them.
  const tufts: { x: number; y: number; seed: number }[] = [];
  for (let index = 0; index < TUFT_SEEDS; index += 1) {
    const x = Math.floor(hash2(index, 1, seed) * SCENE_WIDTH);
    // The last row stays bare: on a tall view it runs on to the bottom.
    const y = horizon + 3 + Math.floor(hash2(index, 2, seed) * (H - 2 - horizon - 3));
    const t = (y - horizon) / (H - horizon);
    const cluster = valueNoise(x, y * 2, 30, seed + 5, SCENE_WIDTH / 30);
    if (cluster < 0.5 - t * 0.15 || hash2(index, 3, seed) > (cluster - 0.35) * 1.5) continue;
    if (roadWidth(recipe, y) > 0 && Math.abs(x - roadCenter(recipe, t)) < roadWidth(recipe, y) + 2 + t * 4) continue;
    tufts.push({ x, y, seed: index });
  }
  tufts.sort((a, b) => a.y - b.y);
  for (const tuft of tufts) {
    const t = (tuft.y - horizon) / (H - horizon);
    // Size by distance, with a little give either way.
    const reach = t + (hash2(tuft.seed, 4, seed) - 0.5) * 0.12;
    const size = reach < 0.16 ? "small" : reach < 0.42 ? "medium" : reach < 0.72 ? "large" : "huge";
    // Blades by band: lit marks in the far fields and the fields, darker blades with lit
    // tips near the front.
    const band = tuft.y < horizon + 5 + groundWave(tuft.x, 0, seed) ? 0 : tuft.y < SCENE_FLOOR - 8 + groundWave(tuft.x, 1, seed) ? 1 : 2;
    const shapes = TUFTS[size];
    const shape = shapes[Math.floor(hash2(tuft.seed, 5, seed) * shapes.length)];
    stamp(out, shape, tuft.x, tuft.y, grass.blades[band], band === 2 ? grass.tip : grass.blades[band], {}, hash2(tuft.seed, 6, seed) < 0.5);
  }
  for (const detail of grass.details) {
    const [a, b] = detail.kind === "pebble" ? [grass.stone[0], grass.rim] : [detail.color ?? grass.tip, detail.color ?? grass.tip];
    stamp(out, DETAILS[detail.kind], detail.x, detail.y, a, b, { c: grass.heart, s: fill, d: grass.stone[1] });
  }
}

/**
 * A thin mist lying on the fields, over the horizon line: regular dithering, densest on the
 * line itself and thinning out above and below, thicker in some places than others.
 */
export function paintMist(recipe: SceneRecipe): Pixels | null {
  const mist = recipe.mist;
  if (!mist) return null;
  const out = createPixels(SCENE_WIDTH, H);
  const horizon = recipe.horizon;
  for (let y = horizon - mist.above; y <= horizon + mist.below; y += 1) {
    const k = y < horizon ? 1 - (horizon - y) / (mist.above + 1) : 1 - (y - horizon) / (mist.below + 1);
    for (let x = 0; x < SCENE_WIDTH; x += 1) {
      // Density in steps of an eighth, so the dithering stays in regular patterns.
      const drift = 0.55 + 0.45 * valueNoise(x, 0, 48, recipe.seed + 9, SCENE_WIDTH / 48);
      const cover = Math.round(k * drift * 0.5 * 8) / 8;
      if (bayer(x, y) < cover) setPixel(out, x, y, mist.color);
    }
  }
  return out;
}
