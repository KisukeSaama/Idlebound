"use client";

import { formatDuration } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { useFormat, useGame } from "../context";
import { GoldIcon, Picto } from "../icons";
import { Modal } from "./Modal";

export function OfflineModal() {
  const { store } = useGame();
  const fmt = useFormat();
  const { t, locale } = useI18n();
  const m = t.hud.offline;
  const summary = store.offlineSummary;
  if (!summary) return null;
  const close = () => store.dismissOffline();
  return (
    <Modal
      title={m.title}
      icon={<Picto name="moon" size={30} />}
      size="sm"
      onClose={close}
      footer={<button type="button" className="btn btn-gold" onClick={close}>{m.resume}</button>}
    >
      <p className="modal-text">
        {m.intro}<strong>{formatDuration(summary.seconds, locale)}</strong>{m.introEnd}
      </p>
      <div className="offline-rewards">
        <div className="offline-reward">
          <span className="offline-value">{fmt(summary.kills)}</span>
          <span className="offline-label">{m.kills}</span>
        </div>
        <div className="offline-reward gold">
          <span className="offline-value"><GoldIcon size={22} /> {fmt(summary.gold)}</span>
          <span className="offline-label">{m.gold}</span>
        </div>
      </div>
      {summary.efficiency < 1 ? (
        <p className="modal-hint">{m.efficiency(Math.round(summary.efficiency * 100))}</p>
      ) : null}
      {summary.kills === 0 ? <p className="modal-hint">{m.noCompanions}</p> : null}
    </Modal>
  );
}
