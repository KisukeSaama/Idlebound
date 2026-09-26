"use client";

import {
  FORGE_MAX,
  FORGE_STEP,
  INVENTORY_LIMIT,
  RARITY_INFO,
  SLOTS,
  affixValue,
  equipmentBonus,
  forgeCost,
  itemName,
  salvageValue,
  trimmed,
  type AffixStat,
  type Item,
  type Locale,
  type Rarity
} from "@idlebound/game";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { useFormat, useGame, useUi } from "../context";
import { Picto, ShardIcon, SlotIcon, WINDOW_META } from "../icons";
import { Modal } from "../components/Modal";
import { formatAffix } from "../text";

const STATS: AffixStat[] = ["dps", "click", "gold", "bossDamage", "critChance", "critDamage", "essence"];

/** "12.5 %" in French, "12.5%" in English. */
function percent(pct: number, locale: Locale): string {
  return `${trimmed(pct, 1)}${locale === "fr" ? " %" : "%"}`;
}

export function GearWindow({ onClose, initialTab }: { onClose: () => void; initialTab: "equipped" | "bag" }) {
  const [tab, setTab] = useState<string>(initialTab);
  const { state } = useGame();
  const { t } = useI18n();
  const id = tab === "equipped" ? "gear" : "inventory";
  return (
    <Modal
      title={t.hud.windowTitles[id].label}
      icon={<img src={WINDOW_META[id].icon!} alt="" width={34} height={34} />}
      onClose={onClose}
      size="lg"
      tabs={[{ id: "equipped", label: t.windows.gear.equippedTab }, { id: "bag", label: t.windows.gear.bagTab(state.inventory.length, INVENTORY_LIMIT) }]}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "equipped" ? <Equipped /> : <Bag />}
    </Modal>
  );
}

export function ItemCard({ item, compareTo, children }: { item: Item; compareTo?: Item; children?: React.ReactNode }) {
  const { t, g, locale } = useI18n();
  const info = RARITY_INFO[item.rarity];
  const main = item.affixes[0];
  const delta = compareTo ? affixValue(item, main.stat) - affixValue(compareTo, main.stat) : null;
  return (
    <article className={`item-card rarity-${item.rarity}`} style={{ ["--rarity" as string]: info.color }}>
      <header className="item-head">
        <span className="item-slot-icon"><SlotIcon slot={item.slot} color={info.color} /></span>
        <div>
          <h3 className="item-name">{itemName(item, locale)}{item.forge > 0 ? <span className="item-forge"> +{item.forge}</span> : null}</h3>
          <p className="item-meta">{g.rarities[item.rarity]} · {g.slots[item.slot]} · {t.common.level(item.level)}</p>
        </div>
        {item.locked ? <span className="item-lock" title={t.windows.gear.lockedTitle}><Picto name="lock" size={18} /></span> : null}
      </header>
      <ul className="item-affixes">
        {item.affixes.map((affix, index) => (
          <li key={affix.stat} className={index === 0 ? "main" : ""}>{formatAffix(affix.stat, affixValue(item, affix.stat), locale)}</li>
        ))}
      </ul>
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
  return (
    <div className="gear-layout">
      <div className="gear-slots">
        {SLOTS.map((slot) => {
          const item = state.equipment[slot];
          if (!item) {
            return (
              <div key={slot} className="item-card empty">
                <SlotIcon slot={slot} size={30} color="#6f6794" />
                <p>{text.emptySlot(g.slots[slot])}</p>
                <p className="modal-hint">{text.emptySlotHint}</p>
              </div>
            );
          }
          const cost = forgeCost(item.rarity, item.forge);
          return (
            <ItemCard key={slot} item={item}>
              <button
                type="button"
                className="btn btn-violet btn-sm"
                disabled={item.forge >= FORGE_MAX || state.shards < cost}
                onClick={() => store.act((engine, now) => engine.forge(slot, now))}
                title={text.forgeTitle(percent(FORGE_STEP * 100, locale))}
              >
                {item.forge >= FORGE_MAX ? text.forgeMaxed : <>{text.forge} <ShardIcon size={14} /> {fmt(cost)}</>}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" disabled={state.inventory.length >= INVENTORY_LIMIT} onClick={() => store.act((engine, now) => engine.unequip(slot, now))}>
                {text.unequip}
              </button>
            </ItemCard>
          );
        })}
      </div>
      <aside className="gear-totals card">
        <h3>{text.totalsTitle}</h3>
        <dl>
          {STATS.map((stat) => (
            <div key={stat}>
              <dt>{g.affixes[stat]}</dt>
              <dd>+{percent(equipmentBonus(state, stat) * 100, locale)}</dd>
            </div>
          ))}
        </dl>
        <p className="modal-hint">{text.totalsHint}</p>
      </aside>
    </div>
  );
}

function Bag() {
  const { state, store } = useGame();
  const { t } = useI18n();
  const text = t.windows.gear;
  const ui = useUi();
  const fmt = useFormat();
  const [sort, setSort] = useState<"recent" | "rarity" | "slot">("recent");
  const order: Rarity[] = ["mythic", "legendary", "epic", "rare", "common"];
  const items = [...state.inventory];
  if (sort === "rarity") items.sort((a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity) || b.level - a.level);
  if (sort === "slot") items.sort((a, b) => SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot) || order.indexOf(a.rarity) - order.indexOf(b.rarity));
  if (sort === "recent") items.reverse();

  const bulk = async (rarity: Rarity, label: (count: number) => string) => {
    const count = state.inventory.filter((item) => !item.locked && order.indexOf(item.rarity) >= order.indexOf(rarity)).length;
    if (count === 0) return;
    const ok = await ui.confirm({ title: text.bulkTitle, text: text.bulkText(count, label(count)), confirmLabel: text.bulkConfirm, danger: true });
    if (!ok) return;
    const shards = store.act((engine) => engine.salvageUpTo(rarity));
    ui.toast({ tone: "info", icon: "shard", title: text.bulkDoneTitle(fmt(shards)), text: text.bulkDoneText(count) });
  };

  if (items.length === 0) {
    return <p className="empty-state">{text.emptyBag}</p>;
  }

  return (
    <div className="bag">
      <div className="bag-toolbar">
        <label>
          {text.sortLabel}
          <select className="input input-sm" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
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
            <button type="button" className="btn btn-gold btn-sm" onClick={() => store.act((engine, now) => engine.equip(item.uid, now))}>{text.equip}</button>
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
