"use client";

import { useId, useState, type CSSProperties } from "react";
import { useI18n } from "@/i18n/client";

/**
 * Before and after, one over the other: a handle slides between them. The handle is a range
 * input, so keys and screen readers move it too. Both pictures share one size and are drawn
 * with whole pixels.
 */
export function NewsCompare({ before, after, alt }: { before: string; after: string; alt: { before: string; after: string } }) {
  const { t } = useI18n();
  const w = t.news.compare;
  const [share, setShare] = useState(50);
  const id = useId();
  return (
    <div className="news-compare pixel-frame" style={{ "--share": `${share}%` } as CSSProperties}>
      <img className="news-compare-after" src={after} alt={alt.after} draggable={false} />
      <img className="news-compare-before" src={before} alt={alt.before} draggable={false} />
      <span className="news-compare-tag news-compare-tag-before" aria-hidden="true">{w.before}</span>
      <span className="news-compare-tag news-compare-tag-after" aria-hidden="true">{w.after}</span>
      <span className="news-compare-handle" aria-hidden="true" />
      <label className="visually-hidden" htmlFor={id}>{w.label}</label>
      <input id={id} className="news-compare-range" type="range" min={0} max={100} step={1} value={share} onChange={(event) => setShare(Number(event.target.value))} />
    </div>
  );
}
