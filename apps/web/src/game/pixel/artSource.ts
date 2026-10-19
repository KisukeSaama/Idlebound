/**
 * What each kind of art spec draws: the generator and its recipes, loaded by `Art` on demand
 * (see Art.tsx), never in the first scripts of a page.
 */
import type { ArtSpec } from "./Art";
// The landing's King measures his feet with the same generator, once it is loaded.
export { renderCreature } from "./creature";
import type { PixelSource } from "./PixelSprite";
import {
  altarIconSource,
  caravanIconSource,
  creatureSource,
  crystalSource,
  satchelSource,
  emblemSource,
  marketIconSource,
  portraitSource,
  powerIconSource,
  relicSource,
  sceneSource,
  depthSource,
  placeSource,
  stageSource,
  structureSource
} from "./sources";

export function artSource(spec: ArtSpec): PixelSource {
  switch (spec.kind) {
    case "creature":
      return creatureSource(spec.id, spec.era ?? 0, spec.animated ?? true);
    case "scene":
      return sceneSource(spec.biome, spec.era ?? 0, spec.darkNight ?? false);
    case "place":
      return placeSource(spec.id);
    case "stage":
      return stageSource(spec.biome, spec.era ?? 0, spec.guardian ?? true, spec.width, spec.darkNight ?? false);
    case "depth":
      return depthSource(spec.biome, spec.era ?? 0, spec.depth, spec.width);
    case "structure":
      return structureSource(spec.biome, spec.id, spec.era ?? 0);
    case "portrait":
      return portraitSource(spec.hero);
    case "emblem":
      return emblemSource(spec.hero);
    case "relic":
      return relicSource({ slot: spec.slot, base: spec.base, rarity: spec.rarity, forge: spec.forge ?? 0, named: spec.named });
    case "altar":
      return altarIconSource(spec.id);
    case "power":
      return powerIconSource(spec.id);
    case "market":
      return marketIconSource(spec.id);
    case "ware":
      return caravanIconSource(spec.id);
    case "crystal":
      return crystalSource();
    case "satchel":
      return satchelSource();
  }
}
