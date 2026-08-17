// Row shapes mirroring database/migrations/*.sql.
import type { Category } from "@/data/products";

export type UserRole = "customer" | "admin";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "delivering"
  | "delivered"
  | "cancelled";

export interface ProfileRow {
  id: string;
  name: string;
  student_id: string;
  batch: string;
  phone: string;
  dorm: string;
  room: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  image: string;
  promo: boolean;
  popular: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderRow {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  student_id: string;
  batch: string;
  phone: string;
  dorm: string;
  room: string;
  note: string;
  payment: string;
  status: OrderStatus;
  subtotal: number;
  delivery: number;
  total: number;
  created_at: string;
  updated_at: string;
}

/** An order joined with its line items. */
export interface OrderWithItems extends OrderRow {
  order_items: OrderItemRow[];
}

/** Return value of the place_order() database function. */
export interface PlaceOrderResult {
  id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  delivery: number;
  total: number;
}
