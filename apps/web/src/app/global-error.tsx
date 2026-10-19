"use client";

import { DEFAULT_LOCALE, isLocale } from "@idlebound/game";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { site } from "@/i18n/messages/site";
import { reportClientError } from "@/lib/errorReport";
import "./globals.css";

/**
 * The root layout itself broke: this replaces the whole document, without the providers, so
 * it reads its locale from the address and its words from the site's own messages.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const first = (usePathname() ?? "").split("/")[1];
  const locale = isLocale(first) ? first : DEFAULT_LOCALE;
  const text = site[locale].error;
  useEffect(() => reportClientError("render", error), [error]);
  return (
    <html lang={locale}>
      <body>
        <title>{text.title}</title>
        <div className="page-shell">
          <main id="main" className="page-content" style={{ textAlign: "center" }}>
            <h1>{text.title}</h1>
            <p>{text.text}</p>
            <p style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" className="btn" onClick={() => retry()}>{text.retry}</button>
              <a href={`/${locale}`} className="btn btn-gold">{text.back}</a>
            </p>
          </main>
        </div>
      </body>
    </html>
  );
}
