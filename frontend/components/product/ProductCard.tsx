// Product row card: thumbnail, details, price and add action.
import type { CSSProperties } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/currency";
import Button from "../common/Button";
import { HeartIcon } from "../common/Icons";
import styles from "./Product.module.css";

/** Below this, the card nudges the shopper with "Only N left". */
const LOW_STOCK = 15;

interface ProductCardProps {
  product: Product;
  favourite: boolean;
  onToggleFavourite: (id: string) => void;
  onAdd: (id: string) => void;
  style?: CSSProperties;
}

export default function ProductCard({
  product,
  favourite,
  onToggleFavourite,
  onAdd,
  style,
}: ProductCardProps) {
  const soldOut = product.stock === 0;
  const low = !soldOut && product.stock <= LOW_STOCK;

  return (
    <article className={styles.card} style={style}>
      {product.promo && <span className={styles.promo}>OFFER</span>}

      <div className={styles.media}>
        <div className={styles.thumb} role="img" aria-label={product.name}>
          {product.image}
        </div>
        <button
          type="button"
          className={`${styles.fav} ${favourite ? styles.favActive : ""}`}
          onClick={() => onToggleFavourite(product.id)}
          aria-pressed={favourite}
          aria-label={`${favourite ? "Remove" : "Save"} ${product.name}`}
        >
          <HeartIcon size={14} filled={favourite} />
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <p className={`${styles.stock} ${soldOut ? styles.stockOut : ""}`}>
          {soldOut
            ? "Sold out"
            : low
              ? `Only ${product.stock} left`
              : `${product.stock} in stock`}
        </p>
      </div>

      <div className={styles.side}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        <Button size="sm" onClick={() => onAdd(product.id)} disabled={soldOut}>
          Add
        </Button>
      </div>
    </article>
  );
}
