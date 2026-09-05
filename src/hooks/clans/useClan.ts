import { useClansControllerFindOne } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";

interface UseClanProps {
    clanId: number;
}

export const useClan = ({ clanId }: UseClanProps) => {
    const { data, isPending, error } = useClansControllerFindOne({
        pathParams: { clanId },
    });

    return {
        clan: data?.data ?? null,
        loading: isPending,
        error: error ? getErrorMessage(error, "Failed to fetch clan") : null,
    };
};
