// hooks/useMutation.ts

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  MutationFunction,
} from "@tanstack/react-query";
import { MutationConfig, ApiResponse } from "../types/query.types";
import { apiClient } from "@/services/api-client";

export function useMutateData<TData, TResponse = TData>(
  endpoint: string,
  config: MutationConfig<TData, TResponse>
): UseMutationResult<ApiResponse<TResponse>, Error, TData> {
  const queryClient = useQueryClient();
  const {
    method = "POST",
    onSuccess,
    onError,
    invalidateQueries = [],
  } = config;

  const mutationFn: MutationFunction<ApiResponse<TResponse>, TData> = async (
    data
  ) => {
    switch (method) {
      case "POST":
        return apiClient.post<TData, TResponse>(endpoint, data);
      case "PUT":
        return apiClient.put<TData, TResponse>(endpoint, data);
      case "PATCH":
        return apiClient.patch<TData, TResponse>(endpoint, data);
      case "DELETE":
        return apiClient.delete(endpoint);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  };

  return useMutation({
    mutationFn,
    onSuccess: (response) => {
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });
      onSuccess?.(response.data);
    },
    onError,
  });
}

// Hooks spécialisés pour des cas d'usage communs
export function useCreate<TData, TResponse = TData>(
  resourcePath: string,
  config?: Omit<MutationConfig<TData, TResponse>, "method">
) {
  return useMutateData<TData, TResponse>(resourcePath, {
    ...config,
    method: "POST",
  });
}

export function useUpdate<TData, TResponse = TData>(
  resourcePath: string,
  config?: Omit<MutationConfig<TData, TResponse>, "method">
) {
  return useMutateData<TData, TResponse>(resourcePath, {
    ...config,
    method: "PATCH",
  });
}

export function useDelete<TResponse = void>(
  resourcePath: string,
  config?: Omit<MutationConfig<void, TResponse>, "method">
) {
  return useMutateData<void, TResponse>(resourcePath, {
    ...config,
    method: "DELETE",
  });
}
