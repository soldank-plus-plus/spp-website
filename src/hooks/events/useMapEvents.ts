import { useMapsControllerFindEvents } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Event } from "@/types/event";

interface UseMapEventsProps {
    mapId: number;
    page: number;
    pageSize: number;
}

export const useMapEvents = ({ mapId, page, pageSize }: UseMapEventsProps) => {
    const { data, isPending, error } = useMapsControllerFindEvents({
        pathParams: { mapId },
        queryParams: { page, limit: pageSize },
    });

    return {
        events: (data?.data as Event[] | undefined) ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch events") : null,
    };
};
