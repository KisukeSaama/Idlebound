"use client";

import {
  HERO_BY_ID,
  UPGRADE_BY_ID,
  bossForStage,
  chronicleText,
  firstUnread,
  formatDuration,
  formatNumber,
  gameText,
  guardiansPassed,
  isKingStage,
  monsterName,
  runBits,
  talentName,
  unreadChronicle,
  type AbsenceAccount,
  type ChronicleEntry
} from "@idlebound/game";
import { useState, type CSSProperties, type ReactNode } from "react";
import { useI18n } from "@/i18n/client";
import { useGame, useReveals, useUi } from "../context";
import { Picto } from "../icons";
import { PixelSprite } from "../pixel/PixelSprite";
import { awakenedSeed, portraitSource } from "../pixel/sources";
import { REUNION_SOURCES } from "../shell";
import { Modal } from "./Modal";

/** Guardians passed without a fight worth telling, shown by name before they are counted. */
const GUARDIANS_SHOWN = 3;
const TALENTS_SHOWN = 4;

interface ReunionModalProps {
  account: AbsenceAccount;
  /** Seconds the Reunion lasts. */
  seconds: number;
  onClose: () => void;
}

/**
 * The Reunion: the company tells the walker the road it held alone, and hands them one
 * fragment of the Chronicle they have not read yet (the one waiting when the window opened;
 * leaving the window marks it read).
 */
export function ReunionModal({ account, seconds, onClose }: ReunionModalProps) {
  const { state, store } = useGame();
  const ui = useUi();
  const { shown } = useReveals();
  const { t, locale } = useI18n();
  const [kept] = useState(() => {
    const unread = firstUnread(store.state, REUNION_SOURCES);
    return unread ? { ...unread, others: unreadChronicle(store.state) - 1 } : null;
  });
  const leave = (toChronicle = false) => {
    if (kept) store.act({ type: "read", source: kept.entry.source, count: kept.index + 1 });
    onClose();
    if (toChronicle) ui.openWindow("hall", "chronicle");
  };
  const g = gameText(locale);
  const n = t.night;
  const m = n.account;
  const fmt = (value: number) => formatNumber(value, state.settings.notation);
  // Gold of the night, written in its unit past stage 3500.
  const gold = (value: number) => formatNumber(value, state.settings.notation, runBits(state));
  const seed = awakenedSeed(state.settings.notation, state.settings.sound, locale);
  const portrait = (heroId: string, size: number) => (
    <span className="account-portrait" style={{ "--hero": HERO_BY_ID[heroId].color } as CSSProperties} aria-hidden="true">
      <span className="medallion-clip"><PixelSprite source={portraitSource(heroId, heroId === "awakened" ? seed : undefined)} size={size} nearest /></span>
    </span>
  );
  const boss = (stage: number) => monsterName({ id: bossForStage(stage).id, kind: "boss" }, stage, locale);

  const moments: { key: string; icon: ReactNode; title: string; caption: string; tone?: "blocked" }[] = [];
  for (const stage of account.walls) {
    moments.push({ key: `wall-${stage}`, icon: <Picto name={isKingStage(stage) ? "crown" : "swords"} size={24} />, title: boss(stage), caption: m.wall(stage) });
  }
  const passed = guardiansPassed(account).filter((stage) => !account.walls.includes(stage));
  for (const stage of passed.slice(-GUARDIANS_SHOWN)) {
    moments.push({ key: `passed-${stage}`, icon: <Picto name={isKingStage(stage) ? "crown" : "swords"} size={24} />, title: boss(stage), caption: m.passed(stage) });
  }
  const hiddenGuardians = passed.length - GUARDIANS_SHOWN;
  for (const heroId of account.hired) {
    moments.push({ key: `hired-${heroId}`, icon: portrait(heroId, 30), title: g.heroes[heroId].name, caption: m.hired });
  }
  for (const id of account.talents.slice(0, TALENTS_SHOWN)) {
    const hero = UPGRADE_BY_ID[id]?.hero.id;
    moments.push({ key: `talent-${id}`, icon: <Picto name="scroll" size={24} />, title: talentName(id, locale), caption: m.talent(hero ? g.heroes[hero].name : "") });
  }
  const hiddenTalents = account.talents.length - TALENTS_SHOWN;
  if (account.blockedAt !== null) {
    moments.push({ key: "blocked", icon: <Picto name={isKingStage(account.blockedAt) ? "crown" : "swords"} size={24} />, title: boss(account.blockedAt), caption: m.blocked(account.blockedAt), tone: "blocked" });
  }
  const more = [hiddenGuardians > 0 ? m.moreGuardians(hiddenGuardians) : null, hiddenTalents > 0 ? m.moreTalents(hiddenTalents) : null].filter(Boolean);

  return (
    <Modal
      title={n.reunionTitle}
      icon={<Picto name="campfire" size={30} />}
      onClose={() => leave()}
      size="md"
      footer={<button type="button" className="btn btn-gold" onClick={() => leave()}>{m.resume}</button>}
    >
      <p className="ledger-voice">{n.reunionText(formatDuration(seconds, locale))}</p>
      <dl className="account-facts">
        <div><dt>{m.away}</dt><dd>{formatDuration(account.seconds, locale)}</dd></div>
        <div><dt>{m.road}</dt><dd>{m.roadValue(account.fromStage, account.toStage)}</dd></div>
        <div><dt>{m.earned}</dt><dd className="is-gold">{gold(account.gold)}</dd></div>
        {/* Under one gold piece spent would read "0": nothing worth telling. */}
        {account.spent >= 1 ? <div><dt>{m.spent}</dt><dd>{gold(account.spent)}</dd></div> : null}
      </dl>
      {moments.length > 0 ? (
        <>
          <h3 className="section-heading">{m.moments}</h3>
          <ul className="account-moments">
            {moments.map((moment) => (
              <li key={moment.key} className={moment.tone === "blocked" ? "blocked" : undefined}>
                <span className="account-icon">{moment.icon}</span>
                <span className="account-line">
                  <strong>{moment.title}</strong>
                  <span>{moment.caption}</span>
                </span>
              </li>
            ))}
          </ul>
          {more.length > 0 ? <p className="modal-hint">{more.join(" · ")}</p> : null}
        </>
      ) : (
        <p className="modal-text">{m.still}</p>
      )}
      {account.levels.length > 0 ? (
        <>
          <h3 className="section-heading">{m.companions}</h3>
          <ul className="account-levels">
            {account.levels.map((entry) => (
              <li key={entry.heroId}>
                {portrait(entry.heroId, 22)}
                <span className="account-hero">{g.heroes[entry.heroId].name}</span>
                <span className="account-level">{entry.from} → {entry.to}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {kept ? <KeptFragment kept={kept} onOpen={shown.hall && kept.others > 0 ? () => leave(true) : null} /> : null}
    </Modal>
  );
}

/** One fragment the walker has not read, as the Chronicle writes it, and how many more wait there. */
function KeptFragment({ kept, onOpen }: { kept: { entry: ChronicleEntry; others: number }; onOpen: (() => void) | null }) {
  const { t, locale } = useI18n();
  const m = t.night.account;
  const line = chronicleText(kept.entry, locale);
  return (
    <>
      <h3 className="section-heading">{m.fragment}</h3>
      <div className="fragment unread">
        <blockquote>{line.text}</blockquote>
        <p className="fragment-by">{[line.by, t.chronicle.sources[kept.entry.source]].filter(Boolean).join(" · ")}</p>
      </div>
      {onOpen ? <button type="button" className="link-button account-chronicle" onClick={onOpen}>{m.moreFragments(kept.others)}</button> : null}
    </>
  );
}
