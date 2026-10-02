"use client";

import { LOCALES, SKILLS, ageForStage, formatNumber, isSkillUnlocked, negotiateLocale, type Notation } from "@idlebound/game";
import { useEffect, useState } from "react";
import { useI18n, type LocalePreference } from "@/i18n/client";
import { audio } from "../audio";
import { haptics } from "../haptics";
import { useGame } from "../context";
import { WindowIcon } from "../icons";
import { Modal } from "../components/Modal";

const NOTATIONS: Notation[] = ["letters", "scientific", "engineering"];
const PREFERENCES: LocalePreference[] = ["auto", ...LOCALES];
/** The effects slider moves in hundredths of its course. */
const VOLUME_STEPS = 100;

/**
 * The ear hears loudness on a logarithmic scale: a cube law spreads the quiet end over most
 * of the course, where a linear gain crammed it into the first few steps.
 */
function gainForStep(step: number) {
  return (step / VOLUME_STEPS) ** 3;
}

function stepForGain(gain: number) {
  return Math.round(Math.cbrt(gain) * VOLUME_STEPS);
}

export function SettingsWindow({ onClose }: { onClose: () => void }) {
  const { state, store } = useGame();
  const { t, g, preference, setPreference } = useI18n();
  const text = t.windows.settings;
  const settings = state.settings;
  const volumeStep = stepForGain(settings.volume);
  const update = (patch: Partial<typeof settings>) => store.act((engine) => Object.assign(engine.state.settings, patch));
  // Language the browser asks for, shown next to "Automatic". Read after mount (no navigator on the server).
  const [detected, setDetected] = useState<(typeof LOCALES)[number] | null>(null);
  useEffect(() => setDetected(negotiateLocale(navigator.languages)), []);
  // Vibration is a choice of this device, offered only where the browser can vibrate.
  const [vibration, setVibration] = useState<boolean | null>(null);
  useEffect(() => setVibration(haptics.supported ? haptics.on : null), []);

  return (
    <Modal title={t.hud.windowTitles.settings.label} icon={<WindowIcon id="settings" />} onClose={onClose} size="sm">
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
        <Toggle label={text.sound} hint={text.soundHint} checked={settings.sound} onChange={(value) => { update({ sound: value }); if (value) { audio.setEnabled(true); audio.unlock(); audio.play("coin"); } }} />
        <div className="setting-row">
          <label htmlFor="volume">{text.volume}</label>
          <span className="volume-control">
            <input
              id="volume"
              type="range"
              min={0}
              max={VOLUME_STEPS}
              step={1}
              value={volumeStep}
              aria-valuetext={text.volumeValue(volumeStep)}
              disabled={!settings.sound}
              onChange={(event) => update({ volume: gainForStep(Number(event.target.value)) })}
              onPointerUp={() => audio.play("hit")}
              onKeyUp={() => audio.play("hit")}
            />
            <output htmlFor="volume" className="volume-value">{text.volumeValue(volumeStep)}</output>
          </span>
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
        {vibration !== null ? (
          <Toggle label={text.vibration} hint={text.vibrationHint} checked={vibration} onChange={(value) => { haptics.setEnabled(value); setVibration(value); if (value) haptics.pulse("buy"); }} />
        ) : null}
        <Toggle label={text.damageNumbers} hint={text.damageNumbersHint} checked={settings.damageNumbers} onChange={(value) => update({ damageNumbers: value })} />
        <Toggle label={text.reducedMotion} hint={text.reducedMotionHint} checked={settings.reducedMotion} onChange={(value) => update({ reducedMotion: value })} />
        <Toggle label={text.colorblind} hint={text.colorblindHint} checked={settings.colorblind} onChange={(value) => update({ colorblind: value })} />
        <Toggle label={text.confirmAscension} hint={text.confirmAscensionHint} checked={settings.confirmAscension} onChange={(value) => update({ confirmAscension: value })} />
        {/* Only once the walker has seen a sky other than the Kingdom's (Age II and deeper). */}
        {ageForStage(state.maxStageEver) > 0 || settings.darkNight ? (
          <Toggle label={t.night.darkNight} hint={t.night.darkNightHint} checked={settings.darkNight} onChange={(value) => update({ darkNight: value })} />
        ) : null}
      </div>
      <h3 className="section-heading shortcut-heading">{text.shortcuts}</h3>
      <ul className="shortcut-list">
        {SKILLS.filter((skill) => isSkillUnlocked(state, skill.id)).map((skill) => (
          <li key={skill.id}><kbd>{skill.hotkey}</kbd> {g.skills[skill.id].name}</li>
        ))}
        <li><kbd>{text.enterKey}</kbd> {text.enterAction}</li>
        <li><kbd>{text.spaceKey}</kbd> {text.enterAction}</li>
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
