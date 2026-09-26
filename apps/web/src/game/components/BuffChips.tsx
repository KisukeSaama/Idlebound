"use client";

import { SKILL_BY_ID, type SkillId } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { useGame } from "../context";
import { BUFF_PICTO, Picto, SKILL_PICTO, type PictoName } from "../icons";

export function BuffChips() {
  const { state, derived } = useGame();
  const { t, g } = useI18n();
  const m = t.hud.buffs;
  const now = Date.now();
  const chips: { key: string; icon: PictoName; label: string; seconds: number }[] = [];
  for (const buff of state.buffs) {
    if (buff.until > now) chips.push({ key: buff.id, icon: BUFF_PICTO[buff.id], label: m[buff.id], seconds: (buff.until - now) / 1000 });
  }
  for (const [id, skill] of Object.entries(state.skills)) {
    const def = SKILL_BY_ID[id as SkillId];
    if (skill && def.duration > 0 && skill.activeUntil > now) chips.push({ key: id, icon: SKILL_PICTO[def.id], label: g.skills[def.id].name, seconds: (skill.activeUntil - now) / 1000 });
  }
  if (state.ritualStacks > 0) chips.push({ key: "ritual", icon: "orb", label: m.ritual(state.ritualStacks * 5), seconds: -1 });
  if (derived.idle && (state.altars.patience ?? 0) > 0) chips.push({ key: "idle", icon: "lotus", label: m.patience, seconds: -1 });

  if (chips.length === 0) return <div className="buff-chips" />;
  return (
    <ul className="buff-chips" aria-label={m.label}>
      {chips.map((chip) => (
        <li key={chip.key} className="buff-chip" title={chip.label}>
          <Picto name={chip.icon} size={16} />
          <span className="buff-label">{chip.label}</span>
          {chip.seconds >= 0 ? <span className="buff-time">{formatTime(chip.seconds)}</span> : null}
        </li>
      ))}
    </ul>
  );
}

function formatTime(seconds: number): string {
  if (seconds >= 60) return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  return `${Math.ceil(seconds)}s`;
}
