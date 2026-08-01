// Public entry point for bag and wishlist state.
import { useCartContext, type CartContextValue } from "@/context/CartContext";

export type { CartContextValue };

export function useCart(): CartContextValue {
  return useCartContext();
}

export default useCart;
