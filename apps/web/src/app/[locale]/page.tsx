import { BIOMES, STAGES_PER_BIOME } from "@idlebound/game";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { NEWS_POSTS } from "@/i18n/messages/posts";
import { href } from "@/i18n/routing";
import { getI18n } from "@/i18n/server";
import { stageText } from "@/lib/boards";
import { fetchLeaderboard } from "@/lib/server-api";
import { SITE_NAME, pageAlternates, siteUrl } from "@/lib/site";
import { Art, type ArtSpec } from "@/game/pixel/Art";
import { LandingHero } from "./LandingHero";
import { NewsCard } from "./news/NewsCard";
import "./landing.css";
import "./news/news.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: { absolute: t.landing.metaTitle },
    alternates: pageAlternates(locale, "home")
  };
}

/** World art of each feature card, in the order of `landing.features.items`. */
const FEATURE_ART: ArtSpec[] = [
  { kind: "portrait", hero: "maelle" },
  { kind: "relic", slot: "weapon", base: 2, rarity: "legendary", forge: 6, named: "oathcutter" },
  { kind: "crystal" }
];

/** One Remnant of each biome drawn beside its guardian on the biome cards. */
const BIOME_REMNANT: Record<string, string> = {
  "green-plains": "hollow-scarecrow",
  "dark-forest": "mourning-owl",
  "forgotten-caves": "rune-cart",
  "corrupted-marsh": "drowned-courtier",
  "fallen-king-ruins": "candle-maid"
};

export default async function LandingPage({ params }: Props) {
  const { locale, t, g } = await getI18n(params);
  const l = t.landing;
  const board = await fetchLeaderboard("stage", 10);
  const url = siteUrl();
  const features = l.features.items;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: SITE_NAME,
      url: `${url}${href(locale, "home")}`,
      description: t.site.meta.description,
      image: `${url}/og.png`,
      inLanguage: locale,
      genre: l.jsonLd.genre,
      gamePlatform: l.jsonLd.platform,
      applicationCategory: "Game",
      operatingSystem: l.jsonLd.os,
      playMode: "SinglePlayer",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", availability: "https://schema.org/InStock" }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: l.faq.items.map((entry) => ({ "@type": "Question", name: entry.q, acceptedAnswer: { "@type": "Answer", text: entry.a } }))
    }
  ];

  return (
    <div className="page-shell landing">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteNav locale={locale} />

      <main id="main">
        <LandingHero
          text={{
            titleLead: l.hero.titleLead,
            titleAccent: l.hero.titleAccent,
            lead: l.hero.lead,
            play: l.hero.play,
            leaderboard: l.hero.leaderboard,
            back: l.hero.back,
            backLink: l.hero.backLink,
            kingName: g.monsters["ruined-king"],
            critMark: t.hud.fx.crit,
            boss: l.hero.boss
          }}
          playHref={href(locale, "play")}
          leaderboardHref={href(locale, "leaderboard")}
        />

        <section className="loop" aria-label={l.steps.label}>
          {l.steps.items.map((step) => (
            <div key={step.title}>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </div>
          ))}
        </section>

        <section className="section" aria-labelledby="features-title">
          <h2 id="features-title" className="section-title">{l.features.title}</h2>
          <div className="feature-list">
            {features.map((feature, index) => (
              <article key={feature.title} className="feature">
                <span className="feature-art pixel-frame"><Art spec={FEATURE_ART[index]} size={72} /></span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="biomes-title">
          <h2 id="biomes-title" className="section-title">{l.biomes.title}</h2>
          <div className="biome-grid">
            {BIOMES.map((biome) => {
              const bossName = g.monsters[biome.boss.id];
              const remnant = BIOME_REMNANT[biome.id] ?? biome.monsters[0].id;
              return (
                <article key={biome.id} className="biome" style={{ ["--accent" as string]: biome.accent }}>
                  <div className="biome-img pixel-frame">
                    <Art spec={{ kind: "scene", biome: biome.id }} size="parent" cover className="biome-scene" />
                    <div className="biome-remnant-art">
                      <Art spec={{ kind: "creature", id: remnant, animated: false }} size="parent" label={g.monsters[remnant]} />
                    </div>
                    <div className="biome-boss-art">
                      <Art spec={{ kind: "creature", id: biome.boss.id, animated: false }} size="parent" label={bossName} />
                    </div>
                  </div>
                  <div className="biome-body">
                    <p className="biome-stage">{l.biomes.stages(biome.index * STAGES_PER_BIOME + 1, (biome.index + 1) * STAGES_PER_BIOME)}</p>
                    <h3>{g.biomes[biome.id].name}</h3>
                    <p>{g.biomes[biome.id].description}</p>
                    <p className="biome-boss">{l.biomes.boss}<strong>{bossName}</strong></p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section" aria-labelledby="news-title">
          <h2 id="news-title" className="section-title">{t.news.landingTitle}</h2>
          <div className="news-latest">
            {NEWS_POSTS.slice(0, 3).map((post) => <NewsCard key={post.slug} locale={locale} post={post} heading="h3" />)}
          </div>
          <Link href={href(locale, "news")} className="news-more">{t.news.all}</Link>
        </section>

        <div className="section duo">
          <section className="board" aria-labelledby="board-title">
            <h2 id="board-title" className="section-title">{l.board.title}</h2>
            {board && board.rows.length > 0 ? (
              <table className="mini-board">
                <thead>
                  <tr><th scope="col">{l.board.rank}</th><th scope="col">{l.board.walker}</th><th scope="col" className="value">{l.board.depth}</th></tr>
                </thead>
                <tbody>
                  {board.rows.map((row) => (
                    <tr key={row.rank}>
                      <td><span className={`rank rank-${row.rank}`}>{row.rank}</span></td>
                      <td className="name">{row.username}</td>
                      <td className="value">{l.board.value(stageText(row.maxStage))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="board-empty">{l.board.empty}<Link href={href(locale, "play")}>{l.board.emptyCta}</Link></p>
            )}
            <p className="board-join">{l.board.join}</p>
            <Link href={href(locale, "leaderboard")} className="board-more">{l.board.more}</Link>
          </section>

          <section className="faq" aria-labelledby="faq-title">
            <h2 id="faq-title" className="section-title">{l.faq.title}</h2>
            {l.faq.items.map((entry) => (
              <details key={entry.q}>
                <summary>{entry.q}</summary>
                <p>{entry.a}</p>
              </details>
            ))}
          </section>
        </div>

        <section className="final-cta">
          <div>
            <h2>{l.finalCta.title}</h2>
            <p>{l.finalCta.text}</p>
          </div>
          <Link href={href(locale, "play")} className="btn btn-gold btn-lg">{l.finalCta.button}</Link>
        </section>
      </main>

      <SiteFooter locale={locale} route="home" />
    </div>
  );
}
