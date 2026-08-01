// Toast list rendered by the notification provider.
import { AlertIcon, CheckIcon, CloseIcon } from "./Icons";
import styles from "./Common.module.css";

export type ToastTone = "success" | "error";

export interface Toast {
  id: number;
  title: string;
  text?: string;
  tone: ToastTone;
  leaving?: boolean;
}

interface ToastStackProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export default function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastLayer} role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${toast.leaving ? styles.toastLeaving : ""}`}
          role="status"
          aria-live="polite"
        >
          <span
            className={`${styles.toastIcon} ${
              toast.tone === "error" ? styles.toastIconError : ""
            }`}
          >
            {toast.tone === "error" ? <AlertIcon size={14} /> : <CheckIcon size={13} />}
          </span>

          <div className={styles.toastBody}>
            <p className={styles.toastTitle}>{toast.title}</p>
            {toast.text && <p className={styles.toastText}>{toast.text}</p>}
          </div>

          <button
            type="button"
            className={styles.toastClose}
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <CloseIcon size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
