"use client";

import { formatNumber } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { useSpoilers, type SpoilerMode } from "./SpoilerMode";

const MODES: readonly SpoilerMode[] = ["veil", "mine", "all"];

/** The reading mode of the wiki: how it treats what the walker has not lived yet. */
export function ModeBar() {
  const { t } = useI18n();
  const { mode, setMode, status, game } = useSpoilers();
  const w = t.wiki.spoilers;
  const note =
    status === "ready" && game ? w.reading(formatNumber(game.maxStageEver), game.lifetime.ascensions)
    : status === "none" ? w.noGame
    : status === "loading" ? w.loading
    : null;

  return (
    <div className="wiki-modes" role="group" aria-labelledby="wiki-modes-label">
      <span id="wiki-modes-label" className="wiki-modes-label">{w.modesLabel}</span>
      <div className="wiki-modes-buttons">
        {MODES.map((entry) => (
          <button
            key={entry}
            type="button"
            className={entry === mode ? "active" : ""}
            aria-pressed={entry === mode}
            disabled={entry === "mine" && status !== "ready"}
            title={w.modeHints[entry]}
            aria-describedby={`wiki-mode-${entry}-hint`}
            onClick={() => setMode(entry)}
          >
            {w.modes[entry]}
          </button>
        ))}
      </div>
      {MODES.map((entry) => <span key={entry} id={`wiki-mode-${entry}-hint`} hidden>{w.modeHints[entry]}</span>)}
      {note ? <p className="wiki-modes-note">{note}</p> : null}
    </div>
  );
}
