import { describe, expect, it } from "vitest";
import { LOCALES, type Locale } from "../../i18n";
import { grammarLine, grammarTemplate, type GrammarSource } from "./index";
import { EN_BIOMES, EN_KING, EN_SONGS, EN_STRATA } from "./lexicon-en";
import { FR_BIOMES, FR_KING, FR_SONGS, FR_STRATA } from "./lexicon-fr";
import { BIOME_COMPANIONS, COMPANION_BY_ID, REMNANTS } from "./names";
import { EN_TEMPLATES, FR_TEMPLATES, type TemplateId } from "./templates";

const BIOME_IDS = ["green-plains", "dark-forest", "forgotten-caves", "corrupted-marsh", "fallen-king-ruins"];
/** The words of the Truth, in every form (BIBLE 20). */
const FORBIDDEN =
  /(?<![\p{L}])(dreams?|dreamers?|dreamed|dreamt|dreaming|players?|screens?|tabs?|clicks?|clicked|clicking|saves?|saved|saving|rêves?|rêver|rêveurs?|rêveuses?|rêvée?s?|rêvait|joueurs?|joueuses?|écrans?|onglets?|clics?|cliquer|cliqué|sauvegardes?|sauvegarder|sauvegardée?s?)(?![\p{L}])/iu;
const DASH = /[‒–—―]/;
const EMOJI = /\p{Extended_Pictographic}/u;
/** Broken French elision or contraction: "le arbre", "de le", "à les", "que il", "l' arbre". */
const FR_BROKEN = /(?<![\p{L}'])(le|la|de|je|que|ne|se|me|te) [aeiouyàâäéèêëîïôöùûüœ]|(?<![\p{L}])(de|à) les? |(?<![\p{L}])si il|l' /iu;
const EN_BROKEN = /(?<![\p{L}])a [aeiou]|(?<![\p{L}])an [b-df-hj-np-tv-z]/iu;

interface Case {
  source: GrammarSource;
  /** Words of Age VIII and deeper may appear, as images. */
  deep: boolean;
}

function range(from: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => from + i);
}

const CASES: Record<GrammarSource["kind"], Case[]> = {
  king: range(51, 300).map((night) => ({ source: { kind: "king", night }, deep: false })),
  echo: BIOME_IDS.flatMap((biome) => range(12, 60).map((index) => ({ source: { kind: "echo", biome, index }, deep: false }))),
  age: range(0, 12).flatMap((age) => range(8, 30).map((index) => ({ source: { kind: "age", age, index }, deep: age >= 7 }))),
  song: range(30, 300).map((index) => ({ source: { kind: "song", index }, deep: false })),
  dream: range(24, 300).map((index) => ({ source: { kind: "dream", index }, deep: false })),
  reading: range(0, 60).flatMap((era) => range(1, 5).map((descent) => ({ source: { kind: "reading", era, descent }, deep: era >= 35 })))
};

function next(source: GrammarSource): GrammarSource {
  switch (source.kind) {
    case "king":
      return { ...source, night: source.night + 1 };
    case "reading":
      return { ...source, descent: source.descent + 1 };
    default:
      return { ...source, index: source.index + 1 };
  }
}

function checkLine(text: string, by: string, locale: Locale, deep: boolean): string[] {
  const problems: string[] = [];
  if (text.length < 1 || text.length > 140) problems.push(`length ${text.length}`);
  if (DASH.test(text) || DASH.test(by)) problems.push("dash");
  if (EMOJI.test(text)) problems.push("emoji");
  if (/undefined|NaN|null|[{}]/.test(text) || /undefined|NaN/.test(by)) problems.push("hole");
  if (/ {2}| [.,:;?!]| $|^ /.test(text.replace(/ :/g, ":"))) problems.push("spacing");
  if (!deep && FORBIDDEN.test(text)) problems.push("forbidden word");
  if (locale === "fr" && FR_BROKEN.test(text)) problems.push("elision");
  if (locale === "en" && EN_BROKEN.test(text)) problems.push("article");
  if (!/^[\p{Lu}0-9]/u.test(text)) problems.push("capital");
  if (!/[.!?]$/.test(text)) problems.push("end");
  return problems;
}

describe("fragment grammar", () => {
  for (const [kind, cases] of Object.entries(CASES)) {
    it(`writes clean lines for ${kind} (${cases.length} per language)`, () => {
      expect(cases.length).toBeGreaterThanOrEqual(300);
      const failures: string[] = [];
      for (const locale of LOCALES) {
        for (const { source, deep } of cases) {
          const line = grammarLine(source, locale);
          const problems = checkLine(line.text, line.by, locale, deep);
          if (kind === "dream" ? line.by !== "" : line.by.length === 0) problems.push("speaker");
          if (problems.length > 0) failures.push(`${locale} ${JSON.stringify(source)} ${problems.join(",")}: [${line.by}] ${line.text}`);
        }
      }
      expect(failures.slice(0, 20)).toEqual([]);
    });

    it(`is deterministic and never repeats a shape twice in a row for ${kind}`, () => {
      for (const { source } of cases) {
        for (const locale of LOCALES) expect(grammarLine(source, locale)).toEqual(grammarLine(structuredClone(source), locale));
        expect(grammarTemplate(source)).not.toBe(grammarTemplate(next(source)));
      }
    });
  }

  it("stays in bounds far past the written pools", () => {
    const failures: string[] = [];
    const far: Case[] = [
      ...range(351, 2000).map((night) => ({ source: { kind: "king", night } as GrammarSource, deep: false })),
      ...BIOME_IDS.flatMap((biome) => range(72, 600).map((index) => ({ source: { kind: "echo", biome, index } as GrammarSource, deep: false }))),
      ...range(0, 12).flatMap((age) => range(38, 400).map((index) => ({ source: { kind: "age", age, index } as GrammarSource, deep: age >= 7 }))),
      ...range(330, 2000).map((index) => ({ source: { kind: "song", index } as GrammarSource, deep: false })),
      ...range(324, 2000).map((index) => ({ source: { kind: "dream", index } as GrammarSource, deep: false })),
      ...range(0, 60).flatMap((era) => range(6, 20).map((descent) => ({ source: { kind: "reading", era, descent } as GrammarSource, deep: era >= 35 })))
    ];
    for (const locale of LOCALES) {
      for (const { source, deep } of far) {
        const line = grammarLine(source, locale);
        const problems = checkLine(line.text, line.by, locale, deep);
        if (problems.length > 0) failures.push(`${locale} ${JSON.stringify(source)} ${problems.join(",")}: ${line.text}`);
      }
    }
    expect(failures.slice(0, 20)).toEqual([]);
  });

  it("lets the right voices speak", () => {
    for (const locale of LOCALES) {
      for (const { source } of CASES.king) expect(grammarLine(source, locale).by).toBe(locale === "fr" ? "Le Roi" : "The King");
      for (const { source } of CASES.song) expect(grammarLine(source, locale).by).toBe("Célestine");
      for (const { source } of CASES.echo) {
        if (source.kind !== "echo") continue;
        const allowed = new Set([
          locale === "fr" ? "Le Grand Livre" : "The Ledger",
          ...BIOME_COMPANIONS[source.biome].map((id) => (locale === "fr" ? COMPANION_BY_ID[id].byFr : COMPANION_BY_ID[id].byEn)),
          ...REMNANTS.filter((entry) => entry.biome === source.biome).map((entry) => {
            const name = locale === "fr" ? entry.fr : entry.en;
            return name.charAt(0).toUpperCase() + name.slice(1);
          })
        ]);
        expect(allowed.has(grammarLine(source, locale).by), `${grammarLine(source, locale).by} in ${source.biome}`).toBe(true);
      }
      const lysandre = CASES.age.filter(({ source }) => source.kind === "age" && source.age >= 3).map(({ source }) => grammarLine(source, locale).by);
      expect(lysandre).not.toContain("Lysandre");
    }
  });

  it("writes the same beats in both languages", () => {
    const ids = Object.keys(EN_TEMPLATES) as TemplateId[];
    expect(ids.length).toBeGreaterThanOrEqual(24);
    expect(Object.keys(FR_TEMPLATES).sort()).toEqual([...ids].sort());
    for (const id of ids) expect(FR_TEMPLATES[id].voice).toBe(EN_TEMPLATES[id].voice);
    const voices = ids.map((id) => EN_TEMPLATES[id].voice);
    expect(voices.filter((voice) => voice === "king").length).toBeGreaterThanOrEqual(5);
    for (const voice of ["ledger", "lysandre", "oriane", "celestine", "unknown", "companion", "remnant", "none"]) expect(voices).toContain(voice);
  });

  it("keeps full lexicons, clean before the Edge of Sleep", () => {
    expect(EN_STRATA).toHaveLength(60);
    expect(FR_STRATA).toHaveLength(60);
    const words = (lexicon: { objects: readonly { s: string }[]; places: readonly { s: string }[]; verbs: readonly string[] }) => [
      ...lexicon.objects.map((noun) => noun.s),
      ...lexicon.places.map((noun) => noun.s),
      ...lexicon.verbs
    ];
    const shallow = [...EN_STRATA.slice(0, 35), ...FR_STRATA.slice(0, 35), ...Object.values(EN_BIOMES), ...Object.values(FR_BIOMES), EN_KING, FR_KING, ...EN_SONGS, ...FR_SONGS];
    for (const lexicon of shallow) for (const word of words(lexicon)) expect(FORBIDDEN.test(word), word).toBe(false);
    for (const lexicon of [...EN_STRATA, ...FR_STRATA, ...Object.values(EN_BIOMES), ...Object.values(FR_BIOMES)]) {
      expect(lexicon.objects).toHaveLength(4);
      expect(lexicon.places).toHaveLength(4);
      expect(lexicon.verbs).toHaveLength(4);
      expect(lexicon.states).toHaveLength(3);
    }
    expect(Object.keys(EN_BIOMES).sort()).toEqual([...BIOME_IDS].sort());
    expect(Object.keys(FR_BIOMES).sort()).toEqual([...BIOME_IDS].sort());
    const kingWords = (king: typeof EN_KING | typeof FR_KING) => king.objects.length + king.places.length + king.verbs.length + king.states.length;
    expect(kingWords(EN_KING)).toBe(40);
    expect(kingWords(FR_KING)).toBe(40);
    for (const lexicon of [...FR_STRATA, ...Object.values(FR_BIOMES), ...FR_SONGS]) for (const deed of lexicon.verbs) expect(deed.startsWith("a ")).toBe(true);
  });

  it("carries the house into Age IX and the white into Age XI", () => {
    const ageWords = (from: number) =>
      EN_STRATA.slice(from, from + 5)
        .flatMap((lexicon) => [...lexicon.objects, ...lexicon.places].map((noun) => noun.s))
        .join(" ");
    for (const word of ["lamp", "blanket", "cup", "curtain"]) expect(ageWords(40)).toContain(word);
    for (const word of ["margin", "chalk", "snow", "page"]) expect(ageWords(50)).toContain(word);
  });
});
