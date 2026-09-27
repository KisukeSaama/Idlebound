/**
 * Pixel-art blade trails for companion strikes, drawn pixel by pixel on a tiny canvas and
 * shown scaled up with `image-rendering: pixelated`, so they match the painted pixel art of
 * the monsters and biomes instead of a smooth vector glow.
 *
 * A trail is a crescent: thick in the middle, tapered at both ends, colored from the outside
 * in (companion color, light tint, white edge) with a dark one-pixel outline like the sprites.
 */

/** Size of one art pixel on screen, close to the monsters' own pixels. */
export const SLASH_PIXEL = 4;
const HEIGHT_RATIO = 0.375;
const OUTLINE = [20, 14, 34, 190] as const;

const cache = new Map<string, string>();

function parseHex(color: string): [number, number, number] {
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const value = Number.parseInt(full.slice(0, 6), 16);
  return Number.isFinite(value) ? [(value >> 16) & 255, (value >> 8) & 255, value & 255] : [255, 255, 255];
}

const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

/** Data URL of a trail `columns` art pixels wide in `color` (cached). */
export function slashSprite(color: string, columns: number): string | null {
  const key = `${color}-${columns}`;
  const cached = cache.get(key);
  if (cached) return cached;
  if (typeof document === "undefined") return null;

  const width = columns;
  const height = slashRows(columns);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const image = context.createImageData(width, height);
  const [r, g, b] = parseHex(color);
  const light: [number, number, number] = [mix(r, 255, 0.55), mix(g, 255, 0.55), mix(b, 255, 0.55)];

  // Upper half of an ellipse whose bottom center sits on the canvas' bottom edge.
  const cx = width / 2;
  const cy = height;
  const rx = width / 2 - 1;
  const ry = height - 1;
  const band = new Uint8Array(width * height);
  const shade = new Float32Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const nx = (x + 0.5 - cx) / rx;
      const ny = (y + 0.5 - cy) / ry;
      const radius = Math.hypot(nx, ny);
      const along = 1 - Math.min(1, Math.abs(nx));
      if (along < 0.06) continue;
      const thickness = 0.1 + 0.28 * Math.pow(along, 0.7);
      if (radius > 1 || radius < 1 - thickness) continue;
      band[y * width + x] = 1;
      shade[y * width + x] = (1 - radius) / thickness;
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const offset = index * 4;
      if (band[index]) {
        const depth = shade[index];
        const [pr, pg, pb] = depth > 0.72 ? [255, 255, 255] : depth > 0.42 ? light : [r, g, b];
        image.data.set([pr, pg, pb, 255], offset);
        continue;
      }
      // Dark outline on empty pixels touching the trail.
      const touches =
        (x > 0 && band[index - 1]) || (x < width - 1 && band[index + 1]) ||
        (y > 0 && band[index - width]) || (y < height - 1 && band[index + width]);
      if (touches) image.data.set(OUTLINE, offset);
    }
  }

  context.putImageData(image, 0, 0);
  const url = canvas.toDataURL("image/png");
  cache.set(key, url);
  return url;
}

/** Trail height in art pixels for a given width. */
export function slashRows(columns: number): number {
  return Math.max(6, Math.round(columns * HEIGHT_RATIO));
}

/** Trail width in art pixels for a monster sprite of `spriteWidth` screen pixels. */
export function slashColumns(spriteWidth: number): number {
  const screen = Math.min(170, Math.max(72, spriteWidth * 0.42));
  // Multiples of 2 art pixels keep the cache small.
  return Math.round(screen / SLASH_PIXEL / 2) * 2;
}
