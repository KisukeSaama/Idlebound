import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";
import { fullTitle, isIndexable, pageAlternates, pageSocial } from "@/lib/site";
import { GameLoader } from "./GameLoader";

type Props = { params: Promise<{ locale: string }> };

/**
 * The game renders in the browser only: the page has no text for a search engine, and the
 * landing carries the searches. Kept out of the index and the sitemap, its links followed.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: t.site.play.title,
    description: t.site.play.description,
    alternates: pageAlternates(locale, "play"),
    robots: { index: false, follow: isIndexable() },
    ...pageSocial(locale, "play", { title: fullTitle(t.site.play.title), description: t.site.play.description, imageAlt: t.site.meta.ogImageAlt })
  };
}

export default async function PlayPage({ params }: Props) {
  const { t } = await getI18n(params);
  return (
    <>
      <GameLoader />
      <noscript>
        <p style={{ padding: 24, textAlign: "center" }}>{t.site.play.noscript}</p>
      </noscript>
    </>
  );
}
