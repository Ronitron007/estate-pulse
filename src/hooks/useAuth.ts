"use client";

import { useAuth as useAuthContext } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const { user, loading } = useAuthContext();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}
