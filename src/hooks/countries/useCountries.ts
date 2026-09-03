import { useCountriesControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { useDebounce } from "@/hooks/core/useDebounce";

export type CountrySortKey = "unique_caps" | "hardest" | "gold";

// Maps the UI's sort vocabulary to the actual sortable columns on the
// backend (nestjs-paginate's sortBy=field:DESC convention).
const SORT_BY: Record<
    CountrySortKey,
    "uniqueCaps:DESC" | "hardest:DESC" | "gold:DESC"
> = {
    unique_caps: "uniqueCaps:DESC",
    hardest: "hardest:DESC",
    gold: "gold:DESC",
};

interface UseCountriesProps {
    page: number;
    pageSize: number;
    search?: string;
    sort?: CountrySortKey;
}

export const useCountries = ({
    page,
    pageSize,
    search = "",
    sort = "unique_caps",
}: UseCountriesProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useCountriesControllerFindAll({
        queryParams: {
            page,
            limit: pageSize,
            sortBy: [SORT_BY[sort]],
            ...(debouncedSearch && { search: debouncedSearch }),
        },
    });

    return {
        countries: data?.data ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error
            ? getErrorMessage(error, "Failed to fetch countries")
            : null,
    };
};
