import { describe, expect, it } from "vitest";
import { presenceScore, type PresenceDay } from "./presence";

const day = (patch: Partial<PresenceDay>): PresenceDay => ({ crystalsSeen: 0, crystalsCaught: 0, reactions: [0, 0, 0, 0, 0, 0, 0], powers: 0, promptPowers: 0, ascensions: 0, acts: 0, longestSpanMs: 0, ...patch });
const HOUR = 3_600_000;

describe("the presence score", () => {
  it("never weighs clicks: an autoclicker on the monster for days scores nothing", () => {
    // Crystals left where they fell, powers left alone: only the strikes ran all day.
    const days = Array.from({ length: 7 }, () => day({ crystalsSeen: 300 }));
    expect(presenceScore(days).score).toBe(0);
  });

  it("leaves a walker who plays long evenings well below a machine", () => {
    const walker = Array.from({ length: 7 }, () => day({ crystalsSeen: 120, crystalsCaught: 95, reactions: [2, 10, 30, 30, 15, 6, 2], powers: 80, promptPowers: 20, ascensions: 3, acts: 200, longestSpanMs: 6 * HOUR }));
    const machine = Array.from({ length: 7 }, () => day({ crystalsSeen: 400, crystalsCaught: 400, reactions: [390, 10, 0, 0, 0, 0, 0], powers: 900, promptPowers: 880, ascensions: 20, acts: 1700, longestSpanMs: 30 * HOUR }));
    const human = presenceScore(walker);
    const bot = presenceScore(machine);
    expect(human.score).toBe(0);
    expect(bot.score).toBeGreaterThanOrEqual(95);
    expect(bot.catchShare).toBe(1);
  });

  it("says nothing of shares too small to mean anything", () => {
    const score = presenceScore([day({ crystalsSeen: 5, crystalsCaught: 5, reactions: [5, 0, 0, 0, 0, 0, 0], powers: 3, promptPowers: 3 })]);
    expect(score).toMatchObject({ score: 0, catchShare: null, fastShare: null, promptShare: null });
  });
});
