// Bag and wishlist state, shared by every page and persisted locally.
//
// Mock-data only: quantities are clamped against the stock numbers in
// `data/products.ts`. No network calls happen here.
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS } from "@/data/products";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { CartItems, CartLine, Product } from "@/types";

const CART_KEY = "hak-shop.cart";
const FAVOURITES_KEY = "hak-shop.favourites";

const BY_ID = new Map<string, Product>(
  PRODUCTS.map((product) => [product.id, product])
);

export interface CartContextValue {
  /** Quantity keyed by product id. */
  items: CartItems;
  /** Cart contents resolved to products, in catalog order. */
  lines: CartLine[];
  /** Total number of units in the bag. */
  count: number;
  subtotal: number;

  favourites: string[];
  favouriteProducts: Product[];
  isFavourite: (id: string) => boolean;

  add: (id: string, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggleFavourite: (id: string) => void;

  /** Shared open/closed state for the slide-in bag drawer. */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  /** False until localStorage has been read — use it to gate loading states. */
  ready: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_ITEMS: CartItems = {};
const EMPTY_FAVOURITES: string[] = [];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems, itemsReady] = useLocalStorage<CartItems>(
    CART_KEY,
    EMPTY_ITEMS
  );
  const [favourites, setFavourites, favouritesReady] = useLocalStorage<string[]>(
    FAVOURITES_KEY,
    EMPTY_FAVOURITES
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      const product = BY_ID.get(id);
      if (!product) return;

      setItems((current) => {
        const next = { ...current };
        if (quantity <= 0) delete next[id];
        else next[id] = Math.min(quantity, product.stock);
        return next;
      });
    },
    [setItems]
  );

  const add = useCallback(
    (id: string, quantity = 1) => {
      const product = BY_ID.get(id);
      if (!product) return;

      setItems((current) => ({
        ...current,
        [id]: Math.min((current[id] ?? 0) + quantity, product.stock),
      }));
    },
    [setItems]
  );

  const remove = useCallback(
    (id: string) => {
      setItems((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    },
    [setItems]
  );

  const clear = useCallback(() => setItems({}), [setItems]);

  const toggleFavourite = useCallback(
    (id: string) => {
      if (!BY_ID.has(id)) return;

      setFavourites((current) =>
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id]
      );
    },
    [setFavourites]
  );

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Built from PRODUCTS rather than Object.keys(items) so the bag always lists
  // in catalog order, and so ids left over from an older catalog are ignored.
  const lines = useMemo<CartLine[]>(
    () =>
      PRODUCTS.filter((product) => (items[product.id] ?? 0) > 0).map(
        (product) => ({ product, quantity: items[product.id] })
      ),
    [items]
  );

  const favouriteProducts = useMemo(
    () => PRODUCTS.filter((product) => favourites.includes(product.id)),
    [favourites]
  );

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = lines.reduce(
      (total, line) => total + line.product.price * line.quantity,
      0
    );

    return {
      items,
      lines,
      count,
      subtotal,
      favourites,
      favouriteProducts,
      isFavourite: (id: string) => favourites.includes(id),
      add,
      setQuantity,
      remove,
      clear,
      toggleFavourite,
      drawerOpen,
      openDrawer,
      closeDrawer,
      ready: itemsReady && favouritesReady,
    };
  }, [
    items,
    lines,
    favourites,
    favouriteProducts,
    add,
    setQuantity,
    remove,
    clear,
    toggleFavourite,
    drawerOpen,
    openDrawer,
    closeDrawer,
    itemsReady,
    favouritesReady,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used inside <CartProvider>.");
  }
  return context;
}

export default CartContext;
