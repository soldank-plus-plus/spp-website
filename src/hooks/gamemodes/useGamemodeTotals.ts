import { skipToken } from "@tanstack/react-query";
import {
    useMapsControllerFindAll,
    useStatsControllerFindAll,
    useUsersControllerFindAll,
} from "@/api/generated/sppComponents";

// Totals come from the paginated endpoints, which report them in their meta
export const useGamemodeTotals = (available: boolean) => {
    const request = available ? { queryParams: { limit: 1 } } : skipToken;

    const users = useUsersControllerFindAll(request);
    const records = useStatsControllerFindAll(request);
    const maps = useMapsControllerFindAll(request);

    return {
        players: users.data?.meta.totalItems ?? null,
        records: records.data?.meta.totalItems ?? null,
        maps: maps.data?.meta.totalItems ?? null,
        loading:
            available &&
            (users.isPending || records.isPending || maps.isPending),
    };
};
