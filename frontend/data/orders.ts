// Order shapes shared by the checkout and confirmation screens.
//
// The status values come from the database enum so the local receipt and a
// row in `public.orders` always describe the same set of states.
import type { OrderStatus } from "@/types/database";

export const LAST_ORDER_KEY = "hak-shop.lastOrder";

export type { OrderStatus };

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  studentId: string;
  batch: string;
  phone: string;
  dorm: string;
  room: string;
  note: string;
}

/** An order placed from the checkout page and kept in localStorage. */
export interface PlacedOrder {
  id: string;
  placedAt: string;
  status: OrderStatus;
  customer: OrderCustomer;
  payment: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  delivering: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** Statuses an admin can move an order to, in workflow order. */
export const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];

export function readLastOrder(): PlacedOrder | null {
  try {
    const raw = window.localStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}
