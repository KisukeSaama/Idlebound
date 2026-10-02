"use client";

import { INVENTORY_LIMIT, MARKET_OFFERS, caravanWare, isoWeek, namedEffect, offlineGains, promiseAbstains, shardPrice, type CaravanWareId } from "@idlebound/game";
import type { ChestId } from "@idlebound/game/art";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { audio } from "../audio";
import { useFormat, useGame, useUi } from "../context";
import { CARAVAN_PICTO, GoldIcon, OFFER_PICTO, Picto, ShardIcon, WindowIcon } from "../icons";
import { Modal } from "../components/Modal";
import { PromiseNotice } from "./PromiseTab";

/** The Stallkeeper has twelve sayings, one per visit, in turn. */
const SAYINGS = 12;

/** Free spaces a ware needs in the pack. */
const WARE_ROOM: Partial<Record<CaravanWareId, number>> = { "sealed-coffer": 1, "three-chests": 3 };

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
  const { t, g } = useI18n();
  const text = t.windows.market;
  const ui = useUi();
  const fmt = useFormat();
  const now = Date.now();
  const hourglass = offlineGains(state, 3600, now).gold;
  const discount = namedEffect(state, "marketDiscount");

  // Each opening is one stop at the stall: the Stallkeeper says the next thing.
  const visited = useRef(false);
  const [saying, setSaying] = useState<number | null>(null);
  useEffect(() => {
    if (visited.current) return;
    visited.current = true;
    store.act((engine) => engine.visitMarket());
    setSaying((store.state.lore.sayings - 1) % SAYINGS);
  }, [store]);

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
      <div className="market-grid">
        {MARKET_OFFERS.map((offer) => {
          const chest: ChestId | null = offer.id === "chest" || offer.id === "great-chest" ? offer.id : null;
          const blocked = (chest !== null && state.inventory.length >= INVENTORY_LIMIT) || (offer.id === "hourglass" && hourglass <= 0) || promiseAbstains(state, "shards");
          const copy = g.market[offer.id];
          const price = shardPrice(state, offer.cost);
          return (
            <article key={offer.id} className="market-offer card">
              <Picto name={OFFER_PICTO[offer.id]} size={36} className="market-icon" />
              <h3>{copy.name}</h3>
              <p>{copy.description}</p>
              {offer.id === "hourglass" ? <p className="market-preview"><GoldIcon size={14} /> {hourglass > 0 ? fmt(hourglass) : text.hireFirst}</p> : null}
              {chest !== null && state.inventory.length >= INVENTORY_LIMIT ? <p className="market-preview warn"><Picto name="warning" size={14} /> {text.inventoryFull}</p> : null}
              <button
                type="button"
                className="btn btn-gold btn-sm"
                disabled={state.shards < price || blocked}
                onClick={() => {
                  const buy = () => store.act((engine, time) => engine.buyOffer(offer.id, time));
                  const ok = chest ? ui.openChest(chest, buy) : buy();
                  if (!ok) audio.play("error");
                  else if (!chest && offer.id !== "hourglass") ui.toast({ tone: "success", icon: OFFER_PICTO[offer.id], title: copy.name, text: text.effectActive, stack: `market:${offer.id}` });
                }}
              >
                <Price cost={offer.cost} price={price} />
              </button>
            </article>
          );
        })}
      </div>
    </Modal>
  );
}

/** The Caravan (BIBLE 13, event 5): one ware a week, from the third ascension. */
function Caravan({ now, hourglass }: { now: number; hourglass: number }) {
  const { state, store } = useGame();
  const { t, g } = useI18n();
  const text = t.sanctum.caravan;
  const ui = useUi();
  const week = isoWeek(now);
  if (!store.engine.caravanOpen(now)) {
    // Bought this week: the road is empty until Monday. Before the third ascension, nothing.
    return state.caravanWeek === week ? <p className="caravan-left">{text.left}</p> : null;
  }
  const ware = caravanWare(week);
  const copy = g.caravan[ware.id];
  const price = shardPrice(state, ware.cost);
  const owned = ware.id === "token" && state.named.includes("stallkeeper-band");
  const room = WARE_ROOM[ware.id] ?? 0;
  const packFull = room > 0 && state.inventory.length > INVENTORY_LIMIT - room;
  const noGold = ware.id === "bottled-night" && hourglass <= 0;
  const blocked = owned || packFull || noGold || promiseAbstains(state, "shards");
  return (
    <section className="caravan card" aria-labelledby="caravan-title">
      <Picto name={CARAVAN_PICTO[ware.id]} size={40} className="market-icon" />
      <div className="caravan-copy">
        <span className="stat-label" id="caravan-title">{g.events.caravan.name} · {text.ware}</span>
        <h3>{copy.name}</h3>
        <p>{copy.description}</p>
        {owned ? <p className="market-preview">{text.tokenOwned}</p> : null}
        {packFull ? <p className="market-preview warn"><Picto name="warning" size={14} /> {text.packFull(room)}</p> : null}
        {noGold ? <p className="market-preview warn"><Picto name="warning" size={14} /> {t.windows.market.hireFirst}</p> : null}
      </div>
      {owned ? null : (
        <button
          type="button"
          className="btn btn-gold"
          disabled={state.shards < price || blocked}
          aria-label={`${text.buy}: ${copy.name}`}
          onClick={() => {
            const ok = store.act((engine, time) => engine.buyCaravan(time));
            if (!ok) audio.play("error");
            else ui.toast({ tone: "success", icon: CARAVAN_PICTO[ware.id], title: copy.name, text: text.bought });
          }}
        >
          {text.buy} · <Price cost={ware.cost} price={price} />
        </button>
      )}
    </section>
  );
}
