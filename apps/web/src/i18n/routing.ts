import { isLocale, type Locale } from "@idlebound/game";

/** Every public page, without its locale prefix. URLs are English in both locales. */
export const ROUTES = {
  home: "",
  play: "/play",
  leaderboard: "/leaderboard",
  privacy: "/privacy",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email"
} as const;

export type RouteId = keyof typeof ROUTES;

/** Localized URL of a page: `/fr`, `/en/play`… */
export function href(locale: Locale, route: RouteId): string {
  return `/${locale}${ROUTES[route]}`;
}

/** Locale carried by the first path segment, if any. */
export function localeFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

/** Same page in another locale. */
export function swapLocale(pathname: string, locale: Locale): string {
  const current = localeFromPath(pathname);
  if (!current) return `/${locale}${pathname === "/" ? "" : pathname}`;
  return `/${locale}${pathname.slice(current.length + 1)}`;
}

/** French URLs from before the English routes; permanently redirected to `/fr/…`. */
export const LEGACY_PATHS: Record<string, RouteId> = {
  "/jouer": "play",
  "/classement": "leaderboard",
  "/confidentialite": "privacy",
  "/reinitialiser": "resetPassword"
};
