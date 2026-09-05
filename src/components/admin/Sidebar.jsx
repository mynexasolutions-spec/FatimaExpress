"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderTree,
  Info,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  LayoutTemplate,
  Mail,
  Phone,
  Star,
  Tag,
  Truck,
  X,
  LogOut,
} from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/admin/auth";
import { getSidebarBadgeCounts } from "@/actions/admin/dashboard";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Catalog",
    items: [
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Products", href: "/admin/products", icon: Package },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Home Customization", href: "/admin/home", icon: LayoutTemplate },
      { label: "About Page", href: "/admin/about", icon: Info },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Coupons", href: "/admin/coupons", icon: Tag },
      { label: "Shipping", href: "/admin/settings/shipping", icon: Truck },
      { label: "Contact Info", href: "/admin/settings/contact", icon: Phone },
    ],
  },
];

export default function AdminSidebar({ adminEmail = "Admin" }) {
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useAdminSidebar();
  const initial = adminEmail.trim().charAt(0).toUpperCase();

  const [badges, setBadges] = useState({});
  useEffect(() => {
    let cancelled = false;
    getSidebarBadgeCounts().then((counts) => {
      if (cancelled) return;
      setBadges({
        "/admin/orders": counts.pendingOrders,
        "/admin/inquiries": counts.unresolvedInquiryCount,
        "/admin/reviews": counts.pendingReviewCount,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-white/10 bg-brand-950 transition-transform duration-300 lg:static lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none h-px w-full shrink-0 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
        <div className="relative flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4">
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="min-w-0 flex items-center gap-2">
            <span className="truncate text-sm font-bold text-white">Fatima Express</span>
            <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-brand-200">
              Admin
            </span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="shrink-0 p-1 text-white/50 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-scroll flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400/70">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
                  const badgeCount = badges[item.href];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active ? "bg-brand-600 text-white shadow-sm" : "text-brand-100 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon size={17} className={active ? "text-white" : "text-brand-300 group-hover:text-white"} />
                      <span className="flex-1">{item.label}</span>
                      {!!badgeCount && (
                        <span
                          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                            active ? "bg-white/25 text-white" : "bg-rose-500/90 text-white"
                          }`}
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{adminEmail}</p>
              <p className="truncate text-[10px] uppercase tracking-widest text-brand-300">Administrator</p>
            </div>
            <form action={adminLogout}>
              <button
                type="submit"
                title="Log out"
                className="rounded-lg p-1.5 text-brand-300 transition hover:bg-red-500/15 hover:text-red-300"
              >
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
