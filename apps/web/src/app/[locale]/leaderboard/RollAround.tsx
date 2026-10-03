"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import { api, type BoardId, type RollRow } from "@/lib/api";
import { boardValue } from "@/lib/boards";

/**
 * The logged-in walker's surroundings on a board: the walkers just ahead and just behind.
 * Read in the browser, with the session cookie; shown only when the walker is past the rows
 * already on the page (there, their own line is enough).
 */
export function RollAround({ board, shown }: { board: BoardId; shown: number }) {
  const { t } = useI18n();
  const l = t.leaderboard;
  const [rows, setRows] = useState<{ around: RollRow[]; me: RollRow } | null>(null);

  useEffect(() => {
    let live = true;
    void api.leaderboard(board).then((result) => {
      if (live && result.ok && result.data.me) setRows({ around: result.data.around, me: result.data.me });
    });
    return () => { live = false; };
  }, [board]);

  if (!rows || rows.me.rank <= shown || rows.around.length === 0) return null;
  return (
    <section className="board-around" aria-labelledby="board-around-title">
      <h2 id="board-around-title" className="board-section-title">{l.around}</h2>
      <div className="card board-table-wrap">
        <table className="board-table">
          <tbody>
            {rows.around.map((row) => (
              <tr key={row.rank} className={row.rank === rows.me.rank ? "me" : ""}>
                <td><span className="rank">{row.rank}</span></td>
                <td className="board-name">{row.username}</td>
                <td className="board-value">{boardValue(l, board, row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
