import { apiClient, legacyApiClient } from "@/api/client";
import { Map } from "@/types/map";

export interface GetMapsParams {
    page: number;
    pageSize: number;
    search?: string;
}

export const mapsApi = {
    getMaps: async (
        { page, pageSize, search }: GetMapsParams,
        signal?: AbortSignal
    ) => {
        const { data, error } = await apiClient.GET("/maps", {
            params: {
                query: { page, limit: pageSize, ...(search && { search }) },
            },
            signal,
        });
        if (error) throw new Error("Failed to fetch maps");
        return data;
    },

    getMapById: async (id: number) => {
        const { data, error } = await apiClient.GET("/maps/{id}", {
            params: { path: { id } },
        });
        if (error) throw new Error("Failed to fetch map");
        return data;
    },

    // Not a real backend endpoint yet; unused, kept on the legacy client
    // until the backend documents map-by-user lookups.
    getMapsByUser: async (userId: string) => {
        return legacyApiClient.get<Map[]>(`/maps/by-user/${userId}`);
    },
};
