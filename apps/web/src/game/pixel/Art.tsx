"use client";

/**
 * World art described by plain data, so server components (the landing page, the 404) can
 * place pixel sprites: the client generates them. The generator and every recipe (more than
 * a megabyte) load on demand, the first time a page draws art (see `artSource.ts`): a page
 * that draws none never downloads them, and none waits for them before it runs.
 */
import type { AltarId, CaravanWareId, ItemSlot, MarketOfferId, Rarity, SkillId } from "@idlebound/game";
import { useEffect, useState, type CSSProperties } from "react";
import { PixelSprite } from "./PixelSprite";
import type { PlaceId } from "./scene";
import type { Depth } from "./stage";

export type ArtSpec =
  | { kind: "creature"; id: string; era?: number; animated?: boolean }
  | { kind: "scene"; biome: string; era?: number; darkNight?: boolean }
  /** A place of the story in motion, a wide banner: fills its parent at a whole scale unless a size is given. */
  | { kind: "place"; id: PlaceId }
  | { kind: "stage"; biome: string; era?: number; guardian?: boolean; width?: number; darkNight?: boolean }
  /** The planes of one depth; `width` widens the view (in art pixels) around the scene. */
  | { kind: "depth"; biome: string; era?: number; depth: Depth; width?: number }
  | { kind: "structure"; biome: string; id: string; era?: number }
  | { kind: "portrait"; hero: string }
  | { kind: "emblem"; hero: string }
  | { kind: "relic"; slot: ItemSlot; base: number; rarity: Rarity; forge?: number; named?: string }
  | { kind: "altar"; id: AltarId }
  | { kind: "power"; id: SkillId }
  | { kind: "market"; id: MarketOfferId }
  | { kind: "ware"; id: CaravanWareId }
  | { kind: "crystal" }
  | { kind: "satchel" };

/** The generator once loaded, shared by every sprite of the page. */
let generator: typeof import("./artSource") | null = null;
let loading: Promise<typeof import("./artSource")> | null = null;

export function loadGenerator() {
  loading ??= import("./artSource").then((module) => (generator = module));
  return loading;
}

export function Art({ spec, size, scale, cover, className, style, label }: { spec: ArtSpec; size?: number | "parent"; scale?: number; cover?: boolean; className?: string; style?: CSSProperties; label?: string }) {
  const [ready, setReady] = useState(generator);
  useEffect(() => {
    if (ready) return;
    let live = true;
    void loadGenerator().then((module) => {
      if (live) setReady(module);
    });
    return () => {
      live = false;
    };
  }, [ready]);
  const fit = size ?? (spec.kind === "place" && scale === undefined ? "parent" : undefined);
  // Until the generator is here, the same empty canvas PixelSprite starts from: nothing moves.
  if (!ready) return <canvas width={0} height={0} className={className ? `pixel-sprite ${className}` : "pixel-sprite"} style={style} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
  return <PixelSprite source={ready.artSource(spec)} size={fit} scale={scale} cover={cover} className={className} style={style} label={label} />;
}
