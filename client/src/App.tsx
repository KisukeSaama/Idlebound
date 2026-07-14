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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_32rem),#070a12] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <header className="mb-5 flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-50">Idlebound</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              MVP Solo · progression automatique, equipement, essences et sauvegarde locale.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm sm:grid-cols-6">
            <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">Niv. {state.player.level}</div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">PWR {power}</div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">{state.player.gold} or</div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">{state.player.essences} ess.</div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">ATQ {stats.attack}</div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">DEF {stats.defense}</div>
          </div>
        </header>

        <nav className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-md border px-3 py-2 text-sm font-medium ${
                activeTab === tab ? "border-arcane bg-arcane text-slate-950" : "border-slate-800 bg-slate-950/60 text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

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
