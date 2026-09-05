const DEFAULT_ACCENT = "from-brand-600 to-brand-800";

export default function StatCard({ label, value, icon: Icon, accent = DEFAULT_ACCENT }) {
  return (
    <div className="group relative flex items-center gap-3.5 overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white px-5 py-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-100/40 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <span
        className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 ${accent}`}
      >
        <Icon size={19} />
      </span>
      <div className="relative min-w-0">
        <p className="font-display text-2xl font-extrabold leading-none text-ink">{value}</p>
        <p className="mt-1.5 truncate text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      </div>
    </div>
  );
}
