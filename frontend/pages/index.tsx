// Store home: featured posters, category filter and the product sections.
import { useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import Header from "@/components/layout/Header";
import ProductFilters from "@/components/product/ProductFilters";
import ProductGrid from "@/components/product/ProductGrid";
import FeaturedBanner from "@/components/product/FeaturedBanner";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import CartDrawer from "@/components/cart/CartDrawer";
import { CameraIcon, HeartIcon, SearchIcon } from "@/components/common/Icons";
import { useCart } from "@/hooks/useCart";
import { useNotify } from "@/context/NotificationContext";
import { formatPrice } from "@/utils/currency";
import {
  CATEGORIES,
  FEATURES,
  PRODUCTS,
  SECTIONS,
  type Category,
} from "@/data/products";
import styles from "@/styles/Home.module.css";

type Filter = (typeof CATEGORIES)[number];

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle);
}

export default function HomePage() {
  const router = useRouter();
  const { notify } = useNotify();
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

  const [category, setCategory] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);

  /** Everything matching the current search, category and wishlist filter. */
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      if (category !== "All" && product.category !== category) return false;
      if (savedOnly && !favourites.includes(product.id)) return false;
      if (!needle) return true;
      return (
        matches(product.name, needle) ||
        matches(product.description, needle) ||
        matches(product.category, needle)
      );
    });
  }, [category, query, savedOnly, favourites]);

  const searching = query.trim().length > 0;
  const browsing = !searching && !savedOnly && category === "All";

  // Sections are the default view; any active filter collapses to one grid.
  const sections = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        items: PRODUCTS.filter(section.match),
      })).filter((section) => section.items.length > 0),
    []
  );

  function addToCart(id: string) {
    const product = PRODUCTS.find((item) => item.id === id);
    if (!product) return;

    add(id);
    notify(`${product.name} added`, { text: "Open your bag to check out." });
  }

  function selectFeature(target: "All" | Category) {
    setCategory(target);
    setQuery("");
    setSavedOnly(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetFilters() {
    setQuery("");
    setSavedOnly(false);
    setCategory("All");
  }

  const showBagBar = ready && count > 0;

  return (
    <>
      <Head>
        <title>Hak Shop · Snacks &amp; drinks delivered to your dorm</title>
        <meta
          name="description"
          content="Order snacks and drinks to your dorm before 9PM, usually delivered within 20 minutes."
        />
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
          onFavourites={() => setSavedOnly((current) => !current)}
          onCart={openDrawer}
        />

        <div
          className={`appWidth ${styles.content} ${
            showBagBar ? styles.contentWithBar : ""
          }`}
        >
          <section className={styles.hero}>
            <span className={styles.badge}>
              <CameraIcon size={14} />
              Scanned the QR? You&apos;re in.
            </span>
            <h1 className={styles.headline}>
              Snacks &amp; drinks, delivered to your dorm.
            </h1>
            <p className={styles.subhead}>
              Order before 9PM · usually delivered within 20 minutes.
            </p>
          </section>

          <div className={styles.filters}>
            <ProductFilters
              categories={CATEGORIES}
              active={category}
              onChange={setCategory}
            />
          </div>

          {browsing && (
            <div className={styles.featuredSlot}>
              <FeaturedBanner features={FEATURES} onSelect={selectFeature} />
            </div>
          )}

          {browsing ? (
            sections.map((section) => (
              <section key={section.id} className={styles.section}>
                <div className={styles.sectionHead}>
                  <div>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <p className={styles.sectionSubtitle}>{section.subtitle}</p>
                  </div>
                  <span className={styles.sectionCount}>
                    {section.items.length} item
                    {section.items.length === 1 ? "" : "s"}
                  </span>
                </div>

                <ProductGrid
                  products={section.items}
                  favourites={ready ? favourites : []}
                  onToggleFavourite={toggleFavourite}
                  onAdd={addToCart}
                />
              </section>
            ))
          ) : (
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <div>
                  <h2 className={styles.sectionTitle}>
                    {savedOnly
                      ? "Saved items"
                      : searching
                        ? "Search results"
                        : category}
                  </h2>
                </div>
                <span className={styles.sectionCount}>
                  {visible.length} item{visible.length === 1 ? "" : "s"}
                </span>
              </div>

              {visible.length > 0 ? (
                <ProductGrid
                  key={`${category}-${savedOnly}-${searching}`}
                  products={visible}
                  favourites={ready ? favourites : []}
                  onToggleFavourite={toggleFavourite}
                  onAdd={addToCart}
                />
              ) : (
                <EmptyState
                  icon={
                    savedOnly ? <HeartIcon size={22} /> : <SearchIcon size={22} />
                  }
                  title={
                    savedOnly
                      ? "Nothing saved yet"
                      : searching
                        ? `No matches for “${query.trim()}”`
                        : "Nothing in this category"
                  }
                  description={
                    savedOnly
                      ? "Tap the heart on any product to save it for later."
                      : "Try another category, or clear your filters to see everything."
                  }
                  action={
                    <Button variant="secondary" size="sm" onClick={resetFilters}>
                      Show all products
                    </Button>
                  }
                />
              )}
            </section>
          )}
        </div>
      </PageLayout>

      {showBagBar && (
        <div className={styles.bagBar}>
          <span className={styles.bagBarBody}>
            <span className={styles.bagBarCount}>
              {count} item{count === 1 ? "" : "s"} in bag
            </span>
            <span className={styles.bagBarTotal}>{formatPrice(subtotal)}</span>
          </span>
          <Button size="sm" onClick={openDrawer}>
            View bag
          </Button>
        </div>
      )}

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
