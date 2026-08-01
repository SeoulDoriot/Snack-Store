// Browser storage hook that stays safe to render on the server.
import { useCallback, useEffect, useRef, useState } from "react";

type SetValue<T> = (next: T | ((current: T) => T)) => void;

/**
 * Reads and writes a JSON value in localStorage.
 *
 * The first render always returns `initial` so the server-rendered markup and
 * the first client render match; the stored value is applied in an effect
 * straight after mount. `ready` is false until that read has happened, which
 * lets callers hold off on rendering counts that would otherwise flicker.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, SetValue<T>, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  // Kept in a ref so the read effect never re-runs when the caller passes a
  // fresh object/array literal as `initial` on every render.
  const fallback = useRef(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      setValue(raw === null ? fallback.current : (JSON.parse(raw) as T));
    } catch {
      // Private mode, quota, or corrupt JSON — fall back to the initial value.
      setValue(fallback.current);
    } finally {
      setReady(true);
    }
  }, [key]);

  useEffect(() => {
    if (!ready) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable — the in-memory value still works for this session.
    }
  }, [key, value, ready]);

  const update = useCallback<SetValue<T>>((next) => {
    setValue((current) =>
      typeof next === "function" ? (next as (c: T) => T)(current) : next
    );
  }, []);

  return [value, update, ready];
}

export default useLocalStorage;
