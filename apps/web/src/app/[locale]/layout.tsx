import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { I18nProvider } from "@/i18n/client";
import { assertLocale, getI18n, getPreference } from "@/i18n/server";
import { SITE_NAME, isIndexable, pageAlternates, pageSocial, siteUrl } from "@/lib/site";
import "../globals.css";

// Self-hosted (src/fonts, OFL): the build never depends on reaching Google Fonts.
const display = localFont({ src: "../../fonts/cinzel-latin-var.woff2", weight: "600 800", variable: "--font-display", display: "swap", adjustFontFallback: "Times New Roman" });
const body = localFont({
  src: [
    { path: "../../fonts/alegreya-sans-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/alegreya-sans-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/alegreya-sans-latin-700.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/alegreya-sans-latin-800.woff2", weight: "800", style: "normal" },
    { path: "../../fonts/alegreya-sans-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../fonts/alegreya-sans-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../../fonts/alegreya-sans-latin-700-italic.woff2", weight: "700", style: "italic" },
    { path: "../../fonts/alegreya-sans-latin-800-italic.woff2", weight: "800", style: "italic" }
  ],
  variable: "--font-body",
  display: "swap"
});

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
