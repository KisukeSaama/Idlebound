import { calculatePower, calculateStats } from "../../../../shared/game/formulas";
import { getSelectedZone } from "../../store/gameEngine";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";
import { ProgressBar } from "../../components/ProgressBar";
import { StatPill } from "../../components/StatPill";

export function CombatView() {
  const { state, dispatch } = useGame();
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const power = calculatePower(stats, state.player.level);
  const zone = getSelectedZone(state);
  const kills = state.zoneProgress.killsByZone[zone.id] ?? 0;
  const bossReady = state.zoneProgress.bossReady[zone.id];
  const enemy = state.combat.enemy;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel title="Combat automatique">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatPill label="Niveau" value={state.player.level} />
          <StatPill label="Puissance" value={power} />
          <StatPill label="Or" value={state.player.gold} />
          <StatPill label="Essences" value={state.player.essences} />
        </div>
        <div className="mt-4">
          <ProgressBar
            value={state.player.experience}
            max={state.player.experienceToNext}
            label={`${state.player.experience} / ${state.player.experienceToNext} XP`}
          />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Aventurier</h3>
              <span className="text-sm text-slate-400">VIT {stats.attackSpeed.toFixed(1)}s</span>
            </div>
            <div className="mb-3 h-24 rounded-md border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-950 p-3">
              <div className="h-full w-16 rounded-full border border-arcane/50 bg-arcane/20" />
            </div>
            <ProgressBar value={state.player.currentHp} max={stats.maxHp} tone="red" label={`${Math.ceil(state.player.currentHp)} / ${stats.maxHp} PV`} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-slate-300">
              <span>ATQ {stats.attack}</span>
              <span>DEF {stats.defense}</span>
              <span>PV {stats.maxHp}</span>
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{enemy?.name ?? "Recherche..."}</h3>
              <span className="text-sm text-slate-400">{enemy?.isBoss ? "Boss" : "Monstre"}</span>
            </div>
            <div className="mb-3 flex h-24 items-center justify-center rounded-md border border-slate-700 bg-gradient-to-br from-red-950/50 to-slate-950">
              <div className={`${enemy?.isBoss ? "h-20 w-20" : "h-14 w-14"} rounded-md border border-ember/50 bg-ember/20 rotate-45`} />
            </div>
            <ProgressBar value={enemy?.currentHp ?? 0} max={enemy?.maxHp ?? 1} tone="red" label={`${Math.max(0, Math.ceil(enemy?.currentHp ?? 0))} / ${enemy?.maxHp ?? 0} PV`} />
            <div className="mt-3 text-sm text-slate-300">
              Zone : {zone.name} · {kills}/{zone.enemiesToBoss} avant boss
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="rounded-md bg-ember px-4 py-2 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!bossReady}
            onClick={() => dispatch({ type: "fightBoss" })}
          >
            Tenter le boss
          </button>
          <button
            className="rounded-md border border-slate-700 px-4 py-2 text-slate-200"
            onClick={() => dispatch({ type: "toggleSetting", key: "autoContinue" })}
          >
            Auto {state.settings.autoContinue ? "actif" : "pause"}
          </button>
        </div>
      </Panel>
      <Panel title="Journal">
        {state.combat.lastRewards ? (
          <div className="mb-3 rounded-md border border-emerald-800 bg-emerald-950/30 p-3 text-sm text-emerald-100">
            Dernier gain : {state.combat.lastRewards.experience} XP, {state.combat.lastRewards.gold} or, {state.combat.lastRewards.essences} essence(s)
          </div>
        ) : null}
        <div className="max-h-[420px] space-y-2 overflow-auto pr-1 text-sm">
          {state.combat.log.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-md border px-3 py-2 ${
                entry.tone === "good"
                  ? "border-emerald-800 bg-emerald-950/30 text-emerald-100"
                  : entry.tone === "bad"
                    ? "border-red-900 bg-red-950/30 text-red-100"
                    : entry.tone === "loot"
                      ? "border-amber-800 bg-amber-950/30 text-amber-100"
                      : "border-slate-800 bg-slate-950/50 text-slate-300"
              }`}
            >
              {entry.message}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
