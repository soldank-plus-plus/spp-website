import { useEventsControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Event } from "@/types/event";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseEventsProps {
    page: number;
    pageSize: number;
    search?: string;
    mapSearch?: string;
}

export const useEvents = ({
    page,
    pageSize,
    search = "",
    mapSearch = "",
}: UseEventsProps) => {
    const debouncedSearch = useDebounce(search, 500);
    const debouncedMapSearch = useDebounce(mapSearch, 500);

    // /events accepts one search term and has no mapId filter, so a player
    // search wins and the map name is applied to the fetched page below
    const searchParams = debouncedSearch
        ? { search: debouncedSearch, searchBy: ["user.username"] }
        : debouncedMapSearch
          ? { search: debouncedMapSearch, searchBy: ["map.mapname"] }
          : {};

    const { data, isPending, error } = useEventsControllerFindAll({
        queryParams: {
            page,
            limit: pageSize,
            sortBy: ["eventDate:DESC"],
            ...searchParams,
        },
    });

    const events = (data?.data as Event[] | undefined) ?? [];
    const narrowed =
        debouncedSearch && debouncedMapSearch
            ? events.filter((event) =>
                  (event.mapname ?? "")
                      .toLowerCase()
                      .includes(debouncedMapSearch.toLowerCase())
              )
            : events;

    return {
        events: narrowed,
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch events") : null,
    };
};
