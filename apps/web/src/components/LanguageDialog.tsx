"use client";

import type { Locale } from "@idlebound/game";
import { useRef, type MouseEvent } from "react";
import { writePreferenceCookie } from "@/i18n/preference";

export interface LanguageChoice {
  locale: Locale;
  /** The language's own name, written in it. */
  name: string;
  /** The same page in that language. */
  href: string;
}

/**
 * The language switch of the public pages: a globe that opens a small window listing every
 * language. Each one is a plain link to the same page in that language (crawlable, working
 * without script); following it also records the choice, as the game's Settings do.
 */
export function LanguageDialog({ locale, choices, labels }: { locale: Locale; choices: LanguageChoice[]; labels: { open: string; title: string; close: string } }) {
  const dialog = useRef<HTMLDialogElement>(null);

  // A click on the backdrop lands on the dialog itself, outside its inner panel.
  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  };

  return (
    <>
      <button type="button" className="lang-open" aria-label={labels.open} title={labels.open} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="10" cy="10" r="7.5" />
            <ellipse cx="10" cy="10" rx="3.2" ry="7.5" />
            <path d="M2.5 10h15M4 5.8h12M4 14.2h12" />
          </g>
        </svg>
      </button>
      <dialog ref={dialog} className="lang-dialog" aria-labelledby="lang-dialog-title" onClick={onDialogClick}>
        <div className="lang-panel">
          <div className="lang-head">
            <h2 id="lang-dialog-title">{labels.title}</h2>
            <button type="button" className="lang-close" aria-label={labels.close} onClick={() => dialog.current?.close()}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" /></svg>
            </button>
          </div>
          <ul className="lang-list">
            {choices.map((choice) => (
              <li key={choice.locale}>
                <a
                  href={choice.href}
                  hrefLang={choice.locale}
                  lang={choice.locale}
                  aria-current={choice.locale === locale ? "true" : undefined}
                  onClick={() => writePreferenceCookie(choice.locale)}
                >
                  {choice.name}
                  {choice.locale === locale ? (
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" /></svg>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
