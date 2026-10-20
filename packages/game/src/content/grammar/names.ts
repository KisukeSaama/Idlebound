import type { Locale } from "../../i18n";

/**
 * The creatures and companions the grammar may name, with the article each language needs
 * inside a sentence. The lists are fixed here, not read from the bestiary, so that a line
 * generated today is the same line forever: adding a creature to the game must not shift
 * every fragment already found. Names follow BIBLE 8 and 10.
 */

interface Named {
  /** In a sentence, with its article: "a field rat", "l'Alpha moussu". */
  en: string;
  fr: string;
}

export interface RemnantName extends Named {
  id: string;
  biome: string;
  /** Has hands and a voice (the Reaper, a drowned courtier): may do what only people do. */
  person: boolean;
}

export interface CompanionName extends Named {
  id: string;
  /** How the Chronicle signs a line spoken by them. */
  byEn: string;
  byFr: string;
  /** Speaks in full sentences (the Nameless, Nyx and the Awakened do not). */
  speaks: boolean;
}

function remnant(id: string, biome: string, en: string, fr: string, person = false): RemnantName {
  return { id, biome, en, fr, person };
}

export const REMNANTS: readonly RemnantName[] = [
  remnant("field-rat", "green-plains", "a field rat", "un rat des champs"),
  remnant("wild-boar", "green-plains", "a jumpy boar", "un sanglier nerveux"),
  remnant("carrion-crow", "green-plains", "a carrion crow", "un corbeau charognard"),
  remnant("hollow-scarecrow", "green-plains", "a hollow scarecrow", "un épouvantail creux", true),
  remnant("lantern-moth", "green-plains", "a lantern moth", "une phalène-lanterne"),
  remnant("dusk-hare", "green-plains", "a dusk hare", "un lièvre du crépuscule"),
  remnant("last-reaper", "green-plains", "the Last Reaper", "le Dernier Faucheur", true),
  remnant("moss-alpha", "green-plains", "the Moss Alpha", "l'Alpha moussu"),
  remnant("shade-wolf", "dark-forest", "a shade wolf", "un loup de l'ombre"),
  remnant("briar-witch", "dark-forest", "a briar witch", "une sorcière des ronces", true),
  remnant("grove-spinner", "dark-forest", "a grove spinner", "une fileuse du bosquet"),
  remnant("mourning-owl", "dark-forest", "a mourning owl", "une chouette endeuillée"),
  remnant("toadstool-choir", "dark-forest", "a toadstool choir", "un chœur de champignons"),
  remnant("root-knight", "dark-forest", "the Root Knight", "le Chevalier-racine", true),
  remnant("old-grove", "dark-forest", "the Heart of the Old Grove", "le Cœur du vieux bosquet"),
  remnant("blind-crawler", "forgotten-caves", "a blind crawler", "un rampeur aveugle"),
  remnant("echo-bat", "forgotten-caves", "an echo bat", "une chauve-souris d'écho"),
  remnant("crystal-mite", "forgotten-caves", "a crystal mite", "un acarien de cristal"),
  remnant("drip-leech", "forgotten-caves", "a drip leech", "une sangsue des gouttes"),
  remnant("miner-shade", "forgotten-caves", "the Miner's Shade", "l'Ombre de mineur", true),
  remnant("stone-devourer", "forgotten-caves", "the Stone Devourer", "le Dévorateur de pierre"),
  remnant("bog-remnant", "corrupted-marsh", "a bog Remnant", "un Vestige fangeux", true),
  remnant("rot-toad", "corrupted-marsh", "a rot toad", "un crapaud putride"),
  remnant("will-o-wisp", "corrupted-marsh", "a will-o'-wisp", "un feu follet"),
  remnant("drowned-courtier", "corrupted-marsh", "a drowned courtier", "un courtisan noyé", true),
  remnant("bog-colossus", "corrupted-marsh", "the Mire Colossus", "le Colosse de la fange"),
  remnant("rot-baron", "corrupted-marsh", "the Baron of Rot", "le Baron de la pourriture", true),
  remnant("hour-gargoyle", "fallen-king-ruins", "a gargoyle of the hours", "une gargouille des heures"),
  remnant("banner-wraith", "fallen-king-ruins", "a banner wraith", "un spectre-bannière", true),
  remnant("fallen-sentinel", "fallen-king-ruins", "a fallen sentinel", "une sentinelle déchue", true),
  remnant("hollow-page", "fallen-king-ruins", "a hollow page", "un page creux", true),
  remnant("stone-warden", "fallen-king-ruins", "the Stone Warden", "le Gardien de pierre", true)
];

/**
 * Who does a deed in the strata, where no creature of the road belongs: a Remnant, unnamed,
 * or someone. Never a companion or a creature of the five places.
 */
export const SOME_REMNANT: RemnantName = { id: "remnant", biome: "", en: "a Remnant", fr: "un Vestige", person: true };
export const SOMEONE: Named = { en: "someone", fr: "quelqu'un" };

function companion(id: string, en: string, fr: string, speaks = true, byEn = en, byFr = fr): CompanionName {
  return { id, en, fr, byEn, byFr, speaks };
}

export const COMPANIONS: readonly CompanionName[] = [
  companion("maelle", "Maëlle", "Maëlle"),
  companion("brom", "Brom", "Brom"),
  companion("ysolde", "Ysolde", "Ysolde"),
  companion("cendre", "Brother Cinder", "Frère Cendre"),
  companion("nyx", "Nyx", "Nyx", false),
  companion("garrick", "Garrick", "Garrick"),
  companion("seraphine", "Séraphine", "Séraphine"),
  companion("thorvald", "Thorvald", "Thorvald"),
  companion("mirelle", "Mirelle", "Mirelle"),
  companion("kaelen", "Kaelen", "Kaelen"),
  companion("oriane", "Oriane", "Oriane"),
  companion("vorn", "Vorn", "Vorn"),
  companion("lysandre", "Lysandre", "Lysandre"),
  companion("ashka", "Ashka", "Ashka"),
  companion("nameless", "the Nameless", "le Sans-Nom", false, "The Nameless", "Le Sans-Nom"),
  companion("eldra", "Eldra", "Eldra"),
  companion("morgrath", "Morgrath", "Morgrath"),
  companion("celestine", "Célestine", "Célestine"),
  companion("aurelion", "Aurelion", "Aurelion")
];

/** Companions tied to each place of the road (BIBLE 7). */
export const BIOME_COMPANIONS: Record<string, readonly string[]> = {
  "green-plains": ["maelle", "brom"],
  "dark-forest": ["ysolde", "seraphine", "nyx"],
  "forgotten-caves": ["garrick", "thorvald", "oriane"],
  "corrupted-marsh": ["mirelle", "vorn"],
  "fallen-king-ruins": ["kaelen", "nameless", "morgrath"]
};

/** The people the King asks after by name. */
export const KING_COMPANIONS: readonly string[] = ["kaelen", "brom", "eldra", "morgrath", "maelle"];

export const COMPANION_BY_ID: Record<string, CompanionName> = Object.fromEntries(COMPANIONS.map((entry) => [entry.id, entry]));

export function nameIn(named: Named, locale: Locale): string {
  return locale === "fr" ? named.fr : named.en;
}
