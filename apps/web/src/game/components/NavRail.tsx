"use client";

import { ACHIEVEMENTS, altarPrice, ALTARS, INVENTORY_LIMIT, MARKET_OFFERS, unreadChronicle } from "@idlebound/game";
import { useEffect } from "react";
import { useI18n } from "@/i18n/client";
import { perPublish, useCloud, useGame, useReveals, useUi, type WindowId } from "../context";
import { readSeen, writeSeen, type SeenMarks } from "../seen";
import type { RevealId } from "../shell";
import { WindowIcon } from "../icons";

/** The pack is a tab of the equipment window: one key in the rail opens both. */
const ORDER: WindowId[] = ["map", "gear", "market", "ascension", "hall", "account", "settings"];
/**
 * What earns each menu its place in the rail. The account (to find a game again at once) and
 * the settings (for accessibility) are always there.
 */
const REVEAL: Partial<Record<WindowId, RevealId>> = {
  map: "map",
  gear: "gear",
  market: "market",
  ascension: "ascension",
  hall: "hall"
};

type Badge = { text: string; urgent?: boolean; label: string };

export function NavRail({ active }: { active: WindowId | null }) {
  const { state, store } = useGame();
  const ui = useUi();
  const cloud = useCloud();
  const { shown, freshClass } = useReveals();
  const { t } = useI18n();
  const m = t.hud.nav;
  const open = active === "inventory" ? "gear" : active;

  const now = (): SeenMarks => ({ relics: state.inventory.map((item) => item.uid), essences: state.essences, shards: state.shards });
  const seen = readSeen(state.createdAt, now);
  // Opening a window marks what it shows as seen: its badge goes out until something new comes.
  useEffect(() => {
    if (open === "gear") writeSeen(state.createdAt, { ...seen, relics: [...seen.relics, ...state.inventory.map((item) => item.uid).filter((uid) => !seen.relics.includes(uid))] });
    else if (open === "ascension") writeSeen(state.createdAt, { ...seen, essences: state.essences });
    else if (open === "market") writeSeen(state.createdAt, { ...seen, shards: state.shards });
  });

  // A badge says something new, once: only the full pack and the address to confirm stay lit.
  const badges: Partial<Record<WindowId, Badge>> = {};
  if (store.engine.canAscend()) badges.ascension = { text: "!", urgent: true, label: m.badgeAscend };
  else if (state.essences > seen.essences && ALTARS.some((altar) => altarPrice(state, altar.id) <= state.essences)) {
    badges.ascension = { text: "+", label: m.badgeEssences };
  }
  const fresh = state.inventory.filter((item) => !seen.relics.includes(item.uid)).length;
  if (state.inventory.length >= INVENTORY_LIMIT - 4) badges.gear = { text: "!", urgent: true, label: m.badgePackFull };
  else if (fresh > 0) badges.gear = { text: String(fresh), label: m.badgeRelics(fresh) };
  if (MARKET_OFFERS.some((offer) => offer.cost > seen.shards && offer.cost <= state.shards)) badges.market = { text: "+", label: m.badgeWare };
  if (cloud.user && !cloud.user.emailVerified) badges.account = { text: "!", urgent: true, label: m.badgeAddress };
  const unread = perPublish(store, "unread", () => unreadChronicle(state));
  if (unread > 0) badges.hall = { text: String(unread), label: m.unread(unread) };
  const unlockedRatio = `${state.achievements.length}/${ACHIEVEMENTS.length}`;

  return (
    <nav className="nav-rail" aria-label={m.label}>
      {ORDER.filter((id) => !REVEAL[id] || shown[REVEAL[id]]).map((id) => {
        const reveal = REVEAL[id];
        const title = t.hud.windowTitles[id];
        const badge = badges[id];
        return (
          <button
            key={id}
            type="button"
            className={`nav-button ${open === id ? "active" : ""}${reveal ? freshClass(reveal) : ""}`}
            data-window={id}
            onClick={() => ui.openWindow(id === "gear" && fresh > 0 ? "inventory" : id)}
            aria-label={badge ? `${title.label}, ${badge.label}` : title.label}
            title={id === "hall" ? `${m.hallTitle(title.label, unlockedRatio)}${unread > 0 ? ` · ${m.unread(unread)}` : ""}` : title.label}
          >
            <WindowIcon id={id} size={46} />
            <span className="nav-label">{title.shortLabel}</span>
            {badge ? (
              <span key={badge.text} className={`nav-badge ${badge.urgent ? "urgent" : ""}`} aria-hidden="true">
                {badge.text}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
