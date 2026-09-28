"use client";

/**
 * World art described by plain data, so server components (the landing page, the 404) can
 * place pixel sprites: the client generates them.
 */
import type { AltarId, CaravanWareId, ItemSlot, MarketOfferId, Rarity, SkillId } from "@idlebound/game";
import type { CSSProperties } from "react";
import { PixelSprite, type PixelSource } from "./PixelSprite";
import {
  altarIconSource,
  caravanIconSource,
  creatureSource,
  crystalSource,
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
import type { PlaceId } from "./scene";
import type { Depth } from "./stage";

export type ArtSpec =
  | { kind: "creature"; id: string; era?: number; animated?: boolean }
  | { kind: "scene"; biome: string; era?: number; darkNight?: boolean }
  /** A place of the story in motion, a wide banner: fills its parent at a whole scale unless a size is given. */
  | { kind: "place"; id: PlaceId }
  | { kind: "stage"; biome: string; era?: number; guardian?: boolean; width?: number; darkNight?: boolean }
  | { kind: "depth"; biome: string; era?: number; depth: Depth }
  | { kind: "structure"; biome: string; id: string; era?: number }
  | { kind: "portrait"; hero: string }
  | { kind: "emblem"; hero: string }
  | { kind: "relic"; slot: ItemSlot; base: number; rarity: Rarity; forge?: number; named?: string }
  | { kind: "altar"; id: AltarId }
  | { kind: "power"; id: SkillId }
  | { kind: "market"; id: MarketOfferId }
  | { kind: "ware"; id: CaravanWareId }
  | { kind: "crystal" };

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
      return depthSource(spec.biome, spec.era ?? 0, spec.depth);
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
  }
}

export function Art({ spec, size, scale, cover, className, style, label }: { spec: ArtSpec; size?: number | "parent"; scale?: number; cover?: boolean; className?: string; style?: CSSProperties; label?: string }) {
  const fit = size ?? (spec.kind === "place" && scale === undefined ? "parent" : undefined);
  return <PixelSprite source={artSource(spec)} size={fit} scale={scale} cover={cover} className={className} style={style} label={label} />;
}
