/**
 * The shots of the Ledger's scenes (BIBLE 12.10), drawn with the scenes of the road and the
 * places of the story: one grid for every shot, the scene's own 320 × 180, never resized.
 * A guardian goes pixel by pixel into rising violet lights; one shot gives way to the next
 * through an ordered 4 × 4 mask, eighth by eighth. Solid pixels only.
 */
import { BIOMES, type CutsceneView } from "@idlebound/game";
import { C, SCENE_HEIGHT, SCENE_WIDTH, type Pal } from "@idlebound/game/art";
import { renderCreature } from "./creature";
import { PORTRAIT_SIZE, renderPortrait } from "./portrait";
import { sine } from "./draw";
import { blit, clonePixels, createPixels, EMPTY, FADE_STEPS, hash2, setPixel, veil, type Pixels } from "./pixels";
import type { PlaceId } from "./scene";
import { guardianBox, placeFrames, stageFrame, STAGE_FRAMES } from "./stage";
import { lru } from "./surface";

export const CUTSCENE_WIDTH = SCENE_WIDTH;
export const CUTSCENE_HEIGHT = SCENE_HEIGHT;
/** Steps of a guardian's fall: it is gone by `GONE_STEP`, its last lights by the end. */
export const FALL_STEPS = 16;
const GONE_STEP = 10;
/** Frames per second of a stretch of road (its lights, water, banners). */
const ROAD_FPS = 2.5;
const LIGHTS = 40;
const SEED = 1201;

/** A place's banner loop, made once (the Sanctum is 24 frames). */
const places = lru(2);

/** Frames per second of a shot's own motion, and the length of its loop. */
export function shotMotion(view: CutsceneView): { fps: number; frames: number } {
  if (view.kind === "memory") return { fps: MEMORY_FPS, frames: MEMORY_FRAMES };
  if (view.kind === "place") {
    const { fps } = placeFrames(view.id);
    return { fps, frames: placeLoop(view.id).length };
  }
  return { fps: ROAD_FPS, frames: STAGE_FRAMES };
}

function placeLoop(id: PlaceId): Pixels[] {
  return places.get(id, () => placeFrames(id).frames());
}

/**
 * The violet lights a falling guardian goes up in: each leaves one of its pixels at a step
 * of its own, climbs wavering, bright as it leaves, dimmer, then a single blinking pixel
 * before it goes out.
 */
function risingLights(biomeId: string, era: number, step: number): Pixels {
  const out = createPixels(CUTSCENE_WIDTH, CUTSCENE_HEIGHT);
  const boss = BIOMES.find((biome) => biome.id === biomeId)?.boss.id;
  const box = guardianBox(biomeId, era);
  if (!boss || !box) return out;
  const still = renderCreature(boss, { era }).pixels;
  const body: number[] = [];
  for (let at = 0; at < still.idx.length; at += 1) if (still.idx[at] !== EMPTY) body.push(at);
  if (body.length === 0) return out;
  const point = (x: number, y: number, head: Pal, tail: Pal | null) => {
    setPixel(out, x, y, head, 255, 1);
    if (tail !== null) setPixel(out, x, y + 1, tail, 255, 1);
  };
  for (let index = 0; index < LIGHTS; index += 1) {
    const at = body[Math.floor(hash2(index, 0, SEED) * body.length)];
    const leaves = 1 + Math.floor(hash2(index, 1, SEED) * (GONE_STEP - 1));
    const span = 5 + Math.floor(hash2(index, 2, SEED) * 3);
    const k = (step - leaves) / span;
    if (k < 0 || k >= 1) continue;
    const climb = 30 + Math.floor(hash2(index, 3, SEED) * 36);
    const x = box.x + (at % still.w) + Math.round(sine(k * 1.5 + hash2(index, 4, SEED)) * 2);
    const y = box.y + Math.floor(at / still.w) - Math.round(k * climb);
    if (k < 0.5) point(x, y, C.essenceLight, C.essenceBright);
    else if (k < 0.8) point(x, y, C.essenceBright, C.essence);
    else if ((step + index) % 2 === 0) point(x, y, C.essence, null);
  }
  return out;
}

/**
 * One frame of a shot: `frame` counts its own motion (it loops), `fall` the steps of a
 * falling guardian (a guardian that is gone shows its last step).
 */
export function shotFrame(view: CutsceneView, frame: number, fall = FALL_STEPS): Pixels {
  if (view.kind === "memory") return memoryFrame(view.hero, frame);
  if (view.kind === "place") {
    const loop = placeLoop(view.id);
    return loop[frame % loop.length];
  }
  const standing = view.guardian !== "none";
  const falling = view.guardian === "fall";
  const step = falling ? Math.max(0, FADE_STEPS - Math.round((Math.min(fall, GONE_STEP) / GONE_STEP) * FADE_STEPS)) : FADE_STEPS;
  const out = stageFrame(view.biome, view.era, frame % STAGE_FRAMES, standing, CUTSCENE_WIDTH, {}, step);
  if (falling && fall < FALL_STEPS) blit(out, risingLights(view.biome, view.era, fall), 0, 0);
  return out;
}

/** A remembered face breathes its halo in and out over this loop. */
const MEMORY_FRAMES = 4;
const MEMORY_FPS = 1.6;
const MEMORY_X = CUTSCENE_WIDTH / 2;
const MEMORY_Y = 92;
/** Rings of the halo, from the face outward: radius, color, and one dot every `gap` pixels of the ring (1: a checker). */
const HALO: readonly { r: number; pal: Pal; gap: number }[] = [
  { r: 40, pal: C.night3, gap: 1 },
  { r: 46, pal: C.night2, gap: 2 },
  { r: 53, pal: C.night2, gap: 3 },
  { r: 61, pal: C.night1, gap: 4 },
  { r: 70, pal: C.night1, gap: 6 }
];

/**
 * A companion's face in the dark, remembered: the portrait bust on the night ink, inside a
 * halo of concentric rings, dithered sparser outward, that breathe a pixel in and out.
 */
function memoryFrame(heroId: string, frame: number): Pixels {
  return memories.get(`${heroId}:${frame % MEMORY_FRAMES}`, () => {
    const out = inkFrame();
    const breath = frame % MEMORY_FRAMES === 2 ? 1 : 0;
    // The disc under the face, a checker, then dotted circles farther and farther apart.
    for (let y = 0; y < CUTSCENE_HEIGHT; y += 1) {
      for (let x = 0; x < CUTSCENE_WIDTH; x += 1) {
        const d = Math.round(Math.hypot(x - MEMORY_X, y - MEMORY_Y));
        if (d <= HALO[0].r + breath) {
          if ((x + y) % 2 === 0) setPixel(out, x, y, HALO[0].pal);
          continue;
        }
        for (const ring of HALO.slice(1)) {
          if (d !== ring.r + breath) continue;
          const angle = Math.round(Math.atan2(y - MEMORY_Y, x - MEMORY_X) * ring.r);
          if (angle % ring.gap === 0) setPixel(out, x, y, ring.pal);
        }
      }
    }
    const face = renderPortrait(heroId);
    blit(out, face, MEMORY_X - PORTRAIT_SIZE / 2, MEMORY_Y - PORTRAIT_SIZE / 2 + 4);
    return out;
  });
}

const memories = lru(8);

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
