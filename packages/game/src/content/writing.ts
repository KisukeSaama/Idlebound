/**
 * The writing rules of BIBLE 20 as the tests check them: the words of the Truth, in every
 * form, never before Age VIII; no em or en dash; no emoji, in either language.
 */
export const FORBIDDEN_WORDS =
  /(?<![\p{L}\p{N}_])(dreams?|dreamers?|dreamed|dreamt|dreaming|players?|screens?|tabs?|clicks?|clicked|clicking|saves?|saved|saving|rêves?|rêver|rêveurs?|rêveuses?|rêvée?s?|rêvait|joueurs?|joueuses?|écrans?|onglets?|clics?|cliquer|cliques?|cliqué|cliquez|sauvegardes?|sauvegarder|sauvegardée?s?)(?![\p{L}\p{N}_])/iu;

export const DASH = /[‒–—―]/;

/** Pictographs, but not the copyright and trademark signs of the legal footer. */
export const EMOJI = /(?![©®™])\p{Extended_Pictographic}/u;
