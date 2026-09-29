import { describe, expect, it } from "vitest";
import { renderEvenRat } from "./mask";
import { EMPTY, MAX_COLORS, hashBitmap, toRgba, type Pixels } from "./pixels";
import { flattenScene, renderScene } from "./scene";

const hash = (pixels: Pixels) => hashBitmap(toRgba(pixels));

describe("what secrets leave in the world", () => {
  it("breaks a claw off the Keep's gargoyle after the Last Second, and nowhere else", () => {
    const keep = hash(flattenScene(renderScene("fallen-king-ruins")));
    expect(hash(flattenScene(renderScene("fallen-king-ruins", 0, { clawless: true })))).not.toBe(keep);
    expect(hash(flattenScene(renderScene("green-plains", 0, { clawless: true })))).toBe(hash(flattenScene(renderScene("green-plains"))));
  });

  it("draws Thorvald's gold rat in solid pixels, a handful of colors", () => {
    const rat = renderEvenRat();
    const used = new Set([...rat.idx].filter((pal) => pal !== EMPTY));
    expect(used.size).toBeGreaterThanOrEqual(4);
    expect(used.size).toBeLessThanOrEqual(MAX_COLORS);
    expect([...rat.idx].every((pal, at) => pal === EMPTY || rat.alpha[at] === 255)).toBe(true);
  });
});
