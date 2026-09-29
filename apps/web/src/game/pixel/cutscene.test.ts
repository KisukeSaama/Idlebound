import { CUTSCENES, type CutsceneView } from "@idlebound/game";
import { C } from "@idlebound/game/art";
import { describe, expect, it } from "vitest";
import { CUTSCENE_HEIGHT, CUTSCENE_WIDTH, FALL_STEPS, dissolve, inkFrame, shotFrame, shotMotion } from "./cutscene";
import { guardianBox } from "./stage";
import { EMPTY, FADE_STEPS, hashBitmap, toRgba, type Pixels } from "./pixels";

const hash = (pixels: Pixels) => hashBitmap(toRgba(pixels));
const solid = (pixels: Pixels) => [...pixels.idx].every((pal, at) => pal !== EMPTY && pixels.alpha[at] === 255);
const KING: CutsceneView = { kind: "road", biome: "fallen-king-ruins", era: 0, guardian: "fall" };
const count = (pixels: Pick<Pixels, "idx">, pal: number) => [...pixels.idx].filter((value) => value === pal).length;

describe("the shots of the Ledger's scenes", () => {
  it("draws every shot on the scene's own grid, every pixel solid, the same every time", () => {
    for (const cutscene of CUTSCENES) {
      for (const shot of cutscene.shots) {
        const { frames } = shotMotion(shot.view);
        expect(frames).toBeGreaterThan(0);
        const pixels = shotFrame(shot.view, 1, 3);
        expect([pixels.w, pixels.h]).toEqual([CUTSCENE_WIDTH, CUTSCENE_HEIGHT]);
        expect(solid(pixels), JSON.stringify(shot.view)).toBe(true);
        expect(hash(shotFrame(shot.view, 1, 3))).toBe(hash(pixels));
      }
    }
  });

  it("lets the King go pixel by pixel into rising lights, then leaves the hall empty", () => {
    const standing = shotFrame({ ...KING, guardian: "stand" }, 0);
    const empty = shotFrame({ ...KING, guardian: "none" }, 0);
    expect(hash(shotFrame(KING, 0, 0))).toBe(hash(standing));
    expect(hash(shotFrame(KING, 0, FALL_STEPS))).toBe(hash(empty));
    // Lights rise over his head, where the hall had none.
    const box = guardianBox(KING.biome, KING.era)!;
    const overHead = (pixels: Pixels) => count({ ...pixels, idx: pixels.idx.slice(0, box.y * pixels.w) }, C.essenceLight);
    expect(overHead(shotFrame(KING, 0, 7))).toBeGreaterThan(overHead(standing));
    expect(new Set(Array.from({ length: FALL_STEPS + 1 }, (_, step) => hash(shotFrame(KING, 0, step)))).size).toBe(FALL_STEPS + 1);
  });

  it("gives one shot to the next by eighths, from the night ink and back to it", () => {
    const ink = inkFrame();
    const hall = shotFrame(KING, 0, 0);
    expect(hash(dissolve(ink, hall, 0))).toBe(hash(ink));
    expect(hash(dissolve(ink, hall, FADE_STEPS))).toBe(hash(hall));
    const half = dissolve(ink, hall, FADE_STEPS / 2);
    expect(solid(half)).toBe(true);
    expect(count(half, C.ink)).toBeGreaterThan(count(hall, C.ink));
  });

  it("matches the recorded snapshots of the shots", () => {
    const snapshot: Record<string, string> = {};
    for (const cutscene of CUTSCENES) {
      cutscene.shots.forEach((shot, index) => {
        snapshot[`${cutscene.id} ${index}`] = [0, 4, FALL_STEPS].map((fall) => hash(shotFrame(shot.view, 0, fall))).join(" ");
      });
    }
    expect(snapshot).toMatchSnapshot();
  });
});
