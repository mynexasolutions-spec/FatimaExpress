import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Banknote, CreditCard, FileText, Mail, MapPin, Package, Phone, User } from "lucide-react";
import { getOrderById } from "@/actions/admin/orders";
import { formatAED } from "@/lib/format";
import BalloonVisual from "@/components/product/BalloonVisual";
import OrderStatusControl from "./OrderStatusControl";

export const metadata = { title: "Order Detail" };

const paymentMeta = {
  cod: { label: "Cash on Delivery", icon: Banknote },
  transfer: { label: "Bank Transfer", icon: CreditCard },
};

const panelClass = "rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-xs md:p-7";

function CardTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700 shadow-xs">
        <Icon size={17} />
      </span>
      <h2 className="font-display text-lg font-bold text-ink">{children}</h2>
    </div>
  );
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const items = Array.isArray(order.items) ? order.items : [];
  const payment = paymentMeta[order.payment_method];

  return (
    <div>
      <Link href="/admin/orders" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-700">
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
            Order{" "}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">
              {order.reference}
            </span>
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">Placed {new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="min-w-0 space-y-6">
          <div className={panelClass}>
            <CardTitle icon={Package}>Items</CardTitle>
            <ul className="mt-4 divide-y divide-slate-100">
              {items.map((line, idx) => (
                <li key={idx} className="flex items-center gap-3.5 py-3.5">
                  <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-brand-50/40 shadow-inner">
                    {line.image ? (
                      <Image src={line.image} alt={line.name} width={56} height={56} className="h-full w-full object-contain p-1" />
                    ) : (
                      <BalloonVisual visual={line.visual} size={38} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{line.name}</p>
                    <p className="text-xs font-medium text-slate-500">
                      {[line.size, line.color].filter(Boolean).join(" · ")} · Qty {line.qty}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-extrabold text-brand-800">{formatAED(line.price * line.qty)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-slate-500">Subtotal</dt>
                <dd className="font-bold text-ink">{formatAED(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-slate-500">Delivery</dt>
                <dd className="font-bold text-ink">{formatAED(order.delivery_fee)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 font-display text-base">
                <dt className="font-extrabold text-ink">Total</dt>
                <dd className="font-extrabold text-brand-800">{formatAED(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className={panelClass}>
            <CardTitle icon={MapPin}>Customer &amp; Shipping</CardTitle>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer</p>
                <p className="mt-1.5 flex items-center gap-2 text-sm font-bold text-ink">
                  <User size={14} className="text-brand-500" />
                  {order.customer_name}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Mail size={14} className="text-brand-500" />
                  {order.email}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Phone size={14} className="text-brand-500" />
                  {order.phone}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Shipping Address</p>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-600">
                  {order.address}, {order.city}, {order.emirate}
                </p>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className={panelClass}>
              <CardTitle icon={FileText}>Order Notes</CardTitle>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className={`${panelClass} h-fit min-w-0`}>
          <CardTitle icon={CreditCard}>Manage Status</CardTitle>
          <div className="mt-5">
            <OrderStatusControl orderId={order.id} currentStatus={order.status} />
          </div>
          <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-medium text-slate-600">
            Payment method:{" "}
            <span className="font-bold text-ink">{payment?.label ?? order.payment_method}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
