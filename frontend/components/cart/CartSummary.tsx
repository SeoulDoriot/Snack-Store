// Bag totals and the checkout action.
import Link from "next/link";
import { formatPrice } from "@/utils/currency";
import Button from "../common/Button";
import styles from "./Cart.module.css";

interface CartSummaryProps {
  subtotal: number;
  delivery: number;
  onCheckout: () => void;
  /** Shows a link through to the full cart page (drawer only). */
  showBagLink?: boolean;
  checkoutLabel?: string;
}

export default function CartSummary({
  subtotal,
  delivery,
  onCheckout,
  showBagLink = false,
  checkoutLabel = "Checkout",
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

      <div className={`${styles.row} ${styles.rowTotal}`}>
        <span className={styles.rowLabel}>Total</span>
        <span className={styles.rowValue}>{formatPrice(subtotal + delivery)}</span>
      </div>

      <Button className={styles.checkout} block size="lg" onClick={onCheckout}>
        {checkoutLabel}
      </Button>

      {showBagLink && (
        <p className={styles.viewBag}>
          <Link href="/cart" className={styles.viewBagLink}>
            View full bag
          </Link>
        </p>
      )}

      <p className={styles.note}>
        Order before 9PM · usually delivered within 20 minutes.
      </p>
    </div>
  );
}
