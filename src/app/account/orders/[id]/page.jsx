"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  LifeBuoy,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  ShieldAlert,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatAED } from "@/lib/format";
import BalloonVisual from "@/components/product/BalloonVisual";
import LoadingScreen from "@/components/ui/LoadingScreen";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  confirmed: "bg-brand-50 text-brand-700 border border-brand-200",
  shipped: "bg-sky-50 text-sky-700 border border-sky-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const paymentMeta = {
  cod: { label: "Cash on Delivery", icon: Banknote },
  transfer: { label: "Bank Transfer", icon: CreditCard },
};

const steps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: PackageCheck },
];

function CardTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
        <Icon size={16} />
      </span>
      <h2 className="font-display text-lg font-bold">{children}</h2>
    </div>
  );
}

function OrderStepper({ status }) {
  if (status === "cancelled") {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
        <XCircle size={20} className="shrink-0 text-red-600" />
        <p className="text-sm font-semibold text-red-700">This order has been cancelled.</p>
      </div>
    );
  }

  const activeIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="mt-8 flex items-start">
      {steps.map((step, idx) => {
        const done = idx <= activeIndex;
        const isLast = idx === steps.length - 1;
        const Icon = step.icon;
        return (
          <div key={step.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 ${
                  done
                    ? "border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/30"
                    : "border-slate-200 bg-white text-slate-300"
                }`}
              >
                <Icon size={16} />
              </span>
              <span className={`text-[11px] font-semibold whitespace-nowrap ${done ? "text-brand-700" : "text-slate-400"}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <span
                className={`mx-1.5 mb-5 h-0.5 flex-1 rounded-full transition-all duration-300 ${
                  idx < activeIndex ? "bg-brand-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AccountOrderDetailPage() {
  const { id } = useParams();
  const { user, loading, supabase } = useAuth();
  // undefined = not yet fetched, null = fetched but not found/not yours.
  const [order, setOrder] = useState(undefined);

  useEffect(() => {
    if (!supabase || !user || !id) return;
    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setOrder(data ?? null);
      });
  }, [supabase, user, id]);

  if (loading || (user && order === undefined)) {
    return <LoadingScreen label="Loading order" />;
  }

  if (!user || order === null) {
    return (
      <div className="container-page py-24 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50">
          <ShieldAlert size={26} className="text-brand-700" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Order not found</h1>
        <p className="mt-2 text-slate-600">We couldn&apos;t find that order on your account.</p>
        <Link href="/account" className="mt-6 inline-block rounded-full bg-brand-800 px-6 py-3 text-sm font-bold text-white hover:bg-brand-900">
          Back to My Account
        </Link>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const payment = paymentMeta[order.payment_method];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-brand-50/40 via-slate-50/60 to-slate-50/60">
      <div className="container-page py-10 lg:py-14">
        <Link href="/account" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-700">
          <ArrowLeft size={15} />
          Back to My Account
        </Link>

        {/* Hero / status card */}
        <div className="relative mt-4 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-brand-600 via-purple-500 to-brand-800" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Order Reference</p>
              <h1 className="mt-1 font-display text-2xl font-black text-slate-900 sm:text-3xl">{order.reference}</h1>
              <p className="mt-1.5 text-sm text-slate-500">Placed {new Date(order.created_at).toLocaleString()}</p>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold capitalize ${statusStyles[order.status] ?? "bg-slate-100 text-slate-600"}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {order.status}
            </span>
          </div>

          <OrderStepper status={order.status} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/60">
              <CardTitle icon={Package}>Items</CardTitle>
              <ul className="mt-4 divide-y divide-slate-100">
                {items.map((line, idx) => (
                  <li key={idx} className="flex items-center gap-3.5 rounded-xl py-3 transition-colors hover:bg-slate-50/80">
                    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-100 bg-brand-50/50 shadow-xs">
                      {line.image ? (
                        <Image src={line.image} alt={line.name} width={56} height={56} className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <BalloonVisual visual={line.visual} size={36} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{line.name}</p>
                      <p className="text-sm text-slate-500">
                        {[line.size, line.color].filter(Boolean).join(" · ")} · Qty {line.qty}
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-sm font-bold text-brand-800">{formatAED(line.price * line.qty)}</p>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="font-semibold">{formatAED(order.subtotal)}</dd>
                </div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</dt>
                    <dd className="font-semibold text-green-700">-{formatAED(order.discount_amount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-500">Delivery</dt>
                  <dd className="font-semibold">{formatAED(order.delivery_fee)}</dd>
                </div>
                <div className="flex items-center justify-between rounded-xl border-t border-slate-100 pt-3 text-base">
                  <dt className="font-bold text-slate-900">Total</dt>
                  <dd className="font-display text-xl font-black text-brand-800">{formatAED(order.total)}</dd>
                </div>
              </dl>
            </div>

            {order.notes && (
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/60">
                <CardTitle icon={FileText}>Order Notes</CardTitle>
                <p className="mt-3 text-sm text-slate-600">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/60">
              <CardTitle icon={User}>Delivery Details</CardTitle>
              <div className="mt-4 space-y-3 text-sm">
                <p className="font-semibold text-slate-900">{order.customer_name}</p>
                <p className="flex items-center gap-2.5 text-slate-600">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <Mail size={13} />
                  </span>
                  <span className="truncate">{order.email}</span>
                </p>
                <p className="flex items-center gap-2.5 text-slate-600">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <Phone size={13} />
                  </span>
                  {order.phone}
                </p>
                <p className="flex items-start gap-2.5 text-slate-600">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <MapPin size={13} />
                  </span>
                  {order.address}, {order.city}, {order.emirate}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/60">
              <CardTitle icon={payment?.icon ?? Banknote}>Payment</CardTitle>
              <p className="mt-3 text-sm font-medium text-slate-600">{payment?.label ?? order.payment_method}</p>
            </div>

            <div className="rounded-3xl border border-brand-100 bg-brand-50/50 p-6">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-brand-700 shadow-xs">
                  <LifeBuoy size={16} />
                </span>
                <h2 className="font-display text-base font-bold text-slate-900">Need help?</h2>
              </div>
              <p className="mt-2.5 text-sm text-slate-600">Questions about this order? Our team is happy to help.</p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center text-sm font-bold text-brand-700 hover:text-brand-800"
              >
                Contact support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
