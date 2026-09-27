"use client";

import { HERO_BY_ID, type GameEvent } from "@idlebound/game";
import { useEffect, useRef, type RefObject } from "react";
import { currentMessages } from "@/i18n/client";
import { useFormat, useStoreRef } from "../context";
import { drawShot, shotDuration, shotFlight, type Shot } from "../strikeFx";

export interface PointerMemo {
  x: number;
  y: number;
  at: number;
}

const MAX_NODES = 36;
/** Visible companion shots per "dps" event (one event per second). */
const COMPANION_STRIKES = 3;

/**
 * Visual effects (damage numbers, companion shots, gold, dying sprite) handled directly in
 * the DOM: dozens of elements per second without ever re-rendering React.
 */
export function FxLayer({ pointer, monsterRef }: { pointer: RefObject<PointerMemo>; monsterRef: RefObject<HTMLDivElement | null> }) {
  const store = useStoreRef();
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fmt = useFormat();
  const fmtRef = useRef(fmt);
  fmtRef.current = fmt;

  useEffect(() => {
    // Layer size is cached: reading it on every hit, right after inserting a node, would
    // force a synchronous layout on every click.
    const size = { width: 400, height: 300 };
    const observer = new ResizeObserver(([entry]) => {
      size.width = entry.contentRect.width;
      size.height = entry.contentRect.height;
    });
    if (layer.current) observer.observe(layer.current);
    let reaction: Animation | null = null;
    let reactionSource: "player" | "companion" = "player";
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const reducedMotion = () => store.state.settings.reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const spawn = (className: string, text: string, x: number, y: number, duration: number, label?: string) => {
      const root = layer.current;
      if (!root) return;
      while (root.childElementCount >= MAX_NODES) root.firstElementChild?.remove();
      const node = document.createElement("span");
      node.className = className;
      node.textContent = text;
      if (label) node.dataset.label = label;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.setProperty("--drift", `${(Math.random() - 0.5) * 60}px`);
      root.appendChild(node);
      setTimeout(() => node.remove(), duration);
    };

    const center = () => ({ x: size.width / 2, y: size.height * 0.62 });

    /**
     * Box of the monster sprite inside the layer. Sprites differ in size, shape and scale,
     * so effects aimed at the monster read it instead of assuming the scene's center.
     */
    const spriteBox = () => {
      const root = layer.current;
      const sprite = monsterRef.current?.querySelector("img");
      if (!root || !sprite) return null;
      const rootRect = root.getBoundingClientRect();
      const rect = sprite.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return null;
      return { x: rect.left - rootRect.left, y: rect.top - rootRect.top, width: rect.width, height: rect.height };
    };

    const react = (monster: HTMLElement | null, crit: boolean) => {
      if (!monster || store.state.settings.reducedMotion) return;
      // One reaction at a time: during frenzy, animations don't pile up. A companion flinch
      // always gives way to the player's hit.
      if (reaction?.playState === "running") {
        if (!crit && reactionSource === "player") return;
        reaction.cancel();
      }
      reactionSource = "player";
      reaction = monster.animate(
        [
          { transform: "translate(0, 0) scale(1)", filter: "brightness(1)" },
          { transform: `translate(${crit ? 6 : 3}px, 2px) scale(0.95, 1.04)`, filter: `brightness(${crit ? 2.4 : 1.7})` },
          { transform: "translate(0, 0) scale(1)", filter: "brightness(1)" }
        ],
        { duration: crit ? 190 : 130, easing: "ease-out" }
      );
    };

    /** A companion drawn at random, weighted by the damage each one deals. */
    const pickCompanion = (): string | null => {
      const heroDps = store.derived.heroDps;
      let total = 0;
      for (const value of Object.values(heroDps)) total += value;
      if (!(total > 0)) return null;
      let roll = Math.random() * total;
      for (const [id, value] of Object.entries(heroDps)) {
        roll -= value;
        if (value > 0 && roll <= 0 && HERO_BY_ID[id]) return id;
      }
      return null;
    };

    // ---- companion shots, drawn on one canvas over the arena
    const shots: (Shot & { landed: boolean })[] = [];
    let shotFrame = 0;

    const fitCanvas = () => {
      const surface = canvas.current;
      if (!surface) return;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.round(size.width * ratio);
      const height = Math.round(size.height * ratio);
      if (surface.width !== width || surface.height !== height) {
        surface.width = width;
        surface.height = height;
      }
      return ratio;
    };

    /** The monster lights up in the companion's color and flinches (never over the player's hits). */
    const land = (color: string) => {
      const monster = monsterRef.current;
      if (!monster || reaction?.playState === "running") return;
      reactionSource = "companion";
      reaction = monster.animate(
        [
          { transform: "translate(0, 0)", filter: "brightness(1) drop-shadow(0 0 0 transparent)" },
          { transform: `translate(${Math.random() < 0.5 ? -2 : 2}px, 1px)`, filter: `brightness(1.3) drop-shadow(0 0 14px ${color})`, offset: 0.3 },
          { transform: "translate(0, 0)", filter: "brightness(1) drop-shadow(0 0 0 transparent)" }
        ],
        { duration: 220, easing: "ease-out" }
      );
    };

    const renderShots = (now: number) => {
      shotFrame = 0;
      const surface = canvas.current;
      const ctx = surface?.getContext("2d");
      if (!surface || !ctx) return;
      const ratio = fitCanvas() ?? 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, surface.width, surface.height);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      for (let index = shots.length - 1; index >= 0; index -= 1) {
        const shot = shots[index];
        const t = (now - shot.start) / 1000;
        if (t >= shotDuration(shot.style)) {
          shots.splice(index, 1);
          continue;
        }
        if (!shot.landed && t >= shotFlight(shot.style)) {
          shot.landed = true;
          land(shot.color);
        }
        drawShot(ctx, shot, t);
      }
      if (shots.length > 0) shotFrame = requestAnimationFrame(renderShots);
    };

    /** Center of an element inside the layer, or null when it is not displayed. */
    const centerOf = (element: Element | null | undefined) => {
      const root = layer.current;
      if (!root || !element) return null;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0) return null;
      const rootRect = root.getBoundingClientRect();
      return { x: rect.left - rootRect.left + rect.width / 2, y: rect.top - rootRect.top + rect.height / 2 };
    };

    /**
     * A companion hits: its medallion in the party lunges and fires a shot in its color that
     * arcs to the monster's body and bursts there.
     */
    const companionStrike = () => {
      const root = layer.current;
      if (!root || !store.state.monster || reducedMotion()) return;
      const heroId = pickCompanion();
      if (!heroId) return;
      const box = spriteBox();
      if (!box) return;
      const hero = HERO_BY_ID[heroId];
      const member = root.parentElement?.querySelector<HTMLElement>(`.party-member[data-hero="${heroId}"]`);
      // Companions not shown in the party (small screens) shoot from the party's side.
      const from = centerOf(member) ?? centerOf(root.parentElement?.querySelector(".party-member")) ?? { x: 24, y: size.height * 0.7 };
      shots.push({
        style: hero.strike,
        color: hero.color,
        seed: Math.floor(Math.random() * 2 ** 31),
        start: performance.now(),
        fromX: from.x,
        fromY: from.y,
        // Aim at the body: the middle of the sprite, where its transparent margins end.
        toX: box.x + box.width * (0.35 + Math.random() * 0.3),
        toY: box.y + box.height * (0.35 + Math.random() * 0.3),
        scale: Math.min(1.15, Math.max(0.65, size.width / 900)),
        landed: false
      });
      if (!shotFrame) shotFrame = requestAnimationFrame(renderShots);
      member?.animate(
        [
          { transform: "translateX(0) scale(1)", filter: "brightness(1)" },
          { transform: "translateX(6px) scale(1.14)", filter: "brightness(1.6)", offset: 0.3 },
          { transform: "translateX(0) scale(1)", filter: "brightness(1)" }
        ],
        { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    };

    const dying = (event: Extract<GameEvent, { type: "kill" }>) => {
      const root = layer.current;
      if (!root || store.state.settings.reducedMotion) return;
      const img = document.createElement("img");
      img.src = event.monster.image;
      img.alt = "";
      img.className = "fx-dying";
      if (event.monster.filter) img.style.filter = event.monster.filter;
      img.style.setProperty("--scale", String(event.monster.scale));
      root.appendChild(img);
      setTimeout(() => img.remove(), 450);
    };

    const unsubscribe = store.onFx((event) => {
      const settings = store.state.settings;
      if (event.type === "hit") {
        react(monsterRef.current, event.crit);
        if (!settings.damageNumbers) return;
        const recent = pointer.current && event.source === "click" && performance.now() - pointer.current.at < 120;
        const origin = recent ? { x: pointer.current.x, y: pointer.current.y } : center();
        const x = origin.x + (recent ? 0 : (Math.random() - 0.5) * 120);
        const y = origin.y + (recent ? -10 : (Math.random() - 0.5) * 60);
        spawn(`fx-damage ${event.crit ? "crit" : ""} ${event.source === "auto" ? "auto" : ""}`, fmtRef.current(event.damage), x, y, 900, event.crit ? currentMessages().hud.fx.crit : undefined);
      } else if (event.type === "dps") {
        // Companion strikes spread over the next second, then their total damage beside the
        // monster so it never hides clicks.
        for (let index = 0; index < COMPANION_STRIKES; index += 1) {
          later(companionStrike, (index * 1000) / COMPANION_STRIKES + Math.random() * 120);
        }
        if (!settings.damageNumbers) return;
        // Beside the monster's body (sprites carry transparent margins above it), alternating
        // sides, kept inside the scene; the number then rises.
        const box = spriteBox();
        const side = Math.random() < 0.5 ? -1 : 1;
        const { x: cx, y: cy } = center();
        const x = box ? box.x + box.width * (side < 0 ? 0.16 : 0.84) : cx + side * 85;
        const y = box ? box.y + box.height * (0.38 + Math.random() * 0.1) : cy - 45;
        spawn("fx-damage companions", fmtRef.current(event.damage), Math.min(size.width - 60, Math.max(60, x)), y, 1000, currentMessages().hud.fx.companions);
      } else if (event.type === "kill") {
        dying(event);
        const { x, y } = center();
        spawn(`fx-gold ${event.monster.kind === "treasure" ? "treasure" : ""}`, `+${fmtRef.current(event.gold)}`, x, y + 40, 1100);
        if (event.shards > 0) spawn("fx-shards", currentMessages().hud.fx.shards(event.shards), x + 50, y + 10, 1300);
      }
    });
    return () => {
      unsubscribe();
      observer.disconnect();
      if (shotFrame) cancelAnimationFrame(shotFrame);
      for (const id of timers) clearTimeout(id);
    };
  }, [store, pointer, monsterRef]);

  return (
    <>
      <canvas ref={canvas} className="fx-canvas" aria-hidden="true" />
      <div ref={layer} className="fx-layer" aria-hidden="true" />
    </>
  );
}
