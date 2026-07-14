import { ITEM_CATALOG } from "../../../../shared/data/items";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";

export function ShopView() {
  const { state, dispatch } = useGame();
  const offers = state.shop.offeredItemIds.map((id) => ITEM_CATALOG.find((item) => item.id === id)).filter(Boolean);
  return (
    <Panel
      title="Boutique"
      action={<button className="rounded-md border border-slate-700 px-3 py-2 text-sm" onClick={() => dispatch({ type: "refreshShop" })}>Renouveler</button>}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((item) => (
          <div key={item!.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <h3 className="font-semibold">{item!.name}</h3>
            <p className="text-sm text-slate-400">{item!.rarity} · {item!.slot} · niv. {item!.level}</p>
            <div className="mt-3 text-sm text-slate-300">ATQ +{item!.attackBonus} · DEF +{item!.defenseBonus} · PV +{item!.hpBonus}</div>
            <button
              className="mt-4 w-full rounded-md bg-ember px-3 py-2 font-semibold text-slate-950 disabled:opacity-40"
              disabled={state.player.gold < item!.price}
              onClick={() => dispatch({ type: "buyShopItem", itemId: item!.id })}
            >
              Acheter {item!.price} or
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
