import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { readRememberMePreference } from "@/lib/auth/remember-me";

function getAuthStorage() {
  if (typeof window === "undefined") {
    return undefined;
  }
  return readRememberMePreference()
    ? window.localStorage
    : window.sessionStorage;
}

export function createClient(): SupabaseClient {
  const storage = getAuthStorage();

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    storage
      ? {
          auth: {
            storage: {
              getItem: (key) => storage.getItem(key),
              setItem: (key, value) => storage.setItem(key, value),
              removeItem: (key) => storage.removeItem(key),
            },
          },
        }
      : undefined
  );
}
