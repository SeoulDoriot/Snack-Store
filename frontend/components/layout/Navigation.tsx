// Primary customer navigation, shown directly under the store header.
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/useCart";
import styles from "./Navigation.module.css";

interface NavItem {
  href: string;
  label: string;
}

const ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Categories" },
  { href: "/cart", label: "Cart" },
  { href: "/account", label: "Account" },
  { href: "/settings", label: "Settings" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navigation() {
  const { pathname } = useRouter();
  const { count, ready } = useCart();

  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.list}>
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const showCount = item.href === "/cart" && ready && count > 0;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.link} ${active ? styles.linkActive : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {showCount && <span className={styles.count}>{count}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
