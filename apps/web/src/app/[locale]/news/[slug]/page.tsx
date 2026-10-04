import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { newsPost } from "@/i18n/messages/posts";
import { href, newsCoverHref, newsFeedHref, newsHref, newsPath } from "@/i18n/routing";
import { getI18n } from "@/i18n/server";
import { SITE_NAME, fullTitle, organizationLd, pathAlternates, pathSocial, siteUrl } from "@/lib/site";
import { NewsCover, NewsMeta } from "../NewsCard";
import "../../landing.css";
import "../news.css";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function load(params: Props["params"]) {
  const i18n = await getI18n(params);
  const post = newsPost((await params).slug);
  if (!post) notFound();
  return { ...i18n, post };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t, post } = await load(params);
  const text = post[locale];
  const path = newsPath(post.slug);
  return {
    title: text.title,
    description: text.summary,
    alternates: { ...pathAlternates(locale, path), types: { "application/rss+xml": [{ url: newsFeedHref(locale), title: `${t.news.metaTitle} · ${SITE_NAME}` }] } },
    ...pathSocial(locale, path, {
      title: fullTitle(text.title),
      description: text.summary,
      imageAlt: text.title,
      image: newsCoverHref(locale, post.slug),
      publishedTime: post.date
    })
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { locale, t, post } = await load(params);
  const text = post[locale];
  const url = siteUrl();
  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <JsonLd
        data={{
          "@type": "NewsArticle",
          headline: text.title,
          description: text.summary,
          image: [`${url}${newsCoverHref(locale, post.slug)}`],
          datePublished: post.date,
          dateModified: post.date,
          inLanguage: locale,
          url: `${url}${newsHref(locale, post.slug)}`,
          mainEntityOfPage: `${url}${newsHref(locale, post.slug)}`,
          author: organizationLd(),
          publisher: organizationLd()
        }}
      />
      <main id="main" className="page-content news-page news-page-article">
        <Link href={href(locale, "news")} className="news-back">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" /></svg>
          {t.news.back}
        </Link>
        <article className="news-article">
          <header className="news-article-head">
            <NewsCover post={post} className="news-banner" />
            <NewsMeta locale={locale} post={post} />
            <h1>{text.title}</h1>
            <p className="news-lead">{text.summary}</p>
          </header>
          <div className="news-body">
            {text.body.map((block, index) =>
              block.kind === "h2" ? <h2 key={index}>{block.text}</h2>
              : block.kind === "list" ? <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
              : <p key={index}>{block.text}</p>
            )}
          </div>
          <footer className="news-article-foot">
            <p className="news-signature">{t.news.signature}</p>
            {text.link ? <Link href={href(locale, text.link.route)} className="btn btn-gold">{text.link.label}</Link> : null}
          </footer>
        </article>
      </main>
      <SiteFooter locale={locale} path={newsPath(post.slug)} />
    </div>
  );
}
