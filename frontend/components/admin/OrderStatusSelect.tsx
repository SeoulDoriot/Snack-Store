// Order status dropdown used in the admin orders table.
import { STATUS_LABELS, STATUS_FLOW } from "@/data/orders";
import type { OrderStatus } from "@/types/database";
import styles from "@/styles/Admin.module.css";

interface OrderStatusSelectProps {
  value: OrderStatus;
  disabled?: boolean;
  onChange: (next: OrderStatus) => void;
}

export default function OrderStatusSelect({
  value,
  disabled = false,
  onChange,
}: OrderStatusSelectProps) {
  return (
    <select
      className={styles.select}
      value={value}
      disabled={disabled}
      aria-label="Order status"
      onChange={(event) => onChange(event.target.value as OrderStatus)}
    >
      {STATUS_FLOW.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
