/**
 * Companion portraits (BIBLE 18.8): 32 × 32 head and shoulders, built in layers (clothing,
 * neck, hair behind, head, hair in front, headgear, accessory) and run through the same
 * shading and outline as the creatures. The companion's color drives the clothing ramp.
 */
import { HERO_BY_ID } from "@idlebound/game";
import { AWAKENED_CHOICES, C, PORTRAITS, RAMPS, rampFor, type Material, type PortraitRecipe, type Shape } from "@idlebound/game/art";
import { applyColors, hash2, reduceColors, type Pixels } from "./pixels";
import { rasterize, type Placed } from "./raster";
import { outline, shade } from "./shade";

export const PORTRAIT_SIZE = 32;

const SKINS: Record<PortraitRecipe["skin"], Material> = {
  light: { ramp: [C.flesh0, C.flesh1, C.flesh2, C.flesh3], texture: "smooth" },
  tan: { ramp: [C.flesh0, C.flesh1, C.fur2, C.fur3], texture: "smooth" },
  dark: { ramp: [C.night3, C.flesh0, C.fur1, C.fur2], texture: "smooth" },
  ash: { ramp: [C.night4, C.haze, C.lilac, C.pale], texture: "smooth" },
  bone: { ramp: [C.night4, C.haze, C.paper, C.moon], texture: "bone" },
  scale: { ramp: [C.goldInk, C.goldDeep, C.goldDark, C.gold], texture: "scales" },
  shade: { ramp: [C.ink, C.night1, C.night2, C.night3], texture: "smooth" }
};

const HEADS: Record<PortraitRecipe["head"], Shape> = {
  round: { e: [32, 30, 13, 14], m: "skin", lift: 1 },
  long: { e: [32, 30, 11, 16], m: "skin", lift: 1 },
  square: { p: [20, 20, 23, 16, 41, 16, 44, 20, 44, 36, 38, 44, 26, 44, 20, 36], m: "skin", lift: 1 },
  narrow: { e: [32, 31, 11, 14.5], m: "skin", lift: 1 }
};

function hairBack(recipe: PortraitRecipe): Shape[] {
  switch (recipe.hair) {
    case "long":
      return [{ p: [17, 22, 32, 12, 47, 22, 49, 56, 40, 50, 24, 50, 15, 56], m: "hair" }];
    case "mane":
      return [{ e: [32, 30, 21, 20], m: "hair" }];
    case "braid":
      return [{ c: [44, 30, 47, 54, 4, 2.6], m: "hair" }];
    case "bun":
      return [{ e: [32, 13, 7, 6], m: "hair" }];
    default:
      return [];
  }
}

function hairFront(recipe: PortraitRecipe): Shape[] {
  switch (recipe.hair) {
    case "short":
    case "long":
    case "braid":
    case "bun":
    case "mane":
      return [{ p: [19, 28, 21, 18, 32, 14, 43, 18, 45, 28, 40, 21, 33, 23, 25, 21], m: "hair" }];
    case "wild":
      return [{ p: [16, 30, 17, 16, 22, 18, 24, 10, 30, 15, 34, 8, 38, 15, 44, 10, 44, 18, 48, 17, 47, 30, 41, 21, 32, 23, 24, 21], m: "hair" }];
    case "tonsure":
      return [{ c: [20, 24, 22, 32, 3, 2.4], m: "hair" }, { c: [44, 24, 42, 32, 3, 2.4], m: "hair" }];
    default:
      return [];
  }
}

function clothing(recipe: PortraitRecipe): Shape[] {
  const shoulders: Shape = { e: [32, 66, 27, 18], m: "cloth" };
  switch (recipe.clothing) {
    case "plate":
      return [shoulders, { e: [9, 56, 9, 8], m: "trim" }, { e: [55, 56, 9, 8], m: "trim" }, { p: [26, 48, 38, 48, 36, 62, 28, 62], m: "trim" }];
    case "robe":
      return [shoulders, { p: [24, 46, 32, 62, 40, 46, 42, 48, 32, 64, 22, 48], m: "trim" }];
    case "cloak":
      return [shoulders, { p: [8, 64, 16, 44, 32, 50, 48, 44, 56, 64], m: "cloth", lift: -1 }, { e: [32, 50, 4, 3], m: "gold" }];
    case "apron":
      return [shoulders, { r: [23, 50, 18, 14], m: "trim" }, { c: [24, 50, 20, 46, 1.2, 1.2], m: "trim" }];
    case "leather":
      return [shoulders, { c: [14, 48, 44, 64, 2, 2], m: "trim" }];
    default:
      return [shoulders, { p: [27, 46, 32, 54, 37, 46], m: "skin" }];
  }
}

function headgear(recipe: PortraitRecipe, back: boolean): Shape[] {
  switch (recipe.headgear) {
    case "hood":
    case "star-hood":
    case "cowl":
      return back
        ? [{ p: [12, 60, 14, 24, 24, 10, 40, 10, 50, 24, 52, 60], m: "gear" }]
        : [{ p: [16, 34, 18, 20, 26, 13, 38, 13, 46, 20, 48, 34, 44, 22, 38, 17, 26, 17, 20, 22], m: "gear" }];
    case "helm":
      if (back) return [];
      // The Nameless's helmet is dark inside; the others show their face.
      return recipe.skin === "shade"
        ? [{ e: [32, 28, 15, 16], m: "gear" }, { r: [21, 28, 22, 3], m: "void" }, { r: [31, 11, 2, 12], m: "gear", lift: 1 }]
        : [{ e: [32, 27, 15, 15], m: "gear" }, { e: [32, 34, 10, 10], m: "skin", lift: 1 }, { r: [31, 11, 2, 12], m: "gear", lift: 1 }];
    case "crown":
      return back ? [] : [{ p: [19, 20, 18, 8, 23, 14, 27, 5, 32, 13, 37, 5, 41, 14, 46, 8, 45, 20], m: "gold" }];
    case "circlet":
      return back ? [] : [{ r: [19, 19, 26, 2.6], m: "gold" }, { e: [32, 20, 2, 2], m: "gem", glow: true }];
    case "hat":
      return back ? [] : [{ r: [14, 17, 36, 3.4], m: "gear" }, { p: [21, 18, 43, 18, 36, 0, 31, 2], m: "gear" }];
    case "horns":
      return back ? [] : [{ c: [22, 18, 12, 6, 3, 1], m: "horn" }, { c: [42, 18, 52, 6, 3, 1], m: "horn" }];
    case "veil":
      return back ? [{ p: [14, 64, 17, 18, 32, 10, 47, 18, 50, 64], m: "veil" }] : [];
    default:
      return [];
  }
}

function accessory(recipe: PortraitRecipe): Shape[] {
  switch (recipe.accessory) {
    case "beard":
      return [{ p: [21, 34, 26, 40, 38, 40, 43, 34, 42, 46, 32, 54, 22, 46], m: "hair" }];
    case "scar":
      return [{ c: [36, 25, 40, 36, 0.8, 0.8], m: "scar" }];
    case "quiver":
      return [{ c: [50, 40, 58, 60, 3, 3], m: "wood" }, { p: [48, 38, 50, 32, 52, 38], m: "trim" }];
    case "earring":
      return [{ e: [19, 36, 1.4, 1.6], m: "gold", glow: true }];
    case "stubble":
      return [{ e: [32, 40, 8, 4], m: "stubble" }];
    case "runes":
      return [{ r: [18, 56, 2, 2], m: "rune", glow: true }, { r: [44, 58, 2, 2], m: "rune", glow: true }];
    case "pipe":
      return [{ c: [36, 40, 44, 44, 0.9, 0.9], m: "wood" }];
    case "gem":
      return [{ e: [32, 56, 2.4, 2.6], m: "gem", glow: true }];
    default:
      return [];
  }
}

/** The Awakened wears the walker's settings: one choice per setting, seeded by them. */
export function awakenedRecipe(seed: number): PortraitRecipe {
  const base = PORTRAITS.awakened;
  const choose = <T,>(list: readonly T[], salt: number) => list[Math.floor(hash2(seed, salt, 97) * list.length)];
  return {
    ...base,
    skin: choose(AWAKENED_CHOICES.skin, 1),
    head: choose(AWAKENED_CHOICES.head, 2),
    hair: choose(AWAKENED_CHOICES.hair, 3),
    hairRamp: choose(AWAKENED_CHOICES.hairRamp, 4),
    accessory: choose(AWAKENED_CHOICES.accessory, 5),
    seed
  };
}

export function renderPortrait(heroId: string, recipeOverride?: PortraitRecipe): Pixels {
  const recipe = recipeOverride ?? PORTRAITS[heroId] ?? PORTRAITS.aldric;
  const color = HERO_BY_ID[heroId]?.color ?? "#f5c85b";
  const clothes = RAMPS[rampFor(color)];
  const hair = RAMPS[recipe.hairRamp];
  const shapes: Shape[] = [
    ...headgear(recipe, true),
    ...hairBack(recipe),
    ...clothing(recipe),
    { c: [32, 40, 32, 50, 6, 7], m: "skin", lift: -1 },
    { e: [19, 31, 2.6, 3.6], m: "skin" },
    { e: [45, 31, 2.6, 3.6], m: "skin" },
    HEADS[recipe.head],
    ...(recipe.headgear === "helm" ? [] : hairFront(recipe)),
    ...headgear(recipe, false),
    ...accessory(recipe)
  ];
  const placed: Placed[] = shapes.map((shape) => ({ shape, layer: 1 }));
  const raster = rasterize(placed, PORTRAIT_SIZE);
  const pixels = shade(raster, placed, {
    seed: recipe.seed,
    materials: {
      skin: SKINS[recipe.skin],
      hair: { ramp: hair, texture: "fur" },
      cloth: { ramp: clothes, texture: "cloth" },
      trim: recipe.clothing === "plate" ? "metal" : { ramp: RAMPS.wood, texture: "smooth" },
      gear: recipe.headgear === "helm" ? "metal" : { ramp: clothes, texture: "cloth" },
      gold: "gold",
      gem: "essence",
      horn: "bone",
      veil: { ramp: RAMPS.pale, texture: "ghost" },
      void: { ramp: [C.ink, C.ink, C.night1], texture: "smooth" },
      scar: "flesh",
      stubble: { ramp: [C.night3, C.dusk, C.haze], texture: "fur" },
      rune: "ember",
      wood: "bark"
    }
  });
  const out = outline(pixels);
  // Eyes, and Nyx's hood full of sky.
  const eyeY = 15;
  const shadowed = recipe.headgear === "star-hood";
  // Living faces get dark eyes that read on skin; shades and skulls keep their own light.
  const glowing = recipe.skin === "shade" || recipe.skin === "bone" || shadowed;
  for (const x of [13, 18]) {
    const at = eyeY * PORTRAIT_SIZE + x;
    if (recipe.headgear === "helm" && recipe.skin === "shade") continue;
    out.idx[at] = glowing ? recipe.eyes : C.night1;
    out.alpha[at] = 255;
    out.emit[at] = glowing ? 1 : 0;
  }
  if (shadowed) {
    for (let y = 9; y < 23; y += 1) {
      for (let x = 11; x < 21; x += 1) {
        const at = y * PORTRAIT_SIZE + x;
        if (out.emit[at]) continue;
        const inside = ((x - 16) / 5.2) ** 2 + ((y - 16) / 7) ** 2 <= 1;
        if (!inside) continue;
        const star = hash2(x, y, recipe.seed);
        out.idx[at] = star < 0.1 ? C.moon : star < 0.2 ? C.essenceBright : C.night1;
        out.alpha[at] = 255;
        out.emit[at] = star < 0.2 ? 1 : 0;
      }
    }
  }
  return applyColors(out, reduceColors(out));
}
