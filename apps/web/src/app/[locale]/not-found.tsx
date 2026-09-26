import { DEFAULT_LOCALE, isLocale } from "@idlebound/game";
import { headers } from "next/headers";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { messages } from "@/i18n/messages";
import { href } from "@/i18n/routing";
import { LOCALE_HEADER } from "@/proxy";

// not-found receives no params: src/proxy.ts forwards the page locale in a request header.
export default async function NotFound() {
  const value = (await headers()).get(LOCALE_HEADER);
  const locale = isLocale(value) ? value : DEFAULT_LOCALE;
  const t = messages(locale);
  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <main className="page-content" style={{ textAlign: "center" }}>
        <img src="/assets/enemies/field-rat.webp" alt="" width={220} height={150} style={{ margin: "2rem auto 1rem", width: 220, height: "auto" }} />
        <h1>{t.site.notFound.title}</h1>
        <p>{t.site.notFound.text}</p>
        <p style={{ marginTop: "1.5rem" }}>
          <Link href={href(locale, "home")} className="btn btn-gold">{t.site.notFound.back}</Link>
        </p>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
