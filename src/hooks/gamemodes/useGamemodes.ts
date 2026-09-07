import { useGamemodesControllerFindAll } from "@/api/generated/sppComponents";
import { getErrorMessage } from "@/api/generated/sppErrors";

export const useGamemodes = () => {
    const { data, isPending, error } = useGamemodesControllerFindAll({});

    return {
        gamemodes: data?.data ?? [],
        loading: isPending,
        error: error
            ? getErrorMessage(error, "Failed to fetch gamemodes")
            : null,
    };
};
