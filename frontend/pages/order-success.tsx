// Order confirmation, rendered from the receipt saved at checkout.
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/common/Button";
import Skeleton from "@/components/common/Skeleton";
import { CheckIcon } from "@/components/common/Icons";
import { readLastOrder, STATUS_LABELS, type PlacedOrder } from "@/data/orders";
import { formatPrice } from "@/utils/currency";
import styles from "@/styles/Checkout.module.css";

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash on delivery",
  aba: "ABA Pay",
  wing: "Wing",
};

export default function OrderSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  // localStorage is client-only, so the receipt is read after mount.
  useEffect(() => {
    setOrder(readLastOrder());
    setLoaded(true);
  }, []);

  const itemCount = order?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <>
      <Head>
        <title>Order confirmed · Hak Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <PageHeader title="Order confirmed" subtitle="Thanks for your order" />

        <div className={`appWidth ${styles.done}`}>
          <span className={styles.doneMark}>
            <CheckIcon size={30} />
          </span>

          <h2 className={styles.doneTitle}>Your order has been sent to the seller.</h2>
          <p className={styles.doneText}>
            {order
              ? `We'll bring it to ${order.customer.dorm}, room ${order.customer.room} in about 20 minutes.`
              : "It should arrive within about 20 minutes."}
          </p>

          <div className={styles.receipt}>
            {!loaded ? (
              <>
                <div className={styles.receiptRow}>
                  <Skeleton width={90} height={14} />
                  <Skeleton width={110} height={14} />
                </div>
                <div className={styles.receiptRow}>
                  <Skeleton width={70} height={14} />
                  <Skeleton width={60} height={14} />
                </div>
                <div className={styles.receiptRow}>
                  <Skeleton width={80} height={14} />
                  <Skeleton width={90} height={14} />
                </div>
              </>
            ) : order ? (
              <>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Order number</span>
                  <span className={styles.receiptValue}>{order.id}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Status</span>
                  <span className={styles.status}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <ul className={styles.receiptItems}>
                  {order.items.map((item) => (
                    <li key={item.id} className={styles.receiptItem}>
                      <span className={styles.receiptThumb} aria-hidden>
                        {item.image}
                      </span>
                      <span className={styles.receiptItemBody}>
                        <span className={styles.receiptItemName}>{item.name}</span>
                        <span className={styles.receiptItemQty}>
                          Qty {item.quantity}
                        </span>
                      </span>
                      <span className={styles.receiptValue}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Payment</span>
                  <span className={styles.receiptValue}>
                    {PAYMENT_LABELS[order.payment] ?? order.payment}
                  </span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>
                    Total · {itemCount} item{itemCount === 1 ? "" : "s"}
                  </span>
                  <span className={styles.receiptTotal}>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>
                  No recent order found on this device.
                </span>
              </div>
            )}
          </div>

          <div className={styles.doneActions}>
            <Button variant="secondary" onClick={() => router.push("/account")}>
              View orders
            </Button>
            <Button onClick={() => router.push("/")}>Keep shopping</Button>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
