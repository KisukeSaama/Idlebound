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
  const color = tone === "ember" ? "bg-ember" : tone === "red" ? "bg-red-500" : "bg-arcane";
  return (
    <div>
      {label ? <div className="mb-1 flex justify-between text-xs text-slate-300">{label}</div> : null}
      <div className="h-3 overflow-hidden rounded-sm bg-slate-800">
        <div className={`h-full ${color} transition-all`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
