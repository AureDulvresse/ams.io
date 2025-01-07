import { QueryClient, DefaultOptions } from "@tanstack/react-query";

const defaultQueryOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false, // désactive le refetch automatique lors du focus de la fenêtre
    refetchOnMount: false, // désactive le refetch lors du montage des composants
    refetchOnReconnect: false, // désactive le refetch lors de la reconnexion
    retry: 1, // nombre de tentatives en cas d'échec
    staleTime: 5 * 60 * 1000, // 5 minutes avant qu'une donnée soit considérée comme périmée
  },
  mutations: {
    retry: 1,
  },
};

export function generateQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: defaultQueryOptions,
    //  // Gestionnaire d'erreur global
    //  logger: {
    //    log: console.log,
    //    warn: console.warn,
    //    error: process.env.NODE_ENV === "development" ? console.error : () => {},
    //  },
  });
}

export const queryClient = generateQueryClient();
