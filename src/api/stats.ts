import { apiClient, ApiResponse } from "@/api/client";
import { Stat } from "@/types/stat";

export interface GetStatsParams {
    page: number;
    pageSize: number;
    signal?: AbortSignal;
}

export interface GetRecentStatsParams {
    page: number;
    pageSize: number;
    search?: string;
    signal?: AbortSignal;
}

export interface GetStatsResponse extends ApiResponse<Stat[]> {
    meta: {
        totalPages: number;
        total: number;
        page: number;
        pageSize: number;
    };
}

export const statsApi = {
    getRecentStats: async ({
        page,
        pageSize,
        search,
        signal,
    }: GetRecentStatsParams): Promise<GetStatsResponse> => {
        return apiClient.get<Stat[]>(
            "/stats",
            {
                page: String(page),
                pageSize: String(pageSize),
                ...(search && { search }),
            },
            signal
        );
    },

    getUserStats: async (
        userId: number,
        { page, pageSize, search, signal }: GetStatsParams & { search?: string }
    ): Promise<GetStatsResponse> => {
        return apiClient.get<Stat[]>(
            `/users/${userId}/stats`,
            {
                page: String(page),
                pageSize: String(pageSize),
                ...(search && { search }),
            },
            signal
        );
    },

    getMapStats: async (
        mapId: number,
        { page, pageSize, signal }: GetStatsParams
    ): Promise<GetStatsResponse> => {
        return apiClient.get<Stat[]>(
            `/maps/${mapId}/stats`,
            { page: String(page), pageSize: String(pageSize) },
            signal
        );
    },
};
