import { apiClient, ApiResponse } from "@/api/client";
import { User, AccountUser, ActivityDay } from "@/types/user";

export type SortKey = "unique_caps" | "hardest" | "gold";

export interface GetUsersParams {
    page: number;
    pageSize: number;
    search?: string;
    sort?: SortKey;
    signal?: AbortSignal;
}

export interface GetUsersResponse extends ApiResponse<User[]> {
    meta: {
        totalPages: number;
        total: number;
        page: number;
        pageSize: number;
    };
}

export const usersApi = {
    getUsers: async ({
        page,
        pageSize,
        search,
        sort,
        signal,
    }: GetUsersParams): Promise<GetUsersResponse> => {
        return apiClient.get<User[]>(
            "/users",
            {
                page: String(page),
                pageSize: String(pageSize),
                ...(search && { search }),
                ...(sort && { sort }),
            },
            signal
        );
    },

    getUserById: async (id: number) => {
        return apiClient.get<User>(`/users/${id}`);
    },

    getUserByUsername: async (username: string) => {
        return apiClient.get<AccountUser>(`/users/by-username/${encodeURIComponent(username)}`);
    },

    updateUser: async (id: number, data: Partial<User>) => {
        return apiClient.put<User>(`/users/${id}`, data);
    },

    deleteUser: async (id: number) => {
        return apiClient.delete<void>(`/users/${id}`);
    },

    getUserActivity: async (id: number, type: "records" | "golds" | "silvers" | "bronzes", signal?: AbortSignal): Promise<ApiResponse<ActivityDay[]>> => {
        return apiClient.get<ActivityDay[]>(`/users/${id}/activity`, { type }, signal);
    },
};
