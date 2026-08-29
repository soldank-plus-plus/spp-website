import { skipToken } from "@tanstack/react-query";
import { useUsersControllerFindOneByUsername } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";

export const useUser = (username: string | undefined) => {
    const { data, isPending, error } = useUsersControllerFindOneByUsername(
        username ? { pathParams: { username } } : skipToken
    );

    return {
        user: data?.data ?? null,
        loading: !!username && isPending,
        error: error ? getErrorMessage(error, "Failed to fetch user") : null,
    };
};
