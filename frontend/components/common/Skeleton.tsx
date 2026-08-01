// Shimmer placeholders used while mock data settles.
import type { CSSProperties } from "react";
import styles from "./Common.module.css";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}

export default function Skeleton({
  width = "100%",
  height = 16,
  radius = "var(--r-sm)",
  className,
}: SkeletonProps) {
  const style: CSSProperties = { width, height, borderRadius: radius };

  return (
    <span
      aria-hidden
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/** A few stacked bars, with the last one short so it reads as a paragraph. */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <span
      aria-hidden
      className={[styles.skeletonText, className].filter(Boolean).join(" ")}
    >
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          height={12}
          width={index === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </span>
  );
}
