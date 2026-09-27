"use client";

import { HERO_BY_ID, type GameEvent } from "@idlebound/game";
import { useEffect, useRef, type RefObject } from "react";
import { currentMessages } from "@/i18n/client";
import { useFormat, useStoreRef } from "../context";
import { SLASH_PIXEL, slashColumns, slashRows, slashSprite } from "../pixelSlash";

export interface PointerMemo {
  x: number;
  y: number;
  at: number;
}

const MAX_NODES = 36;
/** Visible companion strikes per "dps" event (one event per second). */
const COMPANION_STRIKES = 3;

/**
 * Visual effects (damage numbers, companion strikes, gold, dying sprite) handled directly in
 * the DOM: dozens of elements per second without ever re-rendering React.
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

    /**
     * A companion hits: its medallion in the party lunges, a pixel-art blade trail in its
     * color lands on the monster's body, and the monster flinches lightly (never over the
     * player's own hits).
     */
    const companionStrike = () => {
      const root = layer.current;
      const monster = monsterRef.current;
      if (!root || !store.state.monster || reducedMotion()) return;
      const heroId = pickCompanion();
      if (!heroId) return;
      const box = spriteBox();
      if (!box) return;
      const columns = slashColumns(box.width);
      const sprite = slashSprite(HERO_BY_ID[heroId].color, columns);
      if (!sprite) return;
      while (root.childElementCount >= MAX_NODES) root.firstElementChild?.remove();
      // Aim at the body (the middle of the sprite, where its transparent margins end).
      const slash = document.createElement("span");
      slash.className = "fx-slash";
      slash.style.left = `${box.x + box.width * (0.3 + Math.random() * 0.4)}px`;
      slash.style.top = `${box.y + box.height * (0.3 + Math.random() * 0.35)}px`;
      slash.style.width = `${columns * SLASH_PIXEL}px`;
      slash.style.height = `${slashRows(columns) * SLASH_PIXEL}px`;
      slash.style.backgroundImage = `url(${sprite})`;
      // Arcs cut from either side, never straight up or down.
      slash.style.setProperty("--angle", `${(Math.random() < 0.5 ? 0 : 180) - 35 + Math.random() * 70}deg`);
      root.appendChild(slash);
      setTimeout(() => slash.remove(), 380);
      const member = root.parentElement?.querySelector<HTMLElement>(`.party-member[data-hero="${heroId}"]`);
      member?.animate(
        [
          { transform: "translateX(0) scale(1)", filter: "brightness(1)" },
          { transform: "translateX(7px) scale(1.12)", filter: "brightness(1.5)", offset: 0.35 },
          { transform: "translateX(0) scale(1)", filter: "brightness(1)" }
        ],
        { duration: 260, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
      if (monster && reaction?.playState !== "running") {
        reactionSource = "companion";
        reaction = monster.animate(
          [
            { transform: "translate(0, 0)", filter: "brightness(1)" },
            { transform: `translate(${Math.random() < 0.5 ? -2 : 2}px, 1px)`, filter: "brightness(1.35)" },
            { transform: "translate(0, 0)", filter: "brightness(1)" }
          ],
          { duration: 110, easing: "ease-out" }
        );
      }
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
      for (const id of timers) clearTimeout(id);
    };
  }, [store, pointer, monsterRef]);

  return <div ref={layer} className="fx-layer" aria-hidden="true" />;
}
