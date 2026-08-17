// Email and password sign in.
import { useState, type FormEvent } from "react";
import Link from "next/link";
import Button from "../common/Button";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";
import Spinner from "../common/Spinner";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/styles/Auth.module.css";

interface LoginFormProps {
  onDone: () => void;
}

export default function LoginForm({ onDone }: LoginFormProps) {
  const { signIn, available } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(undefined);

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setBusy(true);
    try {
      await signIn(email.trim(), password);
      onDone();
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.card} onSubmit={submit} noValidate>
      <div className={styles.mark}>H</div>
      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.subtitle}>Sign in to see your orders and profile.</p>

      {!available && (
        <p className={styles.notice}>
          Accounts are unavailable until Supabase is configured. You can still
          browse and order as a guest.
        </p>
      )}

      {error && <ErrorMessage className={styles.formError}>{error}</ErrorMessage>}

      <div className={styles.fields}>
        <Input
          label="Email"
          type="email"
          value={email}
          autoComplete="email"
          placeholder="you@kit.edu.kh"
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <Button
        className={styles.action}
        block
        size="lg"
        type="submit"
        disabled={busy || !available}
      >
        {busy ? <Spinner size={18} label="Signing in" /> : "Sign in"}
      </Button>

      <p className={styles.alt}>
        New here?{" "}
        <Link href="/auth/register" className={styles.altLink}>
          Create an account
        </Link>
      </p>
    </form>
  );
}
