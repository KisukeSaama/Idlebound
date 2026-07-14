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

const tabCodes: Record<Tab, string> = {
  Combat: "fight.html",
  Zones: "zones.html",
  Equipement: "gear.html",
  Inventaire: "bag.html",
  Boutique: "shop.html",
  Essences: "runes.html",
  Sauvegarde: "save.html",
  Parametres: "config.html"
};

type Tab = (typeof tabs)[number];

function GameShell() {
  const [activeTab, setActiveTab] = useState<Tab>("Combat");
  const { state } = useGame();
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const power = calculatePower(stats, state.player.level);

  return (
    <main className="app-shell min-h-screen text-white">
      <header className="sticky top-0 z-20 border-b border-white/15 bg-black px-3 py-2">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 text-xs font-black uppercase">
          <div className="flex items-center gap-4">
            <span className="text-white">Idlebound</span>
            <span className="hidden text-white/45 sm:inline">Solo MVP</span>
          </div>
          <div className="flex items-center gap-3 text-white/70">
            <span>Paris</span>
            <span>{new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
            <span>PWR {power}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-4 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="idle-card h-fit">
          <div className="window-title px-3 py-2 text-xs font-black uppercase">player.html</div>
          <div className="p-3">
            <div className="grid h-28 place-items-center border border-white/20 bg-white">
              <div className="pixel-sprite relative h-16 w-16 bg-black">
                <div className="absolute left-2 top-7 h-3 w-4 bg-ember" />
                <div className="absolute right-2 top-7 h-3 w-4 bg-ember" />
                <div className="absolute -left-2 top-0 h-4 w-4 bg-black" />
                <div className="absolute -right-2 top-0 h-4 w-4 bg-black" />
              </div>
            </div>
            <div className="mt-3 text-xs font-black uppercase leading-5">
              <div>{state.player.name} &lt;v{state.player.level}/&gt;</div>
              <div className="text-white/55">Aventurier solo</div>
              <div className="mt-2 text-arcane">{state.player.experience} XP</div>
              <div className="text-amber-300">{state.player.gold} or</div>
              <div className="text-sky-200">{state.player.essences} essences</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black">
              <div className="border border-white/20 bg-[#242424] p-2">ATQ {stats.attack}</div>
              <div className="border border-white/20 bg-[#242424] p-2">DEF {stats.defense}</div>
              <div className="border border-white/20 bg-[#242424] p-2">PV {stats.maxHp}</div>
              <div className="border border-white/20 bg-[#242424] p-2">LVL {state.player.level}</div>
            </div>
          </div>
          <nav className="grid gap-1 border-t border-white/15 p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border px-3 py-2 text-left text-xs font-black uppercase ${
                  activeTab === tab
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-[#191919] text-white/65 hover:border-white/40 hover:text-white"
                }`}
              >
                {tabCodes[tab]}
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
