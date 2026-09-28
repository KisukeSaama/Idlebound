"use client";

import { BIOMES, STAGES_PER_BIOME, STAGES_PER_ERA, ageForEra, biomeForStage, eraForStage, guardianForStage } from "@idlebound/game";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { useGame } from "../context";
import { Picto, WindowIcon } from "../icons";
import { PixelSprite } from "../pixel/PixelSprite";
import { creatureSource, sceneSource } from "../pixel/sources";
import { stratumLabelOf } from "../shell";
import { Modal } from "../components/Modal";

export function MapWindow({ onClose }: { onClose: () => void }) {
  const { state, store } = useGame();
  const { t, g, locale } = useI18n();
  const text = t.windows.map;
  const [target, setTarget] = useState(String(state.stage));
  const currentEra = eraForStage(state.stage);
  const deepestEra = eraForStage(state.maxStage);
  const [era, setEra] = useState(currentEra);
  const eraStart = era * STAGES_PER_ERA;
  const label = (value: number) => stratumLabelOf(value, g.eraName(value), locale);
  const travel = (stage: number) => {
    store.act((engine) => engine.travel(stage));
    onClose();
  };

  // The strata reached this night, grouped by Age: the ones the road can walk back to.
  const ages: { age: number; eras: number[] }[] = [];
  for (let value = 0; value <= deepestEra; value += 1) {
    const age = ageForEra(value);
    if (ages.at(-1)?.age !== age) ages.push({ age, eras: [] });
    ages.at(-1)?.eras.push(value);
  }

  return (
    <Modal title={t.hud.windowTitles.map.label} icon={<WindowIcon id="map" />} onClose={onClose} size="lg">
      <div className="map-summary">
        <div><span className="stat-label">{text.currentStage}</span><strong>{state.stage}</strong></div>
        <div><span className="stat-label">{text.furthestThisLife}</span><strong>{state.maxStage}</strong></div>
        <div><span className="stat-label">{text.allTimeRecord}</span><strong>{state.maxStageEver}</strong></div>
        <div><span className="stat-label">{text.era}</span><strong>{label(currentEra)}</strong></div>
      </div>
      {deepestEra > 0 ? (
        <div className="map-strata">
          <label htmlFor="map-stratum">{t.night.map.stratum}</label>
          <select id="map-stratum" className="input" value={era} onChange={(event) => setEra(Number(event.target.value))}>
            {ages.map((group) => (
              <optgroup key={group.age} label={g.strata.ages[group.age] ?? ""}>
                {group.eras.map((value) => (
                  <option key={value} value={value}>
                    {t.night.map.stratumOption(label(value), value * STAGES_PER_ERA + 1, (value + 1) * STAGES_PER_ERA)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      ) : null}
      <div className="map-grid">
        {BIOMES.map((biome) => {
          const start = eraStart + biome.index * STAGES_PER_BIOME + 1;
          const end = start + STAGES_PER_BIOME - 1;
          // Only the stretches of road already walked this night.
          if (state.maxStage < start) return null;
          const current = eraForStage(state.stage) === era && biomeForStage(state.stage).id === biome.id;
          const cleared = state.maxStage > end;
          const guardian = guardianForStage(end).id;
          return (
            <button
              key={biome.id}
              type="button"
              className={`map-card ${current ? "current" : ""}`}
              onClick={() => travel(Math.min(state.maxStage, cleared ? start : Math.max(start, state.maxStage)))}
              style={{ ["--accent" as string]: biome.accent }}
            >
              <PixelSprite source={sceneSource(biome.id, era)} size="parent" cover className="map-scene" />
              <span className="map-card-shade" aria-hidden="true" />
              <PixelSprite source={creatureSource(guardian, era, false)} size={110} className="map-boss" />
              <span className="map-card-body">
                <span className="map-card-stages">{text.stageRange(start, end)}</span>
                <span className="map-card-name">{g.biomes[biome.id].name}</span>
                <span className="map-card-state">{cleared ? <Picto name="check" size={14} className="map-card-check" /> : null}{cleared ? text.bossDefeated(g.monsters[guardian] ?? g.monsters[biome.boss.id]) : current ? text.youAreHere : text.inProgress}</span>
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
