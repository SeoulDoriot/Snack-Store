// Client-side validation helpers.

export interface CheckoutFields {
  name: string;
  studentId: string;
  batch: string;
  phone: string;
  dorm: string;
  room: string;
  note: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>;

/** Cambodian mobile numbers: 8–10 digits, optional +855 country code. */
const PHONE = /^(?:\+?855|0)?\d{8,10}$/;
/** Student IDs are alphanumeric, e.g. "KIT2024081". */
const STUDENT_ID = /^[A-Za-z0-9-]{4,20}$/;

export function validateCheckout(fields: CheckoutFields): CheckoutErrors {
  const errors: CheckoutErrors = {};

  const name = fields.name.trim();
  if (!name) errors.name = "Please enter your name.";
  else if (name.length < 2) errors.name = "That name looks too short.";

  const studentId = fields.studentId.trim();
  if (!studentId) errors.studentId = "Please enter your student ID.";
  else if (!STUDENT_ID.test(studentId))
    errors.studentId = "Use letters and numbers only.";

  if (!fields.batch.trim()) errors.batch = "Please enter your batch.";

  const phone = fields.phone.replace(/[\s-]/g, "");
  if (!phone) errors.phone = "We need a number to reach you on delivery.";
  else if (!PHONE.test(phone)) errors.phone = "Enter a valid phone number.";

  if (!fields.dorm.trim()) errors.dorm = "Choose a dorm.";
  if (!fields.room.trim()) errors.room = "Enter your room number.";

  return errors;
}

export function hasErrors(errors: CheckoutErrors): boolean {
  return Object.keys(errors).length > 0;
}
