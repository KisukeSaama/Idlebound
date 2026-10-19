import { isLocale, type Locale } from "@idlebound/game";
import { and, eq, gte, isNull, lt, not, or, sql } from "drizzle-orm";
import { db } from "../db/client";
import { leaderboard, users } from "../db/schema";
import { env } from "../env";
import { issueVerificationLink } from "./confirm";
import { inactivityMail, sendMail, verifyReminderMail } from "./mail";
import { UNVERIFIED_ACCOUNT_DAYS } from "./verification";

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
      await sendMail(user.email, mail);
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

/** Reminders to confirm the address, by the day after sign-up they are sent on. */
export const VERIFY_REMINDER_DAYS = [7, 25] as const;
/** Days between two reminders, and between the last one and the deletion: never two mails at once. */
const REMINDER_GAP_DAYS = 3;
/**
 * A never-confirmed account whose game went past this stage is not deleted: its walker is
 * reminded, and the account stays until it is confirmed (or inactive for 3 years).
 */
export const UNVERIFIED_KEPT_STAGE = 50;

/**
 * Reminds the accounts whose address is still unconfirmed (day 7, then day 25, each with a
 * new link), then deletes them well after the grace period: the address and the username
 * become free again (typo, or someone else's address). Never without both reminders sent, and
 * never an account whose game went past UNVERIFIED_KEPT_STAGE.
 */
export async function purgeUnverifiedAccounts(now = new Date()) {
  // Without SMTP nobody can confirm anything: nothing is sent, nothing is deleted.
  if (!env.SMTP_URL) return;
  const day = (days: number) => new Date(now.getTime() - days * DAY);
  const kept = sql`exists (select 1 from ${leaderboard} where ${leaderboard.userId} = ${users.id} and ${leaderboard.maxStage} > ${UNVERIFIED_KEPT_STAGE})`;
  const removed = await db.delete(users)
    .where(and(
      isNull(users.emailVerifiedAt),
      lt(users.createdAt, day(UNVERIFIED_ACCOUNT_DAYS)),
      gte(users.verifyReminders, VERIFY_REMINDER_DAYS.length),
      lt(users.verifyRemindedAt, day(REMINDER_GAP_DAYS)),
      not(kept)
    ))
    .returning({ id: users.id });
  if (removed.length > 0) console.log(`[api] ${removed.length} never-confirmed account(s) deleted`);

  for (const [index, after] of VERIFY_REMINDER_DAYS.entries()) {
    const due = await db
      .select({ id: users.id, email: users.email, username: users.username, locale: users.locale, createdAt: users.createdAt, kept: sql<boolean>`${kept}` })
      .from(users)
      .where(and(
        isNull(users.emailVerifiedAt),
        eq(users.verifyReminders, index),
        lt(users.createdAt, day(after)),
        or(isNull(users.verifyRemindedAt), lt(users.verifyRemindedAt, day(REMINDER_GAP_DAYS)))
      ))
      .orderBy(users.createdAt)
      .limit(NOTICE_BATCH);
    for (const user of due) {
      const locale: Locale = isLocale(user.locale) ? user.locale : "fr";
      // Deleted no sooner than the usual day, and never sooner than a gap after the last reminder.
      const lastReminder = now.getTime() + (VERIFY_REMINDER_DAYS.length - 1 - index) * REMINDER_GAP_DAYS * DAY;
      const deletesAt = user.kept ? null : new Date(Math.max(user.createdAt.getTime() + UNVERIFIED_ACCOUNT_DAYS * DAY, lastReminder + REMINDER_GAP_DAYS * DAY));
      try {
        const link = await issueVerificationLink(user, locale);
        await sendMail(user.email, verifyReminderMail(user.username, link, deletesAt, locale));
      } catch (error) {
        // Not counted: the next run retries, and the account cannot be deleted meanwhile.
        console.error("[mail] confirmation reminder failed", error);
        continue;
      }
      await db.update(users).set({ verifyReminders: index + 1, verifyRemindedAt: now })
        .where(and(eq(users.id, user.id), eq(users.verifyReminders, index), isNull(users.emailVerifiedAt)));
    }
  }
}
