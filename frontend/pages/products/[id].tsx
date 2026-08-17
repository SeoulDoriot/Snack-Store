// Product details page.
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProductDetails from "@/components/product/ProductDetails";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";
import CartDrawer from "@/components/cart/CartDrawer";
import { SearchIcon } from "@/components/common/Icons";
import { useCart } from "@/hooks/useCart";
import { useCatalog } from "@/context/CatalogContext";
import { useNotify } from "@/context/NotificationContext";
import styles from "@/styles/Products.module.css";

export default function ProductDetailsPage() {
  const router = useRouter();
  const { notify } = useNotify();
  const { byId, loading } = useCatalog();
  const {
    lines,
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

  const id = typeof router.query.id === "string" ? router.query.id : "";
  const product = id ? byId.get(id) : undefined;

  function addToCart(productId: string) {
    const found = byId.get(productId);
    if (!found) return;

    add(productId);
    notify(`${found.name} added`, { text: "Open your bag to check out." });
  }

  return (
    <>
      <Head>
        <title>
          {product ? `${product.name} · Hak Shop` : "Product · Hak Shop"}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <PageHeader
          title={product?.name ?? "Product"}
          subtitle={product?.category}
          backHref="/products"
          backLabel="Back to categories"
        />

        <div className={`appWidth ${styles.page}`}>
          {loading || !router.isReady ? (
            <Spinner center label="Loading product" />
          ) : product ? (
            <ProductDetails
              product={product}
              favourite={ready && favourites.includes(product.id)}
              onToggleFavourite={toggleFavourite}
              onAdd={addToCart}
              onViewBag={openDrawer}
            />
          ) : (
            <EmptyState
              icon={<SearchIcon size={22} />}
              title="Product not found"
              description="It may have sold out or been removed from the shop."
              action={
                <Button onClick={() => router.push("/products")}>
                  Browse categories
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
