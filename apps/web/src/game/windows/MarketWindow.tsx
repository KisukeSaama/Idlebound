"use client";

import {
  INVENTORY_LIMIT,
  RARE_PLACE_ASCENSIONS,
  RARE_WARES,
  RELIC_WARES,
  STALL_WARE_BY_ID,
  boonFits,
  caravanWare,
  formatDuration,
  isoWeek,
  namedEffect,
  offlineGains,
  promiseAbstains,
  rarityColor,
  shardPrice,
  shardScale,
  stallAt,
  stallBought,
  stallEnds,
  stallWindow,
  wareCost,
  BUFF_DURATION_SECONDS,
  MARKET_BUFF_MAX_SECONDS,
  type BuffId,
  type CaravanWareId,
  type StallPlace,
  type StallWareId
} from "@idlebound/game";
import type { ChestId } from "@idlebound/game/art";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { audio } from "../audio";
import { useFormat, useGame, useMagnitude, useUi } from "../context";
import { CARAVAN_PICTO, GoldIcon, OFFER_PICTO, Picto, ShardIcon, SlotIcon, WindowIcon } from "../icons";
import { Modal } from "../components/Modal";
import { PromiseNotice } from "./PromiseTab";
import { gameNow } from "@/lib/clock";

/** The Stallkeeper has twelve sayings, one per visit, in turn. */
const SAYINGS = 12;

/** Free spaces a ware needs in the pack. */
const WARE_ROOM: Partial<Record<CaravanWareId, number>> = { "sealed-coffer": 1, "three-chests": 3 };

/** The chest each relic ware opens as: the humble ones a relic chest, the precious ones a great chest. */
const OPENS_AS: Partial<Record<StallWareId, ChestId>> = {
  chest: "chest",
  crate: "chest",
  "great-chest": "great-chest",
  "set-piece": "great-chest",
  "trait-piece": "great-chest",
  "star-coffer": "great-chest"
};

/** Rare place wares have no picture of their own: a coffer, or the slot they are made for. */
const RARE_PICTO = { "star-coffer": "coffer" } as const;

/** Seconds from now to `time`, for the countdowns. */
const secondsTo = (time: number, now: number) => Math.max(0, Math.ceil((time - now) / 1000));

/** The next Monday at midnight UTC, when the Caravan's week ends. */
function weekEnds(now: number): number {
  const date = new Date(now);
  const day = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const weekday = date.getUTCDay() || 7;
  return day + (8 - weekday) * 86_400_000;
}

/** A shard price, with the price before the Stallkeeper's Token when it lowers it. */
function Price({ cost, price }: { cost: number; price: number }) {
  const { t } = useI18n();
  const fmt = useFormat();
  return (
    <>
      <ShardIcon size={14} /> {fmt(price)}
      {price < cost ? <s className="price-before" aria-label={t.sanctum.stall.oldPrice(fmt(cost))}>{fmt(cost)}</s> : null}
    </>
  );
}

export function MarketWindow({ onClose }: { onClose: () => void }) {
  const { state, store } = useGame();
  const { t, g, locale } = useI18n();
  const text = t.windows.market;
  const fmt = useFormat();
  const now = gameNow();
  const hourglass = offlineGains(state, 3600, now).gold;
  const discount = namedEffect(state, "marketDiscount");
  const stall = stallWindow(now);
  const places = stallAt(stall);
  const rareOpen = state.lifetime.ascensions >= RARE_PLACE_ASCENSIONS;
  const rare = rareOpen ? places.findIndex((place) => RARE_WARES.includes(place.ware)) : -1;
  const scale = shardScale(state.maxStageEver);

  // Each opening is one stop at the stall: the Stallkeeper says the next thing.
  const visited = useRef(false);
  const [saying, setSaying] = useState<number | null>(null);
  useEffect(() => {
    if (visited.current) return;
    visited.current = true;
    store.act({ type: "market" });
    setSaying((store.state.lore.sayings - 1) % SAYINGS);
  }, [store]);

  // The rare place rings once when the window opens on it, while its piece is still there.
  const rareLeft = rare >= 0 && stallBought(state, stall, rare) < places[rare].stock;
  const rang = useRef(false);
  useEffect(() => {
    if (!rareLeft || rang.current) return;
    rang.current = true;
    audio.play("rare");
  }, [rareLeft]);

  return (
    <Modal title={t.hud.windowTitles.market.label} icon={<WindowIcon id="market" />} onClose={onClose} size="md">
      {saying !== null && g.voices.sayings[saying] ? (
        <blockquote className="stall-saying">
          <p>{g.voices.sayings[saying]}</p>
          <cite>{g.speakers.stallkeeper}</cite>
        </blockquote>
      ) : null}
      <div className="market-balance">
        <ShardIcon size={26} />
        <strong>{fmt(state.shards)}</strong> {text.shards}
        {discount > 0 ? <span className="stall-discount">{t.sanctum.stall.discount(Math.round(discount * 100))}</span> : null}
        <span className="modal-hint">{text.balanceHint}</span>
      </div>
      <PromiseNotice when={promiseAbstains(state, "shards")} />
      <Caravan now={now} hourglass={hourglass} />
      <header className="stall-head">
        <h3>{text.wares}</h3>
        <span className="stall-renews" role="timer">
          <Picto name="hourglass" size={14} /> {text.renewsIn(formatDuration(secondsTo(stallEnds(stall), now), locale))}
        </span>
        <p className="modal-hint">{text.waresHint}{scale > 1 ? ` ${text.depthPrices(fmt(scale))}` : ""}</p>
      </header>
      <div className="market-grid">
        {places.map((place, index) => (index === rare || RARE_WARES.includes(place.ware) ? null : <Ware key={index} place={place} index={index} stall={stall} hourglass={hourglass} now={now} />))}
      </div>
      {rare >= 0 ? (
        <section className="stall-rare" aria-labelledby="stall-rare-title">
          <span className="stat-label" id="stall-rare-title">{text.rarePlace}</span>
          <p className="modal-hint">{text.rareHint}</p>
          <Ware place={places[rare]} index={rare} stall={stall} hourglass={hourglass} now={now} />
        </section>
      ) : null}
    </Modal>
  );
}

/** One place of the stall: its ware, its rarity, what is left of it, its price. */
function Ware({ place, index, stall, hourglass, now }: { place: StallPlace; index: number; stall: number; hourglass: number; now: number }) {
  const { state, store } = useGame();
  const { t, g } = useI18n();
  const text = t.windows.market;
  const ui = useUi();
  const magnitude = useMagnitude();
  const fmt = useFormat();
  const ware = STALL_WARE_BY_ID[place.ware];
  const copy = g.market[place.ware];
  const left = place.stock - stallBought(state, stall, index);
  const cost = wareCost(place.ware, state.maxStageEver);
  const price = shardPrice(state, cost);
  const chest = OPENS_AS[place.ware] ?? null;
  const packFull = RELIC_WARES.includes(place.ware) && state.inventory.length >= INVENTORY_LIMIT;
  const boon = place.ware === "rage" || place.ware === "fortune" || place.ware === "autoclick";
  const boonFull = boon && !boonFits(state, place.ware as BuffId, now);
  const noGold = place.ware === "hourglass" && hourglass <= 0;
  const blocked = left <= 0 || packFull || boonFull || noGold || promiseAbstains(state, "shards");
  // How many can be bought at once: what is left, what the shards pay, the room in the pack,
  // what still fits under the boon's day.
  const boonLeft = boon ? Math.max(0, (state.buffs.find((buff) => buff.id === place.ware)?.until ?? now) - now) / 1000 : 0;
  const most = blocked ? 0 : Math.min(
    left,
    Math.floor(state.shards / price),
    RELIC_WARES.includes(place.ware) ? INVENTORY_LIMIT - state.inventory.length : left,
    boon ? Math.floor((MARKET_BUFF_MAX_SECONDS - boonLeft) / BUFF_DURATION_SECONDS) : left
  );
  // What the ware is made of: a slot, a place, a trait.
  const made = [
    place.slot ? g.slots[place.slot] : null,
    place.place ? g.relicPlaces[place.place].name : null,
    place.trait ? g.relicTraits[place.trait]?.name : null
  ].filter((part): part is string => Boolean(part));
  const picto = place.ware in RARE_PICTO ? RARE_PICTO[place.ware as keyof typeof RARE_PICTO] : place.ware in OFFER_PICTO ? OFFER_PICTO[place.ware as keyof typeof OFFER_PICTO] : null;
  return (
    <article
      className={`market-offer card ware-${ware.rarity} ${left <= 0 ? "sold" : ""}`}
      style={{ ["--rarity" as string]: rarityColor(ware.rarity, state.settings.colorblind) }}
    >
      <div className="ware-top">
        {picto ? <Picto name={picto} size={36} className="market-icon" /> : place.slot ? <SlotIcon slot={place.slot} size={36} /> : null}
        <span className="ware-rarity">{text.wareRarity[ware.rarity]}</span>
      </div>
      <h3>{copy.name}</h3>
      {made.length > 0 ? <p className="ware-made">{made.join(" · ")}</p> : null}
      <p>{copy.description}</p>
      {place.ware === "hourglass" ? <p className="market-preview"><GoldIcon size={14} /> {hourglass > 0 ? magnitude(hourglass) : text.hireFirst}</p> : null}
      {packFull && left > 0 ? <p className="market-preview warn"><Picto name="warning" size={14} /> {text.inventoryFull}</p> : null}
      {boonFull && left > 0 ? <p className="market-preview warn"><Picto name="warning" size={14} /> {text.boonFull}</p> : null}
      <p className="ware-stock">{left > 0 ? text.stock(left, place.stock) : text.soldOut}</p>
      <div className="ware-buy">
        <button
          type="button"
          className="btn btn-gold btn-sm"
          disabled={state.shards < price || blocked}
          aria-label={`${copy.name}: ${left > 0 ? text.stock(left, place.stock) : text.soldOut}`}
          onClick={() => {
            const buy = () => store.act<boolean>({ type: "stall", place: index });
            const ok = chest ? ui.openChest(chest, buy) : buy();
            if (!ok) audio.play("error");
            else if (boon) ui.toast({ tone: "success", icon: OFFER_PICTO[place.ware as "rage"], title: copy.name, text: text.effectActive, stack: `market:${place.ware}` });
          }}
        >
          <Price cost={cost} price={price} />
        </button>
        {most >= 2 ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm ware-many"
            aria-label={text.buyMany(most, copy.name)}
            title={text.buyMany(most, copy.name)}
            onClick={() => {
              // One purchase after the other, each checked as a single one: the relics come
              // straight to the pack (no chest opening for each), the boons add up.
              let bought = 0;
              while (bought < most && store.act<boolean>({ type: "stall", place: index })) bought += 1;
              if (bought === 0) audio.play("error");
              else if (boon) ui.toast({ tone: "success", icon: OFFER_PICTO[place.ware as "rage"], title: copy.name, text: text.boughtMany(bought), stack: `market:${place.ware}` });
              else if (!RELIC_WARES.includes(place.ware)) ui.toast({ tone: "success", icon: OFFER_PICTO[place.ware as "hourglass"], title: copy.name, text: text.boughtMany(bought) });
            }}
          >
            ×{most} · <ShardIcon size={14} /> {fmt(price * most)}
          </button>
        ) : null}
      </div>
    </article>
  );
}

/** The Caravan (BIBLE 13, event 5): one ware a week, from the third ascension. */
function Caravan({ now, hourglass }: { now: number; hourglass: number }) {
  const { state, store } = useGame();
  const { t, g, locale } = useI18n();
  const text = t.sanctum.caravan;
  const ui = useUi();
  const week = isoWeek(now);
  if (!store.engine.caravanOpen(now)) {
    // Bought this week: the road is empty until Monday. Before the third ascension, nothing.
    return state.caravanWeek === week ? <p className="caravan-left">{text.left}</p> : null;
  }
  const ware = caravanWare(week);
  const copy = g.caravan[ware.id];
  const cost = ware.cost * shardScale(state.maxStageEver);
  const price = shardPrice(state, cost);
  const owned = ware.id === "token" && state.named.includes("stallkeeper-band");
  const room = WARE_ROOM[ware.id] ?? 0;
  const packFull = room > 0 && state.inventory.length > INVENTORY_LIMIT - room;
  const noGold = ware.id === "bottled-night" && hourglass <= 0;
  const boonFull = ware.id === "ember-draught" && (!boonFits(state, "rage", now) || !boonFits(state, "fortune", now));
  const blocked = owned || packFull || noGold || boonFull || promiseAbstains(state, "shards");
  return (
    <section className="caravan card" aria-labelledby="caravan-title">
      <Picto name={CARAVAN_PICTO[ware.id]} size={40} className="market-icon" />
      <div className="caravan-copy">
        <span className="stat-label" id="caravan-title">{g.events.caravan.name} · {text.ware}</span>
        <h3>{copy.name}</h3>
        <p>{copy.description}</p>
        <p className="caravan-leaves" role="timer">{text.leaves(formatDuration(secondsTo(weekEnds(now), now), locale))}</p>
        {owned ? <p className="market-preview">{text.tokenOwned}</p> : null}
        {packFull ? <p className="market-preview warn"><Picto name="warning" size={14} /> {text.packFull(room)}</p> : null}
        {noGold ? <p className="market-preview warn"><Picto name="warning" size={14} /> {t.windows.market.hireFirst}</p> : null}
        {boonFull ? <p className="market-preview warn"><Picto name="warning" size={14} /> {t.windows.market.boonFull}</p> : null}
      </div>
      {owned ? null : (
        <button
          type="button"
          className="btn btn-gold"
          disabled={state.shards < price || blocked}
          aria-label={`${text.buy}: ${copy.name}`}
          onClick={() => {
            const ok = store.act<boolean>({ type: "caravan" });
            if (!ok) audio.play("error");
            else ui.toast({ tone: "success", icon: CARAVAN_PICTO[ware.id], title: copy.name, text: text.bought });
          }}
        >
          {text.buy} · <Price cost={cost} price={price} />
        </button>
      )}
    </section>
  );
}
