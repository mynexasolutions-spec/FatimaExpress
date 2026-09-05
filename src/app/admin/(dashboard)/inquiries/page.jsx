import { CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { getAllInquiries } from "@/actions/admin/inquiries";
import StatCard from "@/components/admin/StatCard";
import InquiriesList from "./InquiriesList";

export const metadata = { title: "Inquiries" };

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();
  const unresolved = inquiries.filter((i) => !i.is_resolved).length;

  const stats = [
    { label: "Total Messages", value: inquiries.length, icon: MessageSquare, accent: "from-brand-600 to-brand-800" },
    { label: "Unresolved", value: unresolved, icon: Clock, accent: "from-amber-500 to-amber-600" },
    { label: "Resolved", value: inquiries.length - unresolved, icon: CheckCircle2, accent: "from-emerald-500 to-emerald-700" },
  ];

  return (
    <div>
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Customer <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Inquiries</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">Customer messages sent through the contact form.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <InquiriesList inquiries={inquiries} />
    </div>
  );
}
