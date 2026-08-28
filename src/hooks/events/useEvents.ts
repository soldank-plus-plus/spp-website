import { useEventsControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Event } from "@/types/event";

interface UseEventsProps {
    page: number;
    pageSize: number;
    // Accepted for API compatibility with callers; the backend doesn't
    // support searching /events yet, so this is currently a no-op.
    search?: string;
}

export const useEvents = ({ page, pageSize }: UseEventsProps) => {
    const { data, isPending, error } = useEventsControllerFindAll({
        queryParams: { page, limit: pageSize },
    });

    return {
        events: (data?.data as Event[] | undefined) ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch events") : null,
    };
};
