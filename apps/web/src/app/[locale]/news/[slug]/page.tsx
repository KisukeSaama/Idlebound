import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { Art } from "@/game/pixel/Art";
import { newsPost, type NewsBlock, type NewsTag } from "@/i18n/messages/posts";
import { href, newsCoverHref, newsFeedHref, newsHref, newsPath } from "@/i18n/routing";
import { getI18n } from "@/i18n/server";
import { SITE_NAME, fullTitle, organizationLd, pathAlternates, pathSocial, siteUrl } from "@/lib/site";
import { NewsCover, NewsMeta } from "../NewsCard";
import { NewsCompare } from "../NewsCompare";
import { NewsSpoiler, NewsSpoilers } from "../NewsSpoilers";
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
            {text.body.some((block) => block.kind === "spoiler") ? <NewsSpoilers><NewsBlocks blocks={text.body} words={t.news} /></NewsSpoilers> : <NewsBlocks blocks={text.body} words={t.news} />}
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

type EntryWords = { tags: Record<NewsTag, string>; colon: string; becomes: string };

/** The blocks of an article, in order; a spoiler holds blocks of its own. */
function NewsBlocks({ blocks, words }: { blocks: NewsBlock[]; words: EntryWords }) {
  return blocks.map((block, index) =>
    block.kind === "h2" ? <h2 key={index}>{block.text}</h2>
    : block.kind === "list" ? <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
    : block.kind === "entry" ? <NewsEntry key={index} entry={block} words={words} />
    : block.kind === "figure" ? <NewsFigure key={index} figure={block} />
    : block.kind === "compare" ? (
      <figure key={index} className="news-figure">
        <NewsCompare before={block.before} after={block.after} alt={block.alt} />
        <figcaption>{block.caption}</figcaption>
      </figure>
    )
    : block.kind === "spoiler" ? <NewsSpoiler key={index} label={block.label}><NewsBlocks blocks={block.body} words={words} /></NewsSpoiler>
    : <p key={index}>{block.text}</p>
  );
}

/** World art showing a change, each picture with its few words, and a caption under them all. A creature given a scene stands on its ground. */
function NewsFigure({ figure }: { figure: Extract<NewsBlock, { kind: "figure" }> }) {
  return (
    <figure className="news-figure">
      <div className="news-figure-row">
        {figure.art.map((art, index) => (
          <div key={index} className="news-figure-art">
            <div className="news-figure-frame pixel-frame">
              {art.scene ? (
                <>
                  <Art spec={art.scene} size="parent" cover className="news-figure-scene" />
                  <div className="news-figure-standing">
                    <Art spec={art.spec} size="parent" />
                  </div>
                </>
              ) : <Art spec={art.spec} size="parent" />}
            </div>
            {art.label ? <span className="news-figure-label">{art.label}</span> : null}
          </div>
        ))}
      </div>
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}

/** A patch note's card: the thing it touches, its tag, why, and each change before and after. */
function NewsEntry({ entry, words }: { entry: Extract<NewsBlock, { kind: "entry" }>; words: EntryWords }) {
  return (
    <section className={`news-entry news-entry-${entry.tag}`}>
      <h3 className="news-entry-head">
        <span className="news-entry-name">{entry.name}</span>
        <span className="news-entry-tag">{words.tags[entry.tag]}</span>
      </h3>
      {entry.context ? <p className="news-entry-context">{entry.context}</p> : null}
      <ul className="news-entry-changes">
        {entry.changes.map((change) => (
          <li key={change.label}>
            <strong>{change.label}</strong>
            {words.colon}
            {"text" in change ? change.text : (
              <>
                <span className="news-before">{change.before}</span>
                <span className="news-arrow" aria-hidden="true"> ⇒ </span>
                <span className="visually-hidden"> {words.becomes} </span>
                <strong className="news-after">{change.after}</strong>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
