// Large featured posters. Visual-first by design: no price, no add action —
// clicking a poster filters the catalog to its category.
import type { Category, Feature } from "@/data/products";
import { ChevronRightIcon } from "../common/Icons";
import styles from "./Product.module.css";

interface FeaturedBannerProps {
  features: Feature[];
  onSelect: (target: "All" | Category) => void;
}

export default function FeaturedBanner({
  features,
  onSelect,
}: FeaturedBannerProps) {
  if (features.length === 0) return null;

  const [lead, ...rest] = features;

  return (
    <section className={styles.featured} aria-label="Featured">
      <button
        type="button"
        className={`${styles.poster} ${styles.posterLead}`}
        data-tone={lead.tone}
        onClick={() => onSelect(lead.target)}
      >
        <span className={styles.posterArt} aria-hidden>
          {lead.art}
        </span>
        <span className={styles.posterBody}>
          <span className={styles.posterEyebrow}>{lead.eyebrow}</span>
          <span className={styles.posterTitle}>{lead.title}</span>
          <span className={styles.posterText}>{lead.text}</span>
          <span className={styles.posterLink}>
            Shop {lead.target}
            <ChevronRightIcon size={16} />
          </span>
        </span>
      </button>

      <div className={styles.posterStack}>
        {rest.map((feature) => (
          <button
            key={feature.id}
            type="button"
            className={styles.poster}
            data-tone={feature.tone}
            onClick={() => onSelect(feature.target)}
          >
            <span className={styles.posterArt} aria-hidden>
              {feature.art}
            </span>
            <span className={styles.posterBody}>
              <span className={styles.posterEyebrow}>{feature.eyebrow}</span>
              <span className={styles.posterTitle}>{feature.title}</span>
              <span className={styles.posterLink}>
                Shop {feature.target}
                <ChevronRightIcon size={16} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
