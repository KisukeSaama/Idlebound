"use client";

import { ALTARS, ASCENSION_MIN_STAGE, ESSENCE_DPS_BONUS, altarCost, ascensionPreview, formatDuration } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { useFormat, useGame, useUi } from "../context";
import { EssenceIcon, WINDOW_META } from "../icons";
import { Modal } from "../components/Modal";
import { formatAltarValue } from "../text";

export function AscensionWindow({ onClose }: { onClose: () => void }) {
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
        text: text.confirmText(fmt(preview)),
        confirmLabel: text.confirmLabel
      });
      if (!ok) return;
    }
    store.act((engine, time) => engine.ascend(time));
    onClose();
  };

  return (
    <Modal title={t.hud.windowTitles.ascension.label} icon={<img src={WINDOW_META.ascension.icon!} alt="" width={34} height={34} />} onClose={onClose} size="lg">
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
          const cost = altarCost(altar.id, level);
          const maxed = !Number.isFinite(cost);
          const copy = g.altars[altar.id];
          return (
            <article key={altar.id} className={`altar card ${maxed ? "maxed" : ""}`}>
              <header>
                <h4>{copy.name}</h4>
                <span className="altar-level">{text.altarLevel(level, altar.maxLevel)}</span>
              </header>
              <p>{copy.description}</p>
              <p className="altar-value">{text.current} <strong>{formatAltarValue(altar, level, locale)}</strong>{!maxed ? <> → {formatAltarValue(altar, level + 1, locale)}</> : null}</p>
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
    </Modal>
  );
}
