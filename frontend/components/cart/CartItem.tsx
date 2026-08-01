// Single line in the bag: thumbnail, name, stepper and line total.
import { formatPrice } from "@/utils/currency";
import type { CartLine } from "@/types";
import QuantitySelector from "../product/QuantitySelector";
import styles from "./Cart.module.css";

export type { CartLine };

interface CartItemProps {
  line: CartLine;
  onQuantityChange: (id: string, quantity: number) => void;
}

export default function CartItem({ line, onQuantityChange }: CartItemProps) {
  const { product, quantity } = line;

  return (
    <li className={styles.line}>
      <div className={styles.lineThumb} role="img" aria-label={product.name}>
        {product.image}
      </div>

      <div className={styles.lineBody}>
        <p className={styles.lineName}>{product.name}</p>
        <p className={styles.lineMeta}>{formatPrice(product.price)} each</p>
        <QuantitySelector
          value={quantity}
          max={product.stock}
          label={product.name}
          onChange={(next) => onQuantityChange(product.id, next)}
        />
      </div>

      <span className={styles.lineTotal}>
        {formatPrice(product.price * quantity)}
      </span>
    </li>
  );
}
