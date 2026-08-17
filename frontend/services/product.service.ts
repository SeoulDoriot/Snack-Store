// Product catalog access.
//
// Reads from Supabase when the database is set up, and falls back to the
// seed catalog in data/products.ts otherwise so the storefront always works.
import { getSupabase, requireSupabase } from "@/lib/supabase";
import { PRODUCTS, type Product } from "@/data/products";
import type { ProductRow } from "@/types/database";
import { withFallback, type Result } from "./api";

/** Thrown to trigger the seed fallback when the client is not configured. */
const NOT_CONFIGURED = { code: "PGRST205", message: "Supabase not configured" };

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    category: row.category,
    image: row.image,
    promo: row.promo,
    popular: row.popular,
  };
}

export async function listProducts(): Promise<Result<Product[]>> {
  return withFallback(
    async () => {
      const client = getSupabase();
      if (!client) throw NOT_CONFIGURED;

      const { data, error } = await client
        .from("products")
        .select("*")
        .eq("active", true)
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return (data as ProductRow[]).map(toProduct);
    },
    () => PRODUCTS
  );
}

export async function getProduct(id: string): Promise<Result<Product | null>> {
  return withFallback(
    async () => {
      const client = getSupabase();
      if (!client) throw NOT_CONFIGURED;

      const { data, error } = await client
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data ? toProduct(data as ProductRow) : null;
    },
    () => PRODUCTS.find((product) => product.id === id) ?? null
  );
}

/** Admin: every product, including deactivated ones. */
export async function listAllProducts(): Promise<Result<Product[]>> {
  return withFallback(
    async () => {
      const client = getSupabase();
      if (!client) throw NOT_CONFIGURED;

      const { data, error } = await client
        .from("products")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return (data as ProductRow[]).map(toProduct);
    },
    () => PRODUCTS
  );
}

export async function updateStock(id: string, stock: number): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from("products").update({ stock }).eq("id", id);
  if (error) throw error;
}

export async function upsertProduct(product: Product): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from("products").upsert({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    image: product.image,
    promo: product.promo ?? false,
    popular: product.popular ?? false,
  });

  if (error) throw error;
}

/** Soft delete — keeps the row so historical orders still resolve. */
export async function deactivateProduct(id: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from("products")
    .update({ active: false })
    .eq("id", id);

  if (error) throw error;
}
