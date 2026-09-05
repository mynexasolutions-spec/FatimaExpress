"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyEmailsButton({ emails }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-brand-100 px-5 py-2.5 text-sm font-bold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
    >
      {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
      {copied ? "Copied!" : "Copy All Emails"}
    </button>
  );
}
