import { describe, expect, it } from "vitest";
import { summarizeReplays } from "./replay-review";

describe("summarizeReplays", () => {
  it("says what share of saves enforce mode would keep, correct or refuse", () => {
    const summary = summarizeReplays(7, [
      { outcome: "match", count: 90 },
      { outcome: "diverged", count: 6 },
      { outcome: "match", count: 0 },
      { outcome: "no-journal", count: 3 },
      { outcome: "busy", count: 1 }
    ], [["gold", "run.goldEarned"], ["gold", "gold"], ["fates.spawn"]]);
    expect(summary.total).toBe(100);
    expect(summary.outcomes[0]).toEqual({ outcome: "match", count: 90, share: 0.9 });
    expect(summary.kept).toBeCloseTo(0.9);
    expect(summary.corrected).toBeCloseTo(0.06);
    expect(summary.refused).toBeCloseTo(0.04);
    // A path counted once per report, however often it appears in it.
    expect(summary.paths).toEqual([{ path: "gold", reports: 2 }, { path: "run.goldEarned", reports: 1 }, { path: "fates.spawn", reports: 1 }]);
  });

  it("reads nothing into no replays at all", () => {
    expect(summarizeReplays(7, [], [])).toEqual({ days: 7, total: 0, outcomes: [], kept: 0, corrected: 0, refused: 0, paths: [] });
  });
});
