import { describe, expect, it } from "vitest";
import { rank, score, type Rankable } from "./searchRank";

const items: Rankable[] = [
  { title: "Reliques, forge et marché", kind: "topic" },
  { title: "Les quatre emplacements", kind: "section" },
  { title: "Raretés et bonus", kind: "section" },
  { title: "Vais-je perdre ma partie ?", kind: "section" },
  { title: "Maëlle", keywords: "L'archère", kind: "entry" },
  { title: "Rat des champs", keywords: "Plaines verdoyantes", kind: "entry" },
  { title: "L'Éveillé", kind: "entry" }
];

describe("the wiki search", () => {
  it("matches the beginnings of words, not a page's name on each of its sections", () => {
    const found = rank(items, "Ma").map((item) => item.title);
    expect(found).not.toContain("Les quatre emplacements");
    expect(found).not.toContain("Raretés et bonus");
    expect(found).toContain("Reliques, forge et marché");
  });

  it("puts a title that begins with the query first, without caring for accents", () => {
    expect(rank(items, "ma")[0].title).toBe("Maëlle");
    expect(rank(items, "eveil")[0].title).toBe("L'Éveillé");
  });

  it("finds an entry by its keywords, after the titles", () => {
    expect(rank(items, "plaines").map((item) => item.title)).toEqual(["Rat des champs"]);
    expect(score({ title: "Archères", kind: "section" }, "arch")).toBeGreaterThan(score(items[4], "arch"));
  });

  it("needs every word of the query", () => {
    expect(rank(items, "rat plaines").map((item) => item.title)).toEqual(["Rat des champs"]);
    expect(rank(items, "rat forge")).toEqual([]);
    expect(rank(items, "   ")).toEqual([]);
  });
});
