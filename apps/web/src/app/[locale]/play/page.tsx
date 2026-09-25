import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";
import { pageAlternates } from "@/lib/site";
import { GameLoader } from "./GameLoader";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: t.site.play.title,
    description: t.site.play.description,
    alternates: pageAlternates(locale, "play")
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
