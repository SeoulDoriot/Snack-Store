// Always-visible catalog search. Filters the local mock catalog only.
import { CloseIcon, SearchIcon } from "../common/Icons";
import styles from "./Product.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search snacks and drinks",
}: SearchBarProps) {
  return (
    <div className={styles.search}>
      <span className={styles.searchIcon} aria-hidden>
        <SearchIcon size={18} />
      </span>

      <input
        type="search"
        className={styles.searchInput}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search products"
      />

      {value && (
        <button
          type="button"
          className={styles.searchClear}
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
}
