// Full-width app surface for the store pages.
import type { ReactNode } from "react";
import Footer from "./Footer";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
