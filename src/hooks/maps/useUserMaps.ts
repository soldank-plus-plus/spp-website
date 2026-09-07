import { useMapsControllerFindByUser } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseUserMapsProps {
    userId: number;
    page: number;
    pageSize: number;
    search?: string;
}

export const useUserMaps = ({
    userId,
    page,
    pageSize,
    search = "",
}: UseUserMapsProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useMapsControllerFindByUser({
        pathParams: { userId },
        queryParams: {
            page,
            limit: pageSize,
            sortBy: ["id:DESC"],
            ...(debouncedSearch && { search: debouncedSearch }),
        },
    });

    return {
        maps: data?.data ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch maps") : null,
    };
};
