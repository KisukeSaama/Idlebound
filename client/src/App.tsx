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
  "Combat",
  "Zones",
  "Equipement",
  "Inventaire",
  "Boutique",
  "Essences",
  "Sauvegarde",
  "Parametres"
] as const;

type Tab = (typeof tabs)[number];

function GameShell() {
  const [activeTab, setActiveTab] = useState<Tab>("Combat");
  const { state } = useGame();
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const power = calculatePower(stats, state.player.level);

  return (
    <main className="app-shell min-h-screen text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <header className="mb-5 overflow-hidden rounded-lg border border-slate-800/80 bg-slate-950/55 shadow-2xl">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-arcane">Solo expedition</div>
            <h1 className="mt-1 text-4xl font-black text-slate-50 sm:text-5xl">Idlebound</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Progression automatique, butin, essences et sauvegarde locale.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm sm:grid-cols-6 lg:min-w-[38rem]">
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"><span className="text-slate-500">Niv.</span> {state.player.level}</div>
            <div className="rounded-lg border border-arcane/30 bg-arcane/10 px-3 py-2 text-arcane"><span className="text-slate-400">PWR</span> {power}</div>
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-amber-200">{state.player.gold} or</div>
            <div className="rounded-lg border border-sky-400/25 bg-sky-400/10 px-3 py-2 text-sky-200">{state.player.essences} ess.</div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">ATQ {stats.attack}</div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">DEF {stats.defense}</div>
          </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-800/80 bg-slate-950/55 p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-md border px-3 py-2 text-sm font-semibold ${
                  activeTab === tab
                    ? "border-arcane/70 bg-arcane text-slate-950 shadow-glow"
                    : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === "Combat" && <CombatView />}
        {activeTab === "Zones" && <ZonesView />}
        {activeTab === "Equipement" && <EquipmentView />}
        {activeTab === "Inventaire" && <InventoryView />}
        {activeTab === "Boutique" && <ShopView />}
        {activeTab === "Essences" && <EssencesView />}
        {activeTab === "Sauvegarde" && <SaveView />}
        {activeTab === "Parametres" && <SettingsView />}
      </div>
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
