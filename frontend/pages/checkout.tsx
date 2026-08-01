// Checkout: delivery details, payment choice and order placement.
//
// Mock only — placing an order writes the receipt to localStorage and clears
// the bag. No request leaves the browser.
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/common/Spinner";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import type { PaymentId } from "@/components/checkout/PaymentMethod";
import { BagIcon } from "@/components/common/Icons";
import { useCart } from "@/hooks/useCart";
import { useNotify } from "@/context/NotificationContext";
import {
  hasErrors,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutFields,
} from "@/utils/validation";
import { LAST_ORDER_KEY, type PlacedOrder } from "@/data/orders";
import styles from "@/styles/Checkout.module.css";

/** Stand-in for the round trip a real API call would take. */
const PLACING_MS = 900;

const EMPTY_FIELDS: CheckoutFields = {
  name: "",
  studentId: "",
  batch: "",
  phone: "",
  dorm: "Dorm B",
  room: "",
  note: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { notify } = useNotify();
  const { lines, subtotal, clear, ready } = useCart();

  const [fields, setFields] = useState<CheckoutFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [payment, setPayment] = useState<PaymentId>("cash");
  const [placing, setPlacing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Re-validate as the shopper fixes fields, but only after a failed attempt.
  useEffect(() => {
    if (submitted) setErrors(validateCheckout(fields));
  }, [fields, submitted]);

  function change(field: keyof CheckoutFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  function placeOrder() {
    const found = validateCheckout(fields);
    setErrors(found);
    setSubmitted(true);

    if (hasErrors(found)) {
      notify("Check your details", {
        text: "Some fields still need attention.",
        tone: "error",
      });
      return;
    }

    setPlacing(true);

    window.setTimeout(() => {
      const order: PlacedOrder = {
        id: `HS-${Date.now().toString(36).toUpperCase()}`,
        placedAt: new Date().toISOString(),
        status: "pending",
        customer: { ...fields },
        payment,
        items: lines.map((line) => ({
          id: line.product.id,
          name: line.product.name,
          image: line.product.image,
          price: line.product.price,
          quantity: line.quantity,
        })),
        subtotal,
        delivery: 0,
        total: subtotal,
      };

      try {
        window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      } catch {
        // Storage unavailable — the confirmation page falls back to a
        // generic message rather than failing the order.
      }

      clear();
      setPlacing(false);
      router.push("/order-success");
    }, PLACING_MS);
  }

  // Wait for the stored bag to load before deciding the bag is empty.
  const bagEmpty = ready && lines.length === 0;

  return (
    <>
      <Head>
        <title>Checkout · Hak Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <PageHeader
          title="Checkout"
          subtitle="Delivery details and payment"
          backHref="/cart"
          backLabel="Back to bag"
        />

        <div className={`appWidth ${styles.page}`}>
          {bagEmpty ? (
            <EmptyState
              icon={<BagIcon size={24} />}
              title="Your bag is empty"
              description="Add something to your bag before checking out."
              action={
                <Button variant="secondary" onClick={() => router.push("/")}>
                  Browse snacks
                </Button>
              }
            />
          ) : (
            <div className={styles.layout}>
              <div>
                {submitted && hasErrors(errors) && (
                  <ErrorMessage className={styles.formError}>
                    Please fix the highlighted fields before placing your order.
                  </ErrorMessage>
                )}

                <CheckoutForm
                  fields={fields}
                  errors={errors}
                  payment={payment}
                  onChange={change}
                  onPaymentChange={setPayment}
                />
              </div>

              <OrderSummary
                lines={lines}
                subtotal={subtotal}
                delivery={0}
                note="You pay when the order arrives."
                action={
                  <Button
                    block
                    size="lg"
                    onClick={placeOrder}
                    disabled={placing || lines.length === 0}
                  >
                    {placing ? (
                      <Spinner size={18} label="Sending order" />
                    ) : (
                      "Send Order"
                    )}
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
