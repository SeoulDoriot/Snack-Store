// Delivery details and payment selection.
import Input from "../common/Input";
import PaymentMethod, { type PaymentId } from "./PaymentMethod";
import type { CheckoutErrors, CheckoutFields } from "@/utils/validation";
import styles from "@/styles/Checkout.module.css";

const DORMS = ["Dorm A", "Dorm B", "Dorm C", "Dorm D"];

interface CheckoutFormProps {
  fields: CheckoutFields;
  errors: CheckoutErrors;
  payment: PaymentId;
  onChange: (field: keyof CheckoutFields, value: string) => void;
  onPaymentChange: (value: PaymentId) => void;
}

export default function CheckoutForm({
  fields,
  errors,
  payment,
  onChange,
  onPaymentChange,
}: CheckoutFormProps) {
  return (
    <div>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Delivery details</h2>

        <div className={styles.panel}>
          <div className={styles.fields}>
            <Input
              label="Full name"
              value={fields.name}
              error={errors.name}
              autoComplete="name"
              placeholder="Sok Dara"
              onChange={(event) => onChange("name", event.target.value)}
            />

            <div className={styles.pair}>
              <Input
                label="Student ID"
                value={fields.studentId}
                error={errors.studentId}
                placeholder="KIT2024081"
                autoComplete="off"
                onChange={(event) => onChange("studentId", event.target.value)}
              />

              <Input
                label="Batch"
                value={fields.batch}
                error={errors.batch}
                placeholder="Batch 12"
                autoComplete="off"
                onChange={(event) => onChange("batch", event.target.value)}
              />
            </div>

            <Input
              label="Phone number"
              value={fields.phone}
              error={errors.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="012 345 678"
              hint="We only use this to reach you on delivery."
              onChange={(event) => onChange("phone", event.target.value)}
            />

            <div className={styles.pair}>
              <div className={styles.field}>
                <label className={styles.selectLabel} htmlFor="checkout-dorm">
                  Dorm
                </label>
                <select
                  id="checkout-dorm"
                  className={styles.select}
                  value={fields.dorm}
                  onChange={(event) => onChange("dorm", event.target.value)}
                >
                  {DORMS.map((dorm) => (
                    <option key={dorm} value={dorm}>
                      {dorm}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Room number"
                value={fields.room}
                error={errors.room}
                placeholder="304"
                inputMode="numeric"
                onChange={(event) => onChange("room", event.target.value)}
              />
            </div>

            <Input
              label="Delivery note (optional)"
              value={fields.note}
              placeholder="Leave at the door, call on arrival…"
              onChange={(event) => onChange("note", event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Payment</h2>
        <div className={styles.panel}>
          <PaymentMethod value={payment} onChange={onPaymentChange} />
        </div>
      </section>
    </div>
  );
}
