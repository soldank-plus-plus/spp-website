import { useUsersControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { useDebounce } from "@/hooks/core/useDebounce";

export type SortKey = "unique_caps" | "hardest" | "gold" | "maps_created";

// Maps the UI's sort vocabulary to the actual sortable columns on the
// backend (nestjs-paginate's sortBy=field:DESC convention).
const SORT_BY: Record<
    SortKey,
    "uniqueCaps:DESC" | "hardest:DESC" | "gold:DESC" | "mapsCreated:DESC"
> = {
    unique_caps: "uniqueCaps:DESC",
    hardest: "hardest:DESC",
    gold: "gold:DESC",
    maps_created: "mapsCreated:DESC",
};

interface UseUsersProps {
    page: number;
    pageSize: number;
    search?: string;
    sort?: SortKey;
    // Accepted for API compatibility with callers; the backend doesn't
    // support filtering by country yet (no countries table), so this is
    // currently a no-op.
    countryId?: number;
}

export const useUsers = ({
    page,
    pageSize,
    search = "",
    sort = "unique_caps",
}: UseUsersProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useUsersControllerFindAll({
        queryParams: {
            page,
            limit: pageSize,
            sortBy: [SORT_BY[sort]],
            ...(debouncedSearch && { search: debouncedSearch }),
        },
    });

    return {
        users: data?.data ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch users") : null,
    };
};
