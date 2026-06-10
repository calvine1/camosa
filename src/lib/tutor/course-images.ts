import type { SupabaseClient } from "@supabase/supabase-js";

export const COURSE_COVER_BUCKET = "course-covers";

const MAX_COVER_BYTES = 5 * 1024 * 1024;

const ALLOWED_COVER_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function validateCourseCoverFile(file: File): {
  ok: true;
} | { ok: false; error: string } {
  if (!ALLOWED_COVER_TYPES.includes(file.type as (typeof ALLOWED_COVER_TYPES)[number])) {
    return { ok: false, error: "Please upload a JPG, PNG, or WebP image." };
  }

  if (file.size > MAX_COVER_BYTES) {
    return { ok: false, error: "Course banner image must be 5MB or smaller." };
  }

  return { ok: true };
}

function extensionForMime(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function uploadCourseCover(
  supabase: SupabaseClient,
  courseId: number,
  file: File
): Promise<{ url: string } | { error: string }> {
  const validation = validateCourseCoverFile(file);
  if (!validation.ok) return { error: validation.error };

  const ext = extensionForMime(file.type);
  const filePath = `${courseId}/cover.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(COURSE_COVER_BUCKET)
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
          "Course cover storage bucket is missing. Run: /api/setup-course-covers-storage in development or create the SQL bucket.",
      };
    }
    if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("not authorized")) {
      return {
        error:
          "Upload blocked by storage policies. Run supabase/storage-course-covers.sql in Supabase SQL Editor.",
      };
    }
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(COURSE_COVER_BUCKET).getPublicUrl(filePath);

  // Cache-bust
  const url = `${publicUrl}?v=${Date.now()}`;
  return { url };
}

