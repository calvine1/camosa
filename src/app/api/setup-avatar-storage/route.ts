import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { AVATAR_BUCKET, MAX_AVATAR_BYTES } from "@/lib/auth/avatar";

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

  const { data: buckets, error: listError } = await admin.storage.listBuckets();
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const exists = buckets?.some(
    (b) => b.name === AVATAR_BUCKET || b.id === AVATAR_BUCKET
  );

  if (!exists) {
    const { error: createError } = await admin.storage.createBucket(
      AVATAR_BUCKET,
      {
        public: true,
        fileSizeLimit: MAX_AVATAR_BYTES,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      }
    );

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    bucket: AVATAR_BUCKET,
    bucketCreated: !exists,
    policiesRequired: true,
    sqlFile: "supabase/storage-avatars.sql",
    message:
      exists
        ? "Bucket exists. If uploads still fail, run supabase/storage-avatars.sql in the SQL Editor."
        : "Bucket created. Run supabase/storage-avatars.sql in Supabase SQL Editor for upload policies.",
  });
}
