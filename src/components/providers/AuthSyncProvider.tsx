"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toAppUser } from "@/lib/auth/user";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  // Ensure user profile exists in database
  const ensureProfile = async (userId: string, user: any) => {
    try {
      const response = await fetch("/api/auth/ensure-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
          role: user.user_metadata?.role || "learner",
          staffRole: user.user_metadata?.staff_role,
        }),
      });

      if (!response.ok) {
        console.warn("Failed to ensure profile:", await response.json());
      }
    } catch (error) {
      console.error("Error ensuring profile:", error);
    }
  };

  useEffect(() => {
    const supabase = createClient();

    const syncSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Ensure profile exists before logging in
        await ensureProfile(user.id, user);
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
        ensureProfile(session.user.id, session.user);
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
