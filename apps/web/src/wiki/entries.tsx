import {
  BESTIARY_BY_ID,
  CLICK_HERO_ID,
  HERO_BY_ID,
  KING_FORMS,
  NAMED_BY_ID,
  NAMED_RELICS,
  PROMISE_BY_HERO,
  RARITY_INFO,
  RECOGNITION_TIERS,
  SKILLS,
  STAGES_PER_BIOME,
  STAGES_PER_ERA,
  bossHpMultiplier,
  formatNumber,
  roman,
  type NamedRelicDef
} from "@idlebound/game";
import Link from "next/link";
import type { ReactNode } from "react";
import { Art } from "@/game/pixel/Art";
import { wikiHref } from "@/i18n/routing";
import { companionGate, creatureGate } from "./entryGates";
import { count, creatureBiome, creatureKind, percent, type WikiContext } from "./format";
import { eraStart, type Gate } from "./gates";
import { Spoiler } from "./Spoiler";
import { Quote, effectText } from "./topics/rules";

/** An entry page's body, with what its header needs. */
export interface EntryView {
  name: string;
  subtitle: string;
  art: Parameters<typeof Art>[0]["spec"];
  /** The whole entry is a revelation until this is lived. */
  gate?: Gate;
  toc: { id: string; title: string }[];
  body: ReactNode;
}

function Facts({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="wiki-facts wiki-facts-box">
      {rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}
    </dl>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="wiki-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------- companions

export function companionEntry(ctx: WikiContext, id: string): EntryView {
  const { g, t } = ctx;
  const c = t.wiki.entry.companion;
  const hero = HERO_BY_ID[id];
  const text = g.heroes[id];
  const aldric = id === CLICK_HERO_ID;
  const power = SKILLS.find((skill) => "heroId" in skill.unlock && skill.unlock.heroId === id);
  const promise = PROMISE_BY_HERO[id];
  const promiseText = g.promises[id];
  const memories = g.memories[id];
  const hires = g.hireLines[id];
  const gift = NAMED_RELICS.find((relic) => relic.source.kind === "gift" && relic.source.hero === id);
  const toc: { id: string; title: string }[] = [{ id: "talents", title: c.talents }];

  const body = (
    <>
      <p className="wiki-intro">{text.lore}</p>
      <Facts
        rows={[
          { label: c.stats, value: c.index(hero.index) },
          { label: c.cost, value: formatNumber(hero.baseCost) },
          aldric ? { label: c.click, value: formatNumber(hero.baseClick) } : { label: c.dps, value: formatNumber(hero.baseDps) },
          { label: c.strike, value: c.strikes[hero.strike] }
        ]}
      />
      <Section id="talents" title={c.talents}>
        <p>{c.talentsLead(aldric)}</p>
        <div className="wiki-table-wrap">
          <table className="wiki-table">
            <thead><tr><th scope="col">{t.wiki.table.level}</th><th scope="col">{t.wiki.table.name}</th><th scope="col">{t.wiki.table.effect}</th><th scope="col">{t.wiki.table.cost}</th></tr></thead>
            <tbody>
              {hero.upgrades.map((upgrade) => (
                <tr key={upgrade.id}>
                  <td className="num">{upgrade.level}</td>
                  <th scope="row">{g.talents[upgrade.id]}</th>
                  <td>{effectText(ctx, upgrade.effect)}</td>
                  <td className="num">{formatNumber(hero.baseCost * upgrade.costMult)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {aldric ? null : <p className="wiki-note">{c.milestones}</p>}
        {aldric ? (
          <ul className="wiki-lines">
            {hero.upgrades.map((upgrade) => {
              const line = g.lessons[upgrade.id];
              return line ? (
                <li key={upgrade.id}>
                  <strong>{c.lesson} · {g.talents[upgrade.id]}</strong>
                  <Spoiler gate={{ kind: "lesson", id: upgrade.id }}><Quote by={line.by} text={line.text} /></Spoiler>
                </li>
              ) : null;
            })}
          </ul>
        ) : null}
      </Section>
      {power ? (
        <Section id="power" title={c.power}>
          <div className="wiki-card">
            <span className="wiki-card-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "power", id: power.id }} size={48} /></span>
            <div>
              <h3>{g.skills[power.id].name} <kbd>{power.hotkey}</kbd></h3>
              <p>{g.skills[power.id].description}</p>
              <p className="wiki-note">{"heroId" in power.unlock ? c.powerAt(power.unlock.level) : null}</p>
            </div>
          </div>
        </Section>
      ) : null}
      {promise && promiseText ? (
        <Section id="promise" title={c.promise}>
          <Facts rows={[{ label: c.promiseRule, value: t.wiki.promiseRules[id] }]} />
          <Spoiler gate={{ kind: "tier", hero: id, tier: 2 }}>
            <h3 className="wiki-sub">{c.promiseAsk}</h3>
            <Quote by={text.name} text={promiseText.ask} />
            <h3 className="wiki-sub">{c.promiseBroken}</h3>
            <Quote by={text.name} text={promiseText.broken} />
          </Spoiler>
          <h3 className="wiki-sub">{c.promiseKept}</h3>
          <Spoiler gate={{ kind: "kept", hero: id }}><Quote by={text.name} text={promiseText.kept} /></Spoiler>
        </Section>
      ) : null}
      {hires ? (
        <Section id="hire" title={c.hire}>
          <ul className="wiki-lines">
            {hires.map((line, index) => {
              const gate: Gate = index === 0 ? { kind: "hired", hero: id } : { kind: "tier", hero: id, tier: index === 1 ? 1 : 3 };
              return (
                <li key={index}>
                  <strong>{c.hireTiers[index]}</strong>
                  <Spoiler gate={gate}><Quote by={text.name} text={line} /></Spoiler>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}
      {memories ? (
        <Section id="memories" title={c.memories}>
          <p>{c.memoriesLead(RECOGNITION_TIERS.join(", "))}</p>
          <ol className="wiki-lines">
            {memories.map((line, index) => (
              <li key={index}>
                <strong>{c.tier(index + 1)}</strong>
                <Spoiler gate={{ kind: "tier", hero: id, tier: index + 1 }}><Quote by={line.by} text={line.text} /></Spoiler>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
      {gift ? (
        <Section id="gift" title={c.gift}>
          <p>{c.giftLead}</p>
          <RelicTile ctx={ctx} relic={gift} />
        </Section>
      ) : null}
    </>
  );
  if (power) toc.push({ id: "power", title: c.power });
  if (promise) toc.push({ id: "promise", title: c.promise });
  if (hires) toc.push({ id: "hire", title: c.hire });
  if (memories) toc.push({ id: "memories", title: c.memories });
  if (gift) toc.push({ id: "gift", title: c.gift });
  return { name: text.name, subtitle: text.title, art: { kind: "portrait", hero: id }, gate: companionGate(id), toc, body };
}

// ---------------------------------------------------------------- creatures

/** A stage that shows each Age's treatment: the middle stratum of the Age. */
const AGE_SAMPLES = Array.from({ length: 12 }, (_, age) => age * 5);

export function creatureEntry(ctx: WikiContext, id: string): EntryView {
  const { g, t, locale } = ctx;
  const c = t.wiki.entry.creature;
  const entry = BESTIARY_BY_ID[id];
  const kind = creatureKind(id);
  const biome = creatureBiome(id);
  const lines = g.bestiary[id];
  const wanderer = g.wanderers[id];
  const relics = NAMED_RELICS.filter((relic) => "monster" in relic.source && relic.source.monster === id);
  const kingAge = KING_FORMS.indexOf(id);
  const stagesOf = (index: number) => [index * STAGES_PER_BIOME + 1, (index + 1) * STAGES_PER_BIOME] as const;
  const where =
    id === "the-dawn" ? c.whereDawn
    : id === "ruined-king" ? c.whereRuined
    : kingAge > 0 ? c.whereKing(kingAge * 5 * STAGES_PER_ERA + STAGES_PER_ERA)
    : biome ? c.whereBiome(g.biomes[biome.id].name, ...stagesOf(biome.index))
    : g.bestiaryPages[entry.page];
  const hp =
    kind === "elite" ? c.hpValue(bossHpMultiplier(5))
    : kind === "guardian" || kind === "king" ? c.hpValue(bossHpMultiplier(10))
    : null;
  // The road's creatures change with every Age; the Dawn, Pip and the King's later forms keep their own look.
  const throughAges = (kind === "normal" || kind === "elite" || kind === "guardian") && id !== "ruined-king";
  const toc = [{ id: "lines", title: c.lines }];
  if (throughAges) toc.push({ id: "ages", title: c.ages });

  const body = (
    <>
      <Facts
        rows={[
          { label: c.kind, value: t.wiki.kinds[kind] },
          { label: c.where, value: where },
          ...(hp ? [{ label: c.hp, value: hp }] : []),
          { label: c.page, value: <Link href={`${wikiHref(locale, "bestiary")}#pages`}>{g.bestiaryPages[entry.page]}</Link> }
        ]}
      />
      {lines ? (
        <Section id="lines" title={c.lines}>
          <p>{c.linesLead}</p>
          <ol className="wiki-lines">
            {lines.map((line, index) => (
              <li key={index}>
                <strong>{c.lineAt(count(locale, entry.tiers[index]))}</strong>
                <Spoiler gate={{ kind: "kills", id, count: entry.tiers[index] }}><Quote by={g.speakers.ledger} text={line} /></Spoiler>
              </li>
            ))}
          </ol>
          {wanderer ? (
            <>
              <h3 className="wiki-sub">{c.fragment}</h3>
              <Spoiler gate={{ kind: "kills", id, count: 1 }}><Quote by={wanderer.by} text={wanderer.text} /></Spoiler>
            </>
          ) : null}
        </Section>
      ) : null}
      {throughAges ? (
        <Section id="ages" title={c.ages}>
          <p>{c.agesLead}</p>
          <div className="wiki-grid wiki-grid-small">
            {AGE_SAMPLES.map((era, age) => {
              const tile = (
                <figure className="wiki-tile">
                  <span className="wiki-tile-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "creature", id, era, animated: false }} size={64} /></span>
                  <figcaption>
                    <strong>{t.wiki.table.age} {roman(age + 1)}</strong>
                    <small>{g.strata.tags[era] || t.wiki.table.present}</small>
                  </figcaption>
                </figure>
              );
              return age === 0 ? <div key={age}>{tile}</div> : <Spoiler key={age} gate={{ kind: "stage", stage: eraStart(era) }} inline>{tile}</Spoiler>;
            })}
          </div>
        </Section>
      ) : null}
      {relics.length > 0 ? (
        <Section id="relics" title={c.drops}>
          <div className="wiki-grid">{relics.map((relic) => <RelicTile key={relic.id} ctx={ctx} relic={relic} />)}</div>
        </Section>
      ) : null}
    </>
  );
  if (relics.length > 0) toc.push({ id: "relics", title: c.drops });
  return { name: g.monsters[id] ?? id, subtitle: t.wiki.kinds[kind], art: { kind: "creature", id }, gate: creatureGate(id), toc, body };
}

// ---------------------------------------------------------------- named relics

function RelicTile({ ctx, relic }: { ctx: WikiContext; relic: NamedRelicDef }) {
  const { g, locale } = ctx;
  return (
    <Spoiler gate={{ kind: "named", id: relic.id }} inline>
      <Link href={wikiHref(locale, "relics", relic.id)} className="wiki-tile">
        <span className="wiki-tile-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "relic", slot: relic.slot, base: 0, rarity: relic.rarity, named: relic.id }} size={56} /></span>
        <strong style={{ color: RARITY_INFO[relic.rarity].color }}>{g.relics[relic.id].name}</strong>
        <small>{g.slots[relic.slot]} · {g.rarities[relic.rarity]}</small>
      </Link>
    </Spoiler>
  );
}

/** Where a named relic comes from, in plain words, with links to who or what gives it. */
function relicSource(ctx: WikiContext, relic: NamedRelicDef): ReactNode {
  const { g, t, locale } = ctx;
  const s = t.wiki.sources;
  const source = relic.source;
  const creature = (id: string) => <Link href={wikiHref(locale, "bestiary", id)}>{g.monsters[id]}</Link>;
  const hero = (id: string) => <Link href={wikiHref(locale, "companions", id)}>{g.heroes[id].name}</Link>;
  // The words come with the names as plain strings; the links follow the sentence.
  switch (source.kind) {
    case "kills":
      return <>{s.kills(g.monsters[source.monster], count(locale, source.kills))} ({creature(source.monster)})</>;
    case "boss":
      return <>{s.boss(g.monsters[source.monster], g.eraName(source.era), percent(locale, source.chance))} ({creature(source.monster)})</>;
    case "stratum":
      return s.stratum(g.eraName(source.era), g.strata.tags[source.era], percent(locale, source.chance));
    case "king":
      return s.king(roman(source.age + 1), percent(locale, source.chance));
    case "gift":
      return <>{s.gift(g.heroes[source.hero].name)} ({hero(source.hero)})</>;
    case "creature":
      return <>{s.creature(g.monsters[source.monster], percent(locale, source.chance))} ({creature(source.monster)})</>;
    case "hired":
      return <>{s.hired(g.heroes[source.hero].name, source.level, percent(locale, source.chance))} ({hero(source.hero)})</>;
    case "event":
      return source.event === "stray" ? s.stray : s.caravan;
    case "dawn":
      return s.dawn(source.descents);
  }
}

export function relicEntry(ctx: WikiContext, id: string): EntryView {
  const { g, t } = ctx;
  const c = t.wiki.entry.relic;
  const relic = NAMED_BY_ID[id];
  const text = g.relics[id];
  const effect = g.namedEffects[relic.effect.kind](relic.effect.pct);
  const body = (
    <>
      <Facts
        rows={[
          { label: c.slot, value: g.slots[relic.slot] },
          { label: c.rarity, value: <span style={{ color: RARITY_INFO[relic.rarity].color }}>{g.rarities[relic.rarity]}</span> },
          { label: c.effect, value: effect },
          { label: c.source, value: relicSource(ctx, relic) }
        ]}
      />
      <p className="wiki-note">{c.notes}</p>
      <Section id="legend" title={c.legend}>
        <Quote by={text.name} text={text.legend} />
      </Section>
    </>
  );
  return {
    name: text.name,
    subtitle: `${g.slots[relic.slot]} · ${g.rarities[relic.rarity]}`,
    art: { kind: "relic", slot: relic.slot, base: 0, rarity: relic.rarity, named: id },
    gate: { kind: "named", id },
    toc: [{ id: "legend", title: c.legend }],
    body
  };
}
