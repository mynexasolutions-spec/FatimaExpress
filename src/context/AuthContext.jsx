"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient, supabaseEnabled } from "@/lib/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [supabase] = useState(() => (supabaseEnabled ? createClient() : null));
  const [user, setUser] = useState(null);
  // supabaseEnabled comes from NEXT_PUBLIC_* env vars, identical on server and
  // client, so this can be the real initial value instead of always starting
  // true and flipping to false inside the effect below.
  const [loading, setLoading] = useState(supabaseEnabled);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo(
    () => ({
      supabase,
      user,
      loading,
      signOut: async () => {
        await supabase?.auth.signOut();
        setUser(null);
      },
    }),
    [supabase, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
