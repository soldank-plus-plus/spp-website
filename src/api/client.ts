import createClient from "openapi-fetch";
import type { components, paths } from "./schema";

// Fully-typed client generated from the backend's OpenAPI schema (`schema.d.ts`).
// Use this for any endpoint the backend documents (currently `/maps`,
// `/maps/{id}`, `/events`).
export const apiClient = createClient<paths>({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
});

export interface ApiResponse<T> {
    data: T;
    meta?: components["schemas"]["PaginatedMetaDocumented"];
    links?: components["schemas"]["PaginatedLinksDocumented"];
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

// Loosely-typed fallback for endpoints the backend doesn't implement/document
// yet (users, clans, countries, stats, and a few events sub-resources).
// Migrate their callers to `apiClient` above once the backend adds them to
// its OpenAPI schema, then delete this.
class LegacyApiClient {
    private baseURL: string;

    constructor(
        baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
    ) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error: ApiError = {
                message: `HTTP error! status: ${response.status}`,
                status: response.status,
            };

            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
                error.code = errorData.code;
            } catch {
                // ignore JSON parsing errors for error responses
            }

            throw new Error(error.message);
        }

        return response.json();
    }

    async get<T>(
        endpoint: string,
        params?: Record<string, unknown>,
        signal?: AbortSignal
    ): Promise<ApiResponse<T>> {
        let url = endpoint;

        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    searchParams.append(key, String(value));
                }
            });
            const qs = searchParams.toString();
            if (qs) url += "?" + qs;
        }

        return this.request<T>(url, { signal });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "DELETE" });
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

export const legacyApiClient = new LegacyApiClient();
