import type { Locale } from "@idlebound/game";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { emailVerifications } from "../db/schema";
import { env } from "../env";
import { hashToken, newToken } from "./session";
import { VERIFY_LINK_DAYS } from "./verification";

/**
 * A new confirmation link for the account's address: the previous ones stop working (a link
 * only ever confirms the address it was sent to). Returns the link to put in the e-mail.
 */
export async function issueVerificationLink(user: { id: string; email: string }, locale: Locale): Promise<string> {
  const token = newToken();
  await db.delete(emailVerifications).where(eq(emailVerifications.userId, user.id));
  await db.insert(emailVerifications).values({
    id: hashToken(token),
    userId: user.id,
    email: user.email,
    expiresAt: new Date(Date.now() + VERIFY_LINK_DAYS * 86_400_000)
  });
  return `${env.PUBLIC_SITE_URL}/${locale}/verify-email?token=${encodeURIComponent(token)}`;
}
