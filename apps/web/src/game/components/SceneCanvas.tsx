"use client";

import { BIOMES, MAX_STAGE, STAGES_PER_BIOME, biomeForStage, eraForStage, remembranceNight, type BiomeDef, type GameState, type MonsterState } from "@idlebound/game";
import { useEffect, useRef, type RefObject } from "react";
import { useGame } from "../context";
import { ArenaRenderer, type Stretch } from "../pixel/arena";
import { pageRect, prefersReducedMotion } from "../pixel/surface";

let active: { renderer: ArenaRenderer; canvas: HTMLCanvasElement } | null = null;
/** Windows and dialogs open over the scene right now. */
let covers = 0;

/** A window opens over the scene: it slows down beneath until the returned function is called. */
export function coverScene(): () => void {
  covers += 1;
  active?.renderer.setCovered(true);
  let done = false;
  return () => {
    if (done) return;
    done = true;
    covers -= 1;
    active?.renderer.setCovered(covers > 0);
  };
}

/** Names the monster in the road: a new key is a new monster. */
export function monsterKeyOf(state: GameState): string {
  return `${state.stage}-${state.lifetime.kills}-${state.lifetime.bossFails}`;
}

/** Where the monster stands on the page (page CSS pixels), for what must not cover it (the toasts). */
export function monsterOnPage(): { left: number; top: number; right: number; bottom: number } | null {
  const box = active?.renderer.spriteBox();
  if (!active || !box) return null;
  const canvas = pageRect(active.canvas);
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
  // The Last Second: the Keep's gargoyle has lost a claw.
  const clawless = state.secrets.includes("last-second");
  const stage = state.stage;

  useEffect(() => {
    const element = canvas.current;
    const section = sectionRef.current;
    const arena = arenaRef.current;
    if (!element || !section || !arena) return;
    const arenaRenderer = new ArenaRenderer(element);
    renderer.current = arenaRenderer;
    active = { renderer: arenaRenderer, canvas: element };
    arenaRenderer.setCovered(covers > 0);
    const fit = () => {
      const box = pageRect(section);
      const inner = pageRect(arena);
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
    renderer.current?.setScene(sceneId, era, fullMoon, darkNight, clawless);
  }, [renderer, sceneId, era, fullMoon, darkNight, clawless]);

  // A Crystal Storm: the Lantern Queen crosses the sky.
  useEffect(() => store.onFx((event) => {
    if (event.type === "storm") renderer.current?.storm(eraForStage(store.state.stage));
  }), [renderer, store]);

  useEffect(() => {
    renderer.current?.setMilestone(cleared);
  }, [renderer, cleared]);

  // What the events of the Long Night show of the monster: its event, the Eclipse, Pip's dare, its wounds.
  // Read from the live state, never from the render: React hears the engine at most every
  // 100 ms, and a monster struck down within one tick would otherwise never be seen.
  const hp = monster?.hp ?? 0;
  const wager = Boolean(monster?.wager);
  useEffect(() => {
    const show = () => {
      const live = store.state.monster;
      renderer.current?.setMonster(live ? { id: live.id, kind: live.kind, event: live.event, eclipse: live.eclipse, wager: live.wager, hp: live.hp, maxHp: live.maxHp } : null, monsterKeyOf(store.state), eraForStage(store.state.stage));
    };
    show();
    return store.onFx((event) => {
      if (event.type === "spawn") show();
    });
  }, [renderer, store, monster, era, hp, wager]);

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

  // The next stretch of road: its biome (the Dawn at the last stage) and its era.
  const nextStage = stage + STAGES_PER_BIOME;
  const nextBiome = biomeForStage(nextStage);
  const nextSceneId = nextStage >= MAX_STAGE ? "dawn" : nextBiome.id;
  const nextEra = eraForStage(nextStage);
  useEffect(() => {
    // This stretch and the next, scenes and creatures, generated while the browser idles.
    const creatures = (biome: BiomeDef) => [...biome.monsters, biome.miniBoss, biome.boss].map((def) => def.id);
    const current = BIOMES.find((biome) => biome.id === biomeId);
    const stretches: Stretch[] = [
      ...(current ? [{ sceneId, era, fullMoon, darkNight, clawless, creatures: creatures(current) }] : []),
      { sceneId: nextSceneId, era: nextEra, fullMoon, darkNight, clawless, creatures: creatures(nextBiome) }
    ];
    renderer.current?.prepare(stretches);
  }, [renderer, biomeId, sceneId, era, nextBiome, nextSceneId, nextEra, fullMoon, darkNight, clawless]);

  return <canvas ref={canvas} className="scene-canvas" aria-hidden="true" />;
}
