import { CUTSCENE_BY_ID, CUTSCENES, type CutsceneShot } from "@idlebound/game";
import { C, WALKER_POSES } from "@idlebound/game/art";
import { describe, expect, it } from "vitest";
import { CUTSCENE_HEIGHT, CUTSCENE_WIDTH, FALL_STEPS, LETTERBOX, dissolve, inkFrame, letterbox, shotFrame, shotPose } from "./cutscene";
import { renderRecipe } from "./creature";
import { EMPTY, FADE_STEPS, MAX_COLORS, hashBitmap, toRgba, type Pixels } from "./pixels";

const hash = (pixels: Pixels) => hashBitmap(toRgba(pixels));
const solid = (pixels: Pixels) => [...pixels.idx].every((pal, at) => pal !== EMPTY && pixels.alpha[at] === 255);
const count = (pixels: Pick<Pixels, "idx">, pal: number) => [...pixels.idx].filter((value) => value === pal).length;
const colors = (pixels: Pixels) => new Set(pixels.idx);
const FIRST_DUSK = CUTSCENE_BY_ID["first-dusk"].shots;
/** The shot of the blow: the walker strikes, the King falls. */
const BLOW = FIRST_DUSK.find((shot) => shot.beats?.some((beat) => "flash" in beat))!;
const blowAt = BLOW.beats!.find((beat) => "flash" in beat)!.at;
const fallAt = BLOW.actors!.find((actor) => actor.who === "guardian")!.fall!;
/** Moments of a shot worth looking at: its start, its middle, near its end. */
const moments = (shot: CutsceneShot) => [0, shot.seconds / 2, shot.seconds - 0.05];

describe("the shots of the Ledger's scenes", () => {
  it("draws every moment of every shot on the scene's own grid, every pixel solid, the same every time", () => {
    for (const cutscene of CUTSCENES) {
      for (const shot of cutscene.shots) {
        for (const t of moments(shot)) {
          const pixels = shotFrame(shot, t);
          expect([pixels.w, pixels.h]).toEqual([CUTSCENE_WIDTH, CUTSCENE_HEIGHT]);
          expect(solid(pixels), `${cutscene.id} ${t}`).toBe(true);
          expect(hash(shotFrame(shot, t))).toBe(hash(pixels));
        }
      }
    }
  }, 30_000);

  it("lets the King go pixel by pixel into rising lights, then leaves the walker alone in the hall", () => {
    const alone: CutsceneShot = { ...BLOW, actors: BLOW.actors!.filter((actor) => actor.who === "walker") };
    // Lights rise above his crown, where the hall had none.
    const overHead = (pixels: Pixels) => count({ idx: pixels.idx.slice(0, 12 * pixels.w) }, C.essenceLight);
    expect(overHead(shotFrame(BLOW, fallAt + 0.19 * 9))).toBeGreaterThan(overHead(shotFrame(BLOW, fallAt - 0.05)));
    const over = fallAt + 0.19 * (FALL_STEPS + 1);
    expect(hash(shotFrame(BLOW, over))).toBe(hash(shotFrame(alone, over)));
    const steps = Array.from({ length: FALL_STEPS }, (_, step) => hash(shotFrame(BLOW, fallAt + 0.19 * step + 0.01)));
    expect(new Set(steps).size).toBeGreaterThan(FALL_STEPS / 2);
  });

  it("strikes in one frame of two colors, then shakes the picture and lets it settle", () => {
    const flash = shotFrame(BLOW, blowAt + 0.02);
    expect(colors(flash)).toEqual(new Set([C.ink, C.paper]));
    expect(shotPose(BLOW, blowAt + 0.15).shake).not.toEqual([0, 0]);
    expect(shotPose(BLOW, blowAt + 1).shake).toEqual([0, 0]);
    // The walker has stepped into the blow.
    expect(shotPose(BLOW, blowAt).actors[0].x).toBeGreaterThan(shotPose(BLOW, 0).actors[0].x);
  });

  it("pans across the planes of the set, and holds where the pan lands when the picture is still", () => {
    const climb = FIRST_DUSK.find((shot) => shot.pan && shot.set.kind === "road")!;
    expect(hash(shotFrame(climb, 0))).not.toBe(hash(shotFrame(climb, climb.seconds - 0.05)));
    expect(shotPose(climb, 0, true).cam).toBe(climb.pan![1]);
    // Nothing moves in a still picture: no blow, no fall under way, no waking.
    expect(shotPose(BLOW, blowAt + 0.02, true).flash).toBe(false);
    expect(shotPose(BLOW, 0, true).actors[1].fall).toBe(FALL_STEPS);
  });

  it("brings a waking set up out of the dark, its own lights first", () => {
    const waking = FIRST_DUSK.find((shot) => shot.wakes)!;
    const dark = shotFrame(waking, 0);
    const lit = shotFrame(waking, waking.wakes! + 0.1);
    expect(count(dark, C.ink)).toBeGreaterThan(count(lit, C.ink));
    expect(hash(lit)).toBe(hash(shotFrame({ ...waking, wakes: undefined }, waking.wakes! + 0.1)));
  });

  it("frames the picture in bands of night ink, top and bottom", () => {
    const framed = letterbox(shotFrame(FIRST_DUSK[1], 1), LETTERBOX);
    for (const y of [0, LETTERBOX - 1, CUTSCENE_HEIGHT - 1]) expect(count({ idx: framed.idx.slice(y * CUTSCENE_WIDTH, (y + 1) * CUTSCENE_WIDTH) }, C.ink)).toBe(CUTSCENE_WIDTH);
    expect(hash(letterbox(framed, 0))).toBe(hash(framed));
  });

  it("gives one shot to the next by eighths, from the night ink and back to it", () => {
    const ink = inkFrame();
    const hall = shotFrame(BLOW, 0);
    expect(hash(dissolve(ink, hall, 0))).toBe(hash(ink));
    expect(hash(dissolve(ink, hall, FADE_STEPS))).toBe(hash(hall));
    const half = dissolve(ink, hall, FADE_STEPS / 2);
    expect(solid(half)).toBe(true);
    expect(count(half, C.ink)).toBeGreaterThan(count(hall, C.ink));
  });

  it("draws the walker in every pose on one frame and one ground, twelve colors at most", () => {
    const sprites = Object.values(WALKER_POSES).flat().map((recipe) => renderRecipe(recipe));
    for (const sprite of sprites) {
      expect([sprite.pixels.w, sprite.pixels.h, sprite.feet]).toEqual([sprites[0].pixels.w, sprites[0].pixels.h, sprites[0].feet]);
      expect(new Set([...sprite.pixels.idx].filter((pal) => pal !== EMPTY && pal !== C.ink)).size).toBeLessThanOrEqual(MAX_COLORS);
    }
    // The stride is four drawings, every one its own.
    expect(new Set(WALKER_POSES.walk.map((recipe) => hash(renderRecipe(recipe).pixels))).size).toBe(4);
  });

  it("matches the recorded snapshots of the shots", () => {
    const snapshot: Record<string, string> = {};
    for (const cutscene of CUTSCENES) {
      cutscene.shots.forEach((shot, index) => {
        snapshot[`${cutscene.id} ${index}`] = moments(shot).map((t) => hash(shotFrame(shot, t))).join(" ");
      });
    }
    expect(snapshot).toMatchSnapshot();
  }, 30_000);
});
