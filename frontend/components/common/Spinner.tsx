// Loading spinner.
import styles from "./Common.module.css";

interface SpinnerProps {
  size?: number;
  /** Wraps the spinner in a centred block with generous padding. */
  center?: boolean;
  label?: string;
}

export default function Spinner({
  size = 20,
  center = false,
  label = "Loading",
}: SpinnerProps) {
  const spinner = (
    <span
      className={styles.spinner}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    />
  );

  return center ? <div className={styles.spinnerCenter}>{spinner}</div> : spinner;
}
