import { lookup } from "../lookup";
import { ALDEMAR } from "./grids/aldemar";
import { BANNER_WRAITH } from "./grids/banner-wraith";
import { BLANK_KING } from "./grids/blank-king";
import { BLIND_CRAWLER } from "./grids/blind-crawler";
import { BOG_COLOSSUS } from "./grids/bog-colossus";
import { BOG_REMNANT } from "./grids/bog-remnant";
import { BRIAR_WITCH } from "./grids/briar-witch";
import { CANDLE_MAID } from "./grids/candle-maid";
import { CARRION_CROW } from "./grids/carrion-crow";
import { COURT_JESTER } from "./grids/court-jester";
import { CRYSTAL_MITE } from "./grids/crystal-mite";
import { DRIP_LEECH } from "./grids/drip-leech";
import { DROWNED_COURTIER } from "./grids/drowned-courtier";
import { DUSK_HARE } from "./grids/dusk-hare";
import { ECHO_BAT } from "./grids/echo-bat";
import { FALLEN_SENTINEL } from "./grids/fallen-sentinel";
import { FERRYMAN } from "./grids/ferryman";
import { FIELD_RAT } from "./grids/field-rat";
import { GOLDEN_RAT } from "./grids/golden-rat";
import { GROVE_SPINNER } from "./grids/grove-spinner";
import { HALLOWED_KING } from "./grids/hallowed-king";
import { HOLLOW_CANARY } from "./grids/hollow-canary";
import { HOLLOW_CROWN } from "./grids/hollow-crown";
import { HOLLOW_PAGE } from "./grids/hollow-page";
import { HOLLOW_SCARECROW } from "./grids/hollow-scarecrow";
import { HOUR_GARGOYLE } from "./grids/hour-gargoyle";
import { KING_NAME } from "./grids/king-name";
import { LANTERN_MOTH } from "./grids/lantern-moth";
import { LANTERN_QUEEN } from "./grids/lantern-queen";
import { LAST_HOUND } from "./grids/last-hound";
import { LAST_REAPER } from "./grids/last-reaper";
import { LOST_SHEPHERD } from "./grids/lost-shepherd";
import { MINER_SHADE } from "./grids/miner-shade";
import { MIRE_HERON } from "./grids/mire-heron";
import { MOSS_ALPHA } from "./grids/moss-alpha";
import { MOURNING_OWL } from "./grids/mourning-owl";
import { OLD_GROVE } from "./grids/old-grove";
import { PEAT_CUTTER } from "./grids/peat-cutter";
import { ROOT_KNIGHT } from "./grids/root-knight";
import { ROT_BARON } from "./grids/rot-baron";
import { ROT_TOAD } from "./grids/rot-toad";
import { RUINED_KING } from "./grids/ruined-king";
import { RUNE_CART } from "./grids/rune-cart";
import { SEAM_WARDEN } from "./grids/seam-warden";
import { SHADE_WOLF } from "./grids/shade-wolf";
import { SINGING_GEODE } from "./grids/singing-geode";
import { SKETCHED_KING } from "./grids/sketched-king";
import { SLEEPING_KING } from "./grids/sleeping-king";
import { STAR_CROWNED } from "./grids/star-crowned";
import { STONE_DEVOURER } from "./grids/stone-devourer";
import { STONE_WARDEN } from "./grids/stone-warden";
import { STRAY_ARMOR } from "./grids/stray-armor";
import { THE_DAWN } from "./grids/the-dawn";
import { THE_QUIET } from "./grids/the-quiet";
import { TITAN_KING } from "./grids/titan-king";
import { TOADSTOOL_CHOIR } from "./grids/toadstool-choir";
import { WALKER_ECHO } from "./grids/walker-echo";
import { WEEPING_STAG } from "./grids/weeping-stag";
import { WHISPER_BRAMBLE } from "./grids/whisper-bramble";
import { WILD_BOAR } from "./grids/wild-boar";
import { WILL_O_WISP } from "./grids/will-o-wisp";
import { WINDOW_KING } from "./grids/window-king";
import { WOVEN_KING } from "./grids/woven-king";
import type { CreatureRecipe, ResolvedRecipe } from "./types";

/**
 * The creatures of the five biomes, the Lantern Queen and Pip, every one drawn by hand
 * (`grids/`): its rows, the material of each slot of its legend (so era treatments can swap
 * one matter for another), and the seed its era effects draw from.
 */
const RECIPES: CreatureRecipe[] = [
  // ---- Hearthfields
  { id: "field-rat", materials: { fur: "fur-brown", skin: "flesh", shadow: "fur-shadow" }, grid: FIELD_RAT, seed: 1101 },
  { id: "wild-boar", materials: { fur: "fur-brown", shadow: "fur-shadow", snout: "flesh", tusk: "bone" }, grid: WILD_BOAR, seed: 1201 },
  { id: "carrion-crow", materials: { feather: "feather", shadow: "fur-shadow", horn: "bone", straw: "fur-gold" }, grid: CARRION_CROW, seed: 1102 },
  { id: "hollow-scarecrow", materials: { coat: "royal", sack: "fur-brown", straw: "fur-gold", shadow: "fur-shadow", blade: "metal" }, grid: HOLLOW_SCARECROW, seed: 1401 },
  { id: "lantern-moth", materials: { wing: "fur-grey", shadow: "fur-shadow", fur: "fur-brown", spot: "fur-gold" }, grid: LANTERN_MOTH, seed: 1501 },
  { id: "dusk-hare", materials: { fur: "fur-grey", shadow: "fur-shadow", tooth: "bone" }, grid: DUSK_HARE, seed: 1601 },
  { id: "last-reaper", rank: "elite", materials: { robe: "royal", shadow: "fur-shadow", bone: "bone", wood: "fur-brown", straw: "fur-gold" }, grid: LAST_REAPER, seed: 1202 },
  { id: "moss-alpha", rank: "guardian", materials: { fur: "fur-brown", shadow: "fur-shadow", moss: "moss", snout: "flesh", tusk: "bone" }, grid: MOSS_ALPHA, seed: 1301 },
  { id: "lost-shepherd", materials: { robe: "royal", fleece: "bone", wood: "fur-brown", shadow: "fur-shadow", bell: "gold" }, grid: LOST_SHEPHERD, seed: 1701 },
  // ---- Wychwood
  { id: "shade-wolf", materials: { fur: "fur-shadow", wisp: "essence", fang: "bone" }, grid: SHADE_WOLF, seed: 2101 },
  { id: "briar-witch", materials: { robe: "royal", moss: "leaf", bark: "bark", skin: "bone", magic: "essence" }, grid: BRIAR_WITCH, seed: 2201 },
  { id: "grove-spinner", materials: { bark: "bark", moss: "leaf", fang: "bone" }, grid: GROVE_SPINNER, seed: 2301 },
  { id: "root-knight", rank: "elite", materials: { plate: "stone", bark: "bark", moss: "leaf" }, grid: ROOT_KNIGHT, seed: 2202 },
  { id: "old-grove", rank: "guardian", materials: { bark: "bark", rot: "royal", moss: "leaf", heart: "essence" }, grid: OLD_GROVE, seed: 2401 },
  { id: "mourning-owl", materials: { feather: "bark", shade: "fur-shadow", veil: "fur-grey", moss: "leaf" }, grid: MOURNING_OWL, seed: 2501 },
  { id: "toadstool-choir", materials: { cap: "flesh", stem: "fur-shadow", pale: "fur-grey", root: "bark" }, grid: TOADSTOOL_CHOIR, seed: 2601 },
  { id: "whisper-bramble", materials: { cane: "bark", green: "leaf", thorn: "cloth-red", cloth: "stone", berry: "fur-grey" }, grid: WHISPER_BRAMBLE, seed: 2701 },
  { id: "weeping-stag", materials: { fur: "fur-brown", shade: "fur-shadow", moss: "leaf", antler: "bone", sap: "ember" }, grid: WEEPING_STAG, seed: 2901 },
  // ---- Deepvaults
  { id: "blind-crawler", materials: { skin: "bone", shadow: "fur-shadow", maw: "cloth-red" }, grid: BLIND_CRAWLER, seed: 3101 },
  { id: "echo-bat", materials: { fur: "fur-shadow", wing: "royal", bone: "bone" }, grid: ECHO_BAT, seed: 3201 },
  { id: "crystal-mite", materials: { shell: "cave-stone", glass: "crystal", violet: "essence" }, grid: CRYSTAL_MITE, seed: 3301 },
  { id: "drip-leech", materials: { skin: "flesh", rock: "cave-stone", maw: "cloth-red", bone: "bone" }, grid: DRIP_LEECH, seed: 3601 },
  { id: "rune-cart", materials: { wood: "fur-brown", iron: "cave-stone", glass: "crystal" }, grid: RUNE_CART, seed: 3701 },
  { id: "hollow-canary", materials: { feather: "gold", skin: "flesh", beak: "fur-brown", shadow: "fur-shadow", bone: "bone" }, grid: HOLLOW_CANARY, seed: 3801 },
  { id: "miner-shade", rank: "elite", materials: { ghost: "cave-stone", leather: "fur-brown", brass: "gold" }, grid: MINER_SHADE, seed: 3401 },
  { id: "stone-devourer", rank: "guardian", materials: { stone: "stone", shadow: "fur-shadow", flesh: "essence" }, grid: STONE_DEVOURER, seed: 3501 },
  { id: "singing-geode", materials: { rock: "fur-shadow", stone: "stone", glass: "crystal", light: "essence" }, grid: SINGING_GEODE, seed: 3901 },
  // ---- Mire of Osric
  { id: "bog-remnant", materials: { body: "fur-shadow", bone: "bone", mud: "mud", moss: "slime", glow: "essence" }, grid: BOG_REMNANT, seed: 4101 },
  { id: "rot-toad", materials: { skin: "slime", mud: "mud", shadow: "fur-shadow", rot: "essence" }, grid: ROT_TOAD, seed: 4201 },
  { id: "will-o-wisp", materials: { iron: "fur-shadow", rust: "bark", flame: "slime" }, grid: WILL_O_WISP, seed: 4301 },
  { id: "drowned-courtier", materials: { velvet: "fur-rust", skin: "slime", ruff: "bone" }, grid: DROWNED_COURTIER, seed: 4601 },
  { id: "peat-cutter", materials: { peat: "bark", cap: "fur-shadow", iron: "bone", moss: "slime" }, grid: PEAT_CUTTER, seed: 4701 },
  { id: "mire-heron", materials: { feather: "fur-grey", shadow: "fur-shadow", rust: "flesh", mud: "mud" }, grid: MIRE_HERON, seed: 4801 },
  { id: "bog-colossus", rank: "elite", materials: { peat: "mud", reed: "slime", wood: "bark", iron: "fur-shadow" }, grid: BOG_COLOSSUS, seed: 4401 },
  { id: "rot-baron", rank: "guardian", materials: { shadow: "fur-shadow", fur: "fur-brown", bone: "bone", glow: "essence" }, grid: ROT_BARON, seed: 4501 },
  { id: "ferryman", materials: { robe: "fur-shadow", wood: "bark", bone: "bone", water: "mud", coin: "gold" }, grid: FERRYMAN, seed: 4901 },
  // ---- Orvane Keep
  { id: "hour-gargoyle", materials: { hide: "dark-metal", stone: "stone", fire: "essence" }, grid: HOUR_GARGOYLE, seed: 5101 },
  { id: "banner-wraith", materials: { cloth: "dark-metal", edge: "bone", gold: "gold", fire: "essence" }, grid: BANNER_WRAITH, seed: 5201 },
  { id: "fallen-sentinel", materials: { steel: "dark-metal", edge: "metal", cloth: "royal", fire: "essence" }, grid: FALLEN_SENTINEL, seed: 5301 },
  { id: "hollow-page", materials: { cloth: "cloth-red", dark: "dark-metal", pale: "bone", trim: "gold" }, grid: HOLLOW_PAGE, seed: 5601 },
  { id: "last-hound", materials: { fur: "fur-grey", dark: "dark-metal", collar: "gold" }, grid: LAST_HOUND, seed: 5701 },
  { id: "candle-maid", materials: { dress: "dark-metal", linen: "bone", wax: "fur-brown", brass: "gold" }, grid: CANDLE_MAID, seed: 5801 },
  { id: "stone-warden", rank: "elite", materials: { stone: "stone", moss: "moss", rune: "essence" }, grid: STONE_WARDEN, seed: 5401 },
  { id: "ruined-king", rank: "king", materials: { shadow: "fur-shadow", plate: "dark-metal", bone: "bone", gold: "gold", fire: "essence" }, grid: RUINED_KING, seed: 5501 },
  { id: "court-jester", materials: { motley: "fur-grey", dark: "dark-metal", bells: "gold" }, grid: COURT_JESTER, seed: 5901 },
  { id: "titan-king", rank: "king", materials: { stone: "stone", gold: "gold", moss: "moss", fire: "royal" }, grid: TITAN_KING, seed: 9002 },
  { id: "hallowed-king", rank: "king", materials: { plate: "dark-metal", veil: "bone", gold: "gold" }, grid: HALLOWED_KING, seed: 9003 },
  { id: "star-crowned", rank: "king", materials: { sky: "cave-stone", bone: "bone", light: "crystal" }, grid: STAR_CROWNED, seed: 9004 },
  { id: "woven-king", rank: "king", materials: { cloth: "royal", dark: "dark-metal", thread: "bone", gold: "gold" }, grid: WOVEN_KING, seed: 9005 },
  { id: "sketched-king", rank: "king", materials: { paper: "bone", charcoal: "dark-metal", soft: "fur-shadow" }, grid: SKETCHED_KING, seed: 9006 },
  { id: "king-name", rank: "king", materials: {}, grid: KING_NAME, seed: 9007 },
  { id: "sleeping-king", rank: "king", materials: { shadow: "fur-shadow", plate: "dark-metal", gold: "gold", fire: "essence" }, grid: SLEEPING_KING, seed: 9008 },
  { id: "window-king", rank: "king", materials: { shadow: "fur-shadow", plate: "dark-metal", gold: "gold" }, grid: WINDOW_KING, seed: 9009 },
  { id: "hollow-crown", rank: "king", materials: { gold: "gold" }, grid: HOLLOW_CROWN, seed: 9010 },
  { id: "blank-king", rank: "king", materials: { pale: "bone" }, grid: BLANK_KING, seed: 9011 },
  { id: "aldemar", rank: "king", materials: { wool: "fur-shadow", skin: "ashen", hair: "bone" }, grid: ALDEMAR, seed: 9012 },
  // ---- Events: the queen of the moths, who comes with the Crystal Storm
  { id: "lantern-queen", rank: "elite", materials: { wing: "royal", fur: "bone", gold: "gold", shadow: "fur-shadow" }, grid: LANTERN_QUEEN, seed: 8001 },
  { id: "seam-warden", rank: "elite", materials: { glass: "stone", shadow: "fur-shadow" }, grid: SEAM_WARDEN, seed: 8101 },
  { id: "walker-echo", materials: { cloak: "cave-stone", steel: "fur-grey", dark: "dark-metal", shadow: "fur-shadow" }, grid: WALKER_ECHO, seed: 8201 },
  { id: "the-quiet", materials: { hollow: "fur-grey" }, grid: THE_QUIET, seed: 8301 },
  { id: "stray-armor", rank: "elite", materials: { steel: "dark-metal", plate: "metal", cloth: "cloth-red", shadow: "fur-shadow" }, grid: STRAY_ARMOR, seed: 8401 },
  { id: "the-dawn", rank: "king", materials: { light: "fur-grey" }, grid: THE_DAWN, seed: 8501 },
  // ---- Pip
  { id: "golden-rat", rank: "treasure", materials: { fur: "fur-gold", skin: "flesh" }, grid: GOLDEN_RAT, seed: 7001 }
];

export const CREATURE_RECIPES: Record<string, CreatureRecipe> = lookup(RECIPES.map((recipe) => [recipe.id, recipe]));

/** The recipe with its rank filled in. Unknown ids fall back to the Field Rat. */
export function resolveCreature(id: string): ResolvedRecipe {
  const recipe = CREATURE_RECIPES[id] ?? CREATURE_RECIPES["field-rat"];
  return { ...recipe, rank: recipe.rank ?? "normal" };
}
