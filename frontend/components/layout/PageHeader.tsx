// Compact header for sub-pages: back action, title and optional right slot.
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeftIcon } from "../common/Icons";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Where the back chevron goes. Defaults to the store home. */
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  backHref = "/",
  backLabel = "Back to shop",
  action,
}: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={`appWidth ${styles.inner}`}>
        <Link href={backHref} className={styles.back} aria-label={backLabel}>
          <ChevronLeftIcon size={18} />
        </Link>

        <div className={styles.identity}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
}
