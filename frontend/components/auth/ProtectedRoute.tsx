// Gate for pages that need a session, optionally an admin one.
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";
import { UserIcon } from "../common/Icons";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/styles/Auth.module.css";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Require the signed-in user to have the admin role. */
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAdmin, ready, available } = useAuth();

  const denied = ready && available && !user;

  useEffect(() => {
    if (!denied) return;

    router.replace({
      pathname: "/auth/login",
      query: { next: router.asPath },
    });
  }, [denied, router]);

  if (!available) {
    return (
      <div className={styles.gate}>
        <EmptyState
          icon={<UserIcon size={22} />}
          title="Accounts are not set up yet"
          description="Configure Supabase to enable sign in, order history and the admin area."
          action={<Button onClick={() => router.push("/")}>Back to the shop</Button>}
        />
      </div>
    );
  }

  if (!ready || denied) {
    return (
      <div className={styles.gate}>
        <Spinner size={24} label="Checking your session" />
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className={styles.gate}>
        <EmptyState
          icon={<UserIcon size={22} />}
          title="Staff only"
          description="This account does not have admin access to the store."
          action={<Button onClick={() => router.push("/")}>Back to the shop</Button>}
        />
      </div>
    );
  }

  return <>{children}</>;
}
