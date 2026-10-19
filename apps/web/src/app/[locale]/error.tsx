"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/routing";
import { reportClientError } from "@/lib/errorReport";

/** A page that broke while it rendered: the walker tries again or goes home, and the server hears of it. */
export default function PageError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { locale, t } = useI18n();
  useEffect(() => reportClientError("render", error), [error]);
  return (
    <div className="page-shell">
      <main id="main" className="page-content" style={{ textAlign: "center" }}>
        <h1>{t.site.error.title}</h1>
        <p>{t.site.error.text}</p>
        <p style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn" onClick={() => retry()}>{t.site.error.retry}</button>
          <Link href={href(locale, "home")} className="btn btn-gold">{t.site.error.back}</Link>
        </p>
      </main>
    </div>
  );
}
