"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toAppUser } from "@/lib/auth/user";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const supabase = createClient();

    const syncSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        login(toAppUser(user));
      } else {
        logout();
      }
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        login(toAppUser(session.user));
      } else {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);

  return <>{children}</>;
}
