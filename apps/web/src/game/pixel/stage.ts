/**
 * Views of a scene outside the arena: the scene with its guardian standing on the road, as
 * in the arena (without the arena's effects), only the planes of one depth (the workshop),
 * or a place of the story as a banner. Frames loop the scene's own motion: water, lights,
 * banners, leaves, essences, the hum of the warp.
 */
import { BIOMES } from "@idlebound/game";
import { SCENE_HEIGHT, SCENE_WIDTH } from "@idlebound/game/art";
import { idleFrames, renderCreature } from "./creature";
import { castShadow, gradeForNight } from "./night";
import { blit, createPixels, FADE_STEPS, veil, type Pixels } from "./pixels";
import { compositeLayers, renderScene, type PlaceId, type Scene, type SceneLayer, type SceneOptions } from "./scene";
import { lru } from "./surface";

/** The last scenes looked at, as pixels (the views need no canvas). */
const scenes = lru(6);
const sceneOf = (sceneId: string, era: number, options: SceneOptions = {}): Scene =>
  scenes.get(`${sceneId}:${era}:${options.darkNight ? "dark" : ""}`, () => renderScene(sceneId, era, options));

/** Frames of a stage: enough for every layer's loop (2 or 4 frames). */
export const STAGE_FRAMES = 4;

/** The depths a scene is built in: far (sky, far ranges, landmark), middle (ground, buildings), near (the frame). */
export type Depth = "far" | "middle" | "near";

function depthOf(layer: SceneLayer): Depth {
  return layer.anchor ? "near" : layer.depth <= 0.2 ? "far" : "middle";
}

/** Where a biome's guardian stands in a view `width` columns wide: its box, feet on the scene's ground. */
export function guardianBox(biomeId: string, era: number, width = SCENE_WIDTH, options: SceneOptions = {}): { x: number; y: number; w: number; h: number } | null {
  const boss = BIOMES.find((biome) => biome.id === biomeId)?.boss.id;
  if (!boss) return null;
  const still = renderCreature(boss, { era });
  const x = Math.floor(width / 2) - Math.round(still.pixels.w / 2);
  return { x, y: sceneOf(biomeId, era, options).ground - still.feet, w: still.pixels.w, h: still.pixels.h };
}

/**
 * One frame of a scene in an era (a biome, or a place: see `renderScene`), with its
 * biome's guardian in front when asked, in a view `width` columns wide centered on the
 * scene as the arena shows it (the frame at its edges). `guardianStep` leaves only that
 * many eighths of the guardian and its shadow (a guardian going, pixel by pixel).
 */
export function stageFrame(biomeId: string, era: number, frame: number, guardian: boolean, width = SCENE_WIDTH, options: SceneOptions = {}, guardianStep = FADE_STEPS): Pixels {
  const scene = sceneOf(biomeId, era, options);
  const out = createPixels(width, SCENE_HEIGHT);
  out.idx.fill(scene.skyTop);
  out.alpha.fill(255);
  const origin = Math.floor(width / 2) - SCENE_WIDTH / 2;
  const front = scene.layers.findIndex((layer) => layer.anchor);
  compositeLayers(scene.layers.slice(0, front), width, frame, out, origin);
  const boss = BIOMES.find((biome) => biome.id === biomeId)?.boss.id;
  if (guardian && boss && guardianStep > 0) {
    const render = renderCreature(boss, { era, frame: frame % idleFrames(boss) });
    const pixels = scene.night ? gradeForNight(render.pixels, scene.night) : render.pixels;
    const left = Math.floor(width / 2) - Math.round(pixels.w / 2);
    const top = scene.ground - render.feet;
    const still = renderCreature(boss, { era });
    const shadow = castShadow(still.pixels, still.feet, scene.source ? Math.sign(scene.source.x - SCENE_WIDTH / 2) || 1 : 1, scene.shadow);
    blit(out, veil(shadow.pixels, guardianStep), left + shadow.dx, top + shadow.dy);
    blit(out, veil(pixels, guardianStep), left, top);
  }
  return compositeLayers(scene.layers.slice(front), width, frame, out, origin);
}

/**
 * One frame of only the planes of one depth, on nothing, in a view `width` columns wide
 * centered on the scene (the frame at its edges), as the arena widens it.
 */
export function depthFrame(biomeId: string, era: number, frame: number, depth: Depth, width = SCENE_WIDTH): Pixels {
  const scene = sceneOf(biomeId, era);
  const origin = Math.floor(width / 2) - SCENE_WIDTH / 2;
  return compositeLayers(scene.layers.filter((layer) => depthOf(layer) === depth), width, frame, createPixels(width, SCENE_HEIGHT), origin);
}

/** Frames per second of a place's banner, and the length of its loop. */
const BANNER_FPS = 6;
const BANNER_TICKS = 24;

/**
 * A place as a banner: the whole scene, every layer looping a whole number of times over the
 * banner's loop at about its own pace, so the loop never jumps. No sway, no drift: a still
 * camera. Frames are made on demand (the caller caches them).
 */
export function placeFrames(id: PlaceId): { frames: () => Pixels[]; fps: number } {
  const seconds = BANNER_TICKS / BANNER_FPS;
  return {
    fps: BANNER_FPS,
    frames: () => {
      const scene = sceneOf(id, 0);
      const cycles = scene.layers.map((layer) => Math.max(1, Math.round(seconds / (layer.frames.length * (layer.period ?? 0.9)))));
      return Array.from({ length: BANNER_TICKS }, (_, tick) => {
        const out = createPixels(SCENE_WIDTH, SCENE_HEIGHT);
        out.idx.fill(scene.skyTop);
        out.alpha.fill(255);
        scene.layers.forEach((layer, index) => {
          const frame = layer.frames.length < 2 ? 0 : Math.floor((tick * layer.frames.length * cycles[index]) / BANNER_TICKS) % layer.frames.length;
          compositeLayers([{ ...layer, frames: [layer.frames[frame]] }], SCENE_WIDTH, 0, out);
        });
        return out;
      });
    }
  };
}
