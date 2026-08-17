// Authentication and profile access, backed by Supabase Auth.
import { getSupabase, isMissingSchema, requireSupabase } from "@/lib/supabase";
import type { ProfileRow } from "@/types/database";
import { readableError } from "./api";

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpInput extends Credentials {
  name: string;
}

export async function signUp({ email, password, name }: SignUpInput) {
  const client = requireSupabase();

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) throw new Error(readableError(error));
  return data;
}

export async function signIn({ email, password }: Credentials) {
  const client = requireSupabase();

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(readableError(error));
  return data;
}

export async function signOut(): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  const { error } = await client.auth.signOut();
  if (error) throw new Error(readableError(error));
}

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    if (isMissingSchema(error)) return null;
    throw new Error(readableError(error));
  }

  return (data as ProfileRow) ?? null;
}

export async function updateProfile(
  userId: string,
  patch: Partial<Omit<ProfileRow, "id" | "role" | "created_at" | "updated_at">>
): Promise<void> {
  const client = requireSupabase();

  const { error } = await client.from("profiles").update(patch).eq("id", userId);
  if (error) throw new Error(readableError(error));
}
