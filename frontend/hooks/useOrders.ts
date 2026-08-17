// Loads orders for the account page (mine) or the admin pages (all).
import { useCallback, useEffect, useState } from "react";
import { listAllOrders, listMyOrders } from "@/services/order.service";
import type { OrderWithItems } from "@/types/database";

interface UseOrders {
  orders: OrderWithItems[];
  loading: boolean;
  error?: string;
  reload: () => void;
}

export function useOrders(scope: "mine" | "all" = "mine"): UseOrders {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(undefined);

    const load = scope === "all" ? listAllOrders : listMyOrders;

    load()
      .then((data) => {
        if (!active) return;
        setOrders(data);
      })
      .catch((cause: Error) => {
        if (!active) return;
        setOrders([]);
        setError(cause.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [scope, nonce]);

  return { orders, loading, error, reload };
}

export default useOrders;
