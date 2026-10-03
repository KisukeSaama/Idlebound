import { isApiError, type ApiError, type GameState, type PasswordIssue, type UsernameIssue } from "@idlebound/game";
import { currentMessages } from "@/i18n/client";
import type { BoardId, RollRow } from "./boards";
import { noteServerRelease, RELEASE_HEADER } from "./release";

export { BOARD_IDS, type BoardId, type RollRow } from "./boards";

export interface AccountUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  emailVerified: boolean;
  /** Until when saves are accepted without a confirmed address (null once confirmed). */
  verifyBy: string | null;
}

export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  /** `code`: the API's error code (null when no API answered); `error`: its words for the walker. */
  | { ok: false; code: ApiError | null; error: string; status: number; field?: string; body?: Record<string, unknown> };

/** A request left unanswered this long counts as a lost connection (the proxy gives up at 15 s). */
const REQUEST_TIMEOUT_MS = 20_000;

/** No answer at all, or the game server behind the proxy is down or busy: worth trying again. */
export function isUnreachable(result: { ok: boolean; status: number }): boolean {
  return !result.ok && (result.status === 0 || result.status === 429 || result.status >= 500);
}

/** Words an error answer in the walker's language, with the details its code carries. */
function describe(code: ApiError | null, body: Record<string, unknown>, status: number): string {
  const messages = currentMessages();
  const texts = messages.api;
  switch (code) {
    case null:
      return messages.hud.errors.status(status);
    case "too_many_attempts":
      return texts[code](typeof body.retryAfter === "number" ? body.retryAfter : 1);
    case "invalid_save":
      return texts[code](typeof body.detail === "string" ? body.detail : "");
    case "invalid_username":
      return messages.account.usernameIssues[body.reason as UsernameIssue] ?? texts[code];
    case "weak_password":
      return texts.passwordIssues[body.reason as PasswordIssue] ?? texts[code];
    default:
      return texts[code];
  }
}

async function request<T>(method: string, path: string, body?: unknown, options: { keepalive?: boolean } = {}): Promise<ApiResult<T>> {
  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      keepalive: options.keepalive,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        // Required by the API on every state-changing request (CSRF protection).
        "X-Idlebound": "1",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {})
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    clearTimeout(timeout);
    return { ok: false, status: 0, code: null, error: currentMessages().hud.errors.network };
  }
  noteServerRelease(response.headers.get(RELEASE_HEADER));
  let json: Record<string, unknown> = {};
  let readable = true;
  try {
    json = await response.json();
  } catch {
    // Empty or non-JSON response, or the body was cut off.
    readable = false;
  } finally {
    clearTimeout(timeout);
  }
  // Every answer of the API is JSON: a success without a readable body was lost on the way.
  if (response.ok && !readable) return { ok: false, status: 0, code: null, error: currentMessages().hud.errors.network };
  if (!response.ok) {
    const code = isApiError(json.error) ? json.error : null;
    return {
      ok: false,
      status: response.status,
      code,
      error: describe(code, json, response.status),
      field: typeof json.field === "string" ? json.field : undefined,
      body: json
    };
  }
  return { ok: true, status: response.status, data: json as T };
}

export interface CloudSave {
  state: GameState;
  revision: number;
  updatedAt: string;
  /** Milliseconds the server saw pass since this save was written. */
  elapsedMs: number;
}

export interface LeaderboardData {
  board: BoardId;
  rows: RollRow[];
  /** The logged-in walker's own row, and the walkers just ahead and behind (theirs included). */
  me: RollRow | null;
  around: RollRow[];
}

export const api = {
  /** `guest`: this browser also carries a guest's game the server keeps. */
  me: () => request<{ user: AccountUser | null; guest?: boolean }>("GET", "/auth/me"),
  register: (email: string, username: string, password: string) => request<{ user: AccountUser }>("POST", "/auth/register", { email, username, password }),
  login: (email: string, password: string) => request<{ user: AccountUser }>("POST", "/auth/login", { email, password }),
  logout: () => request<{ ok: true }>("POST", "/auth/logout"),
  forgot: (email: string) => request<{ ok: true }>("POST", "/auth/forgot", { email }),
  resetPassword: (token: string, password: string) => request<{ user: AccountUser }>("POST", "/auth/reset", { token, password }),
  verifyEmail: (token: string) => request<{ ok: true; username: string }>("POST", "/auth/verify", { token }),
  resendVerification: () => request<{ ok: true }>("POST", "/auth/verify/resend"),
  changeEmail: (email: string, password: string) => request<{ user: AccountUser }>("POST", "/auth/email", { email, password }),
  changePassword: (currentPassword: string, newPassword: string) => request<{ ok: true }>("POST", "/auth/password", { currentPassword, newPassword }),
  deleteAccount: (password: string) => request<{ ok: true }>("DELETE", "/auth/account", { password }),
  /** The account's game, or with `guest` the one kept for this browser without an account. */
  getSave: (guest = false) => request<{ save: CloudSave | null }>("GET", guest ? "/save/guest" : "/save"),
  /**
   * Opens the stored game in the page `holder`, which plays it from now on. `elsewhere`: another
   * page plays it right now and keeps it (nothing changed); `force` takes it over all the same.
   */
  openSave: (holder: string, force = false, guest = false) =>
    request<{ save: CloudSave | null; elsewhere: boolean }>("POST", guest ? "/save/guest/open" : "/save/open", { holder, force }),
  /** `release`: the page is out of sight, and lets the game go once it is kept. */
  putSave: (state: GameState, baseRevision: number | null, options: { replace?: boolean; keepalive?: boolean; guest?: boolean; holder?: string; release?: boolean } = {}) =>
    request<{ revision: number; updatedAt: string }>(
      "PUT",
      options.guest ? "/save/guest" : "/save",
      { state, baseRevision, replace: options.replace ?? false, holder: options.holder, release: options.release },
      { keepalive: options.keepalive }
    ),
  dropGuestSave: () => request<{ ok: true }>("DELETE", "/save/guest"),
  leaderboard: (board: BoardId) => request<LeaderboardData>("GET", `/leaderboard?board=${board}&limit=50`)
};
