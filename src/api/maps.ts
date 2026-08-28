import { legacyApiClient } from "@/api/client";
import { Map } from "@/types/map";

export const mapsApi = {
    // Not a real backend endpoint yet; unused, kept on the legacy client
    // until the backend documents map-by-user lookups.
    getMapsByUser: async (userId: string) => {
        return legacyApiClient.get<Map[]>(`/maps/by-user/${userId}`);
    },
};
