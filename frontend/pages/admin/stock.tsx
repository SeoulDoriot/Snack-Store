// Admin stock control: see what is running out and restock it.
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/common/Spinner";
import { SearchIcon } from "@/components/common/Icons";
import { useProducts } from "@/hooks/useProducts";
import { updateStock } from "@/services/product.service";
import { useNotify } from "@/context/NotificationContext";
import { useCatalog } from "@/context/CatalogContext";
import styles from "@/styles/Admin.module.css";

const LOW_STOCK = 12;

type Filter = "all" | "low" | "out";

export default function AdminStockPage() {
  const { notify } = useNotify();
  const { products, loading, error, source, reload } = useProducts(true);
  const { reload: reloadCatalog } = useCatalog();

  const [filter, setFilter] = useState<Filter>("all");
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string[]>([]);

  // Reset the editable values whenever fresh data arrives.
  useEffect(() => {
    setDrafts(
      Object.fromEntries(products.map((product) => [product.id, product.stock]))
    );
  }, [products]);

  const visible = useMemo(() => {
    if (filter === "low") {
      return products.filter(
        (product) => product.stock > 0 && product.stock <= LOW_STOCK
      );
    }
    if (filter === "out") return products.filter((product) => product.stock === 0);
    return products;
  }, [products, filter]);

  const counts = useMemo(
    () => ({
      low: products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).length,
      out: products.filter((p) => p.stock === 0).length,
      units: products.reduce((total, product) => total + product.stock, 0),
    }),
    [products]
  );

  async function save(id: string, name: string) {
    const next = drafts[id];
    if (next === undefined || Number.isNaN(next) || next < 0) return;

    setSaving((current) => [...current, id]);
    try {
      await updateStock(id, next);
      notify("Stock updated", { text: `${name} set to ${next}.` });
      reload();
      reloadCatalog();
    } catch (cause) {
      notify("Could not update stock", {
        text: (cause as Error).message,
        tone: "error",
      });
    } finally {
      setSaving((current) => current.filter((value) => value !== id));
    }
  }

  return (
    <AdminLayout
      title="Stock"
      subtitle="Keep the shelves accurate"
      actions={
        <Button variant="secondary" size="sm" onClick={reload}>
          Refresh
        </Button>
      }
    >
      {source === "seed" && (
        <p className={styles.notice}>
          Showing seed data — stock changes cannot be saved until{" "}
          <code>database/setup.sql</code> has been run in Supabase.
        </p>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className={styles.stats}>
        <StatsCard label="Units on shelf" value={counts.units} />
        <StatsCard
          label="Running low"
          value={counts.low}
          hint={`${LOW_STOCK} or fewer left`}
        />
        <StatsCard label="Out of stock" value={counts.out} hint="Hidden Add button" />
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <p className={styles.panelTitle}>{visible.length} products</p>
          <select
            className={styles.select}
            value={filter}
            aria-label="Filter stock"
            onChange={(event) => setFilter(event.target.value as Filter)}
          >
            <option value="all">Everything</option>
            <option value="low">Running low</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        {loading ? (
          <Spinner center label="Loading stock" />
        ) : visible.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th className={styles.numeric}>On shelf</th>
                  <th className={styles.numeric}>Set to</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((product) => {
                  const dirty = drafts[product.id] !== product.stock;

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className={styles.cellMain}>
                          <span className={styles.cellArt} aria-hidden>
                            {product.image}
                          </span>
                          <span className={styles.cellName}>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td
                        className={`${styles.numeric} ${
                          product.stock === 0
                            ? styles.stockOut
                            : product.stock <= LOW_STOCK
                              ? styles.stockLow
                              : ""
                        }`}
                      >
                        {product.stock}
                      </td>
                      <td className={styles.numeric}>
                        <input
                          type="number"
                          min={0}
                          className={styles.stockInput}
                          value={drafts[product.id] ?? product.stock}
                          aria-label={`Stock for ${product.name}`}
                          onChange={(event) =>
                            setDrafts((current) => ({
                              ...current,
                              [product.id]: Number(event.target.value),
                            }))
                          }
                        />
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <Button
                            size="xs"
                            disabled={!dirty || saving.includes(product.id)}
                            onClick={() => save(product.id, product.name)}
                          >
                            Save
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<SearchIcon size={22} />}
            title="Nothing to show"
            description="Every product has plenty of stock."
          />
        )}
      </div>
    </AdminLayout>
  );
}
