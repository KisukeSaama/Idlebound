"use client";

import type { GameEvent } from "@idlebound/game";
import { useEffect, useRef, type RefObject } from "react";
import { currentMessages } from "@/i18n/client";
import { useFormat, useStoreRef } from "../context";

export interface PointerMemo {
  x: number;
  y: number;
  at: number;
}

const MAX_NODES = 36;

/**
 * Visual effects (damage numbers, gold, dying sprite) handled directly in the DOM: dozens of
 * elements per second without ever re-rendering React.
 */
export function FxLayer({ pointer, monsterRef }: { pointer: RefObject<PointerMemo>; monsterRef: RefObject<HTMLDivElement | null> }) {
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
    let reaction: Animation | null = null;

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

    const react = (monster: HTMLElement | null, crit: boolean) => {
      if (!monster || store.state.settings.reducedMotion) return;
      // One reaction at a time: during frenzy, animations don't pile up.
      if (reaction?.playState === "running") {
        if (!crit) return;
        reaction.cancel();
      }
      reaction = monster.animate(
        [
          { transform: "translate(0, 0) scale(1)", filter: "brightness(1)" },
          { transform: `translate(${crit ? 6 : 3}px, 2px) scale(0.95, 1.04)`, filter: `brightness(${crit ? 2.4 : 1.7})` },
          { transform: "translate(0, 0) scale(1)", filter: "brightness(1)" }
        ],
        { duration: crit ? 190 : 130, easing: "ease-out" }
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
        // Companion damage over the last second, beside the monster so it never hides clicks.
        if (!settings.damageNumbers) return;
        const { x, y } = center();
        const side = Math.random() < 0.5 ? -1 : 1;
        spawn("fx-damage companions", fmtRef.current(event.damage), x + side * (70 + Math.random() * 30), y - 30 - Math.random() * 30, 1000);
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
    };
  }, [store, pointer, monsterRef]);

  return <div ref={layer} className="fx-layer" aria-hidden="true" />;
}
