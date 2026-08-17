// Admin product list.
import Button from "../common/Button";
import { formatPrice } from "@/utils/currency";
import type { Product } from "@/types";
import styles from "@/styles/Admin.module.css";

const LOW_STOCK = 12;

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDeactivate: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDeactivate,
}: ProductTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th className={styles.numeric}>Price</th>
            <th className={styles.numeric}>Stock</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className={styles.cellMain}>
                  <span className={styles.cellArt} aria-hidden>
                    {product.image}
                  </span>
                  <span>
                    <span className={styles.cellName}>{product.name}</span>
                    <span className={styles.cellSub}>{product.description}</span>
                  </span>
                </div>
              </td>
              <td>{product.category}</td>
              <td className={styles.numeric}>{formatPrice(product.price)}</td>
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
              <td>
                <div className={styles.rowActions}>
                  <Button variant="secondary" size="xs" onClick={() => onEdit(product)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDeactivate(product)}
                  >
                    Remove
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
