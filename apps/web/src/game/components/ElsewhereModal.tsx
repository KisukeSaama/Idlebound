"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { useCloud } from "../context";
import { Picto } from "../icons";
import { Modal } from "./Modal";

/**
 * One game, one page at a time: another page (another device, another tab) plays it, so this
 * one stands still. Playing here takes it over, and the other page stops.
 */
export function ElsewhereModal() {
  const cloud = useCloud();
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const elsewhere = cloud.elsewhere;
  if (!elsewhere) return null;
  const m = t.hud.elsewhere;
  const text = m[elsewhere];

  const playHere = async () => {
    setBusy(true);
    try {
      await cloud.takeOver();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={text.title} icon={<Picto name="swords" size={30} />} size="sm">
      <p className="ledger-voice">{text.voice}</p>
      <p className="modal-text">{text.text}</p>
      {cloud.message ? <p className="form-error" role="alert">{cloud.message}</p> : null}
      <div className="save-choice-actions">
        <button type="button" className="btn btn-gold" disabled={busy} onClick={() => void playHere()}>{m.playHere}</button>
      </div>
    </Modal>
  );
}
