// Admin product management: add, edit and retire products.
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductTable from "@/components/admin/ProductTable";
import ProductForm from "@/components/admin/ProductForm";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/common/Spinner";
import { SearchIcon } from "@/components/common/Icons";
import { useProducts } from "@/hooks/useProducts";
import { deactivateProduct, upsertProduct } from "@/services/product.service";
import { useNotify } from "@/context/NotificationContext";
import { useCatalog } from "@/context/CatalogContext";
import type { Product } from "@/types";
import styles from "@/styles/Admin.module.css";

export default function AdminProductsPage() {
  const { notify } = useNotify();
  const { products, loading, error, source, reload } = useProducts(true);
  const { reload: reloadCatalog } = useCatalog();

  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Product | null>(null);
  const [removing, setRemoving] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const open = creating || editing !== null;

  function startCreate() {
    setEditing(null);
    setDraft(null);
    setFormError(undefined);
    setCreating(true);
  }

  function startEdit(product: Product) {
    setCreating(false);
    setDraft(product);
    setFormError(undefined);
    setEditing(product);
  }

  function close() {
    setCreating(false);
    setEditing(null);
    setDraft(null);
    setFormError(undefined);
  }

  async function save() {
    if (!draft) return close();

    if (!draft.id || !draft.name.trim()) {
      setFormError("A name is required.");
      return;
    }

    setSaving(true);
    try {
      await upsertProduct(draft);
      notify("Product saved", { text: `${draft.name} is up to date.` });
      close();
      reload();
      reloadCatalog();
    } catch (cause) {
      setFormError((cause as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmRemove() {
    if (!removing) return;

    try {
      await deactivateProduct(removing.id);
      notify("Product removed", { text: `${removing.name} is hidden from the shop.` });
      setRemoving(null);
      reload();
      reloadCatalog();
    } catch (cause) {
      notify("Could not remove the product", {
        text: (cause as Error).message,
        tone: "error",
      });
    }
  }

  return (
    <AdminLayout
      title="Products"
      subtitle="What the shop sells"
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={reload}>
            Refresh
          </Button>
          <Button size="sm" onClick={startCreate}>
            Add product
          </Button>
        </>
      }
    >
      {source === "seed" && (
        <p className={styles.notice}>
          Showing seed data — changes cannot be saved until{" "}
          <code>database/setup.sql</code> has been run in Supabase.
        </p>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <p className={styles.panelTitle}>{products.length} products</p>
        </div>

        {loading ? (
          <Spinner center label="Loading products" />
        ) : products.length > 0 ? (
          <ProductTable
            products={products}
            onEdit={startEdit}
            onDeactivate={setRemoving}
          />
        ) : (
          <EmptyState
            icon={<SearchIcon size={22} />}
            title="No products yet"
            description="Add your first product to start selling."
            action={<Button onClick={startCreate}>Add product</Button>}
          />
        )}
      </div>

      <Modal
        open={open}
        title={creating ? "Add product" : "Edit product"}
        description={
          creating
            ? "It goes live in the shop as soon as you save."
            : editing?.name
        }
        onClose={close}
        footer={
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <Spinner size={18} label="Saving" /> : "Save product"}
            </Button>
          </>
        }
      >
        <ProductForm product={editing} error={formError} onChange={setDraft} />
      </Modal>

      <Modal
        open={removing !== null}
        title="Remove this product?"
        description={
          removing
            ? `${removing.name} will be hidden from the shop. Past orders keep their history.`
            : undefined
        }
        onClose={() => setRemoving(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemoving(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemove}>
              Remove
            </Button>
          </>
        }
      />
    </AdminLayout>
  );
}
