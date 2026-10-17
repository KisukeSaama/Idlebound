"use client";

import { RARITIES, type Item, type Rarity } from "@idlebound/game";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { audio } from "../audio";
import { useGame } from "../context";
import { haptics } from "../haptics";
import { OPENING_FPS, OPENING_HEIGHT, OPENING_WIDTH } from "../pixel/chest";
import { toRgba } from "../pixel/pixels";
import { OPEN, REVEAL, RISE, TUG, satchelFrame, warmSatchel, type SatchelMoment } from "../pixel/satchel";
import { pageRect, pixelRatio, prefersReducedMotion, whenIdle } from "../pixel/surface";
import { ItemCard } from "../windows/GearWindow";
import { PixelSprite } from "../pixel/PixelSprite";
import { relicSource } from "../pixel/sources";
import { coverScene } from "./SceneCanvas";

export interface SatchelOpeningRequest {
  /** The relics the satchel gave, the humblest first. */
  items: Item[];
  /** Relics left in it, the pack being full. */
  kept: number;
}

/** Where the opening stands: the satchel, then each relic by its index, then the whole haul. */
type Step =
  | { kind: "closed"; since: number }
  | { kind: "tug"; since: number }
  | { kind: "open"; since: number }
  | { kind: "relic"; index: number; since: number; revealedAt: number | null }
  | { kind: "summary" };

const rank = (rarity: Rarity) => RARITIES.indexOf(rarity);

/**
 * The company's satchel, opened over everything at the walker's return (`pixel/satchel.ts`):
 * it drops in, its light leaking under the flap; touched, it tugs and opens, and its relics
 * climb out one by one, the humblest first, each hidden until touched. Each shown relic gets
 * its card; "Reveal all" goes to the haul, the most precious first. Escape closes. With
 * reduced motion every picture is still and a touch reveals at once.
 */
export function SatchelOpening({ request, onDone }: { request: SatchelOpeningRequest; onDone: () => void }) {
  const { state } = useGame();
  const { t } = useI18n();
  const text = t.windows.satchel;
  const reduced = state.settings.reducedMotion || prefersReducedMotion();
  const items = request.items;
  const best = useMemo(() => items.reduce<Rarity>((top, item) => (rank(item.rarity) > rank(top) ? item.rarity : top), "common"), [items]);
  const [step, setStep] = useState<Step>(() => ({ kind: "closed", since: performance.now() }));
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => whenIdle(() => warmSatchel(items)), [items]);

  useEffect(() => {
    const uncover = coverScene();
    const previous = document.activeElement as HTMLElement | null;
    action.current?.focus({ preventScroll: true });
    return () => {
      uncover();
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  /** The walker's touch: open, reveal, or go on to the next relic. */
  const advance = useCallback(() => {
    const now = performance.now();
    const current = stepRef.current;
    if (current.kind === "closed") {
      audio.play("rattle", rank(best));
      setStep(reduced ? { kind: "relic", index: 0, since: now - RISE * 1000, revealedAt: null } : { kind: "tug", since: now });
      return;
    }
    if (current.kind === "tug" || current.kind === "open") return;
    if (current.kind === "relic") {
      const item = items[current.index];
      if (current.revealedAt === null) {
        if (now - current.since < RISE * 1000 && !reduced) return;
        audio.play("found", rank(item.rarity));
        haptics.pulse("loot");
        setStep({ ...current, revealedAt: reduced ? now - REVEAL[item.rarity] * 1000 : now });
        return;
      }
      if (now - current.revealedAt < REVEAL[item.rarity] * 1000) return;
      setStep(current.index + 1 < items.length ? { kind: "relic", index: current.index + 1, since: now, revealedAt: null } : { kind: "summary" });
    }
  }, [best, items, reduced]);

  // The tug runs into the opening, and the opening into the first relic.
  useEffect(() => {
    if (step.kind !== "tug" && step.kind !== "open") return;
    const wait = step.kind === "tug" ? TUG : OPEN;
    const timer = window.setTimeout(() => {
      const now = performance.now();
      if (step.kind === "tug") audio.play("unseal");
      setStep(step.kind === "tug" ? { kind: "open", since: now } : { kind: "relic", index: 0, since: now, revealedAt: null });
    }, wait * 1000);
    return () => window.clearTimeout(timer);
  }, [step]);

  // Keys go to the opening first: Enter or Space touches, Escape closes.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === "Escape") doneRef.current();
      else if ((event.key === "Enter" || event.key === " ") && stepRef.current.kind !== "summary" && document.activeElement === action.current) advance();
      else if (event.key !== "Tab") return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [advance]);

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
  }, [step.kind === "summary"]);

  // The picture, a new one each frame.
  useEffect(() => {
    if (step.kind === "summary") return;
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    let raf = 0;
    let drawn = "";
    const draw = (now: number) => {
      const seconds = (from: number) => Math.max(0, (now - from) / 1000);
      let moment: SatchelMoment;
      if (step.kind === "closed") moment = { phase: "drop", t: reduced ? 10 : seconds(step.since) };
      else if (step.kind === "tug") moment = { phase: "tug", t: seconds(step.since) };
      else if (step.kind === "open") moment = { phase: "open", t: seconds(step.since) };
      else moment = { phase: "relic", relic: items[step.index], rise: seconds(step.since), reveal: step.revealedAt === null ? -1 : seconds(step.revealedAt) };
      const frame = `${step.kind}:${"index" in step ? step.index : ""}:${Math.floor(("t" in moment ? moment.t : moment.rise + Math.max(0, moment.reveal) * 7) * OPENING_FPS)}`;
      if (frame !== drawn) {
        drawn = frame;
        const bitmap = toRgba(satchelFrame(best, moment, reduced));
        context.putImageData(new ImageData(bitmap.data, bitmap.w, bitmap.h), 0, 0);
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [step, items, best, reduced]);

  const current = step.kind === "relic" ? items[step.index] : null;
  const shown = step.kind === "relic" && step.revealedAt !== null;
  const hint = step.kind === "closed"
    ? text.touchOpen
    : step.kind === "relic" && step.revealedAt === null
      ? (current && rank(current.rarity) >= 3 ? text.touchShine : text.touchReveal)
      : null;
  const haul = useMemo(() => [...items].sort((a, b) => rank(b.rarity) - rank(a.rarity) || b.level - a.level), [items]);

  if (step.kind === "summary") {
    return (
      <div className="chest-opening satchel-summary is-revealed" role="dialog" aria-modal="true" aria-label={text.label}>
        <div className="satchel-haul" aria-live="polite">
          <p className="satchel-best">{text.best}</p>
          <ItemCard item={haul[0]} />
          {haul.length > 1 ? (
            <ul className="satchel-rest">
              {haul.slice(1).map((item) => (
                <li key={item.uid}>
                  <ItemCard item={item} />
                </li>
              ))}
            </ul>
          ) : null}
          {request.kept > 0 ? <p className="modal-hint">{text.kept(request.kept)}</p> : null}
        </div>
        <div className="chest-opening-controls">
          <button ref={action} type="button" className="btn btn-gold" onClick={() => doneRef.current()} autoFocus>{text.done}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`chest-opening${shown ? " is-revealed" : ""}`} role="dialog" aria-modal="true" aria-label={text.label}>
      <div ref={stage} className="chest-opening-stage" onPointerDown={(event) => { if (event.button === 0) advance(); }}>
        <canvas ref={canvas} className="chest-opening-canvas" width={OPENING_WIDTH} height={OPENING_HEIGHT} aria-hidden="true" />
      </div>
      <div className="chest-opening-reveal" aria-live="polite">
        {hint ? <p className="satchel-hint">{hint}</p> : null}
        {shown && current ? <ItemCard item={current} /> : null}
        {step.kind === "relic" ? (
          <ol className="satchel-thumbs" aria-label={text.count(step.index + 1, items.length)}>
            {items.map((item, index) => (
              <li key={item.uid} className={index < step.index || (index === step.index && shown) ? "seen" : ""}>
                {index < step.index || (index === step.index && shown) ? <PixelSprite source={relicSource(item)} size={32} /> : null}
              </li>
            ))}
          </ol>
        ) : null}
      </div>
      <div className="chest-opening-controls">
        <button ref={action} type="button" className={`btn ${shown ? "btn-gold" : "btn-ghost btn-sm"}`} onClick={advance}>
          {shown ? (step.kind === "relic" && step.index + 1 < items.length ? text.next : text.haul) : step.kind === "closed" ? text.touchOpen : text.touchReveal}
        </button>
        {step.kind !== "closed" ? <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep({ kind: "summary" })}>{text.revealAll}</button> : null}
      </div>
    </div>
  );
}
