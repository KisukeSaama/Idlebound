"use client";

import { CUTSCENE_BY_ID, gameText, type CutsceneId, type CutsceneShot } from "@idlebound/game";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { audio } from "../audio";
import { useGame } from "../context";
import { Atmosphere } from "../pixel/atmosphere";
import { CUTSCENE_HEIGHT, CUTSCENE_WIDTH, LETTERBOX, dissolve, drawPose, inkFrame, letterbox, poseKey, shotAir, shotPose } from "../pixel/cutscene";
import { FADE_STEPS, toRgba, type Pixels } from "../pixel/pixels";
import { pageRect, pixelRatio, prefersReducedMotion, whenIdle } from "../pixel/surface";
import { coverScene } from "./SceneCanvas";

/** One eighth of a shot giving way to the next, in ms: 0.64 s in all. */
const DISSOLVE_STEP_MS = 80;
const DISSOLVE_MS = DISSOLVE_STEP_MS * FADE_STEPS;
/** The cinema's frame comes in and goes out a row of the picture at a time. */
const LETTERBOX_STEP_MS = 45;
/** A line comes up a word at a time: the delay between two words, and the last word's own fade. */
const WORD_MS = 70;
const WORD_FADE_MS = 360;

/** What the words under the picture show: the shot, its line (and who says it), its title. */
interface Telling {
  shot: number;
  line: number | null;
  voice: string | null;
  title: boolean;
  /** The line shows whole at once (a press while it came up, or reduced motion). */
  whole: boolean;
}

/** The line a shot has come to at `t` seconds, and who says it. */
function lineAt(shot: CutsceneShot, t: number): { line: number; voice: string | null } | null {
  let found: { line: number; voice: string | null } | null = null;
  for (const beat of shot.beats ?? []) if ("line" in beat && beat.at <= t) found = { line: beat.line, voice: beat.voice ?? null };
  return found;
}

const titledAt = (shot: CutsceneShot, t: number) => (shot.beats ?? []).some((beat) => "title" in beat && beat.at <= t);

/**
 * One of the Ledger's scenes (BIBLE 12.10), over everything, like a film: shots of the world
 * drawn on the scene's own grid at a whole scale inside a cinema's frame of night ink, the
 * camera moving, the lines coming up a word at a time under the picture, a low drone beneath.
 * The game goes on, quieter. A press shows a line whole, then moves to the next line or shot;
 * Escape or "Skip" ends it. With reduced motion every shot is a single still picture, the
 * shots fade into each other and the lines come up whole.
 */
export function Cutscene({ id, onDone }: { id: CutsceneId; onDone: () => void }) {
  const { state } = useGame();
  const { t, locale } = useI18n();
  const cutscene = CUTSCENE_BY_ID[id];
  const content = gameText(locale);
  const text = content.cutscenes[id];
  const lines = text.lines;
  const m = t.night.cutscene;
  const reduced = state.settings.reducedMotion || prefersReducedMotion();
  const [telling, setTelling] = useState<Telling>({ shot: 0, line: null, voice: null, title: false, whole: reduced });
  const [closing, setClosing] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const airCanvas = useRef<HTMLCanvasElement>(null);
  /** The air over the picture, as over the arena: halos of its lights, the vignette. */
  const air = useRef<Atmosphere | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const forward = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  /**
   * The scene's clock: the shot, when it came in (moved back when a press jumps ahead), the
   * beats it has played, when the line came up, and the last whole picture of the shot before.
   */
  const clock = useRef({ shot: 0, at: 0, opened: 0, closing: 0, played: new Set<number>(), lineAt: 0, from: null as Pixels | null, last: null as Pixels | null, drawn: "" });
  const tellingRef = useRef(telling);
  tellingRef.current = telling;

  const goTo = useCallback(
    (shot: number) => {
      const c = clock.current;
      c.from = c.last;
      c.at = performance.now();
      c.played = new Set();
      if (shot < cutscene.shots.length) {
        c.shot = shot;
        // With reduced motion the shots fade into each other instead of dissolving.
        if (reduced) canvas.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
      } else {
        c.closing = c.at;
        setClosing(true);
      }
    },
    [cutscene.shots.length, reduced]
  );

  const next = useCallback(() => {
    const c = clock.current;
    const now = performance.now();
    // A press during a dissolve would skip a line unread.
    if (c.closing || now - c.at < DISSOLVE_MS) return;
    const told = tellingRef.current;
    // A line still coming up shows whole first.
    if (told.line !== null && !told.whole) {
      const words = (lines[told.line] ?? "").split(" ").length;
      if (now - c.lineAt < words * WORD_MS + WORD_FADE_MS) {
        setTelling({ ...told, whole: true });
        return;
      }
    }
    // Then the shot's next line, the sounds on the way passed over in silence (the music they
    // pass still begins); then the next shot.
    const shot = cutscene.shots[c.shot];
    const elapsed = (now - c.at) / 1000;
    const ahead = (shot.beats ?? []).find((beat) => "line" in beat && beat.at > elapsed + 0.05);
    if (ahead) {
      c.at = now - ahead.at * 1000;
      (shot.beats ?? []).forEach((beat, index) => {
        if (beat.at >= ahead.at || c.played.has(index)) return;
        c.played.add(index);
        if ("music" in beat) audio.music(beat.music);
      });
    } else goTo(c.shot + 1);
  }, [cutscene.shots, goTo, lines]);

  // The scene covers the arena, which slows down and goes quiet beneath; the focus comes back where it was.
  useEffect(() => {
    const uncover = coverScene();
    audio.setScene(true);
    const previous = document.activeElement as HTMLElement | null;
    skip.current?.focus({ preventScroll: true });
    return () => {
      uncover();
      audio.setScene(false);
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

  // The first moments of every shot are drawn while the browser idles.
  useEffect(() => {
    const cancels = cutscene.shots.map((shot) => whenIdle(() => void drawPose(shot, shotPose(shot, 0, reduced))));
    return () => cancels.forEach((cancel) => cancel());
  }, [cutscene, reduced]);

  // The canvas at the largest whole scale of device pixels its box holds.
  useEffect(() => {
    const box = stage.current;
    const element = canvas.current;
    if (!box || !element) return;
    const atmosphere = airCanvas.current ? new Atmosphere(airCanvas.current, element) : null;
    air.current = atmosphere;
    if (atmosphere) {
      atmosphere.still = reduced;
      atmosphere.start();
    }
    const fit = () => {
      const rect = pageRect(box);
      const ratio = pixelRatio();
      const scale = Math.max(1, Math.floor(Math.min((rect.width * ratio) / CUTSCENE_WIDTH, (rect.height * ratio) / CUTSCENE_HEIGHT)));
      element.style.width = `${(CUTSCENE_WIDTH * scale) / ratio}px`;
      element.style.height = `${(CUTSCENE_HEIGHT * scale) / ratio}px`;
      atmosphere?.setFrame({ scale, width: CUTSCENE_WIDTH, height: CUTSCENE_HEIGHT, top: 0, origin: 0 }, element.style.width, element.style.height);
    };
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    fit();
    return () => {
      observer.disconnect();
      atmosphere?.stop();
      air.current = null;
    };
  }, [reduced]);

  // The clock: each frame plays the beats come due, moves the words on, moves to the next
  // shot when this one has held, and redraws the picture only when it changes.
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const c = clock.current;
    c.opened = c.at = performance.now();
    c.from = inkFrame();
    let raf = 0;
    const frame = (now: number) => {
      if (c.closing) {
        const step = reduced ? FADE_STEPS : Math.min(FADE_STEPS, Math.floor((now - c.closing) / DISSOLVE_STEP_MS));
        const bars = reduced ? 0 : Math.max(0, LETTERBOX - Math.floor((now - c.closing) / LETTERBOX_STEP_MS));
        const key = `closing:${step}:${bars}`;
        if (key !== c.drawn && c.from) {
          c.drawn = key;
          air.current?.setScene(null);
          paint(context, letterbox(dissolve(c.from, inkFrame(), step), bars));
        }
        if (now - c.closing >= (reduced ? 0 : DISSOLVE_MS)) {
          doneRef.current();
          return;
        }
        raf = requestAnimationFrame(frame);
        return;
      }
      const shot = cutscene.shots[c.shot];
      const elapsed = Math.max(0, (now - c.at) / 1000);
      if (elapsed >= shot.seconds) {
        goTo(c.shot + 1);
        raf = requestAnimationFrame(frame);
        return;
      }
      (shot.beats ?? []).forEach((beat, index) => {
        if (beat.at > elapsed || c.played.has(index)) return;
        c.played.add(index);
        if ("sound" in beat) audio.cue(beat.sound);
        else if ("music" in beat) audio.music(beat.music);
      });
      const said = lineAt(shot, elapsed);
      const title = titledAt(shot, elapsed);
      const told = tellingRef.current;
      if (told.shot !== c.shot || told.line !== (said?.line ?? null) || told.title !== title) {
        if (said && said.line !== told.line) c.lineAt = now;
        const telling = { shot: c.shot, line: said?.line ?? null, voice: said?.voice ?? null, title, whole: reduced };
        tellingRef.current = telling;
        setTelling(telling);
      }
      const pose = shotPose(shot, elapsed, reduced);
      // A cut comes in at once; every other shot by eighths of its pixels.
      const step = reduced || (shot.cut && c.shot > 0) ? FADE_STEPS : Math.min(FADE_STEPS, Math.floor((now - c.at) / DISSOLVE_STEP_MS));
      const bars = reduced ? LETTERBOX : Math.min(LETTERBOX, Math.floor((now - c.opened) / LETTERBOX_STEP_MS));
      const key = `${c.shot}:${step}:${bars}:${poseKey(pose)}`;
      if (key !== c.drawn) {
        c.drawn = key;
        const whole = drawPose(shot, pose);
        c.last = whole;
        // The set's ground moves with the camera: its water with it.
        air.current?.setView(0, -pose.cam);
        air.current?.setScene(shotAir(shot, whole, pose.cam));
        paint(context, letterbox(c.from && step < FADE_STEPS ? dissolve(c.from, whole, step) : whole, bars));
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [cutscene, goTo, reduced]);

  const words = closing || telling.line === null ? "" : (lines[telling.line] ?? "");
  const voice = telling.voice === "king" ? content.speakers.king : telling.voice ? content.heroes[telling.voice]?.name : null;

  return (
    <div className={`cutscene${closing ? " is-closing" : ""}${reduced ? " is-still" : ""}`} role="dialog" aria-modal="true" aria-label={text.name}>
      <div ref={stage} className="cutscene-stage" onPointerDown={(event) => { if (event.button === 0) next(); }}>
        <div className="cutscene-frame">
          <canvas ref={canvas} className="cutscene-canvas" width={CUTSCENE_WIDTH} height={CUTSCENE_HEIGHT} aria-hidden="true" />
          <canvas ref={airCanvas} className="cutscene-air" aria-hidden="true" />
          {telling.title && !closing ? <p className="cutscene-title">{text.name}</p> : null}
        </div>
      </div>
      <div className="cutscene-words" aria-live="polite">
        {words ? (
          <p key={`${telling.shot}:${telling.line}`} className={`cutscene-line${telling.whole ? " is-whole" : ""}`}>
            {voice ? <span className="cutscene-voice">{voice}</span> : null}
            <span className="visually-hidden">{words}</span>
            <span aria-hidden="true">
              {words.split(" ").map((word, index) => (
                <span key={index} className="cutscene-word" style={{ animationDelay: `${index * WORD_MS}ms` }}>
                  {word}{" "}
                </span>
              ))}
            </span>
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

function paint(context: CanvasRenderingContext2D, pixels: Pixels) {
  const bitmap = toRgba(pixels);
  context.putImageData(new ImageData(bitmap.data, bitmap.w, bitmap.h), 0, 0);
}
