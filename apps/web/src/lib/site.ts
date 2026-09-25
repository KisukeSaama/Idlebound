import { LOCALES, type Locale } from "@idlebound/game";
import type { Metadata } from "next";
import { ROUTES, href, type RouteId } from "@/i18n/routing";

/** Read at runtime: the same image serves dev and prod. */
export function siteUrl(): string {
  return (process.env.PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/** Only prod is indexable; dev (idlebound-d.) answers noindex. */
export function isIndexable(): boolean {
  return process.env.SITE_INDEXABLE === "true";
}

export const SITE_NAME = "Idlebound";

/** Open Graph locale tags. */
export const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

/**
 * hreflang set of a page: one URL per locale, plus `x-default` pointing to the unprefixed
 * URL, which redirects each visitor to their language (see src/proxy.ts).
 */
export function languageAlternates(route: RouteId): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(LOCALES.map((locale) => [locale, href(locale, route)]));
  languages["x-default"] = ROUTES[route] || "/";
  return languages;
}

/** Canonical + hreflang alternates for a localized page. */
export function pageAlternates(locale: Locale, route: RouteId): Metadata["alternates"] {
  return { canonical: href(locale, route), languages: languageAlternates(route) };
}
