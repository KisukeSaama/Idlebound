"use client";

import {
  CLICK_HERO_ID,
  HEROES,
  UPGRADE_BY_ID,
  heroCost,
  heroCostMultiplier,
  maxAffordableLevels,
  milestoneMultiplier,
  talentName,
  upgradeCost,
  type BuyMode,
  type HeroDef
} from "@idlebound/game";
import { memo } from "react";
import { useI18n } from "@/i18n/client";
import type { Messages } from "@/i18n/messages";
import { useFormat, useGame } from "../context";
import { GoldIcon } from "../icons";
import { describeEffect } from "../text";

const MODES: BuyMode[] = [1, 10, 25, 100, "max"];

export function HeroPanel() {
  const { state, derived, store } = useGame();
  const fmt = useFormat();
  const { t, g, locale } = useI18n();
  const m = t.hud.heroes;
  const mode = state.settings.buyMode;
  const costMultiplier = heroCostMultiplier(state);
  const affordableTalents = Object.keys(UPGRADE_BY_ID).filter((id) => {
    const entry = UPGRADE_BY_ID[id];
    return !state.heroUpgrades.includes(id) && (state.heroLevels[entry.hero.id] ?? 0) >= entry.upgrade.level && upgradeCost(id) <= state.gold;
  }).length;

  // Show the hired companions, the next one, and a mystery preview of the one after.
  let lastHired = 0;
  HEROES.forEach((hero, index) => {
    if ((state.heroLevels[hero.id] ?? 0) > 0) lastHired = index;
  });
  const visible = HEROES.slice(0, Math.min(HEROES.length, Math.max(2, lastHired + 2)));
  const mystery = HEROES[visible.length];

  return (
    <aside className="hero-panel" aria-label={m.title}>
      <div className="hero-panel-head">
        <h2>{m.title}</h2>
        <div className="buy-modes" role="radiogroup" aria-label={m.buyAmount}>
          {MODES.map((entry) => (
            <button
              key={String(entry)}
              type="button"
              role="radio"
              aria-checked={mode === entry}
              className={mode === entry ? "active" : ""}
              onClick={() => store.act((engine) => { engine.state.settings.buyMode = entry; })}
            >
              {entry === "max" ? m.max : `×${entry}`}
            </button>
          ))}
        </div>
      </div>
      {affordableTalents > 0 ? (
        <button type="button" className="btn btn-violet btn-sm talents-all" onClick={() => store.act((engine, now) => engine.buyAllUpgrades(now))}>
          {m.buyAllTalents(affordableTalents)}
        </button>
      ) : null}
      <ol className="hero-list">
        {visible.map((hero) => {
          const level = state.heroLevels[hero.id] ?? 0;
          const purchase = mode === "max"
            ? { count: Math.max(1, maxAffordableLevels(hero, level, state.gold, costMultiplier)), cost: 0 }
            : { count: mode, cost: 0 };
          purchase.cost = heroCost(hero, level, purchase.count, costMultiplier);
          const share = derived.dps > 0 ? (derived.heroDps[hero.id] ?? 0) / derived.dps : 0;
          const talents = hero.upgrades.map((upgrade) => ({
            id: upgrade.id,
            level: upgrade.level,
            name: talentName(upgrade.id, locale),
            text: describeEffect(upgrade.effect, g.heroes[hero.id].name, locale),
            cost: upgradeCost(upgrade.id),
            owned: state.heroUpgrades.includes(upgrade.id),
            reachable: level >= upgrade.level
          }));
          return (
            <HeroRow
              key={hero.id}
              hero={hero}
              level={level}
              count={purchase.count}
              cost={purchase.cost}
              affordable={purchase.cost <= state.gold}
              gold={state.gold}
              value={hero.id === CLICK_HERO_ID ? derived.click : derived.heroDps[hero.id] ?? 0}
              share={share}
              nextMilestone={nextMilestone(level)}
              talents={talents}
              text={g.heroes[hero.id]}
              m={m}
              fmt={fmt}
              onBuy={() => store.act((engine, now) => engine.buyHero(hero.id, mode, now))}
              onTalent={(id) => store.act((engine, now) => engine.buyUpgrade(id, now))}
            />
          );
        })}
        {mystery ? (
          <li className="hero-row mystery" aria-label={m.mysteryLabel}>
            <div className="hero-medallion" aria-hidden="true">?</div>
            <div className="hero-info">
              <div className="hero-name">{m.mysteryName}</div>
              <div className="hero-sub">{m.mysteryHint(g.heroes[visible[visible.length - 1].id].name)}<GoldIcon size={13} /> {fmt(mystery.baseCost)}</div>
            </div>
          </li>
        ) : null}
      </ol>
    </aside>
  );
}

/** Next automatic milestone (×3.5 every 25 levels from level 200). */
function nextMilestone(level: number): number | null {
  if (level < 150) return null;
  if (level < 200) return 200;
  return 200 + (Math.floor((level - 200) / 25) + 1) * 25;
}

interface Talent {
  id: string;
  level: number;
  name: string;
  text: string;
  cost: number;
  owned: boolean;
  reachable: boolean;
}

interface HeroRowProps {
  hero: HeroDef;
  level: number;
  count: number;
  cost: number;
  affordable: boolean;
  gold: number;
  value: number;
  share: number;
  nextMilestone: number | null;
  talents: Talent[];
  text: { name: string; title: string; lore: string };
  m: Messages["hud"]["heroes"];
  fmt: (value: number) => string;
  onBuy: () => void;
  onTalent: (id: string) => void;
}

const HeroRow = memo(function HeroRow({ hero, level, count, cost, affordable, gold, value, share, nextMilestone, talents, text, m, fmt, onBuy, onTalent }: HeroRowProps) {
  const isClick = hero.id === CLICK_HERO_ID;
  const hired = level > 0;
  return (
    <li className={`hero-row ${hired ? "hired" : "unhired"} ${affordable ? "affordable" : ""}`} style={{ ["--hero" as string]: hero.color }}>
      <div className="hero-medallion" aria-hidden="true">
        <span className="hero-glyph">{hero.glyph}</span>
        {hired ? <span className="hero-level">{level}</span> : null}
      </div>
      <div className="hero-info">
        <div className="hero-name" title={text.lore}>
          {text.name} <span className="hero-title">{text.title}</span>
        </div>
        <div className="hero-sub">
          {isClick
            ? <>{m.click}<strong>{fmt(value)}</strong></>
            : hired
              ? <>{m.dps}<strong>{fmt(value)}</strong>{share >= 0.01 ? <span className="hero-share">{m.share(Math.round(share * 100))}</span> : null}</>
              : <>{m.dpsPerLevel(fmt(hero.baseDps))}</>}
          {nextMilestone ? <span className="hero-milestone" title={m.milestoneTitle(fmt(milestoneMultiplier(level)))}>{m.milestone(nextMilestone)}</span> : null}
        </div>
        {hired ? (
          <div className="talents" role="list" aria-label={m.talentsOf(text.name)}>
            {talents.map((talent) => {
              const canBuy = !talent.owned && talent.reachable && talent.cost <= gold;
              const state = talent.owned ? "owned" : talent.reachable ? (canBuy ? "buyable" : "reachable") : "locked";
              const status = talent.owned ? m.talentOwned : talent.reachable ? m.talentCost(fmt(talent.cost)) : m.talentLevel(talent.level);
              return (
                <button
                  key={talent.id}
                  type="button"
                  role="listitem"
                  className={`talent talent-${state}`}
                  disabled={!canBuy}
                  onClick={() => onTalent(talent.id)}
                  aria-label={m.talentLabel(talent.name, talent.text, status)}
                >
                  {talent.owned ? "✓" : talent.level}
                  <span className="talent-tip" role="tooltip">
                    <strong>{talent.name}</strong>
                    <span>{talent.text}</span>
                    <em>{status}</em>
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      <button type="button" className="hero-buy" disabled={!affordable} onClick={onBuy} aria-label={m.buyLabel(hired, text.name, count, fmt(cost))}>
        <span className="hero-buy-label">{hired ? `+${count}` : m.hire}</span>
        <span className="hero-buy-cost"><GoldIcon size={14} /> {fmt(cost)}</span>
      </button>
    </li>
  );
});
