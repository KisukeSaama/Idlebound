"use client";

import { CUTSCENE_BY_ID, gameText, type CutsceneId } from "@idlebound/game";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { audio } from "../audio";
import { useGame } from "../context";
import { CUTSCENE_HEIGHT, CUTSCENE_WIDTH, FALL_STEPS, dissolve, inkFrame, shotFrame, shotMotion } from "../pixel/cutscene";
import { FADE_STEPS, toRgba, type Pixels } from "../pixel/pixels";
import { pageRect, pixelRatio, prefersReducedMotion, whenIdle } from "../pixel/surface";
import { coverScene } from "./SceneCanvas";

/** One eighth of a shot giving way to the next, in ms: 0.64 s in all. */
const DISSOLVE_STEP_MS = 80;
const DISSOLVE_MS = DISSOLVE_STEP_MS * FADE_STEPS;
/** A falling guardian waits this long once its shot is in, then goes step by step. */
const FALL_DELAY_MS = 300;
const FALL_STEP_MS = 190;

/**
 * One of the Ledger's scenes (BIBLE 12.10), over everything: a few shots of the world drawn
 * on the scene's own grid at a whole scale, one line under each. The game goes on beneath.
 * A press moves on to the next shot, Escape or "Skip" ends it; with reduced motion every
 * shot holds its first frame and the shots fade into each other.
 */
export function Cutscene({ id, onDone }: { id: CutsceneId; onDone: () => void }) {
  const { state } = useGame();
  const { t, locale } = useI18n();
  const cutscene = CUTSCENE_BY_ID[id];
  const content = gameText(locale);
  const text = content.cutscenes[id];
  const m = t.night.cutscene;
  const reduced = state.settings.reducedMotion || prefersReducedMotion();
  const [shot, setShot] = useState(0);
  const [closing, setClosing] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const forward = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  /** When the current shot came in, and the last whole frame of the one before it. */
  const timeline = useRef({ at: 0, from: null as Pixels | null, last: null as Pixels | null, drawn: "" });

  const next = useCallback(() => {
    // A press during the dissolve would skip a line unread.
    if (performance.now() - timeline.current.at < DISSOLVE_MS) return;
    if (shot + 1 < cutscene.shots.length) setShot(shot + 1);
    else setClosing(true);
  }, [shot, cutscene.shots.length]);

  // The scene covers the arena, which slows down beneath; the focus comes back where it was.
  useEffect(() => {
    const uncover = coverScene();
    const previous = document.activeElement as HTMLElement | null;
    skip.current?.focus({ preventScroll: true });
    return () => {
      uncover();
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  // Keys go to the scene first: no window beneath it and no power hears them. A focused
  // button keeps its own Enter and Space; Tab goes from one button to the other.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      event.stopPropagation();
      const onButton = document.activeElement === skip.current || document.activeElement === forward.current;
      if (event.key === "Escape") doneRef.current();
      else if (event.key === "Tab") (document.activeElement === forward.current ? skip : forward).current?.focus({ preventScroll: true });
      else if ((event.key === "Enter" || event.key === " ") && !onButton) {
        if (!event.repeat) next();
      } else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [next]);

  // The shots to come are drawn while the browser idles.
  useEffect(() => {
    const cancels = cutscene.shots.map((entry) => whenIdle(() => void shotFrame(entry.view, 0)));
    return () => cancels.forEach((cancel) => cancel());
  }, [cutscene]);

  // A shot opens: its sound, and the time the next one comes by itself.
  useEffect(() => {
    if (closing) return;
    const entry = cutscene.shots[shot];
    const line = timeline.current;
    line.from = line.last ?? inkFrame();
    line.at = performance.now();
    if (entry.sound) audio.play(entry.sound);
    // With reduced motion the shots fade into each other instead of dissolving.
    if (reduced) canvas.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
    const timer = setTimeout(() => {
      if (shot + 1 < cutscene.shots.length) setShot(shot + 1);
      else setClosing(true);
    }, entry.seconds * 1000);
    return () => clearTimeout(timer);
  }, [shot, closing, cutscene, reduced]);

  // The last shot goes back to the night ink, then the scene lets go.
  useEffect(() => {
    if (!closing) return;
    const line = timeline.current;
    line.from = line.last;
    line.at = performance.now();
    const timer = setTimeout(() => doneRef.current(), reduced ? 0 : DISSOLVE_MS);
    return () => clearTimeout(timer);
  }, [closing, reduced]);

  // The canvas at the largest whole scale of device pixels its box holds.
  useEffect(() => {
    const box = stage.current;
    const element = canvas.current;
    if (!box || !element) return;
    const fit = () => {
      const rect = pageRect(box);
      const ratio = pixelRatio();
      const scale = Math.max(1, Math.floor(Math.min((rect.width * ratio) / CUTSCENE_WIDTH, (rect.height * ratio) / CUTSCENE_HEIGHT)));
      element.style.width = `${(CUTSCENE_WIDTH * scale) / ratio}px`;
      element.style.height = `${(CUTSCENE_HEIGHT * scale) / ratio}px`;
    };
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    fit();
    return () => observer.disconnect();
  }, []);

  // The picture: redrawn only when the shot's frame, its fall or its dissolve moves on.
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const view = cutscene.shots[shot].view;
    const motion = shotMotion(view);
    let raf = 0;
    const draw = (now: number) => {
      const line = timeline.current;
      // A frame stamped just before the shot came in counts as its first.
      const elapsed = Math.max(0, now - line.at);
      const step = reduced ? FADE_STEPS : Math.min(FADE_STEPS, Math.floor(elapsed / DISSOLVE_STEP_MS));
      const frame = reduced ? 0 : Math.floor((elapsed / 1000) * motion.fps) % motion.frames;
      const fall = reduced ? FALL_STEPS : Math.max(0, Math.min(FALL_STEPS, Math.floor((elapsed - DISSOLVE_MS - FALL_DELAY_MS) / FALL_STEP_MS)));
      const key = `${shot}:${closing}:${frame}:${fall}:${step}`;
      if (key !== line.drawn) {
        line.drawn = key;
        const whole = closing ? inkFrame() : shotFrame(view, frame, fall);
        const from = line.from;
        const pixels = from && step < FADE_STEPS ? dissolve(from, whole, step) : whole;
        if (!closing) line.last = whole;
        const bitmap = toRgba(pixels);
        context.putImageData(new ImageData(bitmap.data, bitmap.w, bitmap.h), 0, 0);
      }
      if (!reduced || step < FADE_STEPS) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [shot, closing, reduced, cutscene]);

  const entry = cutscene.shots[shot];
  const words = closing ? "" : text.lines[shot] ?? "";
  const voice = entry.voice === "king" ? content.speakers.king : entry.voice ? content.heroes[entry.voice]?.name : null;

  return (
    <div className={`cutscene${closing ? " is-closing" : ""}${reduced ? " is-still" : ""}`} role="dialog" aria-modal="true" aria-label={text.name}>
      <div ref={stage} className="cutscene-stage" onPointerDown={(event) => { if (event.button === 0) next(); }}>
        <canvas ref={canvas} className="cutscene-canvas" width={CUTSCENE_WIDTH} height={CUTSCENE_HEIGHT} aria-hidden="true" />
      </div>
      <div className="cutscene-words" aria-live="polite">
        {words ? (
          <p key={shot} className="cutscene-line">
            {voice ? <span className="cutscene-voice">{voice}</span> : null}
            {words}
          </p>
        ) : null}
      </div>
      <div className="cutscene-controls">
        <button ref={forward} type="button" className="btn btn-ghost btn-sm" onClick={next}>{m.next}</button>
        <button ref={skip} type="button" className="btn btn-ghost btn-sm" onClick={() => doneRef.current()}>{m.skip}</button>
      </div>
    </div>
  );
}
