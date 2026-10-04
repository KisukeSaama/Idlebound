import { LOCALES, type Locale } from "@idlebound/game";
import type { Metadata } from "next";
import { ROUTES, type RouteId } from "@/i18n/routing";

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
 * hreflang set of a path without its locale prefix (`/wiki/companions/maelle`): one URL per
 * locale, plus `x-default` pointing to the unprefixed URL, which redirects each visitor to
 * their language (see src/proxy.ts).
 */
export function pathLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}${path}`]));
  languages["x-default"] = path || "/";
  return languages;
}

/** Canonical + hreflang alternates for a localized page. */
export function pageAlternates(locale: Locale, route: RouteId): Metadata["alternates"] {
  return pathAlternates(locale, ROUTES[route]);
}

/** Canonical + hreflang alternates of a path without its locale prefix. */
export function pathAlternates(locale: Locale, path: string): Metadata["alternates"] {
  return { canonical: `/${locale}${path}`, languages: pathLanguages(path) };
}

type Social = {
  title: string;
  description: string;
  imageAlt: string;
  /** The page's own share picture (1200 by 630), instead of the site's. */
  image?: string;
  /** A dated article (a news post): shared as an article, with the day it went out. */
  publishedTime?: string;
};

/**
 * Open Graph and Twitter card of a localized page. Next replaces the layout's objects
 * instead of merging them, so every page passes its own: a shared link then shows that
 * page, not the landing.
 */
export function pageSocial(locale: Locale, route: RouteId, social: Social): Pick<Metadata, "openGraph" | "twitter"> {
  return pathSocial(locale, ROUTES[route], social);
}

/** Open Graph and Twitter card of a path without its locale prefix. */
export function pathSocial(locale: Locale, path: string, { title, description, imageAlt, image = "/og.png", publishedTime }: Social): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      ...(publishedTime ? { type: "article" as const, publishedTime, authors: [SITE_NAME] } : { type: "website" as const }),
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((entry) => entry !== locale).map((entry) => OG_LOCALE[entry]),
      url: `/${locale}${path}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }]
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: imageAlt }] }
  };
}

/** The team behind the site, as structured data names the author and publisher of a page. */
export function organizationLd(): Record<string, unknown> {
  const url = siteUrl();
  return { "@type": "Organization", name: SITE_NAME, url, logo: `${url}/assets/brand/idlebound-logo.webp` };
}

/** Title as the layout's template renders it, for the social cards that skip the template. */
export function fullTitle(title: string): string {
  return `${title} · ${SITE_NAME}`;
}
