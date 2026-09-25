"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/routing";
import { useCloud, useFormat, useGame, useUi } from "../context";
import { ClickIcon, EssenceIcon, GoldIcon, ShardIcon, SwordIcon } from "../icons";

export function GameHeader() {
  const { state, derived } = useGame();
  const cloud = useCloud();
  const ui = useUi();
  const fmt = useFormat();
  const { t, locale } = useI18n();
  const m = t.hud.header;
  const showEssences = state.essences > 0 || state.lifetime.ascensions > 0;

  return (
    <header className="game-header">
      <Link href={href(locale, "home")} className="game-logo" aria-label={m.home}>
        <img src="/assets/brand/idlebound-logo.webp" alt="Idlebound" width={900} height={341} />
      </Link>
      <div className="resource-bar" role="status" aria-live="off">
        <div className="resource resource-gold" title={m.gold}>
          <GoldIcon size={22} />
          <span className="resource-value" data-testid="gold">{fmt(state.gold)}</span>
        </div>
        <div className="resource" title={m.dpsTitle}>
          <SwordIcon />
          <span className="resource-label">DPS</span>
          <span className="resource-value">{fmt(derived.dps)}</span>
        </div>
        <div className="resource" title={m.clickTitle}>
          <ClickIcon />
          <span className="resource-label">{m.clickLabel}</span>
          <span className="resource-value">{fmt(derived.click)}</span>
        </div>
        {showEssences ? (
          <button type="button" className="resource resource-essence" title={m.essencesTitle} onClick={() => ui.openWindow("ascension")}>
            <EssenceIcon />
            <span className="resource-value">{fmt(state.essences)}</span>
          </button>
        ) : null}
        <button type="button" className="resource resource-shard" title={m.shardsTitle} onClick={() => ui.openWindow("market")}>
          <ShardIcon />
          <span className="resource-value">{fmt(state.shards)}</span>
        </button>
      </div>
      <button type="button" className={`account-chip ${cloud.user ? "is-online" : ""}`} onClick={() => ui.openWindow("account")}>
        <span className={`sync-dot sync-${cloud.status}`} aria-hidden="true" />
        <span className="account-name">{cloud.user ? cloud.user.username : m.guest}</span>
        {!cloud.user ? <span className="account-cta">{m.notSaved}</span> : null}
      </button>
    </header>
  );
}
