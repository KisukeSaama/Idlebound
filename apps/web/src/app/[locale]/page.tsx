import { ALTARS, BIOMES, HEROES, ACHIEVEMENTS, STAGES_PER_BIOME, formatNumber } from "@idlebound/game";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { href } from "@/i18n/routing";
import { getI18n } from "@/i18n/server";
import { fetchLeaderboard, fetchStats } from "@/lib/server-api";
import { SITE_NAME, pageAlternates, siteUrl } from "@/lib/site";
import "./landing.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: { absolute: t.landing.metaTitle },
    alternates: pageAlternates(locale, "home")
  };
}

const FEATURE_ICONS = [
  "/assets/icons/sidebar-zones-map.webp",
  "/assets/icons/sidebar-equipment-helmet.webp",
  "/assets/icons/sidebar-essences-crystals.webp",
  "/assets/icons/sidebar-inventory-backpack.webp",
  "/assets/icons/sidebar-shop-stall.webp",
  "/assets/icons/sidebar-save-disk.webp"
];

export default async function LandingPage({ params }: Props) {
  const { locale, t, g } = await getI18n(params);
  const l = t.landing;
  const [stats, board] = await Promise.all([fetchStats(), fetchLeaderboard("stage", 10)]);
  const url = siteUrl();
  const features = l.features.items({ biomes: BIOMES.length, heroes: HEROES.length, altars: ALTARS.length });
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: SITE_NAME,
      url: `${url}${href(locale, "home")}`,
      description: t.site.meta.description,
      image: `${url}/og.jpg`,
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
        <section className="hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <h1>{l.hero.titleLead}<span>{l.hero.titleAccent}</span></h1>
              <p className="hero-lead">{l.hero.lead}</p>
              <div className="hero-cta">
                <Link href={href(locale, "play")} className="btn btn-gold btn-lg">{l.hero.play}</Link>
                <Link href={href(locale, "leaderboard")} className="btn btn-ghost btn-lg">{l.hero.leaderboard}</Link>
              </div>
              <p className="hero-note">{l.hero.note}</p>
              <ul className="hero-proof" aria-label={l.hero.proofLabel}>
                <li><strong>{HEROES.length}</strong> {l.hero.companions}</li>
                <li><strong>{ACHIEVEMENTS.length}</strong> {l.hero.achievements}</li>
                {stats && stats.players > 0 ? <li><strong>{formatNumber(stats.players)}</strong> {l.hero.players}</li> : <li><strong>∞</strong> {l.hero.stages}</li>}
              </ul>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="hero-glow" />
              <img src="/assets/enemies/ruined-king.webp" alt="" width={639} height={640} className="hero-boss" fetchPriority="high" />
              <span className="hero-dmg hero-dmg-1">1.2M</span>
              <span className="hero-dmg hero-dmg-2 crit">48.7M</span>
              <span className="hero-dmg hero-dmg-3">980K</span>
            </div>
          </div>
        </section>

        <section className="section steps" aria-labelledby="steps-title">
          <h2 id="steps-title" className="section-title">{l.steps.title}</h2>
          <ol className="step-list">
            {l.steps.items.map((step, index) => (
              <li key={step.title}><span className="step-num">{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>
            ))}
          </ol>
        </section>

        <section id={l.features.anchor} className="section" aria-labelledby="features-title">
          <h2 id="features-title" className="section-title">{l.features.title}</h2>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <article key={feature.title} className="feature card">
                <img src={FEATURE_ICONS[index]} alt="" width={64} height={64} loading="lazy" />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="biomes-title">
          <h2 id="biomes-title" className="section-title">{l.biomes.title}</h2>
          <div className="biome-grid">
            {BIOMES.map((biome) => {
              const bossName = g.monsters[biome.boss.id];
              return (
                <article key={biome.id} className="biome card" style={{ ["--accent" as string]: biome.accent }}>
                  <div className="biome-img" style={{ backgroundImage: `url(${biome.background})` }}>
                    <img src={biome.boss.image} alt={bossName} loading="lazy" />
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

        <section className="section board" aria-labelledby="board-title">
          <h2 id="board-title" className="section-title">{l.board.title}</h2>
          {board && board.rows.length > 0 ? (
            <ol className="mini-board card">
              {board.rows.map((row) => (
                <li key={row.rank}>
                  <span className={`rank rank-${row.rank}`}>{row.rank}</span>
                  <span className="name">{row.username}</span>
                  <span className="value">{l.board.value(formatNumber(row.value))}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="board-empty card">{l.board.empty}<Link href={href(locale, "play")}>{l.board.emptyCta}</Link></p>
          )}
          <Link href={href(locale, "leaderboard")} className="btn btn-ghost btn-sm board-more">{l.board.more}</Link>
        </section>

        <section className="section faq" aria-labelledby="faq-title">
          <h2 id="faq-title" className="section-title">{l.faq.title}</h2>
          {l.faq.items.map((entry) => (
            <details key={entry.q} className="card">
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </section>

        <section className="final-cta">
          <h2>{l.finalCta.title}</h2>
          <p>{l.finalCta.text}</p>
          <Link href={href(locale, "play")} className="btn btn-gold btn-lg">{l.finalCta.button}</Link>
        </section>
      </main>

      <SiteFooter locale={locale} route="home" />
    </div>
  );
}
