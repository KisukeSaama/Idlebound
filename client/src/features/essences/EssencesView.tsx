import { ESSENCE_UPGRADES } from "../../../../shared/data/essences";
import { essenceUpgradeCost } from "../../../../shared/game/formulas";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";

export function EssencesView() {
  const { state, dispatch } = useGame();
  return (
    <Panel title="Essences">
      <div className="mb-4 text-sm text-slate-300">Essences disponibles : {state.player.essences}</div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ESSENCE_UPGRADES.map((upgrade) => {
          const rank = state.essenceUpgrades[upgrade.id] ?? 0;
          const cost = essenceUpgradeCost(upgrade.id, rank);
          return (
            <div key={upgrade.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <h3 className="font-semibold">{upgrade.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{upgrade.description}</p>
              <div className="mt-3 text-sm text-slate-300">Rang {rank}/{upgrade.maxRank}</div>
              <button
                className="mt-4 w-full rounded-md bg-arcane px-3 py-2 font-semibold text-slate-950 disabled:opacity-40"
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
