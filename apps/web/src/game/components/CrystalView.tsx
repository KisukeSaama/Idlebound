"use client";

import { useI18n } from "@/i18n/client";
import { useGame } from "../context";

/** The wandering crystal: it crosses the scene for a few seconds, catch it on the fly. */
export function CrystalView() {
  const { state, store } = useGame();
  const { t } = useI18n();
  const crystal = state.crystal;
  if (!crystal) return null;
  const remaining = Math.max(0, crystal.expiresAt - Date.now());
  return (
    <button
      key={crystal.id}
      type="button"
      className={`crystal ${remaining < 3000 ? "fading" : ""}`}
      style={{ left: `${crystal.x}%`, top: `${crystal.y}%` }}
      aria-label={t.hud.crystal.catch}
      onPointerDown={(event) => {
        event.stopPropagation();
        event.preventDefault();
        store.act((engine, now) => engine.clickCrystal(now));
      }}
    >
      <img src="/assets/icons/sidebar-essences-crystals.webp" alt="" width={70} height={77} draggable={false} />
    </button>
  );
}
