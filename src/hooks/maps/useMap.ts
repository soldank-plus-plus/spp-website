import { useState, useEffect } from "react";
import { Map } from "@/types/map";
import { mapsApi } from "@/api/maps";

export const useMap = (mapId: number) => {
    const [map, setMap] = useState<Map | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        mapsApi
            .getMapById(mapId)
            .then((res) => {
                setMap(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [mapId]);

    return { map, loading };
};
