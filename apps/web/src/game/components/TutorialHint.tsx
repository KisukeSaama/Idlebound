"use client";

import { CLICK_HERO_ID, HERO_BY_ID, heroCost, isBossStage, SKILLS, isSkillUnlocked } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { useGame } from "../context";

interface Hint {
  id: string;
  text: string;
  position: "center" | "right" | "bottom";
}

/** Contextual tips for the first minutes; each one goes away once understood. */
export function TutorialHint() {
  const { state, store } = useGame();
  const { t, g } = useI18n();
  const m = t.hud.tutorial;
  const done = state.tutorial.done;
  const hint = pickHint();

  function pickHint(): Hint | null {
    if (state.lifetime.ascensions > 0 || done.includes("all")) return null;
    if (!done.includes("click") && state.lifetime.clicks < 8) return { id: "click", text: m.click, position: "center" };
    const aldric = state.heroLevels[CLICK_HERO_ID] ?? 0;
    if (!done.includes("hire") && aldric === 0 && state.gold >= heroCost(HERO_BY_ID[CLICK_HERO_ID], 0, 1)) {
      return { id: "hire", text: m.hire, position: "right" };
    }
    const maelle = state.heroLevels.maelle ?? 0;
    if (!done.includes("companion") && maelle === 0 && state.gold >= HERO_BY_ID.maelle.baseCost) {
      return { id: "companion", text: m.companion(g.heroes.maelle.name), position: "right" };
    }
    if (!done.includes("boss") && isBossStage(state.stage) && state.monster && state.monster.kind !== "normal" && state.lifetime.bosses === 0) {
      return { id: "boss", text: m.boss, position: "bottom" };
    }
    const firstSkill = SKILLS.find((skill) => isSkillUnlocked(state, skill.id));
    if (!done.includes("skill") && firstSkill && state.lifetime.skillsUsed === 0) {
      return { id: "skill", text: m.skill(firstSkill.hotkey), position: "bottom" };
    }
    if (!done.includes("farm") && !state.autoAdvance && state.lifetime.bossFails > 0) {
      return { id: "farm", text: m.farm, position: "center" };
    }
    if (!done.includes("ascend") && state.maxStage >= 51) {
      return { id: "ascend", text: m.ascend, position: "center" };
    }
    return null;
  }

  if (!hint) return null;
  return (
    <div className={`tutorial-hint hint-${hint.position}`} role="note" onPointerDown={(event) => event.stopPropagation()}>
      <span>{hint.text}</span>
      <button type="button" aria-label={m.okLabel} onClick={() => store.act((engine) => engine.completeTutorial(hint.id))}>{m.ok}</button>
    </div>
  );
}
