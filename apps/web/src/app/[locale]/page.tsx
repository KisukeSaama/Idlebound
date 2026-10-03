import { AGE_COUNT, ALTARS, BESTIARY, BIOMES, CLICK_HERO_ID, ERA_COUNT, HEROES, MAX_STAGE, NAMED_RELICS, SECRETS, STAGES_PER_BIOME, WEAVES, formatNumber } from "@idlebound/game";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { href } from "@/i18n/routing";
import { getI18n } from "@/i18n/server";
import { fetchLeaderboard, fetchStats } from "@/lib/server-api";
import { SITE_NAME, pageAlternates, siteUrl } from "@/lib/site";
import { Art, type ArtSpec } from "@/game/pixel/Art";
import { LandingHero } from "./LandingHero";
import "./landing.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: { absolute: t.landing.metaTitle },
    alternates: pageAlternates(locale, "home")
  };
}

/** Aldric is the player, not a companion. */
const COMPANION_COUNT = HEROES.filter((hero) => hero.id !== CLICK_HERO_ID).length;

/** World art of each feature card, in the order of `landing.features.items`. */
const FEATURE_ART: ArtSpec[] = [
  { kind: "altar", id: "wanderer" },
  { kind: "portrait", hero: "maelle" },
  { kind: "crystal" },
  { kind: "creature", id: "golden-rat", animated: false },
  { kind: "relic", slot: "weapon", base: 2, rarity: "legendary", forge: 6, named: "oathcutter" },
  { kind: "market", id: "hourglass" }
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
  const [stats, board] = await Promise.all([fetchStats(), fetchLeaderboard("stage", 10)]);
  const url = siteUrl();
  const stages = new Intl.NumberFormat(locale).format(MAX_STAGE);
  const counts = {
    stages,
    eras: ERA_COUNT,
    ages: AGE_COUNT,
    heroes: COMPANION_COUNT,
    altars: ALTARS.length,
    creatures: BESTIARY.length,
    relics: NAMED_RELICS.length,
    weaves: WEAVES.length,
    secrets: SECRETS.length
  };
  const features = l.features.items(counts);
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

      <main>
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

        <section id={l.features.anchor} className="section" aria-labelledby="features-title">
          <h2 id="features-title" className="section-title">{l.features.title}</h2>
          <div className="features">
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
            <aside className="numbers" aria-labelledby="numbers-title">
              <h3 id="numbers-title">{l.features.numbers.title}</h3>
              <dl>
                <div><dt>{l.features.numbers.companions}</dt><dd>{COMPANION_COUNT}</dd></div>
                <div><dt>{l.features.numbers.creatures}</dt><dd>{BESTIARY.length}</dd></div>
                <div><dt>{l.features.numbers.stages}</dt><dd>{stages}</dd></div>
                <div><dt>{l.features.numbers.strata}</dt><dd>{ERA_COUNT}</dd></div>
                {stats && stats.players > 0 ? <div><dt>{l.features.numbers.players}</dt><dd>{formatNumber(stats.players)}</dd></div> : null}
              </dl>
            </aside>
          </div>
          <article className="descent">
            <div className="descent-place pixel-frame" aria-hidden="true">
              <Art spec={{ kind: "place", id: "loom" }} cover className="descent-place-art" />
            </div>
            <div className="descent-body">
              <h3>{l.features.descent.title}</h3>
              <p>{l.features.descent.text(counts)}</p>
            </div>
          </article>
        </section>

        <section className="section" aria-labelledby="biomes-title">
          <h2 id="biomes-title" className="section-title">{l.biomes.title(ERA_COUNT)}</h2>
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
                      <td className="value">{l.board.value(formatNumber(row.maxStage))}</td>
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
