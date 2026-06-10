"use client";

import { resolveAvatarUrl } from "@/lib/auth/avatar";
import type { UserRole } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  userId: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  sm: "w-9 h-9",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-24 h-24",
};

export default function UserAvatar({
  userId,
  name,
  role,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  const src = resolveAvatarUrl(avatarUrl, userId, role);

  return (
    <div
      className={cn(
        "rounded-full border border-border overflow-hidden bg-secondary shrink-0",
        sizeClasses[size],
        className
      )}
    >
      <img src={src} alt={name} className="w-full h-full object-cover" />
    </div>
  );
}
