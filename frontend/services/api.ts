// Shared helpers for the Supabase-backed services.
import { isMissingSchema } from "@/lib/supabase";

/** Where a piece of data came from, so the UI can say so honestly. */
export type DataSource = "supabase" | "seed";

export interface Result<T> {
  data: T;
  source: DataSource;
  /** Set when Supabase failed for a reason other than a missing schema. */
  error?: string;
}

const OFFLINE =
  "We couldn't reach the shop. Check your connection and try again.";

export function readableError(error: unknown): string {
  if (!error) return "Something went wrong.";

  const message = (error as { message?: string }).message;
  if (typeof message !== "string" || !message.trim()) return String(error);

  // Browsers report every network failure as "Failed to fetch", which means
  // nothing to a student standing in a corridor with bad wifi.
  if (/failed to fetch|networkerror|load failed/i.test(message)) return OFFLINE;
  if (/took too long/i.test(message)) return OFFLINE;

  return message;
}

/** How long a read may take before we give up and show seed data. */
export const READ_TIMEOUT_MS = 6000;

/**
 * Rejects if `promise` has not settled in time. Without this a request that
 * hangs — no DNS, captive portal, dead wifi — would leave the storefront on
 * its loading skeleton forever.
 */
export function withTimeout<T>(
  // Supabase query builders are thenable but not real Promises.
  promise: PromiseLike<T>,
  ms = READ_TIMEOUT_MS
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("The store took too long to respond.")),
      ms
    );

    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Runs a Supabase query and falls back to seed data when the database has
 * not been set up yet, is unreachable, or is too slow. The reason is
 * reported so the UI can say what happened.
 */
export async function withFallback<T>(
  run: () => Promise<T>,
  fallback: () => T
): Promise<Result<T>> {
  try {
    return { data: await withTimeout(run()), source: "supabase" };
  } catch (error) {
    if (isMissingSchema(error)) {
      return { data: fallback(), source: "seed" };
    }
    return { data: fallback(), source: "seed", error: readableError(error) };
  }
}
