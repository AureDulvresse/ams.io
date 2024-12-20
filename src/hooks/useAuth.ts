// hooks/useAuth.ts
import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  const signIn = async (email: string, password: string) => {
    return nextAuthSignIn("credentials", {
      email,
      password,
      redirect: false,
    });
  };

  const signOut = async () => {
    return nextAuthSignOut();
  };

  return {
    user: session?.user,
    accessToken: session?.accessToken,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    signIn,
    signOut,
  };
};
