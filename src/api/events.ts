import { apiClient, legacyApiClient } from "@/api/client";
import { Event } from "@/types/event";

export interface GetEventsParams {
    page: number;
    pageSize: number;
    search?: string;
    signal?: AbortSignal;
}

export const eventsApi = {
    getEvents: async ({ page, pageSize, signal }: GetEventsParams) => {
        // The backend doesn't support searching /events yet, so `search` is
        // accepted here (hooks pass it) but not forwarded to the request.
        const { data, error } = await apiClient.GET("/events", {
            params: { query: { page, limit: pageSize } },
            signal,
        });
        if (error) throw new Error("Failed to fetch events");
        return { ...data, data: data.data as Event[] };
    },

    // Not real backend endpoints yet; kept on the legacy client until the
    // backend documents them.
    getMapEvents: async (
        mapId: number,
        { page, pageSize, signal }: GetEventsParams
    ) => {
        return legacyApiClient.get<Event[]>(
            `/maps/${mapId}/events`,
            { page: String(page), limit: String(pageSize) },
            signal
        );
    },

    getUserEvents: async (
        userId: number,
        { page, pageSize, search, signal }: GetEventsParams
    ) => {
        return legacyApiClient.get<Event[]>(
            `/users/${userId}/events`,
            {
                page: String(page),
                limit: String(pageSize),
                ...(search && { search }),
            },
            signal
        );
    },
};
