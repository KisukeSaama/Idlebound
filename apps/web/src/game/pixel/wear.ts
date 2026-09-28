/**
 * The wear of the world, stratum by stratum (BIBLE 9, 18.6): the deeper the night, the
 * older the places look. At the present night the buildings stand, a window still lit. The
 * Echo doubles them, the Ash burns them, the Void cuts round pieces out of the world
 * (scene.ts), the Astral grows
 * star-shards through them; in the Elder World only their lower walls remain, overgrown, and
 * rime covers them in its last stratum; deeper still, ruins under the Age's own marks.
 */
import { C, palLuma, type Pal, type SceneRecipe } from "@idlebound/game/art";
import { NO_WEAR, weather, type BuildColors, type Wear } from "./architecture";
import { ageOf, ERAS_PER_AGE } from "./eras";
import { applyColors, blit, createPixels, EMPTY, hash2, reduceColors, setPixel, valueNoise, type Pixels } from "./pixels";

/** Charcoal, darkest first: what timber and thatch become in the Ash. */
const CHAR: readonly Pal[] = [C.ink, C.night1, C.night2, C.night4];

/** How worn the structures of a scene are in an era. */
export function wearOf(era: number, recipe: SceneRecipe): Wear {
  const age = ageOf(era);
  const step = Math.max(0, era) % ERAS_PER_AGE;
  if (age === 0) {
    switch (step) {
      case 0:
        return NO_WEAR;
      case 1:
        return { collapse: 0.08, growth: 0.05, echo: recipe.sky[recipe.sky.length - 1] };
      case 2:
        return { collapse: 0.45, growth: 0, char: { ramp: CHAR, ember: C.ember }, dark: true };
      case 3:
        return { collapse: 0.3, growth: 0.1 };
      default:
        return { collapse: 0.35, growth: 0.2, shards: [C.shard, C.shardLight] };
    }
  }
  if (age === 1) return { collapse: 0.6 + step * 0.06, growth: 0.7, dark: true, frost: step === 4 ? C.pale : undefined };
  if (age === 2) return { collapse: 0.7, growth: 0.5, dark: true };
  return { collapse: 0.8, growth: 0.4, dark: true };
}

/**
 * The same wear on a sprite drawn without a volume buffer (the Hearthfields' hand-drawn
 * props): its top rows fall along a jagged line, timber chars, lights go out.
 * `fragile` is the share of its height that may fall.
 */
export function wearSprite(source: Pixels, wear: Wear, fragile: number, seed: number, colors: BuildColors): Pixels {
  if (wear === NO_WEAR) return source;
  const outline = colors.outline;
  // Room above and to the side for the echo and the shards.
  const out = createPixels(source.w + 8, source.h + 6);
  blit(out, source, 4, 6);
  const { w, h } = out;
  let top = h;
  for (let at = 0; at < w * h; at += 1) if (out.idx[at] !== EMPTY) top = Math.min(top, Math.floor(at / w));
  const fallen = (h - top) * fragile * wear.collapse;
  for (let x = 0; x < w; x += 1) {
    const block = Math.floor(x / 3);
    const line = top + Math.round(fallen * (0.55 + 0.9 * valueNoise(block, 0, 3, seed + 21)) + (hash2(block, 1, seed) - 0.5) * 3);
    for (let y = 0; y < Math.min(h - 3, line); y += 1) {
      out.idx[y * w + x] = EMPTY;
      out.alpha[y * w + x] = 0;
    }
  }
  for (let at = 0; at < w * h; at += 1) {
    if (out.idx[at] === EMPTY) continue;
    if (out.emit[at] && (wear.dark || wear.char)) {
      out.idx[at] = outline;
      out.emit[at] = 0;
    } else if (wear.char && !out.emit[at]) out.idx[at] = CHAR[Math.min(CHAR.length - 1, charStep(out.idx[at]))];
  }
  weather(out, wear, colors, 0, seed, 0, false);
  if (wear.char) {
    // Embers along what is left of the tops.
    for (let x = 0; x < w; x += 1) {
      for (let y = 0; y < h; y += 1) {
        if (out.idx[y * w + x] === EMPTY) continue;
        if (hash2(x, y, seed) < 0.2) setPixel(out, x, y, wear.char.ember, 255, 1);
        break;
      }
    }
  }
  // Moss, echo and shards add colors: back to twelve at most.
  return applyColors(out, reduceColors(out));
}

/** The charcoal step of a color: darker colors char darker. */
function charStep(pal: Pal): number {
  const luma = palLuma(pal);
  return luma < 28 ? 0 : luma < 50 ? 1 : luma < 90 ? 2 : 3;
}
