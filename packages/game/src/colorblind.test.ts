import { describe, expect, it } from "vitest";
import { RARITIES, rarityColor } from "./data/items";

/** Dichromat vision (Machado, Oliveira and Fernandes 2009, full severity), on linear RGB. */
const VISIONS = {
  normal: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]]
};
type Vision = keyof typeof VISIONS;

const linear = (hex: string, at: number) => {
  const channel = Number.parseInt(hex.slice(at, at + 2), 16) / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};

/** The color as a dichromat sees it, in OKLab. */
function seen(hex: string, vision: Vision): number[] {
  const rgb = [1, 3, 5].map((at) => linear(hex, at));
  const [r, g, b] = VISIONS[vision].map((row) => Math.min(1, Math.max(0, row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2])));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

/** The closest two rarities, in OKLab distance ×100 (under 10, eyes start to merge them). */
function closest(colorblind: boolean, vision: Vision): number {
  let min = Infinity;
  RARITIES.forEach((a, index) => {
    for (const b of RARITIES.slice(index + 1)) {
      const [x, y] = [seen(rarityColor(a, colorblind), vision), seen(rarityColor(b, colorblind), vision)];
      min = Math.min(min, Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100);
    }
  });
  return min;
}

describe("colorblind rarities", () => {
  it("keeps every tier apart for every eye", () => {
    for (const vision of Object.keys(VISIONS) as Vision[]) expect(closest(true, vision)).toBeGreaterThan(15);
  });

  it("parts the tiers the usual colors merge for red-green eyes", () => {
    expect(closest(false, "deutan")).toBeLessThan(10);
    expect(closest(true, "deutan")).toBeGreaterThan(closest(false, "deutan") * 3);
  });
});
