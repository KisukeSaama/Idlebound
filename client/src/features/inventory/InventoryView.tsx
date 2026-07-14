import { INVENTORY_LIMIT } from "../../../../shared/constants/balance";
import { itemPower, sellValue } from "../../../../shared/game/equipment";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";

export function InventoryView() {
  const { state, dispatch } = useGame();
  return (
    <Panel title={`Inventaire (${state.inventory.length}/${INVENTORY_LIMIT})`}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {state.inventory.map((item) => {
          const equipped = state.equipment[item.slot];
          return (
            <div key={item.instanceId} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-400">{item.rarity} · {item.slot} · niv. {item.level}</p>
                </div>
                <span className="text-sm text-arcane">{itemPower(item) - (equipped ? itemPower(equipped) : 0) >= 0 ? "+" : ""}{itemPower(item) - (equipped ? itemPower(equipped) : 0)}</span>
              </div>
              <div className="mt-3 text-sm text-slate-300">
                ATQ +{item.attackBonus} · DEF +{item.defenseBonus} · PV +{item.hpBonus}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="rounded-md bg-arcane px-3 py-2 text-sm font-semibold text-slate-950" onClick={() => dispatch({ type: "equipItem", instanceId: item.instanceId! })}>
                  Equiper
                </button>
                <button className="rounded-md border border-slate-700 px-3 py-2 text-sm" onClick={() => dispatch({ type: "sellItem", instanceId: item.instanceId! })}>
                  Vendre {sellValue(item)}
                </button>
              </div>
            </div>
          );
        })}
        {state.inventory.length === 0 ? <p className="text-slate-400">Aucun objet en reserve pour le moment.</p> : null}
      </div>
    </Panel>
  );
}
