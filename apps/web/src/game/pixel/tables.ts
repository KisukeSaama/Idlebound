/**
 * Palette remapping tables: how treatments recolor the world without leaving the Orvane 64.
 * Each table maps a palette index to the nearest entry of a transformed color.
 */
import { C, ORVANE_64, palLuma, palRgb, type Pal } from "@idlebound/game/art";
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
/** The night's own greys, darkest first. */
const NIGHT_GREYS: readonly Pal[] = [C.ink, C.night1, C.night2, C.night3, C.night4, C.dusk, C.haze, C.lilac, C.pale, C.moon];

/** Every color to the night's grey nearest its lightness times `dim`: the order of lightness kept. */
function greysAt(dim: number): Pal[] {
  return ORVANE_64.map((_, index) => {
    const luma = palLuma(index) * dim;
    let best = NIGHT_GREYS[0];
    for (const grey of NIGHT_GREYS) if (Math.abs(palLuma(grey) - luma) < Math.abs(palLuma(best) - luma)) best = grey;
    return best;
  });
}

/** A face not in the company tonight: the night's greys, a step darker. */
export const FADED_TABLE = greysAt(0.85);
/** A face gone grey (Aldric, given all away): the night's greys, darker still. */
export const ASHEN_TABLE = greysAt(0.7);

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

