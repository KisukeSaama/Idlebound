"use client";

import { intlLocale, USERNAME_MAX, USERNAME_MIN, validateUsername } from "@idlebound/game";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/routing";
import { api } from "@/lib/api";
import { useCloud, useUi } from "../context";
import { WindowIcon } from "../icons";
import { Modal } from "../components/Modal";

export function AccountWindow({ onClose }: { onClose: () => void }) {
  const cloud = useCloud();
  const { t } = useI18n();
  return (
    <Modal title={t.hud.windowTitles.account.label} icon={<WindowIcon id="account" />} onClose={onClose} size="md">
      {cloud.user ? <Profile /> : (
        <>
          <AuthForms />
          <NewGame />
        </>
      )}
    </Modal>
  );
}

function Profile() {
  const cloud = useCloud();
  const ui = useUi();
  const text = useI18n().t.account;
  const [panel, setPanel] = useState<"none" | "username" | "password" | "delete">("none");
  const [showEmail, setShowEmail] = useState(false);
  const user = cloud.user!;
  const email = showEmail ? user.email : maskEmail(user.email);
  return (
    <section className="account-section">
      <div className="profile-card">
        <div className="profile-avatar" aria-hidden="true">{user.username.charAt(0).toUpperCase()}</div>
        <div>
          <h3>{user.username}</h3>
          <p className="modal-hint profile-email">
            <span>{email}</span>
            <button type="button" className="profile-email-toggle" aria-pressed={showEmail} onClick={() => setShowEmail(!showEmail)}>
              {showEmail ? text.hideEmail : text.showEmail}
            </button>
          </p>
        </div>
      </div>
      {!user.emailVerified ? <VerifyNotice email={email} /> : null}
      <LedgerStatus />
      <p className="modal-hint">{text.saveInfo}</p>
      <div className="account-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPanel(panel === "username" ? "none" : "username")}>{text.changeUsername}</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPanel(panel === "password" ? "none" : "password")}>{text.changePassword}</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => void cloud.logout().then(() => ui.toast({ tone: "info", title: text.loggedOutTitle, text: text.loggedOutText }))}>{text.logout}</button>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => setPanel(panel === "delete" ? "none" : "delete")}>{text.deleteAccount}</button>
      </div>
      {panel === "username" ? <ChangeUsername onDone={() => setPanel("none")} /> : null}
      {panel === "password" ? <ChangePassword onDone={() => setPanel("none")} /> : null}
      {panel === "delete" ? <DeleteAccount /> : null}
    </section>
  );
}

/** Hides an address on screen (streams, shared screens) while its owner still recognises it: a***@h***.fr. */
function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 1) return "***";
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  const host = dot > 0 ? domain.slice(0, dot) : domain;
  const tld = dot > 0 ? domain.slice(dot) : "";
  return `${email.charAt(0)}***@${host.charAt(0)}***${tld}`;
}

/** What the Ledger holds of this game, an account's or a guest's: state, last save, trouble. */
function LedgerStatus() {
  const cloud = useCloud();
  const { t, locale } = useI18n();
  const text = t.account;
  return (
    <>
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
    </>
  );
}

/** Address to confirm: deadline, resend, and a way to fix a mistyped address. */
function VerifyNotice({ email }: { email: string }) {
  const cloud = useCloud();
  const { t, locale } = useI18n();
  const text = t.account;
  const user = cloud.user!;
  const [info, setInfo] = useState<{ ok: boolean; text: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const deadline = user.verifyBy ? new Date(user.verifyBy) : null;
  const overdue = cloud.status === "unverified" || (deadline !== null && deadline.getTime() <= Date.now());
  const deadlineText = deadline ? deadline.toLocaleString(intlLocale(locale), { dateStyle: "long", timeStyle: "short" }) : "";
  return (
    <div className={`verify-notice ${overdue ? "is-overdue" : ""}`} role={overdue ? "alert" : undefined}>
      <strong>{text.ledger.seal} <span className="ledger-plain">{text.ledger.sealPlain}</span></strong>
      <p>{overdue ? text.verifyOverdue(email) : text.verifyText(email, deadlineText)}</p>
      {info ? <p className={info.ok ? "form-success" : "form-error"} role="status">{info.text}</p> : null}
      <div className="account-actions">
        <button
          type="button"
          className="btn btn-gold btn-sm"
          disabled={pending}
          onClick={async () => {
            setPending(true);
            const result = await api.resendVerification();
            setPending(false);
            if (!result.ok && result.status === 400) await cloud.refreshUser();
            setInfo(result.ok ? { ok: true, text: text.resent } : { ok: false, text: result.error });
          }}
        >
          {text.resend}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(!editing)}>{text.wrongEmail}</button>
      </div>
      {editing ? (
        <ChangeEmail
          onDone={() => {
            setEditing(false);
            setInfo({ ok: true, text: text.emailChanged });
          }}
        />
      ) : null}
    </div>
  );
}

function ChangeEmail({ onDone }: { onDone: () => void }) {
  const cloud = useCloud();
  const text = useI18n().t.account;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ text: string; field?: string } | null>(null);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="account-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);
        const result = await api.changeEmail(email, password);
        setPending(false);
        if (!result.ok) return setError({ text: result.error, field: result.field });
        cloud.setUser(result.data.user);
        onDone();
      }}
    >
      <div className="field">
        <label htmlFor="change-email">{text.newEmail}</label>
        <input id="change-email" className="input" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={error?.field === "email"} />
      </div>
      <div className="field">
        <label htmlFor="change-email-password">{text.password}</label>
        <input id="change-email-password" className="input" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={error?.field === "password"} />
      </div>
      {error ? <p className="form-error" role="alert">{error.text}</p> : null}
      <button className="btn btn-sm" disabled={pending}>{text.saveEmail}</button>
    </form>
  );
}

/** A new username, once every few months: past the change, the window says when the next one opens. */
function ChangeUsername({ onDone }: { onDone: () => void }) {
  const cloud = useCloud();
  const ui = useUi();
  const { t, locale } = useI18n();
  const text = t.account;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ text: string; field?: string } | null>(null);
  const [pending, setPending] = useState(false);
  const renameAt = cloud.user?.renameAt ? new Date(cloud.user.renameAt) : null;
  if (renameAt && renameAt.getTime() > Date.now()) {
    return <p className="modal-hint account-form" role="status">{text.renameLocked(renameAt.toLocaleDateString(intlLocale(locale), { dateStyle: "long" }))}</p>;
  }
  const nameCheck = username ? validateUsername(username) : null;
  return (
    <form
      className="account-form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (nameCheck && !nameCheck.ok) return setError({ text: text.usernameIssues[nameCheck.reason], field: "username" });
        setPending(true);
        setError(null);
        const result = await api.changeUsername(username, password);
        setPending(false);
        if (!result.ok) {
          // Renamed from another device in the meantime: the account now says when.
          if (result.code === "rename_too_soon") await cloud.refreshUser();
          return setError({ text: result.error, field: result.field });
        }
        cloud.setUser(result.data.user);
        ui.toast({ tone: "success", title: text.renamedTitle, text: text.renamedText(result.data.user.username) });
        onDone();
      }}
    >
      <div className="field">
        <label htmlFor="rename-username">{text.newUsername}</label>
        <input id="rename-username" className="input" autoComplete="username" required minLength={USERNAME_MIN} maxLength={USERNAME_MAX} value={username} onChange={(event) => setUsername(event.target.value)} aria-invalid={Boolean(nameCheck && !nameCheck.ok) || error?.field === "username"} aria-describedby="rename-username-hint" />
        <span id="rename-username-hint" className={nameCheck && !nameCheck.ok ? "field-error" : "field-hint"}>
          {nameCheck && !nameCheck.ok ? text.usernameIssues[nameCheck.reason] : text.renameHint}
        </span>
      </div>
      <div className="field">
        <label htmlFor="rename-password">{text.password}</label>
        <input id="rename-password" className="input" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={error?.field === "password"} />
      </div>
      {error ? <p className="form-error" role="alert">{error.text}</p> : null}
      <button className="btn btn-gold" disabled={pending}>{text.renameSave}</button>
    </form>
  );
}

function ChangePassword({ onDone }: { onDone: () => void }) {
  const ui = useUi();
  const text = useI18n().t.account;
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="account-form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (next !== confirm) return setError(text.passwordMismatch);
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
      <div className="field">
        <label htmlFor="next-password-confirm">{text.confirmPassword}</label>
        <input id="next-password-confirm" className="input" type="password" autoComplete="new-password" required value={confirm} onChange={(event) => setConfirm(event.target.value)} aria-invalid={Boolean(confirm) && confirm !== next} />
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
  const cloud = useCloud();
  const text = useI18n().t.account;
  // The session ended under an account's game: it is not a guest's, and nothing keeps it.
  // Signing in again keeps it; another account starts its own game, so no pitch promises it.
  const adrift = cloud.status === "offline";
  const [mode, setMode] = useState<"register" | "login" | "forgot">(adrift ? "login" : "register");
  return (
    <section className="account-section">
      <div className="profile-card is-guest">
        <div className="profile-avatar" aria-hidden="true">?</div>
        <div>
          <h3>{text.ledger.guest}</h3>
          {adrift ? null : <p className="modal-hint">{text.ledger.guestPlain}</p>}
        </div>
      </div>
      <LedgerStatus />
      {adrift ? null : <p className="modal-hint">{text.guestInfo}</p>}
      {adrift ? null : (
        <div className="auth-pitch">
          <strong>{text.pitchTitle}</strong>
          <span> {text.pitchText}</span>
        </div>
      )}
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
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<{ text: string; field?: string } | null>(null);
  const [pending, setPending] = useState(false);
  const mismatch = confirm.length > 0 && confirm !== password;
  const nameCheck = username ? validateUsername(username) : null;
  const { t, locale } = useI18n();
  const text = t.account;

  return (
    <form
      className="account-form"
      aria-labelledby="reg-title"
      onSubmit={async (event) => {
        event.preventDefault();
        if (nameCheck && !nameCheck.ok) return setError({ text: text.usernameIssues[nameCheck.reason], field: "username" });
        // The mismatch is already shown under the field.
        if (mismatch) return;
        setPending(true);
        setError(null);
        const result = await api.register(email, username, password);
        setPending(false);
        if (!result.ok) return setError({ text: result.error, field: result.field });
        const user = result.data.user;
        await cloud.connect(user);
        ui.toast({ tone: "success", icon: "cloud", title: text.welcome(user.username), text: user.emailVerified ? text.welcomeText : text.checkInbox(maskEmail(user.email)) });
      }}
    >
      <p id="reg-title" className="ledger-voice">{text.ledger.inscribe} <span className="ledger-plain">{text.ledger.inscribePlain}</span></p>
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
      <div className="field">
        <label htmlFor="reg-password-confirm">{text.confirmPassword}</label>
        <input id="reg-password-confirm" className="input" type="password" autoComplete="new-password" required maxLength={128} value={confirm} onChange={(event) => setConfirm(event.target.value)} aria-invalid={mismatch} aria-describedby={mismatch ? "reg-password-confirm-error" : undefined} />
        {mismatch ? <span id="reg-password-confirm-error" className="field-error">{text.passwordMismatch}</span> : null}
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
        setMessage(result.ok ? { ok: true, text: text.forgotSent } : { ok: false, text: result.error });
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

/** Guests only: an account's game is never erased from here. */
function NewGame() {
  const cloud = useCloud();
  const ui = useUi();
  const text = useI18n().t.account;
  return (
    <section className="account-section">
      <h3 className="section-heading">{text.restart}</h3>
      <p className="modal-hint">
        {text.restartHint}
      </p>
      <div className="account-actions">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={async () => {
            const ok = await ui.confirm({
              title: text.restartConfirmTitle,
              text: text.restartConfirmText,
              confirmLabel: text.restartConfirmLabel,
              danger: true
            });
            if (!ok) return;
            cloud.newGame();
            ui.toast({ tone: "info", title: text.restartDone });
          }}
        >
          {text.newGame}
        </button>
      </div>
    </section>
  );
}
