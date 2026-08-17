// Loads the catalog, falling back to seed data when the database is empty.
import { useCallback, useEffect, useState } from "react";
import { PRODUCTS as SEED_PRODUCTS, type Product } from "@/data/products";
import { listAllProducts, listProducts } from "@/services/product.service";
import type { DataSource } from "@/services/api";

interface UseProducts {
  products: Product[];
  loading: boolean;
  error?: string;
  source: DataSource;
  reload: () => void;
}

export function useProducts(includeInactive = false): UseProducts {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [source, setSource] = useState<DataSource>("seed");
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const load = includeInactive ? listAllProducts : listProducts;

    load()
      .then((result) => {
        if (!active) return;
        setProducts(result.data);
        setSource(result.source);
        setError(result.error);
      })
      .catch((cause: Error) => {
        // Never leave the page on its skeleton: show the seed catalog and
        // say what went wrong.
        if (!active) return;
        setProducts(SEED_PRODUCTS);
        setSource("seed");
        setError(cause.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [includeInactive, nonce]);

  return { products, loading, error, source, reload };
}

export default useProducts;
