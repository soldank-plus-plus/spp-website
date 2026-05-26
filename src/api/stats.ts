import { apiClient, ApiResponse } from "@/api/client";
import { Stat } from "@/types/stat";

export interface GetStatsParams {
    page: number;
    pageSize: number;
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
    getUserStats: async (
        userId: number,
        { page, pageSize, signal }: GetStatsParams
    ): Promise<GetStatsResponse> => {
        return apiClient.get<Stat[]>(
            `/users/${userId}/stats`,
            { page: String(page), pageSize: String(pageSize) },
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
