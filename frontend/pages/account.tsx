// Customer account: profile summary and order history from the database.
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/common/Spinner";
import { BagIcon } from "@/components/common/Icons";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { formatPrice } from "@/utils/currency";
import { STATUS_LABELS } from "@/data/orders";
import styles from "@/styles/Account.module.css";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AccountView() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const { orders, loading, error, reload } = useOrders("mine");

  return (
    <div className={`appWidth ${styles.page}`}>
      <div className={styles.summary}>
        <div>
          <p className={styles.summaryName}>
            {profile?.name || user?.email || "Your account"}
          </p>
          <p className={styles.summaryMeta}>{user?.email}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.push("/settings")}>
          Settings
        </Button>
      </div>

      <div className={styles.head}>
        <h2 className={styles.title}>Order history</h2>
        <Button variant="ghost" size="sm" onClick={reload}>
          Refresh
        </Button>
      </div>

      {error && <ErrorMessage className={styles.error}>{error}</ErrorMessage>}

      {loading ? (
        <Spinner center label="Loading your orders" />
      ) : orders.length > 0 ? (
        <ul className={styles.orders}>
          {orders.map((order) => (
            <li key={order.id} className={styles.order}>
              <div className={styles.orderHead}>
                <div>
                  <p className={styles.orderNumber}>{order.order_number}</p>
                  <p className={styles.orderDate}>{formatDate(order.created_at)}</p>
                </div>
                <span
                  className={styles.status}
                  data-status={order.status}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <ul className={styles.items}>
                {order.order_items.map((item) => (
                  <li key={item.id} className={styles.item}>
                    <span className={styles.itemArt} aria-hidden>
                      {item.image}
                    </span>
                    <span className={styles.itemBody}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQty}>Qty {item.quantity}</span>
                    </span>
                    <span className={styles.itemPrice}>
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={styles.orderFoot}>
                <span className={styles.orderTotalLabel}>Total</span>
                <span className={styles.orderTotal}>
                  {formatPrice(Number(order.total))}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<BagIcon size={22} />}
          title="No orders yet"
          description="Once you place an order it will show up here."
          action={<Button onClick={() => router.push("/")}>Start shopping</Button>}
        />
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <>
      <Head>
        <title>My orders · Hak Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <PageHeader title="My orders" subtitle="Your account and order history" />
        <ProtectedRoute>
          <AccountView />
        </ProtectedRoute>
      </PageLayout>
    </>
  );
}
