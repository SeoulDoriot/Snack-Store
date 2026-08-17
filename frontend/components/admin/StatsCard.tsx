// Single figure on the admin dashboard.
import styles from "@/styles/Admin.module.css";

interface StatsCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatsCard({ label, value, hint }: StatsCardProps) {
  return (
    <div className={styles.stat}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      {hint && <p className={styles.statHint}>{hint}</p>}
    </div>
  );
}
