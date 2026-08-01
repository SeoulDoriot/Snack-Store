// Wrapper that transitions its height when the content inside changes size.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./AutoHeight.module.css";

export default function AutoHeight({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  // Runs after every render, so any change to `children` is picked up.
  // Re-setting the same value is a no-op for React, so this cannot loop.
  useLayoutEffect(() => {
    if (inner.current) setHeight(inner.current.getBoundingClientRect().height);
  });

  useEffect(() => {
    function remeasure() {
      if (inner.current) setHeight(inner.current.getBoundingClientRect().height);
    }

    window.addEventListener("resize", remeasure);
    return () => window.removeEventListener("resize", remeasure);
  }, []);

  return (
    <div
      className={styles.outer}
      style={height === undefined ? undefined : { height }}
    >
      <div ref={inner}>{children}</div>
    </div>
  );
}
