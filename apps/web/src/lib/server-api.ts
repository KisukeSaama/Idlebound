import "server-only";
import type { BoardId, RollRow } from "./boards";

export interface LeaderboardResponse {
  board: BoardId;
  rows: RollRow[];
}

const base = () => (process.env.INTERNAL_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "");

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${base()}${path}`, { cache: "no-store", signal: AbortSignal.timeout(2500) });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    // API unreachable: public pages still render.
    return null;
  }
}

export function fetchLeaderboard(board: BoardId, limit = 50) {
  return getJson<LeaderboardResponse>(`/leaderboard?board=${board}&limit=${limit}`);
}

export function fetchStats() {
  return getJson<{ players: number; bestStage: number }>("/leaderboard/stats");
}
