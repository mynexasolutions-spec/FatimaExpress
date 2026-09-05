import { Clock, Package, ShoppingCart, Wallet } from "lucide-react";
import { getAllOrdersAdmin } from "@/actions/admin/orders";
import { formatAED } from "@/lib/format";
import StatCard from "@/components/admin/StatCard";
import OrdersTable from "./_components/OrdersTable";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersAdmin();
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, accent: "from-brand-600 to-brand-800" },
    { label: "Pending", value: pendingCount, icon: Clock, accent: "from-amber-500 to-amber-600" },
    { label: "Delivered", value: deliveredCount, icon: Package, accent: "from-emerald-500 to-emerald-700" },
    { label: "Total Revenue", value: formatAED(totalRevenue), icon: Wallet, accent: "from-brand-500 to-brand-700" },
  ];

  return (
    <div>
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Order <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Management</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {orders.length} order{orders.length === 1 ? "" : "s"} placed so far.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
