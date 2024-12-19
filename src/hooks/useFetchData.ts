import { useState, useEffect, useCallback } from "react";

type FetchState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  status: string;
};

const useFetchData = <T>(url: string, options?: { autoRefresh?: boolean; refreshInterval?: number }) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
    status: "idle", // idle, loading, success, error
  });

  // Fonction de fetch qui peut être appelée manuellement ou automatiquement
  const fetchData = useCallback(async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      status: "loading",
    }));

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
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
        error: error as Error,
        status: "error",
      });
    }
  }, [url]);

  // Option pour auto-refresh
  useEffect(() => {
    fetchData();

    let intervalId: NodeJS.Timeout | null = null;

    if (options?.autoRefresh && options.refreshInterval) {
      intervalId = setInterval(fetchData, options.refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [url, fetchData, options?.autoRefresh, options?.refreshInterval]);

  // Retourne la fonction mutate pour actualiser manuellement les données
  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, mutate };
};

export default useFetchData;
