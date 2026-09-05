"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, Mail, Phone } from "lucide-react";
import { toggleInquiryResolved } from "@/actions/admin/inquiries";

export default function InquiryRow({ inquiry }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [resolved, setResolved] = useState(inquiry.is_resolved);

  const toggle = () => {
    startTransition(async () => {
      await toggleInquiryResolved(inquiry.id, !resolved);
      setResolved((current) => !current);
      router.refresh();
    });
  };

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        resolved ? "border-slate-100" : "border-amber-200"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{inquiry.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Mail size={12} />
              {inquiry.email}
            </span>
            {inquiry.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} />
                {inquiry.phone}
              </span>
            )}
            <span>{new Date(inquiry.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {inquiry.subject && (
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{inquiry.subject}</span>
          )}
          <button
            onClick={toggle}
            disabled={pending}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              resolved
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-slate-200 bg-slate-100 text-slate-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {pending ? <LoaderCircle size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
            {resolved ? "Resolved" : "Mark resolved"}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-600">{inquiry.message}</p>
    </div>
  );
}
