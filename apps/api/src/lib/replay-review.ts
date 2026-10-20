import { gte } from "drizzle-orm";
import { db } from "../db/client";
import { replayReports, replayTally } from "../db/schema";

/** What a replay found that enforce mode keeps as the page sent it. */
const KEPT = new Set(["match"]);
/** What enforce mode corrects: the replayed game is kept instead of the page's. */
const CORRECTED = new Set(["diverged"]);

export interface ReplaySummary {
  days: number;
  total: number;
  /** Replays by what they found, most frequent first. */
  outcomes: { outcome: string; count: number; share: number }[];
  /** Share of saves enforce mode would keep as sent, correct, or refuse. */
  kept: number;
  corrected: number;
  refused: number;
  /** The paths where diverging games differ most often, from the reports. */
  paths: { path: string; reports: number }[];
}

/**
 * Sums what the replays found: the tally gives the shares, the reports the paths that
 * diverge. Pure: `review --replays` and the tests read the same numbers.
 */
export function summarizeReplays(days: number, tallies: { outcome: string; count: number }[], diffs: string[][]): ReplaySummary {
  const byOutcome = new Map<string, number>();
  for (const row of tallies) byOutcome.set(row.outcome, (byOutcome.get(row.outcome) ?? 0) + row.count);
  const total = [...byOutcome.values()].reduce((sum, count) => sum + count, 0);
  const share = (count: number) => (total === 0 ? 0 : count / total);
  const outcomes = [...byOutcome].map(([outcome, count]) => ({ outcome, count, share: share(count) })).sort((a, b) => b.count - a.count);
  const sum = (keep: (outcome: string) => boolean) => outcomes.filter((row) => keep(row.outcome)).reduce((total, row) => total + row.count, 0);
  const kept = sum((outcome) => KEPT.has(outcome));
  const corrected = sum((outcome) => CORRECTED.has(outcome));
  const paths = new Map<string, number>();
  for (const diff of diffs) for (const path of new Set(diff)) paths.set(path, (paths.get(path) ?? 0) + 1);
  return {
    days,
    total,
    outcomes,
    kept: share(kept),
    corrected: share(corrected),
    refused: share(total - kept - corrected),
    paths: [...paths].map(([path, reports]) => ({ path, reports })).sort((a, b) => b.reports - a.reports).slice(0, 15)
  };
}

export async function replaySummary(days: number): Promise<ReplaySummary> {
  const since = new Date(Date.now() - days * 86_400_000);
  const tallies = await db.select({ outcome: replayTally.outcome, count: replayTally.count }).from(replayTally).where(gte(replayTally.day, since.toISOString().slice(0, 10)));
  const reports = await db.select({ outcome: replayReports.outcome, detail: replayReports.detail }).from(replayReports).where(gte(replayReports.createdAt, since));
  const diffs = reports
    .filter((report) => report.outcome === "diverged")
    .map((report) => {
      const diff = (report.detail as { diff?: unknown }).diff;
      return Array.isArray(diff) ? diff.filter((path): path is string => typeof path === "string") : [];
    });
  return summarizeReplays(days, tallies, diffs);
}
