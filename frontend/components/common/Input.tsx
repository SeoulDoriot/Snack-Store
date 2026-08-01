// Labelled text field with hint and error states.
import { forwardRef, useId, type InputHTMLAttributes } from "react";
import styles from "./Common.module.css";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  /** Renders the label for screen readers only. */
  hideLabel?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel = false, className, ...rest },
  ref
) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={styles.field}>
      <label className={hideLabel ? "srOnly" : styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        {...rest}
        id={id}
        ref={ref}
        className={[styles.control, error ? styles.controlError : "", className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
      />
      {message && (
        <span
          id={messageId}
          className={[styles.hint, error ? styles.hintError : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {message}
        </span>
      )}
    </div>
  );
});

export default Input;
