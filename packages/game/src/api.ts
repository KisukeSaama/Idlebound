/**
 * Errors the API answers with: `{ error: <code> }`, plus the details a code names below.
 * The API never words them; the web client turns each code into text in the walker's
 * language (apps/web/src/i18n/messages/api.ts). E-mails are the only text the API writes.
 */
export const API_ERRORS = [
  "request_too_large",
  "request_refused",
  "origin_refused",
  "not_found",
  "internal_error",
  /** Answered by the web proxy when the API does not answer. */
  "unreachable",
  "invalid_request",
  "invalid_email",
  /** With `retryAfter` (seconds), also sent as the Retry-After header. */
  "too_many_attempts",
  "login_required",
  /** With `reason`: a UsernameIssue. */
  "invalid_username",
  /** With `reason`: a PasswordIssue. */
  "weak_password",
  "username_taken",
  "email_taken",
  "username_or_email_taken",
  "wrong_credentials",
  "wrong_password",
  "wrong_current_password",
  "account_not_found",
  "reset_link_invalid",
  "verify_link_invalid",
  "already_verified",
  "email_locked",
  "email_unverified",
  "unknown_board",
  /** With `detail`: what the save parser could not read (technical, English). */
  "invalid_save",
  /** With `conflict`: the stored game the walker must choose against. */
  "save_conflict",
  "guest_save_conflict",
  "too_many_replacements",
  /** With `violations`: the anti-cheat findings, each with its own code. */
  "save_rejected"
] as const;

export type ApiError = (typeof API_ERRORS)[number];

export type PasswordIssue = "too-short" | "too-long" | "too-common" | "too-simple" | "contains-identity";

export function isApiError(value: unknown): value is ApiError {
  return typeof value === "string" && (API_ERRORS as readonly string[]).includes(value);
}
