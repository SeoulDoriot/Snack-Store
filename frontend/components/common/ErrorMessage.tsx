// Inline error feedback.
import { AlertIcon } from "./Icons";
import styles from "./Common.module.css";

interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export default function ErrorMessage({ children, className }: ErrorMessageProps) {
  return (
    <p className={[styles.error, className].filter(Boolean).join(" ")} role="alert">
      <span className={styles.errorIcon}>
        <AlertIcon />
      </span>
      <span>{children}</span>
    </p>
  );
}
