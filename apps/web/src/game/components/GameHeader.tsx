"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/routing";
import { useCloud, useFormat, useGame, useReveals, useUi } from "../context";
import { ClickIcon, EssenceIcon, GoldIcon, ShardIcon, SwordIcon } from "../icons";

export function GameHeader() {
  const { state, derived } = useGame();
  const cloud = useCloud();
  const ui = useUi();
  const fmt = useFormat();
  const { shown, freshClass } = useReveals();
  const { t, locale } = useI18n();
  const m = t.hud.header;

  return (
    <header className="game-header">
      <Link href={href(locale, "home")} className="game-logo" aria-label={m.home}>
        <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
      </Link>
      <div className="resource-bar" role="status" aria-live="off">
        <div className="resource resource-gold" title={m.gold}>
          <GoldIcon size={22} />
          <span className="resource-value resource-value-fixed" data-testid="gold">{fmt(state.gold)}</span>
        </div>
        {shown.dps ? (
          <div className={`resource${freshClass("dps")}`} title={m.dpsTitle}>
            <SwordIcon />
            <span className="resource-label">DPS</span>
            <span className="resource-value resource-value-fixed">{fmt(derived.dps)}</span>
          </div>
        ) : null}
        {shown.click ? (
          <div className={`resource${freshClass("click")}`} title={m.clickTitle}>
            <ClickIcon />
            <span className="resource-label">{m.clickLabel}</span>
            <span className="resource-value resource-value-fixed">{fmt(derived.click)}</span>
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
        className={`account-chip ${cloud.user ? "is-online" : ""}`}
        title={cloud.user ? undefined : t.account.ledger.guestPlain}
        onClick={() => ui.openWindow("account")}
      >
        <span className={`sync-dot sync-${cloud.status}`} aria-hidden="true" />
        <span className="account-name">{cloud.user ? cloud.user.username : t.account.ledger.guest}</span>
        {!cloud.user ? <span className="account-cta">{m.notSaved}</span> : null}
      </button>
    </header>
  );
}
