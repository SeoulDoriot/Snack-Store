// Frontend-wide shared types.
import type { Product } from "@/data/products";

export type { Category, Product } from "@/data/products";

/** One product plus how many of it are in the bag. */
export interface CartLine {
  product: Product;
  quantity: number;
}

/** Quantity keyed by product id — the shape persisted to localStorage. */
export type CartItems = Record<string, number>;
