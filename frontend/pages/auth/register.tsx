// User registration page.
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import RegisterForm from "@/components/auth/RegisterForm";
import { useNotify } from "@/context/NotificationContext";
import styles from "@/styles/Auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const { notify } = useNotify();

  function done() {
    // Supabase may require email confirmation before the session exists, so
    // say what happens next rather than assuming they are signed in.
    notify("Account created", {
      text: "Check your email if confirmation is required.",
    });
    router.replace("/settings");
  }

  return (
    <>
      <Head>
        <title>Create account · Hak Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <PageHeader
          title="Create account"
          subtitle="Save your details for faster checkout"
          backHref="/auth/login"
          backLabel="Back to sign in"
        />
        <div className={`appWidth ${styles.page}`}>
          <RegisterForm onDone={done} />
        </div>
      </PageLayout>
    </>
  );
}
