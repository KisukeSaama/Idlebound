import { coverBitmap } from "@/game/pixel/cover";
import { newsPost } from "@/i18n/messages/posts";
import { encodePng } from "@/lib/png";

/** Drawn once per article and process: the same cover always gives the same picture. */
const CACHE = new Map<string, Buffer>();

/** The picture a shared link to an article shows: its cover, drawn on the server. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const post = newsPost((await params).slug);
  if (!post) return new Response(null, { status: 404 });
  let png = CACHE.get(post.slug);
  if (!png) CACHE.set(post.slug, (png = encodePng(coverBitmap(post.cover.biome, post.cover.creature))));
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" }
  });
}
