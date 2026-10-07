/**
 * Biome scenes (BIBLE 18.7): pixel art on a single grid, 180 rows high, built in three
 * depths. Far off: the sky in dithered bands with its moon and halo, the ranges, the
 * landmark at the end of the road, far buildings in silhouette. In the middle: the ground
 * with what is sown on it, still water mirroring the sky, the buildings and ruins drawn
 * by the builder (architecture.ts), mist drifting over the horizon. In front: dark shapes
 * framing the view. Each plane is darker and duller with distance; water, lights, banners
 * and leaves move on their own frames.
 * A scene uses 20 colors at most, all named by its recipe. The era then wears the place
 * down (wear.ts), and the Age of the stratum transforms it (BIBLE 18.6): the sky brightens,
 * and each Age leaves its mark (marks.ts: bones, temples, glass, threads, runes, a low moon,
 * a room, then paper, grey, outline and a single light). The same pipeline draws the three
 * places of the story (places.ts): the Sanctum of Dusk, Eldra's Loom and the Dawn.
 */
import { C, DECOR, ORVANE_64, PLACES, SCENES, SCENE_FLOOR, SCENE_HEIGHT, SCENE_WIDTH, palLuma, palRgb, type Pal, type SceneRecipe } from "@idlebound/game/art";
import type { Built } from "./architecture";
import { paintClouds, paintLandmark, paintRange, paintShafts, paintSky } from "./backdrop";
import { dottedCircle } from "./draw";
import { ageOf, ERAS_PER_AGE } from "./eras";
import { paintForeground } from "./foreground";
import { paintGround, paintMist, paintWater, sowShards } from "./ground";
import { ageMarks, type Mark, type MarkPlane } from "./marks";
import type { NightGrade } from "./night";
import { bayer, clonePixels, createPixels, EMPTY, hash2, setPixel, valueNoise, type Pixels } from "./pixels";
import { placeMarksOf } from "./places";
import { milestone, MILESTONE_X, paintFarStructures, paintHazeStructures, paintProps } from "./props";
import { brighten, GREY_TABLE } from "./tables";
import { wearOf } from "./wear";

export interface SceneLayer {
  /** Frames of its own motion (sails turning, a head turning), played in a loop. */
  frames: Pixels[];
  /** Continuous drift, in scene pixels per second (clouds). */
  drift: number;
  /** Nearness, 0 (the sky) to 1 and more (the foreground): the plane it belongs to. */
  depth: number;
  /** Seconds per frame. */
  period?: number;
  /** Pinned to an edge of the view instead of tiling (the foreground frame). */
  anchor?: "left" | "right";
  /** The ground: on a view taller than the scene, its last row runs on to the bottom. */
  ground?: boolean;
  /** A mark of the Age or of the place (marks.ts, places.ts), not the place itself. */
  mark?: boolean;
}

export interface SceneLight {
  kind: SceneRecipe["light"]["kind"];
  color: Pal;
  count: number;
  /** Rows the lights wander in. */
  top: number;
  bottom: number;
}

export interface Scene {
  layers: SceneLayer[];
  /** Color above the sky, for screens taller than the scene. */
  skyTop: Pal;
  light: SceneLight | null;
  /** Row of the ground line: where the monster stands. */
  ground: number;
  /** Row of the horizon, and where still water lies (a mask of the grid), for the air to reflect. */
  horizon: number;
  water: Uint8Array | null;
  /** Where the light comes from (the creature's shadow falls the other way), and the shadow's color. */
  source: { x: number; y: number } | null;
  shadow: Pal;
  /** Stars that twinkle, and the color they dim to. */
  twinkles: { x: number; y: number }[];
  twinkleDim: Pal;
  /** The Hearthfields' milestone stone, dark and lit. */
  milestone?: { x: number; y: number; off: Pixels; on: Pixels };
  /** How the creatures are graded for this night (colors of the scene, the moon's rim and side). */
  night?: NightGrade;
}

export interface SceneOptions {
  /** The Hearthfields' moon is full (the Night Owl secret). */
  fullMoon?: boolean;
  /** "Keep the night dark": every stratum keeps the backgrounds of the Kingdom (see `renderScene`). */
  darkNight?: boolean;
  /** The Keep's gargoyle has lost a claw (the Last Second secret). */
  clawless?: boolean;
}

const H = SCENE_HEIGHT;
/** The decor once the Keep's gargoyle has lost its claw. */
const CLAWLESS_DECOR = { ...DECOR, "keep-gargoyle": DECOR["keep-gargoyle-clawless"] };
// ------------------------------------------------------------------ Age treatments

function mapLayer(layer: SceneLayer, fn: (source: Pixels) => Pixels): SceneLayer {
  return { ...layer, frames: layer.frames.map(fn) };
}

/** Every drawn pixel through a function of its color and position. */
function each(source: Pixels, fn: (pal: Pal, x: number, y: number, emit: number) => Pal | null): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      if (source.idx[at] === EMPTY) continue;
      const next = fn(source.idx[at], x, y, source.emit[at]);
      if (next === null) {
        out.idx[at] = EMPTY;
        out.alpha[at] = 0;
      } else out.idx[at] = next;
    }
  }
  return out;
}

function isEdge(source: Pixels, x: number, y: number): boolean {
  for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]] as const) {
    const nx = (x + dx + source.w) % source.w;
    const ny = y + dy;
    if (ny < 0 || ny >= source.h || source.idx[ny * source.w + nx] === EMPTY) return true;
  }
  return false;
}

/** Where the planes of each kind begin: marks go in among them (marks.ts). */
function planeIndex(layers: readonly SceneLayer[], plane: MarkPlane): number {
  if (plane === "sky") return 1;
  // Far marks stand on the horizon in front of the ranges, behind the ground and what stands on it.
  if (plane === "far") return layers.findIndex((layer) => layer.ground);
  if (plane === "ground") return layers.findIndex((layer) => layer.ground) + 1;
  return layers.findIndex((layer) => layer.anchor);
}

/** Lays marks among the planes, each flagged as a mark. */
function placeMarks(layers: SceneLayer[], marks: readonly Mark[]): SceneLayer[] {
  const out = [...layers];
  for (const mark of marks) {
    const at = planeIndex(out, mark.plane);
    const depth = mark.depth ?? (mark.plane === "sky" ? 0.02 : mark.plane === "far" ? 0.25 : mark.plane === "ground" ? 0.6 : 0.7);
    out.splice(at, 0, { frames: mark.frames, drift: mark.drift ?? 0, depth, period: mark.period, mark: true });
  }
  return out;
}

/** Scene ids that are places rather than biomes (see `renderScene`). */
export type PlaceId = keyof typeof PLACES;
export const PLACE_IDS = Object.keys(PLACES) as PlaceId[];
export function isPlace(id: string): id is PlaceId {
  return Object.hasOwn(PLACES, id);
}

/** The recipe behind a scene id: a place, or a biome (the Hearthfields when unknown). */
export function sceneRecipe(id: string): SceneRecipe {
  return isPlace(id) ? PLACES[id] : (SCENES[id] ?? SCENES["green-plains"]);
}

/**
 * The scene behind the fight, or behind a window. Pure: same inputs, same pixels.
 *
 * `sceneId` is a biome (`green-plains`, ...) drawn in the palette, wear and marks of `era`,
 * or a place, drawn the same in every era: `sanctum` (the Sanctum of Dusk), `loom` (Eldra's
 * Loom) or `dawn` (the edge of the night, behind the last stage). With `darkNight` (the
 * "Keep the Kingdom's sky" setting) a biome keeps the Kingdom's backgrounds: its sky, wear and
 * marks are those of the stratum of the Kingdom at the same place in the cycle (`era % 5`),
 * and the creatures, which keep their own Age, are not graded for that night. Places ignore it.
 */
export function renderScene(sceneId: string, era = 0, options: SceneOptions = {}): Scene {
  if (isPlace(sceneId)) return composeScene(sceneId, PLACES[sceneId], 0, options, placeMarksOf(sceneId));
  const recipe = sceneRecipe(sceneId);
  if (options.darkNight && ageOf(era) > 0) return { ...composeScene(sceneId, recipe, Math.max(0, era) % ERAS_PER_AGE, options, []), night: undefined };
  return composeScene(sceneId, recipe, era, options, ageMarks(ageOf(era), era, recipe));
}

function composeScene(sceneId: string, recipe: SceneRecipe, era: number, options: SceneOptions, marks: readonly Mark[]): Scene {
  const age = ageOf(era);
  const width = SCENE_WIDTH;
  const wear = wearOf(era, recipe);
  let skyRecipe = recipe;
  let sky = paintSky(skyRecipe, width, options.fullMoon ?? false);
  const clouds = paintClouds(recipe);
  const mist = paintMist(recipe);
  const shafts = paintShafts(recipe);
  const farStructures = paintFarStructures(recipe, wear);
  const [far, ...near] = recipe.ranges;
  // Depth: how near each plane stands, from the sky to the foreground.
  const back: SceneLayer[] = [
    { frames: [sky.pixels], drift: 0, depth: 0 },
    ...(clouds ? [{ frames: [clouds], drift: 1, depth: 0.05 }] : []),
    ...(far ? [{ frames: [paintRange(recipe, far, 0)], drift: 0, depth: 0.12 }] : []),
    ...(shafts ? [{ frames: [shafts], drift: 0, depth: 0.14 }] : []),
    ...(recipe.landmark ? [{ frames: [paintLandmark(recipe)], drift: 0, depth: 0.16 }] : []),
    ...(farStructures ? [{ frames: [farStructures], drift: 0, depth: 0.2 }] : []),
    ...near.map((range, index) => ({ frames: [paintRange(recipe, range, index + 1)], drift: 0, depth: 0.25 + index * 0.15 }))
  ];
  if (age === 7 && recipe.moon) {
    // The Edge of Sleep: the moon has sunk low and grown large, sitting on the land wherever
    // the land ends against the sky; half the stars have closed.
    skyRecipe = { ...recipe, stars: recipe.stars >> 1, moon: lowMoon(recipe, compositeLayers(back.slice(1).filter((layer) => layer.drift === 0), width)) };
    sky = paintSky(skyRecipe, width, false);
    back[0] = { ...back[0], frames: [sky.pixels] };
  }
  const ground = paintGround(recipe);
  const memo = new Map<string, Built | null>();
  const decor = options.clawless ? CLAWLESS_DECOR : DECOR;
  const hazeFrames = [0, 1, 2, 3].map((frame) => paintHazeStructures(recipe, wear, frame, decor));
  const hazed = hazeFrames[0] ? (hazeFrames as Pixels[]) : null;
  if (age === 0 && era % ERAS_PER_AGE === 4) sowShards(ground.pixels, ground.water, recipe);
  // Still water mirrors what stands above the horizon, its ripples sliding frame to frame.
  const above = ground.water ? compositeLayers(back, width) : null;
  const groundFrames = ground.water && above ? [0, 1, 2, 3].map((frame) => paintWater(ground.pixels, ground.water!, above, recipe, frame)) : [ground.pixels];
  let layers: SceneLayer[] = [
    ...back,
    { frames: groundFrames, drift: 0, depth: 0.7, ground: true, period: 0.4 },
    ...(hazed ? [{ frames: hazed, drift: 0, depth: 0.7, period: 0.45 }] : []),
    ...(mist ? [{ frames: [mist], drift: recipe.mistDrift ?? 0, depth: 0.3 }] : []),
    { frames: [0, 1, 2, 3].map((frame) => paintProps(recipe, frame, { wear, water: ground.water, memo, decor })), drift: 0, depth: 0.7, period: 0.45 },
    { frames: [0, 1].map((frame) => paintForeground(recipe, "left", frame)), drift: 0, depth: 1.3, period: 1.1, anchor: "left" },
    { frames: [0, 1].map((frame) => paintForeground(recipe, "right", frame)), drift: 0, depth: 1.3, period: 1.1, anchor: "right" }
  ];
  if (age === 0) layers = stratumMarks(layers, era % ERAS_PER_AGE, recipe);
  layers = placeMarks(layers, marks);
  let skyTop = recipe.sky[0];

  // The sky brightens Age after Age, from the night purple to a pale lilac.
  if (age > 0) {
    const amount = age / 11;
    layers[0] = mapLayer(layers[0], (source) => each(source, (pal, _x, _y, emit) => (emit ? pal : brighten(pal, amount))));
    skyTop = brighten(skyTop, amount);
  }
  if (age === 5) {
    // Draft: line art on warm paper, the far planes drawn lighter, the near ones hatched where they were dark.
    layers = layers.map((layer, index) =>
      mapLayer(layer, (source) =>
        each(source, (pal, x, y, emit) => {
          if (emit) return pal;
          if (index === 0) return C.paper;
          const far = layer.depth < 0.25;
          if (isEdge(source, x, y)) return far ? C.haze : C.night3;
          return !far && palLuma(pal) < 60 && (x + y) % 4 === 0 ? C.haze : C.paper;
        })
      )
    );
    skyTop = C.paper;
  } else if (age === 9) {
    // Unmaking: the grey eats the place from the horizon inward, a plane further with every era.
    const reach = UNMAKING_REACH[era % ERAS_PER_AGE];
    layers = layers.map((layer) => (layer.depth <= reach ? mapLayer(layer, (source) => each(source, (pal, _x, _y, emit) => (emit ? pal : GREY_TABLE[pal]))) : layer));
    skyTop = GREY_TABLE[skyTop];
  } else if (age === 10) {
    // Blank: an off-white lilac sky, the world in outline, the far planes fainter, its lights out;
    // only the moon is left.
    layers = layers.map((layer, index) =>
      mapLayer(layer, (source) => {
        const out = each(source, (pal, x, y, emit) => (index === 0 ? (emit ? pal : paleSky(x, y)) : isEdge(source, x, y) ? (layer.depth < 0.25 ? C.lilac : C.haze) : null));
        if (index > 0) out.emit.fill(0);
        return out;
      })
    );
    if (era % ERAS_PER_AGE === 4) layers.splice(1, 0, { frames: [inkDrop()], drift: 0, depth: 0.02, mark: true });
    skyTop = C.pale;
  } else if (age === 11) {
    // First Mark: only the pale sky and the light remain.
    layers = [mapLayer(layers[0], (source) => each(source, (_pal, x, y) => paleSky(x, y))), ...layers.filter((layer) => layer.mark)];
    skyTop = C.pale;
  }
  // Every Age's marks still keep to the scene's budget: the rarest colors of the place give way first.
  if (age > 0 || marks.length > 0) layers = limitColors(layers, MAX_SCENE_COLORS);

  // In the Ash, embers rise instead of the place's own lights.
  const ash = age === 0 && era % ERAS_PER_AGE === 2;
  const light: SceneLight | null =
    age >= 10 || recipe.light.count === 0
      ? null
      : { kind: ash ? "ember" : recipe.light.kind, color: ash ? C.ember : recipe.glow, count: recipe.light.count, top: recipe.ceiling !== undefined ? 50 : recipe.horizon - 24, bottom: SCENE_FLOOR };
  const moon = skyRecipe.moon;
  return {
    layers,
    skyTop,
    light,
    ground: SCENE_FLOOR,
    horizon: recipe.horizon,
    // The Unmaking's grey and the Blank's outline leave no water to reflect anything.
    water: age >= 9 ? null : ground.water,
    source: age >= 10 ? null : moon && skyRecipe !== recipe ? { x: moon.x, y: moon.y } : recipe.source,
    shadow: recipe.shadow ?? recipe.prop,
    twinkles: age >= 10 ? [] : sky.twinkles,
    twinkleDim: brighten(recipe.sky[Math.min(2, recipe.sky.length - 1)], age / 11),
    night:
      recipe.night && age === 0
        ? { colors: sceneColors(layers), rim: recipe.night.rim, side: recipe.source.x < SCENE_WIDTH / 2 ? -1 : 1, ambient: recipe.night.ambient ?? recipe.sky[recipe.sky.length - 1], glow: ash ? C.ember : recipe.glow }
        : undefined,
    milestone: sceneId === "green-plains" && age < 10 ? { x: Math.floor(width * 0.5) + MILESTONE_X, y: SCENE_FLOOR - 15, off: milestone(recipe, false), on: milestone(recipe, true) } : undefined
  };
}

/** Most colors a scene may use (DESIGN: 20 per scene, 24 with any creature). */
export const MAX_SCENE_COLORS = 20;

/** How far the Unmaking has greyed the place, era by era: the depth of the nearest grey plane. */
const UNMAKING_REACH = [0.16, 0.3, 0.6, 0.7, 2];

/** The moon of the Edge of Sleep: large and low, on its own side, half sunk behind the land (`land`, the far planes). */
function lowMoon(recipe: SceneRecipe, land: Pixels): NonNullable<SceneRecipe["moon"]> {
  const moon = recipe.moon!;
  const r = Math.min(24, Math.round(moon.r * 2.1));
  const x = moon.x < SCENE_WIDTH / 2 ? 62 : SCENE_WIDTH - 62;
  let skyline = recipe.horizon;
  for (let dx = -r; dx <= r; dx += 1) {
    let y = 0;
    while (y < recipe.horizon && land.idx[y * land.w + x + dx] === EMPTY) y += 1;
    skyline = Math.min(skyline, y);
  }
  return { ...moon, x, y: Math.max(r + 8, skyline - Math.round(r * 0.3)), r, color: C.moon, shade: C.lilac, crescent: false, halo: 3 };
}

/** The pale sky of the last Ages: off-white lilac, a little lilac left in its top rows, in a regular pattern. */
function paleSky(x: number, y: number): Pal {
  return bayer(x, y) < Math.max(0, 0.5 - y / 40) ? C.lilac : C.pale;
}

/** The Ink (era 54): a single drop, about to fall, high over the blank. */
function inkDrop(): Pixels {
  const out = createPixels(SCENE_WIDTH, H);
  const rows = ["..#..", "..#..", ".###.", "#####", "##o##", ".###."];
  rows.forEach((row, y) => [...row].forEach((key, x) => key !== "." && setPixel(out, 158 + x, 18 + y, key === "#" ? C.night3 : C.haze)));
  return out;
}

/**
 * The colors of a scene brought down to `max`: the least used ones merge into their nearest
 * kept neighbor (lights and the Age's marks are kept whole), one table for every frame.
 */
function limitColors(layers: SceneLayer[], max: number): SceneLayer[] {
  const counts = new Map<Pal, number>();
  const kept = new Set<Pal>();
  for (const layer of layers) {
    for (const frame of layer.frames) {
      for (let at = 0; at < frame.idx.length; at += 1) {
        const pal = frame.idx[at];
        if (pal === EMPTY) continue;
        if (frame.emit[at] || layer.mark) kept.add(pal);
        counts.set(pal, (counts.get(pal) ?? 0) + 1);
      }
    }
  }
  const table = new Map<Pal, Pal>();
  const alive = new Set(counts.keys());
  while (alive.size > max) {
    let weakest = -1;
    let fewest = Infinity;
    for (const pal of alive) {
      if (kept.has(pal)) continue;
      const count = counts.get(pal) ?? 0;
      if (count < fewest || (count === fewest && pal > weakest)) {
        weakest = pal;
        fewest = count;
      }
    }
    if (weakest < 0) break;
    alive.delete(weakest);
    const [r, g, b] = palRgb(weakest);
    let nearest = -1;
    let best = Infinity;
    for (const pal of alive) {
      const [pr, pg, pb] = palRgb(pal);
      const distance = 2 * (pr - r) ** 2 + 4 * (pg - g) ** 2 + 3 * (pb - b) ** 2;
      if (distance < best || (distance === best && pal < nearest)) {
        nearest = pal;
        best = distance;
      }
    }
    counts.set(nearest, (counts.get(nearest) ?? 0) + fewest);
    for (const [from, to] of table) if (to === weakest) table.set(from, nearest);
    table.set(weakest, nearest);
  }
  if (table.size === 0) return layers;
  return layers.map((layer) => mapLayer(layer, (source) => each(source, (pal, _x, _y, emit) => (emit ? pal : (table.get(pal) ?? pal)))));
}

/** Every color the layers of a scene use. */
function sceneColors(layers: readonly SceneLayer[]): Pal[] {
  const used = new Set<Pal>();
  for (const layer of layers) for (const frame of layer.frames) for (const pal of frame.idx) if (pal !== EMPTY) used.add(pal);
  return [...used];
}

/**
 * The marks of the Kingdom's strata on the whole scene, each one readable at a glance
 * (the buildings wear with them, wear.ts): the Echo fades the place pale and cold and
 * doubles its far planes; the Ash greys the land under a sky of red smoke; the Void takes
 * round pieces of the world away, cut clean; the Astral steeps the land in the blue of the
 * shards under a sky thick with stars.
 */
function stratumMarks(layers: SceneLayer[], step: number, recipe: SceneRecipe): SceneLayer[] {
  const land = (fn: (pal: Pal) => Pal) => layers.map((layer, index) => (index === 0 ? layer : mapLayer(layer, (source) => each(source, (pal, _x, _y, emit) => (emit ? pal : fn(pal))))));
  switch (step) {
    case 1: {
      // The Echo: a memory of the place, faded pale and cold, the far planes doubled a step up.
      return layers.map((layer, index) => {
        const pale = mapLayer(layer, (source) => each(source, (pal, _x, _y, emit) => (emit ? pal : ECHO_TABLE[pal])));
        return index > 0 && layer.depth > 0.1 && layer.depth <= 0.2 ? mapLayer(pale, ghost) : pale;
      });
    }
    case 2: {
      // The Ash: the land grey and the sky on fire, smoke lying red along the horizon.
      const burned = land((pal) => ASH_TABLE[pal]);
      burned[0] = mapLayer(burned[0], (source) => each(source, (pal, x, y, emit) => (emit ? C.ember : smoke(x, y, recipe.horizon))));
      return burned;
    }
    case 3:
      return voidDiscs(layers, recipe);
    case 4: {
      // The Astral: the land steeped in the blue of the shards, the sky thick with stars and a river of light.
      const starred = land((pal) => ASTRAL_TABLE[pal]);
      starred[0] = mapLayer(starred[0], (source) => each(source, (pal, x, y, emit) => (emit ? pal : starfield(x, y, recipe))));
      return starred;
    }
    default:
      return layers;
  }
}

/** The Echo's ghost of a plane: its own shape a step up and aside, in the pale of memory, behind it. */
function ghost(source: Pixels): Pixels {
  const out = clonePixels(source);
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const from = (y + 4) * source.w + ((x - 5 + source.w) % source.w);
      if (y + 4 >= source.h || source.idx[y * source.w + x] !== EMPTY || source.idx[from] === EMPTY) continue;
      setPixel(out, x, y, C.lilac);
    }
  }
  return out;
}

/** The Ash's sky: smoke from the dark down to a red glow on the horizon, bands joined by regular dithering. */
function smoke(x: number, y: number, horizon: number): Pal {
  const ramp = [C.ink, C.night1, C.flesh0, C.blood, C.red];
  const k = Math.max(0, Math.min(0.999, y / horizon)) ** 1.6 * ramp.length;
  const band = Math.floor(k);
  const next = Math.min(ramp.length - 1, band + 1);
  return bayer(x, y) < (k - band) * (k - band) ? ramp[next] : ramp[band];
}

/** The Astral's sky: stars everywhere, and a river of light across it in two dithered tones. */
function starfield(x: number, y: number, recipe: SceneRecipe): Pal {
  if (hash2(x, y, recipe.seed + 91) < 0.035) return hash2(x, y, recipe.seed + 92) < 0.3 ? C.shardLight : C.pale;
  const river = Math.abs(y - (recipe.horizon * 0.2 + x * 0.22 - 14 + valueNoise(x, 0, 24, recipe.seed + 93, SCENE_WIDTH / 24) * 16));
  const cover = Math.max(0, 1 - river / 16);
  if (bayer(x, y) < cover * 0.8) return cover > 0.6 && bayer(x, y) < cover * 0.35 ? C.essence : C.essenceDeep;
  return y < recipe.horizon * 0.5 ? C.ink : C.vaultNight;
}

/**
 * The Void: round pieces of the world taken away, cut clean through every plane between
 * the sky and the walker, the dark beneath the world showing through with a few stars, a
 * pale ring along each cut and dotted rings around it, as if something had pressed a
 * seal into the place.
 */
function voidDiscs(layers: SceneLayer[], recipe: SceneRecipe): SceneLayer[] {
  const discs = VOID_DISCS.map(([x, y, r]) => [x, y === "h" ? recipe.horizon - 4 : y, r] as const);
  const distance = (x: number, y: number) => {
    let best = Infinity;
    for (const [cx, cy, r] of discs) {
      const dx = Math.min(Math.abs((((x - cx) % SCENE_WIDTH) + SCENE_WIDTH) % SCENE_WIDTH), SCENE_WIDTH - Math.abs((((x - cx) % SCENE_WIDTH) + SCENE_WIDTH) % SCENE_WIDTH));
      best = Math.min(best, Math.sqrt(dx * dx + (y - cy) ** 2) - r);
    }
    return best;
  };
  const cut = layers.map((layer, index) => {
    if (layer.anchor || layer.depth >= 1) return layer;
    return mapLayer(layer, (source) => {
      const out = clonePixels(source);
      for (let y = 0; y < source.h; y += 1) {
        for (let x = 0; x < source.w; x += 1) {
          const at = y * source.w + x;
          const d = distance(x, y);
          if (index === 0) {
            if (d < 0) out.idx[at] = hash2(x, y, recipe.seed) < 0.02 ? C.lilac : C.ink;
            else if (d < 1.2) out.idx[at] = C.pale;
            continue;
          }
          if (source.idx[at] !== EMPTY && d < 1.2) {
            out.idx[at] = EMPTY;
            out.alpha[at] = 0;
          }
        }
      }
      return out;
    });
  });
  // The dotted rings around each cut, over the land.
  const rings = createPixels(SCENE_WIDTH, H);
  for (const [cx, cy, r] of discs) {
    for (const [x, y] of [...dottedCircle(r + 4), ...dottedCircle(r + 8)]) setPixel(rings, (((cx + x) % SCENE_WIDTH) + SCENE_WIDTH) % SCENE_WIDTH, cy + y, C.lilac);
  }
  const front = cut.findIndex((layer) => layer.anchor);
  cut.splice(front, 0, { frames: [rings], drift: 0, depth: 0.7 });
  return cut;
}

/** Where the Void takes the world away: column, row ("h" for just above the horizon) and radius, clear of the guardian. */
const VOID_DISCS: readonly (readonly [number, number | "h", number])[] = [
  [56, "h", 24],
  [266, "h", 18],
  [200, 24, 11]
];

/** Lays every color on the one of `ramp` nearest in lightness, after `lift`. */
const onRamp = (ramp: readonly Pal[], lift = (luma: number) => luma): readonly Pal[] =>
  ORVANE_64.map((_, pal) => ramp.reduce((best, tone) => (Math.abs(palLuma(tone) - lift(palLuma(pal))) < Math.abs(palLuma(best) - lift(palLuma(pal))) ? tone : best)));

/** Ash: the cold greys. */
const ASH_TABLE = onRamp([C.ink, C.night1, C.night2, C.night3, C.night4, C.dusk, C.haze, C.lilac]);
/** Echo: the pale of memory, every color lifted toward it. */
const ECHO_TABLE = onRamp([C.plum, C.keepStone, C.amethyst, C.haze, C.lilac, C.pale], (luma) => luma * 1.35 + 22);
/** Astral: the blues of the shards. */
const ASTRAL_TABLE = onRamp([C.vaultNight, C.vault1, C.vault2, C.vault3, C.vaultAccent, C.shard]);

/**
 * Layers drawn over one another as one image, each on its frame `at` (looping on its own
 * frames): what the water reflects, the map's cards, the workshop's views. `shift` moves a
 * layer sideways, pinned ones too: a camera panning across the planes of a scene.
 */
export function compositeLayers(layers: readonly SceneLayer[], width: number, at: number | ((layer: SceneLayer) => number) = 0, out: Pixels = createPixels(width, H), origin = 0, shift: (layer: SceneLayer) => number = () => 0): Pixels {
  for (const layer of layers) {
    const frame = layer.frames[(typeof at === "number" ? at : at(layer)) % layer.frames.length];
    const moved = shift(layer);
    const left = (layer.anchor === "right" ? width - frame.w : 0) - moved;
    // Tiling layers start at `origin` (a view wider or narrower than the scene keeps it centered).
    const first = layer.anchor ? 0 : (((-origin + moved) % frame.w) + frame.w) % frame.w;
    const from = layer.anchor ? Math.max(0, left) : 0;
    const to = layer.anchor ? Math.min(width, left + frame.w) : width;
    const { idx, alpha, emit, w } = frame;
    for (let y = 0; y < H; y += 1) {
      const row = y * w;
      const target = y * width;
      let fx = layer.anchor ? from - left : first;
      for (let x = from; x < to; x += 1, fx += 1) {
        if (fx === w) fx = 0;
        const at = row + fx;
        const pal = idx[at];
        // A pixel less than solid shows on its share of an ordered 4 × 4 mask.
        if (pal === EMPTY || (alpha[at] < 255 && bayer(x, y) * 255 >= alpha[at])) continue;
        out.idx[target + x] = pal;
        out.alpha[target + x] = 255;
        out.emit[target + x] = emit[at];
      }
    }
  }
  return out;
}

/** One still image of a scene (map and landing cards): all layers at rest. */
export function flattenScene(scene: Scene, width = SCENE_WIDTH): Pixels {
  const out = compositeLayers(scene.layers, width);
  for (let at = 0; at < out.idx.length; at += 1) {
    if (out.idx[at] !== EMPTY) continue;
    out.idx[at] = scene.skyTop;
    out.alpha[at] = 255;
  }
  return out;
}
