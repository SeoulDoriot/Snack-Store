// Order shapes and mock order history for the prototype.

export const LAST_ORDER_KEY = "hak-shop.lastOrder";

export type OrderStatus = "pending" | "preparing" | "delivering" | "delivered";

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
};

export function readLastOrder(): PlacedOrder | null {
  try {
    const raw = window.localStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}
