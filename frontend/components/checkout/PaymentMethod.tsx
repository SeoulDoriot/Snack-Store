// Payment selection. Mock only — no payment is processed.
import styles from "@/styles/Checkout.module.css";

export type PaymentId = "cash" | "aba" | "wing";

interface PaymentOption {
  id: PaymentId;
  name: string;
  text: string;
}

const OPTIONS: PaymentOption[] = [
  { id: "cash", name: "Cash on delivery", text: "Pay the runner at your door." },
  { id: "aba", name: "ABA Pay", text: "Scan the QR when your order arrives." },
  { id: "wing", name: "Wing", text: "Transfer on delivery." },
];

interface PaymentMethodProps {
  value: PaymentId;
  onChange: (value: PaymentId) => void;
}

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div className={styles.options} role="radiogroup" aria-label="Payment method">
      {OPTIONS.map((option) => {
        const active = option.id === value;

        return (
          <label
            key={option.id}
            className={`${styles.option} ${active ? styles.optionActive : ""}`}
          >
            <input
              className={styles.optionInput}
              type="radio"
              name="payment"
              value={option.id}
              checked={active}
              onChange={() => onChange(option.id)}
            />
            <span className={styles.radio} aria-hidden>
              <span className={styles.radioDot} />
            </span>
            <span className={styles.optionBody}>
              <span className={styles.optionName}>{option.name}</span>
              <span className={styles.optionText}>{option.text}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
