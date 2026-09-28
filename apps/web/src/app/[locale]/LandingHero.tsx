"use client";

/**
 * The landing hero: the Keep at night in its three planes (the sky, the ruins, the frame of
 * the foreground), shifting with the pointer in whole art pixels, and the Fallen King on his
 * ground, at the scene's own scale, who takes the visitor's blows. The world never blurs: every
 * plane shares one whole scale and every shift is a whole number of art pixels.
 */
import { SCENE_FLOOR, SCENE_HEIGHT, SCENE_WIDTH } from "@idlebound/game/art";
import { bossHp, formatNumber } from "@idlebound/game";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Art } from "@/game/pixel/Art";
import { renderCreature } from "@/game/pixel/creature";
import { pageRect, pixelRatio, prefersReducedMotion, uiZoom } from "@/game/pixel/surface";

const KING = "ruined-king";
const BIOME = "fallen-king-ruins";
/** How far each plane travels, in art pixels, from the middle of the hero to its edge. */
const TRAVEL = { far: 2, middle: 6, near: 12 } as const;
/** The Fallen King's health at his first throne, stage 50. */
const KING_HP = bossHp(50);
/** A blow and a critical blow (ten times), the fifth blow of each run of five. */
const BLOW = KING_HP / 26;
/** The phone layout of the landing (landing.css): the Keep above the words. */
const PHONE = 760;
/** Where the King stands, in art pixels right of the scene's middle (closer on a phone's narrow view). */
const KING_X = 72;
const KING_X_PHONE = 36;

type Text = {
  titleLead: string;
  titleAccent: string;
  lead: string;
  play: string;
  leaderboard: string;
  back: string;
  backLink: string;
  kingName: string;
  boss: { rank: string; strike: string; hint: string; again: string; crit: string; fallen: string };
};

type Hit = { id: number; x: number; y: number; value: string; crit: boolean };

function reduced(): boolean {
  return prefersReducedMotion() || document.documentElement.classList.contains("reduced-motion");
}

export function LandingHero({ text, playHref, leaderboardHref }: { text: Text; playHref: string; leaderboardHref: string }) {
  const hero = useRef<HTMLElement>(null);
  const planes = useRef<Record<keyof typeof TRAVEL, HTMLDivElement | null>>({ far: null, middle: null, near: null });
  const [view, setView] = useState({ scale: 0, columns: SCENE_WIDTH, kingX: KING_X });
  const [hp, setHp] = useState(KING_HP);
  const [line, setLine] = useState(text.boss.hint);
  const [hits, setHits] = useState<Hit[]>([]);
  const [struck, setStruck] = useState(false);
  const blows = useRef(0);
  const nextId = useRef(0);
  const feet = useMemo(() => {
    const sprite = renderCreature(KING);
    return { below: sprite.pixels.h - 1 - sprite.feet, width: sprite.pixels.w };
  }, []);

  // One whole scale for the whole scene, chosen from the room the screen gives it: the hero
  // is exactly as tall as the scene, and the view widens (as the arena does) to fill the width.
  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    const layout = () => {
      const ratio = pixelRatio();
      const phone = window.innerWidth <= PHONE;
      // The window in page pixels: a large screen zooms the page (globals.css).
      const zoom = uiZoom();
      const room = phone ? 340 : Math.max(560, Math.min((window.innerHeight * 0.9) / zoom, (window.innerWidth * 0.52) / zoom, 820));
      const device = Math.max(1, Math.floor((room * ratio) / SCENE_HEIGHT));
      const css = device / ratio;
      // Enough columns for the width and the farthest shift on both sides, in steps of 16.
      const columns = Math.ceil(((element.clientWidth / css) + 4 * TRAVEL.near) / 16) * 16;
      element.style.setProperty("--world-h", `${SCENE_HEIGHT * css}px`);
      const kingX = phone ? KING_X_PHONE : KING_X;
      setView((current) => (current.scale === css && current.columns === columns && current.kingX === kingX ? current : { scale: css, columns, kingX }));
    };
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, []);
  const scale = view.scale;

  const shift = (ratio: number) => {
    if (!scale) return;
    for (const depth of Object.keys(TRAVEL) as (keyof typeof TRAVEL)[]) {
      const plane = planes.current[depth];
      if (!plane) continue;
      const pixels = Math.round(-ratio * 2 * TRAVEL[depth]);
      plane.style.transform = `translateX(${pixels * scale}px)`;
    }
  };

  const onMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || reduced()) return;
    const box = event.currentTarget.getBoundingClientRect();
    shift((event.clientX - box.left) / box.width - 0.5);
  };

  const strike = (x: number, y: number) => {
    if (hp <= 0) return;
    blows.current += 1;
    const crit = blows.current % 5 === 0;
    const damage = crit ? BLOW * 10 : BLOW;
    const left = Math.max(0, hp - damage);
    setHp(left);
    setLine(left === 0 ? text.boss.fallen : crit ? text.boss.crit : text.boss.again);
    setStruck(true);
    window.setTimeout(() => setStruck(false), 90);
    const id = nextId.current++;
    setHits((current) => [...current.slice(-5), { id, x, y, value: formatNumber(damage), crit }]);
    window.setTimeout(() => setHits((current) => current.filter((hit) => hit.id !== id)), reduced() ? 600 : 1000);
    if (left === 0) {
      window.setTimeout(() => {
        blows.current = 0;
        setHp(KING_HP);
        setLine(text.boss.hint);
      }, 2600);
    }
  };

  const onStrike = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!hero.current) return;
    const box = pageRect(hero.current);
    const zoom = uiZoom();
    strike(event.clientX / zoom - box.left, event.clientY / zoom - box.top);
  };

  const onKey = () => {
    const element = hero.current?.querySelector(".hero-king");
    if (!element || !hero.current) return;
    const king = pageRect(element);
    const box = pageRect(hero.current);
    strike(king.left - box.left + king.width / 2, king.top - box.top + king.height / 3);
  };

  const share = hp / KING_HP;
  const kingStyle = scale
    ? { bottom: `${(SCENE_HEIGHT - SCENE_FLOOR - feet.below) * scale}px`, left: `calc(50% + ${(view.kingX - Math.round(feet.width / 2)) * scale}px)` }
    : { visibility: "hidden" as const };
  const plane = (depth: keyof typeof TRAVEL) => (scale ? <Art spec={{ kind: "depth", biome: BIOME, depth, width: view.columns }} scale={scale} /> : null);

  return (
    <section ref={hero} className="hero" onPointerMove={onMove} onPointerLeave={() => shift(0)} aria-labelledby="hero-title">
      <div className="hero-world">
        <div className="hero-plane" ref={(node) => { planes.current.far = node; }} aria-hidden="true">
          {plane("far")}
        </div>
        <div className="hero-plane" ref={(node) => { planes.current.middle = node; }}>
          {plane("middle")}
          <button
            type="button"
            className={struck ? "hero-king struck" : "hero-king"}
            style={kingStyle}
            onPointerDown={onStrike}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onKey(); } }}
            aria-label={text.boss.strike}
          >
            {scale ? <Art spec={{ kind: "creature", id: KING }} scale={scale} /> : null}
          </button>
        </div>
        <div className="hero-plane hero-near" ref={(node) => { planes.current.near = node; }} aria-hidden="true">
          {plane("near")}
        </div>
      </div>
      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title">{text.titleLead}<span>{text.titleAccent}</span></h1>
          <p className="hero-lead">{text.lead}</p>
          <div className="hero-cta">
            <Link href={playHref} className="btn btn-gold btn-lg">{text.play}</Link>
            <Link href={leaderboardHref} className="hero-link">{text.leaderboard}</Link>
          </div>
          <p className="hero-note">{text.back} <Link href={playHref}>{text.backLink}</Link></p>
        </div>
      </div>

      <div className="hero-plate" aria-live="polite">
        <p className="hero-plate-name">{text.kingName} <small>{text.boss.rank}</small></p>
        <div className="hero-hp" role="img" aria-label={`${formatNumber(hp)} / ${formatNumber(KING_HP)}`}>
          <i className="hero-hp-ghost" style={{ right: `${(1 - share) * 100}%` }} />
          <b style={{ right: `${(1 - share) * 100}%` }} />
          <span>{formatNumber(hp)} / {formatNumber(KING_HP)}</span>
        </div>
        <p className="hero-plate-line">{line}</p>
      </div>

      <div className="hero-fx" aria-hidden="true">
        {hits.map((hit) => (
          <span key={hit.id} className={hit.crit ? "hero-dmg crit" : "hero-dmg"} style={{ left: hit.x, top: hit.y }}>{hit.value}</span>
        ))}
      </div>
    </section>
  );
}
