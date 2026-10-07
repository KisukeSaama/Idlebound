"use client";

import { ALTAR_REWORK_NOTICE, HARVEST_NOTICE_TOLD } from "@idlebound/game";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/client";
import { useGame } from "../context";
import { HINT_READ_MS, currentHint, hintLearned, type Hint, type HintId } from "../hints";

/** How often the time a hint has spent under the walker's eyes is counted. */
const READ_STEP_MS = 1_000;

/**
 * Contextual tips for the first minutes; each one goes away once understood. The scene renders
 * it twice: over the arena on a computer, and under the powers on a phone, where the arena has
 * no room beside the monster (CSS shows one of the two).
 */
export function TutorialHint({ placement }: { placement: "arena" | "below" }) {
  const { state, store } = useGame();
  const { t, g } = useI18n();
  const m = t.hud.tutorial;
  const hint = currentHint(state);
  if (!hint) return null;
  return (
    <div className={`tutorial-hint hint-${placement} hint-${hint.position}`} role="note" onPointerDown={(event) => event.stopPropagation()}>
      <span>{hintText(hint)}</span>
      <button type="button" aria-label={m.okLabel} onClick={() => store.act({ type: "tutorial", step: hint.id })}>{m.ok}</button>
    </div>
  );

  function hintText({ id, skill }: Hint): string {
    switch (id) {
      case "hire": return m.hire;
      case "companion": return m.companion(g.heroes.maelle.name);
      case "boss": return m.boss;
      case "skill": return m.skill(skill?.hotkey ?? "1");
      case "farm": return m.farm;
      case "ascend": return m.ascend;
      case ALTAR_REWORK_NOTICE: return m.altarRework;
      case HARVEST_NOTICE_TOLD: return m.harvestCap;
    }
  }
}

/**
 * Sends a hint away once it stops making sense, without the walker's "OK": when what they did
 * answered it, or once it has been read (`HINT_READ_MS` on screen in a watched tab). A notice
 * waits to be acknowledged. Marked in the save, so every device agrees; never a player input
 * (the autopilot keeps its own clock).
 */
export function useHintDismissal() {
  const { state, store } = useGame();
  const hint = currentHint(state);
  const id = hint?.id ?? null;
  const timed = hint !== null && !hint.notice;
  const shown = useRef<HintId | null>(null);

  // The hint that just left the screen: if the walker's own doing answered it, it is done.
  useEffect(() => {
    const before = shown.current;
    shown.current = id;
    if (before === null || before === id) return;
    const current = store.state;
    if (!current.tutorial.done.includes(before) && hintLearned(current, before)) store.apply({ type: "tutorial", step: before });
  }, [store, id]);

  useEffect(() => {
    if (id === null || !timed) return;
    let read = 0;
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      read += READ_STEP_MS;
      if (read >= HINT_READ_MS) store.apply({ type: "tutorial", step: id });
    }, READ_STEP_MS);
    return () => clearInterval(timer);
  }, [store, id, timed]);
}
