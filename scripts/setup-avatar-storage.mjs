import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) {
    console.error("Missing .env.local in project root.");
    process.exit(1);
  }

  const vars = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    vars[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return vars;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET = "avatars";

async function ensureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`Could not list buckets: ${listError.message}`);
  }

  const exists = buckets?.some((b) => b.name === BUCKET || b.id === BUCKET);
  if (exists) {
    console.log(`Bucket "${BUCKET}" already exists.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 2097152,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (error) {
    throw new Error(`Could not create bucket: ${error.message}`);
  }

  console.log(`Created public bucket "${BUCKET}" (2MB limit).`);
}

async function main() {
  console.log("Setting up avatar storage...\n");
  await ensureBucket();
  console.log("\nNext: run storage policies in Supabase SQL Editor.");
  console.log("Open: supabase/storage-avatars.sql");
  console.log(
    "Or visit http://localhost:3000/api/setup-avatar-storage (dev) after starting the app.\n"
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
