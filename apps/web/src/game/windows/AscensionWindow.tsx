"use client";

import {
  ALTARS,
  ASCENSION_MIN_STAGE,
  ESSENCE_DPS_BONUS,
  WEAVES,
  altarMaxLevel,
  altarPrice,
  ascensionPreview,
  canDescend,
  descentPreview,
  formatDuration,
  weaveCost,
  weaveLevel,
  weaveValue
} from "@idlebound/game";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { useFormat, useGame, useUi } from "../context";
import { EssenceIcon, WindowIcon } from "../icons";
import { Modal } from "../components/Modal";
import { formatAltarValue } from "../text";
import { PlaceHeading } from "./PlaceBanner";

/** An altar's legend shows once it reaches this level (the engine writes it to the Chronicle then). */
const LEGEND_LEVEL = 5;

type Tab = "sanctum" | "loom";

export function AscensionWindow({ onClose }: { onClose: () => void }) {
  const { state } = useGame();
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("sanctum");
  // Eldra's Loom shows once the Descent is possible, and stays after the first one.
  const loomOpen = canDescend(state) || state.descents > 0;
  const active: Tab = loomOpen ? tab : "sanctum";
  return (
    <Modal
      title={t.hud.windowTitles.ascension.label}
      icon={<WindowIcon id="ascension" />}
      onClose={onClose}
      size="lg"
      tabs={loomOpen ? [{ id: "sanctum", label: t.sanctum.sanctumTab }, { id: "loom", label: t.sanctum.loomTab }] : undefined}
      activeTab={active}
      onTab={(id) => setTab(id as Tab)}
    >
      {active === "loom" ? <Loom onClose={onClose} /> : <Sanctum onClose={onClose} />}
    </Modal>
  );
}

function Sanctum({ onClose }: { onClose: () => void }) {
  const { state, store } = useGame();
  const { t, g, locale } = useI18n();
  const text = t.windows.ascension;
  const ui = useUi();
  const fmt = useFormat();
  const now = Date.now();
  const preview = ascensionPreview(state, now);
  const canAscend = store.engine.canAscend();

  const ascend = async () => {
    if (state.settings.confirmAscension) {
      const ok = await ui.confirm({
        title: text.confirmTitle,
        text: `${text.confirmText(fmt(preview))} ${t.sanctum.kingWaits}`,
        confirmLabel: text.confirmLabel
      });
      if (!ok) return;
    }
    store.act((engine, time) => engine.ascend(time));
    onClose();
  };

  return (
    <>
      <PlaceHeading id="sanctum" />
      <section className="ascension-hero">
        <div className="ascension-stats">
          <div>
            <span className="stat-label">{text.essences}</span>
            <strong className="essence-value"><EssenceIcon size={22} /> {fmt(state.essences)}</strong>
            <span className="modal-hint">{text.essenceBonus(fmt(state.essences * ESSENCE_DPS_BONUS * 100))}</span>
          </div>
          <div>
            <span className="stat-label">{text.ascensions}</span>
            <strong>{state.lifetime.ascensions}</strong>
            <span className="modal-hint">{text.totalCollected(fmt(state.lifetime.essencesEarned))}</span>
          </div>
        </div>
        <div className="ascension-action">
          {canAscend ? (
            <>
              <p>{text.fromStage} <strong>{state.maxStage}</strong>{text.colon} <strong className="essence-value">{text.gain(fmt(preview))}</strong></p>
              <button type="button" className="btn btn-violet btn-lg" onClick={() => void ascend()}>{text.ascend}</button>
            </>
          ) : (
            <>
              <p>{text.lockedBefore} <strong>{text.fallenKing}</strong> {text.lockedAfter(ASCENSION_MIN_STAGE - 1)}</p>
              <div className="progress-line"><span style={{ width: `${Math.min(100, (state.maxStage / ASCENSION_MIN_STAGE) * 100)}%` }} /></div>
              <p className="modal-hint">{text.progress(state.maxStage, ASCENSION_MIN_STAGE)}</p>
            </>
          )}
        </div>
      </section>

      <h3 className="section-heading">{text.altars}</h3>
      <p className="modal-hint">{text.altarsHint}</p>
      <div className="altar-grid">
        {ALTARS.map((altar) => {
          const level = state.altars[altar.id] ?? 0;
          const max = altarMaxLevel(state, altar.id);
          const cost = altarPrice(state, altar.id);
          const maxed = !Number.isFinite(cost);
          const copy = g.altars[altar.id];
          const legend = level >= LEGEND_LEVEL || state.lore.altars.includes(altar.id) ? g.altarLegends[altar.id] : undefined;
          return (
            <article key={altar.id} className={`altar card ${maxed ? "maxed" : ""}`}>
              <header>
                <h4>{copy.name}</h4>
                <span className="altar-level">{text.altarLevel(level, max)}</span>
              </header>
              <p>{copy.description}</p>
              <p className="altar-value">{text.current} <strong>{formatAltarValue(altar, level, locale, max)}</strong>{!maxed ? <> → {formatAltarValue(altar, level + 1, locale, max)}</> : null}</p>
              {legend ? (
                <details className="altar-legend">
                  <summary title={`${legend.text} (${legend.by})`}>{t.sanctum.legendSummary}</summary>
                  <blockquote>
                    <p>{legend.text}</p>
                    <cite>{legend.by}</cite>
                  </blockquote>
                </details>
              ) : null}
              <button
                type="button"
                className="btn btn-violet btn-sm"
                disabled={maxed || cost > state.essences}
                onClick={() => store.act((engine, time) => engine.buyAltar(altar.id, time))}
              >
                {maxed ? text.maximum : <><EssenceIcon size={14} /> {fmt(cost)}</>}
              </button>
            </article>
          );
        })}
      </div>

      {state.ascensions.length > 0 ? (
        <>
          <h3 className="section-heading">{text.history}</h3>
          <ol className="ascension-history">
            {[...state.ascensions].reverse().slice(0, 8).map((record) => (
              <li key={record.at}>
                <span>{text.historyStage(record.maxStage)}</span>
                <span className="essence-value">+{fmt(record.essences)}</span>
                <span className="modal-hint">{text.ago(formatDuration((now - record.at) / 1000, locale))}</span>
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </>
  );
}

/** Essences to gather since the last Descent for the next thread: `threadsFor` inverted. */
function nextThreadAt(threads: number): number {
  return Math.pow(10, 5 + (threads + 1) / 2);
}

/** Eldra's Loom (BIBLE 12.7): the Descent and the eight Weaves. */
function Loom({ onClose }: { onClose: () => void }) {
  const { state, store } = useGame();
  const { t, g } = useI18n();
  const text = t.sanctum.loom;
  const ui = useUi();
  const fmt = useFormat();
  const preview = descentPreview(state);
  const stones = weaveValue(state, "remembered-stones");
  const possible = canDescend(state);

  const descend = async () => {
    const ok = await ui.confirm({
      title: text.confirmTitle,
      text: text.confirmText(fmt(preview), preview === 0),
      confirmLabel: text.confirmLabel,
      danger: true
    });
    if (!ok) return;
    store.act((engine, time) => engine.descend(time));
    onClose();
  };

  return (
    <>
      <PlaceHeading id="loom" />
      <section className="ascension-hero loom-hero">
        <div className="ascension-stats">
          <div>
            <span className="stat-label">{text.threads}</span>
            <strong className="thread-value">{fmt(state.threads)}</strong>
            <span className="modal-hint">{text.threadsTotal(fmt(state.lifetime.threads))}</span>
          </div>
          <div>
            <span className="stat-label">{text.descents}</span>
            <strong>{state.descents}</strong>
          </div>
        </div>
        <div className="ascension-action">
          <p>{text.preview} <strong className="thread-value">{text.threadsCount(fmt(preview))}</strong></p>
          <p className="modal-hint">{text.nextThread(fmt(nextThreadAt(preview)))}</p>
          <button type="button" className="btn btn-violet btn-lg" disabled={!possible} onClick={() => void descend()}>{text.descend}</button>
        </div>
      </section>

      <div className="loom-terms">
        <div>
          <h4>{text.takesTitle}</h4>
          <ul>{text.takes.map((line) => <li key={line}>{line}</li>)}</ul>
          {stones > 0 ? <p className="modal-hint">{text.stonesKept(Math.round(stones * 100))}</p> : null}
        </div>
        <div>
          <h4>{text.keepsTitle}</h4>
          <ul>{text.keeps.map((line) => <li key={line}>{line}</li>)}</ul>
        </div>
      </div>

      <h3 className="section-heading">{text.weaves}</h3>
      <p className="modal-hint">{text.weavesHint}</p>
      <div className="altar-grid">
        {WEAVES.map((weave) => {
          const level = weaveLevel(state, weave.id);
          const cost = weaveCost(weave.id, level);
          const woven = !Number.isFinite(cost);
          const copy = g.weaves[weave.id];
          return (
            <article key={weave.id} className={`altar weave card ${woven ? "maxed" : ""}`}>
              <header>
                <h4>{copy.name}</h4>
                {weave.id === "seventh-night" ? <span className="altar-level">{text.power}</span> : <span className="altar-level">{text.weaveLevel(level, weave.maxLevel)}</span>}
              </header>
              <p>{copy.description}</p>
              <button
                type="button"
                className="btn btn-violet btn-sm"
                disabled={woven || cost > state.threads}
                onClick={() => store.act((engine, time) => engine.buyWeave(weave.id, time))}
              >
                {woven ? text.woven : text.threadsCount(fmt(cost))}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}
