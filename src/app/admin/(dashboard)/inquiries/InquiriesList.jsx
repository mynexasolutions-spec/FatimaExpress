"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import InquiryRow from "./InquiryRow";

const TABS = [
  { key: "all", label: "All" },
  { key: "unresolved", label: "Unresolved" },
  { key: "resolved", label: "Resolved" },
];

export default function InquiriesList({ inquiries }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((i) => {
      if (tab === "unresolved" && i.is_resolved) return false;
      if (tab === "resolved" && !i.is_resolved) return false;
      if (!q) return true;
      const haystack = `${i.name ?? ""} ${i.email ?? ""} ${i.subject ?? ""} ${i.message ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [inquiries, tab, query]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                tab === t.key
                  ? "bg-brand-700 text-white shadow-md"
                  : "border border-slate-200 text-slate-500 hover:border-brand-200 hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center text-sm text-slate-400 shadow-sm">
            {query || tab !== "all" ? "No messages match your filters." : "No messages yet."}
          </div>
        ) : (
          filtered.map((inquiry) => <InquiryRow key={inquiry.id} inquiry={inquiry} />)
        )}
      </div>
    </div>
  );
}
