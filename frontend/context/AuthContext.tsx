// Signed-in user and store profile.
//
// Safe to mount without Supabase configured: the context simply reports
// "signed out" and every action explains that auth is unavailable.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import * as auth from "@/services/auth.service";
import type { ProfileRow } from "@/types/database";

export interface AuthContextValue {
  user: User | null;
  profile: ProfileRow | null;
  isAdmin: boolean;
  /** False until the initial session lookup finishes. */
  ready: boolean;
  available: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);

  const loadProfile = useCallback(async (next: User | null) => {
    if (!next) {
      setProfile(null);
      return;
    }

    try {
      setProfile(await auth.getProfile(next.id));
    } catch {
      // A missing profile should never block sign-in.
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setReady(true);
      return;
    }

    let active = true;

    client.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const next = data.session?.user ?? null;
      setUser(next);
      await loadProfile(next);
      if (active) setReady(true);
    });

    const { data: listener } = client.auth.onAuthStateChange(
      async (_event, session: Session | null) => {
        const next = session?.user ?? null;
        setUser(next);
        await loadProfile(next);
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isAdmin: profile?.role === "admin",
      ready,
      available: isSupabaseConfigured,
      signIn: async (email, password) => {
        await auth.signIn({ email, password });
      },
      signUp: async (email, password, name) => {
        await auth.signUp({ email, password, name });
      },
      signOut: async () => {
        await auth.signOut();
        setUser(null);
        setProfile(null);
      },
      refreshProfile: async () => loadProfile(user),
    }),
    [user, profile, ready, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside <AuthProvider>.");
  }
  return context;
}

export default AuthContext;
