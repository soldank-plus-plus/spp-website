import { apiClient, ApiResponse } from "@/api/client";
import { User } from "@/types/user";

export interface GetUsersParams {
    page: number;
    pageSize: number;
    search?: string;
    sort?: "records" | "hardest" | "gold";
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
    }: GetUsersParams): Promise<GetUsersResponse> => {
        return apiClient.get<User[]>("/users", {
            page: String(page),
            pageSize: String(pageSize),
            ...(search && { search }),
            ...(sort && { sort }),
        });
    },

    getUserById: async (id: number) => {
        return apiClient.get<User>(`/users/${id}`);
    },

    updateUser: async (id: number, data: Partial<User>) => {
        return apiClient.put<User>(`/users/${id}`, data);
    },

    deleteUser: async (id: number) => {
        return apiClient.delete<void>(`/users/${id}`);
    },
};