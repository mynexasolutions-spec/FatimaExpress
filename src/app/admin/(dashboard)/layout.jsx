import { headers } from "next/headers";
import { AdminSidebarProvider } from "@/context/AdminSidebarContext";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

export const metadata = { title: { template: "%s — Fatima Express Admin", default: "Admin Dashboard" } };

export default async function AdminDashboardLayout({ children }) {
  const headerList = await headers();
  const encodedEmail = headerList.get("x-admin-email");
  const adminEmail = encodedEmail ? decodeURIComponent(encodedEmail) : "Admin";

  return (
    <AdminSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <AdminSidebar adminEmail={adminEmail} />
        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          <AdminHeader adminEmail={adminEmail} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
