import {
  ACHIEVEMENTS,
  AGE_COUNT,
  BESTIARY,
  BESTIARY_GOLD_PAGES,
  BESTIARY_PAGES,
  BIOMES,
  CUTSCENES,
  DESCENT_MIN_STAGE,
  ERA_COUNT,
  EVENTS,
  HERO_BY_ID,
  KING_FORMS,
  KING_WORDS,
  LESSONS,
  MILESTONES,
  RECOGNITION_PROMISES,
  RECOGNITION_TIERS,
  SECRETS,
  SECRET_SERIES,
  STAGES_PER_BIOME,
  STAGES_PER_ERA,
  WANDERER_BY_BIOME,
  WEAVES,
  achievementText,
  formatNumber,
  roman,
  threadsFor,
  type AchievementCategory,
  type EventId
} from "@idlebound/game";
import Link from "next/link";
import { Art } from "@/game/pixel/Art";
import { href, wikiHref } from "@/i18n/routing";
import { BOARD_IDS } from "@/lib/boards";
import { creatureGate } from "../entryGates";
import { count, creatureKind, percent, type WikiContext } from "../format";
import { eraStart, type Gate } from "../gates";
import { Spoiler, SpoilerRow } from "../Spoiler";
import { CrownBlock, Quote, UnknownCard, type Slots } from "./rules";

/** A creature's tile in a grid, linking to its page; veiled as a question mark while it is a secret. */
export function CreatureTile({ ctx, id }: { ctx: WikiContext; id: string }) {
  const { g, t, locale } = ctx;
  const tile = (
    <Link href={wikiHref(locale, "bestiary", id)} className="wiki-tile">
      <span className="wiki-tile-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "creature", id, animated: false }} size={64} /></span>
      <strong>{g.monsters[id] ?? id}</strong>
      <small>{t.wiki.kinds[creatureKind(id)]}</small>
    </Link>
  );
  const gate = creatureGate(id);
  return gate ? <Spoiler gate={gate} fallback={<UnknownCard label={t.wiki.kinds[creatureKind(id)]} />}>{tile}</Spoiler> : tile;
}

export function bestiarySlots(ctx: WikiContext): Slots {
  const { g, t } = ctx;
  return {
    pages: (
      <>
        {BESTIARY_PAGES.map((page) => (
          <div key={page} className="wiki-page-group">
            <h3 className="wiki-sub">
              {g.bestiaryPages[page]}
              {BESTIARY_GOLD_PAGES.includes(page) ? <small>{t.wiki.slots.bestiary.goldPage}</small> : null}
            </h3>
            <div className="wiki-grid">
              {BESTIARY.filter((entry) => entry.page === page).map((entry) => <CreatureTile key={entry.id} ctx={ctx} id={entry.id} />)}
            </div>
          </div>
        ))}
      </>
    )
  };
}

export function biomeSlots(ctx: WikiContext): Slots {
  const { g, t, locale } = ctx;
  const s = t.wiki.slots.biomes;
  return {
    biomes: (
      <div className="wiki-biomes">
        {BIOMES.map((biome) => {
          const wanderer = WANDERER_BY_BIOME[biome.id];
          return (
            <article key={biome.id} id={biome.id} className="wiki-biome" style={{ ["--accent" as string]: biome.accent }}>
              <div className="wiki-biome-scene pixel-frame" aria-hidden="true">
                <Art spec={{ kind: "scene", biome: biome.id }} size="parent" cover />
              </div>
              <div className="wiki-biome-body">
                <p className="wiki-biome-stages">{s.stages(biome.index * STAGES_PER_BIOME + 1, (biome.index + 1) * STAGES_PER_BIOME)}</p>
                <h3>{g.biomes[biome.id].name}</h3>
                <p>{g.biomes[biome.id].description}</p>
                <div className="wiki-grid wiki-grid-small">
                  {[...biome.monsters.map((monster) => monster.id), biome.miniBoss.id, biome.boss.id, ...(wanderer ? [wanderer.id] : [])].map((id) => <CreatureTile key={id} ctx={ctx} id={id} />)}
                </div>
                <h4>{s.echoes}</h4>
                <ol className="wiki-lines">
                  {(g.echoes[biome.id] ?? []).map((line, index) => (
                    <li key={index}>
                      <Spoiler gate={{ kind: "echo", biome: biome.id, index: index + 1 }}><Quote by={line.by} text={line.text} /></Spoiler>
                    </li>
                  ))}
                </ol>
                <p className="wiki-note">{s.echoesNote(count(locale, (g.echoes[biome.id] ?? []).length))}</p>
              </div>
            </article>
          );
        })}
      </div>
    )
  };
}

/** The first stage of an Age. */
const ageStart = (age: number) => eraStart(age * 5);

export function strataSlots(ctx: WikiContext): Slots {
  const { g, t, locale } = ctx;
  const w = t.wiki;
  const s = w.slots.strata;
  return {
    ages: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.table.age}</th><th scope="col">{w.table.name}</th><th scope="col">{w.table.stages}</th><th scope="col">{w.table.king}</th></tr></thead>
          <tbody>
            {Array.from({ length: AGE_COUNT }, (_, age) => {
              const king = KING_FORMS[age];
              const cells = (
                <>
                  <th scope="row">{roman(age + 1)}</th>
                  <td>{g.strata.ages[age]}</td>
                  <td className="num">{count(locale, ageStart(age))} - {count(locale, (age + 1) * 5 * STAGES_PER_ERA)}</td>
                  <td><Link href={wikiHref(locale, "bestiary", king)}>{g.monsters[king]}</Link></td>
                </>
              );
              return age === 0 ? <tr key={age}>{cells}</tr> : <SpoilerRow key={age} gate={{ kind: "stage", stage: ageStart(age) }} columns={4}>{cells}</SpoilerRow>;
            })}
          </tbody>
        </table>
      </div>
    ),
    kings: (
      <div className="wiki-grid">
        {KING_FORMS.map((id) => <CreatureTile key={id} ctx={ctx} id={id} />)}
      </div>
    ),
    strata: (
      <div className="wiki-table-wrap">
        <table className="wiki-table wiki-strata">
          <thead><tr><th scope="col">{w.table.era}</th><th scope="col">{w.table.tag}</th><th scope="col">{w.table.stages}</th><th scope="col">{s.keystone}</th></tr></thead>
          <tbody>
            {Array.from({ length: ERA_COUNT }, (_, era) => {
              const keystone = g.strata.keystones[era];
              const cells = (
                <>
                  <th scope="row">{g.eraName(era)}</th>
                  <td>{g.strata.tags[era] || w.table.present}<small>{w.table.age} {roman(Math.floor(era / 5) + 1)}</small></td>
                  <td className="num">{count(locale, eraStart(era))} - {count(locale, (era + 1) * STAGES_PER_ERA)}</td>
                  <td>{keystone ? <Spoiler gate={{ kind: "stage", stage: (era + 1) * STAGES_PER_ERA + 1 }} inline><span className="wiki-keystone">{keystone.text}<small>{keystone.by}</small></span></Spoiler> : null}</td>
                </>
              );
              return era === 0 ? <tr key={era}>{cells}</tr> : <SpoilerRow key={era} gate={{ kind: "stage", stage: eraStart(era) }} columns={4}>{cells}</SpoilerRow>;
            })}
          </tbody>
        </table>
        <p className="wiki-note">{s.keystoneNote}</p>
      </div>
    ),
    dawn: (
      <Spoiler gate={{ kind: "kills", id: "the-dawn", count: 1 }}>
        <div className="wiki-feature">
          <div className="wiki-feature-art pixel-frame" aria-hidden="true"><Art spec={{ kind: "place", id: "dawn" }} /></div>
          <h3><Link href={wikiHref(locale, "bestiary", "the-dawn")}>{g.places.dawn.name}</Link></h3>
          <p>{g.places.dawn.description}</p>
        </div>
      </Spoiler>
    )
  };
}

/** Events the road keeps for deep nights: their whole card is a revelation until then. */
const EVENT_GATES: Partial<Record<EventId, Gate>> = {
  quiet: { kind: "stage", stage: eraStart(3) },
  unfinished: { kind: "stage", stage: eraStart(25) },
  stray: { kind: "hired", hero: "nameless" },
  eclipse: { kind: "ascensions", count: 7 },
  walker: { kind: "ascensions", count: 5 },
  caravan: { kind: "ascensions", count: 3 },
  seam: { kind: "stage", stage: 60 },
  migration: { kind: "stage", stage: eraStart(1) }
};

export function eventSlots(ctx: WikiContext): Slots {
  const { g, t } = ctx;
  const w = t.wiki;
  return {
    events: (
      <div className="wiki-events">
        {EVENTS.map((id) => {
          const card = (
            <article className="wiki-event" id={`event-${id}`}>
              <h3>{g.events[id].name}</h3>
              <dl className="wiki-facts">
                <div><dt>{w.table.trigger}</dt><dd>{w.eventTriggers[id]}</dd></div>
                <div><dt>{w.table.what}</dt><dd>{w.eventEffects[id]}</dd></div>
              </dl>
              <Spoiler gate={{ kind: "event", id }}><Quote by={g.events[id].line.by} text={g.events[id].line.text} /></Spoiler>
            </article>
          );
          const gate = EVENT_GATES[id];
          return gate ? <Spoiler key={id} gate={gate}>{card}</Spoiler> : <div key={id}>{card}</div>;
        })}
      </div>
    )
  };
}

export function chronicleSlots(ctx: WikiContext): Slots {
  const { g, t, locale } = ctx;
  const w = t.wiki;
  const s = w.slots.chronicle;
  return {
    recognition: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.table.tier}</th><th scope="col">{w.table.runs}</th><th scope="col">{w.table.promises}</th><th scope="col">{w.table.reward}</th></tr></thead>
          <tbody>
            {RECOGNITION_TIERS.map((runs, index) => (
              <tr key={runs}>
                <th scope="row">{index + 1}</th>
                <td className="num">{runs}</td>
                <td className="num">{RECOGNITION_PROMISES[index]}</td>
                <td>{s.rewards[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    scenes: (
      <>
        {CUTSCENES.map((scene) => (
          <div key={scene.id} className="wiki-scene">
            <h3 className="wiki-sub">{g.cutscenes[scene.id].name}</h3>
            <Spoiler gate={{ kind: "cutscene", id: scene.id }}>
              <ol className="wiki-lines wiki-scene-lines">
                {g.cutscenes[scene.id].lines.filter(Boolean).map((line, index) => <li key={index}><p>{line}</p></li>)}
              </ol>
            </Spoiler>
          </div>
        ))}
      </>
    ),
    kingWords: (
      <ol className="wiki-words">
        {g.voices.kingWords.slice(0, KING_WORDS).map((word, index) => (
          <li key={index} value={index + 1}>
            <Spoiler gate={{ kind: "ascensions", count: index + 1 }} inline><span>{word}</span></Spoiler>
          </li>
        ))}
      </ol>
    ),
    milestones: (
      <ul className="wiki-lines">
        {MILESTONES.map((id) => {
          const line = g.strata.milestones[id];
          return (
            <li key={id}>
              <strong>{s.milestones[id]}</strong>
              <Spoiler gate={{ kind: "milestone", id }}><Quote by={line.by} text={line.text} /></Spoiler>
            </li>
          );
        })}
      </ul>
    ),
    lessons: (
      <ul className="wiki-lines">
        {LESSONS.map((id) => {
          const line = g.lessons[id];
          const level = HERO_BY_ID.aldric.upgrades.find((upgrade) => upgrade.id === id)?.level ?? 0;
          return (
            <li key={id}>
              <strong>{g.talents[id]} <small>{s.lessonLevel(count(locale, level))}</small></strong>
              {line ? <Spoiler gate={{ kind: "lesson", id }}><Quote by={line.by} text={line.text} /></Spoiler> : null}
            </li>
          );
        })}
      </ul>
    )
  };
}

const CATEGORIES: AchievementCategory[] = ["progression", "combat", "wealth", "companions", "ascension", "secrets"];

export function deedSlots(ctx: WikiContext): Slots {
  const { g, t, locale } = ctx;
  const w = t.wiki;
  const big = (value: number) => formatNumber(value);
  return {
    series: (
      <>
        {CATEGORIES.map((category) => {
          const deeds = ACHIEVEMENTS.filter((deed) => deed.category === category && deed.series !== SECRET_SERIES);
          if (deeds.length === 0) return null;
          return (
            <div key={category} className="wiki-page-group">
              <h3 className="wiki-sub">{g.achievementCategories[category]} <small>{deeds.length}</small></h3>
              <div className="wiki-table-wrap">
                <table className="wiki-table">
                  <thead><tr><th scope="col">{w.table.name}</th><th scope="col">{w.table.threshold}</th><th scope="col">{w.table.bonus}</th></tr></thead>
                  <tbody>
                    {deeds.map((deed) => {
                      const text = achievementText(deed.id, locale, big);
                      return (
                        <tr key={deed.id}>
                          <th scope="row">{text.name}</th>
                          <td>{text.description}</td>
                          <td className="num">+{percent(locale, deed.bonus)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </>
    ),
    secrets: (
      <div className="wiki-secrets">
        {SECRETS.map((secret) => {
          const text = g.secrets[secret.id];
          return (
            <article key={secret.id} className="wiki-secret" id={`secret-${secret.id}`}>
              <p className="wiki-secret-number">{w.slots.deeds.number(roman(secret.deed))}</p>
              <p className="wiki-riddle">{text.riddle}</p>
              <Spoiler gate={{ kind: "secret", id: secret.id }}>
                <h3>{text.name}</h3>
                <p>{w.secretSolutions[secret.id]}</p>
                <Quote by={text.line.by} text={text.line.text} />
              </Spoiler>
            </article>
          );
        })}
      </div>
    )
  };
}

const THREAD_STAGES = [DESCENT_MIN_STAGE, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000];

export function descentSlots(ctx: WikiContext): Slots {
  const { g, t, locale } = ctx;
  const w = t.wiki;
  return {
    threads: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.slots.descent.best}</th><th scope="col">{w.table.threads}</th></tr></thead>
          <tbody>
            {THREAD_STAGES.map((stage) => (
              <tr key={stage}><th scope="row">{count(locale, stage)}</th><td className="num">{count(locale, threadsFor(stage))}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    weaves: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <thead><tr><th scope="col">{w.table.name}</th><th scope="col">{w.table.effect}</th><th scope="col">{w.table.price}</th><th scope="col">{w.table.cap}</th></tr></thead>
          <tbody>
            {WEAVES.map((weave) => (
              <tr key={weave.id}>
                <th scope="row">{g.weaves[weave.id].name}</th>
                <td>{g.weaves[weave.id].description}</td>
                <td className="num">{weave.costBase} × {count(locale, weave.costGrowth)}<sup>n</sup></td>
                <td className="num">{weave.maxLevel > 0 ? weave.maxLevel : w.table.none}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    crown: <CrownBlock ctx={ctx} />
  };
}

export function accountSlots(ctx: WikiContext): Slots {
  const { t, locale } = ctx;
  return {
    boards: (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          <tbody>
            {BOARD_IDS.map((board) => (
              <tr key={board}>
                <th scope="row">{t.leaderboard.boards[board]}{board === "stage" ? <small>{t.leaderboard.official}</small> : null}</th>
                <td>{t.leaderboard.rules[board]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="wiki-note"><Link href={href(locale, "leaderboard")}>{t.wiki.slots.account.board}</Link></p>
      </div>
    )
  };
}
