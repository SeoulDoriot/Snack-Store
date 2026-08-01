// Store home and featured products page.
import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import Header from "@/components/layout/Header";
import ProductFilters from "@/components/product/ProductFilters";
import ProductGrid from "@/components/product/ProductGrid";
import PromoCarousel from "@/components/product/PromoCarousel";
import SearchBar from "@/components/product/SearchBar";
import AutoHeight from "@/components/common/AutoHeight";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import CartDrawer from "@/components/cart/CartDrawer";
import { CameraIcon, HeartIcon, SearchIcon } from "@/components/common/Icons";
import { useCart } from "@/hooks/useCart";
import { useNotify } from "@/context/NotificationContext";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import styles from "@/styles/Home.module.css";

type Filter = (typeof CATEGORIES)[number];

/** Matches the .pageOut animation duration in Product.module.css. */
const EXIT_MS = 190;

const PROMOS = PRODUCTS.filter((product) => product.promo);

function matches(haystack: string, query: string): boolean {
  return haystack.toLowerCase().includes(query);
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
    toggleFavourite,
    drawerOpen,
    openDrawer,
    closeDrawer,
    ready,
  } = useCart();

  const [category, setCategory] = useState<Filter>("All");
  const [shown, setShown] = useState<Filter>("All");
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(1);
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      if (shown !== "All" && product.category !== shown) return false;
      if (savedOnly && !favourites.includes(product.id)) return false;
      if (!needle) return true;
      return (
        matches(product.name, needle) ||
        matches(product.description, needle) ||
        matches(product.category, needle)
      );
    });
  }, [shown, query, savedOnly, favourites]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function selectCategory(next: Filter) {
    if (next === category) return;

    setDirection(CATEGORIES.indexOf(next) > CATEGORIES.indexOf(category) ? 1 : -1);
    setCategory(next);
    setLeaving(true);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setShown(next);
      setLeaving(false);
    }, EXIT_MS);
  }

  function addToCart(id: string) {
    const product = PRODUCTS.find((item) => item.id === id);
    if (!product) return;

    add(id);
    notify(`${product.name} added`, { text: "Open your bag to check out." });
  }

  function resetFilters() {
    setQuery("");
    setSavedOnly(false);
    selectCategory("All");
  }

  function goToCheckout() {
    closeDrawer();
    router.push("/checkout");
  }

  const searching = query.trim().length > 0;
  const showPromos = !searching && !savedOnly && shown === "All";

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
          onFavourites={() => setSavedOnly((current) => !current)}
          onCart={openDrawer}
        />

        <div className={styles.content}>
          <section className={styles.hero}>
            <span className={styles.badge}>
              <CameraIcon size={14} />
              Scanned the QR? You&apos;re in.
            </span>
            <h2 className={styles.headline}>
              Snacks &amp; drinks, delivered to your dorm.
            </h2>
            <p className={styles.subhead}>
              Order before 9PM · usually delivered within 20 minutes.
            </p>
          </section>

          <div className={styles.toolbar}>
            <div className={styles.searchSlot}>
              <SearchBar value={query} onChange={setQuery} />
            </div>
            <ProductFilters
              categories={CATEGORIES}
              active={category}
              onChange={selectCategory}
            />
          </div>

          {showPromos && <PromoCarousel products={PROMOS} onAdd={addToCart} />}

          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              {savedOnly ? "Saved items" : searching ? "Results" : "Available now"}
            </h2>
            <span className={styles.sectionCount}>
              {visible.length} item{visible.length === 1 ? "" : "s"}
            </span>
          </div>

          <AutoHeight>
            {visible.length > 0 ? (
              <ProductGrid
                key={`${shown}-${savedOnly}`}
                products={visible}
                favourites={ready ? favourites : []}
                onToggleFavourite={toggleFavourite}
                onAdd={addToCart}
                direction={direction}
                leaving={leaving}
              />
            ) : (
              <EmptyState
                icon={savedOnly ? <HeartIcon size={22} /> : <SearchIcon size={22} />}
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
          </AutoHeight>
        </div>
      </PageLayout>

      <CartDrawer
        open={drawerOpen}
        lines={lines}
        subtotal={subtotal}
        onClose={closeDrawer}
        onQuantityChange={setQuantity}
        onCheckout={goToCheckout}
      />
    </>
  );
}
