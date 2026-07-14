export function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-white/20 bg-[#242424] px-3 py-2">
      <div className="pixel-font text-[0.65rem] font-black uppercase text-white/55">{label}</div>
      <div className="mt-0.5 text-base font-black text-white">{value}</div>
    </div>
  );
}
