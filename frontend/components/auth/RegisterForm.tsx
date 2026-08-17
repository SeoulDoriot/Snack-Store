// Account creation.
import { useState, type FormEvent } from "react";
import Link from "next/link";
import Button from "../common/Button";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";
import Spinner from "../common/Spinner";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/styles/Auth.module.css";

const MIN_PASSWORD = 8;

interface RegisterFormProps {
  onDone: () => void;
}

export default function RegisterForm({ onDone }: RegisterFormProps) {
  const { signUp, available } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(undefined);

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`Use at least ${MIN_PASSWORD} characters for your password.`);
      return;
    }

    setBusy(true);
    try {
      await signUp(email.trim(), password, name.trim());
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
      <h1 className={styles.title}>Create your account</h1>
      <p className={styles.subtitle}>
        Save your details so checkout is one tap next time.
      </p>

      {!available && (
        <p className={styles.notice}>
          Accounts are unavailable until Supabase is configured. You can still
          browse and order as a guest.
        </p>
      )}

      {error && <ErrorMessage className={styles.formError}>{error}</ErrorMessage>}

      <div className={styles.fields}>
        <Input
          label="Full name"
          value={name}
          autoComplete="name"
          placeholder="Sok Dara"
          onChange={(event) => setName(event.target.value)}
        />
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
          autoComplete="new-password"
          hint={`At least ${MIN_PASSWORD} characters.`}
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
        {busy ? <Spinner size={18} label="Creating account" /> : "Create account"}
      </Button>

      <p className={styles.alt}>
        Already have an account?{" "}
        <Link href="/auth/login" className={styles.altLink}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
