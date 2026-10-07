"use client";

import { isBiomeBossStage, isBossStage } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { useGame, useReveals } from "../context";
import { Picto, TEXT_PRESENTATION } from "../icons";

export function StageBar() {
  const { state, store } = useGame();
  const m = useI18n().t.hud.stageBar;
  const { shown, freshClass } = useReveals();
  const current = state.stage;
  const first = Math.max(1, Math.min(current - 2, state.maxStage - 4));
  const pips = Array.from({ length: 5 }, (_, index) => first + index);
  const travel = (stage: number) => store.act({ type: "travel", stage });
  const canProgress = !state.autoAdvance && state.stage < state.maxStage;

  return (
    <div className="stage-bar" onPointerDown={(event) => event.stopPropagation()}>
      <button type="button" className="stage-arrow" aria-label={m.previous} disabled={current <= 1} onClick={() => travel(current - 1)}>‹</button>
      <ol className="stage-pips">
        {pips.map((stage) => {
          const locked = stage > state.maxStage;
          const cleared = stage < state.maxStage;
          const frontier = stage === state.maxStage && stage !== current;
          const classes = ["stage-pip", stage === current ? "current" : "", cleared ? "cleared" : "", frontier ? "frontier" : "", locked ? "locked" : "", isBossStage(stage) ? "boss" : "", isBiomeBossStage(stage) ? "biome-boss" : ""].join(" ");
          return (
            <li key={stage}>
              <button type="button" className={classes} disabled={locked} onClick={() => travel(stage)} aria-label={m.stage(stage, isBossStage(stage))} aria-current={stage === current ? "step" : undefined}>
                {isBossStage(stage) ? <span className="pip-crown" aria-hidden="true">{isBiomeBossStage(stage) ? "♛" : "☠"}{TEXT_PRESENTATION}</span> : null}
                <span>{stage}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <button type="button" className="stage-arrow" aria-label={m.next} disabled={current >= state.maxStage} onClick={() => travel(current + 1)}>›</button>
      {shown.autoToggle ? (
      <button
        type="button"
        className={`auto-toggle ${state.autoAdvance ? "on" : "off"} ${canProgress ? "nudge" : ""}${freshClass("autoToggle")}`}
        onClick={() => store.act({ type: "auto" })}
        title={state.autoAdvance ? m.autoOn : m.autoOff}
        aria-pressed={state.autoAdvance}
      >
        <Picto name={state.autoAdvance ? "fastForward" : "pause"} size={14} />
        <span className="auto-label">{state.autoAdvance ? m.auto : m.farm}</span>
      </button>
      ) : null}
    </div>
  );
}
