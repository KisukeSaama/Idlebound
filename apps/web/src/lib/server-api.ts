import "server-only";

export interface LeaderboardRow {
  rank: number;
  username: string;
  value: number;
  maxStage: number;
  ascensions: number;
  achievements: number;
  descents: number;
}

export interface LeaderboardResponse {
  board: string;
  rows: LeaderboardRow[];
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

export function fetchLeaderboard(board: string, limit = 50) {
  return getJson<LeaderboardResponse>(`/leaderboard?board=${encodeURIComponent(board)}&limit=${limit}`);
}

export function fetchStats() {
  return getJson<{ players: number; bestStage: number }>("/leaderboard/stats");
}
