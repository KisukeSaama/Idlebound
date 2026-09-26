import { LOCALES } from "@idlebound/game";
import type { MetadataRoute } from "next";
import { href } from "@/i18n/routing";
import { isIndexable, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", ...LOCALES.map((locale) => href(locale, "resetPassword"))] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl()
  };
}
