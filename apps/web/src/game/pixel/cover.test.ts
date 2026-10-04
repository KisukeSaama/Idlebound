import { describe, expect, it } from "vitest";
import { NEWS_POSTS } from "../../i18n/messages/posts";
import { COVER_HEIGHT, COVER_WIDTH, coverBitmap } from "./cover";
import { hashBitmap } from "./pixels";

describe("news share cover", () => {
  it("fills the Open Graph frame, opaque, on a whole-factor grid", () => {
    const bitmap = coverBitmap("dark-forest", "mourning-owl");
    expect([bitmap.w, bitmap.h]).toEqual([COVER_WIDTH, COVER_HEIGHT]);
    for (let at = 3; at < bitmap.data.length; at += 4) expect(bitmap.data[at]).toBe(255);
    // Every art pixel is a 4 by 4 block: the first two rows of the frame repeat the same colors.
    expect(bitmap.data.subarray(0, COVER_WIDTH * 4)).toEqual(bitmap.data.subarray(COVER_WIDTH * 4, COVER_WIDTH * 8));
  });

  it("draws every article's cover, the same pixels every time", () => {
    const hashes = Object.fromEntries(NEWS_POSTS.map((post) => [post.slug, hashBitmap(coverBitmap(post.cover.biome, post.cover.creature))]));
    expect(hashes).toMatchSnapshot();
    for (const post of NEWS_POSTS) expect(hashBitmap(coverBitmap(post.cover.biome, post.cover.creature))).toBe(hashes[post.slug]);
  });
});
