"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// Creates the customer account pre-confirmed (email_confirm: true) so sign-up
// is instant — no confirmation email / OTP step. Uses the service-role client
// because only the admin API can force-confirm a new user; the browser then
// signs the user in directly with their password right after this succeeds.
export async function createCustomerAccount({ fullName, company, phone, email, password }) {
  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || null, company: company || null, phone: phone || null },
  });

  if (error) {
    if (error.message?.toLowerCase().includes("already")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }

  return { success: true };
}
