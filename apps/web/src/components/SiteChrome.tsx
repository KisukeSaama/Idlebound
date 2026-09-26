import { LOCALES, type Locale } from "@idlebound/game";
import Link from "next/link";
import { messages } from "@/i18n/messages";
import { href, type RouteId } from "@/i18n/routing";

/** Header of the public pages. The language is chosen in the game settings, not here. */
export function SiteNav({ locale }: { locale: Locale }) {
  const t = messages(locale);
  return (
    <header className="page-nav">
      <Link href={href(locale, "home")} className="page-nav-logo" aria-label={t.site.nav.home}>
        <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
      </Link>
      <nav className="page-nav-links" aria-label={t.site.nav.main}>
        <Link href={href(locale, "leaderboard")} className="nav-optional">{t.site.nav.leaderboard}</Link>
        <Link href={`${href(locale, "home")}#${t.landing.features.anchor}`} className="nav-optional">{t.site.nav.game}</Link>
        <Link href={href(locale, "play")} className="btn btn-gold">{t.site.nav.play}</Link>
      </nav>
    </header>
  );
}

/**
 * Footer of the public pages. It links to the same page in the other language: a plain,
 * crawlable link that complements the hreflang tags.
 */
export function SiteFooter({ locale, route = "home" }: { locale: Locale; route?: RouteId }) {
  const t = messages(locale);
  const other = LOCALES.find((entry) => entry !== locale) ?? locale;
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>{t.site.footer.copyright(new Date().getFullYear())}</span>
        <nav aria-label={t.site.footer.links}>
          <Link href={href(locale, "play")}>{t.site.footer.play}</Link>
          <Link href={href(locale, "leaderboard")}>{t.site.footer.leaderboard}</Link>
          <Link href={href(locale, "privacy")}>{t.site.footer.privacy}</Link>
          <a href={href(other, route)} hrefLang={other} lang={other} title={t.site.footer.otherLanguage}>
            {t.common.languageNames[other]}
          </a>
        </nav>
      </div>
    </footer>
  );
}
