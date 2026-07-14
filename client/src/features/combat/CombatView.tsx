import { calculatePower, calculateStats } from "../../../../shared/game/formulas";
import { getSelectedZone } from "../../store/gameEngine";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";
import { ProgressBar } from "../../components/ProgressBar";
import { StatPill } from "../../components/StatPill";
import { CombatPortrait } from "./CombatPortrait";
import { autoAttackDamage, autoAttackInterval, clickerUpgradeCost, manualClickDamage, normalizeClicker } from "../../../../shared/game/clicker";

export function CombatView() {
  const { state, dispatch } = useGame();
  const stats = calculateStats(state.player, state.equipment, state.essenceUpgrades);
  const power = calculatePower(stats, state.player.level);
  const zone = getSelectedZone(state);
  const kills = state.zoneProgress.killsByZone[zone.id] ?? 0;
  const bossReady = state.zoneProgress.bossReady[zone.id];
  const enemy = state.combat.enemy;
  const clicker = normalizeClicker(state.clicker);
  const enemyHpPercent = enemy ? Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100)) : 0;
  const manualDamage = manualClickDamage(stats, clicker);
  const autoDamage = autoAttackDamage(stats, clicker);
  const autoInterval = autoAttackInterval(clicker);
  const lastRewards = state.combat.lastRewards;
  const upgrades = [
    { key: "manualPowerLevel" as const, label: "Force du clic", value: `+ degats clic`, level: clicker.manualPowerLevel },
    { key: "autoDamageLevel" as const, label: "Lame spectrale", value: autoDamage > 0 ? `${autoDamage} degats auto` : "debloque auto", level: clicker.autoDamageLevel },
    { key: "autoSpeedLevel" as const, label: "Rythme spectral", value: Number.isFinite(autoInterval) ? `1 frappe / ${autoInterval.toFixed(2)}s` : "requiert auto", level: clicker.autoSpeedLevel },
    { key: "critLevel" as const, label: "Frappe critique", value: "+ chance critique", level: clicker.critLevel }
  ];

  return (
    <div className="combat-layout">
      <Panel title="Combat automatique">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <StatPill label="Niveau" value={state.player.level} />
          <StatPill label="Puissance" value={power} />
          <StatPill label="Or" value={state.player.gold} />
          <StatPill label="Essences" value={state.player.essences} />
        </div>
        <div className="mt-2">
          <ProgressBar
            value={state.player.experience}
            max={state.player.experienceToNext}
            label={`${state.player.experience} / ${state.player.experienceToNext} XP`}
          />
        </div>
        <div className="combat-scene-shell mt-3 rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
          <div className="mb-2 flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-slate-500">Zone active</span> <span className="font-semibold text-slate-100">{zone.name}</span>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              {kills}/{zone.enemiesToBoss} avant boss
            </div>
          </div>
          <div className="combat-scene scene-backdrop relative overflow-hidden rounded-lg border border-slate-700/70">
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/90 to-transparent" />
            <div className="absolute left-6 top-4 z-10 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase text-slate-200">Niveau {state.player.level}</div>
            <div className="absolute right-6 top-4 z-10 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase text-slate-200">Boss {bossReady ? "disponible" : "verrouille"}</div>
            {lastRewards ? (
              <div className="absolute right-6 top-28 z-20 w-72 rounded-lg border border-amber-400/40 bg-slate-950/88 p-3 shadow-ember backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-200">Recompenses</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-200">
                  <span className="rounded-full bg-slate-900 px-2 py-1">+{lastRewards.experience} XP</span>
                  <span className="rounded-full bg-slate-900 px-2 py-1">+{lastRewards.gold} or</span>
                  {lastRewards.essences > 0 ? <span className="rounded-full bg-sky-950/80 px-2 py-1 text-sky-200">+{lastRewards.essences} essence(s)</span> : null}
                </div>
                {lastRewards.items.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {lastRewards.items.map((item) => (
                      <div key={item.instanceId ?? item.id} className="rounded-md border border-amber-400/30 bg-amber-950/30 px-2 py-1 text-xs font-semibold text-amber-100">
                        Objet obtenu : {item.name}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="absolute inset-x-0 top-16 z-10 mx-auto max-w-2xl px-6">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-100">
                <span>{enemy?.name ?? "Recherche d'un ennemi..."}</span>
                <span>{Math.max(0, Math.ceil(enemy?.currentHp ?? 0))} / {enemy?.maxHp ?? 0} PV</span>
              </div>
              <div className="h-6 overflow-hidden rounded-full border border-red-300/30 bg-slate-950/80 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-red-700 via-red-500 to-amber-300 transition-all"
                  style={{ width: `${enemyHpPercent}%` }}
                />
              </div>
            </div>
            <button
              className="absolute inset-x-0 bottom-3 mx-auto flex max-w-xl cursor-pointer flex-col items-center rounded-xl border border-transparent p-4 transition hover:border-arcane/30 hover:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-arcane"
              onClick={() => dispatch({ type: "manualAttack" })}
              aria-label="Frapper l'ennemi"
            >
              <div className="mb-2 text-center text-sm font-semibold text-slate-200">Cliquez sur l'ennemi pour frapper</div>
              <CombatPortrait side="enemy" name={enemy?.name ?? "Ennemi"} isBoss={enemy?.isBoss} />
              <div className="mt-2 rounded-full border border-arcane/30 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-arcane">
                Degats par clic : {manualDamage}
              </div>
            </button>
          </div>
          <div className="mt-2 grid gap-2 text-sm text-slate-300 sm:grid-cols-4">
            <div className="rounded-md bg-slate-900 px-2 py-1">Clic {manualDamage}</div>
            <div className="rounded-md bg-slate-900 px-2 py-1">Auto {autoDamage > 0 ? autoDamage : "inactif"}</div>
            <div className="rounded-md bg-slate-900 px-2 py-1">Rythme {Number.isFinite(autoInterval) ? `${autoInterval.toFixed(2)}s` : "-"}</div>
            <div className="rounded-md bg-slate-900 px-2 py-1">Crit {Math.round(clicker.critLevel * 2.5)}%</div>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
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
        <Panel title="Ameliorations d'attaque">
          <div className="grid gap-2">
            {upgrades.map((upgrade) => {
              const cost = clickerUpgradeCost(upgrade.key, upgrade.level);
              return (
                <button
                  key={upgrade.key}
                  className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-left hover:border-arcane/50 disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={state.player.gold < cost}
                  onClick={() => dispatch({ type: "buyClickerUpgrade", upgrade: upgrade.key })}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-100">{upgrade.label}</span>
                    <span className="text-sm text-amber-200">{cost} or</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-400">Niveau {upgrade.level} · {upgrade.value}</div>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
