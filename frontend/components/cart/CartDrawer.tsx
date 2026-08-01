// Slide-in bag panel.
import { useEffect } from "react";
import Button from "../common/Button";
import { BagIcon, CloseIcon } from "../common/Icons";
import CartItem, { type CartLine } from "./CartItem";
import CartSummary from "./CartSummary";
import styles from "./Cart.module.css";

interface CartDrawerProps {
  open: boolean;
  lines: CartLine[];
  subtotal: number;
  onClose: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  open,
  lines,
  subtotal,
  onClose,
  onQuantityChange,
  onCheckout,
}: CartDrawerProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const count = lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <div className={styles.root} data-open={open} aria-hidden={!open}>
      <button
        type="button"
        className={styles.scrim}
        onClick={onClose}
        tabIndex={-1}
        aria-label="Close bag"
      />

      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
      >
        <header className={styles.head}>
          <div>
            <h2 className={styles.title}>Your bag</h2>
            <p className={styles.subtitle}>
              {count === 0 ? "Nothing added yet" : `${count} item${count === 1 ? "" : "s"}`}
            </p>
          </div>
          <Button variant="soft" size="icon" onClick={onClose} aria-label="Close bag">
            <CloseIcon />
          </Button>
        </header>

        {lines.length > 0 ? (
          <>
            <ul className={styles.lines}>
              {lines.map((line) => (
                <CartItem
                  key={line.product.id}
                  line={line}
                  onQuantityChange={onQuantityChange}
                />
              ))}
            </ul>
            <CartSummary subtotal={subtotal} delivery={0} onCheckout={onCheckout} />
          </>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <BagIcon size={30} />
            </span>
            <p className={styles.emptyTitle}>Your bag is empty</p>
            <p className={styles.emptyText}>
              Add a snack or a drink and it will show up here.
            </p>
            <Button variant="soft" className={styles.emptyAction} onClick={onClose}>
              Browse snacks
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}
