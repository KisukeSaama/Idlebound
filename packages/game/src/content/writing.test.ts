import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { KING_FORMS } from "../data/biomes";
import { LOCALES } from "../i18n";
import { AGE_ECHOES_TEXT } from "./story/ages";
import { BESTIARY_KEEP_TEXT } from "./story/bestiary-keep";
import { STRATA_TEXT } from "./story/strata";
import { DASH, EMOJI, FORBIDDEN_WORDS } from "./writing";

const ROOT = join(import.meta.dirname, "..", "..", "..", "..");
const CONTENT = join(ROOT, "packages", "game", "src", "content");
const MESSAGES = join(ROOT, "apps", "web", "src", "i18n", "messages");

const ts = (dir: string) => readdirSync(dir).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts")).map((file) => join(dir, file));

/** Every file that holds text a walker reads: game content in both languages, and the UI. */
const FILES = [join(CONTENT, "en.ts"), join(CONTENT, "fr.ts"), ...ts(join(CONTENT, "story")), ...ts(MESSAGES)];

/** The Edge of Sleep: from this Age (era 35, stage 1751) on, the Truth is said plainly. */
const DEEP_AGE = 7;
const DEEP_ERA = DEEP_AGE * 5;

/**
 * Lines shown only from the Edge of Sleep on, which may use a word of the Truth: the names and
 * echoes of the deep Ages, the keystones of their strata and the Bestiary of the King's deep forms.
 */
const DEEP = new Set(
  LOCALES.flatMap((locale) => [
    ...STRATA_TEXT[locale].ages.slice(DEEP_AGE),
    ...STRATA_TEXT[locale].keystones.slice(DEEP_ERA).map((line) => line.text),
    ...AGE_ECHOES_TEXT[locale].slice(DEEP_AGE).flatMap((echoes) => echoes.map((line) => line.text)),
    ...KING_FORMS.slice(DEEP_AGE).flatMap((form) => BESTIARY_KEEP_TEXT[locale].lines[form] ?? [])
  ])
);

/** The text of every string literal of a TypeScript source, template parts and nested ones included. */
function literals(source: string): string[] {
  const found: string[] = [];
  let at = 0;
  // Reads code until an unmatched `}` (inside a template) or the end, collecting literals.
  const code = (nested: boolean) => {
    let depth = 0;
    while (at < source.length) {
      const char = source[at];
      const next = source[at + 1];
      if (char === "/" && next === "/") at = source.indexOf("\n", at) === -1 ? source.length : source.indexOf("\n", at);
      else if (char === "/" && next === "*") at = source.indexOf("*/", at + 2) + 2;
      else if (char === '"' || char === "'") quoted(char);
      else if (char === "`") template();
      else {
        if (char === "{") depth += 1;
        if (char === "}") {
          if (nested && depth === 0) return;
          depth -= 1;
        }
        at += 1;
      }
    }
  };
  const quoted = (quote: string) => {
    let text = "";
    at += 1;
    while (at < source.length && source[at] !== quote) {
      if (source[at] === "\\") at += 1;
      text += source[at];
      at += 1;
    }
    at += 1;
    found.push(text);
  };
  const template = () => {
    let text = "";
    at += 1;
    while (at < source.length && source[at] !== "`") {
      if (source[at] === "\\") {
        text += source[at + 1];
        at += 2;
      } else if (source[at] === "$" && source[at + 1] === "{") {
        // An interpolation stands for a word: the text around it is checked, then the code inside.
        text += " ";
        at += 2;
        code(true);
        at += 1;
      } else {
        text += source[at];
        at += 1;
      }
    }
    at += 1;
    found.push(text);
  };
  code(false);
  return found;
}

describe("the writing rules", () => {
  it("reads the literals of a source, templates and comments aside", () => {
    const sample = 'const a = { k: "one", t: `two ${n > 1 ? "three" : `four`} five` }; // "not this"\n/* nor "this" */';
    expect(literals(sample)).toEqual(["one", "three", "four", "two   five"]);
  });

  it("keeps the words of the Truth, em dashes and emoji out of every line a walker reads before Age VIII", () => {
    const problems: string[] = [];
    let scanned = 0;
    for (const file of FILES) {
      const where = relative(ROOT, file);
      for (const text of literals(readFileSync(file, "utf8"))) {
        scanned += 1;
        if (DASH.test(text)) problems.push(`${where}: dash in "${text}"`);
        if (EMOJI.test(text)) problems.push(`${where}: emoji in "${text}"`);
        if (FORBIDDEN_WORDS.test(text) && !DEEP.has(text)) problems.push(`${where}: "${text.match(FORBIDDEN_WORDS)?.[0]}" in "${text}"`);
      }
    }
    expect(scanned).toBeGreaterThan(3_000);
    expect(problems).toEqual([]);
  });

  it("lets the Truth be said plainly from the Edge of Sleep on", () => {
    expect(DEEP.has("The Dreamer's Room")).toBe(true);
    expect(DEEP.has("The Kingdom")).toBe(false);
    expect([...DEEP].some((line) => FORBIDDEN_WORDS.test(line))).toBe(true);
  });
});
