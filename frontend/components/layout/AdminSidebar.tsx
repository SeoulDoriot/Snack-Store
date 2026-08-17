// Admin navigation rail. Becomes a scrollable top bar under 900px.
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../common/Button";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/styles/Admin.module.css";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/stock", label: "Stock" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function leave() {
    await signOut();
    router.push("/");
  }

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <span className={styles.mark}>H</span>
        <span>
          <span className={styles.brandName}>Hak Shop</span>
          <span className={styles.brandMeta}>Staff</span>
        </span>
      </Link>

      <nav className={styles.nav} aria-label="Admin">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? router.pathname === "/admin"
              : router.pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFoot}>
        {user?.email && <p className={styles.who}>{user.email}</p>}
        <Button variant="secondary" size="sm" block onClick={leave}>
          Sign out
        </Button>
      </div>
    </aside>
  );
}
