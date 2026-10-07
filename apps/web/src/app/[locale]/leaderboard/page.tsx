import { intlLocale } from "@idlebound/game";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { href } from "@/i18n/routing";
import { BOARD_IDS, boardValue, stageText, type BoardId } from "@/lib/boards";
import { getI18n } from "@/i18n/server";
import { fetchLeaderboard } from "@/lib/server-api";
import { fullTitle, pageAlternates, pageSocial } from "@/lib/site";
import { RollAround } from "./RollAround";
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
  const data = await fetchLeaderboard(board, 100);
  const play = href(locale, "play");
  const day = new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: "medium" });

  return (
    <div className="page-shell">
      <SiteNav locale={locale} />
      <main id="main" className="page-content board-page">
        <h1>{l.title}</h1>
        <p className="board-subtitle">{l.subtitle}</p>
        <p className="board-intro">
          {l.intro}<Link href={play}>{l.introCta}</Link>{l.introEnd}
        </p>
        <nav className="board-tabs" aria-label={l.tabsLabel}>
          {BOARD_IDS.map((entry) => (
            <Link
              key={entry}
              href={`${href(locale, "leaderboard")}${entry === "stage" ? "" : `?board=${entry}`}`}
              className={entry === board ? "active" : ""}
              aria-current={entry === board ? "page" : undefined}
            >
              {l.boards[entry]}
              {entry === "stage" ? <span className="board-official">{l.official}</span> : null}
            </Link>
          ))}
        </nav>
        <p className="board-rule">
          {l.rules[board]}
          {board === "stage" ? null : <span className="board-ties">{l.ties}</span>}
        </p>
        {data === null ? (
          <p className="board-empty card">{l.unavailable}</p>
        ) : data.rows.length === 0 ? (
          <p className="board-empty card">{l.empty}<Link href={play}>{l.emptyCta}</Link></p>
        ) : (
          <>
            <RollAround board={board} shown={data.rows.length} />
            <div className="card board-table-wrap">
              <table className="board-table">
                <thead>
                  <tr>
                    <th scope="col">{l.columns.rank}</th>
                    <th scope="col">{l.columns.player}</th>
                    <th scope="col">{l.boards[board]}</th>
                    <th scope="col" className="hide-sm">{board === "stage" ? l.columns.reached : l.columns.stage}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row) => (
                    <tr key={row.rank}>
                      <td><span className={`rank rank-${row.rank}`}>{row.rank}</span></td>
                      <td className="board-name">{row.username}</td>
                      <td className="board-value">{boardValue(l, board, row.value)}</td>
                      <td className="hide-sm">{board === "stage" ? day.format(new Date(row.reachedAt)) : stageText(row.maxStage)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
      <SiteFooter locale={locale} route="leaderboard" />
    </div>
  );
}
