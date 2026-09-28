"use client";

/**
 * A pixel-art sprite in the page: a canvas at the sprite's own resolution, scaled by a
 * whole number of device pixels (never blurred, never fractional). Animated sprites cycle
 * their frames on one shared clock; with reduced motion they hold their first frame.
 */
import { useEffect, useRef, type CSSProperties } from "react";
import type { Pixels } from "./pixels";
import { pageRect, pixelRatio, prefersReducedMotion, toSurface, whenIdle, type Surface } from "./surface";

export interface PixelSource {
  /** Identity of the art: the canvas redraws only when it changes. */
  key: string;
  frames: () => Pixels[];
  /** Frames per second when animated. */
  fps?: number;
}

type Ticker = (now: number) => void;
const tickers = new Set<Ticker>();
let clock = 0;

function subscribe(ticker: Ticker) {
  tickers.add(ticker);
  if (!clock) {
    const step = (now: number) => {
      for (const tick of tickers) tick(now);
      clock = tickers.size > 0 ? requestAnimationFrame(step) : 0;
    };
    clock = requestAnimationFrame(step);
  }
  return () => {
    tickers.delete(ticker);
  };
}

function reducedMotion(): boolean {
  return prefersReducedMotion() || (typeof document !== "undefined" && document.documentElement.classList.contains("reduced-motion"));
}

/**
 * `size` is the box the sprite must fit, in CSS pixels (its longest side), or `"parent"` to
 * fit the element it sits in (followed as it resizes). The sprite takes the largest whole
 * scale of device pixels that fits; `cover` takes the smallest whole scale that fills the
 * box instead (the container crops the edges); `nearest` takes the whole scale closest to
 * the box, cropping a little or leaving a thin margin (portraits: never half a face). `scale`
 * fixes the size instead.
 */
export function PixelSprite({
  source,
  size,
  scale: fixedScale,
  cover = false,
  nearest = false,
  className,
  style,
  label
}: {
  source: PixelSource;
  size?: number | "parent";
  /** CSS pixels per art pixel instead of a box (rounded to whole device pixels). */
  scale?: number;
  cover?: boolean;
  nearest?: boolean;
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { key } = source;
  const sourceRef = useRef(source);
  sourceRef.current = source;

  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx) return;
    let cleanup: (() => void) | null = null;
    // Generation waits for an idle moment: a page full of sprites never freezes the browser.
    const cancel = whenIdle(() => {
      const frames: Surface[] = sourceRef.current.frames().map(toSurface);
      const first = frames[0];
      element.width = first.width;
      element.height = first.height;
      const fit = () => {
        const ratio = pixelRatio();
        let fitScale: number;
        if (fixedScale) {
          fitScale = Math.round(fixedScale * ratio);
        } else if (size === "parent") {
          const parent = element.parentElement;
          const box = parent ? pageRect(parent) : null;
          if (!box || box.width === 0) return;
          const byWidth = (box.width * ratio) / first.width;
          const byHeight = (box.height * ratio) / first.height;
          fitScale = cover ? Math.max(byWidth, byHeight) : Math.min(byWidth, byHeight);
        } else {
          fitScale = ((size ?? first.width) * ratio) / Math.max(first.width, first.height);
        }
        const scale = Math.max(1, nearest ? Math.round(fitScale) : cover ? Math.ceil(fitScale) : Math.floor(fitScale));
        element.style.width = `${(first.width * scale) / ratio}px`;
        element.style.height = `${(first.height * scale) / ratio}px`;
      };
      fit();
      const observer = size === "parent" && element.parentElement ? new ResizeObserver(fit) : null;
      if (observer && element.parentElement) observer.observe(element.parentElement);
      let shown = -1;
      const show = (index: number) => {
        if (index === shown) return;
        shown = index;
        ctx.clearRect(0, 0, element.width, element.height);
        ctx.drawImage(frames[index], 0, 0);
      };
      show(0);
      const fps = sourceRef.current.fps ?? 0;
      const stop = frames.length < 2 || fps <= 0 || reducedMotion() ? null : subscribe((now) => show(Math.floor((now / 1000) * fps) % frames.length));
      cleanup = () => {
        observer?.disconnect();
        stop?.();
      };
    });
    return () => {
      cancel();
      cleanup?.();
    };
  }, [key, size, fixedScale, cover, nearest]);

  return <canvas ref={canvas} width={0} height={0} className={className ? `pixel-sprite ${className}` : "pixel-sprite"} style={style} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
