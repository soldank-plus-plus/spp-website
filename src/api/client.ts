import { mockGet } from "./mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export interface ApiResponse<T> {
    data: T;
    meta?: {
        itemsPerPage?: number;
        totalItems?: number;
        currentPage?: number;
        totalPages?: number;
        sortBy?: [string, string][];
        search?: string;
        searchBy?: string[];
        filter?: Record<string, any>;
    };
    links?: {
        current?: string;
        [key: string]: string | undefined;
    };
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000") {
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
        params?: Record<string, any>,
        signal?: AbortSignal
    ): Promise<ApiResponse<T>> {
        if (USE_MOCK) {
            const normalized: Record<string, string> = {};
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        normalized[key] = String(value);
                    }
                });
            }
            return mockGet(endpoint, normalized) as ApiResponse<T>;
        }

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

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "DELETE" });
    }

    async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

export const apiClient = new ApiClient();
