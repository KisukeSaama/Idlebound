"use client";

import { useLayoutEffect, useRef } from "react";
import { useI18n } from "@/i18n/client";
import { useGame } from "../context";
import { PixelSprite } from "../pixel/PixelSprite";
import { crystalLitSource } from "../pixel/sources";
import { gameNow } from "@/lib/clock";

/** The wandering crystal: it crosses the scene for a few seconds, catch it on the fly. */
export function CrystalView() {
  const { state, store } = useGame();
  const { t } = useI18n();
  const button = useRef<HTMLButtonElement>(null);
  const crystal = state.crystal;
  // Its place is given in shares of the scene; the box lands on whole pixels, as the world's sprites do.
  useLayoutEffect(() => {
    const element = button.current;
    const scene = element?.offsetParent as HTMLElement | null;
    if (!element || !scene || !crystal) return;
    element.style.left = `${Math.round((scene.clientWidth * crystal.x) / 100)}px`;
    element.style.top = `${Math.round((scene.clientHeight * crystal.y) / 100)}px`;
  });
  if (!crystal) return null;
  const remaining = Math.max(0, crystal.expiresAt - gameNow());
  const storm = crystal.storm !== undefined;
  return (
    <button
      ref={button}
      key={crystal.id}
      type="button"
      className={`crystal ${storm ? "storm" : ""} ${remaining < (storm ? 1000 : 3000) ? "fading" : ""}`}
      style={{ left: `${crystal.x}%`, top: `${crystal.y}%` }}
      aria-label={t.hud.crystal.catch}
      onPointerDown={(event) => {
        event.stopPropagation();
        event.preventDefault();
        store.act({ type: "crystal" });
      }}
    >
      <PixelSprite source={crystalLitSource(storm)} size="parent" eager />
    </button>
  );
}
