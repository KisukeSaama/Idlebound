"use client";

import { useEffect, useState } from "react";

/** How far down, in pixels, the page must be before the way back up is offered. */
const SHOW_AFTER = 600;

/**
 * Scroll state of the public pages. Once the page leaves its top, the fixed nav takes its solid
 * background (the landing's hero runs under a clear nav) and a button brings the reader back up.
 * The page's own smooth scrolling (or its absence, under reduced motion) carries the way back.
 */
export function SiteScroll({ label }: { label: string }) {
  const [far, setFar] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const y = window.scrollY;
      root.toggleAttribute("data-scrolled", y > 8);
      setFar(y > SHOW_AFTER);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      root.removeAttribute("data-scrolled");
    };
  }, []);

  return (
    <button type="button" className="scroll-top" data-visible={far || undefined} aria-label={label} title={label} tabIndex={far ? 0 : -1} aria-hidden={!far} onClick={() => window.scrollTo({ top: 0 })}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 10l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" /></svg>
    </button>
  );
}
