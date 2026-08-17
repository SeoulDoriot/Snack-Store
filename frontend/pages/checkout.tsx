// Checkout: delivery details, payment choice and order placement.
//
// Orders go through the place_order() database function, which prices the
// order from the products table and decrements stock atomically. If the
// database is not set up yet the order is recorded on the device instead and
// the shopper is told so.
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
import { placeOrder } from "@/services/order.service";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/styles/Checkout.module.css";

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
  const { profile } = useAuth();
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

  // Prefill from the signed-in profile, without clobbering typing in progress.
  useEffect(() => {
    if (!profile) return;

    setFields((current) => ({
      ...current,
      name: current.name || profile.name,
      studentId: current.studentId || profile.student_id,
      batch: current.batch || profile.batch,
      phone: current.phone || profile.phone,
      dorm: current.dorm || profile.dorm || "Dorm B",
      room: current.room || profile.room,
    }));
  }, [profile]);

  function change(field: keyof CheckoutFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  async function submitOrder() {
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

    try {
      const { persisted } = await placeOrder({
        customer: fields,
        payment,
        lines,
      });

      clear();
      router.push("/order-success");

      if (!persisted) {
        notify("Saved on this device", {
          text: "The database is not set up yet, so the order was not sent.",
        });
      }
    } catch (error) {
      // Out of stock, bad input, or the network — keep the bag intact so the
      // student can retry without re-adding everything.
      notify("Could not send your order", {
        text: (error as Error).message,
        tone: "error",
      });
    } finally {
      setPlacing(false);
    }
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
                    onClick={submitOrder}
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
