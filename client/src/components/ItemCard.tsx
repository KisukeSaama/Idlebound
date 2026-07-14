import type { EquipmentItem } from "../../../shared/types/game";

const rarityStyles: Record<EquipmentItem["rarity"], string> = {
  common: "border-slate-700/80 bg-slate-950/55",
  uncommon: "border-emerald-500/40 bg-emerald-950/15",
  rare: "border-sky-400/45 bg-sky-950/18",
  epic: "border-amber-400/50 bg-amber-950/18"
};

export function ItemCard({
  item,
  children,
  meta
}: {
  item: EquipmentItem;
  children?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border p-4 ${rarityStyles[item.rarity]}`}>
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-slate-700 bg-slate-950/70 text-lg font-black text-arcane">
          {item.slot === "weapon" ? "W" : item.slot === "armor" ? "A" : "R"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-50">{item.name}</h3>
              <p className="text-sm text-slate-400">{item.rarity} · {item.slot} · niv. {item.level}</p>
            </div>
            {meta}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-slate-300">
            <span className="rounded-md bg-slate-950/60 px-2 py-1">ATQ +{item.attackBonus}</span>
            <span className="rounded-md bg-slate-950/60 px-2 py-1">DEF +{item.defenseBonus}</span>
            <span className="rounded-md bg-slate-950/60 px-2 py-1">PV +{item.hpBonus}</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
