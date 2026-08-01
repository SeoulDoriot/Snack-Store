// Compact −/＋ stepper used by cart lines.
import { MinusIcon, PlusIcon } from "../common/Icons";
import styles from "../cart/Cart.module.css";

interface QuantitySelectorProps {
  value: number;
  max?: number;
  label: string;
  onChange: (next: number) => void;
}

export default function QuantitySelector({
  value,
  max,
  label,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.step}
        onClick={() => onChange(value - 1)}
        aria-label={`Remove one ${label}`}
      >
        <MinusIcon />
      </button>
      <span className={styles.stepValue} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.step}
        onClick={() => onChange(value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label={`Add one ${label}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
