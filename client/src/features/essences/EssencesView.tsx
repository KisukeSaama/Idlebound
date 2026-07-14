import { ESSENCE_UPGRADES } from "../../../../shared/data/essences";
import { essenceUpgradeCost } from "../../../../shared/game/formulas";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";

export function EssencesView() {
  const { state, dispatch } = useGame();
  return (
    <Panel title="Essences">
      <div className="mb-4 inline-flex border border-white/25 bg-[#242424] px-4 py-2 text-xs font-black uppercase text-white">
        Essences disponibles : {state.player.essences}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ESSENCE_UPGRADES.map((upgrade) => {
          const rank = state.essenceUpgrades[upgrade.id] ?? 0;
          const cost = essenceUpgradeCost(upgrade.id, rank);
          return (
            <div key={upgrade.id} className="border border-white/20 bg-[#202020] p-4">
              <div className="mb-3 h-3 overflow-hidden border border-white/20 bg-black">
                <div className="h-full bg-white" style={{ width: `${(rank / upgrade.maxRank) * 100}%` }} />
              </div>
              <h3 className="text-sm font-black uppercase text-white">{upgrade.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase text-white/45">{upgrade.description}</p>
              <div className="mt-3 text-xs font-black uppercase text-white">Rang {rank}/{upgrade.maxRank}</div>
              <button
                className="mt-4 w-full border border-white bg-white px-3 py-2 text-xs font-black uppercase text-black disabled:opacity-40"
                disabled={rank >= upgrade.maxRank || state.player.essences < cost}
                onClick={() => dispatch({ type: "buyEssenceUpgrade", upgradeId: upgrade.id })}
              >
                Ameliorer ({cost})
              </button>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
