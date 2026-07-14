export function CombatPortrait({
  side,
  isBoss,
  name
}: {
  side: "hero" | "enemy";
  isBoss?: boolean;
  name: string;
}) {
  const hero = side === "hero";

  return (
    <div className="relative flex h-full min-h-56 items-end justify-center overflow-hidden bg-transparent">
      <div
        className={`pixel-sprite relative mb-8 grid place-items-center ${
          isBoss ? "h-32 w-32" : "h-28 w-28"
        } ${hero ? "" : "scale-x-[-1]"}`}
        aria-label={name}
      >
        <div className="absolute left-1/2 top-0 h-14 w-16 -translate-x-1/2 bg-black" />
        <div className="absolute left-1/2 top-10 h-14 w-12 -translate-x-1/2 bg-black" />
        <div className="absolute left-2 top-8 h-10 w-4 bg-black" />
        <div className="absolute right-2 top-8 h-10 w-4 bg-black" />
        <div className="absolute bottom-3 left-9 h-10 w-4 bg-black" />
        <div className="absolute bottom-3 right-9 h-10 w-4 bg-black" />
        <div className={`absolute left-8 top-8 h-4 w-5 ${hero ? "bg-ember" : "bg-red-600"}`} />
        <div className={`absolute right-8 top-8 h-4 w-5 ${hero ? "bg-ember" : "bg-red-600"}`} />
        <div className="absolute -left-1 top-1 h-6 w-6 bg-black" />
        <div className="absolute -right-1 top-1 h-6 w-6 bg-black" />
        {hero ? (
          <div className="absolute -right-1 top-14 h-12 w-3 rotate-45 bg-black" />
        ) : (
          <div className={`absolute right-0 top-14 h-10 w-10 bg-black ${isBoss ? "scale-125" : ""}`} />
        )}
        </div>
    </div>
  );
}
