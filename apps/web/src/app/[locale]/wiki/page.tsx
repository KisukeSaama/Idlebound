import { ACHIEVEMENTS, ALTARS, BESTIARY, ERA_COUNT, NAMED_RELICS, SECRETS } from "@idlebound/game";
import type { Metadata } from "next";
import Link from "next/link";
import { Art } from "@/game/pixel/Art";
import { getI18n } from "@/i18n/server";
import { href, wikiHref } from "@/i18n/routing";
import { fullTitle, pageAlternates, pageSocial } from "@/lib/site";
import { TOPICS, TOPIC_GROUPS } from "@/wiki/catalog";
import { FACTS } from "@/wiki/facts";
import { count } from "@/wiki/format";
import { Rich } from "@/wiki/Rich";
import { WikiPage } from "@/wiki/WikiPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: t.wiki.meta.title,
    description: t.wiki.meta.description,
    alternates: pageAlternates(locale, "wiki"),
    ...pageSocial(locale, "wiki", { title: fullTitle(t.wiki.meta.title), description: t.wiki.meta.description, imageAlt: t.site.meta.ogImageAlt })
  };
}

/** Where a newcomer starts, in this order. */
const START = TOPICS.filter((topic) => topic.group === "start");

export default async function WikiIndexPage({ params }: Props) {
  const { locale, t } = await getI18n(params);
  const w = t.wiki;
  const numbers = [
    { label: w.index.counts.companions, value: FACTS.companions, to: wikiHref(locale, "companions") },
    { label: w.index.counts.creatures, value: BESTIARY.length, to: wikiHref(locale, "bestiary") },
    { label: w.index.counts.relics, value: NAMED_RELICS.length, to: `${wikiHref(locale, "relics")}#named` },
    { label: w.index.counts.altars, value: ALTARS.length, to: `${wikiHref(locale, "ascension")}#altars` },
    { label: w.index.counts.deeds, value: ACHIEVEMENTS.length, to: wikiHref(locale, "deeds") },
    { label: w.index.counts.secrets, value: SECRETS.length, to: `${wikiHref(locale, "deeds")}#secrets` },
    { label: w.index.counts.strata, value: ERA_COUNT, to: wikiHref(locale, "strata") },
    // The road has no bottom.
    { label: w.index.counts.stages, value: "∞", to: wikiHref(locale, "calculator") }
  ];

  return (
    <WikiPage locale={locale} title={w.index.title} lead={w.index.lead} art={{ kind: "altar", id: "wanderer" }} about={{ headline: w.meta.title, description: w.meta.description }}>
      <section className="wiki-section" aria-labelledby="start-title">
        <h2 id="start-title">{w.index.start}</h2>
        <div className="wiki-start">
          {START.map((topic) => (
            <Link key={topic.id} href={wikiHref(locale, topic.id)} className="wiki-start-card">
              <span className="wiki-card-art pixel-frame" aria-hidden="true"><Art spec={topic.icon ?? topic.art} size={56} /></span>
              <span>
                <strong>{w.topics[topic.id].title}</strong>
                <small>{w.topics[topic.id].short}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wiki-section" aria-labelledby="all-title">
        <h2 id="all-title">{w.index.all}</h2>
        {TOPIC_GROUPS.filter((group) => group !== "start").map((group) => (
          <div key={group} className="wiki-page-group">
            <h3 className="wiki-sub">{w.nav.groups[group]}</h3>
            <div className="wiki-topics">
              {TOPICS.filter((topic) => topic.group === group).map((topic) => (
                <Link key={topic.id} href={wikiHref(locale, topic.id)} className="wiki-topic-card">
                  <span className="wiki-card-art pixel-frame" aria-hidden="true"><Art spec={topic.icon ?? topic.art} size={48} /></span>
                  <span>
                    <strong>{w.topics[topic.id].title}</strong>
                    <small>{w.topics[topic.id].short}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="wiki-index-duo">
        <section className="wiki-section" aria-labelledby="numbers-title">
          <h2 id="numbers-title">{w.index.numbers}</h2>
          <dl className="wiki-numbers">
            {numbers.map((entry) => (
              <div key={entry.label}>
                <dt><Link href={entry.to}>{entry.label}</Link></dt>
                <dd>{typeof entry.value === "number" ? count(locale, entry.value) : entry.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="wiki-section" aria-labelledby="spoilers-title">
          <h2 id="spoilers-title">{w.index.spoilersTitle}</h2>
          {w.index.spoilers.map((text) => <p key={text}><Rich text={text} locale={locale} /></p>)}
          <p><Link href={href(locale, "play")} className="btn btn-gold">{t.site.nav.play}</Link></p>
        </section>
      </div>
    </WikiPage>
  );
}
