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

const windowConfig: Record<Tab, { label: string; icon: string }> = {
  Zones: { label: "Zones", icon: "Z" },
  Equipement: { label: "Equipement", icon: "E" },
  Inventaire: { label: "Inventaire", icon: "I" },
  Boutique: { label: "Boutique", icon: "B" },
  Essences: { label: "Essences", icon: "S" },
  Sauvegarde: { label: "Sauvegarde", icon: "V" },
  Parametres: { label: "Parametres", icon: "P" }
};

function GameShell() {
  const [activeWindow, setActiveWindow] = useState<Tab | null>(null);
  const { state } = useGame();
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const power = calculatePower(stats, state.player.level);

  return (
    <main className="app-shell min-h-screen text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 px-3 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="grid h-9 w-9 place-items-center rounded-md border border-arcane/40 bg-arcane/10 text-sm font-black text-arcane">IB</div>
            <div>
              <div className="text-lg font-black">Idlebound</div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Expedition solo</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm md:flex">
            <span className="rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-300">Puissance {power}</span>
            <span className="rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-amber-200">{state.player.gold} or</span>
            <span className="rounded-md border border-sky-400/25 bg-sky-400/10 px-3 py-2 text-sky-200">{state.player.essences} essences</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-4 lg:grid-cols-[72px_minmax(0,1fr)]">
        <aside className="idle-card sticky top-20 z-10 h-fit overflow-hidden rounded-lg p-2">
          <nav className="grid gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                title={windowConfig[tab].label}
                aria-label={windowConfig[tab].label}
                onClick={() => setActiveWindow(tab)}
                className={`grid h-12 w-12 place-items-center rounded-md border text-sm font-black ${
                  activeWindow === tab
                    ? "border-arcane/70 bg-arcane/20 text-arcane shadow-glow"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-600 hover:text-slate-100"
                }`}
              >
                {windowConfig[tab].icon}
              </button>
            ))}
          </nav>
        </aside>

        <section>
          <CombatView />
        </section>
      </div>

      {activeWindow ? (
        <div className="fixed inset-0 z-30 bg-slate-950/72 p-4 backdrop-blur-sm" onMouseDown={() => setActiveWindow(null)}>
          <div
            className="mx-auto mt-12 max-h-[82vh] max-w-6xl overflow-auto rounded-lg border border-slate-700 bg-slate-950 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-100">{windowConfig[activeWindow].label}</div>
                <div className="text-xs text-slate-500">Fenetre superposee</div>
              </div>
              <button
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-arcane/60 hover:text-slate-100"
                onClick={() => setActiveWindow(null)}
              >
                Fermer
              </button>
            </div>
            <div className="p-4">
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
