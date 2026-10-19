/**
 * Palette remapping tables: how treatments recolor the world without leaving the Orvane 64.
 * Each table maps a palette index to the nearest entry of a transformed color.
 */
import { ORVANE_64, palRgb, type Pal } from "@idlebound/game/art";
import { clonePixels, EMPTY, type Pixels } from "./pixels";

export function paletteMap(transform: (r: number, g: number, b: number) => [number, number, number]): Pal[] {
  return ORVANE_64.map((_, index) => {
    const [r, g, b] = palRgb(index);
    const [tr, tg, tb] = transform(r, g, b);
    let best: Pal = index;
    let bestDistance = Infinity;
    for (let other = 0; other < ORVANE_64.length; other += 1) {
      const [pr, pg, pb] = palRgb(other);
      const distance = 2 * (pr - tr) ** 2 + 4 * (pg - tg) ** 2 + 3 * (pb - tb) ** 2;
      if (distance < bestDistance) {
        best = other;
        bestDistance = distance;
      }
    }
    return best;
  });
}

/** Warm lamp light and embers. */
export const WARM_TABLE = paletteMap((r, g, b) => [r * 1.15 + 28, g * 0.82 + 6, b * 0.5]);
/** Colors drained to grey, lilac-tinted. */
export const GREY_TABLE = paletteMap((r, g, b) => {
  const luma = (r * 299 + g * 587 + b * 114) / 1000;
  return [luma * 0.95, luma * 0.92, luma * 1.08];
});
/** A face not in the company tonight: most of its color drained, a step darker. */
export const FADED_TABLE = paletteMap((r, g, b) => {
  const luma = (r * 299 + g * 587 + b * 114) / 1000;
  return [(r * 0.3 + luma * 0.7) * 0.8, (g * 0.3 + luma * 0.7) * 0.8, (b * 0.3 + luma * 0.7) * 0.8];
});
/** A face gone grey, a step darker. */
export const ASHEN_TABLE = paletteMap((r, g, b) => {
  const luma = ((r * 299 + g * 587 + b * 114) / 1000) * 0.8;
  return [luma, luma, luma * 1.04];
});

export type PortraitShade = "faded" | "grey";

/** `source` recolored through the shade's table: the same pixels, every one still in the palette. */
export function shadePixels(source: Pixels, shade: PortraitShade): Pixels {
  const table = shade === "faded" ? FADED_TABLE : ASHEN_TABLE;
  const out = clonePixels(source);
  for (let at = 0; at < out.idx.length; at += 1) if (out.idx[at] !== EMPTY) out.idx[at] = table[out.idx[at]];
  return out;
}

/** Gilded highlights of the Hallowed. */
export const GILDED_TABLE = paletteMap((r, g, b) => [r * 1.1 + 30, g * 0.95 + 20, b * 0.45]);

/** The night thinning toward a pale lilac, one table per Age. */
const PALE = [207, 198, 234];
const BRIGHTER = Array.from({ length: 12 }, (_, age) => {
  const k = age / 11;
  return paletteMap((r, g, b) => [r + (PALE[0] - r) * k, g + (PALE[1] - g) * k, b + (PALE[2] - b) * k]);
});

export function brighten(pal: Pal, amount: number, _threshold = 0.5): Pal {
  return BRIGHTER[Math.max(0, Math.min(11, Math.round(amount * 11)))][pal];
}

/** Drains a color toward grey on a share `amount` of the pixels (ordered by `threshold`). */
export function drain(pal: Pal, amount: number, threshold: number): Pal {
  return threshold < amount ? GREY_TABLE[pal] : pal;
}

