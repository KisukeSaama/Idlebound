import { calculatePower, calculateStats } from "../../../../shared/game/formulas";
import { getSelectedZone } from "../../store/gameEngine";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";
import { ProgressBar } from "../../components/ProgressBar";
import { StatPill } from "../../components/StatPill";
import { CombatPortrait } from "./CombatPortrait";

export function CombatView() {
  const { state, dispatch } = useGame();
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const power = calculatePower(stats, state.player.level);
  const zone = getSelectedZone(state);
  const kills = state.zoneProgress.killsByZone[zone.id] ?? 0;
  const bossReady = state.zoneProgress.bossReady[zone.id];
  const enemy = state.combat.enemy;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <Panel title="Combat automatique">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <StatPill label="Niveau" value={state.player.level} />
          <StatPill label="Puissance" value={power} />
          <StatPill label="Or" value={state.player.gold} />
          <StatPill label="Essences" value={state.player.essences} />
        </div>
        <div className="mt-3">
          <ProgressBar
            value={state.player.experience}
            max={state.player.experienceToNext}
            label={`${state.player.experience} / ${state.player.experienceToNext} XP`}
          />
        </div>
        <div className="mt-4 rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
          <div className="mb-3 flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-slate-500">Zone active</span> <span className="font-semibold text-slate-100">{zone.name}</span>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              {kills}/{zone.enemiesToBoss} avant boss
            </div>
          </div>
          <div className="scene-backdrop relative min-h-[520px] overflow-hidden rounded-lg border border-slate-700/70">
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/90 to-transparent" />
            <div className="absolute left-6 top-4 z-10 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase text-slate-200">Niveau {state.player.level}</div>
            <div className="absolute right-6 top-4 z-10 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase text-slate-200">Boss {bossReady ? "disponible" : "verrouille"}</div>
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_120px_1fr] items-end gap-2 p-6">
              <div>
                <div className="mb-1 text-center text-sm font-semibold text-slate-100">{state.player.name}</div>
                <CombatPortrait side="hero" name="Aventurier" />
                <ProgressBar value={state.player.currentHp} max={stats.maxHp} tone="red" label={`${Math.ceil(state.player.currentHp)} / ${stats.maxHp} PV`} />
              </div>
              <div className="mb-12 text-center">
                <div className="mb-2 text-sm font-black text-ember">VS</div>
                <button
                  className="rounded-md bg-ember px-4 py-2 text-sm font-semibold text-slate-950 shadow-ember disabled:opacity-40"
                  disabled={!bossReady}
                  onClick={() => dispatch({ type: "fightBoss" })}
                >
                  Attaquer
                </button>
              </div>
              <div>
                <div className="mb-1 text-center text-sm font-semibold text-slate-100">{enemy?.name ?? "Ennemi"}</div>
                <CombatPortrait side="enemy" name={enemy?.name ?? "Ennemi"} isBoss={enemy?.isBoss} />
                <ProgressBar value={enemy?.currentHp ?? 0} max={enemy?.maxHp ?? 1} tone="red" label={`${Math.max(0, Math.ceil(enemy?.currentHp ?? 0))} / ${enemy?.maxHp ?? 0} PV`} />
              </div>
            </div>
          </div>
          <div className="mt-2 grid gap-2 text-sm text-slate-300 sm:grid-cols-6">
            <div className="rounded-md bg-slate-900 px-2 py-1">ATQ {stats.attack}</div>
            <div className="rounded-md bg-slate-900 px-2 py-1">DEF {stats.defense}</div>
            <div className="rounded-md bg-slate-900 px-2 py-1">PV {stats.maxHp}</div>
            <div className="rounded-md bg-slate-900 px-2 py-1">ATQ ennemi {enemy?.attack ?? "-"}</div>
            <div className="rounded-md bg-slate-900 px-2 py-1">DEF ennemi {enemy?.defense ?? "-"}</div>
            <div className="rounded-md bg-slate-900 px-2 py-1">Auto {state.settings.autoContinue ? "on" : "off"}</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-md bg-ember px-4 py-2 font-semibold text-slate-950 shadow-ember disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!bossReady}
            onClick={() => dispatch({ type: "fightBoss" })}
          >
            Tenter le boss
          </button>
          <button
            className="rounded-md border border-slate-700 bg-slate-950/50 px-4 py-2 text-slate-200 hover:border-arcane/60"
            onClick={() => dispatch({ type: "toggleSetting", key: "autoContinue" })}
          >
            Auto {state.settings.autoContinue ? "actif" : "pause"}
          </button>
        </div>
      </Panel>
      <div className="grid gap-4">
        <Panel title="Rewards">
          {state.combat.lastRewards ? (
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm font-semibold">XP<br />{state.combat.lastRewards.experience}</div>
              <div className="rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm font-semibold">Or<br />{state.combat.lastRewards.gold}</div>
              <div className="rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm font-semibold">Ess.<br />{state.combat.lastRewards.essences}</div>
            </div>
          ) : <div className="text-sm text-slate-400">Aucune recompense</div>}
        </Panel>
        <Panel title="Journal">
          <div className="max-h-[500px] space-y-2 overflow-auto pr-1 text-sm">
            {state.combat.log.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-md border px-3 py-2 ${
                  entry.tone === "good"
                    ? "border-emerald-800 bg-emerald-950/30 text-emerald-100"
                    : entry.tone === "bad"
                      ? "border-red-500/60 bg-red-950 text-red-100"
                      : entry.tone === "loot"
                        ? "border-amber-400/50 bg-amber-950 text-amber-100"
                        : "border-slate-800 bg-slate-950/50 text-slate-300"
                }`}
              >
                {entry.message}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
