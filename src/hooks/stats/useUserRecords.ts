import { useUsersControllerFindStats } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Stat } from "@/types/stat";
import { Medal } from "@/types/position";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseUserRecordsProps {
    userId: number;
    page: number;
    pageSize: number;
    search?: string;
    medal?: Medal;
}

export const useUserRecords = ({
    userId,
    page,
    pageSize,
    search = "",
    medal,
}: UseUserRecordsProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useUsersControllerFindStats({
        pathParams: { userId },
        queryParams: {
            page,
            limit: pageSize,
            ...(medal && {
                "filter.position": [`$eq:${medal}`],
                sortBy: ["recordDate:DESC" as const],
            }),
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
