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
    <Panel title="Equipement">
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <div className="border border-white/20 bg-[#242424] px-3 py-2 text-xs font-black uppercase">ATQ {stats.attack}</div>
        <div className="border border-white/20 bg-[#242424] px-3 py-2 text-xs font-black uppercase">DEF {stats.defense}</div>
        <div className="border border-white/20 bg-[#242424] px-3 py-2 text-xs font-black uppercase">PV {stats.maxHp}</div>
        <div className="border border-white/20 bg-[#242424] px-3 py-2 text-xs font-black uppercase">VIT {stats.attackSpeed.toFixed(1)}s</div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {slots.map((slot) => {
          const item = state.equipment[slot];
          const cost = item ? upgradeCost(item) : 0;
          return (
            <div key={slot}>
              <div className="mb-2 text-xs font-black uppercase text-white/45">{slot}</div>
              {item ? (
                <ItemCard item={item} meta={<span className="text-sm text-arcane">+{item.upgradeLevel}</span>}>
                  <button
                    className="mt-4 w-full border border-white bg-white px-3 py-2 text-xs font-black uppercase text-black disabled:opacity-40"
                    disabled={state.player.gold < cost || !Number.isFinite(cost)}
                    onClick={() => dispatch({ type: "upgradeEquipped", slot })}
                  >
                    Ameliorer ({Number.isFinite(cost) ? `${cost} or` : "max"})
                  </button>
                </ItemCard>
              ) : (
                <p className="border border-white/20 bg-[#202020] p-4 text-xs font-black uppercase text-white/45">Aucun objet equipe.</p>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
