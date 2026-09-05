import { notFound } from "next/navigation";
import { getCouponById, updateCoupon } from "@/actions/admin/coupons";
import CouponForm from "../../_components/CouponForm";

export const metadata = { title: "Edit Coupon" };

export default async function EditCouponPage({ params }) {
  const { id } = await params;
  const coupon = await getCouponById(id);
  if (!coupon) notFound();

  return <CouponForm action={updateCoupon} coupon={coupon} />;
}
