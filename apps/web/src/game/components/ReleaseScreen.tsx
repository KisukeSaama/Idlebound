"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import { UPDATE_MS, type ReleaseUpdate } from "../newRelease";
import { prefersReducedMotion } from "../pixel/surface";

/** Cells of the progress bar, lit one by one like an old patcher's. */
const CELLS = 20;
/** Where the old page leaves the bar when it goes; the new page fills the rest. */
const HANDED_OVER = 80;
const ARRIVAL_FILL_MS = 600;
const TICK_MS = 50;

/** The game's own setting or the system's: the bar jumps where it goes, the screen only fades. */
function stillMotion() {
  return document.documentElement.classList.contains("reduced-motion") || prefersReducedMotion();
}

/**
 * The bar's course over time: an ease-out with two short stalls, the way a download stops
 * for breath. Fixed, never random: every walker sees the same patch arrive.
 */
function course(t: number) {
  const stalled = t < 0.3 ? t : t < 0.38 ? 0.3 : t < 0.7 ? t - 0.08 : t < 0.76 ? 0.62 : t - 0.14;
  const x = Math.min(1, stalled / 0.86);
  return 1 - (1 - x) * (1 - x);
}

/** Percent of the bar, running from `from` to `to` over `ms`. */
function useProgress(from: number, to: number, ms: number) {
  const [percent, setPercent] = useState(from);
  useEffect(() => {
    if (stillMotion()) {
      setPercent(to);
      return;
    }
    const start = performance.now();
    const timer = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / ms);
      setPercent(Math.round(from + (to - from) * course(t)));
      if (t >= 1) clearInterval(timer);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [from, to, ms]);
  return percent;
}

/**
 * The game moves to a newer version: an update screen names it and fills its bar. The old
 * page shows it while everything played is put on the server, up to 80%; the new page picks
 * it up over its loading screen (same logo, same ground), fills it and fades it away. A
 * release that kept its version (too small to raise it) shows that version alone.
 */
export function ReleaseScreen({ update, arrived = false, leaving = false }: { update: ReleaseUpdate; arrived?: boolean; leaving?: boolean }) {
  const { t } = useI18n();
  const m = t.hud.releaseUpdate;
  const percent = useProgress(arrived ? HANDED_OVER : 0, arrived ? 100 : HANDED_OVER, arrived ? ARRIVAL_FILL_MS : UPDATE_MS - 200);
  const done = percent >= 100;
  const lit = Math.floor((percent / 100) * CELLS);
  return (
    <div
      className={`release-screen${arrived ? " release-screen--arrived" : ""}${leaving ? " release-screen--out" : ""}`}
      role="status"
    >
      <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
      <div className="release-panel">
        <p className="release-title">{m.title}</p>
        {update.to ? (
          <p className="release-versions">
            {update.from && update.from !== update.to ? (
              <>
                <span className="release-from">{update.from}</span>
                <svg className="release-arrow" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </>
            ) : null}
            <span className="release-to">{update.to}</span>
          </p>
        ) : null}
        <div className="release-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={m.title}>
          {Array.from({ length: CELLS }, (_, cell) => (
            <span key={cell} className={cell < lit ? "on" : undefined} />
          ))}
        </div>
        <p className="release-status">
          <span>{done ? m.ready(update.to) : arrived ? m.installing : m.keeping}</span>
          <span className="release-percent">{m.percent(percent)}</span>
        </p>
      </div>
    </div>
  );
}
