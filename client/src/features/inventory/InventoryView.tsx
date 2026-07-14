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
              meta={<span className="text-xs font-black text-white">{itemPower(item) - (equipped ? itemPower(equipped) : 0) >= 0 ? "+" : ""}{itemPower(item) - (equipped ? itemPower(equipped) : 0)}</span>}
            >
              <div className="mt-4 flex gap-2">
                <button className="border border-white bg-white px-3 py-2 text-xs font-black uppercase text-black" onClick={() => dispatch({ type: "equipItem", instanceId: item.instanceId! })}>
                  Equiper
                </button>
                <button className="border border-white/25 bg-black px-3 py-2 text-xs font-black uppercase" onClick={() => dispatch({ type: "sellItem", instanceId: item.instanceId! })}>
                  Vendre {sellValue(item)}
                </button>
              </div>
            </ItemCard>
          );
        })}
        {state.inventory.length === 0 ? <p className="text-xs font-black uppercase text-white/45">Aucun objet en reserve pour le moment.</p> : null}
      </div>
    </Panel>
  );
}
