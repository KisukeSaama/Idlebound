import { intlLocale, type Locale } from "@idlebound/game";
import Link from "next/link";
import { Art } from "@/game/pixel/Art";
import { messages } from "@/i18n/messages";
import type { NewsPost } from "@/i18n/messages/posts";
import { newsHref } from "@/i18n/routing";

/** The day an article goes out, in the reader's language. Dates are days, read in UTC. */
export function newsDate(locale: Locale, date: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

/** Kind, version and date of an article, above its title. */
export function NewsMeta({ locale, post }: { locale: Locale; post: NewsPost }) {
  const n = messages(locale).news;
  return (
    <p className="news-meta">
      <span className={`news-kind news-kind-${post.kind}`}>{n.kinds[post.kind]}</span>
      {post.version ? <span className="news-version">{n.version(post.version)}</span> : null}
      <time dateTime={post.date}>{newsDate(locale, post.date)}</time>
    </p>
  );
}

/** The picture of an article: its biome filling the frame, its creature on the ground. */
export function NewsCover({ post, className }: { post: NewsPost; className?: string }) {
  return (
    <div className={className ? `news-cover pixel-frame ${className}` : "news-cover pixel-frame"} aria-hidden="true">
      <Art spec={{ kind: "scene", biome: post.cover.biome }} size="parent" cover className="news-cover-scene" />
      {post.cover.creature ? (
        <div className="news-cover-creature">
          <Art spec={{ kind: "creature", id: post.cover.creature, animated: false }} size="parent" />
        </div>
      ) : null}
    </div>
  );
}

/**
 * One article in a list: its cover, then its words. `feature` lays the newest article of the
 * news page wide, the picture beside the text.
 */
export function NewsCard({ locale, post, heading = "h2", feature = false }: { locale: Locale; post: NewsPost; heading?: "h2" | "h3"; feature?: boolean }) {
  const n = messages(locale).news;
  const text = post[locale];
  const Heading = heading;
  return (
    <article className={feature ? "news-card news-card-feature" : "news-card"}>
      <NewsCover post={post} />
      <div className="news-card-body">
        <NewsMeta locale={locale} post={post} />
        <Heading className="news-card-title">
          <Link href={newsHref(locale, post.slug)}>{text.title}</Link>
        </Heading>
        <p className="news-card-summary">{text.summary}</p>
        <span className="news-read" aria-hidden="true">
          {n.read}
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" /></svg>
        </span>
      </div>
    </article>
  );
}
