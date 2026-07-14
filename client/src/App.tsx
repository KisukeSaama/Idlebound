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

      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="idle-card h-fit overflow-hidden rounded-lg">
          <div className="window-title px-4 py-3 text-sm font-semibold uppercase tracking-wide">Aventurier</div>
          <div className="p-4">
            <div className="scene-backdrop relative grid h-36 place-items-center overflow-hidden rounded-md border border-slate-700/70">
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="relative h-20 w-16 rounded-t-full border border-arcane/60 bg-slate-900/80 shadow-glow">
                <div className="absolute left-1/2 top-3 h-7 w-7 -translate-x-1/2 rounded-full border border-arcane/70 bg-slate-950" />
                <div className="absolute left-1/2 top-11 h-12 w-20 -translate-x-1/2 rounded-t-3xl border border-slate-600 bg-slate-800" />
                <div className="absolute -right-8 top-2 h-24 w-2 rotate-45 rounded-full bg-gradient-to-b from-aether to-slate-200" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-base font-bold">{state.player.name}</div>
              <div className="text-sm text-slate-400">Niveau {state.player.level} · Aventurier solo</div>
              <div className="mt-3 grid gap-2 text-sm">
                <div className="rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-arcane">{state.player.experience} XP</div>
                <div className="rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-amber-200">{state.player.gold} or</div>
                <div className="rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sky-200">{state.player.essences} essences</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-md border border-slate-800 bg-slate-950/50 p-2">ATQ {stats.attack}</div>
              <div className="rounded-md border border-slate-800 bg-slate-950/50 p-2">DEF {stats.defense}</div>
              <div className="rounded-md border border-slate-800 bg-slate-950/50 p-2">PV {stats.maxHp}</div>
              <div className="rounded-md border border-slate-800 bg-slate-950/50 p-2">Niv. {state.player.level}</div>
            </div>
          </div>
          <nav className="grid gap-1 border-t border-slate-800/80 p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md border px-3 py-2 text-left text-sm font-semibold ${
                  activeTab === tab
                    ? "border-arcane/60 bg-arcane/15 text-arcane"
                    : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900/70 hover:text-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        <section>
        {activeTab === "Combat" && <CombatView />}
        {activeTab === "Zones" && <ZonesView />}
        {activeTab === "Equipement" && <EquipmentView />}
        {activeTab === "Inventaire" && <InventoryView />}
        {activeTab === "Boutique" && <ShopView />}
        {activeTab === "Essences" && <EssencesView />}
        {activeTab === "Sauvegarde" && <SaveView />}
        {activeTab === "Parametres" && <SettingsView />}
        </section>
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
