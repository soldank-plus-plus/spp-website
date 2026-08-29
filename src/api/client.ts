import type {
    PaginatedLinksDocumented,
    PaginatedMetaDocumented,
} from "./generated/sppSchemas";

export interface ApiResponse<T> {
    data: T;
    meta?: PaginatedMetaDocumented;
    links?: PaginatedLinksDocumented;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

// Loosely-typed fallback for endpoints the backend doesn't implement/document
// yet (users, clans, countries, stats, and a few events sub-resources).
// Migrate their callers to the generated hooks in `src/api/generated/` once
// the backend adds them to its OpenAPI schema, then delete this.
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
}

export const legacyApiClient = new LegacyApiClient();
