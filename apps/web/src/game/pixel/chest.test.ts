import { RARITIES, type Rarity } from "@idlebound/game";
import { CHESTS, ICON_INK, type ChestId } from "@idlebound/game/art";
import { describe, expect, it } from "vitest";
import { openingFrame, openingTimes, OPENING_HEIGHT, OPENING_WIDTH, reelPosition, reelRelics, type OpeningSpec } from "./chest";
import { EMPTY, hashBitmap, toRgba, type Pixels } from "./pixels";

const hash = (pixels: Pixels) => hashBitmap(toRgba(pixels));
const spec = (chest: ChestId, rarity: Rarity): OpeningSpec => ({ chest, item: { slot: "weapon", base: 1, rarity, forge: 0 } });
/** The moments worth looking at: falling, each knock, the burst, the reel turning and stopping, then the relic hanging. */
function moments(opening: OpeningSpec): number[] {
  const times = openingTimes(opening);
  return [0.1, ...times.knockAt.map((at) => at + 0.05), times.open + 0.05, times.spin + 0.4, times.spin + 1.5, times.land + 0.1, times.land + 0.4, times.reveal + 0.1];
}

describe("a chest opened at the stall", () => {
  it("knocks once for each rarity it climbs, from the lowest it can hold", () => {
    expect(openingTimes(spec("chest", "common")).knocks).toEqual(["common"]);
    expect(openingTimes(spec("chest", "mythic")).knocks).toEqual(RARITIES);
    expect(openingTimes(spec("great-chest", "epic")).knocks).toEqual(["epic"]);
    expect(openingTimes(spec("great-chest", "legendary")).knocks).toEqual(["epic", "legendary"]);
    for (const rarity of RARITIES) {
      const times = openingTimes(spec("chest", rarity));
      expect(times.open).toBeGreaterThan(times.knockAt[times.knockAt.length - 1]);
      expect(times.reveal).toBeGreaterThan(times.open);
    }
  });

  it("turns a reel drawn from what the chest can hold, stopping on its relic", () => {
    for (const chest of Object.keys(CHESTS) as ChestId[]) {
      for (const seed of [1, 2, 99]) {
        const opening = { ...spec(chest, "rare"), seed };
        const relics = reelRelics(opening);
        expect(relics).toEqual(reelRelics(opening));
        expect(relics).toContain(opening.item);
        const lowest = chest === "great-chest" ? RARITIES.indexOf("epic") : 0;
        for (const relic of relics) if (relic !== opening.item) expect(RARITIES.indexOf(relic.rarity)).toBeGreaterThanOrEqual(lowest);
        const times = openingTimes(opening);
        expect(reelPosition(opening, times.spin - 0.01)).toBe(-1);
        expect(relics[reelPosition(opening, times.land)]).toBe(opening.item);
        expect(reelPosition(opening, times.land + 5)).toBe(reelPosition(opening, times.land));
      }
    }
    // Different seeds, different reels.
    expect(reelRelics({ ...spec("chest", "rare"), seed: 1 })).not.toEqual(reelRelics({ ...spec("chest", "rare"), seed: 2 }));
  });

  it("draws each part of both chests 30 pixels wide in the icon ink", () => {
    for (const [id, chest] of Object.entries(CHESTS)) {
      for (const [part, rows] of Object.entries(chest)) {
        for (const row of rows as string[]) {
          expect(row, `${id} ${part}`).toHaveLength(30);
          for (const key of row) if (key !== ".") expect(ICON_INK[key], `${id} ${part} ${key}`).toBeDefined();
        }
      }
    }
  });

  it("gives solid pixels in a scene palette of at most 24 colors, the same every time", () => {
    for (const chest of Object.keys(CHESTS) as ChestId[]) {
      for (const rarity of openingTimes(spec(chest, "mythic")).knocks) {
        const opening = spec(chest, rarity);
        for (const t of moments(opening)) {
          const frame = openingFrame(opening, t);
          expect(frame.w).toBe(OPENING_WIDTH);
          expect(frame.h).toBe(OPENING_HEIGHT);
          expect([...frame.idx].every((pal, at) => pal === EMPTY || frame.alpha[at] === 255)).toBe(true);
          expect(new Set([...frame.idx].filter((pal) => pal !== EMPTY)).size, `${chest} ${rarity} ${t}`).toBeLessThanOrEqual(24);
          expect(hash(openingFrame(opening, t))).toBe(hash(frame));
        }
      }
    }
  });

  it("holds the risen relic still with reduced motion", () => {
    const opening = spec("chest", "legendary");
    const { reveal } = openingTimes(opening);
    expect(hash(openingFrame(opening, reveal, true))).toBe(hash(openingFrame(opening, reveal + 3.7, true)));
  });

  it("matches the recorded snapshots of the opening", () => {
    const snapshot: Record<string, string> = {};
    for (const chest of Object.keys(CHESTS) as ChestId[]) {
      for (const rarity of ["epic", "mythic"] as const) {
        const opening = spec(chest, rarity);
        snapshot[`${chest} ${rarity}`] = moments(opening).map((t) => hash(openingFrame(opening, t))).join(" ");
      }
    }
    expect(snapshot).toMatchSnapshot();
  });
});
