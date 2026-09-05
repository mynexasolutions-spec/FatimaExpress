import { Suspense } from "react";
import ShopClient from "./ShopClient";
import LoadingScreen from "@/components/ui/LoadingScreen";

export const metadata = {
  title: "Shop Balloons & Party Supplies",
  description:
    "Browse foil balloons, bubble balloons and professional balloon accessories at wholesale prices, delivered across the UAE.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading shop" />}>
      <ShopClient />
    </Suspense>
  );
}
