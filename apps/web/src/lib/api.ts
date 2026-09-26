import type { GameState } from "@idlebound/game";
import { currentMessages } from "@/i18n/client";

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

async function request<T>(method: string, path: string, body?: unknown, options: { keepalive?: boolean } = {}): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      keepalive: options.keepalive,
      headers: {
        Accept: "application/json",
        // Required by the API on every state-changing request (CSRF protection).
        "X-Idlebound": "1",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {})
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    return { ok: false, status: 0, error: currentMessages().hud.errors.network };
  }
  let json: Record<string, unknown> = {};
  try {
    json = await response.json();
  } catch {
    // Empty or non-JSON response.
  }
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
}

export interface LeaderboardData {
  board: string;
  rows: { rank: number; username: string; value: number; maxStage: number; ascensions: number; achievements: number }[];
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
  leaderboard: (board: string) => request<LeaderboardData>("GET", `/leaderboard?board=${encodeURIComponent(board)}&limit=50`)
};
