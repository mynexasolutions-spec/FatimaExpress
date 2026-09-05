import { getAboutContent } from "@/actions/admin/aboutContent";
import AboutContentForm from "./AboutContentForm";

export const metadata = { title: "About Page" };

export default async function AdminAboutPage() {
  const content = await getAboutContent();

  return (
    <div>
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          About <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Page</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Edit every section of the About page — hero, stats, story, offers, delivery and the CTA banner — changes go live immediately.
        </p>
      </div>

      <AboutContentForm content={content} />
    </div>
  );
}
