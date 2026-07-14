import { ITEM_CATALOG } from "../../../../shared/data/items";
import { useGame } from "../../store/GameContext";
import { ItemCard } from "../../components/ItemCard";
import { Panel } from "../../components/Panel";

export function ShopView() {
  const { state, dispatch } = useGame();
  const offers = state.shop.offeredItemIds.map((id) => ITEM_CATALOG.find((item) => item.id === id)).filter(Boolean);
  return (
    <Panel
      title="Boutique"
      action={<button className="rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm hover:border-arcane/60" onClick={() => dispatch({ type: "refreshShop" })}>Renouveler</button>}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((item) => (
          <ItemCard key={item!.id} item={item!} meta={<span className="text-sm font-semibold text-amber-200">{item!.price} or</span>}>
            <button
              className="mt-4 w-full rounded-md bg-ember px-3 py-2 font-semibold text-slate-950 shadow-ember disabled:opacity-40"
              disabled={state.player.gold < item!.price}
              onClick={() => dispatch({ type: "buyShopItem", itemId: item!.id })}
            >
              Acheter {item!.price} or
            </button>
          </ItemCard>
        ))}
      </div>
    </Panel>
  );
}
