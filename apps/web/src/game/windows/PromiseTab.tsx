"use client";

import {
  HERO_BY_ID,
  PROMISES,
  PROMISE_BY_HERO,
  companionMet,
  promiseAskable,
  promiseAsker,
  promiseHolds,
  promiseWhen,
  promiseText,
  promisesAwaited,
  promisesKept,
  recognitionNeeds,
  standingPromise,
  type GameState,
  type PromiseDef
} from "@idlebound/game";
import type { CSSProperties } from "react";
import { useI18n } from "@/i18n/client";
import { useGame, useUi } from "../context";
import { Picto } from "../icons";
import { PixelSprite } from "../pixel/PixelSprite";
import { awakenedSeed, portraitSource } from "../pixel/sources";
import { describePromise } from "../text";

/** How the word given this night stands: given, kept so far, or broken. */
export type PromiseStatus = "given" | "ready" | "broken";

export function promiseStatus(state: GameState): PromiseStatus | null {
  const promise = state.trail.promise;
  if (!promise) return null;
  return promise.broken ? "broken" : promiseHolds(state) ? "ready" : "given";
}

/**
 * Inside a window the toasts wait, so what the word given forbids there is said in place:
 * who holds the walker's word, and what it asks.
 */
export function PromiseNotice({ when }: { when: boolean }) {
  const { state } = useGame();
  const { t, g, locale } = useI18n();
  const standing = standingPromise(state);
  if (!when || !standing) return null;
  return (
    <p className="promise-notice" role="note">
      <Picto name="knot" size={16} />
      <span><strong>{t.sanctum.promise.toasts.held(g.heroes[standing.def.hero].name)}</strong> {describePromise(standing.def, locale, standing.progress.goal)}</span>
    </p>
  );
}

/**
 * The Promise (BIBLE 12.11), in the Sanctum: the word given for this night, and the
 * companions met, each with what they ask. One word a night, chosen at dusk.
 */
export function PromiseTab() {
  const { state, store } = useGame();
  const { t, g, locale } = useI18n();
  const ui = useUi();
  const text = t.sanctum.promise;
  const given = state.trail.promise;
  const status = promiseStatus(state);
  const seed = awakenedSeed(state.settings.notation, state.settings.sound, locale);

  const portrait = (heroId: string) => (
    <span className="promise-portrait" style={{ "--hero": HERO_BY_ID[heroId].color } as CSSProperties} aria-hidden="true">
      <span className="medallion-clip"><PixelSprite source={portraitSource(heroId, heroId === "awakened" ? seed : undefined)} size="parent" nearest /></span>
    </span>
  );

  const breakWord = async () => {
    if (!given) return;
    const ok = await ui.confirm({ title: text.breakTitle, text: text.breakText, confirmLabel: text.breakLabel, danger: true });
    if (ok) store.act((engine, now) => engine.breakPromise(now));
  };

  // Companions met, in the order of the road. One whose request cannot be granted yet (a
  // companion to leave behind who was never met, a night deeper than the walker ever went)
  // waits until it can; Brom stays, and says what he is missing.
  const unarmed = (def: PromiseDef) => def.kind === "anvil" && companionMet(state, def.hero) && promiseAsker(state, def.hero) && !state.equipment.weapon;
  const roster = PROMISES.filter((def) => promiseAskable(state, def.hero) || unarmed(def));

  return (
    <>
      <p className="modal-hint promise-hint">{text.hint}</p>

      <h3 className="section-heading">{text.tonight}</h3>
      {given && status ? (
        <section className={`promise-night promise-${status}`}>
          {portrait(given.hero)}
          <div className="promise-body">
            <header>
              <h4>{g.heroes[given.hero].name}</h4>
              <span className="promise-status"><Picto name={status === "broken" ? "frayed" : "knot"} size={16} /> {text.status[status]}</span>
            </header>
            <blockquote>{status === "broken" ? promiseText(given.hero, locale)?.broken : promiseText(given.hero, locale)?.ask}</blockquote>
            {status !== "broken" ? <p className="promise-rule">{describePromise(PROMISE_BY_HERO[given.hero], locale, given.goal)}</p> : null}
            <p className="modal-hint">{text.statusHint[status]}</p>
          </div>
          {status !== "broken" ? <button type="button" className="btn btn-ghost btn-sm" onClick={() => void breakWord()}>{text.breakWord}</button> : null}
        </section>
      ) : (
        <p className="promise-none">{text.none}</p>
      )}

      <h3 className="section-heading">{text.choose}</h3>
      <ol className="promise-roster">
        {roster.map((def) => {
          const hero = def.hero;
          const name = g.heroes[hero].name;
          const lines = promiseText(hero, locale);
          const chosen = state.pledge === hero;
          // Tonight while the night is at its dusk, else the next dusk; never two nights running.
          const when = promiseWhen(state, hero);
          const tonight = when === "tonight";
          const needs = recognitionNeeds(state, hero);
          const kept = promisesKept(state, hero);
          return (
            <li key={hero} className={`promise-row${chosen ? " is-chosen" : ""}${given?.hero === hero ? " is-tonight" : ""}`}>
              {portrait(hero)}
              <div className="promise-body">
                <header>
                  <h4>{name} <span className="hero-title">{g.heroes[hero].title}</span></h4>
                  <span className="promise-kept">{text.kept(kept)}</span>
                </header>
                <blockquote>{lines?.ask}</blockquote>
                <p className="promise-rule">{describePromise(def, locale)}</p>
                {needs && needs.promises > 0 ? <p className="promise-needs">{text.needs(needs.promises)}</p> : null}
                {promisesAwaited(state, hero) > 0 ? <p className="modal-hint">{text.doubles}</p> : null}
                {unarmed(def) ? <p className="modal-hint">{text.noWeapon}</p> : when === null && given?.hero === hero ? <p className="modal-hint">{text.rested}</p> : when === null && state.lastPromise === hero ? <p className="modal-hint">{text.restedLast}</p> : null}
              </div>
              {chosen ? (
                <div className="promise-action">
                  <span className="promise-chosen"><Picto name="knot" size={14} /> {text.chosen}</span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => store.act((engine, now) => engine.pledge(null, now))}>{text.takeBack}</button>
                </div>
              ) : (
                <div className="promise-action">
                  <button
                    type="button"
                    className="btn btn-sm"
                    disabled={when === null}
                    aria-label={text.giveLabel(name, tonight)}
                    onClick={() => store.act((engine, now) => engine.pledge(hero, now))}
                  >
                    {when === "next" ? text.giveNext : text.give}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
