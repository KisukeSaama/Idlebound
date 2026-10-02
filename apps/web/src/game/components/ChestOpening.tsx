"use client";

import { RARITIES, type Item } from "@idlebound/game";
import type { ChestId } from "@idlebound/game/art";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { audio } from "../audio";
import { useGame } from "../context";
import { haptics } from "../haptics";
import { OPENING_FPS, OPENING_HEIGHT, OPENING_WIDTH, openingFrame, openingTimes, reelPosition, warmOpening, type OpeningSpec } from "../pixel/chest";
import { toRgba } from "../pixel/pixels";
import { pageRect, pixelRatio, prefersReducedMotion, whenIdle } from "../pixel/surface";
import { ItemCard } from "../windows/GearWindow";
import { coverScene } from "./SceneCanvas";

export interface ChestOpeningRequest {
  chest: ChestId;
  item: Item;
}

/** The same relic always turns the same reel: its seed comes from its id. */
function seedOf(uid: string): number {
  let h = 0x811c9dc5;
  for (let index = 0; index < uid.length; index += 1) h = Math.imul(h ^ uid.charCodeAt(index), 0x01000193);
  return h >>> 0;
}

/**
 * A chest bought at the stall, opened over everything (`pixel/chest.ts`): it drops, knocks
 * once for each rarity it climbs, bursts open, and a reel of relics climbs out and slows
 * down onto the one it held; then the relic's card and "Take it". A press, Enter or Space during the opening goes straight to the relic;
 * Escape or "Take it" closes. With reduced motion the relic is there at once and fades in.
 */
export function ChestOpening({ request, onDone }: { request: ChestOpeningRequest; onDone: () => void }) {
  const { state } = useGame();
  const { t } = useI18n();
  const text = t.windows.market.opening;
  const reduced = state.settings.reducedMotion || prefersReducedMotion();
  const spec = useMemo<OpeningSpec>(() => ({ chest: request.chest, item: request.item, seed: seedOf(request.item.uid) }), [request]);
  const times = useMemo(() => openingTimes(spec), [spec]);
  const [revealed, setRevealed] = useState(reduced);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const take = useRef<HTMLButtonElement>(null);
  const skipButton = useRef<HTMLButtonElement>(null);
  /** When the opening started, moved back when the walker skips to the end. */
  const start = useRef(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  // The relic went straight on: its slot was empty.
  const worn = state.equipment[request.item.slot]?.uid === request.item.uid;

  const skip = useCallback(() => {
    if (revealed) return;
    start.current = performance.now() - times.reveal * 1000;
  }, [revealed, times.reveal]);

  // The opening covers the arena, which slows down beneath; the focus comes back where it was.
  useEffect(() => {
    const uncover = coverScene();
    const previous = document.activeElement as HTMLElement | null;
    skipButton.current?.focus({ preventScroll: true });
    return () => {
      uncover();
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (revealed) take.current?.focus({ preventScroll: true });
  }, [revealed]);

  // Keys go to the opening first: no window beneath it and no power hears them.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === "Escape") doneRef.current();
      else if ((event.key === "Enter" || event.key === " ") && !revealed) skip();
      // One button at a time: the focus stays on it.
      else if (event.key !== "Tab") return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [revealed, skip]);

  // The canvas at the largest whole scale of device pixels its box holds.
  useEffect(() => {
    const box = stage.current;
    const element = canvas.current;
    if (!box || !element) return;
    const fit = () => {
      const rect = pageRect(box);
      const ratio = pixelRatio();
      const scale = Math.max(1, Math.floor(Math.min((rect.width * ratio) / OPENING_WIDTH, (rect.height * ratio) / OPENING_HEIGHT)));
      element.style.width = `${(OPENING_WIDTH * scale) / ratio}px`;
      element.style.height = `${(OPENING_HEIGHT * scale) / ratio}px`;
    };
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    fit();
    return () => observer.disconnect();
  }, []);

  // The reel's relics are drawn while the chest falls and knocks.
  useEffect(() => whenIdle(() => warmOpening(spec)), [spec]);

  // The picture, a new one each frame of the opening; its knocks, its burst and its reel are heard as they come.
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const paint = (t: number, still: boolean) => {
      const bitmap = toRgba(openingFrame(spec, t, still));
      context.putImageData(new ImageData(bitmap.data, bitmap.w, bitmap.h), 0, 0);
    };
    const tier = RARITIES.indexOf(request.item.rarity);
    if (reduced) {
      paint(times.reveal, true);
      element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
      audio.play("found", tier);
      haptics.pulse("loot");
      return;
    }
    start.current = performance.now();
    let heard = -1;
    let drawn = -1;
    let passing = -1;
    let landed = false;
    let told = false;
    let raf = 0;
    const draw = (now: number) => {
      const t = Math.max(0, (now - start.current) / 1000);
      // A skip lands past every knock: only the burst is heard.
      const skipped = t >= times.reveal && heard < times.knockAt.length;
      times.knockAt.forEach((at, index) => {
        if (t < at || index <= heard) return;
        heard = index;
        if (!skipped) audio.play("rattle", RARITIES.indexOf(times.knocks[index]) - RARITIES.indexOf(times.knocks[0]));
      });
      if (t >= times.open && heard < times.knockAt.length) {
        heard = times.knockAt.length;
        if (!skipped) audio.play("unseal");
      }
      const position = reelPosition(spec, t);
      if (position !== passing) {
        if (passing >= 0 && !skipped && t < times.land) audio.play("tick");
        passing = position;
      }
      if (t >= times.land && !landed) {
        landed = true;
        audio.play("found", tier);
        haptics.pulse("loot");
      }
      if (t >= times.reveal && !told) {
        told = true;
        setRevealed(true);
      }
      const frame = Math.floor(t * OPENING_FPS);
      if (frame !== drawn) {
        drawn = frame;
        paint(t, false);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [spec, request.item.rarity, reduced, times]);

  return (
    <div className={`chest-opening${revealed ? " is-revealed" : ""}`} role="dialog" aria-modal="true" aria-label={text.label}>
      <div ref={stage} className="chest-opening-stage" onPointerDown={(event) => { if (event.button === 0) skip(); }}>
        <canvas ref={canvas} className="chest-opening-canvas" width={OPENING_WIDTH} height={OPENING_HEIGHT} aria-hidden="true" />
      </div>
      <div className="chest-opening-reveal" aria-live="polite">
        {revealed ? (
          <>
            <ItemCard item={request.item} />
            {worn ? <p className="chest-opening-worn">{text.worn}</p> : null}
          </>
        ) : null}
      </div>
      <div className="chest-opening-controls">
        {revealed ? (
          <button ref={take} type="button" className="btn btn-gold" onClick={() => doneRef.current()}>{text.take}</button>
        ) : (
          <button ref={skipButton} type="button" className="btn btn-ghost btn-sm" onClick={skip}>{text.skip}</button>
        )}
      </div>
    </div>
  );
}
