import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getI18n } from "@/i18n/server";
import { ResetForm } from "./ResetForm";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getI18n(params);
  return {
    title: t.reset.metaTitle,
    robots: { index: false, follow: false },
    // The token is in the URL: no Referer at all (even if the proxy rewrites the HTTP header).
    referrer: "no-referrer"
  };
}

export default async function ResetPage({ params, searchParams }: Props) {
  const { locale, t } = await getI18n(params);
  const { token } = await searchParams;
  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <main id="main" className="page-content" style={{ maxWidth: 460 }}>
        <h1>{t.reset.title}</h1>
        <ResetForm token={token ?? ""} />
      </main>
      <SiteFooter locale={locale} route="home" />
    </div>
  );
}
