"use client";

import { ACHIEVEMENTS, altarCost, ALTARS, INVENTORY_LIMIT } from "@idlebound/game";
import { useI18n } from "@/i18n/client";
import { useGame, useUi, type WindowId } from "../context";
import { TrophyIcon, WINDOW_META } from "../icons";

const ORDER: WindowId[] = ["map", "gear", "inventory", "market", "ascension", "hall", "account", "settings"];

export function NavRail({ active }: { active: WindowId | null }) {
  const { state, store } = useGame();
  const ui = useUi();
  const { t } = useI18n();

  const badges: Partial<Record<WindowId, string>> = {};
  if (store.engine.canAscend()) badges.ascension = "!";
  else if (ALTARS.some((altar) => altarCost(altar.id, state.altars[altar.id] ?? 0) <= state.essences)) badges.ascension = "+";
  if (state.inventory.length >= INVENTORY_LIMIT - 4) badges.inventory = "!";
  else if (state.inventory.length > 0) badges.inventory = String(state.inventory.length);
  if (state.shards >= 30) badges.market = "+";
  const unlockedRatio = `${state.achievements.length}/${ACHIEVEMENTS.length}`;

  return (
    <nav className="nav-rail" aria-label={t.hud.nav.label}>
      {ORDER.map((id) => {
        const meta = WINDOW_META[id];
        const title = t.hud.windowTitles[id];
        return (
          <button
            key={id}
            type="button"
            className={`nav-button ${active === id ? "active" : ""}`}
            onClick={() => ui.openWindow(id)}
            aria-label={title.label}
            title={id === "hall" ? t.hud.nav.hallTitle(title.label, unlockedRatio) : title.label}
          >
            {meta.icon ? <img src={meta.icon} alt="" width={46} height={46} draggable={false} /> : <TrophyIcon />}
            <span className="nav-label">{title.shortLabel}</span>
            {badges[id] ? <span className={`nav-badge ${badges[id] === "!" ? "urgent" : ""}`}>{badges[id]}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}
