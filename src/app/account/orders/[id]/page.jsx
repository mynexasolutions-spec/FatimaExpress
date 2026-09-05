"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Banknote, CreditCard, FileText, LoaderCircle, Mail, MapPin, Package, Phone, ShieldAlert, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatAED } from "@/lib/format";
import BalloonVisual from "@/components/product/BalloonVisual";

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
    return (
      <div className="container-page grid place-items-center py-24">
        <LoaderCircle size={26} className="animate-spin text-brand-600" />
      </div>
    );
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
    <div className="bg-slate-50/60 min-h-[calc(100vh-4rem)]">
      <div className="container-page py-10 lg:py-14">
        <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-700">
          <ArrowLeft size={15} />
          Back to My Account
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{order.reference}</h1>
            <p className="mt-1 text-sm text-slate-500">Placed {new Date(order.created_at).toLocaleString()}</p>
          </div>
          <span className={`rounded-full px-3.5 py-1.5 text-sm font-bold capitalize ${statusStyles[order.status] ?? "bg-slate-100 text-slate-600"}`}>
            {order.status}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <CardTitle icon={Package}>Items</CardTitle>
              <ul className="mt-4 divide-y divide-slate-100">
                {items.map((line, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-brand-50/50">
                      {line.image ? (
                        <Image src={line.image} alt={line.name} width={48} height={48} className="h-full w-full object-contain p-1" />
                      ) : (
                        <BalloonVisual visual={line.visual} size={34} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{line.name}</p>
                      <p className="text-sm text-slate-500">
                        {[line.size, line.color].filter(Boolean).join(" · ")} · Qty {line.qty}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-brand-800">{formatAED(line.price * line.qty)}</p>
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
                <div className="flex justify-between border-t border-slate-100 pt-2 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-display text-lg font-bold text-brand-800">{formatAED(order.total)}</dd>
                </div>
              </dl>
            </div>

            {order.notes && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <CardTitle icon={FileText}>Order Notes</CardTitle>
                <p className="mt-3 text-sm text-slate-600">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <CardTitle icon={User}>Delivery Details</CardTitle>
              <div className="mt-4 space-y-3 text-sm">
                <p className="font-semibold">{order.customer_name}</p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Mail size={15} className="text-brand-500" />
                  {order.email}
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Phone size={15} className="text-brand-500" />
                  {order.phone}
                </p>
                <p className="flex items-start gap-2 text-slate-600">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-brand-500" />
                  {order.address}, {order.city}, {order.emirate}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <CardTitle icon={payment?.icon ?? Banknote}>Payment</CardTitle>
              <p className="mt-3 text-sm text-slate-600">{payment?.label ?? order.payment_method}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
