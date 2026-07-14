export function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="idle-card">
      <div className="window-title flex items-center justify-between gap-3 px-3 py-2">
        <h2 className="pixel-font text-xs font-black uppercase text-white">{title}.html</h2>
        {action}
      </div>
      <div className="p-4">
      {children}
      </div>
    </section>
  );
}
