// types/query.types.ts

export interface QueryOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface MutationConfig<TData, TResponse = TData> {
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  onSuccess?: (data: TResponse) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[];
}

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}