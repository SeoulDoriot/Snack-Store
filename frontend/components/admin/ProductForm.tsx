// Create or edit a product, shown inside a modal.
import { useEffect, useState } from "react";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";
import { CATEGORIES, type Category, type Product } from "@/data/products";
import styles from "@/styles/Admin.module.css";

const ONLY_CATEGORIES = CATEGORIES.filter(
  (category): category is Category => category !== "All"
);

const BLANK: Product = {
  id: "",
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: "Drinks",
  image: "🥤",
  promo: false,
  popular: false,
};

/** Turns "Iced Coffee" into "iced-coffee" for a new product's id. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface ProductFormProps {
  /** Null when creating a new product. */
  product: Product | null;
  error?: string;
  onChange: (draft: Product) => void;
}

export default function ProductForm({
  product,
  error,
  onChange,
}: ProductFormProps) {
  const [draft, setDraft] = useState<Product>(product ?? BLANK);
  const creating = product === null;

  useEffect(() => {
    setDraft(product ?? BLANK);
  }, [product]);

  function patch(next: Partial<Product>) {
    const merged = { ...draft, ...next };

    // Keep the id in step with the name until it is saved once.
    if (creating && next.name !== undefined) {
      merged.id = slugify(next.name);
    }

    setDraft(merged);
    onChange(merged);
  }

  return (
    <div className={styles.formFields}>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Input
        label="Name"
        value={draft.name}
        placeholder="Iced Coffee"
        onChange={(event) => patch({ name: event.target.value })}
      />

      <Input
        label="Description"
        value={draft.description}
        placeholder="Cold brew, 250ml"
        onChange={(event) => patch({ description: event.target.value })}
      />

      <div className={styles.formPair}>
        <Input
          label="Price (USD)"
          type="number"
          inputMode="decimal"
          step="0.05"
          min="0"
          value={String(draft.price)}
          onChange={(event) => patch({ price: Number(event.target.value) })}
        />
        <Input
          label="Stock"
          type="number"
          inputMode="numeric"
          min="0"
          value={String(draft.stock)}
          onChange={(event) => patch({ stock: Number(event.target.value) })}
        />
      </div>

      <div className={styles.formPair}>
        <div>
          <label className={styles.fieldLabel} htmlFor="product-category">
            Category
          </label>
          <select
            id="product-category"
            className={styles.select}
            value={draft.category}
            onChange={(event) =>
              patch({ category: event.target.value as Category })
            }
            style={{ width: "100%", height: 46 }}
          >
            {ONLY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Emoji"
          value={draft.image}
          maxLength={4}
          placeholder="🥤"
          onChange={(event) => patch({ image: event.target.value })}
        />
      </div>

      <Input
        label="Product id"
        value={draft.id}
        hint={
          creating
            ? "Generated from the name. Used in the product URL."
            : "Ids cannot be changed after a product is created."
        }
        disabled={!creating}
        onChange={(event) => patch({ id: slugify(event.target.value) })}
      />
    </div>
  );
}
