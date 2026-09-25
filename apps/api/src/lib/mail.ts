import type { Locale } from "@idlebound/game";
import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../env";
import { messagesFor } from "./i18n";

let transporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (transporter === undefined) transporter = env.SMTP_URL ? nodemailer.createTransport(env.SMTP_URL) : null;
  return transporter;
}

export async function sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    // No SMTP configured (development): the link can be read in the container logs.
    console.info(`[mail] To ${to}: ${subject}\n${text}`);
    return;
  }
  await transport.sendMail({ from: env.MAIL_FROM, to, subject, text, html });
}

/** Password-reset e-mail, in the language the player asked for it in. */
export function resetPasswordMail(username: string, link: string, locale: Locale) {
  const m = messagesFor(locale).resetMail;
  const text = [m.greeting(username), "", m.intro, m.linkText(link), "", m.ignore].join("\n");
  const html = `<!doctype html><html lang="${locale}"><body style="font-family:system-ui,sans-serif;background:#0b0b14;color:#e9e4ff;padding:32px">
<div style="max-width:480px;margin:auto;background:#161426;border:1px solid #3b2f63;border-radius:12px;padding:28px">
<h1 style="font-size:20px;color:#f5c85b;margin:0 0 16px">Idlebound</h1>
<p>${escapeHtml(m.greeting(username))}</p>
<p>${escapeHtml(m.htmlIntro)}</p>
<p style="text-align:center;margin:28px 0"><a href="${escapeHtml(link)}" style="background:#f5c85b;color:#1a1204;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:700">${escapeHtml(m.button)}</a></p>
<p style="color:#a79fcc;font-size:13px">${escapeHtml(m.ignore)}</p>
</div></body></html>`;
  return { subject: m.subject, text, html };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}
