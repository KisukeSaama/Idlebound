"use client";

import { WAGER_CLICKS, WAGER_SECONDS, biomeForStage, biomeName, chronicleText, eraForStage, isBossStage, isBiomeBossStage, monsterName, MONSTERS_PER_STAGE } from "@idlebound/game";
import { useEffect, useRef, useState } from "react";
import type { ArenaRenderer } from "../pixel/arena";
import { uiZoom } from "../pixel/surface";
import { currentMessages, useI18n } from "@/i18n/client";
import { useFormat, useGame, useReveals } from "../context";
import { stratumLabel } from "../shell";
import { BuffChips } from "./BuffChips";
import { CrystalView } from "./CrystalView";
import { FxLayer, type PointerMemo } from "./FxLayer";
import { Party } from "./Party";
import { SceneCanvas, monsterKeyOf } from "./SceneCanvas";
import { SkillBar } from "./SkillBar";
import { StageBar } from "./StageBar";
import { TutorialHint } from "./TutorialHint";

/** Seconds the opening line stays at the start of a run. */
const OPENING_SECONDS = 7;
/** What stays after a long absence shows this long over the scene (BIBLE 12.8). */
const DREAM_MS = 6_000;
/** Screen readers hear the fight at this pace at most; a burst keeps its latest line. */
const TELL_GAP_MS = 1_500;

export function Scene() {
  const { state, derived, store } = useGame();
  const fmt = useFormat();
  const { t, g, locale } = useI18n();
  const m = t.hud.scene;
  const pointer = useRef<PointerMemo>({ x: 0, y: 0, at: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const renderer = useRef<ArenaRenderer | null>(null);
  const biome = biomeForStage(state.stage);
  const monster = state.monster;
  const name = monster ? monsterName(monster, state.stage, locale) : "…";
  const zone = biomeName(state.stage, locale);
  const hpRatio = monster ? Math.max(0, monster.hp / monster.maxHp) : 0;
  const isBoss = monster?.kind === "boss" || monster?.kind === "miniboss";
  // Timed event creatures (the Seam's Warden, the Quiet, the Stray Armor) run on the boss
  // timer, with their own length: the longest time seen for this creature.
  const timedEvent = monster?.event === "seam" || monster?.event === "quiet" || monster?.event === "stray" ? monster.event : null;
  const timed = isBoss || timedEvent !== null;
  const timerSpan = useRef({ key: "", total: 1 });
  const wager = monster?.wager;
  const atFrontier = state.stage === state.maxStage;
  const monsterKey = monsterKeyOf(state);
  if (timerSpan.current.key !== monsterKey) timerSpan.current = { key: monsterKey, total: timedEvent ? state.bossTimeLeft : derived.bossTimer };
  timerSpan.current.total = Math.max(timerSpan.current.total, timedEvent ? state.bossTimeLeft : derived.bossTimer, 0.001);
  const timerRatio = timed ? Math.max(0, Math.min(1, state.bossTimeLeft / timerSpan.current.total)) : 0;
  const wagerLeft = wager ? Math.max(0, wager.until - Date.now()) / 1000 : 0;
  const era = eraForStage(state.stage);
  // Every run opens at dusk on the first stretch of road, with the same two words.
  const opening = state.stage === 1 && state.maxStage === 1 && state.run.playTime < OPENING_SECONDS;
  const { shown } = useReveals();

  // What stays after a long absence: one line over the scene, no numbers, then gone.
  const [dream, setDream] = useState<{ key: number; text: string } | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = store.onFx((event) => {
      if (event.type !== "dream") return;
      setDream({ key: event.index, text: chronicleText({ source: "dream", index: event.index }, locale).text });
      clearTimeout(timer);
      timer = setTimeout(() => setDream(null), DREAM_MS);
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [store, locale]);

  // The fight in words for screen readers, never every tick: a new stage, and the notable
  // creatures (guardians, elites, treasures, wanderers) as they come and as they fall.
  const [told, setTold] = useState("");
  const fmtRef = useRef(fmt);
  fmtRef.current = fmt;
  useEffect(() => {
    let lastAt = -Infinity;
    let pending: ReturnType<typeof setTimeout> | undefined;
    const tell = (text: string) => {
      clearTimeout(pending);
      const wait = lastAt + TELL_GAP_MS - performance.now();
      const say = () => {
        lastAt = performance.now();
        setTold(text);
      };
      if (wait <= 0) say();
      else pending = setTimeout(say, wait);
    };
    const unsubscribe = store.onFx((event) => {
      const words = currentMessages().hud;
      const stage = store.state.stage;
      if (event.type === "stage") tell(words.stageBar.stage(event.stage, isBossStage(event.stage)));
      else if (event.type === "spawn" && event.monster.kind !== "normal") tell(words.scene.appears(monsterName(event.monster, stage, locale), fmtRef.current(event.monster.maxHp)));
      else if (event.type === "kill" && event.monster.kind !== "normal") tell(words.scene.falls(monsterName(event.monster, stage, locale)));
    });
    return () => {
      unsubscribe();
      clearTimeout(pending);
    };
  }, [store, locale]);

  // Viewport pixels to the arena's page pixels (the interface is zoomed on large screens).
  const strike = (clientX: number, clientY: number, rect: DOMRect) => {
    const zoom = uiZoom();
    pointer.current = { x: (clientX - rect.left) / zoom, y: (clientY - rect.top) / zoom, at: performance.now() };
    store.act((engine, now) => engine.click(now), { save: false });
  };

  return (
    <section
      ref={sectionRef}
      className={`scene biome-${biome.id} ${isBoss ? "scene-boss" : ""}`}
      style={{ ["--accent" as string]: biome.accent }}
      aria-label={m.label(zone, state.stage)}
    >
      <SceneCanvas
        sectionRef={sectionRef}
        arenaRef={arenaRef}
        renderer={renderer}
        biomeId={biome.id}
        era={era}
        monster={monster}
        cleared={state.maxStage > state.stage || state.kills >= MONSTERS_PER_STAGE}
        fullMoon={state.secrets.includes("night-owl")}
        darkNight={state.settings.darkNight}
      />
      <p className="visually-hidden" role="status" aria-live="polite">{told}</p>
      {opening ? <p className="scene-opening" aria-live="polite">{g.openingLine}</p> : null}
      {dream && !opening ? <p key={dream.key} className="scene-opening scene-dream" aria-live="polite">{dream.text}</p> : null}
      <header className="scene-top">
        <div className="scene-zone">
          <span className="scene-era">{stratumLabel(state.stage, locale)}</span>
          <h1 className="scene-biome">{zone}</h1>
        </div>
        {shown.stageBar ? <StageBar /> : <div />}
        <BuffChips />
      </header>

      <div
        ref={arenaRef}
        className="scene-arena"
        role="button"
        tabIndex={0}
        aria-label={m.attack}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          strike(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect());
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          // Space would scroll the page: it strikes, like Enter.
          event.preventDefault();
          if (event.repeat) return;
          const rect = event.currentTarget.getBoundingClientRect();
          strike(rect.left + rect.width / 2, rect.top + rect.height / 2, rect);
        }}
      >
        <Party />
        <FxLayer pointer={pointer} renderer={renderer} />
        <CrystalView />
        <TutorialHint placement="arena" />
      </div>

      <div className="monster-panel">
        <div className="monster-meta">
          <span className="monster-name">
            {monster && m.kinds[monster.kind] ? <span className={`kind-badge kind-${monster.kind}`}>{m.kinds[monster.kind]}</span> : null}
            {name}
          </span>
          <span className="monster-hp">
            {wager ? t.night.wager.strikes(wager.clicks, WAGER_CLICKS) : monster ? `${fmt(Math.max(0, monster.hp))} / ${fmt(monster.maxHp)}` : ""}
          </span>
        </div>
        {wager ? (
          // Pip's Wager: strikes counted out of thirteen, and his five seconds running out.
          <>
            <div className="wager-strikes" role="img" aria-label={`${t.night.wager.label}: ${t.night.wager.strikes(wager.clicks, WAGER_CLICKS)}`}>
              {Array.from({ length: WAGER_CLICKS }, (_, index) => <span key={index} className={index < wager.clicks ? "struck" : ""} />)}
            </div>
            <div className={`boss-timer event-timer ${wagerLeft < WAGER_SECONDS * 0.3 ? "urgent" : ""}`}>
              <div className="boss-timer-fill" style={{ transform: `scaleX(${Math.min(1, wagerLeft / WAGER_SECONDS)})` }} />
              <span>{t.night.eventTimer(t.night.wager.label, wagerLeft.toFixed(1))}</span>
            </div>
          </>
        ) : (
          <div className="hp-bar" aria-hidden="true">
            <div className="hp-ghost" style={{ transform: `scaleX(${hpRatio})` }} />
            <div className="hp-fill" style={{ transform: `scaleX(${hpRatio})` }} />
          </div>
        )}
        {wager ? null : timed ? (
          <div className={`boss-timer ${timedEvent ? "event-timer" : ""} ${timerRatio < 0.3 ? "urgent" : ""}`}>
            <div className="boss-timer-fill" style={{ transform: `scaleX(${timerRatio})` }} />
            <span>
              {timedEvent
                ? t.night.eventTimer(g.events[timedEvent].name, Math.max(0, state.bossTimeLeft).toFixed(1))
                : m.seconds(Math.max(0, state.bossTimeLeft).toFixed(1))}
            </span>
          </div>
        ) : atFrontier && !isBossStage(state.stage) ? (
          <div className="kill-progress" title={m.killProgressTitle}>
            <div className="kill-progress-fill" style={{ transform: `scaleX(${state.kills / MONSTERS_PER_STAGE})` }} />
            <span>{m.killProgress(state.kills, MONSTERS_PER_STAGE)}</span>
          </div>
        ) : (
          <div className="kill-progress farm">
            <span>{isBiomeBossStage(state.stage) ? m.bossBeaten : m.farming}</span>
          </div>
        )}
      </div>

      <SkillBar />
      <TutorialHint placement="below" />
    </section>
  );
}
