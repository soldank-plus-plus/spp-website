import { skipToken } from "@tanstack/react-query";
import {
    useMapsControllerFindAll,
    useStatsControllerFindAll,
} from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseRecordsProps {
    page: number;
    pageSize: number;
    search?: string;
    mapSearch?: string;
}

const MAP_LOOKUP_LIMIT = 100;

export const useRecords = ({
    page,
    pageSize,
    search = "",
    mapSearch = "",
}: UseRecordsProps) => {
    const debouncedSearch = useDebounce(search, 500);
    const debouncedMapSearch = useDebounce(mapSearch, 500);

    // /stats takes a single search term, so the map name is resolved to ids
    // here and applied as filter.mapId; that keeps both searches combinable
    const { data: matchingMaps } = useMapsControllerFindAll(
        debouncedMapSearch
            ? {
                  queryParams: {
                      limit: MAP_LOOKUP_LIMIT,
                      search: debouncedMapSearch,
                      searchBy: ["mapname"],
                  },
              }
            : skipToken
    );

    const mapIds = matchingMaps?.data.map((map) => map.id) ?? [];
    const waitingForMaps =
        Boolean(debouncedMapSearch) && matchingMaps === undefined;

    const { data, isPending, error } = useStatsControllerFindAll(
        waitingForMaps
            ? skipToken
            : {
                  queryParams: {
                      page,
                      limit: pageSize,
                      sortBy: ["recordDate:DESC"],
                      ...(debouncedSearch && {
                          search: debouncedSearch,
                          searchBy: ["user.username"],
                      }),
                      ...(debouncedMapSearch && {
                          "filter.mapId": [`$in:${mapIds.join(",") || "0"}`],
                      }),
                  },
              }
    );

    return {
        records: data?.data ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch records") : null,
    };
};
