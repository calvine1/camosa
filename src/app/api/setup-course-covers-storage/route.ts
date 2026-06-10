import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { COURSE_COVER_BUCKET } from "@/lib/tutor/course-images";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Setup endpoint is disabled in production." },
      { status: 403 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY in .env.local" },
      { status: 500 }
    );
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Create bucket if it doesn't exist
  const { data: buckets, error: listError } = await admin.storage.listBuckets();
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  const exists = buckets?.some((b) => b.name === COURSE_COVER_BUCKET || b.id === COURSE_COVER_BUCKET);

  if (!exists) {
    const { error: createError } = await admin.storage.createBucket(COURSE_COVER_BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    bucket: COURSE_COVER_BUCKET,
    bucketCreated: !exists,
    message:
      exists
        ? "Bucket exists. If uploads still fail, run supabase/storage-course-covers.sql in the SQL Editor."
        : "Bucket created. Run supabase/storage-course-covers.sql in Supabase SQL Editor for upload policies.",
    sqlFile: "supabase/storage-course-covers.sql",
  });
}

