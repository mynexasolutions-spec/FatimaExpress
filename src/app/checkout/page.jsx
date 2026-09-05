"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Lock,
  LoaderCircle,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  User,
  X,
} from "lucide-react";
import BalloonVisual from "@/components/product/BalloonVisual";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatAED } from "@/lib/format";
import { getDeliveryQuote } from "@/lib/shipping";
import { getShippingSettingsPublic, validateCoupon } from "@/lib/settings";
import { getContactPublic } from "@/lib/siteSettings";
import { emirates, whatsappLink } from "@/data/site";

const paymentMethods = [
  { value: "cod", label: "Cash on Delivery", icon: Banknote, note: "Pay cash or card to driver on arrival." },
  { value: "transfer", label: "Direct Bank Transfer", icon: CreditCard, note: "Bank details provided post confirmation." },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, updateQty, removeItem } = useCart();
  const { supabase, user } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    emirate: "",
    city: "",
    address: "",
    notes: "",
    payment: "cod",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [shippingSettings, setShippingSettings] = useState(null);
  const [contact, setContact] = useState(null);

  const [couponInput, setCouponInput] = useState("");
  const [couponState, setCouponState] = useState({ loading: false, error: "", applied: null });

  useEffect(() => {
    getShippingSettingsPublic().then(setShippingSettings);
    getContactPublic().then(setContact);
  }, []);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const updatePhone = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 9);
    setForm((current) => ({ ...current, phone: digitsOnly }));
  };

  const phoneValid = /^5\d{8}$/.test(form.phone);
  const phoneTouched = form.phone.length > 0;

  const delivery = useMemo(
    () => getDeliveryQuote(subtotal, form.emirate, shippingSettings || {}),
    [subtotal, form.emirate, shippingSettings],
  );
  const discount = couponState.applied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount) + (delivery.fee ?? 0);

  const applyCoupon = async () => {
    setCouponState({ loading: true, error: "", applied: null });
    const result = await validateCoupon(couponInput, subtotal);
    if (result.error) {
      setCouponState({ loading: false, error: result.error, applied: null });
      return;
    }
    setCouponState({ loading: false, error: "", applied: result });
  };

  const removeCoupon = () => {
    setCouponInput("");
    setCouponState({ loading: false, error: "", applied: null });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!phoneValid) {
      setError("Please enter a valid UAE mobile number — 9 digits starting with 5 (e.g. 50 123 4567).");
      return;
    }

    setStatus("loading");

    const reference = `FE-${Date.now().toString().slice(-8)}`;
    const email = user?.email || form.email;

    if (supabase) {
      const { error: orderError } = await supabase.from("orders").insert({
        reference,
        user_id: user?.id ?? null,
        customer_name: form.fullName,
        email,
        phone: form.phone,
        emirate: form.emirate,
        city: form.city,
        address: form.address,
        notes: form.notes,
        payment_method: form.payment,
        subtotal,
        delivery_fee: delivery.fee ?? 0,
        coupon_code: couponState.applied?.coupon?.code ?? null,
        discount_amount: discount,
        total,
        items,
        status: "pending",
      });

      if (orderError) {
        setStatus("idle");
        setError(`We could not place the order: ${orderError.message}. You can also send it to us on WhatsApp.`);
        return;
      }
    }

    setOrderRef(reference);
    setStatus("done");
    clearCart();
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm sm:text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-[#7E22CE] focus:bg-white focus:ring-4 focus:ring-purple-100/80 shadow-2xs font-sans";

  if (status === "done") {
    return (
      <div className="relative overflow-hidden py-16 sm:py-24 min-h-screen bg-[#FAF9FC] flex items-center font-sans">
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="container-page relative z-10 font-sans">
          <div className="mx-auto max-w-lg rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xl shadow-purple-950/5 sm:p-10 font-sans">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
              <CheckCircle2 size={40} />
            </span>

            <h1 className="mt-6 font-display text-2xl sm:text-3xl font-black text-slate-900">
              Order Placed Successfully! 🎉
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-medium">
              Thank you for your order! Your reference number is{" "}
              <span className="inline-block rounded-full bg-purple-50 border border-purple-200 px-3.5 py-0.5 font-extrabold text-[#7E22CE] font-sans">
                {orderRef}
              </span>
              . Our dispatch team will process your order shortly.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 font-sans">
              <Link
                href="/account"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-purple-200 transition-all font-sans active:scale-95"
              >
                View Order Status
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-800 transition hover:bg-slate-50 font-sans active:scale-95"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative overflow-hidden min-h-[80vh] bg-[#FAF9FC] flex items-center font-sans">
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="container-page relative z-10">
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 text-center shadow-xl shadow-purple-950/5">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-purple-50 text-[#7E22CE] border border-purple-100 shadow-xs">
              <Package size={36} />
            </span>
            <h1 className="mt-6 font-display text-2xl sm:text-3xl font-bold text-slate-900">Your cart is empty</h1>
            <p className="mt-2 text-sm text-slate-500 font-sans">Add some balloons &amp; party supplies before heading to checkout.</p>
            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2.5 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-purple-200 transition-all font-sans active:scale-98"
            >
              Browse Supplies
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#FAF9FC] min-h-screen text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-[#2A0E4E] py-12 lg:py-16 text-white font-sans">
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="container-page relative z-10 max-w-6xl font-sans">
          <Link href="/shop" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-200 hover:text-white transition uppercase tracking-wider font-sans">
            <ArrowLeft size={16} />
            Back to Shop
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 font-sans">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Express Wholesale Checkout
              </h1>
              <p className="mt-2 text-sm sm:text-base text-purple-200/90 font-medium font-sans">
                Fast delivery across all 7 UAE Emirates · Instant Dubai dispatch
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-sans">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-bold text-purple-100 backdrop-blur-md font-sans">
                <Lock size={15} className="text-purple-300" />
                256-Bit Encrypted
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-bold text-purple-100 backdrop-blur-md font-sans">
                <Truck size={15} className="text-purple-300" />
                UAE Express Shipping
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page max-w-6xl py-10 lg:py-12 font-sans">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-start font-sans">
          {/* Left Column: Form Sections */}
          <form onSubmit={submit} className="space-y-6 font-sans">
            {/* Contact Info */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs font-sans">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 font-sans">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#7E22CE]/10 text-[#7E22CE] text-base font-extrabold font-sans">
                  1
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Contact Details</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium font-sans">We will send your order receipt and tracking updates here.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 font-sans">
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 font-sans">Full Name *</label>
                  <div className="relative font-sans">
                    <User size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required value={form.fullName} onChange={update("fullName")} className={inputClass} placeholder="e.g. Fatima Ahmed" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 font-sans">Phone / WhatsApp *</label>
                  <div className="relative font-sans">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 font-sans">+971</span>
                    <input
                      required
                      type="tel"
                      inputMode="numeric"
                      maxLength={9}
                      pattern="5[0-9]{8}"
                      value={form.phone}
                      onChange={updatePhone}
                      className={`${inputClass} pl-16 ${phoneTouched && !phoneValid ? "border-red-300 focus:border-red-500 focus:ring-red-100" : ""}`}
                      placeholder="50 123 4567"
                    />
                  </div>
                  {phoneTouched && !phoneValid ? (
                    <p className="mt-1.5 text-xs font-semibold text-red-600">
                      Enter a valid UAE mobile number — 9 digits starting with 5.
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">e.g. 501234567 (no country code or spaces needed)</p>
                  )}
                </div>
                <div className="sm:col-span-2 font-sans">
                  <label className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 font-sans">Email Address *</label>
                  <div className="relative font-sans">
                    <input
                      required
                      type="email"
                      value={user ? user.email : form.email}
                      onChange={user ? undefined : update("email")}
                      readOnly={Boolean(user)}
                      className={`${inputClass} pl-4 ${user ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}`}
                      placeholder="name@company.com"
                    />
                  </div>
                  {user && <p className="mt-1.5 text-xs text-slate-400">Signed in as {user.email}</p>}
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs font-sans">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 font-sans">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#7E22CE]/10 text-[#7E22CE] text-base font-extrabold font-sans">
                  2
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Delivery Address</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium font-sans">Fast delivery to all 7 Emirates in the UAE.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 font-sans">
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 font-sans">Select Emirate *</label>
                  <div className="relative font-sans">
                    <select required value={form.emirate} onChange={update("emirate")} className={`${inputClass} pl-4 appearance-none pr-9 cursor-pointer font-sans`}>
                      <option value="">Choose Emirate</option>
                      {emirates.map((emirate) => (
                        <option key={emirate.value} value={emirate.value}>
                          {emirate.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 font-sans">Area / District *</label>
                  <input required value={form.city} onChange={update("city")} className={`${inputClass} pl-4`} placeholder="e.g. Downtown / Deira / Business Bay" />
                </div>
                <div className="sm:col-span-2 font-sans">
                  <label className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 font-sans">Street Address &amp; Villa/Building *</label>
                  <textarea required rows={3} value={form.address} onChange={update("address")} className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 text-sm sm:text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-[#7E22CE] focus:bg-white focus:ring-4 focus:ring-purple-100/80 shadow-2xs font-sans" placeholder="Building name, street number, apartment/villa number, landmark" />
                </div>
                <div className="sm:col-span-2 font-sans">
                  <label className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 font-sans">Event Date &amp; Notes (Optional)</label>
                  <textarea rows={2} value={form.notes} onChange={update("notes")} className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 text-sm sm:text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-[#7E22CE] focus:bg-white focus:ring-4 focus:ring-purple-100/80 shadow-2xs font-sans" placeholder="Specific delivery instructions, gate code, or preferred timing…" />
                </div>
              </div>

              {form.emirate && (
                <div className="mt-5 flex items-start gap-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 p-4.5 text-sm font-sans">
                  <Truck size={22} className="mt-0.5 shrink-0 text-[#7E22CE]" />
                  <div>
                    <span className="font-bold text-purple-900 text-sm sm:text-base font-sans">{delivery.label}</span>
                    <p className="text-purple-700/90 text-xs sm:text-sm mt-0.5 font-sans">{delivery.note}</p>
                  </div>
                </div>
              )}
            </section>

            {/* Payment Options */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs font-sans">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 font-sans">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#7E22CE]/10 text-[#7E22CE] text-base font-extrabold font-sans">
                  3
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Payment Option</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium font-sans">Select your preferred payment method.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 font-sans">
                {paymentMethods.map(({ value, label, icon: Icon, note }) => (
                  <label
                    key={value}
                    className={`relative flex cursor-pointer items-start gap-3.5 rounded-2xl border-2 p-5 transition-all font-sans ${
                      form.payment === value
                        ? "border-[#7E22CE] bg-purple-50/60 shadow-md ring-2 ring-purple-100"
                        : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={form.payment === value}
                      onChange={update("payment")}
                      className="sr-only"
                    />
                    {form.payment === value && (
                      <span className="absolute right-3.5 top-3.5 grid h-6 w-6 place-items-center rounded-full bg-[#7E22CE] text-white shadow-xs">
                        <CheckCircle2 size={15} />
                      </span>
                    )}
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#7E22CE] border border-slate-200 shadow-2xs">
                      <Icon size={22} />
                    </span>
                    <div>
                      <span className="block text-base font-bold text-slate-900 font-sans">{label}</span>
                      <span className="mt-1 block text-xs sm:text-sm text-slate-500 font-medium font-sans">{note}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {error && <p className="rounded-2xl bg-red-50 border border-red-200 p-4.5 text-sm font-semibold text-red-700 font-sans">{error}</p>}

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#7E22CE] hover:bg-[#6B21A8] py-4 sm:py-4.5 text-base sm:text-lg font-extrabold text-white shadow-xl shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 font-sans"
            >
              {status === "loading" ? (
                <LoaderCircle size={22} className="animate-spin" />
              ) : (
                <Lock size={20} />
              )}
              Place Order — {formatAED(total)}
            </button>

            <p className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 font-sans">
              <ShieldCheck size={18} className="text-emerald-600" />
              100% Confidential &amp; Encrypted Wholesale Checkout
            </p>
          </form>

          {/* Right Column: Order Summary Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:h-fit font-sans">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-purple-950/5 font-sans">
              <div className="flex items-center gap-2.5 bg-slate-950 px-6 py-4.5 text-white font-sans">
                <Sparkles size={18} className="text-purple-300" />
                <h2 className="font-display text-lg font-bold text-white">Order Summary</h2>
                <span className="ml-auto rounded-full bg-white/15 border border-white/20 px-3.5 py-0.5 text-xs sm:text-sm font-extrabold text-white backdrop-blur-md font-sans">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="p-6 font-sans">
                <ul className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto pr-1 font-sans">
                  {items.map((line) => (
                    <li key={line.key} className="flex gap-4 py-4 first:pt-0 font-sans">
                      <div className="grid h-18 w-18 shrink-0 place-items-center overflow-hidden rounded-2xl bg-purple-50/50 border border-slate-100">
                        {line.image ? (
                          <Image
                            src={line.image}
                            alt={line.name}
                            width={72}
                            height={72}
                            className="h-full w-full object-cover p-1"
                          />
                        ) : (
                          <BalloonVisual visual={line.visual} size={54} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 font-sans">
                        <p className="line-clamp-1 text-sm font-bold text-slate-900 font-sans">{line.name}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5 font-sans">{[line.size, line.color].filter(Boolean).join(" · ")}</p>
                        <div className="mt-2.5 flex items-center gap-2.5">
                          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                            <button
                              type="button"
                              onClick={() => updateQty(line.key, line.qty - 1)}
                              className="flex h-7 w-7 items-center justify-center text-slate-500 transition hover:text-[#7E22CE]"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs sm:text-sm font-bold text-slate-900">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(line.key, line.qty + 1)}
                              className="flex h-7 w-7 items-center justify-center text-slate-500 transition hover:text-[#7E22CE]"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(line.key)}
                            className="text-xs font-bold text-slate-400 transition hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="font-display text-base font-extrabold text-[#7E22CE] font-sans">{formatAED(line.price * line.qty)}</p>
                    </li>
                  ))}
                </ul>

                {/* Coupon Code Section */}
                <div className="mt-5 border-t border-slate-100 pt-4 font-sans">
                  {couponState.applied ? (
                    <div className="flex items-center justify-between rounded-2xl bg-purple-50 border border-purple-200 px-4 py-3 font-sans">
                      <span className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#7E22CE] font-sans">
                        <Tag size={16} />
                        {couponState.applied.coupon.code}
                      </span>
                      <button type="button" onClick={removeCoupon} className="text-slate-400 hover:text-red-600 transition">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 font-sans">
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promo or Coupon Code"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm font-semibold outline-none transition focus:border-[#7E22CE] focus:bg-white font-sans"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponState.loading || !couponInput.trim()}
                        className="shrink-0 rounded-xl bg-slate-900 px-5 py-3 text-xs sm:text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-60 font-sans"
                      >
                        {couponState.loading ? <LoaderCircle size={16} className="animate-spin" /> : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponState.error && <p className="mt-2 text-xs font-semibold text-red-600 font-sans">{couponState.error}</p>}
                </div>

                {/* Pricing Summary Breakdown */}
                <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm font-sans">
                  <div className="flex justify-between font-sans">
                    <dt className="text-slate-600 font-medium font-sans">Items Subtotal</dt>
                    <dd className="font-bold text-slate-900 font-sans">{formatAED(subtotal)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-sans">
                      <dt className="text-slate-600 font-medium font-sans">Discount</dt>
                      <dd className="font-bold text-emerald-600 font-sans">−{formatAED(discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between font-sans">
                    <dt className="text-slate-600 font-medium font-sans">Delivery Fee</dt>
                    <dd className="font-bold text-slate-900 font-sans">
                      {delivery.fee === null ? (
                        <span className="text-xs text-slate-400 font-normal font-sans">Select Emirate above</span>
                      ) : delivery.fee === 0 ? (
                        <span className="text-emerald-700 font-bold font-sans">Free Delivery</span>
                      ) : (
                        formatAED(delivery.fee)
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 font-sans">
                    <dt className="text-lg font-black text-slate-900 font-sans">Total Amount</dt>
                    <dd className="font-display text-2xl sm:text-3xl font-black text-[#7E22CE] font-sans">{formatAED(total)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
