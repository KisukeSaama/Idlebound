/**
 * The shots of the Ledger's scenes (BIBLE 12.10), staged on the scenes of the road and the
 * places of the story: one grid for every shot, the scene's own 320 × 180, never resized.
 * The camera pans across the planes of a set, each at its own depth, snapped to the grid;
 * actors stand on its ground and breathe, the walker strikes, a guardian goes pixel by pixel
 * into rising violet lights. A blow is one frame in two colors and a shake; a waking brings
 * the set up out of the dark through the palette, never through translucency. One shot gives
 * way to the next through an ordered 4 × 4 mask, eighth by eighth. Solid pixels only.
 *
 * A frame is a pure function of the shot and its time: `shotPose` says what a moment shows,
 * `drawPose` draws it, the same pixels everywhere.
 */
import { biomeForStage, drawnEraForStage, guardianForStage, type CutsceneActor, type CutsceneObject, type CutsceneShot } from "@idlebound/game";
import { C, RIME_CROWN, SCENE_HEIGHT, SCENE_WIDTH, WALKER_POSES, type Pal, type ResolvedRecipe, type WalkerPose } from "@idlebound/game/art";
import { idleFrames, renderCreature, renderRecipe, type CreatureSprite } from "./creature";
import { sine } from "./draw";
import { glowsOf, type AirScene } from "./atmosphere";
import { castShadow, gradeForNight } from "./night";
import { renderPortrait } from "./portrait";
import { blit, clonePixels, createPixels, EMPTY, FADE_STEPS, hash2, setPixel, veil, type Pixels } from "./pixels";
import { compositeLayers, type Scene, type SceneLayer } from "./scene";
import { sceneOf } from "./stage";
import { paletteMap } from "./tables";
import { lru } from "./surface";

export const CUTSCENE_WIDTH = SCENE_WIDTH;
export const CUTSCENE_HEIGHT = SCENE_HEIGHT;
/** Steps of a guardian's fall: it is gone by `GONE_STEP`, its last lights by the end. */
export const FALL_STEPS = 16;
const GONE_STEP = 10;
/** Seconds per step of a fall. */
const FALL_STEP = 0.19;
const LIGHTS = 40;
const SEED = 1201;
/** Seconds per breath frame of an actor: the arena's own pace. */
const IDLE_FRAME_SECONDS = 0.55;
/** The plane actors stand on: the camera's pan is counted in its pixels. */
const GROUND_DEPTH = 0.7;
/** The walker's strike: the step forward, the hold, the step back, in seconds; and its reach. */
const LUNGE_IN = 0.12;
const LUNGE_HOLD = 0.55;
const LUNGE_OUT = 0.6;
const LUNGE_REACH = 28;
/** A blow's frame in two colors, then the shake, in seconds; and how far the shake throws. */
const FLASH = 0.1;
const SHAKE = 0.35;
const SHAKE_REACH = 2;
/** Seconds per frame of the walker's stride (four frames, two steps). */
const STRIDE_FRAME = 0.22;
/** Steps of a waking, from the dark to the set's own light. */
const WAKE_STEPS = 6;

/** What one moment of a shot shows: everything the picture depends on, nothing else. */
export interface ShotPose {
  /** The camera, in pixels of the actors' ground. */
  cam: number;
  /** The frame each plane of the set is on. */
  frames: number[];
  /** How far each plane has drifted on its own (the clouds). */
  drift: number[];
  actors: { x: number; pose: WalkerPose; frame: number; fall: number }[];
  flash: boolean;
  shake: readonly [number, number];
  /** Steps of light the set has, out of `WAKE_STEPS`. */
  light: number;
}

const ease = (k: number) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k));

/** The era a shot's road is drawn in (a place of the story stands outside the eras). */
const eraOf = (shot: CutsceneShot) => (shot.set.kind === "road" ? drawnEraForStage(shot.set.stage) : 0);

/** The scene a shot is set in, when it is one (a road or a place). */
function setScene(shot: CutsceneShot): Scene | null {
  if (shot.set.kind === "road") return sceneOf(biomeForStage(shot.set.stage).id, eraOf(shot));
  if (shot.set.kind === "place") return sceneOf(shot.set.id, 0);
  return null;
}

/** Things of the world shown up close. */
const OBJECTS: Record<CutsceneObject, ResolvedRecipe> = { "rime-crown": RIME_CROWN };

/** The camera at `t`: the pan eased over the shot; a still picture holds where it lands. */
function cameraAt(shot: CutsceneShot, t: number, still: boolean): number {
  if (!shot.pan) return 0;
  const [from, to] = shot.pan;
  return Math.round(still ? to : from + (to - from) * ease(t / shot.seconds));
}

/** The walker's step forward at `t`, in pixels. */
function lungeAt(actor: CutsceneActor, t: number): number {
  if (actor.lunge === undefined) return 0;
  const u = t - actor.lunge;
  if (u <= 0) return 0;
  if (u < LUNGE_IN) return Math.round(LUNGE_REACH * (1 - (1 - u / LUNGE_IN) ** 2));
  if (u < LUNGE_IN + LUNGE_HOLD) return LUNGE_REACH;
  return Math.round(LUNGE_REACH * (1 - ease((u - LUNGE_IN - LUNGE_HOLD) / LUNGE_OUT)));
}

/** The walker is in the lunge of a blow at `t`: stepped in, the blade out. */
function striking(actor: CutsceneActor, t: number): boolean {
  if (actor.lunge === undefined) return false;
  const u = t - actor.lunge;
  return u >= 0 && u < LUNGE_IN + LUNGE_HOLD;
}

/** The step of a fall at `t`: 0 before it, `FALL_STEPS` once it is over. */
function fallAt(actor: CutsceneActor, t: number, still: boolean): number {
  if (actor.fall === undefined) return 0;
  if (still) return FALL_STEPS;
  return Math.max(0, Math.min(FALL_STEPS, Math.floor((t - actor.fall) / FALL_STEP)));
}

/** The time of the shot's blow, if it has one. */
function blowOf(shot: CutsceneShot): number | null {
  const beat = shot.beats?.find((entry) => "flash" in entry);
  return beat ? beat.at : null;
}

/** What the shot shows at `t` seconds; `still` (reduced motion) holds a single picture. */
export function shotPose(shot: CutsceneShot, t: number, still = false): ShotPose {
  const scene = setScene(shot);
  const cam = cameraAt(shot, t, still);
  const frames = scene ? scene.layers.map((layer) => (still || layer.frames.length < 2 ? 0 : Math.floor(t / (layer.period ?? 0.9)) % layer.frames.length)) : still ? [0] : [Math.floor(t * HALO_FPS) % HALO_FRAMES];
  const drift = scene ? scene.layers.map((layer) => (still ? 0 : Math.floor(t * layer.drift))) : [];
  const actors = (shot.actors ?? []).map((actor) => {
    const pose: WalkerPose = still ? "stand" : striking(actor, t) ? "strike" : actor.walks ? "walk" : "stand";
    return {
      x: actor.x + (still ? 0 : lungeAt(actor, t)),
      pose,
      frame: still ? 0 : pose === "walk" ? Math.floor(t / STRIDE_FRAME) : pose === "strike" ? 0 : Math.floor(t / IDLE_FRAME_SECONDS),
      fall: fallAt(actor, t, still)
    };
  });
  const blow = still ? null : blowOf(shot);
  const since = blow === null ? -1 : t - blow;
  let shake: readonly [number, number] = [0, 0];
  if (since >= 0 && since < SHAKE) {
    const tick = Math.floor(since / 0.07);
    const reach = Math.max(1, Math.round(SHAKE_REACH * (1 - since / SHAKE)));
    shake = [Math.round((hash2(tick, 0, SEED) * 2 - 1) * reach), Math.round((hash2(tick, 1, SEED) * 2 - 1) * reach)];
  }
  const light = shot.wakes && !still ? Math.min(WAKE_STEPS, Math.floor((t / shot.wakes) * WAKE_STEPS)) : WAKE_STEPS;
  return { cam, frames, drift, actors, flash: since >= 0 && since < FLASH, shake, light };
}

/** A key that changes exactly when the picture does: the caller redraws only then. */
export const poseKey = (pose: ShotPose) => JSON.stringify(pose);

/** The last actors drawn, as pixels: a creature's frame, graded for the night it stands in. */
const sprites = lru(24);

function actorSprite(actor: CutsceneActor, shot: CutsceneShot, scene: Scene, frame: number, pose: WalkerPose = "stand"): CreatureSprite {
  const era = eraOf(shot);
  const walker = actor.who === "walker" || shot.set.kind !== "road";
  // A stride is four drawings; standing, the walker breathes, as every creature does.
  const recipes = WALKER_POSES[pose];
  const recipe = recipes[frame % recipes.length];
  const id = walker ? recipe.id : guardianForStage(shot.set.kind === "road" ? shot.set.stage : 1).id;
  const loop = walker ? (recipes.length > 1 ? 1 : recipe.grid.idle.breath.length) : idleFrames(id);
  const at = frame % loop;
  const key = `${id}:${era}:${at}:${scene.night ? "graded" : ""}`;
  return sprites.get(key, () => {
    const render = walker ? renderRecipe(recipe, { frame: at }) : renderCreature(id, { era, frame: at });
    return scene.night ? { ...render, pixels: gradeForNight(render.pixels, scene.night) } : render;
  });
}

/**
 * The violet lights a falling actor goes up in: each leaves one of its pixels at a step of
 * its own, climbs wavering, bright as it leaves, dimmer, then a single blinking pixel before
 * it goes out.
 */
function risingLights(out: Pixels, body: Pixels, left: number, top: number, step: number) {
  const lit: number[] = [];
  for (let at = 0; at < body.idx.length; at += 1) if (body.idx[at] !== EMPTY) lit.push(at);
  if (lit.length === 0) return;
  const point = (x: number, y: number, head: Pal, tail: Pal | null) => {
    setPixel(out, x, y, head, 255, 1);
    if (tail !== null) setPixel(out, x, y + 1, tail, 255, 1);
  };
  for (let index = 0; index < LIGHTS; index += 1) {
    const at = lit[Math.floor(hash2(index, 0, SEED) * lit.length)];
    const leaves = 1 + Math.floor(hash2(index, 1, SEED) * (GONE_STEP - 1));
    const span = 5 + Math.floor(hash2(index, 2, SEED) * 3);
    const k = (step - leaves) / span;
    if (k < 0 || k >= 1) continue;
    const climb = 30 + Math.floor(hash2(index, 3, SEED) * 36);
    const x = left + (at % body.w) + Math.round(sine(k * 1.5 + hash2(index, 4, SEED)) * 2);
    const y = top + Math.floor(at / body.w) - Math.round(k * climb);
    if (k < 0.5) point(x, y, C.essenceLight, C.essenceBright);
    else if (k < 0.8) point(x, y, C.essenceBright, C.essence);
    else if ((step + index) % 2 === 0) point(x, y, C.essence, null);
  }
}

/** The pixels of a shot's set and actors at a pose, with the masks of the actors (for a blow). */
function drawSet(shot: CutsceneShot, pose: ShotPose): { out: Pixels; actors: Pixels } {
  const actors = createPixels(CUTSCENE_WIDTH, CUTSCENE_HEIGHT);
  if (shot.set.kind === "ink") return { out: inkFrame(), actors };
  if (shot.set.kind === "memory") {
    const hero = shot.set.hero;
    return { out: haloFrame(`hero:${hero}`, () => renderPortrait(hero), pose.frames[0]), actors };
  }
  if (shot.set.kind === "object") {
    const recipe = OBJECTS[shot.set.id];
    return { out: haloFrame(`object:${recipe.id}`, () => renderRecipe(recipe).pixels, pose.frames[0]), actors };
  }
  const scene = setScene(shot)!;
  const out = createPixels(CUTSCENE_WIDTH, CUTSCENE_HEIGHT);
  out.idx.fill(scene.skyTop);
  out.alpha.fill(255);
  const index = new Map<SceneLayer, number>(scene.layers.map((layer, at) => [layer, at]));
  const frameOf = (layer: SceneLayer) => pose.frames[index.get(layer)!];
  // Each plane moves with the camera as far as it is near, the clouds drift on their own. The
  // frame at the edges parts as the camera moves, and closes in where it comes to rest.
  const shift = (layer: SceneLayer) => {
    const moved = Math.round((Math.abs(pose.cam) * layer.depth) / GROUND_DEPTH);
    if (layer.anchor) return layer.anchor === "left" ? moved : -moved;
    return Math.round((pose.cam * layer.depth) / GROUND_DEPTH) + pose.drift[index.get(layer)!];
  };
  const front = scene.layers.findIndex((layer) => layer.anchor);
  const back = front < 0 ? scene.layers : scene.layers.slice(0, front);
  compositeLayers(back, CUTSCENE_WIDTH, frameOf, out, 0, shift);
  const side = scene.source ? Math.sign(scene.source.x - SCENE_WIDTH / 2) || 1 : 1;
  (shot.actors ?? []).forEach((actor, at) => {
    const state = pose.actors[at];
    const remaining = state.fall === 0 ? FADE_STEPS : Math.max(0, FADE_STEPS - Math.round((Math.min(state.fall, GONE_STEP) / GONE_STEP) * FADE_STEPS));
    const sprite = actorSprite(actor, shot, scene, state.frame, state.pose);
    // A guardian's shadow and lights keep to its still frame; the walker's follow the pose.
    const still = actor.who === "walker" ? sprite : actorSprite(actor, shot, scene, 0);
    const left = CUTSCENE_WIDTH / 2 + state.x - Math.round(sprite.pixels.w / 2) - (actor.walks ? 0 : pose.cam);
    const top = scene.ground - sprite.feet;
    if (remaining > 0) {
      const shadow = castShadow(still.pixels, still.feet, side, scene.shadow);
      blit(out, veil(shadow.pixels, remaining), left + shadow.dx, scene.ground - still.feet + shadow.dy);
      const body = veil(sprite.pixels, remaining);
      blit(out, body, left, top);
      blit(actors, body, left, top);
    }
    if (state.fall > 0 && state.fall < FALL_STEPS) risingLights(out, still.pixels, left, scene.ground - still.feet, state.fall);
  });
  if (front >= 0) compositeLayers(scene.layers.slice(front), CUTSCENE_WIDTH, frameOf, out, 0, shift);
  return { out, actors };
}

/** Tables that bring every color down toward the night ink, one per step of a waking. */
const DARKER = lru(WAKE_STEPS);
const INK_RGB = [11, 10, 20] as const;
function darkTable(light: number): Pal[] {
  return DARKER.get(String(light), () => {
    const k = light / WAKE_STEPS;
    return paletteMap((r, g, b) => [INK_RGB[0] + (r - INK_RGB[0]) * k, INK_RGB[1] + (g - INK_RGB[1]) * k, INK_RGB[2] + (b - INK_RGB[2]) * k]);
  });
}

/**
 * What the air (atmosphere.ts) sees of a shot at a pose: the lights of the very picture drawn
 * (they follow the camera, the actors, a King's flame), and the set's still water, if any.
 */
export function shotAir(shot: CutsceneShot, picture: Pixels, cam: number): AirScene {
  const scene = setScene(shot);
  // The air lays the scene where the camera put its ground (`cam` to the left); the lights of
  // the picture are already where the camera put them, so they are told back on the ground.
  const glows = glowsOf(picture).map((glow) => ({ ...glow, x: glow.x + cam }));
  return { glows, water: scene?.water ?? null, horizon: scene?.horizon ?? CUTSCENE_HEIGHT, ground: scene?.ground ?? CUTSCENE_HEIGHT };
}

/** One frame of a shot at a pose. */
export function drawPose(shot: CutsceneShot, pose: ShotPose): Pixels {
  const { out, actors } = drawSet(shot, pose);
  if (pose.light < WAKE_STEPS) {
    // The set comes up out of the dark; its own lights (a fire, a stone's glow) shine first.
    const table = darkTable(pose.light);
    for (let at = 0; at < out.idx.length; at += 1) if (!out.emit[at]) out.idx[at] = table[out.idx[at]];
  }
  if (pose.flash) {
    // The frame of the blow: the night goes to ink, whoever stands in it to bone white.
    for (let at = 0; at < out.idx.length; at += 1) out.idx[at] = actors.idx[at] === EMPTY ? C.ink : C.paper;
  }
  const [dx, dy] = pose.shake;
  return dx === 0 && dy === 0 ? out : shaken(out, dx, dy);
}

/** The picture thrown by (dx, dy), its edges held where it slid away from them. */
function shaken(source: Pixels, dx: number, dy: number): Pixels {
  const out = clonePixels(source);
  const { w, h } = source;
  for (let y = 0; y < h; y += 1) {
    const sy = Math.max(0, Math.min(h - 1, y - dy));
    for (let x = 0; x < w; x += 1) {
      const sx = Math.max(0, Math.min(w - 1, x - dx));
      const to = y * w + x;
      const from = sy * w + sx;
      out.idx[to] = source.idx[from];
      out.alpha[to] = source.alpha[from];
      out.emit[to] = source.emit[from];
    }
  }
  return out;
}

/** One frame of a shot at `t` seconds. */
export function shotFrame(shot: CutsceneShot, t: number, still = false): Pixels {
  return drawPose(shot, shotPose(shot, t, still));
}

/** A face or a thing in the dark breathes its halo in and out over this loop. */
const HALO_FRAMES = 4;
const HALO_FPS = 1.6;
const HALO_X = CUTSCENE_WIDTH / 2;
const HALO_Y = 92;
/** Rings of the halo, from the middle outward: radius, color, and one dot every `gap` pixels of the ring (1: a checker). */
const HALO: readonly { r: number; pal: Pal; gap: number }[] = [
  { r: 40, pal: C.night3, gap: 1 },
  { r: 46, pal: C.night2, gap: 2 },
  { r: 53, pal: C.night2, gap: 3 },
  { r: 61, pal: C.night1, gap: 4 },
  { r: 70, pal: C.night1, gap: 6 }
];

/**
 * A companion's face remembered, or a thing of the world up close: alone on the night ink,
 * inside a halo of concentric rings, dithered sparser outward, that breathe a pixel in and out.
 */
function haloFrame(key: string, subject: () => Pixels, frame: number): Pixels {
  return halos.get(`${key}:${frame % HALO_FRAMES}`, () => {
    const out = inkFrame();
    const breath = frame % HALO_FRAMES === 2 ? 1 : 0;
    // The disc under the subject, a checker, then dotted circles farther and farther apart.
    for (let y = 0; y < CUTSCENE_HEIGHT; y += 1) {
      for (let x = 0; x < CUTSCENE_WIDTH; x += 1) {
        const d = Math.round(Math.hypot(x - HALO_X, y - HALO_Y));
        if (d <= HALO[0].r + breath) {
          if ((x + y) % 2 === 0) setPixel(out, x, y, HALO[0].pal);
          continue;
        }
        for (const ring of HALO.slice(1)) {
          if (d !== ring.r + breath) continue;
          const angle = Math.round(Math.atan2(y - HALO_Y, x - HALO_X) * ring.r);
          if (angle % ring.gap === 0) setPixel(out, x, y, ring.pal);
        }
      }
    }
    const pixels = subject();
    blit(out, pixels, HALO_X - Math.round(pixels.w / 2), HALO_Y - Math.round(pixels.h / 2) + 4);
    return out;
  });
}

const halos = lru(8);

/** The night ink, edge to edge: what a scene opens from and closes on. */
export function inkFrame(): Pixels {
  const out = createPixels(CUTSCENE_WIDTH, CUTSCENE_HEIGHT);
  out.idx.fill(C.ink);
  out.alpha.fill(255);
  return out;
}

/** `from` giving way to `to` at `step` eighths: the same ordered mask as every fade of the world. */
export function dissolve(from: Pixels, to: Pixels, step: number): Pixels {
  if (step >= FADE_STEPS) return to;
  const out = clonePixels(to);
  blit(out, veil(from, FADE_STEPS - step), 0, 0);
  return out;
}

/** Rows of night ink over the top and bottom of the picture while a scene plays: a cinema's frame. */
export const LETTERBOX = 12;

/** The picture with `rows` rows of ink at its top and at its bottom. */
export function letterbox(source: Pixels, rows: number): Pixels {
  if (rows <= 0) return source;
  const out = clonePixels(source);
  const { w, h } = source;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < w; x += 1) {
      for (const at of [y * w + x, (h - 1 - y) * w + x]) {
        out.idx[at] = C.ink;
        out.alpha[at] = 255;
        out.emit[at] = 0;
      }
    }
  }
  return out;
}
