import { formatNumber } from "@idlebound/game";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { href } from "@/i18n/routing";
import { getI18n } from "@/i18n/server";
import { fetchLeaderboard } from "@/lib/server-api";
import { pageAlternates } from "@/lib/site";
import "../landing.css";
import "./leaderboard.css";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ board?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: t.leaderboard.metaTitle,
    description: t.leaderboard.metaDescription,
    alternates: pageAlternates(locale, "leaderboard")
  };
}

const BOARDS = ["stage", "ascensions", "essences", "achievements"] as const;
type BoardId = (typeof BOARDS)[number];

export default async function LeaderboardPage({ params, searchParams }: Props) {
  const { locale, t } = await getI18n(params);
  const l = t.leaderboard;
  const { board: requested } = await searchParams;
  const board: BoardId = BOARDS.find((entry) => entry === requested) ?? "stage";
  const format = (value: number) => (board === "stage" ? l.stageValue(formatNumber(value)) : formatNumber(value));
  const data = await fetchLeaderboard(board, 100);
  const play = href(locale, "play");

  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <main className="page-content board-page">
        <h1>{l.title}</h1>
        <p className="board-intro">
          {l.intro}<Link href={play}>{l.introCta}</Link>{l.introEnd}
        </p>
        <nav className="board-tabs" aria-label={l.tabsLabel}>
          {BOARDS.map((entry) => (
            <Link
              key={entry}
              href={`${href(locale, "leaderboard")}?board=${entry}`}
              className={entry === board ? "active" : ""}
              aria-current={entry === board ? "page" : undefined}
            >
              {l.boards[entry]}
            </Link>
          ))}
        </nav>
        {data === null ? (
          <p className="board-empty card">{l.unavailable}</p>
        ) : data.rows.length === 0 ? (
          <p className="board-empty card">
            {l.empty}<Link href={play}>{l.emptyCta}</Link>
          </p>
        ) : (
          <div className="card board-table-wrap">
            <table className="board-table">
              <thead>
                <tr>
                  <th scope="col">{l.columns.rank}</th>
                  <th scope="col">{l.columns.player}</th>
                  <th scope="col">{l.boards[board]}</th>
                  <th scope="col" className="hide-sm">{l.columns.stage}</th>
                  <th scope="col" className="hide-sm">{l.columns.ascensions}</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.rank}>
                    <td><span className={`rank rank-${row.rank}`}>{row.rank}</span></td>
                    <td className="board-name">{row.username}</td>
                    <td className="board-value">{format(row.value)}</td>
                    <td className="hide-sm">{formatNumber(row.maxStage)}</td>
                    <td className="hide-sm">{formatNumber(row.ascensions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <SiteFooter locale={locale} route="leaderboard" />
    </div>
  );
}
