export function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="idle-card rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold uppercase tracking-wide text-slate-200">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
