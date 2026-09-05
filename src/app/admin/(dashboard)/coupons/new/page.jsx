import { createCoupon } from "@/actions/admin/coupons";
import CouponForm from "../_components/CouponForm";

export const metadata = { title: "New Coupon" };

export default function NewCouponPage() {
  return <CouponForm action={createCoupon} />;
}
