// Accessible modal: portalled, scroll-locked, focus-trapped, Escape to close.
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { CloseIcon } from "./Icons";
import styles from "./Common.module.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
}: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Portals need a DOM target, so nothing renders during SSR.
  useEffect(() => setMounted(true), []);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    const nodes = panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!nodes || nodes.length === 0) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "Tab") trapFocus(event);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    // Move focus into the dialog once it has painted.
    const focusTimer = window.setTimeout(() => {
      const target = panel.current?.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? panel.current)?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      restoreTo.current?.focus?.();
    };
  }, [open, onClose, trapFocus]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={styles.modalRoot}>
      <button
        type="button"
        className={styles.modalScrim}
        onClick={onClose}
        tabIndex={-1}
        aria-label="Close dialog"
      />

      <div
        ref={panel}
        className={styles.modalPanel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className={styles.modalHead}>
          <div className={styles.modalTitle}>
            {title}
            {description && (
              <p className={styles.modalDescription}>{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </Button>
        </div>

        {children}

        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
