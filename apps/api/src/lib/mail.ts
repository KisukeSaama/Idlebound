import type { Locale } from "@idlebound/game";
import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../env";
import { messagesFor } from "./i18n";

let transporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (transporter === undefined) transporter = env.SMTP_URL ? nodemailer.createTransport(env.SMTP_URL) : null;
  return transporter;
}

/** Startup check: a wrong SMTP_URL shows up in the logs right away, not at the first sign-up. */
export async function checkMailTransport(): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    console.warn("[mail] SMTP_URL is not set: e-mails go to the logs and e-mail confirmation is off");
    return;
  }
  try {
    await transport.verify();
    console.log("[mail] SMTP connection verified");
  } catch (error) {
    console.error("[mail] SMTP connection failed", error);
  }
}

export interface Mail {
  subject: string;
  text: string;
  html: string;
}

export async function sendMail(to: string, mail: Mail): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    // No SMTP configured (development): the link can be read in the container logs.
    console.info(`[mail] To ${to}: ${mail.subject}\n${mail.text}`);
    return;
  }
  await transport.sendMail({ from: env.MAIL_FROM, to, subject: mail.subject, text: mail.text, html: mail.html });
}

/** E-mail confirmation, sent at sign-up, on request, and after an address change. */
export function verifyEmailMail(username: string, link: string, locale: Locale): Mail {
  const m = messagesFor(locale).verifyMail;
  return render(locale, { subject: m.subject, preheader: m.preheader, title: m.title, body: [m.body(username)], button: m.button, link, note: m.note });
}

/** Password-reset e-mail, in the language the player asked for it in. */
export function resetPasswordMail(username: string, link: string, locale: Locale): Mail {
  const m = messagesFor(locale).resetMail;
  return render(locale, { subject: m.subject, preheader: m.preheader, title: m.title, body: [m.body(username)], button: m.button, link, note: m.note });
}

/** Warning sent 30 days before an inactive account is deleted. */
export function inactivityMail(username: string, link: string, deletesAt: Date, locale: Locale): Mail {
  const m = messagesFor(locale).inactivityMail;
  const date = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(deletesAt);
  return render(locale, { subject: m.subject, preheader: m.preheader(date), title: m.title, body: [m.body(username, date)], button: m.button, link, note: m.note });
}

interface MailContent {
  subject: string;
  /** Preview line shown next to the subject in the inbox. */
  preheader: string;
  title: string;
  body: string[];
  button: string;
  link: string;
  note: string;
}

/*
 * The site's identity in an e-mail: night background, framed panel, Cinzel gold title, gold
 * button. Built with tables and inline styles because mail clients ignore most CSS; the
 * colors are the tokens of apps/web/src/app/globals.css. The page declares itself dark so
 * clients do not invert it, and the button is a block that never breaks around its label.
 */
const C = {
  bg: "#0b0a14",
  panel: "#171428",
  border: "#372c58",
  text: "#efe9ff",
  muted: "#a69ec8",
  faint: "#6f6794",
  gold: "#f5c85b",
  goldText: "#241603"
};
const DISPLAY = "Cinzel,Georgia,'Times New Roman',serif";
const BODY = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function render(locale: Locale, content: MailContent): Mail {
  const common = messagesFor(locale).mail;
  const site = env.PUBLIC_SITE_URL;
  const home = `${site}/${locale}`;
  const text = [
    content.title,
    "",
    ...content.body.flatMap((line) => [line, ""]),
    content.button,
    content.link,
    "",
    content.note,
    "",
    "--",
    `Idlebound · ${home}`
  ].join("\n");

  const paragraphs = content.body
    .map((line) => `<p style="margin:0 0 16px;font-family:${BODY};font-size:16px;line-height:1.6;color:${C.text}">${escapeHtml(line)}</p>`)
    .join("");
  const link = escapeHtml(content.link);

  const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(content.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&amp;family=Inter:wght@400;700&amp;display=swap" rel="stylesheet">
<style>
:root{color-scheme:dark;supported-color-schemes:dark}
body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%}
a{color:${C.gold}}
@media (max-width:540px){
.ib-outer{padding:20px 12px!important}
.ib-card{padding:28px 20px!important}
.ib-title{font-size:22px!important}
.ib-btn,.ib-btn a{display:block!important;width:100%!important;box-sizing:border-box}
}
</style>
</head>
<body style="margin:0;padding:0;background-color:${C.bg}" bgcolor="${C.bg}">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all">${escapeHtml(content.preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background-color:${C.bg}">
<tr><td class="ib-outer" align="center" style="padding:36px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px">
<tr><td align="center" style="padding:0 0 24px">
<a href="${escapeHtml(home)}" style="text-decoration:none"><img src="${escapeHtml(`${site}/assets/brand/idlebound-logo-mail.png`)}" width="220" alt="Idlebound" style="display:block;width:220px;max-width:70%;height:auto;border:0;outline:none;font-family:${DISPLAY};font-size:30px;font-weight:700;color:${C.gold}"></a>
</td></tr>
<tr><td class="ib-card" bgcolor="${C.panel}" style="background-color:${C.panel};border:1px solid ${C.border};border-radius:12px;padding:36px 32px">
<h1 class="ib-title" style="margin:0 0 18px;font-family:${DISPLAY};font-size:24px;line-height:1.3;font-weight:700;color:${C.gold}">${escapeHtml(content.title)}</h1>
${paragraphs}
<table role="presentation" class="ib-btn" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px">
<tr><td class="ib-btn" align="center" bgcolor="${C.gold}" style="border-radius:8px;background-color:${C.gold};background-image:linear-gradient(180deg,#ffd978,#e0a53c)">
<a href="${link}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${BODY};font-size:16px;line-height:20px;font-weight:700;color:${C.goldText};text-decoration:none;border-radius:8px">${escapeHtml(content.button)}</a>
</td></tr>
</table>
<p style="margin:24px 0 0;font-family:${BODY};font-size:14px;line-height:1.55;color:${C.muted}">${escapeHtml(content.note)}</p>
<p style="margin:20px 0 0;padding-top:16px;border-top:1px solid ${C.border};font-family:${BODY};font-size:12px;line-height:1.5;color:${C.faint}">${escapeHtml(common.fallback)}<br><a href="${link}" style="color:${C.muted};word-break:break-all">${link}</a></p>
</td></tr>
<tr><td align="center" style="padding:20px 8px 0;font-family:${BODY};font-size:12px;line-height:1.5;color:${C.faint}">
${escapeHtml(common.footer)} · <a href="${escapeHtml(home)}" style="color:${C.muted};text-decoration:none">${escapeHtml(new URL(site).host)}</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  return { subject: content.subject, text, html };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}
