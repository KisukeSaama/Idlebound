import { upgradeCost } from "../../../../shared/game/equipment";
import { calculateStats } from "../../../../shared/game/formulas";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";

export function EquipmentView() {
  const { state, dispatch } = useGame();
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const slots = ["weapon", "armor", "accessory"] as const;
  return (
    <Panel title="Equipement">
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <div>ATQ {stats.attack}</div>
        <div>DEF {stats.defense}</div>
        <div>PV {stats.maxHp}</div>
        <div>VIT {stats.attackSpeed.toFixed(1)}s</div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {slots.map((slot) => {
          const item = state.equipment[slot];
          const cost = item ? upgradeCost(item) : 0;
          return (
            <div key={slot} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="mb-2 text-xs uppercase text-slate-400">{slot}</div>
              {item ? (
                <>
                  <h3 className="font-semibold">{item.name} +{item.upgradeLevel}</h3>
                  <p className="text-sm text-slate-400">{item.rarity} · niveau {item.level}</p>
                  <div className="mt-3 space-y-1 text-sm text-slate-300">
                    <div>ATQ +{item.attackBonus}</div>
                    <div>DEF +{item.defenseBonus}</div>
                    <div>PV +{item.hpBonus}</div>
                  </div>
                  <button
                    className="mt-4 w-full rounded-md bg-arcane px-3 py-2 font-semibold text-slate-950 disabled:opacity-40"
                    disabled={state.player.gold < cost || !Number.isFinite(cost)}
                    onClick={() => dispatch({ type: "upgradeEquipped", slot })}
                  >
                    Ameliorer ({Number.isFinite(cost) ? `${cost} or` : "max"})
                  </button>
                </>
              ) : (
                <p className="text-sm text-slate-400">Aucun objet equipe.</p>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
