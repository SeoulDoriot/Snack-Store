// Categories: browse the catalog one category at a time.
import { useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import Header from "@/components/layout/Header";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import CartDrawer from "@/components/cart/CartDrawer";
import { SearchIcon } from "@/components/common/Icons";
import { useCart } from "@/hooks/useCart";
import { useCatalog } from "@/context/CatalogContext";
import { useNotify } from "@/context/NotificationContext";
import { CATEGORIES, type Category } from "@/data/products";
import styles from "@/styles/Products.module.css";

/** One representative emoji per category, for the tiles. */
const TILE_ART: Record<Category, string> = {
  Drinks: "🥤",
  Noodles: "🍜",
  Chips: "🍟",
  Biscuits: "🍪",
  Sweets: "🍫",
};

const ONLY_CATEGORIES = CATEGORIES.filter(
  (category): category is Category => category !== "All"
);

export default function ProductsPage() {
  const router = useRouter();
  const { notify } = useNotify();
  const { products, byId } = useCatalog();
  const {
    lines,
    count,
    subtotal,
    favourites,
    add,
    setQuantity,
    remove,
    toggleFavourite,
    drawerOpen,
    openDrawer,
    closeDrawer,
    ready,
  } = useCart();

  const [active, setActive] = useState<Category | null>(null);
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map = new Map<Category, number>();
    for (const product of products) {
      map.set(product.category, (map.get(product.category) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      if (active && product.category !== active) return false;
      if (!needle) return true;
      return (
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle)
      );
    });
  }, [products, active, query]);

  function addToCart(id: string) {
    const product = byId.get(id);
    if (!product) return;

    add(id);
    notify(`${product.name} added`, { text: "Open your bag to check out." });
  }

  const searching = query.trim().length > 0;

  return (
    <>
      <Head>
        <title>Categories · Hak Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <Header
          name="Hak Shop"
          meta="Open now · Dorm B, near campus"
          favouriteCount={ready ? favourites.length : 0}
          cartCount={ready ? count : 0}
          searchValue={query}
          onSearchChange={setQuery}
          onCart={openDrawer}
        />

        <div className={`appWidth ${styles.page}`}>
          {!searching && (
            <div className={styles.tiles}>
              {ONLY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`${styles.tile} ${
                    active === category ? styles.tileActive : ""
                  }`}
                  onClick={() =>
                    setActive((current) =>
                      current === category ? null : category
                    )
                  }
                  aria-pressed={active === category}
                >
                  <span className={styles.tileArt} aria-hidden>
                    {TILE_ART[category]}
                  </span>
                  <span className={styles.tileBody}>
                    <span className={styles.tileName}>{category}</span>
                    <span className={styles.tileCount}>
                      {counts.get(category) ?? 0} item
                      {(counts.get(category) ?? 0) === 1 ? "" : "s"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              {searching ? "Search results" : (active ?? "All products")}
            </h2>
            <span className={styles.sectionCount}>
              {visible.length} item{visible.length === 1 ? "" : "s"}
            </span>
          </div>

          {visible.length > 0 ? (
            <ProductGrid
              key={`${active ?? "all"}-${searching}`}
              products={visible}
              favourites={ready ? favourites : []}
              onToggleFavourite={toggleFavourite}
              onAdd={addToCart}
            />
          ) : (
            <EmptyState
              icon={<SearchIcon size={22} />}
              title="Nothing here"
              description="Try a different category or clear your search."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setActive(null);
                    setQuery("");
                  }}
                >
                  Show everything
                </Button>
              }
            />
          )}
        </div>
      </PageLayout>

      <CartDrawer
        open={drawerOpen}
        lines={lines}
        subtotal={subtotal}
        onClose={closeDrawer}
        onQuantityChange={setQuantity}
        onRemove={remove}
        onCheckout={() => {
          closeDrawer();
          router.push("/checkout");
        }}
      />
    </>
  );
}
