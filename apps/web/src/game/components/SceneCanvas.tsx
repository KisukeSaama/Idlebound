"use client";

import { BIOMES, MAX_STAGE, STAGES_PER_BIOME, biomeForStage, eraForStage, remembranceNight, type MonsterState } from "@idlebound/game";
import { useEffect, useRef, type RefObject } from "react";
import { useGame } from "../context";
import { ArenaRenderer } from "../pixel/arena";
import { prefersReducedMotion } from "../pixel/surface";

let active: { renderer: ArenaRenderer; canvas: HTMLCanvasElement } | null = null;

/** Where the monster stands on the page (viewport pixels), for what must not cover it (the toasts). */
export function monsterOnPage(): { left: number; top: number; right: number; bottom: number } | null {
  const box = active?.renderer.spriteBox();
  if (!active || !box) return null;
  const canvas = active.canvas.getBoundingClientRect();
  return { left: canvas.left + box.x, top: canvas.top + box.y, right: canvas.left + box.x + box.width, bottom: canvas.top + box.y + box.height };
}

/**
 * The combat scene's canvas (behind the HUD): the biome's layers, the monster and every
 * effect, drawn by the pixel arena renderer. It follows the state through plain method
 * calls and warms the cache with the next stretch of road while the browser idles. At the
 * last stage the scene is the Dawn (the edge of the night) whatever the biome; with "Keep
 * the night dark" every stratum keeps the backgrounds of the Kingdom.
 */
export function SceneCanvas({
  sectionRef,
  arenaRef,
  renderer,
  biomeId,
  era,
  monster,
  monsterKey,
  cleared,
  fullMoon,
  darkNight: darkNightProp
}: {
  sectionRef: RefObject<HTMLElement | null>;
  arenaRef: RefObject<HTMLDivElement | null>;
  renderer: RefObject<ArenaRenderer | null>;
  biomeId: string;
  era: number;
  monster: MonsterState | null;
  monsterKey: string;
  cleared: boolean;
  /** The Hearthfields' moon is full (Night Owl). */
  fullMoon: boolean;
  /** "Keep the night dark": the Kingdom's backgrounds in every stratum (the setting's value when absent). */
  darkNight?: boolean;
}) {
  const { state, store } = useGame();
  const darkNight = darkNightProp ?? state.settings.darkNight ?? false;
  const canvas = useRef<HTMLCanvasElement>(null);
  const reducedSetting = state.settings.reducedMotion;
  const stage = state.stage;

  useEffect(() => {
    const element = canvas.current;
    const section = sectionRef.current;
    const arena = arenaRef.current;
    if (!element || !section || !arena) return;
    const arenaRenderer = new ArenaRenderer(element);
    renderer.current = arenaRenderer;
    active = { renderer: arenaRenderer, canvas: element };
    const fit = () => {
      const box = section.getBoundingClientRect();
      const inner = arena.getBoundingClientRect();
      arenaRenderer.resize({ x: 0, y: 0, width: box.width, height: box.height }, { x: inner.left - box.left, y: inner.top - box.top, width: inner.width, height: inner.height });
    };
    const observer = new ResizeObserver(fit);
    observer.observe(section);
    observer.observe(arena);
    fit();
    arenaRenderer.start();
    return () => {
      observer.disconnect();
      arenaRenderer.stop();
      renderer.current = null;
      if (active?.renderer === arenaRenderer) active = null;
    };
  }, [sectionRef, arenaRef, renderer]);

  useEffect(() => {
    const arenaRenderer = renderer.current;
    if (!arenaRenderer) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      arenaRenderer.reducedMotion = reducedSetting || prefersReducedMotion();
      arenaRenderer.start();
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [renderer, reducedSetting]);

  const sceneId = state.stage >= MAX_STAGE ? "dawn" : biomeId;
  useEffect(() => {
    renderer.current?.setScene(sceneId, era, fullMoon, darkNight);
  }, [renderer, sceneId, era, fullMoon, darkNight]);

  // A Crystal Storm: the Lantern Queen crosses the sky.
  useEffect(() => store.onFx((event) => {
    if (event.type === "storm") renderer.current?.storm(eraForStage(store.state.stage));
  }), [renderer, store]);

  useEffect(() => {
    renderer.current?.setMilestone(cleared);
  }, [renderer, cleared]);

  // What the events of the Long Night show of the monster: its event, the Eclipse, Pip's dare, its wounds.
  const hp = monster?.hp ?? 0;
  const wager = Boolean(monster?.wager);
  useEffect(() => {
    renderer.current?.setMonster(monster ? { id: monster.id, kind: monster.kind, event: monster.event, eclipse: monster.eclipse, wager: monster.wager, hp: monster.hp, maxHp: monster.maxHp } : null, monsterKey, era);
  }, [renderer, monster, monsterKey, era, hp, wager]);

  // Echo of a Walker: another walker's shadow fights beside the company while its buff lasts.
  const walker = state.buffs.some((buff) => buff.id === "walker" && buff.until > Date.now());
  useEffect(() => {
    renderer.current?.setWalker(walker, era);
  }, [renderer, walker, era]);

  // A Remembrance Night, by the walker's own calendar: lanterns hang in the scene.
  const remembrance = remembranceNight(new Date()) !== null;
  useEffect(() => {
    renderer.current?.setRemembrance(remembrance);
  }, [renderer, remembrance]);

  useEffect(() => {
    // The creatures of this stretch and the next, generated while the browser idles.
    const next = biomeForStage(stage + STAGES_PER_BIOME);
    const nextEra = eraForStage(stage + STAGES_PER_BIOME);
    const current = BIOMES.find((biome) => biome.id === biomeId);
    const ids = [
      ...(current ? [...current.monsters, current.miniBoss, current.boss].map((def) => ({ id: def.id, era })) : []),
      ...[...next.monsters, next.miniBoss, next.boss].map((def) => ({ id: def.id, era: nextEra }))
    ];
    renderer.current?.prepare(ids);
  }, [renderer, biomeId, era, stage]);

  return <canvas ref={canvas} className="scene-canvas" aria-hidden="true" />;
}
