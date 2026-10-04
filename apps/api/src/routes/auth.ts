import { usernameKey, validateUsername, type ApiError, type Locale } from "@idlebound/game";
import { and, eq, gt, isNull, ne } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { z } from "zod";
import { db } from "../db/client";
import { emailVerifications, passwordResets, users } from "../db/schema";
import { env } from "../env";
import { guestId } from "../lib/guest";
import { fail } from "../lib/errors";
import { localeOf } from "../lib/i18n";
import { resetPasswordMail, sendMail, verifyEmailMail } from "../lib/mail";
import { checkPasswordStrength, dummyVerify, hashPassword, verifyPassword } from "../lib/password";
import { clientIp, limiter, tooMany } from "../lib/rate-limit";
import { createSession, currentUser, destroyAllSessions, destroySession, hashToken, newToken } from "../lib/session";
import { VERIFY_LINK_DAYS, verificationRequired, verifyDeadline } from "../lib/verification";

const registerIp = limiter(5, 60 * 60_000);
const loginIp = limiter(20, 15 * 60_000);
/** Guesses at one account from one address. A success clears it, so what it holds are failures. */
const loginAttempt = limiter(8, 15 * 60_000);
/**
 * Looser ceiling per account, whatever the address. Once it is spent, only an address that
 * has not failed on this account yet may try: a botnet hammering someone's e-mail cannot
 * lock the player out (their own address is clean), and each of its addresses that already
 * guessed wrong stays refused.
 */
const loginAccount = limiter(60, 15 * 60_000);
const forgotIp = limiter(5, 60 * 60_000);
const resetIp = limiter(10, 60 * 60_000);
const forgotAccount = limiter(3, 60 * 60_000);
const sensitiveUser = limiter(10, 15 * 60_000);
const verifyIp = limiter(20, 60 * 60_000);
const resendUser = limiter(3, 60 * 60_000);

const email = z.string().trim().toLowerCase().max(254).pipe(z.email());
const password = z.string().min(1).max(256);

const registerBody = z.object({ email, username: z.string().max(64), password });
const loginBody = z.object({ email, password });
const forgotBody = z.object({ email });
const resetBody = z.object({ token: z.string().min(20).max(100), password });
const changeBody = z.object({ currentPassword: password, newPassword: password });
const deleteBody = z.object({ password });
const verifyBody = z.object({ token: z.string().min(20).max(100) });
const emailBody = z.object({ email, password });

/** Parses the JSON body, or says which error code to answer. */
async function body<T>(c: Context, schema: z.ZodType<T>): Promise<{ data: T } | { error: ApiError }> {
  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    return fail("invalid_request");
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return fail(parsed.error.issues[0]?.path[0] === "email" ? "invalid_email" : "invalid_request");
  return { data: parsed.data };
}

function publicUser(user: { id: string; username: string; email: string; emailVerifiedAt: Date | null; createdAt: Date }) {
  const deadline = verifyDeadline(user);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    emailVerified: deadline === null,
    /** Until when saves are accepted without a confirmed address. */
    verifyBy: deadline?.toISOString() ?? null
  };
}

/** A unique constraint refused the write; the ORM may wrap the driver's error in its own. */
function uniqueViolation(error: unknown): boolean {
  const failure = error as { code?: string; cause?: { code?: string } };
  return failure.code === "23505" || failure.cause?.code === "23505";
}

/** New confirmation link for the account's current address; earlier links stop working. */
async function sendVerification(user: { id: string; email: string; username: string }, locale: Locale) {
  const token = newToken();
  await db.delete(emailVerifications).where(eq(emailVerifications.userId, user.id));
  await db.insert(emailVerifications).values({
    id: hashToken(token),
    userId: user.id,
    email: user.email,
    expiresAt: new Date(Date.now() + VERIFY_LINK_DAYS * 86_400_000)
  });
  const link = `${env.PUBLIC_SITE_URL}/${locale}/verify-email?token=${encodeURIComponent(token)}`;
  sendMail(user.email, verifyEmailMail(user.username, link, locale)).catch((error) => console.error("[mail] send failed", error));
}

export const authRoutes = new Hono()
  .get("/me", async (c) => {
    const user = await currentUser(c);
    // `guest`: this browser also carries a guest's game (the client offers it to the account).
    return c.json({ user: user ? publicUser(user) : null, guest: guestId(c) !== null });
  })

  .post("/register", async (c) => {
    const wait = registerIp.consume(clientIp(c));
    if (wait > 0) return tooMany(c, wait);
    const parsed = await body(c, registerBody);
    if ("error" in parsed) return c.json({ error: parsed.error }, 400);
    const { email: address, password: secret } = parsed.data;

    const name = validateUsername(parsed.data.username);
    if (!name.ok) return c.json(fail("invalid_username", { reason: name.reason, field: "username" }), 400);
    const weak = checkPasswordStrength(secret, name.value, address);
    if (weak) return c.json(fail("weak_password", { reason: weak, field: "password" }), 400);

    const key = usernameKey(name.value);
    const [taken] = await db.select({ email: users.email, key: users.usernameKey }).from(users)
      .where(eq(users.usernameKey, key)).limit(1);
    if (taken) return c.json(fail("username_taken", { field: "username" }), 409);
    const [emailTaken] = await db.select({ id: users.id }).from(users).where(eq(users.email, address)).limit(1);
    if (emailTaken) return c.json(fail("email_taken", { field: "email" }), 409);

    const passwordHash = await hashPassword(secret);
    try {
      // Without SMTP the address cannot be checked: it is taken as is.
      const emailVerifiedAt = verificationRequired() ? null : new Date();
      const [user] = await db.insert(users).values({ email: address, username: name.value, usernameKey: key, passwordHash, emailVerifiedAt, lastLoginAt: new Date(), locale: localeOf(c) }).returning();
      await createSession(c, user.id);
      if (!user.emailVerifiedAt) await sendVerification(user, localeOf(c));
      return c.json({ user: publicUser(user) }, 201);
    } catch (error) {
      // Race between two identical sign-ups: the unique constraint decides.
      if (uniqueViolation(error)) return c.json(fail("username_or_email_taken"), 409);
      throw error;
    }
  })

  .post("/login", async (c) => {
    const wait = loginIp.consume(clientIp(c));
    if (wait > 0) return tooMany(c, wait);
    const parsed = await body(c, loginBody);
    if ("error" in parsed) return c.json({ error: parsed.error }, 400);
    const { email: address, password: secret } = parsed.data;
    const attempt = `${clientIp(c)}|${address}`;
    const failedHere = loginAttempt.count(attempt);
    const attemptWait = loginAttempt.consume(attempt);
    if (attemptWait > 0) return tooMany(c, attemptWait);
    const accountWait = loginAccount.consume(address);
    if (accountWait > 0 && failedHere > 0) return tooMany(c, accountWait);

    const [user] = await db.select().from(users).where(eq(users.email, address)).limit(1);
    const valid = user ? await verifyPassword(secret, user.passwordHash) : await dummyVerify(secret);
    if (!user || !valid) return c.json(fail("wrong_credentials"), 401);

    loginAttempt.reset(attempt);
    await db.update(users).set({ lastLoginAt: new Date(), lastSeenAt: new Date(), inactivityNoticeAt: null, locale: localeOf(c) }).where(eq(users.id, user.id));
    await createSession(c, user.id);
    return c.json({ user: publicUser(user) });
  })

  .post("/logout", async (c) => {
    await destroySession(c);
    return c.json({ ok: true });
  })

  .post("/forgot", async (c) => {
    const wait = forgotIp.consume(clientIp(c));
    if (wait > 0) return tooMany(c, wait);
    const parsed = await body(c, forgotBody);
    if ("error" in parsed) return c.json({ error: parsed.error }, 400);
    const address = parsed.data.email;
    // Same answer whether the account exists or not: no e-mail enumeration.
    const reply = c.json({ ok: true });
    if (forgotAccount.consume(address) > 0) return reply;

    const [user] = await db.select().from(users).where(eq(users.email, address)).limit(1);
    if (!user) return reply;
    const token = newToken();
    await db.insert(passwordResets).values({ id: hashToken(token), userId: user.id, expiresAt: new Date(Date.now() + 60 * 60_000) });
    // The e-mail and the page it links to use the language the player requested it in.
    const locale = localeOf(c);
    const link = `${env.PUBLIC_SITE_URL}/${locale}/reset-password?token=${encodeURIComponent(token)}`;
    sendMail(user.email, resetPasswordMail(user.username, link, locale)).catch((error) => console.error("[mail] send failed", error));
    return reply;
  })

  .post("/reset", async (c) => {
    const wait = resetIp.consume(clientIp(c));
    if (wait > 0) return tooMany(c, wait);
    const parsed = await body(c, resetBody);
    if ("error" in parsed) return c.json({ error: parsed.error }, 400);
    const id = hashToken(parsed.data.token);
    const [reset] = await db.select({ userId: passwordResets.userId }).from(passwordResets)
      .where(and(eq(passwordResets.id, id), isNull(passwordResets.usedAt), gt(passwordResets.expiresAt, new Date())))
      .limit(1);
    if (!reset) return c.json(fail("reset_link_invalid"), 400);
    const [user] = await db.select().from(users).where(eq(users.id, reset.userId)).limit(1);
    if (!user) return c.json(fail("account_not_found"), 400);
    const weak = checkPasswordStrength(parsed.data.password, user.username, user.email);
    if (weak) return c.json(fail("weak_password", { reason: weak, field: "password" }), 400);

    const passwordHash = await hashPassword(parsed.data.password);
    // The token is consumed atomically: two concurrent requests cannot both use it. Any
    // other link still in circulation for this account becomes void. Changing the address
    // deletes the links, so a link that still exists was sent to the current address.
    const applied = await db.transaction(async (tx) => {
      const [claimed] = await tx.update(passwordResets).set({ usedAt: new Date() })
        .where(and(eq(passwordResets.id, id), isNull(passwordResets.usedAt), gt(passwordResets.expiresAt, new Date())))
        .returning({ userId: passwordResets.userId });
      if (!claimed) return null;
      await tx.update(users).set({ passwordHash }).where(eq(users.id, claimed.userId));
      // The link reached the account's mailbox: that confirms the address too, if it is
      // still the one read above.
      const [confirmed] = await tx.update(users).set({ emailVerifiedAt: user.emailVerifiedAt ?? new Date() })
        .where(and(eq(users.id, claimed.userId), eq(users.email, user.email)))
        .returning({ emailVerifiedAt: users.emailVerifiedAt });
      await tx.delete(passwordResets).where(and(eq(passwordResets.userId, claimed.userId), ne(passwordResets.id, id)));
      return { emailVerifiedAt: confirmed?.emailVerifiedAt ?? user.emailVerifiedAt };
    });
    if (!applied) return c.json(fail("reset_link_invalid"), 400);
    const { emailVerifiedAt } = applied;
    await destroyAllSessions(user.id);
    await createSession(c, user.id);
    return c.json({ user: publicUser({ ...user, emailVerifiedAt }) });
  })

  .post("/verify", async (c) => {
    const wait = verifyIp.consume(clientIp(c));
    if (wait > 0) return tooMany(c, wait);
    const parsed = await body(c, verifyBody);
    if ("error" in parsed) return c.json({ error: parsed.error }, 400);
    const id = hashToken(parsed.data.token);
    const [link] = await db.select().from(emailVerifications)
      .where(and(eq(emailVerifications.id, id), gt(emailVerifications.expiresAt, new Date())))
      .limit(1);
    if (!link) return c.json(fail("verify_link_invalid"), 400);
    // Only the address the link was sent to is confirmed, never one changed since.
    const [user] = await db.update(users).set({ emailVerifiedAt: new Date() })
      .where(and(eq(users.id, link.userId), eq(users.email, link.email)))
      .returning();
    await db.delete(emailVerifications).where(eq(emailVerifications.userId, link.userId));
    if (!user) return c.json(fail("verify_link_invalid"), 400);
    return c.json({ ok: true, username: user.username });
  })

  .post("/verify/resend", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json(fail("login_required"), 401);
    if (verifyDeadline(user) === null) return c.json(fail("already_verified"), 400);
    const wait = resendUser.consume(user.id);
    if (wait > 0) return tooMany(c, wait);
    await sendVerification(user, localeOf(c));
    return c.json({ ok: true });
  })

  // Fixes a mistyped address before it is confirmed. A confirmed address stays as is.
  .post("/email", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json(fail("login_required"), 401);
    if (verifyDeadline(user) === null) return c.json(fail("email_locked"), 403);
    const wait = sensitiveUser.consume(user.id);
    if (wait > 0) return tooMany(c, wait);
    const parsed = await body(c, emailBody);
    if ("error" in parsed) return c.json({ error: parsed.error, field: "email" }, 400);
    const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!row || !(await verifyPassword(parsed.data.password, row.passwordHash))) {
      return c.json(fail("wrong_password", { field: "password" }), 401);
    }
    const address = parsed.data.email;
    const changed = address !== row.email;
    if (changed) {
      const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, address)).limit(1);
      if (taken) return c.json(fail("email_taken", { field: "email" }), 409);
    }
    // Every call sends a mail: it shares the resend budget, whether the address changed or not.
    const mailWait = resendUser.consume(user.id);
    if (mailWait > 0) return tooMany(c, mailWait);
    if (changed) {
      try {
        // A reset link went to the previous address: it must neither work nor confirm the new one.
        await db.transaction(async (tx) => {
          await tx.update(users).set({ email: address, emailVerifiedAt: null }).where(eq(users.id, user.id));
          await tx.delete(passwordResets).where(eq(passwordResets.userId, user.id));
        });
      } catch (error) {
        if (uniqueViolation(error)) return c.json(fail("email_taken", { field: "email" }), 409);
        throw error;
      }
    }
    // Same deadline as before: fixing the address does not extend the grace period.
    const updated = { ...row, email: address, emailVerifiedAt: changed ? null : row.emailVerifiedAt };
    await sendVerification(updated, localeOf(c));
    return c.json({ user: publicUser(updated) });
  })

  .post("/password", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json(fail("login_required"), 401);
    const wait = sensitiveUser.consume(user.id);
    if (wait > 0) return tooMany(c, wait);
    const parsed = await body(c, changeBody);
    if ("error" in parsed) return c.json({ error: parsed.error }, 400);
    const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!row || !(await verifyPassword(parsed.data.currentPassword, row.passwordHash))) {
      return c.json(fail("wrong_current_password", { field: "currentPassword" }), 401);
    }
    const weak = checkPasswordStrength(parsed.data.newPassword, row.username, row.email);
    if (weak) return c.json(fail("weak_password", { reason: weak, field: "newPassword" }), 400);
    await db.update(users).set({ passwordHash: await hashPassword(parsed.data.newPassword) }).where(eq(users.id, user.id));
    // A reset link requested before the change must not be able to do anything any more.
    await db.delete(passwordResets).where(eq(passwordResets.userId, user.id));
    await destroyAllSessions(user.id);
    await createSession(c, user.id);
    return c.json({ ok: true });
  })

  .delete("/account", async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json(fail("login_required"), 401);
    const wait = sensitiveUser.consume(user.id);
    if (wait > 0) return tooMany(c, wait);
    const parsed = await body(c, deleteBody);
    if ("error" in parsed) return c.json({ error: parsed.error }, 400);
    const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!row || !(await verifyPassword(parsed.data.password, row.passwordHash))) {
      return c.json(fail("wrong_password", { field: "password" }), 401);
    }
    await db.delete(users).where(eq(users.id, user.id));
    await destroySession(c);
    return c.json({ ok: true });
  });
