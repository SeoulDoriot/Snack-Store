// Order placement and lookup.
//
// Orders go through the place_order() database function, which validates
// stock, prices the order from the products table and decrements stock in a
// single transaction. When the database is not set up yet the order is
// recorded locally so the checkout flow still completes end to end.
import { getSupabase, isMissingSchema } from "@/lib/supabase";
import type { CartLine } from "@/types";
import type {
  OrderStatus,
  OrderWithItems,
  PlaceOrderResult,
} from "@/types/database";
import { LAST_ORDER_KEY, type PlacedOrder } from "@/data/orders";
import type { CheckoutFields } from "@/utils/validation";
import { readableError, withTimeout } from "./api";

export interface PlaceOrderInput {
  customer: CheckoutFields;
  payment: string;
  lines: CartLine[];
}

export interface PlaceOrderOutcome {
  order: PlacedOrder;
  /** False when the order was only recorded on this device. */
  persisted: boolean;
}

function toPlacedOrder(
  input: PlaceOrderInput,
  result: PlaceOrderResult
): PlacedOrder {
  return {
    id: result.order_number,
    placedAt: new Date().toISOString(),
    status: result.status,
    customer: { ...input.customer },
    payment: input.payment,
    items: input.lines.map((line) => ({
      id: line.product.id,
      name: line.product.name,
      image: line.product.image,
      price: line.product.price,
      quantity: line.quantity,
    })),
    subtotal: Number(result.subtotal),
    delivery: Number(result.delivery),
    total: Number(result.total),
  };
}

function localOrder(input: PlaceOrderInput): PlacedOrder {
  const subtotal = input.lines.reduce(
    (total, line) => total + line.product.price * line.quantity,
    0
  );

  return toPlacedOrder(input, {
    id: "",
    order_number: `HS-${Date.now().toString(36).toUpperCase()}`,
    status: "pending",
    subtotal,
    delivery: 0,
    total: subtotal,
  });
}

export function rememberOrder(order: PlacedOrder): void {
  try {
    window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // Storage unavailable — the confirmation page falls back to a
    // generic message rather than failing the order.
  }
}

export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderOutcome> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await withTimeout(
        client.rpc("place_order", {
          p_customer: {
            name: input.customer.name,
            student_id: input.customer.studentId,
            batch: input.customer.batch,
            phone: input.customer.phone,
            dorm: input.customer.dorm,
            room: input.customer.room,
            note: input.customer.note,
          },
          p_items: input.lines.map((line) => ({
            product_id: line.product.id,
            quantity: line.quantity,
          })),
          p_payment: input.payment,
        })
      );

      if (error) throw error;

      const order = toPlacedOrder(input, data as PlaceOrderResult);
      rememberOrder(order);
      return { order, persisted: true };
    } catch (error) {
      // A missing function means the database is not set up yet; fall back.
      // Anything else (out of stock, bad input) is a real failure.
      if (!isMissingSchema(error)) {
        throw new Error(readableError(error));
      }
    }
  }

  const order = localOrder(input);
  rememberOrder(order);
  return { order, persisted: false };
}

/** Orders belonging to the signed-in user, newest first. */
export async function listMyOrders(): Promise<OrderWithItems[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data: session } = await client.auth.getUser();
  if (!session.user) return [];

  const { data, error } = await withTimeout(
    client
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
  );

  if (error) {
    if (isMissingSchema(error)) return [];
    throw new Error(readableError(error));
  }

  return (data ?? []) as OrderWithItems[];
}

/** Admin: every order, newest first. */
export async function listAllOrders(): Promise<OrderWithItems[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await withTimeout(
    client
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
  );

  if (error) {
    if (isMissingSchema(error)) return [];
    throw new Error(readableError(error));
  }

  return (data ?? []) as OrderWithItems[];
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  const client = getSupabase();
  if (!client) throw new Error("Supabase is not configured.");

  const { error } = await client
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(readableError(error));
}
