/** Lowercase, without accents, so "Maelle" finds "Maëlle" and "eveille" "L'Éveillé". */
export function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function wordsOf(text: string): string[] {
  return fold(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

export interface Rankable {
  title: string;
  /** Words that find it besides its title (a title, a biome). */
  keywords?: string;
  /** A page of its own (a companion, a creature, a relic, a topic) before a section of a page. */
  kind: "entry" | "topic" | "section";
}

const KIND_BONUS = { entry: 30, topic: 20, section: 0 } as const;

/**
 * How well an item answers a query, or 0 when it does not. Every word of the query must
 * begin a word of the title or of the keywords (a long one may also sit inside a title
 * word): "ma" finds "Maëlle" and "marché", never every section of a page whose name says
 * "marché". A title that begins with the whole query comes first, pages before sections.
 */
export function score(item: Rankable, query: string): number {
  const words = wordsOf(query);
  if (words.length === 0) return 0;
  const title = fold(item.title);
  const titleWords = wordsOf(item.title);
  const keywords = wordsOf(item.keywords ?? "");
  let total = title.startsWith(fold(query).trim()) ? 1000 : 0;
  for (const word of words) {
    if (titleWords.some((entry) => entry === word)) total += 120;
    else if (titleWords.some((entry) => entry.startsWith(word))) total += 100;
    else if (keywords.some((entry) => entry.startsWith(word))) total += 40;
    else if (word.length >= 3 && title.includes(word)) total += 15;
    else return 0;
  }
  return total + KIND_BONUS[item.kind];
}

/** The items that answer the query, best first (shorter titles first on a tie). */
export function rank<T extends Rankable>(items: readonly T[], query: string): T[] {
  return items
    .map((item) => ({ item, value: score(item, query) }))
    .filter(({ value }) => value > 0)
    .sort((a, b) => b.value - a.value || a.item.title.length - b.item.title.length)
    .map(({ item }) => item);
}
