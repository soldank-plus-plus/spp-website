import { useUsersControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";

export const useMapCreators = (pageSize = 20) => {
    const { data, isPending, error } = useUsersControllerFindAll({
        queryParams: {
            page: 1,
            limit: pageSize,
            sortBy: ["mapsCreated:DESC"],
        },
    });

    return {
        users: data?.data ?? [],
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch users") : null,
    };
};
