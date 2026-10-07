import { BESTIARY, BIOMES, LOCALES } from "@idlebound/game";
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

  it("give every entry the same tag and the same changes in every language", () => {
    const shape = (block: NewsBlock) => (block.kind === "entry" ? [block.tag, block.context !== undefined, block.changes.map((change) => "text" in change)] : block.kind);
    for (const post of NEWS_POSTS) {
      expect(post.fr.body.map(shape)).toEqual(post.en.body.map(shape));
      for (const locale of LOCALES) {
        for (const block of post[locale].body) {
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

  it("finds an article by its slug", () => {
    expect(newsPost(NEWS_POSTS[0].slug)).toBe(NEWS_POSTS[0]);
    expect(newsPost("no-such-article")).toBeUndefined();
  });
});
