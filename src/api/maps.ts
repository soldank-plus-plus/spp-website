import { apiClient, ApiResponse } from "@/api/client";
import { Map } from "@/types/map";

export interface GetMapsParams {
    page: number;
    pageSize: number;
    search?: string;
}

export interface GetMapsResponse extends ApiResponse<Map[]> {
    meta: NonNullable<ApiResponse<Map[]>["meta"]>;
}

export const mapsApi = {
    getMaps: async (
        { page, pageSize, search }: GetMapsParams,
        signal?: AbortSignal
    ): Promise<GetMapsResponse> => {
        // nestjs-paginate always includes meta on this endpoint; the base
        // ApiResponse type keeps it optional to cover non-paginated endpoints
        return apiClient.get<Map[]>(
            "/maps",
            {
                page: String(page),
                limit: String(pageSize),
                ...(search && { search }),
            },
            signal
        ) as Promise<GetMapsResponse>;
    },

    getMapById: async (id: number) => {
        return apiClient.get<Map>(`/maps/${id}`);
    },

    getMapsByUser: async (userId: string) => {
        return apiClient.get<Map[]>(`/maps/by-user/${userId}`);
    },
};
