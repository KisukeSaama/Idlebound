"use client";

import { formatNumber } from "@idlebound/game";
import type { ReactNode } from "react";
import { useI18n } from "@/i18n/client";
import { gateProgress, type Gate } from "./gates";
import { useSpoilers } from "./SpoilerMode";

/** What the gate asks, in the walker's words, and how far their game stands from it. */
export function useGateText() {
  const { t } = useI18n();
  const { mode, game } = useSpoilers();
  const w = t.wiki.spoilers;
  return (gate: Gate): string => {
    const condition = w.conditions[gate.kind](gate as never);
    const progress = mode === "mine" && game ? gateProgress(game, gate) : null;
    return progress === null ? condition : `${condition} ${w.progress[gate.kind as keyof typeof w.progress]?.(formatNumber(progress)) ?? ""}`.trim();
  };
}

/**
 * A piece of the wiki that reveals what the walker may not have lived yet. Open when the mode
 * allows it (everything, or what the walker's game has lived); otherwise it waits behind a
 * warning that says what would reveal it in play, and a button to read it anyway. The words
 * stay in the page for search engines, out of sight.
 *
 * - `block`: a framed veil over a passage;
 * - `inline`: a short run (a name in a table) replaced by a bar;
 * - `fallback`: what to show in its place while veiled (a silhouette card);
 * - `passive`: the fallback alone, no button (a picture beside a veiled title).
 *
 * Revealing one piece reveals every piece behind the same gate on the page.
 */
export function Spoiler({ gate, children, inline = false, fallback, passive = false }: { gate: Gate; children: ReactNode; inline?: boolean; fallback?: ReactNode; passive?: boolean }) {
  const { t } = useI18n();
  const { open, mode, reveal } = useSpoilers();
  const describe = useGateText();
  const w = t.wiki.spoilers;
  const setRevealed = () => reveal(gate);

  if (open(gate)) return <>{children}</>;
  if (passive) return <>{fallback}<span hidden>{children}</span></>;

  const condition = describe(gate);
  const heading = mode === "mine" ? w.notYet : w.title;

  if (inline) {
    return (
      <span className="spoiler-inline">
        <button type="button" onClick={setRevealed} title={w.label(heading, condition)} aria-label={w.label(heading, condition)}>
          <span aria-hidden="true">{w.inlineMask}</span>
        </button>
        <span hidden>{children}</span>
      </span>
    );
  }

  if (fallback) {
    return (
      <div className="spoiler-card">
        <button type="button" onClick={setRevealed} aria-label={w.label(heading, condition)} title={w.label(heading, condition)}>
          {fallback}
        </button>
        <div hidden>{children}</div>
      </div>
    );
  }

  return (
    <div className="spoiler">
      <div className="spoiler-veil">
        <svg className="spoiler-icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2 8c1.6-2.7 3.6-4 6-4s4.4 1.3 6 4c-1.6 2.7-3.6 4-6 4S3.6 10.7 2 8Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8" cy="8" r="1.8" fill="currentColor" />
          <path d="M2.5 13.5 13.5 2.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <p>
          <strong>{heading}</strong>
          <span>{condition}</span>
        </p>
        <button type="button" className="btn btn-sm" onClick={setRevealed}>{w.reveal}</button>
      </div>
      <div hidden>{children}</div>
    </div>
  );
}

/** A table row that reveals what the walker may not have lived yet: veiled, one cell says so across the row. */
export function SpoilerRow({ gate, columns, children }: { gate: Gate; columns: number; children: ReactNode }) {
  const { t } = useI18n();
  const { open, mode, reveal } = useSpoilers();
  const describe = useGateText();
  const w = t.wiki.spoilers;
  const setRevealed = () => reveal(gate);

  if (open(gate)) return <tr>{children}</tr>;
  const heading = mode === "mine" ? w.notYet : w.title;
  return (
    <>
      <tr className="spoiler-row">
        <td colSpan={columns}>
          <button type="button" onClick={setRevealed}>
            <span className="spoiler-row-mask" aria-hidden="true">{w.inlineMask}</span>
            <span>{w.label(heading, describe(gate))}</span>
          </button>
        </td>
      </tr>
      <tr hidden>{children}</tr>
    </>
  );
}
