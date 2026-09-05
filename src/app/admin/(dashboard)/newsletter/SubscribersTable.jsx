"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export default function SubscribersTable({ subscribers }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, query]);

  return (
    <div className="overflow-x-auto rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-xs sm:p-6">
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />
      </div>

      {subscribers.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No one has subscribed yet.</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No subscribers match your search.</p>
      ) : (
        <table className="w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="pb-3 pl-1 font-medium">Email</th>
              <th className="pb-3 pr-1 text-right font-medium">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((s) => (
              <tr key={s.id} className="transition hover:bg-slate-50/60">
                <td className="py-3.5 pl-1 pr-4 text-sm font-semibold">{s.email}</td>
                <td className="py-3.5 pr-1 text-right text-sm text-slate-500">
                  {new Date(s.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
