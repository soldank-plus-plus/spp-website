import { apiClient, ApiResponse } from "@/api/client";
import { Clan } from "@/types/clan";

export type ClanSortKey = "unique_caps" | "hardest" | "gold";

export interface GetClansParams {
    page: number;
    pageSize: number;
    search?: string;
    sort?: ClanSortKey;
    signal?: AbortSignal;
}

export interface GetClansResponse extends ApiResponse<Clan[]> {
    meta: {
        totalPages: number;
        total: number;
        page: number;
        pageSize: number;
    };
}

export const clansApi = {
    getClans: async ({
        page,
        pageSize,
        search,
        sort,
        signal,
    }: GetClansParams): Promise<GetClansResponse> => {
        return apiClient.get<Clan[]>(
            "/clans",
            {
                page: String(page),
                pageSize: String(pageSize),
                ...(search && { search }),
                ...(sort && { sort }),
            },
            signal
        );
    },
};
