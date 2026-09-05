import { CalendarClock, Mail } from "lucide-react";
import { getAllSubscribers } from "@/actions/admin/inquiries";
import StatCard from "@/components/admin/StatCard";
import CopyEmailsButton from "./CopyEmailsButton";
import SubscribersTable from "./SubscribersTable";

export const metadata = { title: "Newsletter Subscribers" };

export default async function AdminNewsletterPage() {
  const subscribers = await getAllSubscribers();
  // eslint-disable-next-line react-hooks/purity -- server component: comparing against wall-clock time to count recent signups
  const thirtyDaysAgo = Date.now() - 30 * 86400000;
  const recentCount = subscribers.filter((s) => new Date(s.created_at).getTime() >= thirtyDaysAgo).length;

  const stats = [
    { label: "Total Subscribers", value: subscribers.length, icon: Mail, accent: "from-brand-600 to-brand-800" },
    { label: "New in Last 30 Days", value: recentCount, icon: CalendarClock, accent: "from-emerald-500 to-emerald-700" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Newsletter <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Subscribers</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Everyone who signed up on the homepage &quot;Special Offers &amp; Party Ideas&quot; form.
          </p>
        </div>
        {subscribers.length > 0 && <CopyEmailsButton emails={subscribers.map((s) => s.email)} />}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 sm:max-w-md">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <SubscribersTable subscribers={subscribers} />
    </div>
  );
}
