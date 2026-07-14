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
              className={`overflow-hidden border text-left transition ${
                selected ? "border-white bg-white text-black" : "border-white/20 bg-[#202020] text-white hover:border-white/50"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              <div className="halftone h-20 border-b border-white/20" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase">{zone.name}</h3>
                  <p className={`mt-1 text-xs font-bold uppercase ${selected ? "text-black/60" : "text-white/45"}`}>{zone.description}</p>
                </div>
                <span className={`border px-2 py-1 text-xs font-black ${selected ? "border-black bg-black text-white" : "border-white/20 bg-black"}`}>Niv. {zone.recommendedLevel}</span>
              </div>
                <div className={`mt-4 h-3 overflow-hidden border ${selected ? "border-black bg-white" : "border-white/20 bg-black"}`}>
                  <div className="h-full bg-arcane" style={{ width: `${Math.min(100, (kills / zone.enemiesToBoss) * 100)}%` }} />
                </div>
              <div className={`mt-3 text-xs font-black uppercase ${selected ? "text-black" : "text-white/80"}`}>
                Progression : {Math.min(kills, zone.enemiesToBoss)}/{zone.enemiesToBoss}
              </div>
              <div className={`mt-1 text-xs font-bold uppercase ${selected ? "text-black/60" : "text-white/45"}`}>Boss : {boss?.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
