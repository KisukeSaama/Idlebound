/**
 * Companion portraits (BIBLE 18.8): 64 × 64 busts, painted and traced into pixel clusters
 * like the creatures. The generator lays the rows in the ramps of their materials (the `hero`
 * slot takes the ramp of the companion's color), adds the night ink outline and keeps twelve
 * colors.
 */
import { HERO_BY_ID } from "@idlebound/game";
import { AWAKENED_CHOICES, C, PORTRAITS, RAMPS, rampFor, type Material, type PortraitRecipe } from "@idlebound/game/art";
import { applyColors, closeColors, createPixels, hash2, reduceColors, type Pixels } from "./pixels";
import { materialOf, outline, type ShadeOptions } from "./shade";

export const PORTRAIT_SIZE = 64;

/** The Awakened wears the walker's settings: a skin and a hair of its own, seeded by them. */
export function awakenedRecipe(seed: number): PortraitRecipe {
  const base = PORTRAITS.awakened;
  const choose = <T,>(list: readonly T[], salt: number) => list[Math.floor(hash2(seed, salt, 97) * list.length)];
  return { ...base, materials: { ...base.materials, skin: choose(AWAKENED_CHOICES.skin, 1), hair: choose(AWAKENED_CHOICES.hair, 2) } };
}

export function renderPortrait(heroId: string, recipeOverride?: PortraitRecipe): Pixels {
  const recipe = recipeOverride ?? PORTRAITS[heroId] ?? PORTRAITS.aldric;
  const hero: Material = { ramp: RAMPS[rampFor(HERO_BY_ID[heroId]?.color ?? "#f5c85b")], texture: "cloth" };
  const options: ShadeOptions = {
    materials: Object.fromEntries(Object.entries(recipe.materials).map(([slot, material]) => [slot, material === "hero" ? hero : material])),
    seed: 0
  };
  const pixels = createPixels(PORTRAIT_SIZE, PORTRAIT_SIZE);
  recipe.grid.rows.forEach((row, y) => {
    for (let x = 0; x < row.length && x < PORTRAIT_SIZE; x += 1) {
      const ink = recipe.grid.legend[row[x]];
      if (!ink || y >= PORTRAIT_SIZE) continue;
      const at = y * PORTRAIT_SIZE + x;
      if ("pal" in ink) {
        pixels.idx[at] = ink.pal;
        pixels.emit[at] = ink.glow ? 1 : 0;
      } else {
        const ramp = materialOf(ink.m, options).ramp;
        pixels.idx[at] = ramp[Math.min(ramp.length - 1, Math.max(0, ink.step))];
      }
      pixels.alpha[at] = 255;
    }
  });
  const out = outline(pixels, C.ink);
  return applyColors(out, closeColors(reduceColors(out), out));
}
