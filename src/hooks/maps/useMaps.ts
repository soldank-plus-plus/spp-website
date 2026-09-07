import { useMapsControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { useDebounce } from "@/hooks/core/useDebounce";
import { MapFlag } from "@/hooks/maps/useMapFlags";

export type MapSortKey = "hardest" | "latest";

// The hardest map is rank 1, and maps added recently have no date on record,
// so the newest ones are the highest map numbers rather than the latest dates
const SORT_BY: Record<MapSortKey, "hardest:ASC" | "id:DESC"> = {
    hardest: "hardest:ASC",
    latest: "id:DESC",
};

interface UseMapsProps {
    page: number;
    pageSize: number;
    search?: string;
    creator?: string;
    sort?: MapSortKey;
    flags?: MapFlag[];
}

export const useMaps = ({
    page,
    pageSize,
    search = "",
    creator = "",
    sort = "hardest",
    flags = [],
}: UseMapsProps) => {
    const debouncedSearch = useDebounce(search, 500);
    const debouncedCreator = useDebounce(creator, 500);

    const { data, isPending, error } = useMapsControllerFindAll({
        queryParams: {
            page,
            limit: pageSize,
            sortBy: [SORT_BY[sort]],
            // The hardest view is the ranked maps only, everything else sits at 0
            ...(sort === "hardest" && { "filter.hardest": ["$gt:0"] }),
            ...Object.fromEntries(
                flags.map((flag) => [`filter.${flag}`, ["$eq:1"]])
            ),
            ...(debouncedSearch && { search: debouncedSearch }),
            ...(debouncedCreator && { creator: debouncedCreator }),
        },
    });

    return {
        maps: data?.data ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch maps") : null,
    };
};
