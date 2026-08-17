// User login page.
import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/styles/Auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  const next = typeof router.query.next === "string" ? router.query.next : "/";

  // Already signed in — do not make them log in twice.
  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  return (
    <>
      <Head>
        <title>Sign in · Hak Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <PageHeader title="Sign in" subtitle="Access your orders and profile" />
        <div className={`appWidth ${styles.page}`}>
          <LoginForm onDone={() => router.replace(next)} />
        </div>
      </PageLayout>
    </>
  );
}
