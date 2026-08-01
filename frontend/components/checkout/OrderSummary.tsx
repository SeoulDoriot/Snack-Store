// Read-only order summary shown beside the checkout form.
import type { ReactNode } from "react";
import type { CartLine } from "@/types";
import { formatPrice } from "@/utils/currency";
import styles from "@/styles/Checkout.module.css";

interface OrderSummaryProps {
  lines: CartLine[];
  subtotal: number;
  delivery: number;
  action?: ReactNode;
  note?: string;
}

export default function OrderSummary({
  lines,
  subtotal,
  delivery,
  action,
  note,
}: OrderSummaryProps) {
  return (
    <aside className={styles.summary} aria-label="Order summary">
      <p className={styles.summaryTitle}>Order summary</p>

      <ul className={styles.summaryLines}>
        {lines.map((line) => (
          <li key={line.product.id} className={styles.summaryLine}>
            <span
              className={styles.summaryThumb}
              role="img"
              aria-label={line.product.name}
            >
              {line.product.image}
            </span>
            <span className={styles.summaryBody}>
              <span className={styles.summaryName}>{line.product.name}</span>
              <span className={styles.summaryQty}>Qty {line.quantity}</span>
            </span>
            <span className={styles.summaryPrice}>
              {formatPrice(line.product.price * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.row}>
        <span className={styles.rowLabel}>Subtotal</span>
        <span className={styles.rowValue}>{formatPrice(subtotal)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Delivery</span>
        <span className={styles.rowValue}>
          {delivery === 0 ? "Free" : formatPrice(delivery)}
        </span>
      </div>

      <div className={`${styles.row} ${styles.total}`}>
        <span className={styles.rowLabel}>Total</span>
        <span className={styles.rowValue}>{formatPrice(subtotal + delivery)}</span>
      </div>

      {action && <div className={styles.place}>{action}</div>}
      {note && <p className={styles.note}>{note}</p>}
    </aside>
  );
}
