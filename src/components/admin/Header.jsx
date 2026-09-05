"use client";

import Link from "next/link";
import { ExternalLink, Menu } from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";

export default function AdminHeader({ adminEmail }) {
  const { setMobileOpen } = useAdminSidebar();
  const initial = (adminEmail || "A").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur md:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/50 to-transparent" />
      <button onClick={() => setMobileOpen(true)} className="p-1.5 text-slate-500 hover:text-brand-700 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-slate-500">
          Signed in as <span className="font-semibold text-ink">{adminEmail}</span>
        </p>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
        >
          View Store
          <ExternalLink size={13} />
        </Link>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-700 text-xs font-bold text-white shadow-sm ring-1 ring-black/5">
          {initial}
        </div>
      </div>
    </header>
  );
}
