import { LOCALES } from "@idlebound/game";
import type { MetadataRoute } from "next";
import { NEWS_POSTS } from "@/i18n/messages/posts";
import { ROUTES, newsPath, wikiPath, type RouteId } from "@/i18n/routing";
import { ENTRY_TOPICS, TOPIC_IDS } from "@/wiki/catalog";
import { pathLanguages, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type Frequency = "hourly" | "weekly" | "yearly";

/**
 * Indexable pages; play (a browser-only game shell), reset-password and verify-email are
 * deliberately left out (noindex). No lastmod on them: one stamped with the request time would
 * claim a change on every crawl, and search engines stop trusting it. A news article states the
 * day it went out, which never moves.
 */
const PAGES: { route: RouteId; changeFrequency: Frequency; priority: number }[] = [
  { route: "home", changeFrequency: "weekly", priority: 1 },
  { route: "news", changeFrequency: "weekly", priority: 0.6 },
  { route: "leaderboard", changeFrequency: "hourly", priority: 0.7 },
  { route: "wiki", changeFrequency: "weekly", priority: 0.8 },
  { route: "privacy", changeFrequency: "yearly", priority: 0.2 }
];

/** One entry per locale of a path (without its locale prefix), each listing all its language versions (hreflang). */
function entries(url: string, path: string, changeFrequency: Frequency, priority: number, lastModified?: string): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(Object.entries(pathLanguages(path)).map(([lang, target]) => [lang, `${url}${target}`]));
  return LOCALES.map((locale) => ({
    url: `${url}/${locale}${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
    alternates: { languages }
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  return [
    ...PAGES.flatMap(({ route, changeFrequency, priority }) => entries(url, ROUTES[route], changeFrequency, priority)),
    ...NEWS_POSTS.flatMap((post) => entries(url, newsPath(post.slug), "yearly", 0.5, post.date)),
    ...TOPIC_IDS.flatMap((topic) => entries(url, wikiPath(topic), "weekly", 0.6)),
    ...Object.entries(ENTRY_TOPICS).flatMap(([topic, ids]) => ids.flatMap((entry) => entries(url, wikiPath(topic, entry), "weekly", 0.4)))
  ];
}
