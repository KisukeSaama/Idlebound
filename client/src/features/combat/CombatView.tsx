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
        <div className="mt-3 rounded-sm bg-white p-2">
          <ProgressBar
            value={state.player.experience}
            max={state.player.experienceToNext}
            label={`${state.player.experience} / ${state.player.experienceToNext} XP`}
          />
        </div>
        <div className="mt-4 border border-white/25 bg-black p-2">
          <div className="mb-2 flex flex-col gap-2 text-xs font-black uppercase text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-white/45">Acces v-0</span> <span>{zone.name}</span>
            </div>
            <div className="border border-white/25 bg-[#222] px-3 py-1">
              Vague {kills}/{zone.enemiesToBoss}
            </div>
          </div>
          <div className="halftone relative min-h-[520px] overflow-hidden border border-white">
            <div className="cave-silhouette absolute inset-x-0 top-0 h-72 opacity-60" />
            <div className="absolute left-6 top-4 z-10 text-xs font-black uppercase text-black">Niveau {state.player.level}</div>
            <div className="absolute right-6 top-4 z-10 text-xs font-black uppercase text-black">Boss {bossReady ? "disponible" : "verrouille"}</div>
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_120px_1fr] items-end gap-2 p-6">
              <div>
                <div className="mb-1 text-center text-xs font-black uppercase text-black">{state.player.name}</div>
                <CombatPortrait side="hero" name="Aventurier" />
                <ProgressBar value={state.player.currentHp} max={stats.maxHp} tone="red" label={`HP:${Math.ceil(state.player.currentHp)}/${stats.maxHp}`} />
              </div>
              <div className="mb-12 text-center">
                <div className="mb-2 text-sm font-black text-black">VS</div>
                <button
                  className="border border-black bg-black px-4 py-2 text-xs font-black uppercase text-white disabled:opacity-40"
                  disabled={!bossReady}
                  onClick={() => dispatch({ type: "fightBoss" })}
                >
                  Attaquer
                </button>
              </div>
              <div>
                <div className="mb-1 text-center text-xs font-black uppercase text-black">{enemy?.name ?? "Mob v-0"}</div>
                <CombatPortrait side="enemy" name={enemy?.name ?? "Ennemi"} isBoss={enemy?.isBoss} />
                <ProgressBar value={enemy?.currentHp ?? 0} max={enemy?.maxHp ?? 1} tone="red" label={`HP:${Math.max(0, Math.ceil(enemy?.currentHp ?? 0))}/${enemy?.maxHp ?? 0}`} />
              </div>
            </div>
          </div>
          <div className="mt-2 grid gap-2 text-xs font-black uppercase text-white sm:grid-cols-6">
            <div className="border border-white/20 bg-[#242424] p-2">ATQ {stats.attack}</div>
            <div className="border border-white/20 bg-[#242424] p-2">DEF {stats.defense}</div>
            <div className="border border-white/20 bg-[#242424] p-2">PV {stats.maxHp}</div>
            <div className="border border-white/20 bg-[#242424] p-2">Mob {enemy?.attack ?? "-"}</div>
            <div className="border border-white/20 bg-[#242424] p-2">Armor {enemy?.defense ?? "-"}</div>
            <div className="border border-white/20 bg-[#242424] p-2">Auto {state.settings.autoContinue ? "on" : "off"}</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="border border-white bg-white px-4 py-2 text-xs font-black uppercase text-black disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!bossReady}
            onClick={() => dispatch({ type: "fightBoss" })}
          >
            Tenter le boss
          </button>
          <button
            className="border border-white/25 bg-[#191919] px-4 py-2 text-xs font-black uppercase text-white hover:border-white"
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
              <div className="border border-white/20 bg-[#242424] p-3 text-xs font-black">XP<br />{state.combat.lastRewards.experience}</div>
              <div className="border border-white/20 bg-[#242424] p-3 text-xs font-black">OR<br />{state.combat.lastRewards.gold}</div>
              <div className="border border-white/20 bg-[#242424] p-3 text-xs font-black">ESS<br />{state.combat.lastRewards.essences}</div>
            </div>
          ) : <div className="text-xs font-black uppercase text-white/45">Aucune recompense</div>}
        </Panel>
        <Panel title="Journal">
          <div className="max-h-[500px] space-y-1 overflow-auto pr-1 text-xs font-bold uppercase">
            {state.combat.log.map((entry) => (
              <div
                key={entry.id}
                className={`border px-2 py-2 ${
                  entry.tone === "good"
                    ? "border-white/25 bg-white text-black"
                    : entry.tone === "bad"
                      ? "border-red-500/60 bg-red-950 text-red-100"
                      : entry.tone === "loot"
                        ? "border-amber-400/50 bg-amber-950 text-amber-100"
                        : "border-white/15 bg-[#202020] text-white/70"
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
