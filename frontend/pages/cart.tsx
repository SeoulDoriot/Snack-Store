// Full bag page: review lines, change quantities, go to checkout.
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import CartSummary from "@/components/cart/CartSummary";
import QuantitySelector from "@/components/product/QuantitySelector";
import { BagIcon, TrashIcon } from "@/components/common/Icons";
import { useCart } from "@/hooks/useCart";
import { useNotify } from "@/context/NotificationContext";
import { formatPrice } from "@/utils/currency";
import styles from "@/components/cart/Cart.module.css";

export default function CartPage() {
  const router = useRouter();
  const { notify } = useNotify();
  const { lines, count, subtotal, setQuantity, remove, ready } = useCart();

  function removeLine(id: string, name: string) {
    remove(id);
    notify(`${name} removed`, { text: "Your bag has been updated." });
  }

  return (
    <>
      <Head>
        <title>Your bag · Hak Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <PageHeader
          title="Your bag"
          subtitle={
            !ready
              ? "Loading…"
              : count === 0
                ? "Nothing added yet"
                : `${count} item${count === 1 ? "" : "s"}`
          }
        />

        <div className={`appWidth ${styles.page}`}>
          {!ready ? (
            <ul className={styles.pageLines} aria-label="Loading your bag">
              {[0, 1, 2].map((index) => (
                <li key={index} className={styles.skeletonLine}>
                  <Skeleton width={60} height={60} radius="var(--r-md)" />
                  <span className={styles.skeletonBody}>
                    <Skeleton width="45%" height={14} />
                    <Skeleton width="30%" height={12} />
                  </span>
                  <Skeleton width={54} height={16} />
                </li>
              ))}
            </ul>
          ) : lines.length > 0 ? (
            <div className={styles.layout}>
              <ul className={styles.pageLines}>
                {lines.map((line) => (
                  <li key={line.product.id} className={styles.pageLine}>
                    <div
                      className={styles.lineThumb}
                      role="img"
                      aria-label={line.product.name}
                    >
                      {line.product.image}
                    </div>

                    <div className={styles.lineBody}>
                      <p className={styles.lineName}>{line.product.name}</p>
                      <p className={styles.lineMeta}>
                        {formatPrice(line.product.price)} each
                      </p>
                      <QuantitySelector
                        value={line.quantity}
                        max={line.product.stock}
                        label={line.product.name}
                        onChange={(next) => setQuantity(line.product.id, next)}
                      />
                    </div>

                    <span className={styles.lineTotal}>
                      {formatPrice(line.product.price * line.quantity)}
                    </span>

                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => removeLine(line.product.id, line.product.name)}
                      aria-label={`Remove ${line.product.name}`}
                    >
                      <TrashIcon size={17} />
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.aside}>
                <p className={styles.asideTitle}>Order summary</p>
                <CartSummary
                  subtotal={subtotal}
                  delivery={0}
                  onCheckout={() => router.push("/checkout")}
                />
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<BagIcon size={24} />}
              title="Your bag is empty"
              description="Add a snack or a drink and it will show up here."
              action={
                <Button variant="secondary" onClick={() => router.push("/")}>
                  Browse snacks
                </Button>
              }
            />
          )}
        </div>
      </PageLayout>
    </>
  );
}
