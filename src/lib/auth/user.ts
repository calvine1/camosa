import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { UserRole } from "@/store/useAuthStore";
import { getTutorStaffRole } from "@/lib/auth/tutor-staff";

export function getUserRole(user: SupabaseUser): UserRole {
  const role = user.user_metadata?.role;
  if (role === "tutor" || role === "learner") {
    return role;
  }
  return "learner";
}

export function toAppUser(user: SupabaseUser) {
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    role: getUserRole(user),
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    staffRole: getUserRole(user) === "tutor" ? getTutorStaffRole(user.user_metadata) : undefined,
  };
}
