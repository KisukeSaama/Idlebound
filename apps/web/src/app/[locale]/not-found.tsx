import { DEFAULT_LOCALE, isLocale } from "@idlebound/game";
import { headers } from "next/headers";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { Art } from "@/game/pixel/Art";
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
      <main id="main" className="page-content" style={{ textAlign: "center" }}>
        <div className="not-found-art">
          <Art spec={{ kind: "creature", id: "field-rat" }} size={200} />
        </div>
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
