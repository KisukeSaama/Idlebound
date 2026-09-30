"use client";

import {
  AFFIX_BASE,
  CROWN_DESCENTS,
  CROWN_HOLD_MS,
  EQUIPMENT_CAP,
  FORGE_MAX,
  FORGE_STEP,
  INVENTORY_LIMIT,
  REGALIA_KING_DAMAGE,
  SLOTS,
  affixValue,
  NAMED_BY_ID,
  equipmentBonus,
  equipmentDensity,
  rarityColor,
  relicDensity,
  relicStratum,
  forgePrice,
  itemName,
  promiseAbstains,
  promiseOf,
  relicCompanyGain,
  salvageValue,
  trimmed,
  wearsRegalia,
  type AffixStat,
  type GameState,
  type Item,
  type Locale,
  type Rarity
} from "@idlebound/game";
import { useEffect, useId, useMemo, useState } from "react";
import { useI18n } from "@/i18n/client";
import { useFormat, useGame, useReveals, useUi } from "../context";
import { Picto, ShardIcon, SlotIcon, WindowIcon } from "../icons";
import { Modal } from "../components/Modal";
import { PixelSprite } from "../pixel/PixelSprite";
import { relicSource } from "../pixel/sources";
import { useRemembered } from "../remembered";
import { formatAffix } from "../text";
import { PromiseNotice } from "./PromiseTab";

/** Rarities from the rarest down: the Bag sorts by it, and bulk salvage counts up to one. */
const RARITY_ORDER: Rarity[] = ["mythic", "legendary", "epic", "rare", "common"];
const BAG_SORTS = ["recent", "rarity", "slot"] as const;
type BagSort = (typeof BAG_SORTS)[number];

/**
 * How strong a relic is, to rank relics of one rarity: what it is worth to the company first
 * (its score: DPS affix, forge and density), then its affixes, each against its nominal
 * value so every stat weighs alike, forge included.
 */
function compareStrength(state: GameState, now: number) {
  const power = (item: Item) => item.affixes.reduce((total, affix) => total + affixValue(item, affix.stat) / AFFIX_BASE[affix.stat], 0);
  return (a: Item, b: Item) => relicCompanyGain(state, b, now) - relicCompanyGain(state, a, now) || power(b) - power(a);
}

const STATS: AffixStat[] = ["dps", "click", "gold", "bossDamage", "critChance", "critDamage", "essence"];

/** "12.5 %" in French, "12.5%" in English. */
function percent(pct: number, locale: Locale): string {
  return `${trimmed(pct, 1)}${locale === "fr" ? " %" : "%"}`;
}

/** A damage multiplier: two decimals while small, then the game's notation. */
function useMultiplier() {
  const fmt = useFormat();
  return (value: number) => (value < 100 ? trimmed(value, 2) : fmt(value));
}

export function GearWindow({ onClose, initialTab }: { onClose: () => void; initialTab: "equipped" | "bag" }) {
  const [tab, setTab] = useState<string>(initialTab);
  const { state } = useGame();
  const { shown } = useReveals();
  const { t } = useI18n();
  const id = tab === "equipped" ? "gear" : "inventory";
  return (
    <Modal
      title={t.hud.windowTitles[id].label}
      icon={<WindowIcon id={id} />}
      onClose={onClose}
      size="lg"
      aside={shown.shards ? <ShardBalance /> : null}
      tabs={[{ id: "equipped", label: t.windows.gear.equippedTab }, { id: "bag", label: t.windows.gear.bagTab(state.inventory.length, INVENTORY_LIMIT) }]}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "equipped" ? <Equipped /> : <Bag />}
    </Modal>
  );
}

/**
 * The purse the forge draws from and salvage fills, in sight on both tabs (the header's is
 * under the veil). It swells a moment each time it moves, so a strike of the hammer shows.
 */
function ShardBalance() {
  const { state } = useGame();
  const { t } = useI18n();
  const fmt = useFormat();
  const [seen, setSeen] = useState(state.shards);
  const [moves, setMoves] = useState(0);
  if (seen !== state.shards) {
    setSeen(state.shards);
    setMoves(moves + 1);
  }
  return (
    <span className="resource resource-shard modal-balance" title={t.windows.gear.shardsTitle}>
      <ShardIcon />
      <span key={moves} className={`resource-value${moves > 0 ? " balance-moved" : ""}`}>{fmt(state.shards)}</span>
      <span className="visually-hidden">{t.windows.market.shards}</span>
    </span>
  );
}

/**
 * A relic as the world draws it (twice its pixels, so its rarity reads at a glance) and,
 * once forged, its level in the Ledger's ink on its corner.
 */
export function RelicIcon({ item }: { item: Item }) {
  return (
    <span className="item-slot-icon">
      <PixelSprite source={relicSource(item)} size={64} />
      {item.forge > 0 ? <span className={`relic-forge${item.forge >= FORGE_MAX ? " max" : ""}`} aria-hidden="true">+{item.forge}</span> : null}
    </span>
  );
}

export function ItemCard({ item, compareTo, children }: { item: Item; compareTo?: Item; children?: React.ReactNode }) {
  const { t, g, locale } = useI18n();
  const { state } = useGame();
  const main = item.affixes[0];
  const named = item.named ? NAMED_BY_ID[item.named] : undefined;
  const legend = item.named ? g.relics[item.named] : undefined;
  // Its main stat against the worn relic's, when that stat is not the company's damage (the score says that one).
  const delta = compareTo && main.stat !== "dps" ? affixValue(item, main.stat) - affixValue(compareTo, main.stat) : null;
  const density = relicDensity(item);
  const mult = useMultiplier();
  const now = state.lastTickAt;
  const score = relicCompanyGain(state, item, now);
  const scoreDelta = compareTo ? score / relicCompanyGain(state, compareTo, now) - 1 : null;
  const signed = (pct: number) => `${pct > 0 ? "+" : pct < 0 ? "-" : ""}${percent(Math.abs(pct), locale)}`;
  return (
    <article className={`item-card rarity-${item.rarity} ${named ? "named" : ""}`} style={{ ["--rarity" as string]: rarityColor(item.rarity, state.settings.colorblind) }}>
      <header className="item-head">
        <RelicIcon item={item} />
        <div>
          <h3 className="item-name">{itemName(item, locale)}{item.forge > 0 ? <span className="item-forge"> +{item.forge}</span> : null}</h3>
          <p className="item-meta">{named ? `${t.windows.gear.named} · ` : ""}{g.rarities[item.rarity]} · {g.slots[item.slot]} · {t.common.level(item.level)}</p>
        </div>
        {item.locked ? <span className="item-lock" title={t.windows.gear.lockedTitle}><Picto name="lock" size={18} /></span> : null}
      </header>
      <p className="item-score" title={t.windows.gear.scoreTitle}>
        <span>{t.windows.gear.score(mult(score))}</span>
        {scoreDelta !== null ? (
          <span className={`item-delta ${scoreDelta > 0.0005 ? "up" : scoreDelta < -0.0005 ? "down" : ""}`}>
            {scoreDelta > 0.0005 ? "▲" : scoreDelta < -0.0005 ? "▼" : "="} {signed(Math.abs(scoreDelta) < 0.0005 ? 0 : scoreDelta * 100)} {t.windows.gear.versusEquipped}
          </span>
        ) : null}
      </p>
      <ul className="item-affixes">
        {item.affixes.map((affix, index) => (
          <li key={affix.stat} className={index === 0 ? "main" : ""}>{formatAffix(affix.stat, affixValue(item, affix.stat), locale)}</li>
        ))}
        {density > 1 ? <li className="density" title={t.windows.gear.densityTitle(relicStratum(item))}>{t.windows.gear.density(mult(density))}</li> : null}
        {named ? <li className="named-effect">{g.namedEffects[named.effect.kind](named.effect.pct)}</li> : null}
      </ul>
      {legend ? <p className="item-legend">{legend.legend}</p> : null}
      {delta !== null ? (
        <p className={`item-delta ${delta > 0 ? "up" : delta < 0 ? "down" : ""}`}>
          {delta > 0 ? "▲" : delta < 0 ? "▼" : "="} {formatAffix(main.stat, Math.abs(delta), locale).replace("+", "")} {t.windows.gear.versusEquipped}
        </p>
      ) : null}
      {children ? <div className="item-actions">{children}</div> : null}
    </article>
  );
}

function Equipped() {
  const { state, store } = useGame();
  const { t, g, locale } = useI18n();
  const text = t.windows.gear;
  const fmt = useFormat();
  const mult = useMultiplier();
  const density = equipmentDensity(state);
  // A word given: no shard spent (Garrick), or the weapon left on the anvil (Brom).
  const frugal = promiseAbstains(state, "shards");
  const anvil = promiseOf(state, "anvil") !== undefined;
  return (
    <div className="gear-layout">
      <PromiseNotice when={frugal || anvil} />
      <div className="gear-slots">
        {SLOTS.map((slot) => {
          const item = state.equipment[slot];
          if (!item) {
            return (
              <div key={slot} className="item-card empty">
                <SlotIcon slot={slot} size={30} />
                <p>{text.emptySlot(g.slots[slot])}</p>
                <p className="modal-hint">{text.emptySlotHint}</p>
              </div>
            );
          }
          const cost = forgePrice(state, item);
          return (
            <ItemCard key={slot} item={item}>
              <button
                type="button"
                className="btn btn-violet btn-sm"
                disabled={item.forge >= FORGE_MAX || state.shards < cost || frugal || (anvil && slot === "weapon")}
                onClick={() => store.act((engine, now) => engine.forge(slot, now))}
                title={text.forgeTitle(percent(FORGE_STEP * 100, locale))}
              >
                {item.forge >= FORGE_MAX ? text.forgeMaxed : <>{text.forge} <ShardIcon size={14} /> {fmt(cost)}</>}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" disabled={state.inventory.length >= INVENTORY_LIMIT || (anvil && slot === "weapon")} onClick={() => store.act((engine, now) => engine.unequip(slot, now))}>
                {text.unequip}
              </button>
            </ItemCard>
          );
        })}
        {state.descents >= CROWN_DESCENTS ? <CrownSlot /> : null}
      </div>
      <aside className="gear-totals card">
        <h3>{text.totalsTitle}</h3>
        <dl>
          {STATS.map((stat) => {
            const bonus = equipmentBonus(state, stat);
            const cap = EQUIPMENT_CAP[stat];
            return (
              <div key={stat}>
                <dt>{g.affixes[stat]}</dt>
                <dd>
                  +{percent(bonus * 100, locale)}
                  {cap !== undefined && bonus >= cap ? <span className="cap-badge" title={text.capTitle}>{text.capBadge}</span> : null}
                </dd>
              </div>
            );
          })}
          {density > 1 ? (
            <div>
              <dt>{text.densityLabel}</dt>
              <dd>×{mult(density)}</dd>
            </div>
          ) : null}
        </dl>
        {wearsRegalia(state) ? (
          <p className="regalia-line">
            <strong>{t.sanctum.armory.regalia}</strong> {t.sanctum.armory.regaliaWorn(Math.round(REGALIA_KING_DAMAGE * 100))}
          </p>
        ) : null}
        <p className="modal-hint">{text.totalsHint}</p>
      </aside>
    </div>
  );
}

/**
 * The Crown of Orvane (BIBLE 11.5): after the tenth Descent, a fifth slot that nothing fills.
 * Pointed at, pressed or focused, it says what it is; held there long enough, it keeps you.
 */
function CrownSlot() {
  const { store } = useGame();
  const { t, g } = useI18n();
  const hoverId = useId();
  const [pointer, setPointer] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shown, setShown] = useState(false);
  const holding = pointer || focused;

  useEffect(() => {
    if (!holding) return;
    const start = Date.now();
    const timer = window.setTimeout(() => store.act((engine) => engine.holdCrown(Date.now() - start)), CROWN_HOLD_MS + 50);
    return () => window.clearTimeout(timer);
  }, [holding, store]);

  const hold = () => {
    setPointer(true);
    setShown(true);
  };
  const release = () => setPointer(false);

  return (
    <div
      className={`item-card empty crown-slot${holding ? " held" : ""}`}
      role="img"
      tabIndex={0}
      aria-label={`${t.sanctum.armory.crownSlot}: ${g.crown.name}`}
      aria-describedby={hoverId}
      onPointerEnter={hold}
      onPointerDown={hold}
      onPointerLeave={release}
      onPointerCancel={release}
      onFocus={() => {
        setFocused(true);
        setShown(true);
      }}
      onBlur={() => setFocused(false)}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Picto name="crown" size={30} className="crown-silhouette" />
      <p>{g.crown.name}</p>
      <p id={hoverId} className={`crown-hover${holding || shown ? " visible" : ""}`}>{g.crown.hover}</p>
    </div>
  );
}

function Bag() {
  const { state, store } = useGame();
  const { t } = useI18n();
  const text = t.windows.gear;
  const ui = useUi();
  const fmt = useFormat();
  const [sort, setSort] = useRemembered("bag-sort", BAG_SORTS, "recent");
  // The relics carried, by their ids: the sorted Bag is only built again when they change.
  const carried = state.inventory.map((item) => item.uid).join(",");
  const items = useMemo(() => {
    const sorted = [...store.state.inventory];
    const stronger = compareStrength(store.state, store.state.lastTickAt);
    if (sort === "rarity") sorted.sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity) || stronger(a, b));
    if (sort === "slot") sorted.sort((a, b) => SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot) || RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));
    if (sort === "recent") sorted.reverse();
    return sorted;
    // `carried` stands for the inventory: the same relics in the same order sort the same.
  }, [store, sort, carried]);

  const bulk = async (rarity: Rarity, label: (count: number) => string) => {
    const count = state.inventory.filter((item) => !item.locked && RARITY_ORDER.indexOf(item.rarity) >= RARITY_ORDER.indexOf(rarity)).length;
    if (count === 0) return;
    const ok = await ui.confirm({ title: text.bulkTitle, text: text.bulkText(count, label(count)), confirmLabel: text.bulkConfirm, danger: true });
    if (!ok) return;
    const shards = store.act((engine) => engine.salvageUpTo(rarity));
    ui.toast({ tone: "info", icon: "shard", title: text.bulkDoneTitle(fmt(shards)), text: text.bulkDoneText(count) });
  };

  if (items.length === 0) {
    return <p className="empty-state">{text.emptyBag}</p>;
  }

  // Brom keeps the weapon on his anvil for the night: no other takes its place.
  const anvil = promiseOf(state, "anvil") !== undefined;

  return (
    <div className="bag">
      <PromiseNotice when={anvil} />
      <div className="bag-toolbar">
        <label>
          {text.sortLabel}
          <select className="input input-sm" value={sort} onChange={(event) => setSort(event.target.value as BagSort)}>
            <option value="recent">{text.sortRecent}</option>
            <option value="rarity">{text.sortRarity}</option>
            <option value="slot">{text.sortSlot}</option>
          </select>
        </label>
        <div className="bag-bulk">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => void bulk("common", text.commonRarities)}>{text.salvageCommons}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => void bulk("rare", text.commonAndRareRarities)}>{text.salvageRares}</button>
        </div>
      </div>
      <div className="bag-grid">
        {items.map((item) => (
          <ItemCard key={item.uid} item={item} compareTo={state.equipment[item.slot]}>
            <button type="button" className="btn btn-gold btn-sm" disabled={anvil && item.slot === "weapon"} onClick={() => store.act((engine, now) => engine.equip(item.uid, now))}>{text.equip}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => store.act((engine) => engine.toggleLock(item.uid))} aria-pressed={Boolean(item.locked)}>
              {item.locked ? text.unlock : text.lock}
            </button>
            <button type="button" className="btn btn-danger btn-sm" disabled={item.locked} onClick={() => store.act((engine) => engine.salvage(item.uid))}>
              {text.salvage} <ShardIcon size={13} /> {salvageValue(item)}
            </button>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}
