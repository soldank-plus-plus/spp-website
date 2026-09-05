import {
    useClansControllerFindUsers,
    type ClansControllerFindUsersQueryParams,
} from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";

interface UseClanUsersProps {
    clanId: number;
    page?: number;
    pageSize?: number;
    sortBy?: ClansControllerFindUsersQueryParams["sortBy"];
}

export const useClanUsers = ({
    clanId,
    page = 1,
    pageSize = 100,
    sortBy,
}: UseClanUsersProps) => {
    const { data, isPending, error } = useClansControllerFindUsers({
        pathParams: { clanId },
        queryParams: { page, limit: pageSize, ...(sortBy && { sortBy }) },
    });

    return {
        users: data?.data ?? [],
        totalPages: error ? 0 : (data?.meta.totalPages ?? 1),
        loading: isPending,
        error: error
            ? getErrorMessage(error, "Failed to fetch clan members")
            : null,
    };
};
