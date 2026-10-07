"use client";

import { SKILLS, isSkillUnlocked, skillText } from "@idlebound/game";
import { useRef } from "react";
import { useI18n } from "@/i18n/client";
import type { Messages } from "@/i18n/messages";
import { audio } from "../audio";
import { useGame } from "../context";
import { haptics } from "../haptics";
import { Picto, SKILL_PICTO } from "../icons";
import { gameNow } from "@/lib/clock";

/** How long a key shines when its power comes back. */
const READY_FLASH_MS = 900;

export function SkillBar() {
  const { state, store } = useGame();
  const { t, locale } = useI18n();
  const m = t.hud.skills;
  const now = gameNow();
  // A power that comes back during play says so once: its key shines and the phone buzzes.
  // Only a cooldown seen running ends in a shine, never a key found ready at load.
  const cooled = useRef(new Map<string, boolean>());
  const shine = useRef(new Map<string, number>());
  // Only the powers the walker holds: the others appear the day they are earned.
  const skills = SKILLS.filter((skill) => isSkillUnlocked(state, skill.id));
  if (skills.length === 0) return null;

  return (
    <div className="skill-bar" onPointerDown={(event) => event.stopPropagation()} role="toolbar" aria-label={m.label}>
      {skills.map((skill) => {
        const skillState = state.skills[skill.id];
        const active = Boolean(skillState && skillState.activeUntil > now);
        const cooling = Boolean(skillState && skillState.readyAt > now);
        if (cooled.current.get(skill.id) && !cooling) {
          shine.current.set(skill.id, now + READY_FLASH_MS);
          haptics.pulse("ready");
        }
        cooled.current.set(skill.id, cooling);
        const shining = (shine.current.get(skill.id) ?? 0) > now;
        const total = skillState ? Math.max(1, skillState.readyAt - (skillState.activeUntil - skill.duration * 1000)) : 1;
        const remaining = skillState ? Math.max(0, skillState.readyAt - now) : 0;
        const cooldownRatio = cooling ? remaining / total : 0;
        const activeLeft = active && skillState ? Math.ceil((skillState.activeUntil - now) / 1000) : 0;
        const text = skillText(skill.id, locale, state);
        const label = m.ready(text.name, skill.hotkey, text.description) + (cooling ? m.cooldown(formatCooldown(remaining, m)) : "");
        return (
          <button
            key={skill.id}
            type="button"
            className={`skill ${active ? "active" : ""} ${cooling && !active ? "cooling" : ""} ${!cooling ? "ready" : ""}${shining ? " just-ready" : ""}`}
            aria-label={label}
            onClick={() => {
              const used = store.act<boolean>({ type: "skill", id: skill.id });
              if (!used) audio.play("error");
            }}
          >
            <Picto name={SKILL_PICTO[skill.id]} className="skill-icon" />
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
              <span>{text.description}</span>
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
