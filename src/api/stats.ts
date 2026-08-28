import { legacyApiClient, ApiResponse } from "@/api/client";
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
        { page, pageSize, search, signal }: GetStatsParams & { search?: string }
    ): Promise<GetStatsResponse> => {
        return legacyApiClient.get<Stat[]>(
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
        return legacyApiClient.get<Stat[]>(
            `/maps/${mapId}/stats`,
            { page: String(page), pageSize: String(pageSize) },
            signal
        );
    },
};
