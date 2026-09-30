"use client";

import { useEffect, useRef } from "react";
import type { ToastInput } from "../context";
import { Picto } from "../icons";
import { pageRect } from "../pixel/surface";
import { monsterOnPage } from "./SceneCanvas";

export interface Toast extends ToastInput {
  id: number;
}

/** Space between the scene's top bar (stages, active effects) and the first toast. */
const GAP = 8;

/** A toast stack narrower than this does not fit beside the creature: it goes above it. */
const MIN_SIDE = 250;
const MAX_WIDTH = 360;

/** Portrait phones: the scene on top, the companions' list under it (the same test as the CSS). */
export const PHONE_QUERY = "(max-width: 900px) and (min-height: 561px), (max-width: 599px)";

/**
 * Toasts never cover anything the hand needs: they dock in the free space of the scene, between
 * the top bar (or a line of the Chronicle, or a tutorial hint) and the monster's panel. On a desktop layout they stand beside
 * the creature (the wider side) or in the sky above it; on a portrait phone, across the scene,
 * never over the companions' list and its buttons. The toasts that do not fit wait hidden until
 * the others leave.
 * Short landscape screens keep the CSS placement.
 */
interface Room {
  start: number;
  left: number;
  width: number;
  limit: number;
  spot: Spot;
}

/** Where the stack stands relative to the creature. */
type Spot = "left" | "right" | "above";

let desktopQuery: MediaQueryList | null = null;
let phoneQuery: MediaQueryList | null = null;

/** The box of the first element matching `selector`, in page CSS pixels (the toasts' own). */
function pageRectOf(selector: string): DOMRect | undefined {
  const element = document.querySelector(selector);
  return element ? pageRect(element) : undefined;
}

/**
 * Where the stack docks, only measured (reads, no write); null on short landscape screens.
 * The creature stands near the middle, so both sides are often about as wide: the spot the
 * shown toasts already hold is kept while it still fits, or they would hop from side to side
 * with every new creature.
 */
function measureRoom(top: number, held: Spot | null): Room | null {
  const desktop = (desktopQuery ??= window.matchMedia("(min-width: 901px) and (min-height: 561px)")).matches;
  if (!desktop && !(phoneQuery ??= window.matchMedia(PHONE_QUERY)).matches) return null;
  const scene = pageRectOf(".scene");
  if (!scene) return null;
  const panel = pageRectOf(".monster-panel");
  if (!desktop) {
    // The scene is narrow: the stack spans it, over the creature rather than the list below.
    const width = scene.width - 2 * GAP;
    return { start: top, left: scene.left + GAP, width, limit: (panel?.top ?? scene.bottom) - GAP, spot: "above" };
  }
  const monster = monsterOnPage();
  const bottom = (panel?.top ?? scene.bottom) - GAP;
  let left = scene.right - GAP - MAX_WIDTH;
  let width = MAX_WIDTH;
  let limit = bottom;
  let spot: Spot = "right";
  if (monster) {
    const leftSpace = monster.left - scene.left - 2 * GAP;
    const rightSpace = scene.right - monster.right - 2 * GAP;
    if (held === "left" && leftSpace >= MIN_SIDE) spot = "left";
    else if (held === "right" && rightSpace >= MIN_SIDE) spot = "right";
    else if (held === "above" || Math.max(leftSpace, rightSpace) < MIN_SIDE) spot = "above";
    else spot = rightSpace >= leftSpace ? "right" : "left";
    if (spot !== "above") {
      width = Math.min(MAX_WIDTH, spot === "right" ? rightSpace : leftSpace);
      left = spot === "right" ? scene.right - GAP - width : scene.left + GAP;
    } else {
      // Not enough room beside it: the band of sky above its head, the scene's full width.
      width = Math.min(MAX_WIDTH * 1.4, scene.width - 2 * GAP);
      left = scene.left + (scene.width - width) / 2;
      limit = Math.min(bottom, monster.top - GAP);
    }
  }
  // A tutorial hint stays readable: where the stack would cross it, it starts under it.
  const hint = pageRectOf(".tutorial-hint.hint-arena");
  const start = hint && hint.height > 0 && hint.left < left + width && hint.right > left ? Math.max(top, hint.bottom + GAP) : top;
  return { start, left, width, limit, spot };
}

/** Places the stack in its room (short landscape: where the CSS puts it), then hides the toasts that do not fit. */
function dock(container: HTMLElement, top: number, room: Room | null) {
  const children = [...container.children] as HTMLElement[];
  container.style.setProperty("--toast-top", `${room ? room.start : top}px`);
  if (!room) {
    container.classList.remove("docked");
    for (const child of children) child.style.display = "";
    return;
  }
  container.classList.add("docked");
  container.style.setProperty("--toast-left", `${room.left}px`);
  container.style.setProperty("--toast-width", `${room.width}px`);
  // Only the toasts that fit are shown, the newest first; the others wait out of sight.
  // Their heights at the docked width are the one measure left after the writes.
  for (const child of children) child.style.display = "";
  const heights = children.map((child) => child.offsetHeight + GAP);
  let used = room.start;
  for (let index = children.length - 1; index >= 0; index -= 1) {
    const fits = used + heights[index] <= room.limit;
    children[index].style.display = fits ? "" : "none";
    if (fits) used += heights[index];
  }
}

export function Toasts({ toasts, held = false }: { toasts: Toast[]; held?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const reposition = useRef<() => void>(() => {});

  // Toasts sit right under the scene's top bar, which grows with the active-effect chips and
  // moves when the page scrolls on mobile: its bottom edge is measured, never guessed, so a
  // toast never covers the stages or the chips. The CSS keeps a fallback position.
  useEffect(() => {
    let frame = 0;
    let observed: Element | null = null;
    let spot: Spot | null = null;
    const observer = new ResizeObserver(() => schedule());
    const place = () => {
      frame = 0;
      const container = root.current;
      const bar = document.querySelector(".scene-top");
      const header = document.querySelector(".game-header");
      if (!container || !bar) return;
      // The scene may mount after the toasts (loading screen) or be replaced.
      if (bar !== observed) {
        if (observed) observer.unobserve(observed);
        observer.observe(bar);
        observed = bar;
      }
      // Every measure first, then the writes: one layout, not one per measure.
      const floor = (header ? pageRect(header).bottom : 0) + GAP;
      // A line of the Chronicle is told in a band under the bar: the stack starts under it (its
      // foot fades out, which is gap enough).
      const line = document.querySelector(".scene-line");
      const top = Math.max(floor, line ? pageRect(line).bottom : pageRect(bar).bottom + GAP);
      // An empty stack holds no spot: the next toast picks the widest side again.
      const room = measureRoom(top, container.childElementCount ? spot : null);
      spot = room?.spot ?? null;
      dock(container, top, room);
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(place);
    }
    place();
    reposition.current = schedule;
    // The creature changes with every kill: follow it while toasts are shown.
    const follow = setInterval(() => {
      if (root.current?.childElementCount) schedule();
    }, 250);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearInterval(follow);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, { capture: true });
    };
  }, []);

  // A toast can arrive before the scene is laid out: place it again then.
  useEffect(() => reposition.current(), [toasts]);

  return (
    <div ref={root} className={`toasts ${held ? "held" : ""}`} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`} style={toast.color ? { ["--toast-color" as string]: toast.color } : undefined}>
          {toast.icon ? <Picto name={toast.icon} size={28} className="toast-icon" /> : null}
          <div>
            <div className="toast-title">{toast.title}</div>
            {toast.text ? <div className="toast-text">{toast.text}</div> : null}
            {toast.quote ? (
              <figure className="toast-quote">
                <blockquote>{toast.quote.text}</blockquote>
                <figcaption>{toast.quote.by}</figcaption>
              </figure>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
