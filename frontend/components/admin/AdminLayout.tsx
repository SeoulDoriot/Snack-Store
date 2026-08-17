// Shared chrome for every admin page: auth gate, sidebar and page heading.
import Head from "next/head";
import type { ReactNode } from "react";
import AdminSidebar from "../layout/AdminSidebar";
import ProtectedRoute from "../auth/ProtectedRoute";
import styles from "@/styles/Admin.module.css";

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminLayout({
  title,
  subtitle,
  actions,
  children,
}: AdminLayoutProps) {
  return (
    <>
      <Head>
        <title>{title} · Hak Shop admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <ProtectedRoute adminOnly>
        <div className={styles.shell}>
          <AdminSidebar />

          <main className={styles.main}>
            <div className={styles.head}>
              <div>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
              </div>
              {actions && <div className={styles.actions}>{actions}</div>}
            </div>

            {children}
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
}
