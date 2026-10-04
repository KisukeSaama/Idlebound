import {
  ALTARS,
  CARAVAN_WARES,
  CLICK_HERO_ID,
  EQUIPMENT_CAP,
  HEROES,
  HERO_BY_ID,
  MARKET_OFFERS,
  NAMED_RELICS,
  PROMISES,
  RARITIES,
  RARITY_INFO,
  SKILLS,
  SLOTS,
  SLOT_MAIN_STAT,
  WEAVE_BY_ID,
  essencesForStage,
  forgeCost,
  formatNumber,
  stageGold,
  stageHp,
  upgradeCost,
  type AffixStat,
  type HeroEffect
} from "@idlebound/game";
import Link from "next/link";
import type { ReactNode } from "react";
import { Art } from "@/game/pixel/Art";
import { wikiHref } from "@/i18n/routing";
import { companionGate } from "../entryGates";
import { count, percent, type WikiContext } from "../format";
import { Spoiler, SpoilerRow } from "../Spoiler";
import { Calculator } from "../Calculator";

export type Slots = Record<string, ReactNode>;

/** A companion's level 50 talent (or any talent effect) in plain words. */
export function effectText({ t }: WikiContext, effect: HeroEffect): string {
  const e = t.wiki.effects;
  switch (effect.kind) {
    case "heroDps": return e.heroDps(effect.mult);
    case "globalDps": return e.globalDps(Math.round(effect.pct * 100));
    case "click": return e.click(effect.mult);
    case "clickDps": return e.clickDps(effect.pct * 100);
    case "critChance": return e.critChance(Math.round(effect.pct * 100));
    case "critDamage": return e.critDamage(effect.add);
    case "gold": return e.gold(Math.round(effect.pct * 100));
    case "bossTimer": return e.bossTimer(effect.seconds);
    case "treasure": return e.treasure(Math.round(effect.pct * 100));
    case "idleDps": return e.idleDps(Math.round(effect.pct * 100));
  }
}

/** A cell's worth of wiki link to a companion. */
function HeroLink({ ctx, id }: { ctx: WikiContext; id: string }) {
  return <Link href={wikiHref(ctx.locale, "companions", id)}>{ctx.g.heroes[id].name}</Link>;
}

const CURVE_STAGES = [1, 10, 25, 50, 100, 250, 500, 1000, 1500, 2000, 2500, 3000];

export function combatSlots(ctx: WikiContext): Slots {
  const { t, locale } = ctx;
  const w = t.wiki;
  const s = w.slots.combat;
  return {
    stageKinds: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{s.rank}</th><th scope="col">{w.table.stages}</th><th scope="col">{s.hp}</th><th scope="col">{s.timer}</th><th scope="col">{s.loot}</th></tr></thead>
          <tbody>
            {s.rows.map((row) => (
              <tr key={row.rank}><th scope="row">{row.rank}</th><td>{row.stages}</td><td>{row.hp}</td><td>{row.timer}</td><td>{row.loot}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    crystals: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.table.reward}</th><th scope="col">{w.table.odds}</th><th scope="col">{w.table.effect}</th></tr></thead>
          <tbody>
            {s.crystals.map((row) => (
              <tr key={row.name}><th scope="row">{row.name}</th><td className="num">{row.odds}</td><td>{row.effect}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    curve: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.table.stage}</th><th scope="col">{w.table.monsterHp}</th><th scope="col">{s.eliteHp}</th><th scope="col">{s.guardianHp}</th><th scope="col">{w.table.gold}</th></tr></thead>
          <tbody>
            {CURVE_STAGES.map((stage) => (
              <tr key={stage}>
                <th scope="row">{count(locale, stage)}</th>
                <td className="num">{formatNumber(stageHp(stage))}</td>
                <td className="num">{formatNumber(stageHp(stage) * 6)}</td>
                <td className="num">{formatNumber(stageHp(stage) * 10)}</td>
                <td className="num">{formatNumber(stageGold(stage))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  };
}

export function companionSlots(ctx: WikiContext): Slots {
  const { t, g, locale } = ctx;
  const w = t.wiki;
  const aldric = HERO_BY_ID[CLICK_HERO_ID];
  return {
    roster: (
      <div className="wiki-table-wrap">
        <table className="wiki-table wiki-roster">
          <thead>
            <tr><th scope="col">{w.table.companion}</th><th scope="col">{w.table.baseCost}</th><th scope="col">{w.table.baseDps}</th><th scope="col">{w.table.talent50}</th><th scope="col">{w.table.power}</th></tr>
          </thead>
          <tbody>
            {HEROES.filter((hero) => hero.id !== CLICK_HERO_ID).map((hero) => {
              const special = hero.upgrades.find((upgrade) => upgrade.level === 50);
              const power = SKILLS.find((skill) => "heroId" in skill.unlock && skill.unlock.heroId === hero.id);
              const cells = (
                <>
                  <th scope="row">
                    <span className="wiki-who">
                      <span className="wiki-mini pixel-frame" aria-hidden="true"><Art spec={{ kind: "emblem", hero: hero.id }} size={32} /></span>
                      <span><HeroLink ctx={ctx} id={hero.id} /><small>{g.heroes[hero.id].title}</small></span>
                    </span>
                  </th>
                  <td className="num">{formatNumber(hero.baseCost)}</td>
                  <td className="num">{formatNumber(hero.baseDps)}</td>
                  <td>{special ? effectText(ctx, special.effect) : null}</td>
                  <td>{power ? g.skills[power.id].name : "-"}</td>
                </>
              );
              const gate = companionGate(hero.id);
              return gate ? <SpoilerRow key={hero.id} gate={gate} columns={5}>{cells}</SpoilerRow> : <tr key={hero.id}>{cells}</tr>;
            })}
          </tbody>
        </table>
      </div>
    ),
    aldric: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.table.level}</th><th scope="col">{w.table.name}</th><th scope="col">{w.table.effect}</th><th scope="col">{w.table.cost}</th></tr></thead>
          <tbody>
            {aldric.upgrades.map((upgrade) => (
              <tr key={upgrade.id}>
                <td className="num">{upgrade.level}</td>
                <th scope="row">{g.talents[upgrade.id]}</th>
                <td>{effectText(ctx, upgrade.effect)}{upgrade.level === 10 ? ` · ${w.slots.powers.unlocks(g.skills.frenzy.name)}` : ""}</td>
                <td className="num">{formatNumber(upgradeCost(upgrade.id))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="wiki-note">{w.slots.companions.aldricNote(count(locale, aldric.baseCost))}</p>
      </div>
    )
  };
}

export function powerSlots(ctx: WikiContext): Slots {
  const { t, g } = ctx;
  const w = t.wiki;
  return {
    powers: (
      <div className="wiki-cards">
        {SKILLS.map((skill) => {
          const unlock = "heroId" in skill.unlock
            ? <>{w.slots.powers.byHero(skill.unlock.level)} <HeroLink ctx={ctx} id={skill.unlock.heroId} /></>
            : <>{w.slots.powers.byWeave} <Link href={wikiHref(ctx.locale, "descent")}>{g.weaves[skill.unlock.weave].name}</Link></>;
          const body = (
            <article className="wiki-card">
              <span className="wiki-card-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "power", id: skill.id }} size={48} /></span>
              <div>
                <h3>{g.skills[skill.id].name} <kbd>{skill.hotkey}</kbd></h3>
                <p>{g.skills[skill.id].description}</p>
                <dl className="wiki-facts">
                  <div><dt>{w.table.unlock}</dt><dd>{unlock}</dd></div>
                  <div><dt>{w.table.duration}</dt><dd>{skill.duration > 0 ? w.table.seconds(skill.duration) : w.table.instant}</dd></div>
                  <div><dt>{w.table.cooldown}</dt><dd>{w.table.minutes(skill.cooldown / 60)}</dd></div>
                </dl>
              </div>
            </article>
          );
          // The seventh power is woven at the Loom, deep in the night.
          return "weave" in skill.unlock ? <Spoiler key={skill.id} gate={{ kind: "descents", count: 1 }}>{body}</Spoiler> : <div key={skill.id}>{body}</div>;
        })}
      </div>
    )
  };
}

const ESSENCE_STAGES = [50, 55, 60, 70, 80, 100, 120, 140, 200, 300, 500, 1000, 1500, 2000, 3000];

export function ascensionSlots(ctx: WikiContext): Slots {
  const { t, g, locale } = ctx;
  const w = t.wiki;
  return {
    essences: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.slots.ascension.cleared}</th><th scope="col">{w.table.essences}</th><th scope="col">{w.slots.ascension.dps}</th></tr></thead>
          <tbody>
            {ESSENCE_STAGES.map((stage) => {
              const essences = essencesForStage(stage);
              return (
                <tr key={stage}>
                  <th scope="row">{count(locale, stage)}</th>
                  <td className="num">{formatNumber(essences)}</td>
                  <td className="num">+{formatNumber(essences * 10)} %</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="wiki-note">{w.slots.ascension.essencesNote}</p>
      </div>
    ),
    altars: (
      <>
        <div className="wiki-table-wrap">
          <table className="wiki-table">
            <thead><tr><th scope="col">{w.table.name}</th><th scope="col">{w.table.effect}</th><th scope="col">{w.table.price}</th><th scope="col">{w.table.cap}</th><th scope="col">{w.table.night}</th></tr></thead>
            <tbody>
              {ALTARS.map((altar) => (
                <tr key={altar.id}>
                  <th scope="row">
                    <span className="wiki-who">
                      <span className="wiki-mini pixel-frame" aria-hidden="true"><Art spec={{ kind: "altar", id: altar.id }} size={32} /></span>
                      <span>{g.altars[altar.id].name}</span>
                    </span>
                  </th>
                  <td>{g.altars[altar.id].description}</td>
                  <td className="num">{altar.costBase} × {count(locale, altar.costGrowth)}<sup>n</sup></td>
                  <td className="num">{altar.maxLevel > 0 ? altar.maxLevel : w.table.none}</td>
                  <td className="num">{altar.night}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="wiki-sub">{w.slots.ascension.legends}</h3>
        <ul className="wiki-lines">
          {ALTARS.map((altar) => (
            <li key={altar.id}>
              <strong>{g.altars[altar.id].name}</strong>
              <Spoiler gate={{ kind: "altar", id: altar.id }}><Quote by={g.altarLegends[altar.id].by} text={g.altarLegends[altar.id].text} /></Spoiler>
            </li>
          ))}
        </ul>
      </>
    )
  };
}

/** A line of the story and who says it. */
export function Quote({ by, text }: { by: string; text: string }) {
  return (
    <blockquote className="wiki-quote">
      <p>{text}</p>
      {by ? <footer>{by}</footer> : null}
    </blockquote>
  );
}

export function promiseSlots(ctx: WikiContext): Slots {
  const { t } = ctx;
  const w = t.wiki;
  return {
    promises: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.table.companion}</th><th scope="col">{w.table.asks}</th></tr></thead>
          <tbody>
            {PROMISES.map((promise) => {
              const cells = (
                <>
                  <th scope="row">
                    <span className="wiki-who">
                      <span className="wiki-mini pixel-frame" aria-hidden="true"><Art spec={{ kind: "emblem", hero: promise.hero }} size={32} /></span>
                      <HeroLink ctx={ctx} id={promise.hero} />
                    </span>
                  </th>
                  <td>{w.promiseRules[promise.hero]}</td>
                </>
              );
              const gate = companionGate(promise.hero);
              return gate ? <SpoilerRow key={promise.hero} gate={gate} columns={2}>{cells}</SpoilerRow> : <tr key={promise.hero}>{cells}</tr>;
            })}
          </tbody>
        </table>
      </div>
    )
  };
}

const FORGE_LEVELS = [0, 5, 10, 15, 19];
const CAPPED: AffixStat[] = ["critChance", "critDamage", "bossDamage", "essence"];

export function relicSlots(ctx: WikiContext): Slots {
  const { t, g, locale } = ctx;
  const w = t.wiki;
  const totalWeight = RARITIES.reduce((sum, rarity) => sum + RARITY_INFO[rarity].weight, 0);
  return {
    slots: (
      <div className="wiki-cards wiki-cards-4">
        {SLOTS.map((slot) => (
          <article key={slot} className="wiki-card wiki-card-col">
            <span className="wiki-card-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "relic", slot, base: 0, rarity: "epic" }} size={48} /></span>
            <h3>{g.slots[slot]}</h3>
            <p>{g.affixes[SLOT_MAIN_STAT[slot]]}</p>
          </article>
        ))}
      </div>
    ),
    rarities: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.table.rarity}</th><th scope="col">{w.table.affixes}</th><th scope="col">{w.table.power2}</th><th scope="col">{w.table.odds}</th><th scope="col">{w.slots.relics.salvage}</th></tr></thead>
          <tbody>
            {RARITIES.map((rarity) => (
              <tr key={rarity}>
                <th scope="row"><span className="wiki-rarity" style={{ color: RARITY_INFO[rarity].color }}>{g.rarities[rarity]}</span></th>
                <td className="num">{RARITY_INFO[rarity].affixes}</td>
                <td className="num">×{count(locale, RARITY_INFO[rarity].power)}</td>
                <td className="num">{percent(locale, RARITY_INFO[rarity].weight / totalWeight)}</td>
                <td className="num">{RARITY_INFO[rarity].shards}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="wiki-note">{w.slots.relics.oddsNote}</p>
      </div>
    ),
    caps: (
      <ul className="wiki-pills">
        {CAPPED.map((stat) => <li key={stat}>{g.affixes[stat]} <strong>+{percent(locale, EQUIPMENT_CAP[stat] ?? 0)}</strong></li>)}
      </ul>
    ),
    forge: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead>
            <tr><th scope="col">{w.slots.relics.forgeTo}</th>{RARITIES.map((rarity) => <th key={rarity} scope="col" style={{ color: RARITY_INFO[rarity].color }}>{g.rarities[rarity]}</th>)}</tr>
          </thead>
          <tbody>
            {FORGE_LEVELS.map((level) => (
              <tr key={level}>
                <th scope="row">+{level + 1}</th>
                {RARITIES.map((rarity) => <td key={rarity} className="num">{formatNumber(forgeCost(rarity, level))}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    market: (
      <div className="wiki-cards">
        {MARKET_OFFERS.map((offer) => (
          <article key={offer.id} className="wiki-card">
            <span className="wiki-card-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "market", id: offer.id }} size={48} /></span>
            <div>
              <h3>{g.market[offer.id].name} <span className="wiki-price">{w.slots.relics.shards(offer.cost)}</span></h3>
              <p>{g.market[offer.id].description}</p>
            </div>
          </article>
        ))}
      </div>
    ),
    caravan: (
      <Spoiler gate={{ kind: "ascensions", count: 3 }}>
        <div className="wiki-cards">
          {CARAVAN_WARES.map((ware) => (
            <article key={ware.id} className="wiki-card">
              <span className="wiki-card-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "ware", id: ware.id }} size={48} /></span>
              <div>
                <h3>{g.caravan[ware.id].name} <span className="wiki-price">{w.slots.relics.shards(ware.cost)}</span></h3>
                <p>{g.caravan[ware.id].description}</p>
              </div>
            </article>
          ))}
        </div>
      </Spoiler>
    ),
    named: (
      <div className="wiki-grid">
        {NAMED_RELICS.map((relic) => (
          <Spoiler key={relic.id} gate={{ kind: "named", id: relic.id }} fallback={<UnknownCard label={`${g.slots[relic.slot]} · ${g.rarities[relic.rarity]}`} />}>
            <Link href={wikiHref(locale, "relics", relic.id)} className="wiki-tile">
              <span className="wiki-tile-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "relic", slot: relic.slot, base: 0, rarity: relic.rarity, named: relic.id }} size={56} /></span>
              <strong style={{ color: RARITY_INFO[relic.rarity].color }}>{g.relics[relic.id].name}</strong>
              <small>{g.slots[relic.slot]} · {g.rarities[relic.rarity]}</small>
            </Link>
          </Spoiler>
        ))}
      </div>
    ),
    crown: <CrownBlock ctx={ctx} />
  };
}

/** The Crown of Orvane: a fifth slot that cannot be filled, from the tenth Descent. */
export function CrownBlock({ ctx }: { ctx: WikiContext }) {
  const { g, t } = ctx;
  return (
    <Spoiler gate={{ kind: "descents", count: 10 }}>
      <div className="wiki-feature">
        <h3>{g.crown.name}</h3>
        <p>{t.wiki.slots.relics.crown}</p>
        <Quote by={g.crown.legend.by} text={g.crown.legend.text} />
      </div>
    </Spoiler>
  );
}

/** A veiled tile: a frame and a question mark where the picture would be. */
export function UnknownCard({ label }: { label: string }) {
  return (
    <span className="wiki-tile wiki-tile-unknown">
      <span className="wiki-tile-art pixel-frame" aria-hidden="true"><span className="wiki-unknown-mark">?</span></span>
      <strong>???</strong>
      <small>{label}</small>
    </span>
  );
}

export function calculatorSlots(): Slots {
  return { calculator: <Calculator /> };
}

/** Weaves of the Loom, for the Descent page. */
export function weaveRows(ctx: WikiContext) {
  return Object.values(WEAVE_BY_ID).map((weave) => ({ weave, text: ctx.g.weaves[weave.id] }));
}
