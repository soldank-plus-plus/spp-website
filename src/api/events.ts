import { apiClient, ApiResponse } from "@/api/client";
import { Event } from "@/types/event";

export interface GetEventsParams {
    page: number;
    pageSize: number;
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
        signal,
    }: GetEventsParams): Promise<GetEventsResponse> => {
        return apiClient.get<Event[]>(
            "/events",
            { page: String(page), pageSize: String(pageSize) },
            signal
        );
    },

    getUserEvents: async (
        userId: number,
        { page, pageSize, signal }: GetEventsParams
    ): Promise<GetEventsResponse> => {
        return apiClient.get<Event[]>(
            `/users/${userId}/events`,
            { page: String(page), pageSize: String(pageSize) },
            signal
        );
    },
};
