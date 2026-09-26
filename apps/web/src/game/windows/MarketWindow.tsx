"use client";

import { INVENTORY_LIMIT, MARKET_OFFERS, offlineGains } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { audio } from "../audio";
import { useFormat, useGame, useUi } from "../context";
import { GoldIcon, OFFER_PICTO, Picto, ShardIcon, WINDOW_META } from "../icons";
import { Modal } from "../components/Modal";

export function MarketWindow({ onClose }: { onClose: () => void }) {
  const { state, store } = useGame();
  const { t, g } = useI18n();
  const text = t.windows.market;
  const ui = useUi();
  const fmt = useFormat();
  const now = Date.now();
  const hourglass = offlineGains(state, 3600, 1, now).gold;

  return (
    <Modal title={t.hud.windowTitles.market.label} icon={<img src={WINDOW_META.market.icon!} alt="" width={34} height={34} />} onClose={onClose} size="md">
      <div className="market-balance">
        <ShardIcon size={26} />
        <strong>{fmt(state.shards)}</strong> {text.shards}
        <span className="modal-hint">{text.balanceHint}</span>
      </div>
      <div className="market-grid">
        {MARKET_OFFERS.map((offer) => {
          const chest = offer.id === "chest" || offer.id === "great-chest";
          const blocked = (chest && state.inventory.length >= INVENTORY_LIMIT) || (offer.id === "hourglass" && hourglass <= 0);
          const copy = g.market[offer.id];
          return (
            <article key={offer.id} className="market-offer card">
              <Picto name={OFFER_PICTO[offer.id]} size={36} className="market-icon" />
              <h3>{copy.name}</h3>
              <p>{copy.description}</p>
              {offer.id === "hourglass" ? <p className="market-preview"><GoldIcon size={14} /> {hourglass > 0 ? fmt(hourglass) : text.hireFirst}</p> : null}
              {chest && state.inventory.length >= INVENTORY_LIMIT ? <p className="market-preview warn">{text.inventoryFull}</p> : null}
              <button
                type="button"
                className="btn btn-gold btn-sm"
                disabled={state.shards < offer.cost || blocked}
                onClick={() => {
                  const ok = store.act((engine, time) => engine.buyOffer(offer.id, time));
                  if (!ok) audio.play("error");
                  else if (!chest && offer.id !== "hourglass") ui.toast({ tone: "success", icon: OFFER_PICTO[offer.id], title: copy.name, text: text.effectActive });
                }}
              >
                <ShardIcon size={14} /> {offer.cost}
              </button>
            </article>
          );
        })}
      </div>
    </Modal>
  );
}
