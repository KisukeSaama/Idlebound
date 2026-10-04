import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getI18n } from "@/i18n/server";
import { wikiPath } from "@/i18n/routing";
import { fullTitle, pathAlternates, pathSocial } from "@/lib/site";
import { ArticleView } from "@/wiki/ArticleView";
import { TOPIC_BY_ID, isTopic } from "@/wiki/catalog";
import { FACTS } from "@/wiki/facts";
import { wikiContext } from "@/wiki/format";
import { topicSlots } from "@/wiki/topics";
import { WikiPage } from "@/wiki/WikiPage";

type Props = { params: Promise<{ locale: string; topic: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  const { topic } = await params;
  if (!isTopic(topic)) return {};
  const w = t.wiki;
  const title = w.meta.topic(w.topics[topic].title);
  const description = w.meta.topicDescription(w.topics[topic].title, w.topics[topic].short);
  const path = wikiPath(topic);
  return {
    title,
    description,
    alternates: pathAlternates(locale, path),
    ...pathSocial(locale, path, { title: fullTitle(title), description, imageAlt: t.site.meta.ogImageAlt })
  };
}

export default async function WikiTopicPage({ params }: Props) {
  const { locale, t } = await getI18n(params);
  const { topic } = await params;
  if (!isTopic(topic)) notFound();
  const article = t.wikiArticles[topic](FACTS);
  const slots = topicSlots(topic, wikiContext(locale));
  const w = t.wiki;
  return (
    <WikiPage
      locale={locale}
      topic={topic}
      title={t.wiki.topics[topic].title}
      lead={article.lead}
      art={TOPIC_BY_ID[topic].art}
      toc={article.sections.map((section) => ({ id: section.id, title: section.title }))}
      about={{ headline: w.topics[topic].title, description: w.meta.topicDescription(w.topics[topic].title, w.topics[topic].short) }}
    >
      <ArticleView article={article} locale={locale} slots={slots} labels={t.wiki.aside} />
    </WikiPage>
  );
}
