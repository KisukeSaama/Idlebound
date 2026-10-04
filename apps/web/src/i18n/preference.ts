import { LOCALE_COOKIE, type Locale } from "@idlebound/game";

/** "auto" = no cookie: the browser languages decide. */
export type LocalePreference = Locale | "auto";

const ONE_YEAR = 365 * 24 * 3600;

/** Records the walker's language choice for the next visits (a UI preference, never game state). */
export function writePreferenceCookie(preference: LocalePreference) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = preference === "auto"
    ? `${LOCALE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
    : `${LOCALE_COOKIE}=${preference}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${secure}`;
}
