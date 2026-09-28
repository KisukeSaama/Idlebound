import { lookup } from "../lookup";
import { ALDRIC } from "./grids/companions/aldric";
import { ASHKA } from "./grids/companions/ashka";
import { AURELION } from "./grids/companions/aurelion";
import { AWAKENED } from "./grids/companions/awakened";
import { BROM } from "./grids/companions/brom";
import { CELESTINE } from "./grids/companions/celestine";
import { CENDRE } from "./grids/companions/cendre";
import { ELDRA } from "./grids/companions/eldra";
import { GARRICK } from "./grids/companions/garrick";
import { KAELEN } from "./grids/companions/kaelen";
import { LYSANDRE } from "./grids/companions/lysandre";
import { MAELLE } from "./grids/companions/maelle";
import { MIRELLE } from "./grids/companions/mirelle";
import { MORGRATH } from "./grids/companions/morgrath";
import { NAMELESS } from "./grids/companions/nameless";
import { NYX } from "./grids/companions/nyx";
import { ORIANE } from "./grids/companions/oriane";
import { SERAPHINE } from "./grids/companions/seraphine";
import { THORVALD } from "./grids/companions/thorvald";
import { VORN } from "./grids/companions/vorn";
import { YSOLDE } from "./grids/companions/ysolde";
import { SKINS } from "./grids/companions/skins";
import type { Material, MaterialId } from "./palette";
import type { PortraitRecipe } from "./types";

/**
 * Companion portraits (BIBLE 18.8): 64 × 64 painted busts (`grids/companions/`),
 * each with the material of every slot of its legend. `hero` is the ramp of the
 * companion's color. The Awakened's skin and hair are seeded by the walker's own
 * settings, so it is a little different for everyone.
 */
const RECIPES: Record<string, PortraitRecipe> = {
  aldric: ALDRIC,
  maelle: MAELLE,
  brom: BROM,
  ysolde: YSOLDE,
  cendre: CENDRE,
  nyx: NYX,
  garrick: GARRICK,
  seraphine: SERAPHINE,
  thorvald: THORVALD,
  mirelle: MIRELLE,
  kaelen: KAELEN,
  oriane: ORIANE,
  vorn: VORN,
  lysandre: LYSANDRE,
  ashka: ASHKA,
  nameless: NAMELESS,
  eldra: ELDRA,
  morgrath: MORGRATH,
  celestine: CELESTINE,
  aurelion: AURELION,
  awakened: AWAKENED
};

export const PORTRAITS: Record<string, PortraitRecipe> = lookup(Object.entries(RECIPES));

/** Skins and hair the Awakened's portrait draws from, one per setting of the walker. */
export const AWAKENED_CHOICES: { skin: readonly (MaterialId | Material)[]; hair: readonly (MaterialId | Material)[] } = {
  skin: [SKINS.light, SKINS.dark, "flesh", "ashen"],
  hair: ["fur-gold", "fur-brown", "fur-shadow", "fur-grey", "fur-rust", "bone"]
};
