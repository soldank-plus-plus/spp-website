import { useUsersControllerFindPositions } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Position } from "@/types/position";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseUserPositionsProps {
    userId: number;
    page: number;
    pageSize: number;
    search?: string;
}

export const useUserPositions = ({
    userId,
    page,
    pageSize,
    search = "",
}: UseUserPositionsProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useUsersControllerFindPositions({
        pathParams: { userId },
        queryParams: {
            page,
            limit: pageSize,
            ...(debouncedSearch && { search: debouncedSearch }),
        },
    });

    return {
        positions: (data?.data as Position[] | undefined) ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error
            ? getErrorMessage(error, "Failed to fetch positions")
            : null,
    };
};
