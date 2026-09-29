import type { Metadata, Viewport } from "next";
import { Alegreya_Sans, Cinzel } from "next/font/google";
import { I18nProvider } from "@/i18n/client";
import { assertLocale, getI18n, getPreference } from "@/i18n/server";
import { SITE_NAME, isIndexable, pageAlternates, pageSocial, siteUrl } from "@/lib/site";
import "../globals.css";

const display = Cinzel({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display", display: "swap" });
const body = Alegreya_Sans({ subsets: ["latin"], weight: ["400", "500", "700", "800"], style: ["normal", "italic"], variable: "--font-body", display: "swap" });

// Every page is rendered per request: runtime env (one image for dev and prod) and the
// per-request CSP nonce set by src/proxy.ts both require it.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  const url = siteUrl();
  const title = `${SITE_NAME} · ${t.site.meta.tagline}`;
  return {
    metadataBase: new URL(url),
    title: { default: title, template: `%s · ${SITE_NAME}` },
    description: t.site.meta.description,
    applicationName: SITE_NAME,
    keywords: t.site.meta.keywords,
    alternates: pageAlternates(locale, "home"),
    ...pageSocial(locale, "home", { title, description: t.site.meta.description, imageAlt: t.site.meta.ogImageAlt }),
    robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      apple: [{ url: "/icon-180.png" }]
    },
    manifest: "/manifest.webmanifest",
    // Added to a home screen, the game opens as an app: full screen, the night under the
    // status bar (every page keeps clear of it with the safe-area inset).
    appleWebApp: { title: SITE_NAME, statusBarStyle: "black-translucent" }
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0a14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default async function RootLayout({ children, params }: Props & { children: React.ReactNode }) {
  const locale = assertLocale((await params).locale);
  const preference = await getPreference();
  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body>
        <I18nProvider locale={locale} preference={preference}>{children}</I18nProvider>
      </body>
    </html>
  );
}
