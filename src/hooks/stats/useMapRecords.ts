import { useMapsControllerFindStats } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Stat } from "@/types/stat";

interface UseMapRecordsProps {
    mapId: number;
    page: number;
    pageSize: number;
}

export const useMapRecords = ({
    mapId,
    page,
    pageSize,
}: UseMapRecordsProps) => {
    const { data, isPending, error } = useMapsControllerFindStats({
        pathParams: { mapId },
        queryParams: { page, limit: pageSize },
    });

    return {
        records: (data?.data as Stat[] | undefined) ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch records") : null,
    };
};
