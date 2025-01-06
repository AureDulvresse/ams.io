// lib/api-client.ts

import { ApiError, ApiResponse, RequestConfig } from "@/src/types/query.types";

interface ApiConfig {
  baseURL: string;
  apiPrefix: string;
}

const getApiConfig = (): ApiConfig => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const apiPrefix = "/api";

  return {
    baseURL,
    apiPrefix,
  };
};

class ApiClient {
  private config: ApiConfig;

  constructor() {
    this.config = getApiConfig();
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    // Si c'est une URL complète
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      const url = new URL(endpoint);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }
      return url.toString();
    }

    // Pour les routes API locales ou avec baseURL
    let fullUrl: string;
    if (!this.config.baseURL && endpoint.startsWith("/api")) {
      fullUrl = endpoint;
    } else {
      const baseURL = this.config.baseURL.endsWith("/")
        ? this.config.baseURL.slice(0, -1)
        : this.config.baseURL;

      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

      fullUrl = `${baseURL}${cleanEndpoint}`;
    }

    // Ajout des paramètres de requête
    if (params) {
      const url = new URL(fullUrl, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      return url.toString();
    }

    return fullUrl;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = new Error(response.statusText) as ApiError;
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const data = await response.json();

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const { params, ...requestConfig } = config ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      ...requestConfig,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...requestConfig.headers,
      },
    });

    return this.handleResponse<T>(response);
  }

  async post<T, R = T>(
    endpoint: string,
    data?: T,
    config?: RequestConfig
  ): Promise<ApiResponse<R>> {
    const { params, ...requestConfig } = config ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      ...requestConfig,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...requestConfig.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<R>(response);
  }

  async put<T, R = T>(
    endpoint: string,
    data: T,
    config?: RequestConfig
  ): Promise<ApiResponse<R>> {
    const { params, ...requestConfig } = config ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      ...requestConfig,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...requestConfig.headers,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<R>(response);
  }

  async patch<T, R = T>(
    endpoint: string,
    data: T,
    config?: RequestConfig
  ): Promise<ApiResponse<R>> {
    const { params, ...requestConfig } = config ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      ...requestConfig,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...requestConfig.headers,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<R>(response);
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const { params, ...requestConfig } = config ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      ...requestConfig,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...requestConfig.headers,
      },
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
export default ApiClient;
