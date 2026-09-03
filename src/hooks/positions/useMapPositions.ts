import { useMapsControllerFindPositions } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { Position } from "@/types/position";

interface UseMapPositionsProps {
    mapId: number;
    page: number;
    pageSize: number;
}

export const useMapPositions = ({
    mapId,
    page,
    pageSize,
}: UseMapPositionsProps) => {
    const { data, isPending, error } = useMapsControllerFindPositions({
        pathParams: { mapId },
        queryParams: { page, limit: pageSize },
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
