import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getI18n } from "@/i18n/server";
import { Workshop } from "./Workshop";
import "./workshop.css";

type Props = { params: Promise<{ locale: string }> };

/**
 * The pixel workshop shows every piece of world art, deep strata included: a tool for the
 * people who build the game, not a page for walkers (it would show the end of the road).
 * Served in development, or in production with PIXEL_WORKSHOP=1.
 */
function workshopOpen(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.PIXEL_WORKSHOP === "1";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getI18n(params);
  return { title: t.workshop.metaTitle, robots: { index: false, follow: false } };
}

export default async function WorkshopPage({ params }: Props) {
  if (!workshopOpen()) notFound();
  const { locale } = await getI18n(params);
  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <main className="workshop-page">
        <Workshop />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
