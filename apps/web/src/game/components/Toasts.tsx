"use client";

import { useEffect, useRef } from "react";
import type { ToastInput } from "../context";
import { Picto } from "../icons";

export interface Toast extends ToastInput {
  id: number;
}

/** Space between the scene's top bar (stages, active effects) and the first toast. */
const GAP = 8;

export function Toasts({ toasts }: { toasts: Toast[] }) {
  const root = useRef<HTMLDivElement>(null);
  const reposition = useRef<() => void>(() => {});

  // Toasts sit right under the scene's top bar, which grows with the active-effect chips and
  // moves when the page scrolls on mobile: its bottom edge is measured, never guessed, so a
  // toast never covers the stages or the chips. The CSS keeps a fallback position.
  useEffect(() => {
    let frame = 0;
    let observed: Element | null = null;
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
      const floor = (header?.getBoundingClientRect().bottom ?? 0) + GAP;
      container.style.setProperty("--toast-top", `${Math.max(floor, bar.getBoundingClientRect().bottom + GAP)}px`);
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(place);
    }
    place();
    reposition.current = schedule;
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, { capture: true });
    };
  }, []);

  // A toast can arrive before the scene is laid out: place it again then.
  useEffect(() => reposition.current(), [toasts]);

  return (
    <div ref={root} className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`} style={toast.color ? { ["--toast-color" as string]: toast.color } : undefined}>
          {toast.icon ? <Picto name={toast.icon} size={28} className="toast-icon" /> : null}
          <div>
            <div className="toast-title">{toast.title}</div>
            {toast.text ? <div className="toast-text">{toast.text}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
