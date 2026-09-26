"use client";

import { BIOMES, STAGES_PER_BIOME, biomeForStage, eraForStage } from "@idlebound/game";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { useGame } from "../context";
import { WINDOW_META } from "../icons";
import { Modal } from "../components/Modal";

export function MapWindow({ onClose }: { onClose: () => void }) {
  const { state, store } = useGame();
  const { t, g } = useI18n();
  const text = t.windows.map;
  const [target, setTarget] = useState(String(state.stage));
  const era = eraForStage(state.stage);
  const eraStart = era * STAGES_PER_BIOME * BIOMES.length;
  const travel = (stage: number) => {
    store.act((engine) => engine.travel(stage));
    onClose();
  };

  return (
    <Modal title={t.hud.windowTitles.map.label} icon={<img src={WINDOW_META.map.icon!} alt="" width={34} height={34} />} onClose={onClose} size="lg">
      <div className="map-summary">
        <div><span className="stat-label">{text.currentStage}</span><strong>{state.stage}</strong></div>
        <div><span className="stat-label">{text.furthestThisLife}</span><strong>{state.maxStage}</strong></div>
        <div><span className="stat-label">{text.allTimeRecord}</span><strong>{state.maxStageEver}</strong></div>
        <div><span className="stat-label">{text.era}</span><strong>{g.eraName(era)}</strong></div>
      </div>
      <div className="map-grid">
        {BIOMES.map((biome) => {
          const start = eraStart + biome.index * STAGES_PER_BIOME + 1;
          const end = start + STAGES_PER_BIOME - 1;
          const reached = state.maxStage >= start;
          const current = biomeForStage(state.stage).id === biome.id;
          const cleared = state.maxStage > end;
          return (
            <button
              key={biome.id}
              type="button"
              className={`map-card ${current ? "current" : ""} ${reached ? "" : "locked"}`}
              disabled={!reached}
              onClick={() => travel(Math.min(state.maxStage, cleared ? start : Math.max(start, state.maxStage)))}
              style={{ backgroundImage: `url(${biome.background})`, ["--accent" as string]: biome.accent }}
            >
              <span className="map-card-shade" aria-hidden="true" />
              <img src={biome.boss.image} alt="" className="map-boss" />
              <span className="map-card-body">
                <span className="map-card-stages">{text.stageRange(start, end)}</span>
                <span className="map-card-name">{g.biomes[biome.id].name}</span>
                <span className="map-card-state">{cleared ? text.bossDefeated(g.monsters[biome.boss.id]) : current ? text.youAreHere : reached ? text.inProgress : text.locked}</span>
              </span>
            </button>
          );
        })}
      </div>
      <form
        className="map-travel"
        onSubmit={(event) => {
          event.preventDefault();
          const stage = Number(target);
          if (Number.isFinite(stage)) travel(stage);
        }}
      >
        <label htmlFor="travel-stage">{text.travelTo}</label>
        <input id="travel-stage" className="input" type="number" min={1} max={state.maxStage} value={target} onChange={(event) => setTarget(event.target.value)} />
        <button type="submit" className="btn btn-gold">{text.travel}</button>
        <button type="button" className="btn btn-ghost" onClick={() => travel(state.maxStage)}>{text.furthestStage}</button>
      </form>
      <p className="modal-hint">{text.hint}</p>
    </Modal>
  );
}
