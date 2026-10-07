import { describe, expect, it } from "vitest";
import { HERO_BY_ID } from "./data/heroes";
import { bossHp, heroCost, maxAffordableLevels, memoryStartGold, milestoneMultiplier, stageGold, stageHp, upgradeCost } from "./formulas";
import { formatNumber } from "./numbers";
import { DEEP_FROM, DEEP_GROWTH, hpGrowth } from "./curve";
import { SCALE_FROM, SCALE_SPAN, fromLog, log10Of, rescale, scaleBits } from "./scale";

const close = (a: number, b: number, tolerance = 1e-12) => expect(Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b))).toBeLessThanOrEqual(tolerance);

describe("the deep road's numbers (BIBLE 24)", () => {
  it("writes nothing in a larger unit above stage 3500, then a larger one every 500 stages", () => {
    for (const stage of [1, 50, 1000, 2999, 3000, 3001, SCALE_FROM - 1]) expect(scaleBits(stage)).toBe(0);
    // The HP the Remnants gained from the Dawn to the span's first stage, in bits.
    expect(scaleBits(SCALE_FROM)).toBe(Math.round(Math.log2(stageHp(SCALE_FROM) / stageHp(DEEP_FROM))));
    expect(scaleBits(SCALE_FROM + SCALE_SPAN - 1)).toBe(scaleBits(SCALE_FROM));
    expect(scaleBits(SCALE_FROM + SCALE_SPAN)).toBeGreaterThan(scaleBits(SCALE_FROM));
    expect(Number.isInteger(scaleBits(10_000))).toBe(true);
  });

  it("goes on below the Dawn without a seam, its growth easing and never stopping", () => {
    // Down to the Dawn, ×1.18 a stage as always; just below, the same.
    for (const stage of [600, 2000, DEEP_FROM - 1]) expect(hpGrowth(stage)).toBeCloseTo(1.18, 12);
    expect(hpGrowth(DEEP_FROM)).toBeCloseTo(1.18, 3);
    let last = hpGrowth(DEEP_FROM);
    for (let stage = DEEP_FROM + 100; stage <= 100_000; stage += 100) {
      const growth = hpGrowth(stage);
      expect(growth, `stage ${stage}`).toBeLessThanOrEqual(last + 1e-9);
      expect(growth, `stage ${stage}`).toBeGreaterThan(DEEP_GROWTH - 1e-8);
      last = growth;
    }
    expect(hpGrowth(100_000)).toBeCloseTo(DEEP_GROWTH, 6);
  });

  it("gives the same HP, gold and prices in a larger unit, where a double still holds them", () => {
    const bits = scaleBits(SCALE_FROM);
    for (const stage of [1, 77, 140, 141, 500, 2000, 3000, 3600, 4000]) {
      close(stageHp(stage, bits), stageHp(stage) / 2 ** bits, 1e-11);
      close(bossHp(stage, bits), bossHp(stage) / 2 ** bits, 1e-11);
      close(stageGold(stage, bits), stageGold(stage) / 2 ** bits, 1e-11);
    }
    const nyx = HERO_BY_ID.nyx;
    for (const [level, count] of [[0, 1], [10, 25], [900, 100], [3000, 1], [3000, 500]]) {
      // The plain price is rounded up to a whole coin; the larger unit never rounds.
      const plain = heroCost(nyx, level, count, 0.8);
      close(heroCost(nyx, level, count, 0.8, bits), plain / 2 ** bits, Math.max(1e-9, 1 / plain));
    }
    close(upgradeCost("aldric-150", bits), upgradeCost("aldric-150") / 2 ** bits);
    close(memoryStartGold(7, bits), memoryStartGold(7) / 2 ** bits, 1e-8);
    for (const level of [0, 199, 200, 1000]) close(milestoneMultiplier(level, bits), milestoneMultiplier(level) / 2 ** bits, 1e-12);
  });

  it("buys as many levels in a larger unit as in plain numbers", () => {
    const bits = scaleBits(SCALE_FROM);
    const garrick = HERO_BY_ID.garrick;
    for (const [level, gold] of [[0, 1e7], [400, 1e60], [2500, 1e200], [6000, 1e300]]) {
      expect(maxAffordableLevels(garrick, level, gold / 2 ** bits, 0.9, bits)).toBe(maxAffordableLevels(garrick, level, gold, 0.9));
    }
  });

  it("keeps the frontier of every depth inside a double, far from both ends", () => {
    for (let stage = SCALE_FROM; stage <= 20_000; stage += 250) {
      const bits = scaleBits(stage);
      const hp = bossHp(stage, bits);
      expect(Number.isFinite(hp), `stage ${stage}`).toBe(true);
      expect(Math.log10(hp), `stage ${stage}`).toBeGreaterThan(200);
      expect(Math.log10(hp), `stage ${stage}`).toBeLessThan(275);
      // What the walker meets is what the curve says, across every change of unit.
      close(log10Of(stageHp(stage + 1, scaleBits(stage + 1)), scaleBits(stage + 1)) - log10Of(stageHp(stage, bits), bits), Math.log10(hpGrowth(stage)), 1e-8);
    }
  });

  it("rescales exactly, by powers of two", () => {
    const gold = 123_456.789e200;
    expect(rescale(rescale(gold, 0, 238), 238, 0)).toBe(gold);
    expect(rescale(gold, 119, 119)).toBe(gold);
    close(fromLog(Math.log(1e300), 119), 1e300 / 2 ** 119);
  });

  it("writes a value of a larger unit as its plain number would read, in every notation", () => {
    const bits = scaleBits(SCALE_FROM + SCALE_SPAN);
    for (const notation of ["letters", "scientific", "engineering"] as const) {
      for (const value of [1e5, 3.2e100, 7.77e250]) expect(formatNumber(value / 2 ** bits, notation, bits)).toBe(formatNumber(value, notation));
    }
    // Deeper than a double: 1e400 and 1e2100 still read in every notation.
    expect(formatNumber(1e300, "scientific", 333)).toMatch(/^1\.75e400$/);
    expect(formatNumber(1e300, "engineering", 333)).toMatch(/^17\.5e399$/);
    expect(formatNumber(1e300, "letters", 333)).toMatch(/^17\.5[a-z]{2}$/);
    // After zz, three letters: a deeper number never reads like a shallower one.
    expect(formatNumber(1, "letters", Math.ceil((3 * (15 + 675) + 0.5) / Math.log10(2)))).toMatch(/^[\d.]+zz$/);
    expect(formatNumber(1, "letters", Math.ceil((3 * (15 + 676) + 0.5) / Math.log10(2)))).toMatch(/^[\d.]+aaa$/);
  });
});
