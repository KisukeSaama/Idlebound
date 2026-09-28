"use client";

import { useI18n } from "@/i18n/client";
import { useGame } from "../context";
import { PixelSprite } from "../pixel/PixelSprite";
import { crystalSource } from "../pixel/sources";

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
      className={`crystal ${crystal.storm !== undefined ? "storm" : ""} ${remaining < (crystal.storm !== undefined ? 1000 : 3000) ? "fading" : ""}`}
      style={{ left: `${crystal.x}%`, top: `${crystal.y}%` }}
      aria-label={t.hud.crystal.catch}
      onPointerDown={(event) => {
        event.stopPropagation();
        event.preventDefault();
        store.act((engine, now) => engine.clickCrystal(now));
      }}
    >
      <PixelSprite source={crystalSource()} size={76} />
    </button>
  );
}
