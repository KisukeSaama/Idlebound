import { ENEMIES } from "../../../../shared/data/enemies";
import { ZONES } from "../../../../shared/data/zones";
import { useGame } from "../../store/GameContext";
import { Panel } from "../../components/Panel";

export function ZonesView() {
  const { state, dispatch } = useGame();
  return (
    <Panel title="Zones">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ZONES.map((zone) => {
          const unlocked = state.zoneProgress.unlockedZoneIds.includes(zone.id);
          const selected = state.zoneProgress.selectedZoneId === zone.id;
          const boss = ENEMIES.find((enemy) => enemy.id === zone.bossId);
          const kills = state.zoneProgress.killsByZone[zone.id] ?? 0;
          return (
            <button
              key={zone.id}
              disabled={!unlocked}
              onClick={() => dispatch({ type: "selectZone", zoneId: zone.id })}
              className={`overflow-hidden rounded-lg border text-left transition ${
                selected ? "border-arcane bg-arcane/10 shadow-glow" : "border-slate-800 bg-slate-950/45 hover:border-slate-600"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              <div className="scene-backdrop h-20 border-b border-slate-800/80" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{zone.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{zone.description}</p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-xs">Niv. {zone.recommendedLevel}</span>
              </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-gradient-to-r from-aether to-arcane" style={{ width: `${Math.min(100, (kills / zone.enemiesToBoss) * 100)}%` }} />
                </div>
              <div className="mt-3 text-sm text-slate-300">
                Progression : {Math.min(kills, zone.enemiesToBoss)}/{zone.enemiesToBoss}
              </div>
              <div className="mt-1 text-sm text-slate-400">Boss : {boss?.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
