import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getI18n } from "@/i18n/server";
import { wikiHref, wikiPath } from "@/i18n/routing";
import { fullTitle, pathAlternates, pathSocial } from "@/lib/site";
import { hasEntry, isEntryTopic, type EntryTopic } from "@/wiki/catalog";
import { companionEntry, creatureEntry, relicEntry, type EntryView } from "@/wiki/entries";
import { wikiContext, type WikiContext } from "@/wiki/format";
import { GatedTitle } from "@/wiki/GatedTitle";
import { Spoiler } from "@/wiki/Spoiler";
import { WikiPage } from "@/wiki/WikiPage";

type Props = { params: Promise<{ locale: string; topic: string; entry: string }> };

function entryView(topic: EntryTopic, ctx: WikiContext, id: string): EntryView {
  switch (topic) {
    case "companions": return companionEntry(ctx, id);
    case "bestiary": return creatureEntry(ctx, id);
    case "relics": return relicEntry(ctx, id);
  }
}

async function resolve(params: Props["params"]) {
  const { locale, t } = await getI18n(params);
  const { topic, entry } = await params;
  if (!isEntryTopic(topic) || !hasEntry(topic, entry)) return null;
  const view = entryView(topic, wikiContext(locale), entry);
  const w = t.wiki;
  return {
    locale,
    t,
    topic,
    entry,
    view,
    /** The page's name in a title, and the plain one a veiled page wears in the browser's tab. */
    title: w.meta.topic(view.name),
    veiledTitle: w.meta.topic(`${w.spoilers.title} · ${w.topics[topic].title}`),
    description: w.meta.topicDescription(view.name, `${view.subtitle}. ${w.topics[topic].short}`)
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};
  const { locale, t, topic, entry, view, title, veiledTitle, description } = found;
  const path = wikiPath(topic, entry);
  // A revelation keeps its name out of the tab (see GatedTitle); search engines still read it
  // in the description, the structured data and the page itself.
  return {
    title: view.gate ? veiledTitle : title,
    description,
    alternates: pathAlternates(locale, path),
    ...pathSocial(locale, path, { title: fullTitle(title), description, imageAlt: t.site.meta.ogImageAlt })
  };
}

export default async function WikiEntryPage({ params }: Props) {
  const found = await resolve(params);
  if (!found) notFound();
  const { locale, t, topic, entry, view, title, veiledTitle, description } = found;
  const back = <p className="wiki-back"><Link href={wikiHref(locale, topic)}>{t.wiki.entry.back(t.wiki.topics[topic].title)}</Link></p>;
  return (
    <WikiPage
      locale={locale}
      topic={topic}
      entry={{ id: entry, name: view.name }}
      title={view.name}
      lead={view.subtitle}
      art={view.art}
      gate={view.gate}
      toc={view.toc}
      about={{ headline: view.name, description }}
    >
      {view.gate ? <GatedTitle gate={view.gate} veiled={fullTitle(veiledTitle)} named={fullTitle(title)} /> : null}
      {view.gate ? <Spoiler gate={view.gate}>{view.body}</Spoiler> : view.body}
      {back}
    </WikiPage>
  );
}
