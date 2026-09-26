"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/routing";
import { api } from "@/lib/api";

export function ResetForm({ token }: { token: string }) {
  const { locale, t } = useI18n();
  const r = t.reset;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  // Remove the token from the address bar (history, screenshots, shared URLs).
  useEffect(() => {
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  if (!token) {
    return <p className="form-error">{r.invalidLink}</p>;
  }
  if (done) {
    return (
      <div className="card" style={{ padding: "1.4rem", display: "grid", gap: "1rem" }}>
        <p className="form-success">{r.success}</p>
        <Link href={href(locale, "play")} className="btn btn-gold">{r.resume}</Link>
      </div>
    );
  }

  return (
    <form
      className="card"
      style={{ padding: "1.4rem", display: "grid", gap: "1rem" }}
      onSubmit={async (event) => {
        event.preventDefault();
        if (password !== confirm) {
          setError(r.mismatch);
          return;
        }
        setPending(true);
        setError(null);
        const result = await api.resetPassword(token, password);
        setPending(false);
        if (result.ok) setDone(true);
        else setError(result.error);
      }}
    >
      <div className="field">
        <label htmlFor="new-password">{r.newPassword}</label>
        <input
          id="new-password"
          className="input"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <span className="field-hint">{r.hint}</span>
      </div>
      <div className="field">
        <label htmlFor="confirm-password">{r.confirm}</label>
        <input
          id="confirm-password"
          className="input"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="btn btn-gold" disabled={pending}>{pending ? r.saving : r.save}</button>
    </form>
  );
}
