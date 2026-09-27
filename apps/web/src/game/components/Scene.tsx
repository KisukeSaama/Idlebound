"use client";

import { biomeForStage, biomeName, eraLabel, isBossStage, isBiomeBossStage, monsterName, MONSTERS_PER_STAGE } from "@idlebound/game";
import { useRef } from "react";
import { useI18n } from "@/i18n/client";
import { useFormat, useGame } from "../context";
import { BuffChips } from "./BuffChips";
import { CrystalView } from "./CrystalView";
import { FxLayer, type PointerMemo } from "./FxLayer";
import { Party } from "./Party";
import { SkillBar } from "./SkillBar";
import { StageBar } from "./StageBar";
import { TutorialHint } from "./TutorialHint";

export function Scene() {
  const { state, derived, store } = useGame();
  const fmt = useFormat();
  const { t, locale } = useI18n();
  const m = t.hud.scene;
  const pointer = useRef<PointerMemo>({ x: 0, y: 0, at: 0 });
  const monsterRef = useRef<HTMLDivElement>(null);
  const biome = biomeForStage(state.stage);
  const monster = state.monster;
  const name = monster ? monsterName(monster, state.stage, locale) : "…";
  const zone = biomeName(state.stage, locale);
  const hpRatio = monster ? Math.max(0, monster.hp / monster.maxHp) : 0;
  const isBoss = monster?.kind === "boss" || monster?.kind === "miniboss";
  const timerRatio = isBoss ? Math.max(0, state.bossTimeLeft / derived.bossTimer) : 0;
  const atFrontier = state.stage === state.maxStage;
  const monsterKey = `${state.stage}-${state.lifetime.kills}-${state.lifetime.bossFails}`;

  const strike = (clientX: number, clientY: number, rect: DOMRect) => {
    pointer.current = { x: clientX - rect.left, y: clientY - rect.top, at: performance.now() };
    store.act((engine, now) => engine.click(now), { save: false });
  };

  return (
    <section
      className={`scene biome-${biome.id} ${isBoss ? "scene-boss" : ""}`}
      style={{ backgroundImage: `url(${biome.background})`, ["--accent" as string]: biome.accent }}
      aria-label={m.label(zone, state.stage)}
    >
      <div className="scene-vignette" aria-hidden="true" />
      <header className="scene-top">
        <div className="scene-zone">
          <span className="scene-era">{eraLabel(state.stage, locale)}</span>
          <h1 className="scene-biome">{zone}</h1>
        </div>
        <StageBar />
        <BuffChips />
      </header>

      <div
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
          if (event.key !== "Enter" || event.repeat) return;
          const rect = event.currentTarget.getBoundingClientRect();
          strike(rect.left + rect.width / 2, rect.top + rect.height / 2, rect);
        }}
      >
        <div className="monster-slot">
          {monster ? (
            <div key={monsterKey} ref={monsterRef} className={`monster monster-${monster.kind}`} style={{ ["--scale" as string]: monster.scale }}>
              <div className="monster-shadow" aria-hidden="true" />
              <img src={monster.image} alt={name} draggable={false} style={{ filter: monster.filter }} className="monster-sprite" />
            </div>
          ) : null}
        </div>
        <Party />
        <FxLayer pointer={pointer} monsterRef={monsterRef} />
        <CrystalView />
        <TutorialHint />
      </div>

      <div className="monster-panel">
        <div className="monster-meta">
          <span className="monster-name">
            {monster && m.kinds[monster.kind] ? <span className={`kind-badge kind-${monster.kind}`}>{m.kinds[monster.kind]}</span> : null}
            {name}
          </span>
          <span className="monster-hp">{monster ? `${fmt(Math.max(0, monster.hp))} / ${fmt(monster.maxHp)}` : ""}</span>
        </div>
        <div className="hp-bar" aria-hidden="true">
          <div className="hp-ghost" style={{ transform: `scaleX(${hpRatio})` }} />
          <div className="hp-fill" style={{ transform: `scaleX(${hpRatio})` }} />
        </div>
        {isBoss ? (
          <div className={`boss-timer ${timerRatio < 0.3 ? "urgent" : ""}`}>
            <div className="boss-timer-fill" style={{ transform: `scaleX(${timerRatio})` }} />
            <span>{m.seconds(Math.max(0, state.bossTimeLeft).toFixed(1))}</span>
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
    </section>
  );
}
