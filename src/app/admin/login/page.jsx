"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { adminLogin } from "@/actions/admin/auth";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, {});
  const [showPassword, setShowPassword] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-base font-normal text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-100/60 shadow-xs";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50/50 px-6">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-[26rem] w-[26rem] rounded-full bg-purple-100/50 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-purple-950/5 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-purple-700">
              <ShieldCheck size={13} />
              Admin Portal
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-950">Welcome Back</h1>
            <p className="mt-1.5 text-sm text-slate-500">Sign in with your authorized admin account.</p>
          </div>

          <form action={formAction} className="mt-8 space-y-4">
            {state.error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.error}</div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-slate-600">Email address</label>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required name="email" type="email" placeholder="you@fatimaexpress.com" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-slate-600">Password</label>
              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-700 hover:bg-purple-800 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 transition hover:text-purple-700"
            >
              <ArrowLeft size={14} />
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
