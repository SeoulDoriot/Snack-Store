// Product list with a direction-aware page transition.
import type { CSSProperties } from "react";
import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import styles from "./Product.module.css";

interface ProductGridProps {
  products: Product[];
  favourites: string[];
  onToggleFavourite: (id: string) => void;
  onAdd: (id: string) => void;
  /** 1 when moving to a later category, -1 when moving back. */
  direction?: number;
  leaving?: boolean;
}

export default function ProductGrid({
  products,
  favourites,
  onToggleFavourite,
  onAdd,
  direction = 1,
  leaving = false,
}: ProductGridProps) {
  return (
    <div
      className={`${styles.grid} ${leaving ? styles.pageOut : styles.pageIn}`}
      style={{ "--dir": direction } as CSSProperties}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          favourite={favourites.includes(product.id)}
          onToggleFavourite={onToggleFavourite}
          onAdd={onAdd}
          style={{ "--i": index } as CSSProperties}
        />
      ))}
    </div>
  );
}
