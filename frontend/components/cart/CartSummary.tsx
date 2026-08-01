// Bag totals and the checkout action.
import { formatPrice } from "@/utils/currency";
import Button from "../common/Button";
import styles from "./Cart.module.css";

interface CartSummaryProps {
  subtotal: number;
  delivery: number;
  onCheckout: () => void;
}

export default function CartSummary({
  subtotal,
  delivery,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className={styles.summary}>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Subtotal</span>
        <span className={styles.rowValue}>{formatPrice(subtotal)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Delivery to Dorm B</span>
        <span className={styles.rowValue}>
          {delivery === 0 ? "Free" : formatPrice(delivery)}
        </span>
      </div>

      <Button className={styles.checkout} onClick={onCheckout}>
        Checkout · {formatPrice(subtotal + delivery)}
      </Button>

      <p className={styles.note}>
        Order before 9PM · usually delivered within 20 minutes.
      </p>
    </div>
  );
}
