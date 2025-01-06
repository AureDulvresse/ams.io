// services/api-client.ts

import { ApiError, ApiResponse } from "@/src/types/query.types";

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
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
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL);
export default ApiClient;
