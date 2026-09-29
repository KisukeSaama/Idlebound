/**
 * Hand-authored pixel masks (emblems, the crystal): rows of characters colored through a
 * ramp, then outlined like every sprite.
 */
import { HERO_BY_ID } from "@idlebound/game";
import { EMBLEMS, EVEN_RAT, RAMPS, rampFor, type Pal, type PixelMask } from "@idlebound/game/art";
import { createPixels, type Pixels } from "./pixels";
import { outline } from "./shade";

/** Paints a mask: legend steps index into `ramp` counted from its light end when short. */
export function paintMask(mask: PixelMask, ramp: readonly Pal[], emissive = ""): Pixels {
  const h = mask.rows.length;
  const w = Math.max(...mask.rows.map((row) => row.length));
  const out = createPixels(w, h);
  const steps = Math.max(...Object.values(mask.legend).map((value) => (typeof value === "number" ? value : 0))) + 1;
  mask.rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      const key = row[x];
      const entry = mask.legend[key];
      if (entry === undefined) continue;
      const at = y * w + x;
      if (typeof entry === "number") {
        // Short ramps keep their light end: the brightest key is always the brightest step.
        const index = Math.max(0, ramp.length - steps + entry);
        out.idx[at] = ramp[Math.min(ramp.length - 1, index)];
      } else {
        out.idx[at] = entry.pal;
      }
      out.alpha[at] = 255;
      out.emit[at] = emissive.includes(key) ? 1 : 0;
    }
  });
  return out;
}

/** The tiny gold rat on Thorvald's medallion (the Even secret), in the gold ramp. */
export function renderEvenRat(): Pixels {
  return outline(paintMask(EVEN_RAT, RAMPS.gold));
}

/** A companion's 12 × 12 sigil in the ramp of its color. */
export function renderEmblem(heroId: string): Pixels {
  const mask = EMBLEMS[heroId] ?? EMBLEMS.aldric;
  const color = HERO_BY_ID[heroId]?.color ?? "#f5c85b";
  return outline(paintMask(mask, RAMPS[rampFor(color)]));
}
