// Store identity header: search, favourites, bag and profile.
//
// Search is hidden behind an icon by default and expands in place when
// clicked, so it costs no space until it is wanted.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "../common/Button";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  SearchIcon,
  UserIcon,
} from "../common/Icons";
import styles from "./Header.module.css";

interface HeaderProps {
  name: string;
  meta: string;
  favouriteCount?: number;
  cartCount?: number;
  /** Omit the search affordance on pages with nothing to search. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFavourites?: () => void;
  onCart?: () => void;
}

export default function Header({
  name,
  meta,
  favouriteCount = 0,
  cartCount = 0,
  searchValue,
  onSearchChange,
  onFavourites,
  onCart,
}: HeaderProps) {
  const searchable = typeof onSearchChange === "function";
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  function closeSearch() {
    onSearchChange?.("");
    setOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={`appWidth ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Hak Shop home">
          <span className={styles.mark}>H</span>
          <span className={styles.identity}>
            <span className={styles.name}>{name}</span>
            <span className={styles.meta}>
              <span className={styles.status} aria-hidden />
              {meta}
            </span>
          </span>
        </Link>

        {searchable && (
          <div className={styles.search} data-open={open}>
            <span className={styles.searchIcon} aria-hidden>
              <SearchIcon size={18} />
            </span>
            <input
              ref={input}
              type="search"
              className={styles.searchInput}
              value={searchValue ?? ""}
              placeholder="Search snacks and drinks"
              aria-label="Search products"
              tabIndex={open ? 0 : -1}
              onChange={(event) => onSearchChange?.(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") closeSearch();
              }}
            />
            <button
              type="button"
              className={styles.searchClose}
              onClick={closeSearch}
              aria-label="Close search"
              tabIndex={open ? 0 : -1}
            >
              <CloseIcon size={16} />
            </button>
          </div>
        )}

        <div className={styles.actions}>
          {searchable && !open && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              aria-label="Search products"
              aria-expanded={open}
            >
              <SearchIcon size={20} />
            </Button>
          )}

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

          <Link
            href="/settings"
            className={styles.profile}
            aria-label="Profile and settings"
          >
            <UserIcon size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
