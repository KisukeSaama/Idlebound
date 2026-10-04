import { isLocale, type Locale } from "@idlebound/game";
import { messages } from "@/i18n/messages";
import { NEWS_POSTS } from "@/i18n/messages/posts";
import { href, newsFeedHref, newsHref } from "@/i18n/routing";
import { SITE_NAME, siteUrl } from "@/lib/site";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS day of an article: dates are days, read in UTC. */
const rssDate = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

function feed(locale: Locale): string {
  const url = siteUrl();
  const n = messages(locale).news;
  const items = NEWS_POSTS.map((post) => {
    const text = post[locale];
    const link = `${url}${newsHref(locale, post.slug)}`;
    return [
      "<item>",
      `<title>${escape(text.title)}</title>`,
      `<link>${link}</link>`,
      `<guid isPermaLink="true">${link}</guid>`,
      `<pubDate>${rssDate(post.date)}</pubDate>`,
      `<category>${escape(n.kinds[post.kind])}</category>`,
      `<description>${escape(text.summary)}</description>`,
      "</item>"
    ].join("");
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escape(`${n.metaTitle} · ${SITE_NAME}`)}</title>`,
    `<link>${url}${href(locale, "news")}</link>`,
    `<atom:link href="${url}${newsFeedHref(locale)}" rel="self" type="application/rss+xml"/>`,
    `<description>${escape(n.metaDescription)}</description>`,
    `<language>${locale}</language>`,
    NEWS_POSTS.length > 0 ? `<lastBuildDate>${rssDate(NEWS_POSTS[0].date)}</lastBuildDate>` : "",
    ...items,
    "</channel>",
    "</rss>"
  ].join("\n");
}

/** The news as an RSS feed, one per language, for readers who follow the road from afar. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  return new Response(feed(locale), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" }
  });
}
