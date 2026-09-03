import { usePositionsControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Position } from "@/types/position";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UsePositionsProps {
    page: number;
    pageSize: number;
    search?: string;
    mapSearch?: string;
}

export const usePositions = ({
    page,
    pageSize,
    search = "",
    mapSearch = "",
}: UsePositionsProps) => {
    const debouncedSearch = useDebounce(search, 500);
    const debouncedMapSearch = useDebounce(mapSearch, 500);

    // /positions accepts one search term and has no mapId filter, so a player
    // search wins and the map name is applied to the fetched page below
    const searchParams = debouncedSearch
        ? { search: debouncedSearch, searchBy: ["user.username"] }
        : debouncedMapSearch
          ? { search: debouncedMapSearch, searchBy: ["map.mapname"] }
          : {};

    const { data, isPending, error } = usePositionsControllerFindAll({
        queryParams: {
            page,
            limit: pageSize,
            sortBy: ["positionDate:DESC"],
            ...searchParams,
        },
    });

    const positions = (data?.data as Position[] | undefined) ?? [];
    const narrowed =
        debouncedSearch && debouncedMapSearch
            ? positions.filter((position) =>
                  (position.mapname ?? "")
                      .toLowerCase()
                      .includes(debouncedMapSearch.toLowerCase())
              )
            : positions;

    return {
        positions: narrowed,
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error
            ? getErrorMessage(error, "Failed to fetch positions")
            : null,
    };
};
