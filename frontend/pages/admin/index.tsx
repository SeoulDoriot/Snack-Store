// Admin dashboard: today's numbers and the newest orders.
import { useMemo } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import OrderTable from "@/components/admin/OrderTable";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/common/Spinner";
import { BagIcon } from "@/components/common/Icons";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { updateOrderStatus } from "@/services/order.service";
import { useNotify } from "@/context/NotificationContext";
import { formatPrice } from "@/utils/currency";
import type { OrderStatus } from "@/types/database";
import styles from "@/styles/Admin.module.css";

const LOW_STOCK = 12;
const RECENT = 8;

export default function AdminDashboardPage() {
  const router = useRouter();
  const { notify } = useNotify();
  const { orders, loading, error, reload } = useOrders("all");
  const { products, source } = useProducts(true);

  const stats = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const today = orders.filter(
      (order) => new Date(order.created_at) >= startOfDay
    );

    return {
      openOrders: orders.filter((order) =>
        ["pending", "preparing", "delivering"].includes(order.status)
      ).length,
      todayCount: today.length,
      todayRevenue: today
        .filter((order) => order.status !== "cancelled")
        .reduce((total, order) => total + Number(order.total), 0),
      lowStock: products.filter(
        (product) => product.stock > 0 && product.stock <= LOW_STOCK
      ).length,
      outOfStock: products.filter((product) => product.stock === 0).length,
    };
  }, [orders, products]);

  async function changeStatus(id: string, status: OrderStatus) {
    try {
      await updateOrderStatus(id, status);
      reload();
    } catch (cause) {
      notify("Could not update the order", {
        text: (cause as Error).message,
        tone: "error",
      });
    }
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="How the shop is doing right now"
      actions={
        <Button variant="secondary" size="sm" onClick={reload}>
          Refresh
        </Button>
      }
    >
      {source === "seed" && (
        <p className={styles.notice}>
          Showing seed data. Run <code>database/setup.sql</code> in Supabase to
          connect the live catalog and orders.
        </p>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className={styles.stats}>
        <StatsCard
          label="Open orders"
          value={stats.openOrders}
          hint="Not yet delivered"
        />
        <StatsCard
          label="Orders today"
          value={stats.todayCount}
          hint="Since midnight"
        />
        <StatsCard
          label="Revenue today"
          value={formatPrice(stats.todayRevenue)}
          hint="Excludes cancelled"
        />
        <StatsCard
          label="Low stock"
          value={stats.lowStock}
          hint={`${stats.outOfStock} out of stock`}
        />
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <p className={styles.panelTitle}>Latest orders</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/orders")}
          >
            View all
          </Button>
        </div>

        {loading ? (
          <Spinner center label="Loading orders" />
        ) : orders.length > 0 ? (
          <OrderTable
            orders={orders.slice(0, RECENT)}
            onStatusChange={changeStatus}
          />
        ) : (
          <EmptyState
            icon={<BagIcon size={22} />}
            title="No orders yet"
            description="Orders placed in the shop will appear here."
          />
        )}
      </div>
    </AdminLayout>
  );
}
