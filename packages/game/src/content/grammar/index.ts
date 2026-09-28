import type { Locale } from "../../i18n";
import { seededRng, type Rng } from "../../rng";
import type { LoreLine } from "../types";
import { EN_BIOMES, EN_KING, EN_SONGS, EN_STRATA } from "./lexicon-en";
import { FR_BIOMES, FR_KING, FR_SONGS, FR_STRATA } from "./lexicon-fr";
import { BIOME_COMPANIONS, COMPANIONS, COMPANION_BY_ID, KING_COMPANIONS, REMNANTS, type CompanionName, type RemnantName } from "./names";
import { EN_HELPERS, EN_TEMPLATES, FR_HELPERS, FR_TEMPLATES, type TemplateId } from "./templates";
import type { Helpers, Slots, Template, Voice } from "./types";

/**
 * The fragment grammar (BIBLE 17.3): past every pool written by hand, the Chronicle keeps
 * talking. A line is a pure function of its source: the same source gives the same line
 * forever, on the client and on the server, so the save only keeps counters.
 */
export type GrammarSource =
  | { kind: "king"; night: number }
  | { kind: "echo"; biome: string; index: number }
  | { kind: "age"; age: number; index: number }
  | { kind: "song"; index: number }
  | { kind: "dream"; index: number }
  | { kind: "reading"; era: number; descent: number };

const ERAS = 60;
const AGES = 12;
/** Dreams draw on Ages I to VII only: nothing of the Truth may surface in them. */
const DREAM_ERAS = 35;

const KING_POOL: readonly TemplateId[] = [
  "king-tonight",
  "king-left",
  "king-night",
  "king-nights",
  "king-mind",
  "king-stop",
  "king-again",
  "king-carry",
  "king-tell",
  "king-kept"
];
const ECHO_POOL: readonly TemplateId[] = [
  "ledger-nobody",
  "ledger-before",
  "ledger-once",
  "ledger-why",
  "companion-found",
  "companion-color",
  "companion-every",
  "remnant-then",
  "remnant-yet",
  "remnant-kept"
];
const AGE_POOL: readonly TemplateId[] = [
  "unknown-whoever",
  "unknown-next",
  "ledger-nobody",
  "ledger-before",
  "ledger-once",
  "ledger-two",
  "ledger-why",
  "oriane-tomorrow",
  "oriane-about"
];
/** Lysandre writes the notes of the first Ages; past the Titan he has not spoken since. */
const LYSANDRE_AGES = 3;
const AGE_POOL_EARLY: readonly TemplateId[] = ["lysandre-ornament", "lysandre-certain", ...AGE_POOL];
const SONG_POOL: readonly TemplateId[] = ["song-hummed", "song-listen", "song-tonight", "song-name", "song-taught"];
const DREAM_POOL: readonly TemplateId[] = ["dream-whose", "dream-hands", "dream-seven", "dream-table", "dream-calling"];
const READING_POOL: readonly TemplateId[] = ["reading-night", "reading-again", "reading-pass", "reading-slower"];

const VOICE_NAMES: Record<Exclude<Voice, "companion" | "remnant" | "none">, Record<Locale, string>> = {
  king: { en: "The King", fr: "Le Roi" },
  ledger: { en: "The Ledger", fr: "Le Grand Livre" },
  lysandre: { en: "Lysandre", fr: "Lysandre" },
  oriane: { en: "Oriane", fr: "Oriane" },
  celestine: { en: "Célestine", fr: "Célestine" },
  unknown: { en: "An unknown hand", fr: "Une main inconnue" }
};

/** FNV-1a: a stable 32-bit hash of a key. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function int(rng: Rng, count: number): number {
  return Math.min(count - 1, Math.floor(rng() * count));
}

function shuffled(seed: number, count: number): number[] {
  const rng = seededRng(seed);
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = int(rng, i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/**
 * The template of the n-th line of a source. Indices go by blocks as long as the pool: each
 * block uses every template once, in a seeded order, and a block never opens with the
 * template that closed the one before. Two consecutive lines never share a shape.
 */
function templateAt(key: string, n: number, pool: readonly TemplateId[]): TemplateId {
  const size = pool.length;
  const block = Math.floor(n / size);
  const order = shuffled(hash(`${key}#${block}`), size);
  if (block > 0) {
    // Only the first two places of a block are ever swapped, so the last one is the raw shuffle's.
    const previousLast = shuffled(hash(`${key}#${block - 1}`), size)[size - 1];
    if (order[0] === previousLast) [order[0], order[1]] = [order[1], order[0]];
  }
  return pool[order[n % size]];
}

/** Words of one line, drawn in the same order for both languages. */
interface Draw {
  lexicon: number;
  object: number;
  object2: number;
  place: number;
  verb: number;
  state: number;
  remnant: RemnantName;
  companion: CompanionName;
  sound: number;
  sound2: number;
}

interface Plan {
  key: string;
  n: number;
  pool: readonly TemplateId[];
  /** How many lexicons the source may use, and the first one. */
  lexicons: number;
  lexiconBase: number;
  remnants: readonly RemnantName[];
  companions: readonly CompanionName[];
  speakers: readonly CompanionName[];
  night: number;
  descent: number;
}

function plan(source: GrammarSource): Plan {
  const all = { remnants: REMNANTS, companions: COMPANIONS, speakers: COMPANIONS.filter((entry) => entry.speaks) };
  switch (source.kind) {
    case "king": {
      const night = Math.max(1, Math.floor(source.night));
      const companions = KING_COMPANIONS.map((id) => COMPANION_BY_ID[id]);
      return { key: "king", n: night, pool: KING_POOL, lexicons: 1, lexiconBase: 0, ...all, companions, night, descent: 0 };
    }
    case "echo": {
      const biome = Object.hasOwn(BIOME_COMPANIONS, source.biome) ? source.biome : "green-plains";
      const n = Math.max(0, Math.floor(source.index));
      const companions = BIOME_COMPANIONS[biome].map((id) => COMPANION_BY_ID[id]);
      return {
        key: `echo:${biome}`,
        n,
        pool: ECHO_POOL,
        lexicons: 1,
        lexiconBase: 0,
        remnants: REMNANTS.filter((entry) => entry.biome === biome),
        companions,
        speakers: companions.filter((entry) => entry.speaks),
        night: n,
        descent: 0
      };
    }
    case "age": {
      const age = Math.min(AGES - 1, Math.max(0, Math.floor(source.age)));
      const n = Math.max(0, Math.floor(source.index));
      const pool = age < LYSANDRE_AGES ? AGE_POOL_EARLY : AGE_POOL;
      return { key: `age:${age}`, n, pool, lexicons: 5, lexiconBase: age * 5, ...all, night: n, descent: 0 };
    }
    case "song": {
      const n = Math.max(0, Math.floor(source.index));
      return { key: "song", n, pool: SONG_POOL, lexicons: EN_SONGS.length, lexiconBase: 0, ...all, night: n, descent: 0 };
    }
    case "dream": {
      const n = Math.max(0, Math.floor(source.index));
      return { key: "dream", n, pool: DREAM_POOL, lexicons: DREAM_ERAS, lexiconBase: 0, ...all, night: n, descent: 0 };
    }
    case "reading": {
      const era = Math.min(ERAS - 1, Math.max(0, Math.floor(source.era)));
      const descent = Math.max(1, Math.floor(source.descent));
      return { key: `reading:${era}`, n: descent, pool: READING_POOL, lexicons: 1, lexiconBase: era, ...all, night: descent, descent };
    }
  }
}

function draw(p: Plan, sizes: { objects: number; places: number; verbs: number; states: number }, speaks: boolean): Draw {
  const rng = seededRng(hash(`${p.key}:${p.n}`));
  const lexicon = p.lexiconBase + int(rng, p.lexicons);
  const object = int(rng, sizes.objects);
  const object2 = (object + 1 + int(rng, sizes.objects - 1)) % sizes.objects;
  const place = int(rng, sizes.places);
  const verb = int(rng, sizes.verbs);
  const state = int(rng, sizes.states);
  const remnant = p.remnants[int(rng, p.remnants.length)];
  const who = int(rng, 64);
  const companions = speaks && p.speakers.length > 0 ? p.speakers : p.companions;
  const companion = companions[who % companions.length];
  const sound = int(rng, 4);
  const sound2 = (sound + 1 + int(rng, 3)) % 4;
  return { lexicon, object, object2, place, verb, state, remnant, companion, sound, sound2 };
}

interface Words<N, A> {
  objects: readonly N[];
  places: readonly N[];
  verbs: readonly string[];
  states: readonly A[];
  color: A;
  sounds: readonly string[];
}

interface Language<N, A> {
  templates: Record<TemplateId, Template<N, A>>;
  helpers: Helpers<N, A>;
  words: (source: GrammarSource, lexicon: number, state: number) => Words<N, A>;
}

const NO_SOUNDS = ["", "", "", ""] as const;

function languageWords<N, A>(
  strata: readonly { objects: readonly N[]; places: readonly N[]; verbs: readonly string[]; states: readonly A[]; color: A }[],
  biomes: Record<string, { objects: readonly N[]; places: readonly N[]; verbs: readonly string[]; states: readonly A[]; color: A }>,
  king: { objects: readonly N[]; places: readonly N[]; verbs: readonly string[]; states: readonly A[] },
  songs: readonly { objects: readonly N[]; places: readonly N[]; verbs: readonly string[]; states: readonly A[]; color: A; sounds: readonly string[] }[]
): Language<N, A>["words"] {
  return (source, lexicon, state) => {
    switch (source.kind) {
      case "king":
        return { ...king, color: king.states[state], sounds: NO_SOUNDS };
      case "echo":
        return { ...(Object.hasOwn(biomes, source.biome) ? biomes[source.biome] : biomes["green-plains"]), sounds: NO_SOUNDS };
      case "song":
        return songs[lexicon];
      default:
        return { ...strata[lexicon], sounds: NO_SOUNDS };
    }
  };
}

const LANGUAGES = {
  en: { templates: EN_TEMPLATES, helpers: EN_HELPERS, words: languageWords(EN_STRATA, EN_BIOMES, EN_KING, EN_SONGS) },
  fr: { templates: FR_TEMPLATES, helpers: FR_HELPERS, words: languageWords(FR_STRATA, FR_BIOMES, FR_KING, FR_SONGS) }
};

function sizesOf(source: GrammarSource) {
  if (source.kind === "king") return { objects: EN_KING.objects.length, places: EN_KING.places.length, verbs: EN_KING.verbs.length, states: EN_KING.states.length };
  return { objects: 4, places: 4, verbs: 4, states: 3 };
}

function render<N, A>(language: Language<N, A>, id: TemplateId, source: GrammarSource, p: Plan, d: Draw, locale: Locale): LoreLine {
  const template = language.templates[id];
  const words = language.words(source, d.lexicon, d.state);
  const slots: Slots<N, A> = {
    object: words.objects[d.object],
    object2: words.objects[d.object2],
    place: words.places[d.place],
    verb: words.verbs[d.verb],
    state: words.states[d.state],
    color: words.color,
    remnant: locale === "fr" ? d.remnant.fr : d.remnant.en,
    companion: locale === "fr" ? d.companion.fr : d.companion.en,
    night: p.night,
    descent: p.descent,
    sound: words.sounds[d.sound],
    sound2: words.sounds[d.sound2]
  };
  const text = template.line(slots, language.helpers);
  return { by: speaker(template.voice, d, slots, language.helpers, locale), text };
}

function speaker<N, A>(voice: Voice, d: Draw, slots: Slots<N, A>, helpers: Helpers<N, A>, locale: Locale): string {
  if (voice === "none") return "";
  if (voice === "companion") return locale === "fr" ? d.companion.byFr : d.companion.byEn;
  if (voice === "remnant") return helpers.cap(slots.remnant);
  return VOICE_NAMES[voice][locale];
}

/** The template a source uses (the same in every language). */
export function grammarTemplate(source: GrammarSource): TemplateId {
  const p = plan(source);
  return templateAt(p.key, p.n, p.pool);
}

/** A fragment past the written pools, for a source and a language. */
export function grammarLine(source: GrammarSource, locale: Locale): LoreLine {
  const p = plan(source);
  const id = templateAt(p.key, p.n, p.pool);
  const d = draw(p, sizesOf(source), EN_TEMPLATES[id].voice === "companion");
  return locale === "fr" ? render(LANGUAGES.fr, id, source, p, d, locale) : render(LANGUAGES.en, id, source, p, d, locale);
}
