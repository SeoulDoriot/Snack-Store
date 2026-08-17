// The product catalog, loaded once and shared by every page.
//
// Falls back to the seed list in data/products.ts when the database has not
// been set up, so the storefront works before and after the SQL is run.
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/data/products";
import type { DataSource } from "@/services/api";

export interface CatalogContextValue {
  products: Product[];
  byId: Map<string, Product>;
  loading: boolean;
  error?: string;
  /** "seed" means the database is not set up yet. */
  source: DataSource;
  reload: () => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { products, loading, error, source, reload } = useProducts();

  const value = useMemo<CatalogContextValue>(
    () => ({
      products,
      byId: new Map(products.map((product) => [product.id, product])),
      loading,
      error,
      source,
      reload,
    }),
    [products, loading, error, source, reload]
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used inside <CatalogProvider>.");
  }
  return context;
}

export default CatalogContext;
