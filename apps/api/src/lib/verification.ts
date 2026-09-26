import { env } from "../env";

const DAY = 86_400_000;

/**
 * E-mail confirmation. It is only required when e-mails really leave the server (SMTP_URL
 * set); otherwise sign-ups are confirmed on creation. A new player can play and save right
 * away and has a few days to click the link; after that, saves are refused until the
 * address is confirmed. An account never confirmed is deleted, which frees an address or a
 * username taken with a typo or by someone else.
 */
export const VERIFY_GRACE_DAYS = 3;
/** Validity of a confirmation link; a new one can be requested at any time from the game. */
export const VERIFY_LINK_DAYS = 7;
/** A never-confirmed account is deleted this long after sign-up. */
export const UNVERIFIED_ACCOUNT_DAYS = 30;

/** Confirmation is required only when e-mails are really sent: without SMTP nobody could comply. */
export function verificationRequired(): boolean {
  return Boolean(env.SMTP_URL);
}

/** Deadline to confirm the address, or null when there is nothing to confirm. */
export function verifyDeadline(user: { emailVerifiedAt: Date | null; createdAt: Date }): Date | null {
  if (user.emailVerifiedAt || !verificationRequired()) return null;
  return new Date(user.createdAt.getTime() + VERIFY_GRACE_DAYS * DAY);
}

/** Past the grace period without a confirmed address: saves are refused. */
export function verificationOverdue(user: { emailVerifiedAt: Date | null; createdAt: Date }, now = Date.now()): boolean {
  const deadline = verifyDeadline(user);
  return deadline !== null && deadline.getTime() <= now;
}
