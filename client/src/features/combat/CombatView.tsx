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
    <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
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
        <div className="mt-5 rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
          <div className="mb-3 flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-slate-500">Zone active</span> <span className="font-semibold text-slate-100">{zone.name}</span>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              {kills}/{zone.enemiesToBoss} avant boss
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          <div className="rounded-lg border border-slate-800 bg-slate-950/55 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Aventurier</h3>
              <span className="text-sm text-slate-400">VIT {stats.attackSpeed.toFixed(1)}s</span>
            </div>
            <CombatPortrait side="hero" name="Aventurier" />
            <ProgressBar value={state.player.currentHp} max={stats.maxHp} tone="red" label={`${Math.ceil(state.player.currentHp)} / ${stats.maxHp} PV`} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-slate-300">
              <span className="rounded-md bg-slate-900 px-2 py-1">ATQ {stats.attack}</span>
              <span className="rounded-md bg-slate-900 px-2 py-1">DEF {stats.defense}</span>
              <span className="rounded-md bg-slate-900 px-2 py-1">PV {stats.maxHp}</span>
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <div className="rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-black text-ember shadow-ember">VS</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/55 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{enemy?.name ?? "Recherche..."}</h3>
              <span className={`rounded-full px-2 py-1 text-xs ${enemy?.isBoss ? "bg-ember/20 text-amber-200" : "bg-slate-800 text-slate-300"}`}>{enemy?.isBoss ? "Boss" : "Monstre"}</span>
            </div>
            <CombatPortrait side="enemy" name={enemy?.name ?? "Ennemi"} isBoss={enemy?.isBoss} />
            <ProgressBar value={enemy?.currentHp ?? 0} max={enemy?.maxHp ?? 1} tone="red" label={`${Math.max(0, Math.ceil(enemy?.currentHp ?? 0))} / ${enemy?.maxHp ?? 0} PV`} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-slate-300">
              <span className="rounded-md bg-slate-900 px-2 py-1">ATQ {enemy?.attack ?? "-"}</span>
              <span className="rounded-md bg-slate-900 px-2 py-1">DEF {enemy?.defense ?? "-"}</span>
              <span className="rounded-md bg-slate-900 px-2 py-1">PV {enemy?.maxHp ?? "-"}</span>
            </div>
          </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
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
