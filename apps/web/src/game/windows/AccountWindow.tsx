"use client";

import { intlLocale, validateUsername } from "@idlebound/game";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/routing";
import { api } from "@/lib/api";
import { useCloud, useUi } from "../context";
import { WINDOW_META } from "../icons";
import { Modal } from "../components/Modal";

export function AccountWindow({ onClose }: { onClose: () => void }) {
  const cloud = useCloud();
  const { t } = useI18n();
  return (
    <Modal title={t.hud.windowTitles.account.label} icon={<img src={WINDOW_META.account.icon!} alt="" width={34} height={34} />} onClose={onClose} size="md">
      {cloud.user ? <Profile /> : <AuthForms />}
      <NewGame />
    </Modal>
  );
}

function Profile() {
  const cloud = useCloud();
  const ui = useUi();
  const { t, locale } = useI18n();
  const text = t.account;
  const [panel, setPanel] = useState<"none" | "password" | "delete">("none");
  const user = cloud.user!;
  return (
    <section className="account-section">
      <div className="profile-card">
        <div className="profile-avatar" aria-hidden="true">{user.username.charAt(0).toUpperCase()}</div>
        <div>
          <h3>{user.username}</h3>
          <p className="modal-hint">{user.email}</p>
        </div>
      </div>
      <div className={`cloud-status status-${cloud.status}`}>
        <span className={`sync-dot sync-${cloud.status}`} aria-hidden="true" />
        <div>
          <strong>{text.status[cloud.status]}</strong>
          {cloud.lastSyncAt ? <span className="modal-hint"> · {new Date(cloud.lastSyncAt).toLocaleTimeString(intlLocale(locale))}</span> : null}
          {cloud.message ? <p className="cloud-message">{cloud.message}</p> : null}
        </div>
      </div>
      {cloud.status === "rejected" ? (
        <p className="form-error">{text.rejected}</p>
      ) : null}
      <p className="modal-hint">{text.saveInfo}</p>
      <div className="account-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPanel(panel === "password" ? "none" : "password")}>{text.changePassword}</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => void cloud.logout().then(() => ui.toast({ tone: "info", title: text.loggedOutTitle, text: text.loggedOutText }))}>{text.logout}</button>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => setPanel(panel === "delete" ? "none" : "delete")}>{text.deleteAccount}</button>
      </div>
      {panel === "password" ? <ChangePassword onDone={() => setPanel("none")} /> : null}
      {panel === "delete" ? <DeleteAccount /> : null}
    </section>
  );
}

function ChangePassword({ onDone }: { onDone: () => void }) {
  const ui = useUi();
  const text = useI18n().t.account;
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="account-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        const result = await api.changePassword(current, next);
        setPending(false);
        if (!result.ok) return setError(result.error);
        ui.toast({ tone: "success", title: text.passwordChangedTitle, text: text.passwordChangedText });
        onDone();
      }}
    >
      <div className="field">
        <label htmlFor="current-password">{text.currentPassword}</label>
        <input id="current-password" className="input" type="password" autoComplete="current-password" required value={current} onChange={(event) => setCurrent(event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="next-password">{text.newPassword}</label>
        <input id="next-password" className="input" type="password" autoComplete="new-password" minLength={8} required value={next} onChange={(event) => setNext(event.target.value)} />
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="btn btn-gold" disabled={pending}>{text.save}</button>
    </form>
  );
}

function DeleteAccount() {
  const cloud = useCloud();
  const ui = useUi();
  const text = useI18n().t.account;
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="account-form danger-zone"
      onSubmit={async (event) => {
        event.preventDefault();
        const ok = await ui.confirm({ title: text.deleteConfirmTitle, text: text.deleteConfirmText, confirmLabel: text.deleteConfirmLabel, danger: true });
        if (!ok) return;
        const result = await api.deleteAccount(password);
        if (!result.ok) return setError(result.error);
        cloud.forget();
        ui.toast({ tone: "info", title: text.deletedTitle, text: text.deletedText });
      }}
    >
      <p>{text.deleteWarning}</p>
      <div className="field">
        <label htmlFor="delete-password">{text.password}</label>
        <input id="delete-password" className="input" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="btn btn-danger">{text.deleteAccount}</button>
    </form>
  );
}

function AuthForms() {
  const [mode, setMode] = useState<"register" | "login" | "forgot">("register");
  const text = useI18n().t.account;
  return (
    <section className="account-section">
      <div className="auth-pitch">
        <strong>{text.pitchTitle}</strong>
        <span> {text.pitchText}</span>
      </div>
      <div className="auth-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>{text.registerTab}</button>
        <button type="button" role="tab" aria-selected={mode !== "register"} className={mode !== "register" ? "active" : ""} onClick={() => setMode("login")}>{text.loginTab}</button>
      </div>
      {mode === "register" ? <RegisterForm /> : mode === "login" ? <LoginForm onForgot={() => setMode("forgot")} /> : <ForgotForm onBack={() => setMode("login")} />}
    </section>
  );
}

function RegisterForm() {
  const cloud = useCloud();
  const ui = useUi();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ text: string; field?: string } | null>(null);
  const [pending, setPending] = useState(false);
  const nameCheck = username ? validateUsername(username) : null;
  const { t, locale } = useI18n();
  const text = t.account;

  return (
    <form
      className="account-form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (nameCheck && !nameCheck.ok) return setError({ text: text.usernameIssues[nameCheck.reason], field: "username" });
        setPending(true);
        setError(null);
        const result = await api.register(email, username, password);
        setPending(false);
        if (!result.ok) return setError({ text: result.error, field: result.field });
        await cloud.connect(result.data.user);
        ui.toast({ tone: "success", icon: "cloud", title: text.welcome(result.data.user.username), text: text.welcomeText });
      }}
    >
      <div className="field">
        <label htmlFor="reg-email">{text.email}</label>
        <input id="reg-email" className="input" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={error?.field === "email"} />
      </div>
      <div className="field">
        <label htmlFor="reg-username">{text.username}</label>
        <input id="reg-username" className="input" autoComplete="username" required minLength={3} maxLength={16} value={username} onChange={(event) => setUsername(event.target.value)} aria-invalid={Boolean(nameCheck && !nameCheck.ok) || error?.field === "username"} aria-describedby="reg-username-hint" />
        <span id="reg-username-hint" className={nameCheck && !nameCheck.ok ? "field-error" : "field-hint"}>
          {nameCheck && !nameCheck.ok ? text.usernameIssues[nameCheck.reason] : text.usernameHint}
        </span>
      </div>
      <div className="field">
        <label htmlFor="reg-password">{text.password}</label>
        <input id="reg-password" className="input" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={error?.field === "password"} />
        <span className="field-hint">{text.passwordHint}</span>
      </div>
      {error ? <p className="form-error" role="alert">{error.text}</p> : null}
      <button className="btn btn-gold" disabled={pending}>{pending ? text.creating : text.register}</button>
      <p className="modal-hint">{text.privacyBefore} <Link href={href(locale, "privacy")} target="_blank">{text.privacyLink}</Link>{text.privacyAfter}</p>
    </form>
  );
}

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const cloud = useCloud();
  const ui = useUi();
  const text = useI18n().t.account;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="account-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);
        const result = await api.login(email, password);
        setPending(false);
        if (!result.ok) return setError(result.error);
        await cloud.connect(result.data.user);
        ui.toast({ tone: "success", icon: "cloud", title: text.welcomeBack(result.data.user.username) });
      }}
    >
      <div className="field">
        <label htmlFor="login-email">{text.email}</label>
        <input id="login-email" className="input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="login-password">{text.password}</label>
        <input id="login-password" className="input" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="btn btn-gold" disabled={pending}>{pending ? text.loggingIn : text.login}</button>
      <button type="button" className="link-button" onClick={onForgot}>{text.forgotLink}</button>
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const text = useI18n().t.account;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="account-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        const result = await api.forgot(email);
        setPending(false);
        setMessage(result.ok ? { ok: true, text: result.data.message } : { ok: false, text: result.error });
      }}
    >
      <p className="modal-text">{text.forgotIntro}</p>
      <div className="field">
        <label htmlFor="forgot-email">{text.email}</label>
        <input id="forgot-email" className="input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>
      {message ? <p className={message.ok ? "form-success" : "form-error"} role="status">{message.text}</p> : null}
      <button className="btn btn-gold" disabled={pending}>{text.sendLink}</button>
      <button type="button" className="link-button" onClick={onBack}>{text.backToLogin}</button>
    </form>
  );
}

function NewGame() {
  const cloud = useCloud();
  const ui = useUi();
  const text = useI18n().t.account;
  return (
    <section className="account-section">
      <h3 className="section-heading">{text.restart}</h3>
      <p className="modal-hint">
        {cloud.user ? text.restartHintAccount : text.restartHintGuest}
      </p>
      <div className="account-actions">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={async () => {
            const ok = await ui.confirm({
              title: text.restartConfirmTitle,
              text: cloud.user ? text.restartConfirmAccount : text.restartConfirmGuest,
              confirmLabel: text.restartConfirmLabel,
              danger: true
            });
            if (!ok) return;
            await cloud.newGame();
            ui.toast({ tone: "info", title: text.restartDone });
          }}
        >
          {text.newGame}
        </button>
      </div>
    </section>
  );
}
