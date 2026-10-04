import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { NEWS_POSTS } from "@/i18n/messages/posts";
import { newsFeedHref } from "@/i18n/routing";
import { getI18n } from "@/i18n/server";
import { SITE_NAME, fullTitle, pageAlternates, pageSocial } from "@/lib/site";
import { NewsCard } from "./NewsCard";
import "../landing.css";
import "./news.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: t.news.metaTitle,
    description: t.news.metaDescription,
    alternates: { ...pageAlternates(locale, "news"), types: { "application/rss+xml": [{ url: newsFeedHref(locale), title: `${t.news.metaTitle} · ${SITE_NAME}` }] } },
    ...pageSocial(locale, "news", { title: fullTitle(t.news.metaTitle), description: t.news.metaDescription, imageAlt: t.site.meta.ogImageAlt })
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale, t } = await getI18n(params);
  const [latest, ...older] = NEWS_POSTS;
  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <main id="main" className="page-content news-page">
        <header className="news-head">
          <h1>{t.news.title}</h1>
          <p className="news-subtitle">{t.news.subtitle}</p>
          <a href={newsFeedHref(locale)} className="news-feed" type="application/rss+xml">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M3 3a10 10 0 0 1 10 10M3 7a6 6 0 0 1 6 6" fill="none" stroke="currentColor" strokeWidth="2" />
              <rect x="2" y="11" width="3" height="3" fill="currentColor" />
            </svg>
            {t.news.feed}
          </a>
        </header>
        <NewsCard locale={locale} post={latest} feature />
        {older.length > 0 ? (
          <section className="news-older" aria-labelledby="news-older-title">
            <h2 id="news-older-title" className="news-older-title">{t.news.older}</h2>
            <div className="news-list">
              {older.map((post) => <NewsCard key={post.slug} locale={locale} post={post} />)}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter locale={locale} route="news" />
    </div>
  );
}
