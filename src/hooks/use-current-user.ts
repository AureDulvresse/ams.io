"use client";
import { useSession } from "next-auth/react";
import { Permission } from "../types/permission";
import useFetchData from "./use-fetch-data";
import { useCallback, useEffect, useState } from "react";
import { Role } from "../types/role";
import { User } from "next-auth";

// Types pour les états de la requête
type FetchStatus = "idle" | "loading" | "success" | "error";
interface FetchState {
  permissions: string[] | null; // Liste des permisions du user
  isLoading: boolean; // Indique si la requête est en cours
  error: Error | null; // Erreur rencontrée (s'il y en a)
  status: FetchStatus; // État actuel de la requête
}

export interface FetchCurrentUserResponse extends FetchState {
  user:
    | (User & {
        id: string;
        first_name: string;
        last_name: string;
        role: Role;
        is_active: boolean;
        emailVerified?: Date;
        last_login?: Date;
      })
    | undefined; // Données user connecté
  userRole: string | undefined;
}

export const useCurrentUser = (): FetchCurrentUserResponse => {
  // Initialisation de l'état de la requête
  const [state, setState] = useState<FetchState>({
    permissions: null,
    isLoading: false,
    error: null,
    status: "idle",
  });
  const session = useSession();

  const user = session.data?.user;

  const userRole = user?.role.name;

  const fetchData = useCallback(
    async (user: any): Promise<void> => {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
        status: "loading",
      }));

      try {
        const response = await fetch(`/api/permissions?userId=${user?.id}`);

        if (!response.ok) {
          throw new Error(
            `HTTP Error: ${response.statusText} (${response.status})`
          );
        }

        const permissions: string[] = await response.json();

        setState({
          permissions,
          isLoading: false,
          error: null,
          status: "success",
        });
      } catch (error) {
        setState({
          permissions: [],
          isLoading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
          status: "error",
        });
      }
    },
    [useFetchData]
  );

  useEffect(() => {
    // Lance une première requête à l'initialisation
    fetchData(user);
  }, [fetchData, user]);

  return { ...state, user, userRole };
};
