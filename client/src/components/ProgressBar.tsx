export function ProgressBar({
  value,
  max,
  tone = "arcane",
  label
}: {
  value: number;
  max: number;
  tone?: "arcane" | "ember" | "red";
  label?: string;
}) {
  const percent = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  const color =
    tone === "ember"
      ? "from-amber-300 to-ember"
      : tone === "red"
        ? "from-red-400 to-rose-700"
        : "from-aether to-arcane";
  return (
    <div>
      {label ? <div className="mb-1 flex justify-between text-xs text-slate-300">{label}</div> : null}
      <div className="h-3 overflow-hidden rounded-full border border-slate-700/70 bg-slate-950/80">
        <div className={`h-full bg-gradient-to-r ${color} shadow-glow transition-all`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
