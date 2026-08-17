// Admin order management.
import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import OrderTable from "@/components/admin/OrderTable";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/common/Spinner";
import { BagIcon } from "@/components/common/Icons";
import { useOrders } from "@/hooks/useOrders";
import { updateOrderStatus } from "@/services/order.service";
import { useNotify } from "@/context/NotificationContext";
import { STATUS_FLOW, STATUS_LABELS } from "@/data/orders";
import type { OrderStatus } from "@/types/database";
import styles from "@/styles/Admin.module.css";

type Filter = OrderStatus | "all";

export default function AdminOrdersPage() {
  const { notify } = useNotify();
  const { orders, loading, error, reload } = useOrders("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState<string[]>([]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? orders
        : orders.filter((order) => order.status === filter),
    [orders, filter]
  );

  async function changeStatus(id: string, status: OrderStatus) {
    setBusy((current) => [...current, id]);

    try {
      await updateOrderStatus(id, status);
      notify("Order updated", { text: `Marked as ${STATUS_LABELS[status]}.` });
      reload();
    } catch (cause) {
      notify("Could not update the order", {
        text: (cause as Error).message,
        tone: "error",
      });
    } finally {
      setBusy((current) => current.filter((value) => value !== id));
    }
  }

  return (
    <AdminLayout
      title="Orders"
      subtitle="Track and move orders through delivery"
      actions={
        <Button variant="secondary" size="sm" onClick={reload}>
          Refresh
        </Button>
      }
    >
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <p className={styles.panelTitle}>
            {filter === "all" ? "All orders" : STATUS_LABELS[filter]} ·{" "}
            {visible.length}
          </p>
          <select
            className={styles.select}
            value={filter}
            aria-label="Filter by status"
            onChange={(event) => setFilter(event.target.value as Filter)}
          >
            <option value="all">All statuses</option>
            {STATUS_FLOW.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <Spinner center label="Loading orders" />
        ) : visible.length > 0 ? (
          <OrderTable
            orders={visible}
            busy={busy}
            onStatusChange={changeStatus}
          />
        ) : (
          <EmptyState
            icon={<BagIcon size={22} />}
            title={filter === "all" ? "No orders yet" : "Nothing with that status"}
            description="Orders placed in the shop will appear here."
          />
        )}
      </div>
    </AdminLayout>
  );
}
