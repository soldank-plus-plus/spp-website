import { useMapsControllerFindOne } from "@/api/generated/sppComponents";

export const useMap = (mapId: number) => {
    const { data, isPending } = useMapsControllerFindOne({
        pathParams: { id: mapId },
    });

    return { map: data ?? null, loading: isPending };
};
