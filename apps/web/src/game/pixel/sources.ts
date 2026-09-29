/**
 * Ready-made sources for `PixelSprite`: every kind of world art the interface shows.
 */
import type { Item, Locale, Notation } from "@idlebound/game";
import { ALTAR_ICONS, CARAVAN_ICONS, MARKET_ICONS, POWER_ICONS } from "@idlebound/game/art";
import { idleFrames, renderCreature } from "./creature";
import { renderEvenRat } from "./mask";
import { CRYSTAL_FRAMES } from "./objects";
import { hash2, type Pixels } from "./pixels";
import type { PixelSource } from "./PixelSprite";
import { structureView } from "./props";
import { flattenScene, type PlaceId } from "./scene";
import { depthFrame, placeFrames, stageFrame, STAGE_FRAMES, type Depth } from "./stage";
import { crystalPixels, emblemPixels, iconPixels, portraitPixels, relicPixels, sceneSheet } from "./sprites";
import { stillCache } from "./surface";

export function creatureSource(id: string, era = 0, animated = true): PixelSource {
  return {
    key: `creature:${id}:${era}:${animated}`,
    frames: () => stillCache.get(`creature-px:${id}:${era}:${animated}`, () => Array.from({ length: animated ? idleFrames(id) : 1 }, (_, frame) => renderCreature(id, { era, frame }).pixels)),
    fps: 1.8
  };
}

/** The Awakened wears the walker's settings: notation, sound and language make its seed. */
export function awakenedSeed(notation: Notation, sound: boolean, locale: Locale): number {
  const text = `${notation}|${sound ? 1 : 0}|${locale}`;
  let seed = 0;
  for (let index = 0; index < text.length; index += 1) seed = Math.floor(hash2(seed, text.charCodeAt(index), index) * 2 ** 30);
  return seed;
}

export function portraitSource(heroId: string, seed?: number): PixelSource {
  return { key: `portrait:${heroId}:${seed ?? ""}`, frames: () => [portraitPixels(heroId, seed)] };
}

/** The tiny gold rat on Thorvald's medallion (the Even secret). */
export function evenRatSource(): PixelSource {
  return { key: "even-rat", frames: () => [stillCache.get("even-rat-px", renderEvenRat)] };
}

export function emblemSource(heroId: string): PixelSource {
  return { key: `emblem:${heroId}`, frames: () => [emblemPixels(heroId)] };
}

export function relicSource(item: Pick<Item, "slot" | "base" | "rarity" | "forge" | "named">): PixelSource {
  const base = item.base ?? 0;
  return { key: `relic:${item.slot}:${base}:${item.rarity}:${item.forge}:${item.named ?? ""}`, frames: () => [relicPixels(item.slot, base, item.rarity, item.forge, item.named)] };
}

export function altarIconSource(id: keyof typeof ALTAR_ICONS): PixelSource {
  return { key: `altar:${id}`, frames: () => [iconPixels(`altar:${id}`, ALTAR_ICONS[id])] };
}

export function powerIconSource(id: keyof typeof POWER_ICONS): PixelSource {
  return { key: `power:${id}`, frames: () => [iconPixels(`power:${id}`, POWER_ICONS[id])] };
}

export function marketIconSource(id: keyof typeof MARKET_ICONS): PixelSource {
  return { key: `market:${id}`, frames: () => [iconPixels(`market:${id}`, MARKET_ICONS[id])] };
}

export function caravanIconSource(id: keyof typeof CARAVAN_ICONS): PixelSource {
  return { key: `ware:${id}`, frames: () => [iconPixels(`ware:${id}`, CARAVAN_ICONS[id])] };
}

export function crystalSource(): PixelSource {
  return { key: "crystal", frames: () => Array.from({ length: CRYSTAL_FRAMES }, (_, frame) => crystalPixels(frame)), fps: 5 };
}

/** A biome's scene in motion, its guardian standing on the road when asked, in a view `width` columns wide (the workshop). */
export function stageSource(biomeId: string, era: number, guardian: boolean, width?: number, darkNight = false): PixelSource {
  return {
    key: `stage:${biomeId}:${era}:${guardian}:${width ?? ""}:${darkNight}`,
    frames: () => Array.from({ length: STAGE_FRAMES }, (_, frame) => stageFrame(biomeId, era, frame, guardian, width, { darkNight })),
    fps: 2.5
  };
}

/** A place of the story in motion (the Sanctum of Dusk, Eldra's Loom, the Dawn): a banner for a window. */
export function placeSource(id: PlaceId): PixelSource {
  const { frames, fps } = placeFrames(id);
  return { key: `place:${id}`, frames: () => frames(), fps };
}

/** Only the planes of one depth of a biome's scene (the workshop). */
export function depthSource(biomeId: string, era: number, depth: Depth, width?: number): PixelSource {
  return {
    key: `depth:${biomeId}:${era}:${depth}${width ? `:${width}` : ""}`,
    frames: () => Array.from({ length: STAGE_FRAMES }, (_, frame) => depthFrame(biomeId, era, frame, depth, width)),
    fps: 2.5
  };
}

/** One building or ruin of a biome, worn by an era (the workshop). */
export function structureSource(biomeId: string, id: string, era: number): PixelSource {
  return {
    key: `structure:${biomeId}:${id}:${era}`,
    frames: () => Array.from({ length: STAGE_FRAMES }, (_, frame) => structureView(biomeId, id, era, frame)).filter((pixels): pixels is Pixels => pixels !== null),
    fps: 2.2
  };
}

/** A still of a scene (map and landing cards): a biome in an era, or a place; `darkNight` keeps the Kingdom's backgrounds. */
export function sceneSource(sceneId: string, era = 0, darkNight = false): PixelSource {
  return { key: `scene:${sceneId}:${era}:${darkNight}`, frames: () => [flattenScene(sceneSheet(sceneId, era, { darkNight }).scene)] };
}
