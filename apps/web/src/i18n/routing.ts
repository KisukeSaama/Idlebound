import { isLocale, type Locale } from "@idlebound/game";

/** Every public page, without its locale prefix. URLs are English in both locales. */
export const ROUTES = {
  home: "",
  play: "/play",
  leaderboard: "/leaderboard",
  privacy: "/privacy",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  wiki: "/wiki",
  news: "/news"
} as const;

export type RouteId = keyof typeof ROUTES;

/** Localized URL of a page: `/fr`, `/en/play`… */
export function href(locale: Locale, route: RouteId): string {
  return `/${locale}${ROUTES[route]}`;
}

/**
 * Path of a wiki page without its locale prefix: the index, a topic, or one entry of a topic
 * (`/wiki/companions/maelle`).
 */
export function wikiPath(topic?: string, entry?: string): string {
  return [ROUTES.wiki, topic, entry].filter(Boolean).join("/");
}

/** Localized URL of a wiki page. */
export function wikiHref(locale: Locale, topic?: string, entry?: string): string {
  return `/${locale}${wikiPath(topic, entry)}`;
}

/** Path of a news article without its locale prefix (`/news/the-wiki-opens`). */
export function newsPath(slug: string): string {
  return `${ROUTES.news}/${slug}`;
}

/** Localized URL of a news article. */
export function newsHref(locale: Locale, slug: string): string {
  return `/${locale}${newsPath(slug)}`;
}

/** Localized URL of the picture a shared link to a news article shows. */
export function newsCoverHref(locale: Locale, slug: string): string {
  return `${newsHref(locale, slug)}/cover.png`;
}

/** Localized URL of the news' RSS feed. */
export function newsFeedHref(locale: Locale): string {
  return `/${locale}${ROUTES.news}/feed.xml`;
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
