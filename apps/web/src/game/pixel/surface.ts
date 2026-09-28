/**
 * Browser side of the generator: pixel buffers become canvases, kept in a small LRU cache
 * (64 sprites at most, BIBLE 18.9). Generation can be queued for idle time so the next
 * stage's monsters are ready before they are needed.
 */
import { toRgba, type Pixels } from "./pixels";

export type Surface = HTMLCanvasElement | OffscreenCanvas;

export function toSurface(pixels: Pixels): Surface {
  const bitmap = toRgba(pixels);
  const surface: Surface =
    typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(bitmap.w, bitmap.h) : Object.assign(document.createElement("canvas"), { width: bitmap.w, height: bitmap.h });
  const ctx = surface.getContext("2d") as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
  if (ctx) ctx.putImageData(new ImageData(bitmap.data, bitmap.w, bitmap.h), 0, 0);
  return surface;
}

export interface Lru {
  /** The cached value for `key`, made on the first call; least recently used out past the limit. */
  get<T>(key: string, make: () => T): T;
  has(key: string): boolean;
  readonly size: number;
}

export function lru(limit: number): Lru {
  const entries = new Map<string, unknown>();
  return {
    get<T>(key: string, make: () => T): T {
      if (entries.has(key)) {
        const hit = entries.get(key) as T;
        entries.delete(key);
        entries.set(key, hit);
        return hit;
      }
      const value = make();
      entries.set(key, value);
      while (entries.size > limit) entries.delete(entries.keys().next().value as string);
      return value;
    },
    has: (key) => entries.has(key),
    get size() {
      return entries.size;
    }
  };
}

/** Sprites of creatures, portraits, relics and icons: 64 at most (BIBLE 18.9). */
export const spriteCache = lru(64);
/** Whole scenes are larger: a handful is enough (the current biome and its neighbors). */
export const sceneCache = lru(6);

/** Runs `task` when the browser is idle (or soon, where idle callbacks do not exist). */
export function whenIdle(task: () => void): () => void {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(task, { timeout: 1500 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(task, 60);
  return () => clearTimeout(id);
}

/** Device pixel ratio, capped: beyond 3 nothing gets sharper, only heavier. */
export function deviceRatio(): number {
  return typeof window === "undefined" ? 1 : Math.min(3, window.devicePixelRatio || 1);
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
