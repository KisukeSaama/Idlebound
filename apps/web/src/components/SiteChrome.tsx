import { LOCALES, type Locale } from "@idlebound/game";
import Link from "next/link";
import { messages } from "@/i18n/messages";
import { href, type RouteId } from "@/i18n/routing";
import { LanguageDialog } from "./LanguageDialog";
import { SiteScroll } from "./SiteScroll";

/**
 * Header of the public pages, fixed at the top of the window. The language is chosen in the
 * game settings, not here.
 */
export function SiteNav({ locale }: { locale: Locale }) {
  const t = messages(locale);
  return (
    <header className="page-nav">
      <a href="#main" className="skip-link">{t.site.nav.skip}</a>
      <div className="page-nav-inner">
        <Link href={href(locale, "home")} className="page-nav-logo" aria-label={t.site.nav.home}>
          <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
        </Link>
        <nav className="page-nav-links" aria-label={t.site.nav.main}>
          <Link href={href(locale, "leaderboard")} className="nav-optional">{t.site.nav.leaderboard}</Link>
          <Link href={href(locale, "wiki")} className="nav-optional">{t.site.nav.wiki}</Link>
          <Link href={href(locale, "news")} className="nav-optional">{t.site.nav.news}</Link>
          <Link href={href(locale, "play")} className="btn btn-gold">{t.site.nav.play}</Link>
        </nav>
      </div>
      <SiteScroll label={t.site.nav.top} />
    </header>
  );
}

/**
 * Footer of the public pages. Its globe opens the language window, whose plain, crawlable
 * links to the same page in every language complement the hreflang tags. `path` (without the
 * locale prefix) names a page that is not one of the fixed routes, a wiki page.
 */
export function SiteFooter({ locale, route = "home", path }: { locale: Locale; route?: RouteId; path?: string }) {
  const t = messages(locale);
  const choices = LOCALES.map((entry) => ({ locale: entry, name: t.common.languageNames[entry], href: path === undefined ? href(entry, route) : `/${entry}${path}` }));
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>{t.site.footer.copyright(new Date().getFullYear())}</span>
        <nav aria-label={t.site.footer.links}>
          <Link href={href(locale, "play")}>{t.site.footer.play}</Link>
          <Link href={href(locale, "leaderboard")}>{t.site.footer.leaderboard}</Link>
          <Link href={href(locale, "wiki")}>{t.site.footer.wiki}</Link>
          <Link href={href(locale, "news")}>{t.site.footer.news}</Link>
          <Link href={href(locale, "privacy")}>{t.site.footer.privacy}</Link>
          <LanguageDialog locale={locale} choices={choices} labels={{ open: t.site.footer.language, title: t.site.footer.languageTitle, close: t.common.close }} />
        </nav>
      </div>
    </footer>
  );
}
