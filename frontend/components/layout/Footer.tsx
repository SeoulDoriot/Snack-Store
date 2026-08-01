// Store footer, rendered below the app card on every page.
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.brand}>Hak Shop · Dorm B, near campus</p>
      <p className={styles.meta}>
        Open daily 8AM – 9PM · usually delivered within 20 minutes
      </p>
    </footer>
  );
}
