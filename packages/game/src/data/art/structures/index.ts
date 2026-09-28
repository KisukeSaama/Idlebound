import type { DecorGrid, StructureRecipe } from "../architecture";
import { DEEPVAULTS_DECOR, DEEPVAULTS_STRUCTURES } from "./deepvaults";
import { HEARTHFIELDS_DECOR, HEARTHFIELDS_STRUCTURES } from "./hearthfields";
import { KEEP_DECOR, KEEP_STRUCTURES } from "./keep";
import { MIRE_DECOR, MIRE_STRUCTURES } from "./mire";
import { SANCTUM_DECOR, SANCTUM_STRUCTURES } from "./sanctum";
import { WYCHWOOD_DECOR, WYCHWOOD_STRUCTURES } from "./wychwood";

/**
 * Every building and ruin of the scenes, and the small details drawn by hand that dress
 * them, one file per biome, and one for the places of the story. Keys are unique.
 */
export const STRUCTURES: Readonly<Record<string, StructureRecipe>> = {
  ...HEARTHFIELDS_STRUCTURES,
  ...WYCHWOOD_STRUCTURES,
  ...DEEPVAULTS_STRUCTURES,
  ...MIRE_STRUCTURES,
  ...KEEP_STRUCTURES,
  ...SANCTUM_STRUCTURES
};

export const DECOR: Readonly<Record<string, DecorGrid>> = {
  ...HEARTHFIELDS_DECOR,
  ...WYCHWOOD_DECOR,
  ...DEEPVAULTS_DECOR,
  ...MIRE_DECOR,
  ...KEEP_DECOR,
  ...SANCTUM_DECOR
};
