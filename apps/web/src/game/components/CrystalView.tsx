"use client";

import { useLayoutEffect, useRef } from "react";
import { useI18n } from "@/i18n/client";
import { useGame } from "../context";
import { PixelSprite } from "../pixel/PixelSprite";
import { CRYSTAL_LIT_W } from "../pixel/objects";
import { crystalLitSource } from "../pixel/sources";
import { gameNow } from "@/lib/clock";
import { PHONE_QUERY } from "./Toasts";

/** The box the crystal and its light fit, in CSS pixels: the button wraps the sprite exactly. */
const SIZE = 108;
const PHONE_SIZE = 72;

/** The wandering crystal: it crosses the scene for a few seconds, catch it on the fly. */
export function CrystalView() {
  const { state, store } = useGame();
  const { t } = useI18n();
  const button = useRef<HTMLButtonElement>(null);
  const crystal = state.crystal;
  // Its place is given in shares of the scene; the box lands on whole device pixels, as the
  // world's sprites do, and it floats by whole pixels of its own art.
  useLayoutEffect(() => {
    const element = button.current;
    const scene = element?.offsetParent as HTMLElement | null;
    if (!element || !scene || !crystal) return;
    const dpr = window.devicePixelRatio || 1;
    const snap = (value: number) => Math.round(value * dpr) / dpr;
    const frame = scene.getBoundingClientRect();
    const originX = frame.left + scene.clientLeft;
    const originY = frame.top + scene.clientTop;
    element.style.margin = "0";
    element.style.left = `${snap(originX + (scene.clientWidth * crystal.x) / 100 - element.offsetWidth / 2) - originX}px`;
    element.style.top = `${snap(originY + (scene.clientHeight * crystal.y) / 100 - element.offsetHeight / 2) - originY}px`;
    const art = element.querySelector("canvas")?.getBoundingClientRect().width;
    if (art) element.style.setProperty("--crystal-px", `${art / CRYSTAL_LIT_W}px`);
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
      <PixelSprite source={crystalLitSource(storm)} size={typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches ? PHONE_SIZE : SIZE} eager />
    </button>
  );
}
