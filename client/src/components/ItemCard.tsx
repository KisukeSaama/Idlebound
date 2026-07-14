import type { EquipmentItem } from "../../../shared/types/game";

const rarityStyles: Record<EquipmentItem["rarity"], string> = {
  common: "border-white/20 bg-[#202020]",
  uncommon: "border-emerald-400/55 bg-[#17241c]",
  rare: "border-sky-300/60 bg-[#14202a]",
  epic: "border-amber-300/65 bg-[#2a2112]"
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
    <div className={`border p-4 ${rarityStyles[item.rarity]}`}>
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center border border-white/25 bg-black text-lg font-black text-white">
          {item.slot === "weapon" ? "W" : item.slot === "armor" ? "A" : "R"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-black uppercase text-white">{item.name}</h3>
              <p className="text-xs font-bold uppercase text-white/45">{item.rarity} · {item.slot} · niv. {item.level}</p>
            </div>
            {meta}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-black uppercase text-white">
            <span className="border border-white/15 bg-black/45 px-2 py-1">ATQ +{item.attackBonus}</span>
            <span className="border border-white/15 bg-black/45 px-2 py-1">DEF +{item.defenseBonus}</span>
            <span className="border border-white/15 bg-black/45 px-2 py-1">PV +{item.hpBonus}</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
