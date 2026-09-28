"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import type { Reaching } from "../cloud";

/**
 * The server did not answer at load. The walker's game lives there: rather than start a
 * blank one that looks like a loss, the gate waits, says so, and knocks again.
 */
export function LedgerAway({ reaching, onRetry }: { reaching: Reaching; onRetry: () => void }) {
  const { t } = useI18n();
  const m = t.hud.ledgerAway;
  const [now, setNow] = useState(() => Date.now());
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1_000);
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      clearInterval(tick);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const seconds = Math.ceil((reaching.nextAt - now) / 1000);

  return (
    <div className="game-loading ledger-away">
      <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
      <h1 className="ledger-away-title">{m.title}</h1>
      <p className="ledger-voice">{m.voice}</p>
      {/* The countdown is not read aloud every second: only the state is. */}
      <p className="ledger-away-text">{!online ? m.offline : seconds > 0 ? m.text(seconds) : m.trying}</p>
      <p className="visually-hidden" role="status" aria-live="polite">{online ? m.title : m.offline}</p>
      <button type="button" className="btn btn-gold" onClick={onRetry}>{m.retry}</button>
    </div>
  );
}
