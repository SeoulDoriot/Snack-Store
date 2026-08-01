// Visual-first promo posters. Deliberately unlike ProductCard: large artwork,
// minimal text, one action. Scroll-snaps horizontally on every breakpoint.
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/currency";
import Button from "../common/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "../common/Icons";
import styles from "./Product.module.css";

interface PromoCarouselProps {
  products: Product[];
  onAdd: (id: string) => void;
}

export default function PromoCarousel({ products, onAdd }: PromoCarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const node = track.current;
    if (!node) return;

    const max = node.scrollWidth - node.clientWidth;
    setAtStart(node.scrollLeft <= 1);
    setAtEnd(node.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    sync();
    const node = track.current;
    if (!node) return;

    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => observer.disconnect();
  }, [sync, products.length]);

  function scrollBy(direction: number) {
    const node = track.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  const showArrows = products.length > 1;

  return (
    <section className={styles.promoSection} aria-label="Offers">
      <div className={styles.promoHead}>
        <h2 className={styles.sectionTitle}>Offers</h2>
        {showArrows && (
          <div className={styles.promoNav}>
            <Button
              variant="secondary"
              size="iconSm"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Previous offers"
            >
              <ChevronLeftIcon size={18} />
            </Button>
            <Button
              variant="secondary"
              size="iconSm"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Next offers"
            >
              <ChevronRightIcon size={18} />
            </Button>
          </div>
        )}
      </div>

      <div className={styles.promoTrack} ref={track} onScroll={sync}>
        {products.map((product, index) => (
          <article
            key={product.id}
            className={styles.poster}
            data-tone={index % 3}
          >
            <div className={styles.posterArt} role="img" aria-label={product.name}>
              {product.image}
            </div>

            <div className={styles.posterBody}>
              <p className={styles.posterEyebrow}>Offer</p>
              <h3 className={styles.posterTitle}>{product.name}</h3>
              <p className={styles.posterText}>{product.description}</p>

              <div className={styles.posterFoot}>
                <span className={styles.posterPrice}>
                  {formatPrice(product.price)}
                </span>
                <Button
                  size="sm"
                  onClick={() => onAdd(product.id)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Sold out" : "Add to bag"}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
