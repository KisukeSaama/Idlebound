import { LOCALE_COOKIE, resolveLocale } from "@idlebound/game";
import type { MetadataRoute } from "next";
import { cookies, headers } from "next/headers";
import { ROUTES } from "@/i18n/routing";
import { messages } from "@/i18n/messages";

export const dynamic = "force-dynamic";

/** Served in the visitor's language; start_url is unprefixed so the proxy picks the locale. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = resolveLocale((await cookies()).get(LOCALE_COOKIE)?.value, (await headers()).get("accept-language"));
  const t = messages(locale).site.meta;
  return {
    name: "Idlebound",
    short_name: "Idlebound",
    description: t.tagline,
    start_url: ROUTES.play,
    display: "standalone",
    background_color: "#0b0a14",
    theme_color: "#0b0a14",
    lang: locale,
    icons: [
      { src: "/icon-180.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
