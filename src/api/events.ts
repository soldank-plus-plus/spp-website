import { apiClient, ApiResponse } from "@/api/client";
import { Event } from "@/types/event";

export interface GetEventsParams {
    page: number;
    pageSize: number;
    search?: string;
    signal?: AbortSignal;
}

export interface GetEventsResponse extends ApiResponse<Event[]> {
    meta: {
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
}

export const eventsApi = {
    getEvents: async ({
        page,
        pageSize,
        search,
        signal,
    }: GetEventsParams): Promise<GetEventsResponse> => {
        return apiClient.get<Event[]>(
            "/events",
            {
                page: String(page),
                limit: String(pageSize),
                ...(search && { search }),
            },
            signal
        );
    },

    getMapEvents: async (
        mapId: number,
        { page, pageSize, signal }: GetEventsParams
    ): Promise<GetEventsResponse> => {
        return apiClient.get<Event[]>(
            `/maps/${mapId}/events`,
            { page: String(page), limit: String(pageSize) },
            signal
        );
    },

    getUserEvents: async (
        userId: number,
        { page, pageSize, search, signal }: GetEventsParams
    ): Promise<GetEventsResponse> => {
        return apiClient.get<Event[]>(
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
