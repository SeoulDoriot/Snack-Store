// Store identity header with favourites and bag actions.
//
// Search used to live here as an icon that did nothing; it is now a real,
// always-visible field in the page content, which is easier to find.
import Button from "../common/Button";
import { BagIcon, HeartIcon } from "../common/Icons";
import styles from "./Header.module.css";

interface HeaderProps {
  name: string;
  meta: string;
  favouriteCount?: number;
  cartCount?: number;
  onFavourites?: () => void;
  onCart?: () => void;
}

export default function Header({
  name,
  meta,
  favouriteCount = 0,
  cartCount = 0,
  onFavourites,
  onCart,
}: HeaderProps) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.mark}>H</div>
        <div className={styles.identity}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.meta}>
            <span className={styles.status} aria-hidden />
            {meta}
          </p>
        </div>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onFavourites}
            aria-label={`Favourites (${favouriteCount})`}
          >
            <HeartIcon size={20} filled={favouriteCount > 0} />
          </Button>
          <span className={styles.cartSlot}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCart}
              aria-label={`Open bag (${cartCount} item${cartCount === 1 ? "" : "s"})`}
            >
              <BagIcon size={20} />
            </Button>
            {cartCount > 0 && (
              <span key={cartCount} className={styles.badge}>
                {cartCount}
              </span>
            )}
          </span>
        </div>
      </div>
      <div className={styles.divider} />
    </>
  );
}
