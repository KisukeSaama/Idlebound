"use client";

import {
  CLICK_HERO_ID,
  HEROES,
  UPGRADE_BY_ID,
  heroCost,
  heroCostMultiplier,
  maxAffordableLevels,
  milestoneMultiplier,
  recognitionTier,
  talentName,
  upgradeCost,
  type BuyMode,
  type HeroDef
} from "@idlebound/game";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import type { Messages } from "@/i18n/messages";
import { useFormat, useGame, useReveals } from "../context";
import { GoldIcon } from "../icons";
import { PixelSprite } from "../pixel/PixelSprite";
import { awakenedSeed, emblemSource, portraitSource } from "../pixel/sources";
import { describeEffect } from "../text";

const MODES: BuyMode[] = [1, 10, 25, 100, "max"];
/** The Faceless: how long Nyx's medallion shows the stars. */
const STARFIELD_MS = 1_000;
/** Every talent of every companion, with what opens it. */
const TALENTS = Object.values(UPGRADE_BY_ID).map(({ hero, upgrade }) => ({ id: upgrade.id, heroId: hero.id, level: upgrade.level }));

export function HeroPanel() {
  const { state, derived, store } = useGame();
  const { shown, freshClass } = useReveals();
  const fmt = useFormat();
  const { t, g, locale } = useI18n();
  const m = t.hud.heroes;
  const mode = state.settings.buyMode;
  const costMultiplier = heroCostMultiplier(state);

  // The talents owned, and the levels: what the talents within reach are built from. The
  // array is replaced with a new game, and grows as talents are bought.
  const owned = state.heroUpgrades;
  const ownedCount = owned.length;
  const levels = HEROES.map((hero) => state.heroLevels[hero.id] ?? 0).join(",");
  const ownedSet = useMemo(() => new Set(owned), [owned, ownedCount]);
  // Costs of the talents within reach and not owned, cheapest first.
  const reachable = useMemo(
    () => TALENTS.filter(({ id, heroId, level }) => !ownedSet.has(id) && (store.state.heroLevels[heroId] ?? 0) >= level).map(({ id }) => upgradeCost(id)).sort((a, b) => a - b),
    // `levels` stands for the levels of the companions.
    [store, ownedSet, levels]
  );
  let affordableTalents = 0;
  while (affordableTalents < reachable.length && reachable[affordableTalents] <= state.gold) affordableTalents += 1;

  // Each companion's talents, built again only when what they show changes (a level, a talent
  // owned, the language, one becoming affordable), so the rows stay memoized between ticks.
  const talentRows = useRef(new Map<string, { key: string; owned: Set<string>; talents: Talent[] }>());
  const talentsOf = (hero: HeroDef, level: number): Talent[] => {
    // Only the talents within reach or owned: the rest appear with the levels.
    const within = hero.upgrades.filter((upgrade) => level >= upgrade.level || ownedSet.has(upgrade.id));
    const buyable = within.map((upgrade) => (!ownedSet.has(upgrade.id) && upgradeCost(upgrade.id) <= state.gold ? "1" : "0")).join("");
    const key = `${level}|${locale}|${buyable}`;
    const cached = talentRows.current.get(hero.id);
    if (cached && cached.key === key && cached.owned === ownedSet) return cached.talents;
    const talents = within.map((upgrade, index) => ({
      id: upgrade.id,
      level: upgrade.level,
      name: talentName(upgrade.id, locale),
      text: describeEffect(upgrade.effect, g.heroes[hero.id].name, locale),
      cost: upgradeCost(upgrade.id),
      owned: ownedSet.has(upgrade.id),
      buyable: buyable[index] === "1"
    }));
    talentRows.current.set(hero.id, { key, owned: ownedSet, talents });
    return talents;
  };

  // Stable handlers: each row binds its own companion, so the memoized rows bail out.
  const onBuy = useCallback((heroId: string) => store.act((engine, now) => engine.buyHero(heroId, mode, now)), [store, mode]);
  const onTalent = useCallback((id: string) => store.act((engine, now) => engine.buyUpgrade(id, now)), [store]);
  const onPortrait = useCallback((heroId: string) => store.act((engine, now) => engine.touchPortrait(heroId, now), { save: false }), [store]);

  // Aldric, the companions hired, and the next one once the walker can hire them this
  // night (or hired them on an earlier one). Once shown this night, it stays.
  const night = `${state.createdAt}:${state.lifetime.ascensions}:${state.descents}`;
  const offered = useRef<{ night: string; ids: Set<string> }>({ night, ids: new Set() });
  if (offered.current.night !== night) offered.current = { night, ids: new Set() };
  const next = HEROES.find((hero) => hero.id !== CLICK_HERO_ID && (state.heroLevels[hero.id] ?? 0) === 0);
  if (next && (next.index < state.lifetime.bestHired || heroCost(next, 0, 1, costMultiplier) <= state.gold)) offered.current.ids.add(next.id);
  const visible = HEROES.filter((hero) => hero.id === CLICK_HERO_ID || (state.heroLevels[hero.id] ?? 0) > 0 || (hero === next && offered.current.ids.has(hero.id)));

  // The Faceless: when Nyx's secret is found, her medallion shows the stars for a moment.
  const [starfield, setStarfield] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = store.onFx((event) => {
      if (event.type !== "secret" || event.id !== "faceless") return;
      setStarfield(true);
      clearTimeout(timer);
      timer = setTimeout(() => setStarfield(false), STARFIELD_MS);
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [store]);

  return (
    <aside className="hero-panel" aria-label={m.title}>
      <div className="hero-panel-head">
        <h2>{m.title}</h2>
        {shown.buyModes ? (
          <div className={`buy-modes${freshClass("buyModes")}`} role="radiogroup" aria-label={m.buyAmount}>
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
        ) : null}
      </div>
      {shown.autoSpend ? (
        <>
          <label className={`hero-autospend${freshClass("autoSpend")}`} title={m.autoSpendHint}>
            <span>{m.autoSpend}</span>
            <input
              type="checkbox"
              role="switch"
              className="switch switch-sm"
              checked={state.settings.offlineSpending}
              aria-describedby="autospend-hint"
              onChange={(event) => {
                const value = event.target.checked;
                store.act((engine) => { engine.state.settings.offlineSpending = value; });
              }}
            />
          </label>
          <span id="autospend-hint" className="visually-hidden">{m.autoSpendHint}</span>
        </>
      ) : null}
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
          return (
            <HeroRow
              key={hero.id}
              hero={hero}
              portraitSeed={hero.id === "awakened" ? awakenedSeed(state.settings.notation, state.settings.sound, locale) : undefined}
              level={level}
              recognition={recognitionTier(state, hero.id)}
              count={purchase.count}
              cost={purchase.cost}
              affordable={purchase.cost <= state.gold}
              value={hero.id === CLICK_HERO_ID ? derived.click : derived.heroDps[hero.id] ?? 0}
              share={share}
              nextMilestone={nextMilestone(level)}
              talents={talentsOf(hero, level)}
              text={g.heroes[hero.id]}
              m={m}
              fmt={fmt}
              onBuy={onBuy}
              onTalent={onTalent}
              onPortrait={hero.id === "nyx" && level > 0 ? onPortrait : undefined}
              starfield={hero.id === "nyx" && starfield}
            />
          );
        })}
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
  /** Not owned, and the gold is there. */
  buyable: boolean;
}

interface HeroRowProps {
  hero: HeroDef;
  /** The Awakened's portrait follows the walker's settings. */
  portraitSeed?: number;
  level: number;
  /** Recognition tier (0 to 5): a thin gold ring per tier on the medallion. */
  recognition: number;
  count: number;
  cost: number;
  affordable: boolean;
  value: number;
  share: number;
  nextMilestone: number | null;
  talents: Talent[];
  text: { name: string; title: string; lore: string };
  m: Messages["hud"]["heroes"];
  fmt: (value: number) => string;
  onBuy: (heroId: string) => void;
  onTalent: (id: string) => void;
  /** Touching the portrait (only Nyx listens: the Faceless). */
  onPortrait?: (heroId: string) => void;
  /** The Faceless was just found: the medallion shows the stars. */
  starfield: boolean;
}

const HeroRow = memo(function HeroRow({ hero, portraitSeed, level, recognition, count, cost, affordable, value, share, nextMilestone, talents, text, m, fmt, onBuy, onTalent, onPortrait, starfield }: HeroRowProps) {
  const isClick = hero.id === CLICK_HERO_ID;
  const hired = level > 0;
  return (
    <li className={`hero-row ${hired ? "hired" : "unhired"} ${affordable ? "affordable" : ""}`} style={{ ["--hero" as string]: hero.color }}>
      <div
        className={`hero-medallion ${recognition > 0 ? `recognized recognition-${recognition}` : ""} ${starfield ? "starfield" : ""}`}
        aria-hidden="true"
        onPointerDown={onPortrait ? () => onPortrait(hero.id) : undefined}
      >
        <span className="medallion-clip"><PixelSprite source={portraitSource(hero.id, portraitSeed)} size={44} cover /></span>
        {starfield ? <span className="medallion-stars" /> : null}
        {hired ? <span className="hero-level">{level}</span> : null}
      </div>
      <div className="hero-info">
        <div className="hero-name" title={text.lore}>
          <PixelSprite source={emblemSource(hero.id)} size={14} className="hero-emblem" />
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
        {hired && talents.length > 0 ? (
          <div className="talents" role="list" aria-label={m.talentsOf(text.name)}>
            {talents.map((talent) => {
              const canBuy = talent.buyable;
              const state = talent.owned ? "owned" : canBuy ? "buyable" : "reachable";
              const status = talent.owned ? m.talentOwned : m.talentCost(fmt(talent.cost));
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
      <button type="button" className="hero-buy" disabled={!affordable} onClick={() => onBuy(hero.id)}aria-label={m.buyLabel(hired, text.name, count, fmt(cost))}>
        <span className="hero-buy-label">{hired ? `+${count}` : isClick ? m.train : m.hire}</span>
        <span className="hero-buy-cost"><GoldIcon size={14} /> {fmt(cost)}</span>
      </button>
    </li>
  );
});
