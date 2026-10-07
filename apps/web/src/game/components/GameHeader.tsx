"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/routing";
import type { CloudStatus } from "../cloud";
import { useCloud, useFormat, useGame, useMagnitude, useReveals, useStoreRef, useUi } from "../context";
import { ClickIcon, EssenceIcon, GoldIcon, Picto, ShardIcon, SwordIcon } from "../icons";
import { goldLandsAfter } from "../pixel/arena";

/**
 * States of the Ledger worth more than a dot: a word and a sign, read aloud when they come.
 * A guest's game is kept like an account's, so its troubles are told the same way.
 */
const TROUBLE: ReadonlySet<CloudStatus> = new Set<CloudStatus>(["error", "rejected", "unverified", "offline"]);

export function GameHeader() {
  const { state, derived } = useGame();
  const cloud = useCloud();
  const ui = useUi();
  const fmt = useFormat();
  const magnitude = useMagnitude();
  const { shown, freshClass } = useReveals();
  const { t, locale } = useI18n();
  const m = t.hud.header;
  // Out of fates, the game stands still until the Ledger answers: said before anything else.
  const waiting = useStoreRef().waiting;
  const trouble = waiting ? t.account.waiting.label : TROUBLE.has(cloud.status) ? t.account.status[cloud.status] : null;

  return (
    <header className="game-header">
      <Link href={href(locale, "home")} className="game-logo" aria-label={m.home}>
        <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
      </Link>
      <div className="resource-bar" role="status" aria-live="off">
        <div className="resource resource-gold" title={m.gold}>
          <GoldIcon size={22} />
          <GoldValue />
        </div>
        {shown.dps ? (
          <div className={`resource${freshClass("dps")}`} title={m.dpsTitle}>
            <SwordIcon />
            <span className="resource-label">{m.dpsLabel}</span>
            <span className="resource-value resource-value-fixed">{magnitude(derived.dps)}</span>
          </div>
        ) : null}
        {shown.click ? (
          <div className={`resource resource-click${freshClass("click")}`} title={m.clickTitle}>
            <ClickIcon />
            <span className="resource-label">{m.clickLabel}</span>
            <span className="resource-value resource-value-fixed">{magnitude(derived.click)}</span>
          </div>
        ) : null}
        {shown.essences ? (
          <button type="button" className={`resource resource-essence${freshClass("essences")}`} title={m.essencesTitle} onClick={() => ui.openWindow("ascension")}>
            <EssenceIcon />
            <span className="resource-value">{fmt(state.essences)}</span>
          </button>
        ) : null}
        {shown.shards ? (
          <button type="button" className={`resource resource-shard${freshClass("shards")}`} title={m.shardsTitle} onClick={() => ui.openWindow("market")}>
            <ShardIcon />
            <span className="resource-value">{fmt(state.shards)}</span>
          </button>
        ) : null}
      </div>
      <button
        type="button"
        className={`account-chip${cloud.user ? " is-online" : ""}${trouble ? " has-trouble" : ""}`}
        title={waiting ? t.account.waiting.title : cloud.user ? undefined : t.account.ledger.guestPlain}
        onClick={() => ui.openWindow("account")}
      >
        {trouble ? null : <span className={`sync-dot sync-${cloud.status}`} aria-hidden="true" />}
        <span className="account-name">{cloud.user ? cloud.user.username : t.account.ledger.guest}</span>
        {trouble ? (
          <span className={`sync-badge sync-badge-${waiting ? "waiting" : cloud.status}`}>
            <Picto name="warning" size={14} />
            <span className="sync-badge-text">{trouble}</span>
          </span>
        ) : null}
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">{trouble ?? ""}</span>
    </header>
  );
}

/**
 * The purse. A kill's gold is counted when its motes reach the counter, not when the monster
 * falls: until then the counter leaves out the gold still in flight. The purse is read from the
 * store itself, already holding that gold when the kill is told, never from a render behind it.
 */
function GoldValue() {
  const store = useStoreRef();
  const fmt = useMagnitude();
  const [inFlight, setInFlight] = useState(0);

  useEffect(() => {
    const flying = new Map<ReturnType<typeof setTimeout>, number>();
    const total = () => {
      let sum = 0;
      for (const value of flying.values()) sum += value;
      return sum;
    };
    const unsubscribe = store.onFx((event) => {
      if ((event.type !== "kill" && event.type !== "rout") || !(event.gold > 0)) return;
      const still = store.state.settings.reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const id = setTimeout(() => {
        flying.delete(id);
        setInFlight(total());
      }, goldLandsAfter(still) * 1000);
      flying.set(id, event.gold);
      setInFlight(total());
    });
    return () => {
      unsubscribe();
      for (const id of flying.keys()) clearTimeout(id);
    };
  }, [store]);

  return (
    <span className="resource-value resource-value-fixed" data-testid="gold">
      {fmt(Math.max(0, store.state.gold - inFlight))}
    </span>
  );
}
