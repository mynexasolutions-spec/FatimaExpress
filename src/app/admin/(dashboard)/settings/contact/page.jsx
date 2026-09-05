import { getContactSettings } from "@/actions/admin/contact";
import ContactSettingsForm from "./ContactSettingsForm";

export const metadata = { title: "Contact Info" };

export default async function AdminContactSettingsPage() {
  const contact = await getContactSettings();

  return (
    <div>
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Contact <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Info</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          The phone number, email, address and social links used across the footer, contact page and WhatsApp buttons site-wide.
        </p>
      </div>

      <ContactSettingsForm contact={contact} />
    </div>
  );
}
