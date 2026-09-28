/**
 * Cached, ready-to-draw sprites: every frame of a creature in its era (idle, blink, white
 * and tinted hit flashes, the boss ring), portraits, emblems, relics, icons, the crystal
 * and the scenes. Generation happens once per key; the LRU keeps memory bounded.
 */
import type { ItemSlot, Rarity } from "@idlebound/game";
import { palRgb, type IconRecipe, type Pal } from "@idlebound/game/art";
import { idleFrames, renderCreature } from "./creature";
import { renderEmblem } from "./mask";
import { renderCrystal, renderIcon, renderRelic } from "./objects";
import { clonePixels, createPixels, EMPTY, FADE_STEPS, veil, type Pixels } from "./pixels";
import { renderPortrait, awakenedRecipe } from "./portrait";
import { eclipsePixels, greyPixels, greyScene } from "./events";
import { castShadow, gradeForNight, type NightGrade } from "./night";
import { renderScene, type Scene, type SceneOptions } from "./scene";
import { sceneCache, spriteCache, toSurface, uiCache, type Surface } from "./surface";
import type { Treatment } from "./eras";

export interface CreatureSheet {
  id: string;
  era: number;
  frames: Surface[];
  blink: Surface;
  /** The base frame's pixels: what comes apart on death and gathers on spawn. */
  pixels: Pixels;
  feet: number;
  treatment: Treatment;
  flash: (color: Pal) => Surface;
  /** The boss outline, thinned to fade step `step` (FADE_STEPS: whole). */
  ring: (color: Pal, step?: number) => Surface;
  /** Its shadow on the ground, away from the moon's side, and its offset from the sprite; thinned to fade step `step`. */
  shadow: (side: number, color: Pal, step?: number) => { surface: Surface; dx: number; dy: number };
  /** An idle frame thinned to fade step `step`: how a creature comes, goes or wavers without translucency. */
  veiled: (frame: number, step: number) => Surface;
}

/** How an event tones a creature: the Quiet's greys, the King's Eclipse. */
export type Tone = "grey" | "eclipse";
const TONES: Record<Tone, (pixels: Pixels) => Pixels> = { grey: greyPixels, eclipse: eclipsePixels };

/** The frame of a hit: the body inside the outline in one color; the outline stays dark and eyes keep their light. */
export function flashPixels(source: Pixels, color: Pal): Pixels {
  const out = clonePixels(source);
  const empty = (x: number, y: number) => x < 0 || y < 0 || x >= source.w || y >= source.h || source.idx[y * source.w + x] === EMPTY;
  for (let y = 0; y < source.h; y += 1) {
    for (let x = 0; x < source.w; x += 1) {
      const at = y * source.w + x;
      if (source.idx[at] === EMPTY || source.emit[at]) continue;
      if (empty(x - 1, y) || empty(x + 1, y) || empty(x, y - 1) || empty(x, y + 1)) continue;
      out.idx[at] = color;
      out.alpha[at] = 255;
    }
  }
  return out;
}

/** A 1 px ring just outside the silhouette (the pulsing boss outline). */
export function ringPixels(source: Pixels, color: Pal): Pixels {
  const out = createPixels(source.w + 2, source.h + 2);
  const filled = (x: number, y: number) => x >= 0 && y >= 0 && x < source.w && y < source.h && source.idx[y * source.w + x] !== EMPTY && source.alpha[y * source.w + x] > 100;
  for (let y = -1; y <= source.h; y += 1) {
    for (let x = -1; x <= source.w; x += 1) {
      if (filled(x, y)) continue;
      if (!(filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) continue;
      const at = (y + 1) * out.w + (x + 1);
      out.idx[at] = color;
      out.alpha[at] = 255;
      out.emit[at] = 1;
    }
  }
  return out;
}

/**
 * A creature's frames in an era, graded for the night of a scene when one is given
 * (`night.key` names it in the cache), then toned for an event: in greys while the Quiet
 * stands, in shadow for the King's Eclipse.
 */
export function creatureSheet(id: string, era: number, night?: { key: string; grade: NightGrade }, tone?: Tone): CreatureSheet {
  return spriteCache.get(`creature:${id}:${era}:${night?.key ?? ""}:${tone ?? ""}`, () => {
    const toned = tone ? TONES[tone] : (pixels: Pixels) => pixels;
    const grade = (pixels: Pixels) => toned(night ? gradeForNight(pixels, night.grade) : pixels);
    const renders = Array.from({ length: idleFrames(id) }, (_, frame) => {
      const render = renderCreature(id, { era, frame });
      return { ...render, pixels: grade(render.pixels) };
    });
    const base = renders[0];
    const flashes = new Map<Pal, Surface>();
    const shadows = new Map<string, { surface: Surface; dx: number; dy: number }>();
    const rings = new Map<string, Surface>();
    const veils = new Map<string, Surface>();
    const frames = renders.map((render) => toSurface(render.pixels));
    return {
      id,
      era,
      frames,
      blink: toSurface(grade(renderCreature(id, { era, blink: true }).pixels)),
      pixels: base.pixels,
      feet: base.feet,
      treatment: base.treatment,
      flash: (color) => {
        let surface = flashes.get(color);
        if (!surface) flashes.set(color, (surface = toSurface(flashPixels(base.pixels, color))));
        return surface;
      },
      shadow: (side, color, step = FADE_STEPS) => {
        const key = `${side}:${color}:${step}`;
        let shadow = shadows.get(key);
        if (!shadow) {
          const cast = castShadow(base.pixels, base.feet, side, color);
          shadows.set(key, (shadow = { surface: toSurface(veil(cast.pixels, step)), dx: cast.dx, dy: cast.dy }));
        }
        return shadow;
      },
      ring: (color, step = FADE_STEPS) => {
        const key = `${color}:${step}`;
        let surface = rings.get(key);
        if (!surface) rings.set(key, (surface = toSurface(veil(ringPixels(base.pixels, color), step))));
        return surface;
      },
      veiled: (frame, step) => {
        if (step >= FADE_STEPS) return frames[frame];
        const key = `${frame}:${step}`;
        let surface = veils.get(key);
        if (!surface) veils.set(key, (surface = toSurface(veil(renders[frame].pixels, step))));
        return surface;
      }
    };
  });
}

export interface SceneSheet {
  scene: Scene;
  layers: { frames: Surface[]; drift: number; period: number; anchor?: "left" | "right"; ground?: boolean; width: number }[];
  milestone?: { x: number; y: number; off: Surface; on: Surface };
}

/** A scene ready to draw: a biome in an era, or a place (see `renderScene`); in greys while the Quiet stands. */
export function sceneSheet(sceneId: string, era: number, options: SceneOptions = {}, grey = false): SceneSheet {
  return sceneCache.get(`scene:${sceneId}:${era}:${options.fullMoon ? "full" : ""}:${options.darkNight ? "dark" : ""}:${grey ? "grey" : ""}`, () => {
    const scene = grey ? greyScene(sceneSheet(sceneId, era, options).scene) : renderScene(sceneId, era, options);
    return {
      scene,
      layers: scene.layers.map((layer) => ({ frames: layer.frames.map(toSurface), drift: layer.drift, period: layer.period ?? 0.9, anchor: layer.anchor, ground: layer.ground, width: layer.frames[0].w })),
      milestone: scene.milestone ? { x: scene.milestone.x, y: scene.milestone.y, off: toSurface(scene.milestone.off), on: toSurface(scene.milestone.on) } : undefined
    };
  });
}

export const portraitPixels = (heroId: string, seed?: number): Pixels =>
  uiCache.get(`portrait-px:${heroId}:${seed ?? ""}`, () => renderPortrait(heroId, seed === undefined ? undefined : awakenedRecipe(seed)));
export const emblemPixels = (heroId: string): Pixels => uiCache.get(`emblem-px:${heroId}`, () => renderEmblem(heroId));
export const relicPixels = (slot: ItemSlot, base: number, rarity: Rarity, forge: number, named?: string): Pixels =>
  uiCache.get(`relic-px:${slot}:${base}:${rarity}:${forge}:${named ?? ""}`, () => renderRelic(slot, base, rarity, forge, named));
export const iconPixels = (key: string, recipe: IconRecipe): Pixels => uiCache.get(`icon-px:${key}`, () => renderIcon(recipe));
export const crystalPixels = (frame: number): Pixels => uiCache.get(`crystal-px:${frame}`, () => renderCrystal(frame));

/** CSS color of a palette entry. */
export function css(pal: Pal, alpha = 1): string {
  const [r, g, b] = palRgb(pal);
  return alpha >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}
