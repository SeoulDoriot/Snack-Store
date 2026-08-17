// Public entry point for authentication state.
import { useAuthContext, type AuthContextValue } from "@/context/AuthContext";

export type { AuthContextValue };

export function useAuth(): AuthContextValue {
  return useAuthContext();
}

export default useAuth;
