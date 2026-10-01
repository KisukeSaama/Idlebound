import { frAdj } from "./parse";
import type { EnNoun, FrAdj, FrNoun, Helpers, Template } from "./types";

/**
 * The sentence shapes of the grammar (BIBLE 17.3), one set per language. The same id is the
 * same beat in both languages, so a walker who switches language finds the same fragment;
 * the words around the slots are written for each language, not translated.
 */
export type TemplateId =
  | "king-tonight"
  | "king-left"
  | "king-night"
  | "king-nights"
  | "king-mind"
  | "king-stop"
  | "king-again"
  | "king-carry"
  | "king-tell"
  | "king-kept"
  | "ledger-nobody"
  | "ledger-before"
  | "ledger-once"
  | "ledger-two"
  | "ledger-why"
  | "companion-found"
  | "companion-color"
  | "companion-every"
  | "remnant-then"
  | "remnant-yet"
  | "remnant-kept"
  | "lysandre-ornament"
  | "lysandre-certain"
  | "unknown-whoever"
  | "unknown-next"
  | "oriane-tomorrow"
  | "oriane-about"
  | "song-hummed"
  | "song-listen"
  | "song-tonight"
  | "song-name"
  | "song-taught"
  | "dream-whose"
  | "dream-hands"
  | "dream-seven"
  | "dream-table"
  | "dream-calling"
  | "reading-night"
  | "reading-again"
  | "reading-pass"
  | "reading-slower";

// ---------------------------------------------------------------------------------------
// English

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const EN_HELPERS: Helpers<EnNoun, string> = {
  a: (n) => (n.mass || n.p ? n.s : `${n.an ? "an" : "a"} ${n.s}`),
  the: (n) => `the ${n.s}`,
  bare: (n) => n.s,
  agree: (adjective) => adjective,
  it: (n) => (n.p ? "They" : "It"),
  cap,
  pron: (n) => (n.p ? "they" : "it"),
  them: (n) => (n.p ? "them" : "it"),
  is: (n) => (n.p ? "are" : "is"),
  was: (n) => (n.p ? "were" : "was"),
  in: (n) => `${n.in ?? "in"} the ${n.s}`,
  at: (n) => `the ${n.s}`,
  first: (deed) => `I ${deed}`,
  does: (_n, deed) => deed
};

const EN_ORDINALS = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];

function enOrdinal(n: number): string {
  if (n < EN_ORDINALS.length) return EN_ORDINALS[n];
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
}

/** Roman numerals, as the scene header writes the nights of the Descent ("Night II"). */
export function roman(n: number): string {
  const table: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let rest = Math.max(1, Math.floor(n));
  let out = "";
  for (const [value, letters] of table) {
    while (rest >= value) {
      out += letters;
      rest -= value;
    }
  }
  return out;
}

type EnT = Template<EnNoun, string>;

export const EN_TEMPLATES: Record<TemplateId, EnT> = {
  // The King: short, plain, tired, kind. Never a joke.
  "king-tonight": { voice: "king", line: (s, h) => `${h.cap(h.the(s.object))} ${h.is(s.object)} ${s.state} tonight. Walk anyway.` },
  "king-left": { voice: "king", line: (s, h) => `I left ${h.a(s.object)} ${h.in(s.place)}. Leave ${h.them(s.object)} there.` },
  "king-night": { voice: "king", line: (s) => `Night ${s.night}. I ${s.verb} while you walked the road to me.` },
  "king-nights": { voice: "king", line: (s, h) => `${s.night} nights, and ${h.the(s.object)} ${h.is(s.object)} no lighter.` },
  "king-mind": { voice: "king", line: (s, h) => `Mind ${h.the(s.object)}. ${h.it(s.object)} ${h.was(s.object)} my father's.` },
  "king-stop": { voice: "king", line: (s, h) => `I rested ${h.in(s.place)}, once, and nearly never got up. Walk past it.` },
  "king-again": { voice: "king", line: (s, h) => `Again, then. ${h.cap(h.the(s.object))} ${h.is(s.object)} ${s.state}, and so am I.` },
  "king-carry": { voice: "king", line: (s) => `You carry my ${s.object.s} better than I did.` },
  "king-tell": { voice: "king", line: (s, h) => `Tell ${s.companion} I kept ${h.the(s.object)}.` },
  "king-kept": { voice: "king", line: (s, h) => `There ${h.is(s.object)} ${h.a(s.object)} for you ${h.in(s.place)}. I kept ${h.them(s.object)} warm.` },

  // The Ledger: exact, third person, faintly kind.
  "ledger-nobody": {
    voice: "ledger",
    line: (s, h) => `${h.cap(h.in(s.place))}, ${h.a(s.object)}. ${h.it(s.object)} ${h.was(s.object)} ${s.state}. Nobody came back for ${h.them(s.object)}.`
  },
  "ledger-before": { voice: "ledger", line: (s, h) => `${h.cap(s.remnant)} ${s.verb} ${h.in(s.place)}, a moment before you arrived.` },
  "ledger-once": {
    voice: "ledger",
    line: (s, h) => `${h.cap(h.the(s.object))} ${h.in(s.place)} ${h.was(s.object)} ${s.color} once. Now ${h.pron(s.object)} ${h.is(s.object)} ${s.state}.`
  },
  "ledger-two": { voice: "ledger", line: (s, h) => `Two things remain ${h.in(s.place)}: ${h.a(s.object)} and ${h.a(s.object2)}. Both are ${s.state}.` },
  "ledger-why": { voice: "ledger", line: (s, h) => `${h.cap(s.companion)} ${s.verb} ${h.in(s.place)}, and did not say why.` },

  // A companion of the place, in their own words.
  "companion-found": {
    voice: "companion",
    line: (s, h) => `I found ${h.a(s.object)} ${h.in(s.place)}. ${h.it(s.object)} ${h.was(s.object)} ${s.state}. I put ${h.them(s.object)} back.`
  },
  "companion-color": {
    voice: "companion",
    line: (s, h) => `${h.cap(h.the(s.object))} ${h.is(s.object)} ${s.color} here. ${h.it(s.object)} ${h.was(s.object)} not, the night before.`
  },
  "companion-every": { voice: "companion", line: (s) => `Last night, ${s.remnant} ${s.verb}. The night before, too: every night repeats. I act as if it were new.` },

  // A Remnant, remembering out loud.
  "remnant-then": {
    voice: "remnant",
    line: (s, h) => `${h.cap(h.a(s.object))}, then ${h.a(s.object2)}, then you. Every night I remember the same things, in the same order.`
  },
  "remnant-yet": { voice: "remnant", line: (s, h) => `${h.first(s.verb)} ${h.in(s.place)}, as I do every night. You always arrive just after.` },
  "remnant-kept": { voice: "remnant", line: (s, h) => `You again. I kept ${h.the(s.object)} for you. Do not touch ${h.them(s.object)}.` },

  // Lysandre's notes: confident, footnoted, wrong.
  "lysandre-ornament": {
    voice: "lysandre",
    line: (s, h) => `${h.cap(h.a(s.object))}, ${s.color}, found ${h.in(s.place)}. Ornamental, obviously. See my notes on ${h.the(s.object2)}.`
  },
  "lysandre-certain": {
    voice: "lysandre",
    line: (s, h) => `Note: ${h.the(s.object)} ${h.is(s.object)} ${s.state} because ${h.pron(s.object)} ${h.is(s.object)} ${s.color}. I am certain. I am always certain.`
  },

  // An unknown hand, written for whoever comes next.
  "unknown-whoever": {
    voice: "unknown",
    line: (s, h) => `Whoever finds ${h.the(s.object)}: ${h.pron(s.object)} ${h.was(s.object)} ${s.color}, once. Remember ${h.them(s.object)} that way.`
  },
  "unknown-next": { voice: "unknown", line: (s, h) => `I walked this road before you, and left ${h.a(s.object)} ${h.in(s.place)} for whoever came next. That is you.` },

  // Oriane: present tense, certainties.
  "oriane-tomorrow": {
    voice: "oriane",
    line: (s, h) => `${h.cap(h.the(s.object))} ${h.is(s.object)} ${s.state}. I can already hear tomorrow night: ${h.pron(s.object)} will still be ${s.state}.`
  },
  "oriane-about": {
    voice: "oriane",
    line: (s, h) => `You are about to find ${h.a(s.object)} ${h.in(s.place)}. Leave ${h.them(s.object)}. You won't. You never do.`
  },

  // Célestine's songs: sound words, soft.
  "song-hummed": { voice: "celestine", line: (s, h) => `${s.sound}, ${s.sound}. ${h.the(s.object)} ${s.verb} ${h.in(s.place)}. i hummed back.` },
  "song-listen": { voice: "celestine", line: (s, h) => `listen. ${h.the(s.object)} ${h.is(s.object)} ${s.state} tonight. ${s.sound}. that means you're here.` },
  "song-tonight": { voice: "celestine", line: (s) => `the crystals are ${s.color} tonight. their song is ${s.state}. ${s.sound}, ${s.sound2}, ${s.sound}.` },
  "song-name": {
    voice: "celestine",
    line: (s, h) => `shh. ${h.the(s.object)} ${h.is(s.object)} singing your name. ${s.sound}, ${s.sound2}. that's the whole song.`
  },
  "song-taught": {
    voice: "celestine",
    line: (s, h) => `i taught ${h.the(s.object)} a new note. ${h.pron(s.object)} ${s.verb}. i think ${h.pron(s.object)} liked it.`
  },

  // What stays after an absence: nobody speaks. Second person, past, one image.
  "dream-whose": {
    voice: "none",
    line: (s, h) => `While you were away, you were back ${h.in(s.place)}. There ${h.was(s.object)} ${h.a(s.object)}, and you knew whose ${h.pron(s.object)} ${h.was(s.object)}.`
  },
  "dream-hands": {
    voice: "none",
    line: (s, h) => `While you were away, you walked through ${h.the(s.place)} with ${h.a(s.object)} in your hands. ${h.it(s.object)} ${h.was(s.object)} ${s.state}.`
  },
  "dream-seven": { voice: "none", line: (s, h) => `While you were away, you were seven, and ${h.the(s.place)} ${h.was(s.place)} very big. Somewhere, someone ${s.verb}.` },
  "dream-table": {
    voice: "none",
    line: (s, h) => `While you were away, you saw ${h.a(s.object)} on a table, and ${h.a(s.object2)} beside ${h.them(s.object)}. You did not touch them.`
  },
  "dream-calling": {
    voice: "none",
    line: (s, h) => `While you were away, someone called you from ${h.the(s.place)}. You followed. It was only ${h.a(s.object)}, ${s.state}.`
  },

  // Second readings of a keystone: again, deeper.
  "reading-night": {
    voice: "ledger",
    line: (s, h) => `Night ${roman(s.descent + 1)}, one thread deeper. ${h.cap(h.the(s.place))} again, and ${h.a(s.object)} where there was nothing before.`
  },
  "reading-again": {
    voice: "unknown",
    line: (s, h) => `Seen again, one thread deeper: ${h.the(s.object)} ${h.was(s.object)} never ${s.color}. ${h.it(s.object)} ${h.was(s.object)} ${s.state} all along.`
  },
  "reading-pass": {
    voice: "oriane",
    line: (s, h) =>
      `${h.cap(h.in(s.place))}, for the ${enOrdinal(s.descent + 1)} time. ${h.cap(h.the(s.object))} ${h.is(s.object)} still there. ${h.it(s.object)} ${h.is(s.object)} ${s.state} now.`
  },
  "reading-slower": { voice: "ledger", line: (s, h) => `Again, deeper. ${h.cap(s.remnant)} ${s.verb} ${h.in(s.place)}, as it did the first time, only slower.` }
};

// ---------------------------------------------------------------------------------------
// French

const form = (adjective: FrAdj, n: Pick<FrNoun, "g" | "p">): string =>
  n.p ? (n.g === "f" ? (adjective.fp ?? `${adjective.f ?? adjective.m}s`) : (adjective.mp ?? `${adjective.m}s`)) : n.g === "f" ? (adjective.f ?? `${adjective.m}e`) : adjective.m;

const frThe = (n: FrNoun) => (n.p ? `les ${n.s}` : n.e ? `l'${n.s}` : n.g === "m" ? `le ${n.s}` : `la ${n.s}`);
const frAt = (n: FrNoun) => (n.p ? `aux ${n.s}` : n.e ? `à l'${n.s}` : n.g === "m" ? `au ${n.s}` : `à la ${n.s}`);
const frOf = (n: FrNoun) => (n.p ? `des ${n.s}` : n.e ? `de l'${n.s}` : n.g === "m" ? `du ${n.s}` : `de la ${n.s}`);

export const FR_HELPERS: Helpers<FrNoun, FrAdj> = {
  a: (n) => (n.mass ? frOf(n) : n.p ? `des ${n.s}` : n.g === "m" ? `un ${n.s}` : `une ${n.s}`),
  the: frThe,
  bare: (n) => n.s,
  agree: form,
  it: (n) => (n.g === "f" ? (n.p ? "Elles" : "Elle") : n.p ? "Ils" : "Il"),
  cap,
  pron: (n) => (n.g === "f" ? (n.p ? "elles" : "elle") : n.p ? "ils" : "il"),
  them: (n) => (n.p ? "les" : n.g === "f" ? "la" : "le"),
  is: (n) => (n.p ? "sont" : "est"),
  was: (n) => (n.p ? "étaient" : "était"),
  in: (n) => {
    const preposition = n.in ?? "dans";
    if (preposition === "à") return frAt(n);
    if (preposition === "de") return frOf(n);
    return `${preposition} ${frThe(n)}`;
  },
  at: frAt,
  first: (deed) => `j'ai ${deed.slice(2)}`,
  does: (n, deed) => (n.p ? `ont ${deed.slice(2)}` : deed)
};

const REMIS = frAdj("remis");
const FOUND = frAdj("trouvé");
const ORNAMENTAL = frAdj("décoratif/décorative");
const HUGE = frAdj("immense");
const LIGHT = frAdj("léger/légère");
const KEPT = frAdj("gardé");

const FR_ORDINALS = ["", "première", "deuxième", "troisième", "quatrième", "cinquième", "sixième", "septième", "huitième", "neuvième", "dixième"];
const frOrdinal = (n: number) => (n < FR_ORDINALS.length ? FR_ORDINALS[n] : `${n}e`);

/** "mon épée", "ma couronne", "mes bottes". */
const my = (n: FrNoun) => `${n.p ? "mes" : n.g === "f" && !n.e ? "ma" : "mon"} ${n.s}`;
/** Two nouns together: feminine only when both are. */
const pair = (a: FrNoun, b: FrNoun): Pick<FrNoun, "g" | "p"> => ({ g: a.g === "f" && b.g === "f" ? "f" : "m", p: true });
/** "qu'une lanterne", "que des cloches", "que du sel". */
const onlyA = (n: FrNoun, h: Helpers<FrNoun, FrAdj>) => {
  const noun = h.a(n);
  return /^[aeiouyéèêàâîïôœ]/i.test(noun) ? `qu'${noun}` : `que ${noun}`;
};

type FrT = Template<FrNoun, FrAdj>;

export const FR_TEMPLATES: Record<TemplateId, FrT> = {
  "king-tonight": { voice: "king", line: (s, h) => `${h.cap(h.the(s.object))} ${h.is(s.object)} ${h.agree(s.state, s.object)} ce soir. Marche quand même.` },
  "king-left": { voice: "king", line: (s, h) => `J'ai laissé ${h.a(s.object)} ${h.in(s.place)}. Laisse-${h.them(s.object)} là.` },
  "king-night": { voice: "king", line: (s, h) => `Nuit ${s.night}. ${h.cap(s.verb)} pendant que tu marchais vers moi.` },
  "king-nights": {
    voice: "king",
    line: (s, h) => `${s.night} nuits, et ${h.the(s.object)} ${s.object.p ? "ne sont" : "n'est"} pas plus ${form(LIGHT, s.object)}.`
  },
  "king-mind": { voice: "king", line: (s, h) => `Attention ${h.at(s.object)}. ${h.it(s.object)} ${h.was(s.object)} à mon père.` },
  "king-stop": { voice: "king", line: (s, h) => `Je me suis reposé ${h.in(s.place)}, une fois, et j'ai failli ne jamais me relever. Passe sans t'arrêter.` },
  "king-again": { voice: "king", line: (s, h) => `Encore, donc. ${h.cap(h.the(s.object))} ${h.is(s.object)} ${h.agree(s.state, s.object)}, et moi aussi.` },
  "king-carry": { voice: "king", line: (s) => `Tu portes ${my(s.object)} mieux que moi.` },
  "king-tell": { voice: "king", line: (s, h) => `Dis à ${s.companion} que j'ai gardé ${h.the(s.object)}.` },
  "king-kept": {
    voice: "king",
    line: (s, h) => `Il y a ${h.a(s.object)} pour toi ${h.in(s.place)}. Je ${s.object.p ? "les ai" : "l'ai"} ${form(KEPT, s.object)} au chaud.`
  },

  "ledger-nobody": {
    voice: "ledger",
    line: (s, h) =>
      `${h.cap(h.in(s.place))}, ${h.a(s.object)}. ${h.it(s.object)} ${h.was(s.object)} ${h.agree(s.state, s.object)}. Personne n'est revenu ${h.them(s.object)} chercher.`
  },
  "ledger-before": { voice: "ledger", line: (s, h) => `${h.cap(s.remnant)} ${s.verb} ${h.in(s.place)}, un instant avant ton arrivée.` },
  "ledger-once": {
    voice: "ledger",
    line: (s, h) =>
      `${h.cap(h.the(s.object))} ${h.in(s.place)} ${h.was(s.object)} ${h.agree(s.color, s.object)}, autrefois. ${h.it(s.object)} ${h.is(s.object)} ${h.agree(s.state, s.object)}, maintenant.`
  },
  "ledger-two": {
    voice: "ledger",
    line: (s, h) => `Il reste deux choses ${h.in(s.place)} : ${h.a(s.object)} et ${h.a(s.object2)}. Les deux sont ${form(s.state, pair(s.object, s.object2))}.`
  },
  "ledger-why": { voice: "ledger", line: (s, h) => `${h.cap(s.companion)} ${s.verb} ${h.in(s.place)}, sans dire pourquoi.` },

  "companion-found": {
    voice: "companion",
    line: (s, h) =>
      `J'ai trouvé ${h.a(s.object)} ${h.in(s.place)}. ${h.it(s.object)} ${h.was(s.object)} ${h.agree(s.state, s.object)}. Je ${s.object.p ? "les ai" : "l'ai"} ${form(REMIS, s.object)} en place.`
  },
  "companion-color": {
    voice: "companion",
    line: (s, h) => `Ici, ${h.the(s.object)} ${h.is(s.object)} ${h.agree(s.color, s.object)}. ${h.it(s.object)} ne l'${h.was(s.object)} pas, la nuit d'avant.`
  },
  "companion-every": { voice: "companion", line: (s) => `Hier soir, ${s.remnant} ${s.verb}. La veille aussi : chaque nuit recommence. Je fais comme si c'était nouveau.` },

  "remnant-then": { voice: "remnant", line: (s, h) => `${h.cap(h.a(s.object))}, puis ${h.a(s.object2)}, puis toi. Chaque nuit, je me souviens des mêmes choses, dans le même ordre.` },
  "remnant-yet": { voice: "remnant", line: (s, h) => `${h.cap(h.first(s.verb))} ${h.in(s.place)}, comme chaque nuit. Tu arrives toujours juste après.` },
  "remnant-kept": { voice: "remnant", line: (s, h) => `Encore toi. Je t'ai gardé ${h.the(s.object)}. N'y touche pas.` },

  "lysandre-ornament": {
    voice: "lysandre",
    line: (s, h) =>
      `${h.cap(h.a(s.object))}, ${h.agree(s.color, s.object)}, ${form(FOUND, s.object)} ${h.in(s.place)}. ${h.cap(form(ORNAMENTAL, s.object))}, évidemment. Voir mes notes sur ${h.the(s.object2)}.`
  },
  "lysandre-certain": {
    voice: "lysandre",
    line: (s, h) =>
      `Note : ${h.the(s.object)} ${h.is(s.object)} ${h.agree(s.state, s.object)} parce qu'${h.pron(s.object)} ${h.is(s.object)} ${h.agree(s.color, s.object)}. J'en suis sûr. J'en suis toujours sûr.`
  },

  "unknown-whoever": {
    voice: "unknown",
    line: (s, h) => `À qui trouvera ${h.the(s.object)} : ${h.pron(s.object)} ${h.was(s.object)} ${h.agree(s.color, s.object)}, avant. Souviens-t'en comme ça.`
  },
  "unknown-next": { voice: "unknown", line: (s, h) => `J'ai marché cette route avant toi, et laissé ${h.a(s.object)} ${h.in(s.place)} pour le suivant. Le suivant, c'est toi.` },

  "oriane-tomorrow": {
    voice: "oriane",
    line: (s, h) => `${h.cap(h.the(s.object))} ${h.is(s.object)} ${h.agree(s.state, s.object)}. J'entends déjà la nuit de demain : ${h.pron(s.object)} le ${s.object.p ? "seront" : "sera"} encore.`
  },
  "oriane-about": {
    voice: "oriane",
    line: (s, h) => `Tu vas trouver ${h.a(s.object)} ${h.in(s.place)}. Laisse-${h.them(s.object)}. Tu ne le feras pas. Tu ne le fais jamais.`
  },

  "song-hummed": {
    voice: "celestine",
    line: (s, h) => `${s.sound}, ${s.sound}. ${h.the(s.object)} ${h.does(s.object, s.verb)} ${h.in(s.place)}. j'ai répondu tout bas.`
  },
  "song-listen": {
    voice: "celestine",
    line: (s, h) => `écoute. ${h.the(s.object)} ${h.is(s.object)} ${h.agree(s.state, s.object)} ce soir. ${s.sound}. ça veut dire que tu es là.`
  },
  "song-tonight": {
    voice: "celestine",
    line: (s) => `les cristaux sont ${form(s.color, { g: "m", p: true })} ce soir. leur chanson est ${form(s.state, { g: "f" })}. ${s.sound}, ${s.sound2}, ${s.sound}.`
  },
  "song-name": {
    voice: "celestine",
    line: (s, h) => `chut. ${h.the(s.object)} ${s.object.p ? "chantent" : "chante"} ton nom. ${s.sound}, ${s.sound2}. c'est toute la chanson.`
  },
  "song-taught": {
    voice: "celestine",
    line: (s, h) => `j'ai appris une nouvelle note ${h.at(s.object)}. ${h.pron(s.object)} ${h.does(s.object, s.verb)}. je crois que ça ${s.object.p ? "leur" : "lui"} a plu.`
  },

  "dream-whose": { voice: "none", line: (s, h) => `Pendant ton absence, tu étais de retour ${h.in(s.place)}. Il y avait ${h.a(s.object)}, et tu savais à qui c'était.` },
  "dream-hands": {
    voice: "none",
    line: (s, h) => `Pendant ton absence, tu traversais ${h.the(s.place)}, ${h.a(s.object)} dans les mains. ${h.it(s.object)} ${h.was(s.object)} ${h.agree(s.state, s.object)}.`
  },
  "dream-seven": {
    voice: "none",
    line: (s, h) => `Pendant ton absence, tu avais sept ans, et ${h.the(s.place)} ${h.was(s.place)} ${form(HUGE, s.place)}. Quelque part, quelqu'un ${s.verb}.`
  },
  "dream-table": { voice: "none", line: (s, h) => `Pendant ton absence, tu as vu ${h.a(s.object)} sur une table, et ${h.a(s.object2)} à côté. Tu n'y as pas touché.` },
  "dream-calling": {
    voice: "none",
    line: (s, h) => `Pendant ton absence, quelqu'un t'appelait depuis ${h.the(s.place)}. Tu as suivi la voix. Ce n'était ${onlyA(s.object, h)} ${h.agree(s.state, s.object)}.`
  },

  "reading-night": {
    voice: "ledger",
    line: (s, h) => `Nuit ${roman(s.descent + 1)}, un fil plus bas. ${h.cap(h.the(s.place))}, encore, et ${h.a(s.object)} là où il n'y avait rien.`
  },
  "reading-again": {
    voice: "unknown",
    line: (s, h) => `Revu un fil plus bas : ${h.the(s.object)} n'${h.was(s.object)} jamais ${h.agree(s.color, s.object)}. ${h.it(s.object)} ${h.was(s.object)} ${h.agree(s.state, s.object)}, depuis toujours.`
  },
  "reading-pass": {
    voice: "oriane",
    line: (s, h) =>
      `${h.cap(h.in(s.place))}, pour la ${frOrdinal(s.descent + 1)} fois. ${h.cap(h.the(s.object))} y ${h.is(s.object)} encore. ${h.it(s.object)} ${h.is(s.object)} ${h.agree(s.state, s.object)}, maintenant.`
  },
  "reading-slower": { voice: "ledger", line: (s, h) => `Encore, plus bas. ${h.cap(s.remnant)} ${s.verb} ${h.in(s.place)}, comme la première fois, en plus lent.` }
};
