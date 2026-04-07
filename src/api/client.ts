export interface ApiResponse<T> {
    data: T;
    meta?: {
        totalPages?: number;
        total?: number;
        page?: number;
        pageSize?: number;
    };
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL = "http://localhost:3000") {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const defaultHeaders = {
            "Content-Type": "application/json",
        };

        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
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
                // Ignore JSON parsing errors for error responses
            }

            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    }

    // GET request
    async get<T>(
        endpoint: string,
        params?: Record<string, any>
    ): Promise<ApiResponse<T>> {
        const url = new URL(endpoint, this.baseURL);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        return this.request<T>(url.pathname + url.search);
    }

    // POST request
    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // PUT request
    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // DELETE request
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "DELETE",
        });
    }

    // PATCH request
    async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

export const apiClient = new ApiClient();