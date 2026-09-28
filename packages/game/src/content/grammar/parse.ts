import type { EnLexicon, EnNoun, FrAdj, FrLexicon, FrNoun, KingLexicon } from "./types";

/**
 * Compact notation for the lexicons, so sixty strata stay readable as data.
 *
 * English noun: `[prep@]word[#flags]`; flags `p` plural, `a` takes "an", `n` takes "a",
 * `m` mass noun. "on@road", "vaults#p", "salt#m".
 *
 * French noun: `[prep@]word:g[flags]`; `g` is m or f, flags `p` plural, `e` elided (for
 * an h muet), `n` never elided, `M` mass noun. "sur@route:f", "caveaux:mp", "herbe:fe".
 * A word starting with a vowel is elided on its own.
 *
 * French adjective: `m[/f[/mp[/fp]]]`, the missing forms regular; a trailing `=` makes it
 * invariable ("bleu pâle=").
 */

const FR_VOWEL = /^[aeiouyàâäéèêëîïôöùûüœæ]/i;
const EN_VOWEL = /^[aeiou]/i;

export function enNoun(spec: string): EnNoun {
  const [head, flags = ""] = spec.split("#");
  const at = head.indexOf("@");
  const noun: EnNoun = { s: at >= 0 ? head.slice(at + 1) : head };
  if (at >= 0) noun.in = head.slice(0, at);
  if (flags.includes("p")) noun.p = true;
  if (flags.includes("m")) noun.mass = true;
  noun.an = flags.includes("a") || (!flags.includes("n") && EN_VOWEL.test(noun.s));
  return noun;
}

export function frNoun(spec: string): FrNoun {
  const colon = spec.lastIndexOf(":");
  if (colon < 0) throw new Error(`French noun without gender: ${spec}`);
  const head = spec.slice(0, colon);
  const tail = spec.slice(colon + 1);
  const at = head.indexOf("@");
  const g = tail[0];
  if (g !== "m" && g !== "f") throw new Error(`French noun with a bad gender: ${spec}`);
  const noun: FrNoun = { s: at >= 0 ? head.slice(at + 1) : head, g };
  if (at >= 0) noun.in = head.slice(0, at);
  const flags = tail.slice(1);
  if (flags.includes("p")) noun.p = true;
  if (flags.includes("M")) noun.mass = true;
  noun.e = flags.includes("e") || (!flags.includes("n") && FR_VOWEL.test(noun.s));
  return noun;
}

export function frAdj(spec: string): FrAdj {
  if (spec.endsWith("=")) {
    const word = spec.slice(0, -1);
    return { m: word, f: word, mp: word, fp: word };
  }
  const [m, f, mp, fp] = spec.split("/");
  const fem = f ?? (m.endsWith("e") ? m : `${m}e`);
  return { m, f: fem, mp: mp ?? (/[sx]$/.test(m) ? m : `${m}s`), fp: fp ?? (fem.endsWith("s") ? fem : `${fem}s`) };
}

function split(list: string, count: number, what: string): string[] {
  const words = list.split("|").map((word) => word.trim());
  if (words.length !== count) throw new Error(`Expected ${count} ${what}, got ${words.length}: ${list}`);
  return words;
}

type Four<T> = readonly [T, T, T, T];
type Three<T> = readonly [T, T, T];

/** One English stratum or biome: "objects", "places", "deeds", "states", "color". */
export function en(objects: string, places: string, verbs: string, states: string, color: string): EnLexicon {
  return {
    objects: split(objects, 4, "objects").map(enNoun) as unknown as Four<EnNoun>,
    places: split(places, 4, "places").map(enNoun) as unknown as Four<EnNoun>,
    verbs: split(verbs, 4, "deeds") as unknown as Four<string>,
    states: split(states, 3, "states") as unknown as Three<string>,
    color
  };
}

/** One French stratum or biome, same order. Every deed starts with "a " (passé composé with avoir). */
export function fr(objects: string, places: string, verbs: string, states: string, color: string): FrLexicon {
  const deeds = split(verbs, 4, "deeds");
  for (const deed of deeds) if (!deed.startsWith("a ")) throw new Error(`French deed must use avoir: ${deed}`);
  return {
    objects: split(objects, 4, "objects").map(frNoun) as unknown as Four<FrNoun>,
    places: split(places, 4, "places").map(frNoun) as unknown as Four<FrNoun>,
    verbs: deeds as unknown as Four<string>,
    states: split(states, 3, "states").map(frAdj) as unknown as Three<FrAdj>,
    color: frAdj(color)
  };
}

export function enKing(objects: string, places: string, verbs: string, states: string): KingLexicon<EnNoun, string> {
  return {
    objects: split(objects, 10, "objects").map(enNoun),
    places: split(places, 10, "places").map(enNoun),
    verbs: split(verbs, 10, "deeds"),
    states: split(states, 10, "states")
  };
}

export function frKing(objects: string, places: string, verbs: string, states: string): KingLexicon<FrNoun, FrAdj> {
  return {
    objects: split(objects, 10, "objects").map(frNoun),
    places: split(places, 10, "places").map(frNoun),
    verbs: split(verbs, 10, "deeds"),
    states: split(states, 10, "states").map(frAdj)
  };
}
