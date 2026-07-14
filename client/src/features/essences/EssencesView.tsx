import { ESSENCE_UPGRADES } from "../../../../shared/data/essences";
import { essenceUpgradeCost } from "../../../../shared/game/formulas";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";

export function EssencesView() {
  const { state, dispatch } = useGame();
  return (
    <Panel title="Essences">
      <div className="mb-4 inline-flex rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-100">
        Essences disponibles : {state.player.essences}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ESSENCE_UPGRADES.map((upgrade) => {
          const rank = state.essenceUpgrades[upgrade.id] ?? 0;
          const cost = essenceUpgradeCost(upgrade.id, rank);
          return (
            <div key={upgrade.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-gradient-to-r from-sky-300 to-arcane" style={{ width: `${(rank / upgrade.maxRank) * 100}%` }} />
              </div>
              <h3 className="font-semibold text-slate-50">{upgrade.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{upgrade.description}</p>
              <div className="mt-3 text-sm font-semibold text-slate-300">Rang {rank}/{upgrade.maxRank}</div>
              <button
                className="mt-4 w-full rounded-md bg-arcane px-3 py-2 font-semibold text-slate-950 shadow-glow disabled:opacity-40"
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
