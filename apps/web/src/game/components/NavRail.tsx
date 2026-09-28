"use client";

import { ACHIEVEMENTS, altarCost, ALTARS, INVENTORY_LIMIT, unreadChronicle } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { perPublish, useCloud, useGame, useReveals, useUi, type WindowId } from "../context";
import type { RevealId } from "../shell";
import { WindowIcon } from "../icons";

const ORDER: WindowId[] = ["map", "gear", "inventory", "market", "ascension", "hall", "account", "settings"];
/** What earns each menu its place in the rail (the settings are always there, for accessibility). */
const REVEAL: Record<Exclude<WindowId, "settings">, RevealId> = {
  map: "map",
  gear: "gear",
  inventory: "gear",
  market: "market",
  ascension: "ascension",
  hall: "hall",
  account: "account"
};

export function NavRail({ active }: { active: WindowId | null }) {
  const { state, store } = useGame();
  const ui = useUi();
  const cloud = useCloud();
  const { shown, freshClass } = useReveals();
  const { t } = useI18n();

  const badges: Partial<Record<WindowId, string>> = {};
  if (store.engine.canAscend()) badges.ascension = "!";
  else if (ALTARS.some((altar) => altarCost(altar.id, state.altars[altar.id] ?? 0) <= state.essences)) badges.ascension = "+";
  if (state.inventory.length >= INVENTORY_LIMIT - 4) badges.inventory = "!";
  else if (state.inventory.length > 0) badges.inventory = String(state.inventory.length);
  if (state.shards >= 30) badges.market = "+";
  if (cloud.user && !cloud.user.emailVerified) badges.account = "!";
  const unread = perPublish(store, "unread", () => unreadChronicle(state));
  if (unread > 0) badges.hall = String(unread);
  const unlockedRatio = `${state.achievements.length}/${ACHIEVEMENTS.length}`;

  return (
    <nav className="nav-rail" aria-label={t.hud.nav.label}>
      {ORDER.filter((id) => id === "settings" || shown[REVEAL[id]]).map((id) => {
        const title = t.hud.windowTitles[id];
        return (
          <button
            key={id}
            type="button"
            className={`nav-button ${active === id ? "active" : ""}${id === "settings" ? "" : freshClass(REVEAL[id])}`}
            onClick={() => ui.openWindow(id)}
            aria-label={title.label}
            title={id === "hall" ? `${t.hud.nav.hallTitle(title.label, unlockedRatio)}${unread > 0 ? ` · ${t.hud.nav.unread(unread)}` : ""}` : title.label}
          >
            <WindowIcon id={id} size={46} />
            <span className="nav-label">{title.shortLabel}</span>
            {badges[id] ? <span className={`nav-badge ${badges[id] === "!" ? "urgent" : ""}`}>{badges[id]}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}
