"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/routing";
import { api } from "@/lib/api";

type Outcome = { ok: true; username: string } | { ok: false; error: string };

/** A link works once: the request is shared so a remount (Strict Mode) cannot spend it twice. */
const requests = new Map<string, Promise<Outcome>>();

function confirm(token: string): Promise<Outcome> {
  let request = requests.get(token);
  if (!request) {
    request = api.verifyEmail(token).then((result) => (result.ok ? { ok: true, username: result.data.username } : { ok: false, error: result.error }));
    requests.set(token, request);
  }
  return request;
}

export function VerifyEmail({ token }: { token: string }) {
  const { locale, t } = useI18n();
  const v = t.verify;
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  useEffect(() => {
    // Remove the token from the address bar (history, screenshots, shared URLs).
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
    if (!token) return;
    let cancelled = false;
    void confirm(token).then((result) => {
      if (!cancelled) setOutcome(result);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) return <p className="form-error">{v.invalidLink}</p>;
  return (
    <div className="card" style={{ padding: "1.4rem", display: "grid", gap: "1rem" }}>
      {outcome === null ? <p role="status" style={{ color: "var(--muted)" }}>{v.pending}</p> : null}
      {outcome?.ok ? <p className="form-success" role="status">{v.success(outcome.username)}</p> : null}
      {outcome && !outcome.ok ? <p className="form-error" role="alert">{outcome.error}</p> : null}
      <Link href={href(locale, "play")} className="btn btn-gold">{v.play}</Link>
    </div>
  );
}
