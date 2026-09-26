import { isLocale, type Locale } from "@idlebound/game";
import { and, eq, isNull, lt } from "drizzle-orm";
import { db } from "../db/client";
import { users } from "../db/schema";
import { env } from "../env";
import { messagesFor } from "./i18n";
import { sendMail } from "./mail";

const DAY = 86_400_000;
/** An account with no activity for 3 years is deleted along with all its data. */
export const INACTIVE_ACCOUNT_DAYS = 3 * 365;
/** The player is warned by e-mail this long before deletion, and is never deleted without a warning. */
export const INACTIVITY_NOTICE_DAYS = 30;
/** Warnings sent per run: a large backlog is spread over several runs instead of flooding the SMTP relay. */
const NOTICE_BATCH = 200;

/** Warns accounts approaching 3 years of inactivity, deletes those warned long enough ago. */
export async function purgeInactiveAccounts(now = new Date()) {
  // Without SMTP, production would "warn" into its logs and then delete: nothing happens until it is configured.
  // In development, mails go to the logs (or Mailpit) and the purge runs normally.
  if (env.NODE_ENV === "production" && !env.SMTP_URL) {
    console.warn("[api] SMTP_URL is not set: inactive accounts are neither warned nor deleted");
    return;
  }
  const inactiveSince = new Date(now.getTime() - INACTIVE_ACCOUNT_DAYS * DAY);
  const warnedBefore = new Date(now.getTime() - INACTIVITY_NOTICE_DAYS * DAY);
  // Both conditions: an account already past 3 years when this shipped still gets its 30 days.
  // Sessions, saves, leaderboard entries and audit logs follow by cascade.
  const removed = await db.delete(users)
    .where(and(lt(users.lastSeenAt, inactiveSince), lt(users.inactivityNoticeAt, warnedBefore)))
    .returning({ id: users.id });
  if (removed.length > 0) console.log(`[api] ${removed.length} account(s) deleted after 3 years of inactivity`);

  const warnSince = new Date(inactiveSince.getTime() + INACTIVITY_NOTICE_DAYS * DAY);
  const due = await db
    .select({ id: users.id, email: users.email, username: users.username, locale: users.locale, lastSeenAt: users.lastSeenAt })
    .from(users)
    .where(and(lt(users.lastSeenAt, warnSince), isNull(users.inactivityNoticeAt)))
    .orderBy(users.lastSeenAt)
    .limit(NOTICE_BATCH);
  for (const user of due) {
    const locale: Locale = isLocale(user.locale) ? user.locale : "fr";
    const deletesAt = new Date(Math.max(user.lastSeenAt.getTime() + INACTIVE_ACCOUNT_DAYS * DAY, now.getTime() + INACTIVITY_NOTICE_DAYS * DAY));
    const mail = inactivityMail(user.username, `${env.PUBLIC_SITE_URL}/${locale}/play`, deletesAt, locale);
    try {
      await sendMail(user.email, mail.subject, mail.text, mail.html);
    } catch (error) {
      // Not marked as warned: the next run retries, and the account cannot be deleted meanwhile.
      console.error("[mail] inactivity notice failed", error);
      continue;
    }
    // Guarded on inactivity: a player who came back since the select must not carry a stale warning.
    await db.update(users).set({ inactivityNoticeAt: now })
      .where(and(eq(users.id, user.id), lt(users.lastSeenAt, warnSince), isNull(users.inactivityNoticeAt)));
  }
}

export function inactivityMail(username: string, link: string, deletesAt: Date, locale: Locale) {
  const m = messagesFor(locale).inactivityMail;
  const date = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(deletesAt);
  const text = [m.greeting(username), "", m.notice(date), "", `${m.keep} ${link}`, "", m.ignore].join("\n");
  const html = `<!doctype html><html lang="${locale}"><body style="font-family:system-ui,sans-serif;background:#0b0b14;color:#e9e4ff;padding:32px">
<div style="max-width:480px;margin:auto;background:#161426;border:1px solid #3b2f63;border-radius:12px;padding:28px">
<h1 style="font-size:20px;color:#f5c85b;margin:0 0 16px">Idlebound</h1>
<p>${escapeHtml(m.greeting(username))}</p>
<p>${escapeHtml(m.notice(date))}</p>
<p>${escapeHtml(m.keep)}</p>
<p style="text-align:center;margin:28px 0"><a href="${escapeHtml(link)}" style="background:#f5c85b;color:#1a1204;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:700">${escapeHtml(m.button)}</a></p>
<p style="color:#a79fcc;font-size:13px">${escapeHtml(m.ignore)}</p>
</div></body></html>`;
  return { subject: m.subject, text, html };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}
