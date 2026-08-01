// Category chips with a sliding active-pill indicator.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Product.module.css";

interface ProductFiltersProps<T extends string> {
  categories: readonly T[];
  active: T;
  onChange: (category: T) => void;
}

interface PillRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function ProductFilters<T extends string>({
  categories,
  active,
  onChange,
}: ProductFiltersProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<PillRect | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLElement>('[data-active="true"]');
    if (!list || !chip) return;

    setPill({
      left: chip.offsetLeft,
      top: chip.offsetTop,
      width: chip.offsetWidth,
      height: chip.offsetHeight,
    });
  }, []);

  useLayoutEffect(measure, [measure, active, categories]);

  useEffect(() => {
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div className={styles.filters} ref={listRef} role="tablist">
      <span
        aria-hidden
        className={styles.pill}
        style={
          pill
            ? {
                transform: `translate3d(${pill.left}px, ${pill.top}px, 0)`,
                width: pill.width,
                height: pill.height,
              }
            : undefined
        }
        data-ready={pill ? "true" : "false"}
      />

      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            data-active={isActive}
            aria-selected={isActive}
            className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
