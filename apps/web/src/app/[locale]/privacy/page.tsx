import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getI18n } from "@/i18n/server";
import { pageAlternates } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: t.privacy.metaTitle,
    description: t.privacy.metaDescription,
    alternates: pageAlternates(locale, "privacy")
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale, t } = await getI18n(params);
  const p = t.privacy;
  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <main className="page-content">
        <h1>{p.title}</h1>
        <p>{p.intro}</p>

        <h2>{p.guestTitle}</h2>
        <p>{p.guestText}</p>

        <h2>{p.accountTitle}</h2>
        <ul>
          {p.accountItems.map((item) => (
            <li key={item.label}><strong>{item.label}</strong>{item.text}</li>
          ))}
        </ul>

        <h2>{p.cookiesTitle}</h2>
        <p>{p.cookiesText}</p>

        <h2>{p.securityTitle}</h2>
        <p>{p.securityText}</p>

        <h2>{p.retentionTitle}</h2>
        <p>{p.retentionText}</p>

        <h2>{p.rightsTitle}</h2>
        <p>
          {p.rightsLead}<em>{p.accountMenu}</em>{p.rightsMiddle}<em>{p.deleteAction}</em>{p.rightsEnd}
        </p>
      </main>
      <SiteFooter locale={locale} route="privacy" />
    </div>
  );
}
