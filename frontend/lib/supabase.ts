// Browser Supabase client.
//
// The publishable key is public by design — it ships in the bundle and row
// level security is what actually protects the data. If the environment is
// not configured the client is null and the app falls back to seed data,
// so the storefront still runs before the database is set up.
//
// The client is created lazily on first use rather than at import time: a
// throw during module evaluation would take the whole bundle down with it
// and stop the page hydrating, with no error in the console.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;
let tried = false;

export function getSupabase(): SupabaseClient | null {
  if (tried) return client;
  tried = true;

  if (!isSupabaseConfigured || typeof window === "undefined") return null;

  try {
    client = createClient(url!, key!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch {
    // Storage blocked, bad URL — behave as if unconfigured.
    client = null;
  }

  return client;
}

/** Throws with a readable message when the client is unavailable. */
export function requireSupabase(): SupabaseClient {
  const instance = getSupabase();
  if (!instance) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in frontend/.env.local."
    );
  }
  return instance;
}

/**
 * True when the failure means "the database has not been set up yet"
 * (missing table or missing function) rather than a real error. Callers use
 * this to fall back to seed data instead of showing an error.
 */
export function isMissingSchema(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  const message = (error as { message?: string } | null)?.message ?? "";

  return (
    code === "PGRST205" || // table not found in schema cache
    code === "PGRST202" || // function not found
    code === "42P01" || // undefined_table
    /schema cache|does not exist/i.test(message)
  );
}
