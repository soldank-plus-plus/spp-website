import { keepPreviousData } from "@tanstack/react-query";
import { useClansControllerFindRecordsHistory } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";

interface UseClanRecordsHistoryProps {
    clanId: number;
    userIds: number[];
}

export const useClanRecordsHistory = ({
    clanId,
    userIds,
}: UseClanRecordsHistoryProps) => {
    const { data, isPending, error } = useClansControllerFindRecordsHistory(
        {
            pathParams: { clanId },
            queryParams: { userIds: userIds.join(",") },
        },
        // Toggling a player changes the query key, so the previous series is
        // kept on screen instead of the chart dropping out for a refetch
        {
            enabled: userIds.length > 0,
            placeholderData: keepPreviousData,
        }
    );

    return {
        points: data?.data ?? [],
        loading: isPending,
        error: error
            ? getErrorMessage(error, "Failed to fetch clan records history")
            : null,
    };
};
