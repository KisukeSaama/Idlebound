import { BESTIARY, BIOMES, LOCALES } from "@idlebound/game";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NEWS_POSTS, newsPost, type NewsBlock } from "./posts";

describe("the news articles", () => {
  it("each have a unique URL slug", () => {
    const slugs = NEWS_POSTS.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("are dated with real days, newest first", () => {
    for (const post of NEWS_POSTS) {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${post.date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(post.date);
    }
    const dates = NEWS_POSTS.map((post) => post.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("name the version of a patch note, and only of a patch note, once each", () => {
    for (const post of NEWS_POSTS) {
      if (post.kind === "patch") expect(post.version).toMatch(/^v\d+\.\d+$/);
      else expect(post.version).toBeUndefined();
    }
    const versions = NEWS_POSTS.flatMap((post) => (post.version ? [post.version] : []));
    expect(new Set(versions).size).toBe(versions.length);
  });

  it("are written in every language, with a summary short enough for a search result", () => {
    for (const post of NEWS_POSTS) {
      for (const locale of LOCALES) {
        const text = post[locale];
        expect(text.title.length).toBeGreaterThan(0);
        expect(text.summary.length).toBeLessThanOrEqual(200);
        expect(text.body.length).toBeGreaterThan(0);
      }
      expect(post.fr.body.map((block) => block.kind)).toEqual(post.en.body.map((block) => block.kind));
    }
  });

  it("give every entry the same tag and the same changes, every figure the same art, every spoiler the same blocks in every language", () => {
    const shape = (block: NewsBlock): unknown =>
      block.kind === "entry" ? [block.tag, block.context !== undefined, block.changes.map((change) => "text" in change)]
      : block.kind === "figure" ? [block.kind, block.art.map((art) => [art.spec, art.scene, art.label !== undefined])]
      : block.kind === "compare" ? [block.kind, block.before, block.after]
      : block.kind === "spoiler" ? [block.kind, block.body.map(shape)]
      : block.kind;
    const flat = (blocks: NewsBlock[]): NewsBlock[] => blocks.flatMap((block) => (block.kind === "spoiler" ? [block, ...flat(block.body)] : [block]));
    for (const post of NEWS_POSTS) {
      expect(post.fr.body.map(shape)).toEqual(post.en.body.map(shape));
      for (const locale of LOCALES) {
        for (const block of flat(post[locale].body)) {
          if (block.kind === "spoiler") {
            expect(block.label.length).toBeGreaterThan(0);
            expect(block.body.length).toBeGreaterThan(0);
          }
          if (block.kind === "figure") expect(block.art.length).toBeGreaterThan(0);
          if (block.kind !== "entry") continue;
          const labels = block.changes.map((change) => change.label);
          expect(new Set(labels).size).toBe(labels.length);
        }
      }
    }
  });

  it("are covered by a biome of the road and a creature the landing page already shows", () => {
    const biomes = new Set(BIOMES.map((biome) => biome.id));
    for (const post of NEWS_POSTS) {
      expect(biomes.has(post.cover.biome)).toBe(true);
      if (post.cover.creature) expect(BESTIARY.some((entry) => entry.id === post.cover.creature)).toBe(true);
    }
  });

  it("slide between two pictures that exist, kept under the version they show", () => {
    const flat = (blocks: NewsBlock[]): NewsBlock[] => blocks.flatMap((block) => (block.kind === "spoiler" ? flat(block.body) : [block]));
    for (const post of NEWS_POSTS) {
      for (const block of flat(post.en.body)) {
        if (block.kind !== "compare") continue;
        for (const picture of [block.before, block.after]) {
          expect(picture).toMatch(new RegExp(`^/news/${post.version?.slice(1).replace(".", "-")}/[a-z0-9-]+\\.png$`));
          expect(existsSync(fileURLToPath(new URL(`../../../public${picture}`, import.meta.url)))).toBe(true);
        }
      }
    }
  });

  it("finds an article by its slug", () => {
    expect(newsPost(NEWS_POSTS[0].slug)).toBe(NEWS_POSTS[0]);
    expect(newsPost("no-such-article")).toBeUndefined();
  });
});
