"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { supabase } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!supabase) {
      setError("Authentication is not configured yet. Add your Supabase keys to .env.local.");
      return;
    }

    setStatus("loading");
    const { error: signInError } = await supabase.auth.signInWithPassword(form);
    setStatus("idle");

    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/account");
    router.refresh();
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-base font-normal text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-100/60 shadow-xs";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Fatima Express account to track orders and re-order in one click."
      footer={
        <>
          New to Fatima Express?{" "}
          <Link href="/register" className="font-bold text-purple-700 hover:text-purple-900 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-slate-600">
            Email address *
          </label>
          <div className="relative">
            <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
              className={inputClass}
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-600">
              Password *
            </label>
          </div>
          <div className="relative">
            <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={update("password")}
              className={`${inputClass} pr-11`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-100 p-3.5 text-sm sm:text-base font-medium text-red-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-700 hover:bg-purple-800 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
        >
          {status === "loading" ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
