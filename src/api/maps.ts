import { apiClient, ApiResponse } from "@/api/client";
import { Map } from "@/types/map";

export interface GetMapsParams {
    page: number;
    pageSize: number;
    search?: string;
}

export interface GetMapsResponse extends ApiResponse<Map[]> {
    meta: {
        totalPages: number;
        total: number;
        page: number;
        pageSize: number;
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
                pageSize: String(pageSize),
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
