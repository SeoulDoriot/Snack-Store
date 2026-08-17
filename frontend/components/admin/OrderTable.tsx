// Admin orders table.
import OrderStatusSelect from "./OrderStatusSelect";
import { formatPrice } from "@/utils/currency";
import type { OrderStatus, OrderWithItems } from "@/types/database";
import styles from "@/styles/Admin.module.css";

interface OrderTableProps {
  orders: OrderWithItems[];
  /** Ids currently being saved, so their row locks while in flight. */
  busy?: string[];
  onStatusChange: (id: string, status: OrderStatus) => void;
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function summarise(order: OrderWithItems): string {
  const units = order.order_items.reduce((total, item) => total + item.quantity, 0);
  const names = order.order_items.map((item) => item.name).join(", ");
  return `${units} item${units === 1 ? "" : "s"} · ${names}`;
}

export default function OrderTable({
  orders,
  busy = [],
  onStatusChange,
}: OrderTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Deliver to</th>
            <th>Items</th>
            <th className={styles.numeric}>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <div className={styles.cellName}>{order.order_number}</div>
                <div className={styles.cellSub}>{formatWhen(order.created_at)}</div>
              </td>
              <td>
                <div className={styles.cellName}>{order.customer_name}</div>
                <div className={styles.cellSub}>
                  {order.phone}
                  {order.student_id ? ` · ${order.student_id}` : ""}
                </div>
              </td>
              <td>
                <div>{order.dorm}</div>
                <div className={styles.cellSub}>
                  {order.room ? `Room ${order.room}` : "—"}
                </div>
              </td>
              <td>
                <div className={styles.cellSub}>{summarise(order)}</div>
              </td>
              <td className={styles.numeric}>{formatPrice(Number(order.total))}</td>
              <td>
                <OrderStatusSelect
                  value={order.status}
                  disabled={busy.includes(order.id)}
                  onChange={(next) => onStatusChange(order.id, next)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
