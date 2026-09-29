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

type Social = { title: string; description: string; imageAlt: string };

/**
 * Open Graph and Twitter card of a localized page. Next replaces the layout's objects
 * instead of merging them, so every page passes its own: a shared link then shows that
 * page, not the landing.
 */
export function pageSocial(locale: Locale, route: RouteId, { title, description, imageAlt }: Social): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((entry) => entry !== locale).map((entry) => OG_LOCALE[entry]),
      url: href(locale, route),
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: imageAlt }]
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] }
  };
}

/** Title as the layout's template renders it, for the social cards that skip the template. */
export function fullTitle(title: string): string {
  return `${title} · ${SITE_NAME}`;
}
