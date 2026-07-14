export function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="idle-card rounded-lg overflow-hidden">
      <div className="window-title flex items-center justify-between gap-3 px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-100">{title}</h2>
        {action}
      </div>
      <div className="p-4">
        {children}
      </div>
    </section>
  );
}
