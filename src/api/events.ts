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
        // nestjs-paginate always includes meta on this endpoint; the base
        // ApiResponse type keeps it optional to cover non-paginated endpoints.
        return apiClient.get<Event[]>(
            "/events",
            {
                page: String(page),
                limit: String(pageSize),
                ...(search && { search }),
            },
            signal
        ) as Promise<GetEventsResponse>;
    },

    getMapEvents: async (
        mapId: number,
        { page, pageSize, signal }: GetEventsParams
    ): Promise<GetEventsResponse> => {
        return apiClient.get<Event[]>(
            `/maps/${mapId}/events`,
            { page: String(page), limit: String(pageSize) },
            signal
        ) as Promise<GetEventsResponse>;
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
        ) as Promise<GetEventsResponse>;
    },
};
