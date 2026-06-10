import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "@/store/useAuthStore";

export const AVATAR_BUCKET = "avatars";
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export function getDefaultAvatarUrl(seed: string, role: UserRole) {
  const avatarSeed = role === "tutor" ? `tutor-${seed}` : `learner-${seed}`;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;
}

export function resolveAvatarUrl(
  avatarUrl: string | null | undefined,
  userId: string,
  role: UserRole
) {
  if (avatarUrl) return avatarUrl;
  return getDefaultAvatarUrl(userId, role);
}

export function validateAvatarFile(file: File): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type as (typeof ALLOWED_AVATAR_TYPES)[number])) {
    return {
      ok: false,
      error: "Please upload a JPG, PNG, or WebP image.",
    };
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return {
      ok: false,
      error: "Profile picture must be 2MB or smaller.",
    };
  }

  return { ok: true };
}

function extensionForMime(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function uploadProfilePicture(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<{ url: string } | { error: string }> {
  const validation = validateAvatarFile(file);
  if (!validation.ok) {
    return { error: validation.error };
  }

  const ext = extensionForMime(file.type);
  const filePath = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    const msg = uploadError.message.toLowerCase();
    if (msg.includes("bucket not found")) {
      return {
        error:
          "Avatar storage bucket is missing. Run: npm run setup:avatars",
      };
    }
    if (
      msg.includes("row-level security") ||
      msg.includes("policy") ||
      msg.includes("not authorized")
    ) {
      return {
        error:
          "Upload blocked by storage policies. Run supabase/storage-avatars.sql in Supabase SQL Editor.",
      };
    }
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

  const avatarUrl = `${publicUrl}?v=${Date.now()}`;

  const { error: metaError } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  if (metaError) {
    return { error: metaError.message };
  }

  return { url: avatarUrl };
}
