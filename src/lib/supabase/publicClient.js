import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Plain, stateless anon-key client for public catalog reads (RLS: is_active =
// true). Works identically in Server Components and Client Components since
// it never touches cookies — unlike the SSR-aware clients in ./client.js and
// ./server.js, which are for the authenticated customer session.
export const publicCatalogEnabled =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Reused across calls (module-level singleton) so repeated catalog fetches
// don't spin up a new GoTrue client each time — on the server each request
// gets a fresh module instance anyway, so there's no cross-request leakage.
let client = null;

export function createPublicClient() {
  if (!client) {
    client = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      // Distinct storageKey so this stateless catalog client doesn't collide
      // with AuthContext's session-aware client on the same localStorage key.
      auth: { persistSession: false, storageKey: "fe-catalog-anon" },
    });
  }
  return client;
}
