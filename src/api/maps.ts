import { apiClient, ApiResponse } from "@/api/client";
import { Map } from "@/types/map";

export interface GetMapsParams {
    page: number;
    pageSize: number;
    search?: string;
}

export interface GetMapsResponse extends ApiResponse<Map[]> {
    meta: {
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
}

export const mapsApi = {
    getMaps: async (
        { page, pageSize, search }: GetMapsParams,
        signal?: AbortSignal
    ): Promise<GetMapsResponse> => {
        return apiClient.get<Map[]>(
            "/maps",
            {
                page: String(page),
                limit: String(pageSize),
                ...(search && { search }),
            },
            signal
        );
    },

    getMapById: async (id: number) => {
        return apiClient.get<Map>(`/maps/${id}`);
    },

    getMapsByUser: async (userId: string) => {
        return apiClient.get<Map[]>(`/maps/by-user/${userId}`);
    },
};
