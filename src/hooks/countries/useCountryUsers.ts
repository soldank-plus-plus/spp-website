import { useCountriesControllerFindUsers } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { useDebounce } from "@/hooks/core/useDebounce";
import { SortKey, SORT_BY } from "@/hooks/users/useUsers";

interface UseCountryUsersProps {
    countryId: number;
    page: number;
    pageSize: number;
    search?: string;
    sort?: SortKey;
}

export const useCountryUsers = ({
    countryId,
    page,
    pageSize,
    search = "",
    sort = "unique_caps",
}: UseCountryUsersProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useCountriesControllerFindUsers({
        pathParams: { countryId },
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
