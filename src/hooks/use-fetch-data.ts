import {
  useQuery,
  UseQueryResult,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { QueryOptions, ApiResponse } from "../types/query.types";
import { apiClient } from "@/services/api-client";

export default function useFetchData<TData>(
  queryKey: QueryKey,
  endpoint: string,
  options: QueryOptions = {}
): UseQueryResult<ApiResponse<TData>, Error> {
  const { autoRefresh = false, refreshInterval = 0 } = options;

  return useQuery({
    queryKey,
    queryFn: async () => apiClient.get<TData>(endpoint),
    refetchInterval: autoRefresh ? refreshInterval : false,
    retry: 3,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

// Hooks spécialisés pour des cas d'usage communs
export function useList<TData>(
  resourcePath: string,
  options?: QueryOptions
): UseQueryResult<ApiResponse<TData[]>, Error> {
  return useFetchData<TData[]>([resourcePath, "list"], resourcePath, options);
}

export function useDetail<TData>(
  resourcePath: string,
  id: string | number,
  options?: QueryOptions
): UseQueryResult<ApiResponse<TData>, Error> {
  return useFetchData<TData>(
    [resourcePath, "detail", id],
    `${resourcePath}/${id}`,
    options
  );
}
