"use client";

import { HERO_BY_ID } from "@idlebound/game";
import { useEffect, useRef, type RefObject } from "react";
import { currentMessages } from "@/i18n/client";
import { useFormat, useStoreRef } from "../context";
import type { ArenaRenderer } from "../pixel/arena";
import { hash2 } from "../pixel/pixels";
import { pageRect } from "../pixel/surface";

export interface PointerMemo {
  x: number;
  y: number;
  at: number;
}

const MAX_NODES = 36;
/** Visible companion shots per "dps" event (one event per second). */
const COMPANION_STRIKES = 3;

/**
 * Effects over the arena. Numbers are the Ledger writing (DOM, Cinzel, tokens): damage,
 * gold, shards, dozens per second without ever re-rendering React. What happens in the
 * world (hit flashes, companion shots, a monster coming apart into gold) is drawn by the
 * pixel arena renderer.
 */
export function FxLayer({ pointer, renderer }: { pointer: RefObject<PointerMemo>; renderer: RefObject<ArenaRenderer | null> }) {
  const store = useStoreRef();
  const layer = useRef<HTMLDivElement>(null);
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
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    // Cosmetic spread (drift, offsets, which companion fires) from an integer hash of a
    // running count, never Math.random: the same sequence of events looks the same.
    let draws = 0;
    const roll = () => hash2(draws++, store.state.lifetime.kills, 0x5f1a);
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
      node.style.setProperty("--drift", `${(roll() - 0.5) * 60}px`);
      root.appendChild(node);
      setTimeout(() => node.remove(), duration);
    };

    const center = () => ({ x: size.width / 2, y: size.height * 0.62 });

    /** Box of the monster's body inside the layer (the arena), from the renderer. */
    const spriteBox = () => {
      const arena = renderer.current;
      const box = arena?.monsterBox();
      if (!arena || !box) return null;
      const offset = arena.arenaBox();
      return { x: box.x - offset.x, y: box.y - offset.y, width: box.width, height: box.height };
    };

    /** A companion drawn by the hash, weighted by the damage each one deals. */
    const pickCompanion = (): string | null => {
      const heroDps = store.derived.heroDps;
      let total = 0;
      for (const value of Object.values(heroDps)) total += value;
      if (!(total > 0)) return null;
      let left = roll() * total;
      for (const [id, value] of Object.entries(heroDps)) {
        left -= value;
        if (value > 0 && left <= 0 && HERO_BY_ID[id]) return id;
      }
      return null;
    };

    /** Center of an element relative to the scene (the renderer's canvas), or null when hidden. */
    const sceneCenter = (element: Element | null | undefined) => {
      const section = layer.current?.closest(".scene");
      if (!section || !element) return null;
      const rect = pageRect(element);
      if (rect.width === 0) return null;
      const box = pageRect(section);
      return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2 };
    };

    /**
     * A companion hits: its medallion in the party lunges and fires a pixel shot in its
     * color that arcs to the monster's body and bursts there.
     */
    const companionStrike = () => {
      const root = layer.current;
      const arena = renderer.current;
      if (!root || !arena || !store.state.monster || reducedMotion()) return;
      const heroId = pickCompanion();
      if (!heroId) return;
      const hero = HERO_BY_ID[heroId];
      const scene = root.closest(".scene");
      const member = scene?.querySelector<HTMLElement>(`.party-member[data-hero="${heroId}"]`);
      // Companions not shown in the party (small screens) shoot from the party's side.
      const offset = arena.arenaBox();
      const from = sceneCenter(member) ?? sceneCenter(scene?.querySelector(".party-member")) ?? { x: offset.x + 24, y: offset.y + size.height * 0.7 };
      arena.shoot(hero.strike, hero.color, from);
      member?.animate(
        [
          { transform: "translateX(0) scale(1)", filter: "brightness(1)" },
          { transform: "translateX(6px) scale(1.14)", filter: "brightness(1.6)", offset: 0.3 },
          { transform: "translateX(0) scale(1)", filter: "brightness(1)" }
        ],
        { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    };

    /** Where the gold motes of a kill fly: the gold counter of the header. */
    const goldCounter = () => sceneCenter(document.querySelector(".resource-gold"));

    const unsubscribe = store.onFx((event) => {
      const settings = store.state.settings;
      if (event.type === "hit") {
        const recent = pointer.current && event.source === "click" && performance.now() - pointer.current.at < 120;
        const offset = renderer.current?.arenaBox();
        renderer.current?.hit(event.crit, recent && offset ? offset.x + pointer.current.x : undefined);
        if (!settings.damageNumbers) return;
        const origin = recent ? { x: pointer.current.x, y: pointer.current.y } : center();
        const x = origin.x + (recent ? 0 : (roll() - 0.5) * 120);
        const y = origin.y + (recent ? -10 : (roll() - 0.5) * 60);
        spawn(`fx-damage ${event.crit ? "crit" : ""} ${event.source === "auto" ? "auto" : ""}`, fmtRef.current(event.damage), x, y, 900, event.crit ? currentMessages().hud.fx.crit : undefined);
      } else if (event.type === "dps") {
        // Companion strikes spread over the next second, then their total damage beside the
        // monster so it never hides clicks.
        for (let index = 0; index < COMPANION_STRIKES; index += 1) {
          later(companionStrike, (index * 1000) / COMPANION_STRIKES + roll() * 120);
        }
        if (!settings.damageNumbers) return;
        const box = spriteBox();
        const side = roll() < 0.5 ? -1 : 1;
        const { x: cx, y: cy } = center();
        const x = box ? box.x + box.width * (side < 0 ? 0.1 : 0.9) : cx + side * 85;
        const y = box ? box.y + box.height * (0.3 + roll() * 0.1) : cy - 45;
        spawn("fx-damage companions", fmtRef.current(event.damage), Math.min(size.width - 60, Math.max(60, x)), y, 1000, currentMessages().hud.fx.companions);
      } else if (event.type === "kill") {
        renderer.current?.kill(goldCounter());
        const { x, y } = center();
        spawn(`fx-gold ${event.monster.kind === "treasure" ? "treasure" : ""}`, `+${fmtRef.current(event.gold)}`, x, y + 40, 1100);
        if (event.shards > 0) spawn("fx-shards", currentMessages().hud.fx.shards(event.shards), x + 50, y + 10, 1300);
      }
    });
    return () => {
      unsubscribe();
      observer.disconnect();
      for (const id of timers) clearTimeout(id);
    };
  }, [store, pointer, renderer]);

  return <div ref={layer} className="fx-layer" aria-hidden="true" />;
}
