"use client";

import { HERO_BY_ID, SKILLS, isSkillUnlocked } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import type { Messages } from "@/i18n/messages";
import { audio } from "../audio";
import { useGame } from "../context";

export function SkillBar() {
  const { state, store } = useGame();
  const { t, g } = useI18n();
  const m = t.hud.skills;
  const now = Date.now();

  return (
    <div className="skill-bar" onPointerDown={(event) => event.stopPropagation()} role="toolbar" aria-label={m.label}>
      {SKILLS.map((skill) => {
        const unlocked = isSkillUnlocked(state, skill.id);
        const skillState = state.skills[skill.id];
        const active = Boolean(skillState && skillState.activeUntil > now);
        const cooling = Boolean(skillState && skillState.readyAt > now);
        const total = skillState ? Math.max(1, skillState.readyAt - (skillState.activeUntil - skill.duration * 1000)) : 1;
        const remaining = skillState ? Math.max(0, skillState.readyAt - now) : 0;
        const cooldownRatio = cooling ? remaining / total : 0;
        const activeLeft = active && skillState ? Math.ceil((skillState.activeUntil - now) / 1000) : 0;
        const unlockHero = g.heroes[HERO_BY_ID[skill.unlock.heroId].id].name;
        const text = g.skills[skill.id];
        const label = unlocked
          ? m.ready(text.name, skill.hotkey, text.description) + (cooling ? m.cooldown(formatCooldown(remaining, m)) : "")
          : m.lockedLabel(text.name, unlockHero, skill.unlock.level);
        return (
          <button
            key={skill.id}
            type="button"
            className={`skill ${unlocked ? "" : "locked"} ${active ? "active" : ""} ${cooling && !active ? "cooling" : ""} ${unlocked && !cooling ? "ready" : ""}`}
            disabled={!unlocked}
            aria-label={label}
            onClick={() => {
              const used = store.act((engine, time) => engine.useSkill(skill.id, time));
              if (!used) audio.play("error");
            }}
          >
            <span className="skill-icon" aria-hidden="true">{unlocked ? skill.icon : "🔒"}</span>
            <span className="skill-key" aria-hidden="true">{skill.hotkey}</span>
            {cooling && !active ? (
              <>
                <span className="skill-cooldown" style={{ ["--ratio" as string]: cooldownRatio }} aria-hidden="true" />
                <span className="skill-timer" aria-hidden="true">{formatCooldown(remaining, m)}</span>
              </>
            ) : null}
            {active && activeLeft > 0 ? <span className="skill-timer active-timer" aria-hidden="true">{m.activeSeconds(activeLeft)}</span> : null}
            <span className="skill-tip" role="tooltip">
              <strong>{text.name}</strong>
              <span>{unlocked ? text.description : m.locked(unlockHero, skill.unlock.level)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function formatCooldown(ms: number, m: Messages["hud"]["skills"]): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds >= 60) return m.minutes(Math.ceil(seconds / 60));
  return m.seconds(seconds);
}
