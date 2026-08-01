// Reusable button.
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "soft"
  | "danger"
  | "pill"
  | "pillActive";
type Size = "xs" | "sm" | "md" | "lg" | "icon" | "iconSm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Stretches the button to the full width of its container. */
  block?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  block = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.base,
    styles[variant],
    styles[size],
    block ? styles.block : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
