// Neutral surface container used for panels, tiles and table shells.
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Common.module.css";

type Padding = "none" | "sm" | "md" | "lg";

const PADDING: Record<Padding, string> = {
  none: styles.padNone,
  sm: styles.padSm,
  md: styles.padMd,
  lg: styles.padLg,
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds the subtle lift-on-hover treatment. */
  hover?: boolean;
  padding?: Padding;
  children: ReactNode;
}

export default function Card({
  hover = false,
  padding = "md",
  className,
  children,
  ...rest
}: CardProps) {
  const classes = [styles.card, PADDING[padding], hover ? styles.cardHover : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
