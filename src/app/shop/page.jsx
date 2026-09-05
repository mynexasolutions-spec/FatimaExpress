import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop Balloons & Party Supplies",
  description:
    "Browse foil balloons, bubble balloons and professional balloon accessories at wholesale prices, delivered across the UAE.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-page py-24 text-center text-slate-400">Loading shop…</div>}>
      <ShopClient />
    </Suspense>
  );
}
