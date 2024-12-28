import { useState, useEffect, useCallback } from "react";

// Types pour les états de la requête
type FetchStatus = "idle" | "loading" | "success" | "error";

interface FetchOptions {
  autoRefresh?: boolean; // Si l'auto-refresh est activé
  refreshInterval?: number; // Intervalle d'auto-refresh en millisecondes
}

interface FetchState<T> {
  data: T | null; // Données récupérées
  isLoading: boolean; // Indique si la requête est en cours
  error: Error | null; // Erreur rencontrée (s'il y en a)
  status: FetchStatus; // État actuel de la requête
}

interface FetchResponse<T> extends FetchState<T> {
  mutate: () => Promise<void>; // Fonction pour relancer manuellement la requête
}

/**
 * Hook personnalisé pour récupérer des données d'une URL avec gestion d'état et auto-refresh.
 * @template T Le type des données attendues.
 * @param url L'URL à partir de laquelle les données sont récupérées.
 * @param options Options pour configurer l'auto-refresh et l'intervalle.
 * @returns L'état actuel de la requête et une fonction pour actualiser les données.
 */
const useFetchData = <T>(
  url: string,
  options: FetchOptions = {}
): FetchResponse<T> => {
  const { autoRefresh = false, refreshInterval = 0 } = options;

  // Initialisation de l'état de la requête
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
    status: "idle",
  });

  /**
   * Fonction pour récupérer les données depuis l'URL.
   */
  const fetchData = useCallback(async (): Promise<void> => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      status: "loading",
    }));

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.statusText} (${response.status})`
        );
      }

      const data = (await response.json()) as T;
      setState({
        data,
        isLoading: false,
        error: null,
        status: "success",
      });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
        status: "error",
      });
    }
  }, [url]);

  /**
   * Gestion de l'auto-refresh.
   */
  useEffect(() => {
    // Lance une première requête à l'initialisation
    fetchData();

    let intervalId: NodeJS.Timeout | null = null;

    // Active l'auto-refresh si configuré
    if (autoRefresh && refreshInterval > 0) {
      intervalId = setInterval(fetchData, refreshInterval);
    }

    // Nettoyage lors du démontage du composant
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, autoRefresh, refreshInterval]);

  /**
   * Fonction pour relancer manuellement la requête.
   */
  const mutate = useCallback(() => fetchData(), [fetchData]);

  return {
    ...state,
    mutate,
  };
};

export default useFetchData;
