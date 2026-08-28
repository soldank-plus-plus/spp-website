import { useMapsControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseMapsProps {
    page: number;
    pageSize: number;
    search?: string;
}

export const useMaps = ({ page, pageSize, search = "" }: UseMapsProps) => {
    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending, error } = useMapsControllerFindAll({
        queryParams: {
            page,
            limit: pageSize,
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
