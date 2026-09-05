"use client";

import { useState } from "react";
import { AlertCircle, Calendar, CheckCircle2, LoaderCircle, Mail, Pencil, Phone, User, X } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm sm:text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#7E22CE] focus:bg-white focus:ring-4 focus:ring-purple-100/80 shadow-2xs font-sans";

function metaOf(user) {
  const meta = user.user_metadata ?? {};
  return { full_name: meta.full_name || "", phone: meta.phone || "" };
}

export default function ProfileCard({ user, supabase }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => metaOf(user));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const meta = user.user_metadata ?? {};
  const updateForm = (field) => (e) => setForm((current) => ({ ...current, [field]: e.target.value }));

  const startEditing = () => {
    setForm(metaOf(user));
    setSaveError("");
    setSaveSuccess(false);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setSaveError("");
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setSaveError("");

    const { error } = await supabase.auth.updateUser({
      data: { full_name: form.full_name || null, phone: form.phone || null },
    });

    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setEditing(false);
    setSaveSuccess(true);
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">Personal Information</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">Manage your name and phone details — email is linked to your account login.</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startEditing}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/80 px-4 py-2 text-xs sm:text-sm font-bold text-[#7E22CE] transition-all hover:bg-[#7E22CE] hover:text-white shadow-2xs"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        )}
      </div>

      {saveSuccess && !editing && (
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-700">
          <CheckCircle2 size={18} />
          Profile updated successfully!
        </div>
      )}

      {editing ? (
        <form onSubmit={saveProfile} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">Full Name</label>
            <input value={form.full_name} onChange={updateForm("full_name")} className={inputClass} placeholder="e.g. Fatima Ahmed" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">Phone Number</label>
            <input value={form.phone} onChange={updateForm("phone")} className={inputClass} placeholder="+971 50 123 4567" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">Email Address (Read Only)</label>
            <input value={user.email} disabled className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed`} />
          </div>

          {saveError && (
            <div className="flex items-start gap-2 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-xs sm:text-sm font-semibold text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {saveError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-purple-200 transition-all disabled:opacity-70 active:scale-98"
            >
              {saving && <LoaderCircle size={16} className="animate-spin" />}
              Save Changes
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <X size={15} />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <dl className="mt-6 divide-y divide-slate-100">
          <div className="flex items-center gap-3.5 py-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-purple-50 text-[#7E22CE]">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</dt>
              <dd className="truncate text-sm sm:text-base font-bold text-slate-900">{meta.full_name || "Not specified"}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3.5 py-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-purple-50 text-[#7E22CE]">
              <Mail size={18} />
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</dt>
              <dd className="truncate text-sm sm:text-base font-bold text-slate-900">{user.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3.5 py-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-purple-50 text-[#7E22CE]">
              <Phone size={18} />
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</dt>
              <dd className="truncate text-sm sm:text-base font-bold text-slate-900">{meta.phone || "Not specified"}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3.5 py-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-purple-50 text-[#7E22CE]">
              <Calendar size={18} />
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Member Since</dt>
              <dd className="truncate text-sm sm:text-base font-bold text-slate-900">
                {new Date(user.created_at).toLocaleDateString("en-AE", { day: "numeric", month: "long", year: "numeric" })}
              </dd>
            </div>
          </div>
        </dl>
      )}
    </div>
  );
}
