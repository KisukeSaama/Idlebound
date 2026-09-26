import { LOCALES } from "@idlebound/game";
import type { MetadataRoute } from "next";
import { href, type RouteId } from "@/i18n/routing";
import { languageAlternates, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Indexable pages; reset-password is deliberately left out (noindex). */
const PAGES: { route: RouteId; changeFrequency: "hourly" | "weekly" | "yearly"; priority: number }[] = [
  { route: "home", changeFrequency: "weekly", priority: 1 },
  { route: "play", changeFrequency: "weekly", priority: 0.9 },
  { route: "leaderboard", changeFrequency: "hourly", priority: 0.7 },
  { route: "privacy", changeFrequency: "yearly", priority: 0.2 }
];

/** One entry per page and locale, each listing all its language versions (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  const now = new Date();
  return PAGES.flatMap(({ route, changeFrequency, priority }) => {
    const languages = Object.fromEntries(Object.entries(languageAlternates(route)).map(([lang, path]) => [lang, `${url}${path}`]));
    return LOCALES.map((locale) => ({
      url: `${url}${href(locale, route)}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages }
    }));
  });
}
