"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ExtendUser } from "../types/next-auth";

interface UseCurrentUserReturn {
  user: ExtendUser | null;
  userRole: string | null;
  permissions: string[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook pour gérer l'utilisateur courant et ses permissions
 */
export const useCurrentUser = (): UseCurrentUserReturn => {
  const { data: session, status } = useSession();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const user = session?.user as ExtendUser | null;
  const userRole = user?.role?.name ?? null;

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user?.id) {
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/permissions?userId=${user.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const data = await response.json();
        setPermissions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // On attend que la session soit chargée avant de récupérer les permissions
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    fetchPermissions();
  }, [user?.id, status]);

  return {
    user,
    userRole,
    permissions,
    isLoading: status === "loading" || isLoading,
    error,
  };
};

// Exemple d'utilisation:
/*
const MyComponent = () => {
  const { user, userRole, permissions, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome {user.first_name}!</h1>
      <p>Role: {userRole}</p>
      <p>Permissions: {permissions.join(', ')}</p>
    </div>
  );
};
*/
