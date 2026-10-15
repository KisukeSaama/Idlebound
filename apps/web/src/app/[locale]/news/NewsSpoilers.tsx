"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n/client";

/** Whether the article is read with every spoiler open. */
const SpoilersContext = createContext(false);

/**
 * An article that holds spoilers: a choice above it reads it without them (each one veiled,
 * to open one by one) or with them all. Without spoilers by default, on every visit; going
 * back to it veils again what was revealed.
 */
export function NewsSpoilers({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [all, setAll] = useState(false);
  const [veils, setVeils] = useState(0);
  const veil = () => {
    setAll(false);
    setVeils((count) => count + 1);
  };
  const w = t.news.spoilers;
  return (
    <SpoilersContext.Provider value={all}>
      <div className="news-spoiler-modes" role="group" aria-label={w.modesLabel}>
        <span className="news-spoiler-modes-label">{w.modesLabel}</span>
        <button type="button" className="btn btn-sm" aria-pressed={!all} onClick={veil}>{w.without}</button>
        <button type="button" className="btn btn-sm" aria-pressed={all} onClick={() => setAll(true)}>{w.with}</button>
      </div>
      <div key={veils}>{children}</div>
    </SpoilersContext.Provider>
  );
}

/**
 * A passage of the article that reveals what the road keeps for later. Veiled behind a warning
 * that names it, until the reader reveals it or reads the whole article with spoilers. The
 * words stay in the page for search engines, out of sight.
 */
export function NewsSpoiler({ label, children }: { label: string; children: ReactNode }) {
  const { t } = useI18n();
  const all = useContext(SpoilersContext);
  const [revealed, setRevealed] = useState(false);
  const w = t.news.spoilers;
  if (all || revealed) return <div className="news-spoiler news-spoiler-open">{children}</div>;
  return (
    <div className="news-spoiler">
      <div className="news-spoiler-veil">
        <svg className="news-spoiler-icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2 8c1.6-2.7 3.6-4 6-4s4.4 1.3 6 4c-1.6 2.7-3.6 4-6 4S3.6 10.7 2 8Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8" cy="8" r="1.8" fill="currentColor" />
          <path d="M2.5 13.5 13.5 2.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <p>
          <strong>{w.title}</strong>
          <span>{label}</span>
        </p>
        <button type="button" className="btn btn-sm" onClick={() => setRevealed(true)}>{w.reveal}</button>
      </div>
      <div hidden>{children}</div>
    </div>
  );
}
