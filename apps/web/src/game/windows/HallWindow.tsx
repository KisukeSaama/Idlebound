"use client";

import {
  ACHIEVEMENTS,
  BESTIARY,
  BESTIARY_GOLD_PAGES,
  BESTIARY_PAGE_GOLD,
  BESTIARY_PAGES,
  CHRONICLE_SOURCES,
  SECRET_SERIES,
  achievementBonus,
  achievementText,
  ageName,
  bestiaryKills,
  bestiaryMet,
  bestiaryPageComplete,
  bestiaryTier,
  chronicleCount,
  chronicleText,
  formatDuration,
  gameText,
  intlLocale,
  kingWord,
  promisesKeptInAll,
  seenOf,
  sourceCount,
  sourceEntries,
  stratumTag,
  unreadChronicle,
  witnessedCutscenes,
  type AchievementCategory,
  type AscensionRecord,
  type ChronicleEntry,
  type ChronicleSource,
  type Locale
} from "@idlebound/game";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import type { Messages } from "@/i18n/messages";
import { BOARD_IDS, api, type BoardId, type LeaderboardData, type RollRow } from "@/lib/api";
import { boardValue } from "@/lib/boards";
import { perPublish, useCloud, useFormat, useGame, useStoreRef, useUi } from "../context";
import { Picto, TrophyIcon } from "../icons";
import { Modal } from "../components/Modal";
import { PixelSprite } from "../pixel/PixelSprite";
import { creatureSource } from "../pixel/sources";
import { useRemembered } from "../remembered";

const CATEGORIES: AchievementCategory[] = ["progression", "combat", "wealth", "companions", "ascension", "secrets"];
/** A new save moves the walker on the Roll: the board is read again, at most once a minute. */
const ROLL_REFRESH_MS = 60_000;

/** The Hall: the Ledger's reading room (Deeds, Chronicle, Bestiary, its own pages, the Roll). */
export function HallWindow({ onClose, initialTab }: { onClose: () => void; initialTab?: string }) {
  const [tab, setTab] = useState(initialTab ?? "achievements");
  const { state, store } = useGame();
  const { t } = useI18n();
  const text = t.windows.hall;
  // The Bestiary opens with the first creature met, the Chronicle with the first fragment.
  const met = bestiaryMet(state);
  const hasChronicle = chronicleCount(state) > 0 || state.ascensions.length > 0;
  return (
    <Modal
      title={text.title}
      icon={<TrophyIcon size={34} />}
      onClose={onClose}
      size="lg"
      tabs={[
        { id: "achievements", label: text.achievementsTab(state.achievements.length, ACHIEVEMENTS.length) },
        ...(hasChronicle ? [{ id: "chronicle", label: text.chronicleTab(perPublish(store, "unread", () => unreadChronicle(state))) }] : []),
        ...(met > 0 ? [{ id: "bestiary", label: text.bestiaryTab(met, BESTIARY.length) }] : []),
        { id: "stats", label: text.statsTab },
        { id: "leaderboard", label: text.leaderboardTab }
      ]}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "achievements" ? <Achievements />
        : tab === "chronicle" && hasChronicle ? <Chronicle />
          : tab === "bestiary" && met > 0 ? <Bestiary />
            : tab === "stats" ? <Stats /> : tab === "leaderboard" ? <Leaderboard /> : <Achievements />}
    </Modal>
  );
}

/** The deeds of each category, in the Ledger's order. */
const DEEDS = CATEGORIES.map((category) => ({ category, deeds: ACHIEVEMENTS.filter((achievement) => achievement.category === category) })).filter(({ deeds }) => deeds.length > 0);

function Achievements() {
  const { state } = useGame();
  const { t, g, locale } = useI18n();
  const text = t.windows.hall;
  const fmt = useFormat();
  const unlocked = new Set(state.achievements);
  return (
    <div>
      <p className="hall-bonus">{text.totalBonusLabel} <strong>{text.totalBonus(Math.round(achievementBonus(state) * 100))}</strong> {text.totalBonusNote}</p>
      {DEEDS.map(({ category, deeds }) => (
        <section key={category}>
          <h3 className="section-heading">{g.achievementCategories[category]}</h3>
          <div className="achievement-grid">
            {deeds.map((achievement) => {
              const done = unlocked.has(achievement.id);
              // A deed done or secret shows no progress: its metric is not read.
              const value = done || achievement.series === SECRET_SERIES ? 0 : achievement.metric(state);
              return <Deed key={achievement.id} achievement={achievement} done={done} value={value} locale={locale} text={text} fmt={fmt} />;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/** One deed of the Ledger; memoized, it only renders again when its progress moves. */
const Deed = memo(function Deed({ achievement, done, value, locale, text, fmt }: {
  achievement: (typeof ACHIEVEMENTS)[number];
  done: boolean;
  value: number;
  locale: Locale;
  text: Messages["windows"]["hall"];
  fmt: (value: number) => string;
}) {
  const copy = achievementText(achievement.id, locale);
  // A secret deed hides its name until earned; its riddle is the only clue.
  const secret = achievement.series === SECRET_SERIES;
  if (secret && !done) copy.name = text.hiddenDeed;
  return (
    <article className={`achievement ${done ? "done" : ""}`}>
      <Picto name={done ? "trophy" : "lock"} size={26} className="achievement-badge" />
      <div>
        <h4>{copy.name}</h4>
        <p>{copy.description}</p>
        {!done && !secret ? (
          <div className="progress-line small" title={`${fmt(value)} / ${fmt(achievement.threshold)}`}>
            <span style={{ width: `${Math.min(1, value / achievement.threshold) * 100}%` }} />
          </div>
        ) : null}
      </div>
      {achievement.bonus > 0 ? <span className="achievement-bonus">{text.achievementBonus(Math.round(achievement.bonus * 100))}</span> : null}
    </article>
  );
});

/** Biscuit's page: a blank page with a paw print, no name, no line. */
function PawPrint() {
  return (
    <svg width={40} height={40} viewBox="0 0 20 20" aria-hidden="true" className="bestiary-paw">
      <ellipse cx="10" cy="13.2" rx="3.6" ry="3" />
      <ellipse cx="5.2" cy="8.6" rx="1.5" ry="1.9" transform="rotate(-18 5.2 8.6)" />
      <ellipse cx="8.2" cy="5.6" rx="1.5" ry="2" transform="rotate(-6 8.2 5.6)" />
      <ellipse cx="11.8" cy="5.6" rx="1.5" ry="2" transform="rotate(6 11.8 5.6)" />
      <ellipse cx="14.8" cy="8.6" rx="1.5" ry="1.9" transform="rotate(18 14.8 8.6)" />
    </svg>
  );
}

/** The Ledger's pages: every Remnant met, its three lines, silhouettes for the others. */
function Bestiary() {
  const { state } = useGame();
  const { t, g } = useI18n();
  const text = t.windows.hall;
  const fmt = useFormat();
  const goodBoy = state.secrets.includes("good-boy");
  return (
    <div className="bestiary">
      <p className="modal-hint">{text.bestiaryIntro}</p>
      {BESTIARY_PAGES.map((page) => {
        const entries = BESTIARY.filter((entry) => entry.page === page);
        // A page opens with its first creature met (the Kings' with a form beyond the first).
        const blank = page === "specials" && goodBoy;
        if (!blank && !entries.some((entry) => bestiaryKills(state, entry.id) > 0)) return null;
        const rewarded = BESTIARY_GOLD_PAGES.includes(page);
        const complete = bestiaryPageComplete(state, page);
        const pct = Math.round(BESTIARY_PAGE_GOLD * 100);
        return (
          <section key={page}>
            <h3 className="section-heading bestiary-heading">
              {g.bestiaryPages[page]}
              {rewarded ? <span className={`bestiary-bonus ${complete ? "done" : ""}`}>{complete ? text.pageBonus(pct) : text.pageBonusPending(pct)}</span> : null}
            </h3>
            <div className="bestiary-grid">
              {entries.map((entry) => {
                const kills = bestiaryKills(state, entry.id);
                const tier = bestiaryTier(entry, kills);
                const lines = g.bestiary[entry.id] ?? ["", "", ""];
                const next = entry.tiers[tier];
                return (
                  <article key={entry.id} className={`bestiary-entry ${tier > 0 ? "met" : "unknown"}`}>
                    <div className="bestiary-portrait">
                      <PixelSprite source={creatureSource(entry.id, 0, false)} size={112} className="bestiary-sprite" />
                    </div>
                    <div>
                      <h4>{tier > 0 ? g.monsters[entry.id] : text.unknownCreature}</h4>
                      {tier > 0 ? <p className="bestiary-count">{text.kills(fmt(kills))}{next !== undefined ? ` · ${text.nextLine(fmt(next))}` : ""}</p> : null}
                      {lines.slice(0, tier).map((line) => <p key={line} className="bestiary-line">{line}</p>)}
                    </div>
                  </article>
                );
              })}
              {blank ? (
                <article className="bestiary-entry bestiary-blank" aria-label={t.chronicle.pawPrint}>
                  <div className="bestiary-portrait">
                    <PawPrint />
                  </div>
                  <div aria-hidden="true"><h4>…</h4></div>
                </article>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Entries shown per source before "show more", and how many each press adds. */
const SHOWN = 8;
const MORE = 50;

/** Every fragment found, by source. Opening it marks them read; this visit still shows what was new. */
function Chronicle() {
  const { state, store } = useGame();
  const { t } = useI18n();
  const counts = CHRONICLE_SOURCES.map((source) => sourceCount(state, source));
  const total = counts.reduce((sum, count) => sum + count, 0);
  const [seenBefore] = useState(() => CHRONICLE_SOURCES.map((source) => seenOf(state, source)));
  useEffect(() => {
    const current = store.state;
    if (CHRONICLE_SOURCES.every((source) => seenOf(current, source) >= sourceCount(current, source))) return;
    store.act((engine) => {
      for (const source of CHRONICLE_SOURCES) {
        const count = sourceCount(engine.state, source);
        if (seenOf(engine.state, source) < count) engine.state.lore.seen[source] = count;
      }
    });
  }, [store, total]);
  return (
    <div className="chronicle">
      <p className="modal-hint">{t.windows.hall.chronicleIntro}</p>
      <SceneList />
      {state.ascensions.length > 0 ? <NightList nights={state.lifetime.ascensions} descents={state.descents} records={state.ascensions.length} /> : null}
      {CHRONICLE_SOURCES.map((source, index) => (counts[index] > 0 ? <ChronicleSection key={source} source={source} count={counts[index]} seen={seenBefore[index]} /> : null))}
    </div>
  );
}

/** The Ledger's scenes the walker has lived, each to be seen again. */
function SceneList() {
  const { state } = useGame();
  const ui = useUi();
  const { t, locale } = useI18n();
  const scenes = witnessedCutscenes(state);
  if (scenes.length === 0) return null;
  const names = gameText(locale).cutscenes;
  return (
    <section className="scene-list">
      <h3 className="section-heading">{t.chronicle.scenes} <span className="chronicle-count">{t.chronicle.scenesHint}</span></h3>
      <ul>
        {scenes.map((id) => (
          <li key={id}>
            <button type="button" className="btn btn-ghost btn-sm" aria-label={t.chronicle.watch(names[id].name)} onClick={() => ui.playCutscene(id)}>
              <Picto name="moon" size={16} />
              {names[id].name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** How much of a long list is open, with the button that opens more or folds it back. */
function useShown(total: number) {
  const [limit, setLimit] = useState(SHOWN);
  return { limit, more: total > limit ? () => setLimit(limit + MORE) : null, less: limit > SHOWN ? () => setLimit(SHOWN) : null };
}

function ShowMore({ remaining, more, less }: { remaining: number; more: (() => void) | null; less: (() => void) | null }) {
  const { t } = useI18n();
  if (!more && !less) return null;
  return (
    <div className="chronicle-more">
      {more ? <button type="button" className="btn btn-ghost btn-sm" onClick={more}>{t.chronicle.showMore(remaining)}</button> : null}
      {less ? <button type="button" className="link-button" onClick={less}>{t.chronicle.showLess}</button> : null}
    </div>
  );
}

/**
 * One source of the Chronicle, newest first. Memoized on its count: the lines (some written
 * by the grammar) are only built again when a fragment is found or more are shown.
 */
const ChronicleSection = memo(function ChronicleSection({ source, count, seen }: { source: ChronicleSource; count: number; seen: number }) {
  const store = useStoreRef();
  const { t, locale } = useI18n();
  const text = t.chronicle;
  const { limit, more, less } = useShown(count);
  const items = useMemo(() => {
    const entries = sourceEntries(store.state, source);
    const shown: { entry: ChronicleEntry; index: number }[] = [];
    for (let index = entries.length - 1; index >= 0 && shown.length < limit; index -= 1) shown.push({ entry: entries[index], index });
    return shown.map(({ entry, index }) => ({ index, line: chronicleText(entry, locale), place: keystonePlace(entry, locale, text) }));
    // `count` stands for the entries: they only change when a fragment is found.
  }, [store, source, count, limit, locale, text]);
  const fresh = Math.max(0, count - seen);
  return (
    <section>
      <h3 className="section-heading chronicle-heading">
        {text.sources[source]} <span className="chronicle-count">{count}</span>
        {fresh > 0 ? <span className="fragment-new">{text.newCount(fresh)}</span> : null}
      </h3>
      <ol className="chronicle-list">
        {items.map(({ index, line, place }) => {
          const isNew = index >= seen;
          return (
            <li key={index} className={`fragment ${isNew ? "unread" : ""}`}>
              <blockquote>{line.text}</blockquote>
              <p className="fragment-by">
                {[line.by, place].filter(Boolean).join(" · ")}
                {isNew ? <span className="fragment-new">{t.windows.hall.unread}</span> : null}
              </p>
            </li>
          );
        })}
      </ol>
      <ShowMore remaining={count - items.length} more={more} less={less} />
    </section>
  );
});

/** Where a keystone was read: its stratum and Age, and the Descent of a second reading. */
function keystonePlace(entry: ChronicleEntry, locale: Locale, text: { presentNight: string; reading: (descent: number) => string }): string {
  if (entry.source !== "keystone") return "";
  const parts = [stratumTag(entry.era, locale) || text.presentNight, ageName(entry.era, locale)];
  if (entry.reading) parts.push(text.reading(entry.reading));
  return parts.filter(Boolean).join(" · ");
}

/**
 * The Night list: the ascension history (the last hundred), one line a night, newest first.
 * A night's number counts back from the lifetime total; a Descent's, from the Descents.
 */
const NightList = memo(function NightList({ nights, descents, records }: { nights: number; descents: number; records: number }) {
  const store = useStoreRef();
  const { t, locale } = useI18n();
  const text = t.chronicle;
  const fmt = useFormat();
  const { limit, more, less } = useShown(records);
  const lines = useMemo(() => {
    const history: AscensionRecord[] = store.state.ascensions;
    const out: { key: number; text: string; word: string }[] = [];
    let nightsAfter = 0;
    let descentsAfter = 0;
    for (let index = history.length - 1; index >= 0 && out.length < limit; index -= 1) {
      const record = history[index];
      if (record.threads !== undefined) {
        out.push({ key: index, text: text.descentLine(fmt(descents - descentsAfter), fmt(record.maxStage), fmt(record.threads)), word: "" });
        descentsAfter += 1;
      } else {
        const night = nights - nightsAfter;
        const word = kingWord(night, locale);
        out.push({ key: index, text: text.nightLine(fmt(night), fmt(record.maxStage), fmt(record.essences)), word: word ? text.kingSaid(word) : "" });
        nightsAfter += 1;
      }
    }
    return out;
    // `records` and the totals stand for the history: it only grows at dusk.
  }, [store, nights, descents, records, limit, locale, text, fmt]);
  return (
    <section className="night-list">
      <h3 className="section-heading">{text.nights} <span className="chronicle-count">{text.nightsHint}</span></h3>
      <ol className="chronicle-list">
        {lines.map((line) => (
          <li key={line.key} className="night-line">
            {line.text}{line.word ? <> <em>{line.word}</em></> : null}
          </li>
        ))}
      </ol>
      <ShowMore remaining={records - lines.length} more={more} less={less} />
    </section>
  );
});

function Stats() {
  const { state } = useGame();
  const { t, locale } = useI18n();
  const text = t.windows.hall;
  const label = text.stats;
  const more = t.chronicle.stats;
  const fmt = useFormat();
  const duration = (seconds: number) => formatDuration(seconds, locale);
  const met = bestiaryMet(state);
  const fragments = chronicleCount(state);
  const rows: [string, string, string][] = [
    [label.playTime, duration(state.run.playTime), duration(state.lifetime.playTime)],
    [label.clicks, fmt(state.run.clicks), fmt(state.lifetime.clicks)],
    [label.crits, fmt(state.run.crits), fmt(state.lifetime.crits)],
    [label.kills, fmt(state.run.kills), fmt(state.lifetime.kills)],
    [label.bosses, fmt(state.run.bosses), fmt(state.lifetime.bosses)],
    [label.treasures, fmt(state.run.treasures), fmt(state.lifetime.treasures)],
    [label.goldEarned, fmt(state.run.goldEarned), fmt(state.lifetime.goldEarned)],
    [label.crystals, fmt(state.run.crystals), fmt(state.lifetime.crystals)],
    [label.skillsUsed, fmt(state.run.skillsUsed), fmt(state.lifetime.skillsUsed)],
    [label.maxHit, fmt(state.run.maxHit), fmt(state.lifetime.maxHit)]
  ];
  // The Ledger's later pages appear once there is something to write on them.
  const optional: [string, string, boolean][] = [
    [more.kings, fmt(state.lifetime.kings), state.lifetime.kings > 0],
    [more.seams, fmt(state.lifetime.seams), state.lifetime.seams > 0],
    [more.descents, fmt(state.descents), state.descents > 0],
    [more.threads, fmt(state.lifetime.threads), state.lifetime.threads > 0],
    [more.fragments, fmt(fragments), fragments > 0],
    [more.bestiary, `${met} / ${BESTIARY.length}`, met > 0]
  ];
  const extra: [string, string][] = [
    [label.bestStage, fmt(state.maxStageEver)],
    [label.ascensions, fmt(state.lifetime.ascensions)],
    [label.essencesEarned, fmt(state.lifetime.essencesEarned)],
    [label.shardsEarned, fmt(state.lifetime.shardsEarned)],
    [label.itemsFound, fmt(state.lifetime.itemsFound)],
    [label.legendariesMythics, `${state.lifetime.legendaries} / ${state.lifetime.mythics}`],
    [label.bossFails, fmt(state.lifetime.bossFails)],
    ...optional.filter(([, , shown]) => shown).map(([name, value]): [string, string] => [name, value]),
    [label.offlineTime, duration(state.lifetime.offlineSeconds)],
    [label.startedOn, new Date(state.createdAt).toLocaleDateString(intlLocale(locale), { dateStyle: "long" })]
  ];
  return (
    <div className="stats-layout">
      <table className="stats-table">
        <thead>
          <tr><th scope="col" /><th scope="col">{text.thisLife}</th><th scope="col">{text.total}</th></tr>
        </thead>
        <tbody>
          {rows.map(([name, run, total]) => (
            <tr key={name}><th scope="row">{name}</th><td>{run}</td><td>{total}</td></tr>
          ))}
        </tbody>
      </table>
      <dl className="stats-list">
        {extra.map(([name, value]) => (
          <div key={name}><dt>{name}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </div>
  );
}

/**
 * The Roll: its boards (each tally once the walker has one), the board's rule, the walkers
 * around this one, then the top of the board.
 */
function Leaderboard() {
  const cloud = useCloud();
  const ui = useUi();
  const { state } = useGame();
  const { t } = useI18n();
  const text = t.windows.hall;
  const roll = t.leaderboard;
  const fmt = useFormat();
  const tallies: Record<BoardId, number> = { stage: 1, kings: state.lifetime.kings, promises: promisesKeptInAll(state), crystals: state.lifetime.crystals };
  const boards = BOARD_IDS.filter((id) => tallies[id] > 0);
  const [board, setBoard] = useRemembered<BoardId>("roll-board", boards, "stage");
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef<{ board: BoardId; at: number } | null>(null);

  useEffect(() => {
    const last = fetched.current;
    if (last && last.board === board && Date.now() - last.at < ROLL_REFRESH_MS) return;
    fetched.current = { board, at: Date.now() };
    setError(null);
    void api.leaderboard(board).then((result) => {
      // Only the board still chosen: another one may have been picked meanwhile.
      if (fetched.current?.board !== board) return;
      if (result.ok) setData(result.data);
      else setError(result.error);
    });
  }, [board, cloud.revision]);

  // Rows of the board just chosen only: the previous board's stay hidden while it loads.
  const shown = data && data.board === board ? data : null;
  const me = shown?.me ?? null;
  // The walkers around matter when the walker's own line is not already among the top rows.
  const around = me && shown && !shown.rows.some((row) => row.rank === me.rank) ? shown.around : [];

  return (
    <div>
      <p className="roll-title">{roll.title}</p>
      {boards.length > 1 ? (
        <div className="board-tabs-inline" role="tablist" aria-label={roll.tabsLabel}>
          {boards.map((id) => (
            <button key={id} type="button" role="tab" aria-selected={board === id} className={board === id ? "active" : ""} onClick={() => setBoard(id)}>
              {roll.boards[id]}
              {id === "stage" ? <span className="board-official">{roll.official}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
      <p className="board-rule">{roll.rules[board]}{board === "stage" ? "" : ` ${roll.ties}`}</p>
      {!cloud.user ? (
        <p className="board-cta">
          {text.joinPrompt}{" "}
          <button type="button" className="btn btn-gold btn-sm" onClick={() => ui.openWindow("account")}>{text.createAccount}</button>
        </p>
      ) : me ? (
        <p className="board-cta">{text.yourRankLabel} <strong>#{me.rank}</strong> {text.yourRankValue(boardValue(roll, board, me.value, fmt))}</p>
      ) : shown ? (
        <p className="board-cta">{text.nextSaveJoins}</p>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}
      {around.length > 0 ? (
        <section>
          <h3 className="section-heading">{roll.around}</h3>
          <RollList board={board} rows={around} me={me} />
        </section>
      ) : null}
      {shown ? (
        shown.rows.length === 0 ? <p className="empty-state">{text.nobodyYet}</p> : (
          <section>
            {around.length > 0 ? <h3 className="section-heading">{roll.top}</h3> : null}
            <RollList board={board} rows={shown.rows} me={me} />
          </section>
        )
      ) : !error ? <p className="empty-state">{text.loading}</p> : null}
    </div>
  );
}

/** Walkers of a board, the walker's own line marked. */
function RollList({ board, rows, me }: { board: BoardId; rows: RollRow[]; me: RollRow | null }) {
  const { t } = useI18n();
  const fmt = useFormat();
  return (
    <ol className="board-list">
      {rows.map((row) => (
        <li key={row.rank} className={me?.rank === row.rank ? "me" : ""}>
          <span className={`rank rank-${row.rank}`}>{row.rank}</span>
          <span className="board-name">{row.username}</span>
          <span className="board-value">{boardValue(t.leaderboard, board, row.value, fmt)}</span>
        </li>
      ))}
    </ol>
  );
}
