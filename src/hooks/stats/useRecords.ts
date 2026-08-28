import { useStatsControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseRecordsProps {
    page: number;
    pageSize: number;
    search?: string;
}

export const useRecords = ({
    page,
    pageSize,
    search = "",
}: UseRecordsProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useStatsControllerFindAll({
        queryParams: {
            page,
            limit: pageSize,
            ...(debouncedSearch && { search: debouncedSearch }),
        },
    });

    return {
        records: data?.data ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch records") : null,
    };
};
