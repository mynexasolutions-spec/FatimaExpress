import { getHomeContent } from "@/actions/admin/homeContent";
import { getAllProductsAdmin } from "@/actions/admin/products";
import HomeContentForm from "./HomeContentForm";

export const metadata = { title: "Home Customization" };

export default async function AdminHomePage() {
  const [content, products] = await Promise.all([getHomeContent(), getAllProductsAdmin()]);

  return (
    <div>
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Home <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">Customization</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Edit every section of the homepage — hero, foil, bubble, accessories, trust badges, gallery, FAQs and newsletter — changes go live
          immediately.
        </p>
      </div>

      <HomeContentForm content={content} products={products} />
    </div>
  );
}
