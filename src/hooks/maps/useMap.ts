import { useMapsControllerFindOne } from "@/api/generated/sppComponents";
import { Map } from "@/types/map";

export const useMap = (mapId: number) => {
    const { data, isPending } = useMapsControllerFindOne({
        pathParams: { id: mapId },
    });
    // The backend actually returns { data: Map }, but the generated type
    // only reflects a bare Map since @Serialize doesn't declare the
    // response envelope in its Swagger annotation.
    const envelope = data as unknown as { data: Map } | undefined;

    return { map: envelope?.data ?? null, loading: isPending };
};
