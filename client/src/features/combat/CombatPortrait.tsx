export function CombatPortrait({
  side,
  isBoss,
  name,
  imagePath
}: {
  side: "hero" | "enemy";
  isBoss?: boolean;
  name: string;
  imagePath?: string;
}) {
  const hero = side === "hero";

  return (
    <div className="relative flex h-full min-h-56 items-end justify-center overflow-hidden bg-transparent">
      <div className={`enemy-portrait-frame ${isBoss ? "enemy-portrait-boss" : ""}`} aria-label={name}>
        <div className={`absolute h-full w-full rounded-full blur-2xl ${hero ? "bg-arcane/25" : "bg-ember/25"}`} />
        {imagePath ? (
          <img className="enemy-portrait-image" src={imagePath} alt={name} draggable={false} />
        ) : (
          <div className={`relative h-20 w-14 rounded-t-full border ${hero ? "border-arcane/70 bg-sky-300/20" : "border-ember/70 bg-amber-400/20"}`}>
            <div className={`absolute left-1/2 top-3 h-7 w-7 -translate-x-1/2 rounded-full border ${hero ? "border-aether bg-slate-900" : "border-ember bg-slate-950"}`} />
            <div className={`absolute left-1/2 top-11 h-12 w-16 -translate-x-1/2 rounded-t-3xl border ${hero ? "border-arcane/70 bg-slate-800" : "border-red-500/70 bg-red-950/70"}`} />
            <div className={`absolute top-14 h-2 w-24 -translate-x-5 rounded-full ${hero ? "bg-arcane/70" : "bg-ember/70"}`} />
            <div className={`absolute -bottom-5 left-1/2 h-10 w-2 -translate-x-4 rounded-full ${hero ? "bg-slate-500" : "bg-red-800"}`} />
            <div className={`absolute -bottom-5 left-1/2 h-10 w-2 translate-x-3 rounded-full ${hero ? "bg-slate-500" : "bg-red-800"}`} />
            {hero ? (
              <div className="absolute -right-9 top-2 h-24 w-2 rotate-45 rounded-full bg-gradient-to-b from-aether to-slate-200 shadow-glow" />
            ) : (
              <div className={`absolute -right-7 top-0 h-10 w-10 rotate-45 border border-ember/80 bg-ember/20 ${isBoss ? "scale-125" : ""}`} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
