import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const adminSupabaseEnabled = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Service-role client. Bypasses RLS — server-only code (admin actions,
 * seed/migration scripts). Never import this from a Client Component.
 */
export function createAdminClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
