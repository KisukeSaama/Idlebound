/**
 * The picture a shared link shows (Open Graph, 1200 by 630): a biome at rest and, on its
 * ground, a creature, on one grid scaled by a whole factor. Pure, so the server draws it with
 * no canvas: the same cover gives the same pixels everywhere.
 */
import { SCENE_HEIGHT, SCENE_WIDTH } from "@idlebound/game/art";
import { renderCreature } from "./creature";
import { blit, toRgba, type Bitmap } from "./pixels";
import { flattenScene, renderScene } from "./scene";

export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 630;
/** The largest whole factor that still fills the frame's height with the scene. */
const SCALE = Math.ceil(COVER_HEIGHT / SCENE_HEIGHT);
/** The window of the scene the frame shows, in art pixels: centered, kept on the ground. */
const VIEW_W = Math.ceil(COVER_WIDTH / SCALE);
const VIEW_H = Math.ceil(COVER_HEIGHT / SCALE);

/** RGBA of the cover: `biome` filling the frame, `creature` standing centered on its floor. */
export function coverBitmap(biome: string, creature?: string): Bitmap {
  const scene = renderScene(biome);
  const art = flattenScene(scene, SCENE_WIDTH);
  if (creature) {
    const sprite = renderCreature(creature);
    blit(art, sprite.pixels, Math.floor(SCENE_WIDTH / 2) - Math.round(sprite.pixels.w / 2), scene.ground - sprite.feet);
  }
  const source = toRgba(art);
  const left = Math.floor((SCENE_WIDTH - VIEW_W) / 2);
  const top = SCENE_HEIGHT - VIEW_H;
  const data = new Uint8ClampedArray(COVER_WIDTH * COVER_HEIGHT * 4);
  for (let y = 0; y < COVER_HEIGHT; y += 1) {
    const row = (top + Math.floor(y / SCALE)) * SCENE_WIDTH;
    for (let x = 0; x < COVER_WIDTH; x += 1) {
      const from = (row + left + Math.floor(x / SCALE)) * 4;
      const to = (y * COVER_WIDTH + x) * 4;
      data[to] = source.data[from];
      data[to + 1] = source.data[from + 1];
      data[to + 2] = source.data[from + 2];
      data[to + 3] = 255;
    }
  }
  return { w: COVER_WIDTH, h: COVER_HEIGHT, data };
}
