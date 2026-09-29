import type { GameState } from "@idlebound/game";
import { currentMessages } from "@/i18n/client";
import type { BoardId } from "./boards";
import { noteServerRelease, RELEASE_HEADER } from "./release";

export { BOARD_IDS, type BoardId } from "./boards";

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
  | { ok: false; error: string; status: number; field?: string; body?: Record<string, unknown> };

/** A request left unanswered this long counts as a lost connection (the proxy gives up at 15 s). */
const REQUEST_TIMEOUT_MS = 20_000;

/** No answer at all, or the game server behind the proxy is down or busy: worth trying again. */
export function isUnreachable(result: { ok: boolean; status: number }): boolean {
  return !result.ok && (result.status === 0 || result.status === 429 || result.status >= 500);
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
    return { ok: false, status: 0, error: currentMessages().hud.errors.network };
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
  if (response.ok && !readable) return { ok: false, status: 0, error: currentMessages().hud.errors.network };
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: typeof json.error === "string" ? json.error : currentMessages().hud.errors.status(response.status),
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
  rows: { rank: number; username: string; value: number; maxStage: number; ascensions: number; achievements: number; descents: number }[];
  me: { rank: number; value: number } | null;
}

export const api = {
  me: () => request<{ user: AccountUser | null }>("GET", "/auth/me"),
  register: (email: string, username: string, password: string) => request<{ user: AccountUser }>("POST", "/auth/register", { email, username, password }),
  login: (email: string, password: string) => request<{ user: AccountUser }>("POST", "/auth/login", { email, password }),
  logout: () => request<{ ok: true }>("POST", "/auth/logout"),
  forgot: (email: string) => request<{ ok: true; message: string }>("POST", "/auth/forgot", { email }),
  resetPassword: (token: string, password: string) => request<{ user: AccountUser }>("POST", "/auth/reset", { token, password }),
  verifyEmail: (token: string) => request<{ ok: true; username: string }>("POST", "/auth/verify", { token }),
  resendVerification: () => request<{ ok: true }>("POST", "/auth/verify/resend"),
  changeEmail: (email: string, password: string) => request<{ user: AccountUser }>("POST", "/auth/email", { email, password }),
  changePassword: (currentPassword: string, newPassword: string) => request<{ ok: true }>("POST", "/auth/password", { currentPassword, newPassword }),
  deleteAccount: (password: string) => request<{ ok: true }>("DELETE", "/auth/account", { password }),
  getSave: () => request<{ save: CloudSave | null }>("GET", "/save"),
  putSave: (state: GameState, baseRevision: number | null, replace = false, keepalive = false) =>
    request<{ revision: number; updatedAt: string }>("PUT", "/save", { state, baseRevision, replace }, { keepalive }),
  leaderboard: (board: BoardId) => request<LeaderboardData>("GET", `/leaderboard?board=${encodeURIComponent(board)}&limit=50`)
};
