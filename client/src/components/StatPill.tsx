export function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-700/70 bg-slate-950/55 px-3 py-2 shadow-inner">
      <div className="text-[0.68rem] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-base font-bold text-slate-50">{value}</div>
    </div>
  );
}
