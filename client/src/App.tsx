import { useState } from "react";
import { calculatePower, calculateStats } from "../../shared/game/formulas";
import { CombatView } from "./features/combat/CombatView";
import { EquipmentView } from "./features/equipment/EquipmentView";
import { EssencesView } from "./features/essences/EssencesView";
import { InventoryView } from "./features/inventory/InventoryView";
import { SaveView } from "./features/save/SaveView";
import { SettingsView } from "./features/settings/SettingsView";
import { ShopView } from "./features/shop/ShopView";
import { ZonesView } from "./features/zones/ZonesView";
import { GameProvider, useGame } from "./store/GameContext";

const tabs = [
  "Zones",
  "Equipement",
  "Inventaire",
  "Boutique",
  "Essences",
  "Sauvegarde",
  "Parametres"
] as const;

type Tab = (typeof tabs)[number];

const windowConfig: Record<Tab, { label: string; sidebarIcon: string }> = {
  Zones: { label: "Zones", sidebarIcon: "/assets/icons/sidebar-zones-map.png" },
  Equipement: {
    label: "Equipement",
    sidebarIcon: "/assets/icons/sidebar-equipment-helmet.png"
  },
  Inventaire: {
    label: "Inventaire",
    sidebarIcon: "/assets/icons/sidebar-inventory-backpack.png"
  },
  Boutique: { label: "Boutique", sidebarIcon: "/assets/icons/sidebar-shop-stall.png" },
  Essences: {
    label: "Essences",
    sidebarIcon: "/assets/icons/sidebar-essences-crystals.png"
  },
  Sauvegarde: {
    label: "Sauvegarde",
    sidebarIcon: "/assets/icons/sidebar-save-disk.png"
  },
  Parametres: {
    label: "Parametres",
    sidebarIcon: "/assets/icons/sidebar-settings-gear.png"
  }
};

function GameShell() {
  const [activeWindow, setActiveWindow] = useState<Tab | null>(null);
  const { state } = useGame();
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const power = calculatePower(stats, state.player.level);

  return (
    <main className="app-shell h-screen overflow-hidden text-slate-100">
      <header className="app-header border-b border-slate-800/80 bg-slate-950/80 px-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="grid h-9 w-9 place-items-center rounded-md border border-arcane/40 bg-arcane/10 text-sm font-black text-arcane">IB</div>
            <div>
              <div className="text-base font-black leading-tight">Idlebound</div>
              <div className="text-[0.68rem] uppercase tracking-wide text-slate-500">Expedition solo</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm md:flex">
            <span className="rounded-md border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300">Puissance {power}</span>
            <span className="rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-amber-200">{state.player.gold} or</span>
            <span className="rounded-md border border-sky-400/25 bg-sky-400/10 px-3 py-1.5 text-sky-200">{state.player.essences} essences</span>
          </div>
        </div>
      </header>

      <div className="game-layout">
        <aside className="icon-sidebar idle-card">
          <nav className="icon-sidebar-nav">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                title={windowConfig[tab].label}
                aria-label={windowConfig[tab].label}
                onClick={() => setActiveWindow(tab)}
                className={`icon-button ${
                  activeWindow === tab
                    ? "icon-button-active"
                    : "icon-button-idle"
                }`}
              >
                <img src={windowConfig[tab].sidebarIcon} alt="" aria-hidden="true" />
              </button>
            ))}
          </nav>
        </aside>

        <section className="combat-main">
          <CombatView />
        </section>
      </div>

      {activeWindow ? (
        <div className="window-backdrop" onMouseDown={() => setActiveWindow(null)}>
          <div
            className="overlay-window"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="overlay-titlebar">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-100">{windowConfig[activeWindow].label}</div>
                <div className="text-xs text-slate-500">Fenetre superposee</div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-arcane/60 hover:text-slate-100"
                onClick={() => setActiveWindow(null)}
              >
                Fermer
              </button>
            </div>
            <div className="overlay-content">
              {activeWindow === "Zones" && <ZonesView />}
              {activeWindow === "Equipement" && <EquipmentView />}
              {activeWindow === "Inventaire" && <InventoryView />}
              {activeWindow === "Boutique" && <ShopView />}
              {activeWindow === "Essences" && <EssencesView />}
              {activeWindow === "Sauvegarde" && <SaveView />}
              {activeWindow === "Parametres" && <SettingsView />}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
