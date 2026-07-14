import { upgradeCost } from "../../../../shared/game/equipment";
import { calculateStats } from "../../../../shared/game/formulas";
import { useGame } from "../../store/GameContext";
import { ItemCard } from "../../components/ItemCard";
import { Panel } from "../../components/Panel";

export function EquipmentView() {
  const { state, dispatch } = useGame();
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const slots = ["weapon", "armor", "accessory"] as const;
  return (
    <Panel title="Équipement">
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">ATQ {stats.attack}</div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">DEF {stats.defense}</div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">PV {stats.maxHp}</div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">VIT {stats.attackSpeed.toFixed(1)}s</div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {slots.map((slot) => {
          const item = state.equipment[slot];
          const cost = item ? upgradeCost(item) : 0;
          return (
            <div key={slot}>
              <div className="mb-2 text-xs uppercase text-slate-400">{slot}</div>
              {item ? (
                <ItemCard item={item} meta={<span className="text-sm text-arcane">+{item.upgradeLevel}</span>}>
                  <button
                    className="mt-4 w-full rounded-md bg-arcane px-3 py-2 font-semibold text-slate-950 shadow-glow disabled:opacity-40"
                    disabled={state.player.gold < cost || !Number.isFinite(cost)}
                    onClick={() => dispatch({ type: "upgradeEquipped", slot })}
                  >
                    Améliorer ({Number.isFinite(cost) ? `${cost} or` : "max"})
                  </button>
                </ItemCard>
              ) : (
                <p className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">Aucun objet équipé.</p>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
