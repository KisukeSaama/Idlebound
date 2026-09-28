import { lookup } from "../lookup";
import { C } from "./palette";
import type { PortraitRecipe } from "./types";

/**
 * Companion portraits (BIBLE 18.8): layered recipes for the 32 × 32 medallions. The
 * clothing takes the companion's color. The Awakened's portrait is seeded by the walker's
 * own settings, so it is a little different for everyone.
 */
const RECIPES: Record<string, PortraitRecipe> = {
  aldric: { skin: "tan", head: "square", hair: "short", hairRamp: "wood", headgear: "none", clothing: "plate", accessory: "scar", eyes: C.goldLight, seed: 11 },
  maelle: { skin: "light", head: "round", hair: "braid", hairRamp: "ember", headgear: "none", clothing: "leather", accessory: "quiver", eyes: C.field3, seed: 12 },
  brom: { skin: "dark", head: "square", hair: "none", hairRamp: "night", headgear: "none", clothing: "apron", accessory: "beard", eyes: C.amber, seed: 13 },
  ysolde: { skin: "light", head: "narrow", hair: "long", hairRamp: "gold", headgear: "circlet", clothing: "cloak", accessory: "earring", eyes: C.mint, seed: 14 },
  cendre: { skin: "tan", head: "round", hair: "tonsure", hairRamp: "wood", headgear: "none", clothing: "robe", accessory: "runes", eyes: C.ember, seed: 15 },
  nyx: { skin: "shade", head: "narrow", hair: "none", hairRamp: "night", headgear: "star-hood", clothing: "cloak", accessory: "none", eyes: C.essenceLight, seed: 16 },
  garrick: { skin: "tan", head: "square", hair: "short", hairRamp: "stone", headgear: "hat", clothing: "leather", accessory: "stubble", eyes: C.shard, seed: 17 },
  seraphine: { skin: "light", head: "narrow", hair: "wild", hairRamp: "green", headgear: "circlet", clothing: "robe", accessory: "earring", eyes: C.plainsAccent, seed: 18 },
  thorvald: { skin: "light", head: "square", hair: "mane", hairRamp: "wood", headgear: "helm", clothing: "plate", accessory: "beard", eyes: C.shard, seed: 19 },
  mirelle: { skin: "tan", head: "round", hair: "bun", hairRamp: "mire", headgear: "none", clothing: "apron", accessory: "earring", eyes: C.mireAccent, seed: 20 },
  kaelen: { skin: "light", head: "long", hair: "short", hairRamp: "night", headgear: "none", clothing: "plate", accessory: "scar", eyes: C.danger, seed: 21 },
  oriane: { skin: "dark", head: "narrow", hair: "long", hairRamp: "pale", headgear: "veil", clothing: "robe", accessory: "gem", eyes: C.shardLight, seed: 22 },
  vorn: { skin: "tan", head: "square", hair: "wild", hairRamp: "wood", headgear: "horns", clothing: "leather", accessory: "beard", eyes: C.amber, seed: 23 },
  lysandre: { skin: "light", head: "long", hair: "long", hairRamp: "pale", headgear: "hat", clothing: "robe", accessory: "gem", eyes: C.violetFire, seed: 24 },
  ashka: { skin: "dark", head: "narrow", hair: "braid", hairRamp: "red", headgear: "circlet", clothing: "robe", accessory: "runes", eyes: C.amber, seed: 25 },
  nameless: { skin: "shade", head: "square", hair: "none", hairRamp: "night", headgear: "helm", clothing: "plate", accessory: "none", eyes: C.ink, seed: 26 },
  eldra: { skin: "ash", head: "long", hair: "bun", hairRamp: "pale", headgear: "cowl", clothing: "robe", accessory: "gem", eyes: C.gold, seed: 27 },
  morgrath: { skin: "bone", head: "long", hair: "none", hairRamp: "night", headgear: "crown", clothing: "robe", accessory: "runes", eyes: C.mint, seed: 28 },
  celestine: { skin: "light", head: "round", hair: "long", hairRamp: "essence", headgear: "circlet", clothing: "robe", accessory: "gem", eyes: C.essenceLight, seed: 29 },
  aurelion: { skin: "scale", head: "long", hair: "mane", hairRamp: "gold", headgear: "horns", clothing: "cloak", accessory: "none", eyes: C.amber, seed: 30 },
  awakened: { skin: "light", head: "round", hair: "short", hairRamp: "gold", headgear: "none", clothing: "tunic", accessory: "none", eyes: C.goldLight, seed: 31 }
};

export const PORTRAITS: Record<string, PortraitRecipe> = lookup(Object.entries(RECIPES));

/** Choices the Awakened's portrait draws from, one per setting of the walker. */
export const AWAKENED_CHOICES = {
  skin: ["light", "tan", "dark", "ash"],
  head: ["round", "long", "square", "narrow"],
  hair: ["short", "long", "bun", "braid", "wild", "none"],
  hairRamp: ["gold", "wood", "night", "pale", "ember", "red"],
  accessory: ["none", "scar", "earring", "gem", "stubble"]
} as const satisfies { [K in keyof PortraitRecipe]?: readonly PortraitRecipe[K][] };
