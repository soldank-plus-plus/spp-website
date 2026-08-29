import { useUsersControllerFindStats } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Stat } from "@/types/stat";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseUserRecordsProps {
    userId: number;
    page: number;
    pageSize: number;
    search?: string;
}

export const useUserRecords = ({
    userId,
    page,
    pageSize,
    search = "",
}: UseUserRecordsProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useUsersControllerFindStats({
        pathParams: { userId },
        queryParams: {
            page,
            limit: pageSize,
            ...(debouncedSearch && { search: debouncedSearch }),
        },
    });

    return {
        records: (data?.data as Stat[] | undefined) ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch records") : null,
    };
};
