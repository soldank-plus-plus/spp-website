import { useUsersControllerFindEvents } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Event } from "@/types/event";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseUserEventsProps {
    userId: number;
    page: number;
    pageSize: number;
    search?: string;
}

export const useUserEvents = ({
    userId,
    page,
    pageSize,
    search = "",
}: UseUserEventsProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useUsersControllerFindEvents({
        pathParams: { userId },
        queryParams: {
            page,
            limit: pageSize,
            ...(debouncedSearch && { search: debouncedSearch }),
        },
    });

    return {
        events: (data?.data as Event[] | undefined) ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch events") : null,
    };
};
