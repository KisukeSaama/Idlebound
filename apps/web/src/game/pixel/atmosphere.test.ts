import { describe, expect, it } from "vitest";
import { airOf } from "./atmosphere";
import { renderScene } from "./scene";

describe("the air over the pixel world", () => {
  it("finds the lights of a place, and leaves the stars their own glint", () => {
    const keep = airOf(renderScene("fallen-king-ruins", 0));
    expect(keep.glows.length).toBeGreaterThan(2);
    for (const glow of keep.glows) {
      expect(glow.r).toBeGreaterThan(0);
      expect(glow.strength).toBeGreaterThan(0);
      expect(glow.strength).toBeLessThanOrEqual(1);
    }
    // The braziers' violet fire flickers.
    expect(keep.glows.some((glow) => glow.fire)).toBe(true);
  });

  it("knows where still water lies: in the Mire, never in the fields", () => {
    const mire = airOf(renderScene("corrupted-marsh", 0));
    expect(mire.water).not.toBeNull();
    expect(mire.water!.some((cell) => cell > 0)).toBe(true);
    expect(mire.horizon).toBeLessThan(mire.ground);
    expect(airOf(renderScene("green-plains", 0)).water ?? new Uint8Array(1)).toSatisfy((water: Uint8Array) => !water.some((cell) => cell > 0));
  });

  it("works a scene out once", () => {
    const scene = renderScene("corrupted-marsh", 0);
    expect(airOf(scene)).toBe(airOf(scene));
  });
});
