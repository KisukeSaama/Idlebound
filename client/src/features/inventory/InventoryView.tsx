import { INVENTORY_LIMIT } from "../../../../shared/constants/balance";
import { itemPower, sellValue } from "../../../../shared/game/equipment";
import { useGame } from "../../store/GameContext";
import { ItemCard } from "../../components/ItemCard";
import { Panel } from "../../components/Panel";

export function InventoryView() {
  const { state, dispatch } = useGame();
  return (
    <Panel title={`Inventaire (${state.inventory.length}/${INVENTORY_LIMIT})`}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {state.inventory.map((item) => {
          const equipped = state.equipment[item.slot];
          return (
            <ItemCard
              key={item.instanceId}
              item={item}
              meta={<span className="text-sm font-semibold text-arcane">{itemPower(item) - (equipped ? itemPower(equipped) : 0) >= 0 ? "+" : ""}{itemPower(item) - (equipped ? itemPower(equipped) : 0)}</span>}
            >
              <div className="mt-4 flex gap-2">
                <button className="rounded-md bg-arcane px-3 py-2 text-sm font-semibold text-slate-950 shadow-glow" onClick={() => dispatch({ type: "equipItem", instanceId: item.instanceId! })}>
                  Equiper
                </button>
                <button className="rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm" onClick={() => dispatch({ type: "sellItem", instanceId: item.instanceId! })}>
                  Vendre {sellValue(item)}
                </button>
              </div>
            </ItemCard>
          );
        })}
        {state.inventory.length === 0 ? <p className="text-slate-400">Aucun objet en réserve pour le moment.</p> : null}
      </div>
    </Panel>
  );
}
