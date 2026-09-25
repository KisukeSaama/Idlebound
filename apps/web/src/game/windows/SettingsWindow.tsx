"use client";

import { LOCALES, SKILLS, formatNumber, negotiateLocale, type Notation } from "@idlebound/game";
import { useEffect, useState } from "react";
import { useI18n, type LocalePreference } from "@/i18n/client";
import { audio } from "../audio";
import { useGame } from "../context";
import { WINDOW_META } from "../icons";
import { Modal } from "../components/Modal";

const NOTATIONS: Notation[] = ["letters", "scientific", "engineering"];
const PREFERENCES: LocalePreference[] = ["auto", ...LOCALES];

export function SettingsWindow({ onClose }: { onClose: () => void }) {
  const { state, store } = useGame();
  const { t, g, preference, setPreference } = useI18n();
  const text = t.windows.settings;
  const settings = state.settings;
  const update = (patch: Partial<typeof settings>) => store.act((engine) => Object.assign(engine.state.settings, patch));
  // Language the browser asks for, shown next to "Automatic". Read after mount (no navigator on the server).
  const [detected, setDetected] = useState<(typeof LOCALES)[number] | null>(null);
  useEffect(() => setDetected(negotiateLocale(navigator.languages)), []);

  return (
    <Modal title={t.hud.windowTitles.settings.label} icon={<img src={WINDOW_META.settings.icon!} alt="" width={34} height={34} />} onClose={onClose} size="sm">
      <div className="settings-list">
        <div className="setting-row">
          <span>
            <span id="language-label" className="setting-label">{text.language}</span>
            <span className="modal-hint">{text.languageHint}</span>
          </span>
          <div className="segmented" role="radiogroup" aria-labelledby="language-label">
            {PREFERENCES.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={preference === option}
                className={preference === option ? "active" : ""}
                lang={option === "auto" ? undefined : option}
                onClick={() => setPreference(option)}
              >
                {option === "auto" ? text.automatic : t.common.languageNames[option]}
                {option === "auto" && detected ? <small>{text.automaticDetected(t.common.languageNames[detected])}</small> : null}
              </button>
            ))}
          </div>
        </div>
        <Toggle label={text.sound} hint={text.soundHint} checked={settings.sound} onChange={(value) => { update({ sound: value }); if (value) { audio.unlock(); audio.enabled = true; audio.play("coin"); } }} />
        <div className="setting-row">
          <label htmlFor="volume">{text.volume}</label>
          <input id="volume" type="range" min={0} max={1} step={0.05} value={settings.volume} disabled={!settings.sound} onChange={(event) => update({ volume: Number(event.target.value) })} onPointerUp={() => audio.play("hit")} />
        </div>
        <div className="setting-row">
          <span id="notation-label">{text.notation}</span>
          <div className="segmented" role="radiogroup" aria-labelledby="notation-label">
            {NOTATIONS.map((notation) => (
              <button key={notation} type="button" role="radio" aria-checked={settings.notation === notation} className={settings.notation === notation ? "active" : ""} onClick={() => update({ notation })}>
                {text.notations[notation]}
                <small>{formatNumber(1.234e15, notation)}</small>
              </button>
            ))}
          </div>
        </div>
        <Toggle label={text.damageNumbers} hint={text.damageNumbersHint} checked={settings.damageNumbers} onChange={(value) => update({ damageNumbers: value })} />
        <Toggle label={text.reducedMotion} hint={text.reducedMotionHint} checked={settings.reducedMotion} onChange={(value) => update({ reducedMotion: value })} />
        <Toggle label={text.confirmAscension} hint={text.confirmAscensionHint} checked={settings.confirmAscension} onChange={(value) => update({ confirmAscension: value })} />
      </div>
      <h3 className="section-heading">{text.shortcuts}</h3>
      <ul className="shortcut-list">
        {SKILLS.map((skill) => (
          <li key={skill.id}><kbd>{skill.hotkey}</kbd> {g.skills[skill.id].name}</li>
        ))}
        <li><kbd>{text.enterKey}</kbd> {text.enterAction}</li>
        <li><kbd>{text.escapeKey}</kbd> {text.escapeAction}</li>
      </ul>
      <p className="modal-hint">{text.footer}</p>
    </Modal>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="setting-row toggle-row">
      <span>
        <span className="setting-label">{label}</span>
        <span className="modal-hint">{hint}</span>
      </span>
      <input type="checkbox" role="switch" className="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
