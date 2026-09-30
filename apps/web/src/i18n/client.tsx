"use client";

import { LOCALE_COOKIE, gameText, negotiateLocale, type GameText, type Locale } from "@idlebound/game";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { messages, type Messages } from "./messages";
import { swapLocale } from "./routing";

/** "auto" = no cookie: the browser languages decide. */
export type LocalePreference = Locale | "auto";

interface I18nValue {
  locale: Locale;
  preference: LocalePreference;
  /** UI strings of the web app. */
  t: Messages;
  /** Game content (heroes, monsters, achievements…). */
  g: GameText;
  setPreference: (preference: LocalePreference) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Locale for code that runs outside React (API client, cloud sync). Kept in sync by the
 * provider; there is a single user per browser tab, so a module variable is enough.
 */
let activeLocale: Locale = "fr";

export function currentLocale(): Locale {
  return activeLocale;
}

export function currentMessages(): Messages {
  return messages(activeLocale);
}

const ONE_YEAR = 365 * 24 * 3600;

function writePreferenceCookie(preference: LocalePreference) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = preference === "auto"
    ? `${LOCALE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
    : `${LOCALE_COOKIE}=${preference}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${secure}`;
}

export function I18nProvider({ locale: initialLocale, preference: initialPreference, children }: { locale: Locale; preference: LocalePreference; children: ReactNode }) {
  const [locale, setLocale] = useState(initialLocale);
  const [preference, setPreferenceState] = useState(initialPreference);
  activeLocale = locale;

  const setPreference = useCallback((next: LocalePreference) => {
    writePreferenceCookie(next);
    setPreferenceState(next);
    const target = next === "auto" ? negotiateLocale(navigator.languages) : next;
    if (target === activeLocale) return;
    activeLocale = target;
    setLocale(target);
    document.documentElement.lang = target;
    // Switch the URL in place: a navigation would remount the page (and reload the game).
    window.history.replaceState(window.history.state, "", swapLocale(window.location.pathname, target) + window.location.search + window.location.hash);
  }, []);

  const value = useMemo<I18nValue>(() => ({ locale, preference, t: messages(locale), g: gameText(locale), setPreference }), [locale, preference, setPreference]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("I18nProvider is missing.");
  return context;
}
