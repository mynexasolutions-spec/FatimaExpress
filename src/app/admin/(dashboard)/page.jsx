import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  FolderTree,
  LayoutTemplate,
  MessageSquare,
  Package,
  Phone,
  PlusCircle,
  Receipt,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Wallet,
} from "lucide-react";
import { getDashboardStats } from "@/actions/admin/dashboard";
import { formatAED } from "@/lib/format";

export const metadata = { title: "Dashboard" };

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-brand-50 text-brand-700 border-brand-200",
  shipped: "bg-sky-50 text-sky-700 border-sky-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const QUICK_ACTIONS = [
  { label: "Add Product", href: "/admin/products/new", icon: PlusCircle },
  { label: "View Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Home Customization", href: "/admin/home", icon: LayoutTemplate },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Contact Info", href: "/admin/settings/contact", icon: Phone },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Revenue", value: formatAED(stats.revenue), icon: Wallet, accent: "from-brand-600 to-brand-800" },
    { label: "Orders", value: stats.orderCount, icon: ShoppingCart, accent: "from-blue-500 to-blue-700" },
    { label: "Products", value: stats.productCount, icon: Package, accent: "from-indigo-500 to-indigo-700" },
    { label: "Categories", value: stats.categoryCount, icon: FolderTree, accent: "from-sky-500 to-sky-700" },
  ];

  const attention = [
    {
      label: "Orders pending",
      count: stats.pendingOrders,
      href: "/admin/orders",
      icon: Receipt,
      color: "bg-amber-50 text-amber-600 border-amber-200",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
    },
    {
      label: "Reviews to approve",
      count: stats.pendingReviewCount,
      href: "/admin/reviews",
      icon: Star,
      color: "bg-orange-50 text-orange-600 border-orange-200",
      badge: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      label: "Unresolved inquiries",
      count: stats.unresolvedInquiryCount,
      href: "/admin/inquiries",
      icon: MessageSquare,
      color: "bg-rose-50 text-rose-600 border-rose-200",
      badge: "bg-rose-100 text-rose-700 border-rose-200",
    },
  ];

  const today = new Date().toLocaleDateString("en-AE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-950 px-6 py-7 text-white shadow-glow sm:px-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-200">
              <Sparkles size={13} />
              {today}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Welcome back</h1>
            <p className="mt-1 text-sm text-brand-100/80">Here&apos;s what&apos;s happening with your store today.</p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            View Store
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="group relative flex items-center gap-3.5 overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white px-5 py-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
          >
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
        ))}
      </div>

      {/* Quick Actions + Needs Attention */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-xs">
          <h2 className="font-display text-lg font-bold text-ink">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/60"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-brand-100 bg-white text-brand-700 shadow-xs transition-transform duration-300 group-hover:scale-110">
                  <a.icon size={18} />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-brand-800">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-xs">
          <h2 className="font-display text-lg font-bold text-ink">Needs Attention</h2>
          <div className="mt-4 space-y-2.5">
            {attention.map(({ label, count, href, icon: Icon, color, badge }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${color}`}>
                    <Icon size={16} />
                  </span>
                  <span className="truncate text-sm font-semibold text-slate-700 group-hover:text-ink">{label}</span>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${badge}`}>{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <ShoppingCart size={16} />
              </span>
              <h2 className="font-display text-lg font-bold">Recent Orders</h2>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline">
              View all
              <ArrowRight size={13} />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 py-3.5 transition hover:bg-slate-50/60 -mx-2 px-2 rounded-xl">
                  <div className="min-w-0">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold hover:text-brand-700">
                      {order.reference}
                    </Link>
                    <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
                      statusStyles[order.status] ?? "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="shrink-0 font-display text-sm font-bold text-brand-800">{formatAED(order.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle size={16} />
            </span>
            <h2 className="font-display text-lg font-bold">Low Stock</h2>
          </div>

          {stats.lowStock.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">Everything is well stocked.</p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {stats.lowStock.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/70 px-3.5 py-2.5 text-sm transition hover:border-amber-300"
                >
                  <Link href={`/admin/products/${product.id}/edit`} className="truncate font-semibold hover:text-brand-700">
                    {product.name}
                  </Link>
                  <span className="shrink-0 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white">
                    {product.stock_quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
