import { Repeat, Users, Wallet } from "lucide-react";
import { getAllCustomers } from "@/actions/admin/customers";
import { formatAED } from "@/lib/format";
import StatCard from "@/components/admin/StatCard";
import CustomersTable from "./_components/CustomersTable";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();
  const totalSpent = customers.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0);
  const repeatCount = customers.filter((c) => c.orderCount > 1).length;

  const stats = [
    { label: "Total Customers", value: customers.length, icon: Users, accent: "from-brand-600 to-brand-800" },
    { label: "Repeat Buyers", value: repeatCount, icon: Repeat, accent: "from-emerald-500 to-emerald-700" },
    { label: "Total Spend", value: formatAED(totalSpent), icon: Wallet, accent: "from-brand-500 to-brand-700" },
  ];

  return (
    <div>
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Customer <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Directory</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">{customers.length} registered accounts.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
