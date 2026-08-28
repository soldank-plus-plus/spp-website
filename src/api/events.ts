import { legacyApiClient } from "@/api/client";
import { Event } from "@/types/event";

export interface GetEventsParams {
    page: number;
    pageSize: number;
    search?: string;
    signal?: AbortSignal;
}

// Not real backend endpoints yet; kept on the legacy client until the
// backend documents them.
export const eventsApi = {
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
