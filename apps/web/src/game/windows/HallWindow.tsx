"use client";

import { ACHIEVEMENTS, achievementBonus, achievementText, formatDuration, intlLocale, type AchievementCategory } from "@idlebound/game";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import { api, type LeaderboardData } from "@/lib/api";
import { useCloud, useFormat, useGame, useUi } from "../context";
import { Picto, TrophyIcon } from "../icons";
import { Modal } from "../components/Modal";

const CATEGORIES: AchievementCategory[] = ["progression", "combat", "wealth", "companions", "ascension", "secrets"];

export function HallWindow({ onClose, initialTab }: { onClose: () => void; initialTab?: string }) {
  const [tab, setTab] = useState(initialTab ?? "achievements");
  const { state } = useGame();
  const { t } = useI18n();
  const text = t.windows.hall;
  return (
    <Modal
      title={text.title}
      icon={<TrophyIcon size={34} />}
      onClose={onClose}
      size="lg"
      tabs={[
        { id: "achievements", label: text.achievementsTab(state.achievements.length, ACHIEVEMENTS.length) },
        { id: "stats", label: text.statsTab },
        { id: "leaderboard", label: text.leaderboardTab }
      ]}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "achievements" ? <Achievements /> : tab === "stats" ? <Stats /> : <Leaderboard />}
    </Modal>
  );
}

function Achievements() {
  const { state } = useGame();
  const { t, g, locale } = useI18n();
  const text = t.windows.hall;
  const fmt = useFormat();
  const unlocked = new Set(state.achievements);
  return (
    <div>
      <p className="hall-bonus">{text.totalBonusLabel} <strong>{text.totalBonus(Math.round(achievementBonus(state) * 100))}</strong> {text.totalBonusNote}</p>
      {CATEGORIES.map((category) => (
        <section key={category}>
          <h3 className="section-heading">{g.achievementCategories[category]}</h3>
          <div className="achievement-grid">
            {ACHIEVEMENTS.filter((achievement) => achievement.category === category).map((achievement) => {
              const done = unlocked.has(achievement.id);
              const progress = Math.min(1, achievement.metric(state) / achievement.threshold);
              const copy = achievementText(achievement.id, locale);
              return (
                <article key={achievement.id} className={`achievement ${done ? "done" : ""}`}>
                  <Picto name={done ? "trophy" : "lock"} size={26} className="achievement-badge" />
                  <div>
                    <h4>{copy.name}</h4>
                    <p>{copy.description}</p>
                    {!done ? (
                      <div className="progress-line small" title={`${fmt(achievement.metric(state))} / ${fmt(achievement.threshold)}`}>
                        <span style={{ width: `${progress * 100}%` }} />
                      </div>
                    ) : null}
                  </div>
                  <span className="achievement-bonus">{text.achievementBonus(Math.round(achievement.bonus * 100))}</span>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Stats() {
  const { state } = useGame();
  const { t, locale } = useI18n();
  const text = t.windows.hall;
  const label = text.stats;
  const fmt = useFormat();
  const duration = (seconds: number) => formatDuration(seconds, locale);
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
  const extra: [string, string][] = [
    [label.bestStage, fmt(state.maxStageEver)],
    [label.ascensions, fmt(state.lifetime.ascensions)],
    [label.essencesEarned, fmt(state.lifetime.essencesEarned)],
    [label.shardsEarned, fmt(state.lifetime.shardsEarned)],
    [label.itemsFound, fmt(state.lifetime.itemsFound)],
    [label.legendariesMythics, `${state.lifetime.legendaries} / ${state.lifetime.mythics}`],
    [label.bossFails, fmt(state.lifetime.bossFails)],
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

const BOARDS = ["stage", "ascensions", "essences", "achievements"] as const;

function Leaderboard() {
  const cloud = useCloud();
  const ui = useUi();
  const { t } = useI18n();
  const text = t.windows.hall;
  const fmt = useFormat();
  const [board, setBoard] = useState<(typeof BOARDS)[number]>("stage");
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    void api.leaderboard(board).then((result) => {
      if (cancelled) return;
      if (result.ok) setData(result.data);
      else setError(result.error);
    });
    return () => {
      cancelled = true;
    };
  }, [board, cloud.revision]);

  return (
    <div>
      <div className="board-tabs-inline" role="tablist">
        {BOARDS.map((id) => (
          <button key={id} type="button" role="tab" aria-selected={board === id} className={board === id ? "active" : ""} onClick={() => setBoard(id)}>
            {text.boards[id]}
          </button>
        ))}
      </div>
      {!cloud.user ? (
        <p className="board-cta">
          {text.joinPrompt}{" "}
          <button type="button" className="btn btn-gold btn-sm" onClick={() => ui.openWindow("account")}>{text.createAccount}</button>
        </p>
      ) : data?.me ? (
        <p className="board-cta">{text.yourRankLabel} <strong>#{data.me.rank}</strong> {text.yourRankValue(fmt(data.me.value))}</p>
      ) : (
        <p className="board-cta">{text.nextSaveJoins}</p>
      )}
      {error ? <p className="form-error">{error}</p> : null}
      {data ? (
        data.rows.length === 0 ? <p className="empty-state">{text.nobodyYet}</p> : (
          <ol className="board-list">
            {data.rows.map((row) => (
              <li key={row.rank} className={cloud.user?.username === row.username ? "me" : ""}>
                <span className={`rank rank-${row.rank}`}>{row.rank}</span>
                <span className="board-name">{row.username}</span>
                <span className="board-value">{fmt(row.value)}</span>
              </li>
            ))}
          </ol>
        )
      ) : !error ? <p className="empty-state">{text.loading}</p> : null}
    </div>
  );
}
