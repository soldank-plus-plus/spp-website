import { legacyApiClient, ApiResponse } from "@/api/client";
import { User, AccountUser, ActivityDay } from "@/types/user";

export type SortKey = "unique_caps" | "hardest" | "gold" | "maps_created";

export interface GetUsersParams {
    page: number;
    pageSize: number;
    search?: string;
    sort?: SortKey;
    countryId?: number;
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
        countryId,
        signal,
    }: GetUsersParams): Promise<GetUsersResponse> => {
        return legacyApiClient.get<User[]>(
            "/users",
            {
                page: String(page),
                pageSize: String(pageSize),
                ...(search && { search }),
                ...(sort && { sort }),
                ...(countryId && { countryId: String(countryId) }),
            },
            signal
        );
    },

    getUserById: async (id: number) => {
        return legacyApiClient.get<User>(`/users/${id}`);
    },

    getUserByUsername: async (username: string) => {
        return legacyApiClient.get<AccountUser>(
            `/users/by-username/${encodeURIComponent(username)}`
        );
    },

    getUserActivity: async (
        id: number,
        type: "records" | "golds" | "silvers" | "bronzes",
        signal?: AbortSignal
    ): Promise<ApiResponse<ActivityDay[]>> => {
        return legacyApiClient.get<ActivityDay[]>(
            `/users/${id}/activity`,
            { type },
            signal
        );
    },
};
