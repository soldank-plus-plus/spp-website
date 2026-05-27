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
        totalPages: number;
        total: number;
        page: number;
        pageSize: number;
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
                pageSize: String(pageSize),
                ...(search && { search }),
            },
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
                pageSize: String(pageSize),
                ...(search && { search }),
            },
            signal
        );
    },
};
