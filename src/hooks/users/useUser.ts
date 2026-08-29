import { skipToken } from "@tanstack/react-query";
import { useUsersControllerFindOneByUsername } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";
import { User } from "@/types/user";

export const useUser = (username: string | undefined) => {
    const { data, isPending, error } = useUsersControllerFindOneByUsername(
        username ? { pathParams: { username } } : skipToken
    );
    // The backend actually returns { data: User }, but the generated type
    // only reflects a bare User since @Serialize doesn't declare the
    // response envelope in its Swagger annotation.
    const envelope = data as unknown as { data: User } | undefined;

    return {
        user: envelope?.data ?? null,
        loading: !!username && isPending,
        error: error ? getErrorMessage(error, "Failed to fetch user") : null,
    };
};
