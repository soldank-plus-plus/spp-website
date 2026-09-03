import { skipToken } from "@tanstack/react-query";
import { useClansControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";

interface UseClanProps {
    clanId: number;
    clanname: string;
}

// The backend has no /clans/:id endpoint, so a clan is looked up by name and
// then matched on id, which keeps shared links working for duplicate names
export const useClan = ({ clanId, clanname }: UseClanProps) => {
    const { data, isPending, error } = useClansControllerFindAll(
        clanname
            ? {
                  queryParams: {
                      limit: 100,
                      search: clanname,
                      searchBy: ["clanname"],
                  },
              }
            : skipToken
    );

    const clan = data?.data.find((entry) => entry.id === clanId) ?? null;

    return {
        clan,
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch clan") : null,
    };
};
