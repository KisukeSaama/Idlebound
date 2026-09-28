/**
 * Static exports of the pixel generator (BIBLE 18.9): the OpenGraph image, so the shared
 * link shows the same world as the game. Deterministic: the same code gives the same file.
 *
 * Usage: npm run art
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderCreature } from "../src/game/pixel/creature";
import { toRgba, type Bitmap } from "../src/game/pixel/pixels";
import { flattenScene, renderScene } from "../src/game/pixel/scene";
import { decodePng, encodePng, type Image } from "./png";

const root = (path: string) => fileURLToPath(new URL(`../../../${path}`, import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;
const SCALE = 4;

const og: Image = { width: WIDTH, height: HEIGHT, data: new Uint8Array(WIDTH * HEIGHT * 4) };

/** Draws a bitmap scaled by a whole factor, alpha-blended. */
function place(bitmap: Bitmap, left: number, top: number, scale: number) {
  for (let y = 0; y < bitmap.h * scale; y += 1) {
    const ty = top + y;
    if (ty < 0 || ty >= HEIGHT) continue;
    for (let x = 0; x < bitmap.w * scale; x += 1) {
      const tx = left + x;
      if (tx < 0 || tx >= WIDTH) continue;
      const from = (Math.floor(y / scale) * bitmap.w + Math.floor(x / scale)) * 4;
      blend(tx, ty, bitmap.data[from], bitmap.data[from + 1], bitmap.data[from + 2], bitmap.data[from + 3] / 255);
    }
  }
}

function blend(x: number, y: number, r: number, g: number, b: number, a: number) {
  if (a <= 0) return;
  const at = (y * WIDTH + x) * 4;
  og.data[at] = Math.round(og.data[at] * (1 - a) + r * a);
  og.data[at + 1] = Math.round(og.data[at + 1] * (1 - a) + g * a);
  og.data[at + 2] = Math.round(og.data[at + 2] * (1 - a) + b * a);
  og.data[at + 3] = 255;
}

// The Keep at night, a veil of the night ink for the logo to read on.
place(toRgba(flattenScene(renderScene("fallen-king-ruins"))), -40, -80, SCALE);
for (let y = 0; y < HEIGHT; y += 1) for (let x = 0; x < WIDTH; x += 1) blend(x, y, 11, 10, 20, (90 + 120 * (y / HEIGHT)) / 255);

// The Fallen King and a shade wolf, standing on the road.
const floor = 606;
for (const [id, left] of [["shade-wolf", 250], ["ruined-king", WIDTH - 128 * SCALE - 30]] as const) {
  const sprite = renderCreature(id);
  place(toRgba(sprite.pixels), left, floor - sprite.feet * SCALE, SCALE);
}

// The brand logo (painted, kept as it is), shrunk by area averaging.
const logo = decodePng(readFileSync(root("assets-src/original/brand/idlebound-logo.png")));
const factor = Math.max(logo.width / 620, logo.height / 260);
const lw = Math.floor(logo.width / factor);
const lh = Math.floor(logo.height / factor);
for (let y = 0; y < lh; y += 1) {
  for (let x = 0; x < lw; x += 1) {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    let n = 0;
    for (let sy = Math.floor(y * factor); sy < Math.floor((y + 1) * factor); sy += 1) {
      for (let sx = Math.floor(x * factor); sx < Math.floor((x + 1) * factor); sx += 1) {
        const at = (sy * logo.width + sx) * 4;
        const alpha = logo.data[at + 3];
        r += logo.data[at] * alpha;
        g += logo.data[at + 1] * alpha;
        b += logo.data[at + 2] * alpha;
        a += alpha;
        n += 1;
      }
    }
    if (a > 0) blend(50 + x, 110 + y, r / a, g / a, b / a, a / n / 255);
  }
}

writeFileSync(root("apps/web/public/og.png"), encodePng(og));
console.log("apps/web/public/og.png generated");
