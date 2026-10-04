import type { Locale } from "@idlebound/game";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { Art, type ArtSpec } from "@/game/pixel/Art";
import { messages } from "@/i18n/messages";
import { wikiHref, wikiPath } from "@/i18n/routing";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, siteUrl } from "@/lib/site";
import { TOPICS, TOPIC_GROUPS, type TopicId } from "./catalog";
import type { Gate } from "./gates";
import { ModeBar } from "./ModeBar";
import { Spoiler } from "./Spoiler";
import { searchIndex } from "./search";
import { WikiSearch } from "./WikiSearch";

interface Props {
  locale: Locale;
  /** The topic the page belongs to (none: the wiki's index). */
  topic?: TopicId;
  /** An entry of the topic: its id (for the URL) and its name (for the breadcrumb). */
  entry?: { id: string; name: string };
  title: ReactNode;
  /** Plain title for the breadcrumb when `title` is not a string. */
  crumb?: string;
  lead?: ReactNode;
  art?: ArtSpec;
  /** The page itself is a revelation until this is lived: its name and picture wait behind a veil. */
  gate?: Gate;
  /** The page's own sections, for "On this page". */
  toc?: readonly { id: string; title: string }[];
  /** What search engines read of the page (schema.org Article): its plain name and summary. */
  about: { headline: string; description: string };
  children: ReactNode;
}

/** The search and every topic, grouped: beside the article on wide screens, folded above it on phones. */
function Contents({ locale, topic, place }: { locale: Locale; topic?: TopicId; place: "side" | "phone" }) {
  const w = messages(locale).wiki;
  return (
    <>
      <WikiSearch items={searchIndex(locale)} />
      <nav aria-label={w.nav.label}>
        {TOPIC_GROUPS.map((group) => (
          <div key={group} className="wiki-group">
            <p id={`wiki-group-${place}-${group}`} className="wiki-group-title">{w.nav.groups[group]}</p>
            <ul aria-labelledby={`wiki-group-${place}-${group}`}>
              {TOPICS.filter((entry) => entry.group === group).map((entry) => (
                <li key={entry.id}>
                  <Link href={wikiHref(locale, entry.id)} aria-current={entry.id === topic ? "page" : undefined} className={entry.id === topic ? "active" : ""}>
                    {w.topics[entry.id].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

/** The frame of every wiki page: the site's nav, the wiki's contents beside the article, the reading mode. */
export function WikiPage({ locale, topic, entry, title, crumb, lead, art, gate, toc, about, children }: Props) {
  const t = messages(locale);
  const w = t.wiki;
  const path = wikiPath(topic, entry?.id);
  const crumbs = [
    { name: w.nav.home, href: wikiHref(locale) },
    ...(topic ? [{ name: w.topics[topic].title, href: wikiHref(locale, topic) }] : []),
    ...(entry && topic ? [{ name: entry.name, href: wikiHref(locale, topic, entry.id) }] : [])
  ];
  const url = siteUrl();
  const page = `${url}/${locale}${path}`;

  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <JsonLd
        data={{
          "@type": "Article",
          headline: about.headline,
          description: about.description,
          inLanguage: locale,
          url: page,
          mainEntityOfPage: page,
          isPartOf: { "@type": "WebSite", name: w.meta.title, url: `${url}${wikiHref(locale)}` },
          author: organizationLd(),
          publisher: organizationLd()
        }}
      />
      {crumbs.length > 1 ? (
        <JsonLd data={{ "@type": "BreadcrumbList", itemListElement: crumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${url}${item.href}` })) }} />
      ) : null}
      <div className="wiki">
        <aside className="wiki-side">
          <Contents locale={locale} topic={topic} place="side" />
        </aside>

        <main id="main" className="wiki-main">
          <nav className="wiki-crumbs" aria-label={w.nav.breadcrumb}>
            <ol>
              {crumbs.map((item, index) => (
                <li key={item.href}>
                  {index === crumbs.length - 1 ? <span aria-current="page">{gate ? <Spoiler gate={gate} inline>{crumb ?? item.name}</Spoiler> : crumb ?? item.name}</span> : <Link href={item.href}>{item.name}</Link>}
                </li>
              ))}
            </ol>
          </nav>
          <header className="wiki-head">
            {art ? (
              <span className="wiki-head-art pixel-frame" aria-hidden="true">
                {gate ? <Spoiler gate={gate} passive fallback={<span className="wiki-unknown-mark">?</span>}><Art spec={art} size={88} /></Spoiler> : <Art spec={art} size={88} />}
              </span>
            ) : null}
            <div>
              <h1>{gate ? <Spoiler gate={gate} inline>{title}</Spoiler> : title}</h1>
              {lead ? <p className="wiki-lead">{lead}</p> : null}
            </div>
          </header>
          <details className="wiki-contents-phone">
            <summary>{w.nav.contents}</summary>
            <Contents locale={locale} topic={topic} place="phone" />
          </details>
          <ModeBar />
          {toc && toc.length > 2 ? (
            <nav className="wiki-toc" aria-label={w.nav.onThisPage}>
              <h2>{w.nav.onThisPage}</h2>
              <ol>
                {toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.title}</a></li>)}
              </ol>
            </nav>
          ) : null}
          <div className="wiki-body">{children}</div>
        </main>
      </div>
      <SiteFooter locale={locale} path={path} />
    </div>
  );
}
