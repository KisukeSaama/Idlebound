/**
 * The fragment grammar (BIBLE 17.3): past the lines written by hand, the Chronicle keeps
 * talking with sentences built from templates and lexicons. Templates are written per
 * language, never translated at runtime; French words carry their gender and number.
 */

/** A French noun without its article: `s` the word, `g` its gender, `p` plural, `e` elided ("l'arbre"). */
export interface FrNoun {
  s: string;
  g: "m" | "f";
  p?: boolean;
  e?: boolean;
  /** Mass noun: "du sel", never "un sel". */
  mass?: boolean;
  /** Preposition that puts something inside this place when it is not "dans": "sur", "à". */
  in?: string;
}

/** An English noun without its article: `p` plural, `an` takes "an". */
export interface EnNoun {
  s: string;
  p?: boolean;
  an?: boolean;
  /** Mass noun: "salt", never "a salt". */
  mass?: boolean;
  /** Preposition that puts something inside this place when it is not "in": "on", "at". */
  in?: string;
}

/** A French adjective: masculine singular, and the other forms when they are not the regular +e, +s. */
export interface FrAdj {
  m: string;
  f?: string;
  mp?: string;
  fp?: string;
}

/**
 * Sixteen words: four objects, four places, four deeds (EN simple past "screamed", FR passé
 * composé third person singular "a crié"), three states (adjectives) and one color.
 */
export interface Lexicon<N, A> {
  objects: readonly [N, N, N, N];
  places: readonly [N, N, N, N];
  verbs: readonly [string, string, string, string];
  states: readonly [A, A, A];
  color: A;
}

/**
 * The King's own words (40): what he kept, where he sat, what he did, how he is. Only his
 * voice uses them.
 */
export interface KingLexicon<N, A> {
  objects: readonly N[];
  places: readonly N[];
  verbs: readonly string[];
  states: readonly A[];
}

/** Célestine's lexicon: a stratum-shaped lexicon of what sings, and four sound words. */
export type SongLexicon<N, A> = Lexicon<N, A> & { sounds: readonly [string, string, string, string] };

export type EnLexicon = Lexicon<EnNoun, string>;
export type FrLexicon = Lexicon<FrNoun, FrAdj>;

/** Who speaks a generated line; `none` for what stays after an absence (nobody speaks). */
export type Voice = "king" | "ledger" | "lysandre" | "oriane" | "celestine" | "unknown" | "companion" | "remnant" | "none";

/** What a template may use. `remnant` and `companion` are names already in the language. */
export interface Slots<N, A> {
  object: N;
  object2: N;
  place: N;
  verb: string;
  state: A;
  color: A;
  remnant: string;
  companion: string;
  /** The night's number, for templates that count. */
  night: number;
  /** The Descent of a second reading (1, 2, 3...), 0 elsewhere. */
  descent: number;
  /** Two sound words for Célestine's songs ("ting", "hmm"). */
  sound: string;
  sound2: string;
}

/** Article and agreement helpers of a language. */
export interface Helpers<N, A> {
  /** "a lantern", "une lanterne", "des lanternes". */
  a: (noun: N) => string;
  /** "the lantern", "la lanterne", "l'arbre", "les lanternes". */
  the: (noun: N) => string;
  /** The noun alone. */
  bare: (noun: N) => string;
  /** An adjective agreeing with a noun ("froide" with "lanterne"). */
  agree: (adjective: A, noun: N) => string;
  /** The pronoun of a noun as a subject: It / They, Il / Elle / Ils / Elles. */
  it: (noun: N) => string;
  /** First letter in capital. */
  cap: (text: string) => string;
  /** The same pronoun, lower case, for the middle of a sentence. */
  pron: (noun: N) => string;
  /** The pronoun as an object: it / them, le / la / les. */
  them: (noun: N) => string;
  /** "is" / "are", "est" / "sont". */
  is: (noun: N) => string;
  /** "was" / "were", "était" / "étaient". */
  was: (noun: N) => string;
  /** Inside a place: "in the barn", "on the road", "dans la grange", "au bord". */
  in: (place: N) => string;
  /** With a preposition "à": "to the key", "à la clé", "au manteau", "aux bottes" (EN: the bare article). */
  at: (noun: N) => string;
  /** A deed said by its doer ("I screamed", "j'ai crié"). */
  first: (deed: string) => string;
  /** A deed agreeing with a noun as its subject ("a tinté", "ont tinté"). */
  does: (noun: N, deed: string) => string;
}

export interface Template<N, A> {
  voice: Voice;
  line: (slots: Slots<N, A>, h: Helpers<N, A>) => string;
}
