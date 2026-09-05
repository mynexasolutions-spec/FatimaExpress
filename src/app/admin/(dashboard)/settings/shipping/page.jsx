import { getShippingSettings } from "@/actions/admin/shipping";
import ShippingForm from "./ShippingForm";

export const metadata = { title: "Shipping Settings" };

export default async function AdminShippingSettingsPage() {
  const shipping = await getShippingSettings();

  return (
    <div>
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Shipping <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">Controls the delivery fee shown at checkout across the UAE.</p>
      </div>

      <ShippingForm shipping={shipping} />
    </div>
  );
}
