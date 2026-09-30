"use client";

import { formatDuration, intlLocale } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { summarize } from "../cloud";
import { useCloud, useGame, useUi } from "../context";
import { Picto } from "../icons";
import { Modal } from "./Modal";

/**
 * Two different games (this page and the server): the player picks which one to keep. The
 * server's is the account's, or for a guest the one another page of this browser carried on.
 */
export function CloudChoiceModal() {
  const cloud = useCloud();
  const ui = useUi();
  const { state } = useGame();
  const { t, locale } = useI18n();
  const m = t.hud.cloudChoice;
  const guest = cloud.user === null;
  const choice = cloud.pendingChoice;
  if (!choice) return null;
  const local = summarize(state);
  const remote = summarize(choice.state);

  const card = (label: string, summary: ReturnType<typeof summarize>, recommended: boolean) => (
    <div className={`save-card ${recommended ? "recommended" : ""}`}>
      <h3>{label}{recommended ? <span className="save-best">{m.best}</span> : null}</h3>
      <dl>
        <div><dt>{m.bestStage}</dt><dd>{summary.maxStage}</dd></div>
        <div><dt>{m.ascensions}</dt><dd>{summary.ascensions}</dd></div>
        <div><dt>{m.playTime}</dt><dd>{formatDuration(summary.playTime, locale)}</dd></div>
        <div><dt>{m.lastActivity}</dt><dd>{new Date(summary.savedAt).toLocaleString(intlLocale(locale), { dateStyle: "short", timeStyle: "short" })}</dd></div>
      </dl>
    </div>
  );

  const localBetter = local.maxStage > remote.maxStage || (local.maxStage === remote.maxStage && local.playTime >= remote.playTime);

  // Keeping the weaker game erases the stronger one on the server: say what goes, and ask.
  const keepCurrent = async () => {
    if (!localBetter) {
      const confirmed = await ui.confirm({
        title: guest ? m.guest.weakerTitle : m.weakerTitle,
        text: (guest ? m.guest.weakerText : m.weakerText)(remote.maxStage, remote.ascensions, formatDuration(remote.playTime, locale)),
        confirmLabel: m.keepCurrent,
        danger: true
      });
      if (!confirmed) return;
    }
    await cloud.resolveChoice("local");
  };

  return (
    <Modal title={m.title} icon={<Picto name="swords" size={30} />} size="md">
      <p className="ledger-voice">{guest ? t.account.ledger.guestConflict : t.account.ledger.conflict}</p>
      <p className="modal-text">{guest ? m.guest.text : m.text}</p>
      <div className="save-compare">
        {card(m.current, local, localBetter)}
        {card(guest ? m.guest.kept : m.account, remote, !localBetter)}
      </div>
      <div className="save-choice-actions">
        <button type="button" className="btn btn-ghost" onClick={() => void keepCurrent()}>{m.keepCurrent}</button>
        <button type="button" className="btn btn-gold" onClick={() => void cloud.resolveChoice("cloud")}>{guest ? m.guest.takeKept : m.takeAccount}</button>
      </div>
    </Modal>
  );
}
