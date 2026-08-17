// Admin settings: store details and the live connection status.
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { isSupabaseConfigured } from "@/lib/supabase";
import styles from "@/styles/Admin.module.css";

const STORE = [
  { label: "Store name", value: "Hak Shop" },
  { label: "Location", value: "Dorm B, near campus" },
  { label: "Opening hours", value: "8AM – 9PM daily" },
  { label: "Last order", value: "9PM" },
  { label: "Delivery", value: "Free, usually within 20 minutes" },
];

export default function AdminSettingsPage() {
  const { user, profile } = useAuth();
  const { source, reload } = useProducts(true);

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "Not set";
  const connected = isSupabaseConfigured && source === "supabase";

  return (
    <AdminLayout
      title="Settings"
      subtitle="Store details and connection"
      actions={
        <Button variant="secondary" size="sm" onClick={reload}>
          Re-check
        </Button>
      }
    >
      <div className={styles.settingsGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <p className={styles.panelTitle}>Store</p>
          </div>
          {STORE.map((row) => (
            <div key={row.label} className={styles.settingRow}>
              <div>
                <p className={styles.settingLabel}>{row.label}</p>
              </div>
              <p className={styles.settingValue}>{row.value}</p>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <p className={styles.panelTitle}>Connection</p>
          </div>

          <div className={styles.settingRow}>
            <div>
              <p className={styles.settingLabel}>Database</p>
              <p className={styles.settingHint}>
                {connected
                  ? "Reading live products and orders"
                  : "Falling back to seed data"}
              </p>
            </div>
            <span
              className={styles.status}
              data-status={connected ? "delivered" : "pending"}
            >
              {connected ? "Connected" : "Not set up"}
            </span>
          </div>

          <div className={styles.settingRow}>
            <div>
              <p className={styles.settingLabel}>Project URL</p>
            </div>
            <p className={styles.settingValue}>{projectUrl}</p>
          </div>

          <div className={styles.settingRow}>
            <div>
              <p className={styles.settingLabel}>Signed in as</p>
              <p className={styles.settingHint}>Role: {profile?.role ?? "unknown"}</p>
            </div>
            <p className={styles.settingValue}>{user?.email ?? "—"}</p>
          </div>
        </div>
      </div>

      {!connected && (
        <p className={styles.notice} style={{ marginTop: "var(--s-6)" }}>
          Run <code>database/setup.sql</code> in the Supabase SQL Editor to
          create the tables, then use <code>database/seeds/001_admin_user.sql</code>{" "}
          to give an account admin access.
        </p>
      )}
    </AdminLayout>
  );
}
