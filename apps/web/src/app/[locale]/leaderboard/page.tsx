import { formatNumber } from "@idlebound/game";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { href } from "@/i18n/routing";
import { BOARD_IDS, type BoardId } from "@/lib/boards";
import { getI18n } from "@/i18n/server";
import { fetchLeaderboard } from "@/lib/server-api";
import { fullTitle, pageAlternates, pageSocial } from "@/lib/site";
import "../landing.css";
import "./leaderboard.css";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ board?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, t } = await getI18n(params);
  return {
    title: t.leaderboard.metaTitle,
    description: t.leaderboard.metaDescription,
    alternates: pageAlternates(locale, "leaderboard"),
    ...pageSocial(locale, "leaderboard", { title: fullTitle(t.leaderboard.metaTitle), description: t.leaderboard.metaDescription, imageAlt: t.site.meta.ogImageAlt })
  };
}

export default async function LeaderboardPage({ params, searchParams }: Props) {
  const { locale, t } = await getI18n(params);
  const l = t.leaderboard;
  const { board: requested } = await searchParams;
  const board: BoardId = BOARD_IDS.find((entry) => entry === requested) ?? "stage";
  const format = (row: { value: number; maxStage: number }) =>
    board === "stage" ? l.stageValue(formatNumber(row.value))
      : board === "week" ? l.strideValue(formatNumber(row.value))
        : board === "descents" ? l.descentsValue(formatNumber(row.value), formatNumber(row.maxStage))
          : formatNumber(row.value);
  const data = await fetchLeaderboard(board, 100);
  const play = href(locale, "play");

  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <main className="page-content board-page">
        <h1>{l.title}</h1>
        <p className="board-subtitle">{l.subtitle}</p>
        <p className="board-intro">
          {l.intro}<Link href={play}>{l.introCta}</Link>{l.introEnd}
        </p>
        <nav className="board-tabs" aria-label={l.tabsLabel}>
          {BOARD_IDS.map((entry) => (
            <Link
              key={entry}
              href={`${href(locale, "leaderboard")}?board=${entry}`}
              className={entry === board ? "active" : ""}
              aria-current={entry === board ? "page" : undefined}
            >
              {l.boards[entry]}
              <span className="board-tab-meaning">{l.meanings[entry]}</span>
            </Link>
          ))}
        </nav>
        {data === null ? (
          <p className="board-empty card">{l.unavailable}</p>
        ) : data.rows.length === 0 ? (
          <p className="board-empty card">
            {board === "week" ? l.strideEmpty : l.empty}<Link href={play}>{board === "week" ? l.strideEmptyCta : l.emptyCta}</Link>
          </p>
        ) : (
          <div className="card board-table-wrap">
            <table className="board-table">
              <thead>
                <tr>
                  <th scope="col">{l.columns.rank}</th>
                  <th scope="col">{l.columns.player}</th>
                  <th scope="col">{l.boards[board]} <span className="board-th-meaning">({l.meanings[board]})</span></th>
                  <th scope="col" className="hide-sm">{l.columns.stage}</th>
                  <th scope="col" className="hide-sm">{l.columns.ascensions}</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.rank}>
                    <td><span className={`rank rank-${row.rank}`}>{row.rank}</span></td>
                    <td className="board-name">{row.username}</td>
                    <td className="board-value">{format(row)}</td>
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
