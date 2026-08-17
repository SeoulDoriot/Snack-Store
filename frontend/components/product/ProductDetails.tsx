// Single product view: art, price, stock and the add action.
import type { Product } from "@/types";
import { formatPrice } from "@/utils/currency";
import Button from "../common/Button";
import { HeartIcon } from "../common/Icons";
import styles from "@/styles/Products.module.css";

const LOW_STOCK = 12;

interface ProductDetailsProps {
  product: Product;
  favourite: boolean;
  onToggleFavourite: (id: string) => void;
  onAdd: (id: string) => void;
  onViewBag: () => void;
}

export default function ProductDetails({
  product,
  favourite,
  onToggleFavourite,
  onAdd,
  onViewBag,
}: ProductDetailsProps) {
  const soldOut = product.stock === 0;
  const low = !soldOut && product.stock <= LOW_STOCK;

  return (
    <div className={styles.detail}>
      <div className={styles.detailArt} role="img" aria-label={product.name}>
        {product.image}
      </div>

      <div className={styles.detailBody}>
        <p className={styles.detailCategory}>{product.category}</p>
        <h1 className={styles.detailName}>{product.name}</h1>
        <p className={styles.detailText}>{product.description}</p>

        <p className={styles.detailPrice}>{formatPrice(product.price)}</p>
        <p
          className={`${styles.detailStock} ${low ? styles.detailStockLow : ""} ${
            soldOut ? styles.detailStockOut : ""
          }`}
        >
          {soldOut
            ? "Out of stock"
            : low
              ? `Only ${product.stock} left`
              : `${product.stock} in stock`}
        </p>

        <div className={styles.detailActions}>
          <Button size="lg" onClick={() => onAdd(product.id)} disabled={soldOut}>
            {soldOut ? "Sold out" : "Add to bag"}
          </Button>
          <Button variant="secondary" size="lg" onClick={onViewBag}>
            View bag
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onToggleFavourite(product.id)}
            aria-pressed={favourite}
          >
            <HeartIcon size={18} filled={favourite} />
            {favourite ? "Saved" : "Save"}
          </Button>
        </div>

        <p className={styles.detailNote}>
          Order before 9PM · usually delivered within 20 minutes.
        </p>
      </div>
    </div>
  );
}
