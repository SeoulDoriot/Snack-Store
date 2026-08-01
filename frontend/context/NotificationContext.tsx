// Toast notifications, available anywhere via `useNotify()`.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ToastStack, { type Toast, type ToastTone } from "@/components/common/Toast";

/** How long a toast stays before it starts leaving. */
const VISIBLE_MS = 2800;
/** Must match the .toastLeaving animation in Common.module.css. */
const LEAVE_MS = 200;

interface NotifyOptions {
  text?: string;
  tone?: ToastTone;
}

export interface NotificationContextValue {
  notify: (title: string, options?: NotifyOptions) => void;
  dismiss: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Set<number>());

  const track = useCallback((run: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      run();
    }, delay);
    timers.current.add(id);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      setToasts((current) =>
        current.map((toast) =>
          toast.id === id ? { ...toast, leaving: true } : toast
        )
      );
      track(() => remove(id), LEAVE_MS);
    },
    [remove, track]
  );

  const notify = useCallback(
    (title: string, options: NotifyOptions = {}) => {
      const id = nextId.current++;
      const toast: Toast = {
        id,
        title,
        text: options.text,
        tone: options.tone ?? "success",
      };

      setToasts((current) => [...current, toast]);
      track(() => dismiss(id), VISIBLE_MS);
    },
    [dismiss, track]
  );

  // Clear any pending timers if the provider unmounts mid-animation.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
      pending.clear();
    };
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({ notify, dismiss }),
    [notify, dismiss]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}

export function useNotify(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotify must be used inside <NotificationProvider>.");
  }
  return context;
}

export default NotificationContext;
