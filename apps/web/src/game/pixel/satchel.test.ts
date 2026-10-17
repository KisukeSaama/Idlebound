import { RARITIES, generateItem, seededRng, type Rarity } from "@idlebound/game";
import { ICON_INK, SATCHEL } from "@idlebound/game/art";
import { describe, expect, it } from "vitest";
import { OPENING_HEIGHT, OPENING_WIDTH } from "./chest";
import { EMPTY, hashBitmap, toRgba, type Pixels } from "./pixels";
import { REVEAL, satchelFrame, type SatchelMoment } from "./satchel";

const hash = (pixels: Pixels) => hashBitmap(toRgba(pixels));
const relic = (rarity: Rarity) => generateItem(seededRng(5), 40, { slot: "weapon", rarity });
/** The moments worth looking at: falling, resting, the tug, the opening, a relic hidden, filling in, found. */
function moments(rarity: Rarity): SatchelMoment[] {
  const item = relic(rarity);
  return [
    { phase: "drop", t: 0.1 },
    { phase: "drop", t: 2 },
    { phase: "tug", t: 0.1 },
    { phase: "open", t: 0.05 },
    { phase: "open", t: 0.6 },
    { phase: "relic", relic: item, rise: 0.2, reveal: -1 },
    { phase: "relic", relic: item, rise: 1, reveal: -1 },
    { phase: "relic", relic: item, rise: 1, reveal: REVEAL[rarity] / 2 },
    { phase: "relic", relic: item, rise: 2, reveal: REVEAL[rarity] + 0.1 },
    { phase: "relic", relic: item, rise: 3, reveal: REVEAL[rarity] + 1.2 }
  ];
}

describe("the company's satchel opened", () => {
  it("draws every part of the satchel 30 pixels wide in the icon ink", () => {
    for (const [part, rows] of Object.entries(SATCHEL)) {
      for (const row of rows as string[]) {
        expect(row, part).toHaveLength(30);
        for (const key of row) if (key !== ".") expect(ICON_INK[key], `${part} ${key}`).toBeDefined();
      }
    }
  });

  it("gives solid pixels in a scene palette of at most 24 colors, the same every time", () => {
    for (const rarity of RARITIES) {
      for (const moment of moments(rarity)) {
        const frame = satchelFrame(rarity, moment);
        expect(frame.w).toBe(OPENING_WIDTH);
        expect(frame.h).toBe(OPENING_HEIGHT);
        expect([...frame.idx].every((pal, at) => pal === EMPTY || frame.alpha[at] === 255)).toBe(true);
        expect(new Set([...frame.idx].filter((pal) => pal !== EMPTY)).size, `${rarity} ${moment.phase}`).toBeLessThanOrEqual(24);
        expect(hash(satchelFrame(rarity, moment))).toBe(hash(frame));
      }
    }
  });

  it("hides a relic in its shadow until it is touched, then shows it whole", () => {
    const item = relic("legendary");
    const hidden = satchelFrame("legendary", { phase: "relic", relic: item, rise: 1, reveal: -1 }, true);
    const found = satchelFrame("legendary", { phase: "relic", relic: item, rise: 1, reveal: 5 }, true);
    expect(hash(hidden)).not.toBe(hash(found));
    // With reduced motion a picture holds still, whatever the moment.
    expect(hash(found)).toBe(hash(satchelFrame("legendary", { phase: "relic", relic: item, rise: 4, reveal: 9 }, true)));
    expect(hash(satchelFrame("rare", { phase: "drop", t: 3 }, true))).toBe(hash(satchelFrame("rare", { phase: "drop", t: 7 }, true)));
  });

  it("lets the best relic's light leak under the flap before it opens", () => {
    const plain = satchelFrame("common", { phase: "drop", t: 2 }, true);
    const legend = satchelFrame("legendary", { phase: "drop", t: 2 }, true);
    expect(hash(plain)).not.toBe(hash(legend));
  });

  it("matches the recorded snapshots of the opening", () => {
    const shots = RARITIES.flatMap((rarity) => moments(rarity).map((moment) => `${rarity} ${moment.phase} ${hash(satchelFrame(rarity, moment))}`));
    expect(shots).toMatchSnapshot();
  });
});
