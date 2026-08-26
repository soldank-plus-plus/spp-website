import { useState, useEffect } from "react";
import {
    parseMap,
    PmsMap,
} from "@/components/layouts/Map/Chlldren/Mapviewer/map";

export function escapeUrl(s: string): string {
    return s.replace(/#/g, "%23");
}

export const useMapData = (mapname: string, category: string) => {
    const [mapInfo, setMapInfo] = useState<PmsMap | null>(null);
    const [edgeslist, setEdgeslist] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!mapname) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setLoadError(false);

        Promise.all([
            fetch(
                `/mapviewer/data/${category}/maps/${escapeUrl(mapname)}.pms`
            ).then((r) => {
                if (!r.ok) throw new Error("not found");
                return r.arrayBuffer();
            }),
            fetch("/mapviewer/data/filelist").then((r) => r.text()),
        ])
            .then(([buffer, filelistText]) => {
                const map = parseMap(buffer);
                map.id = `${category}_${mapname}`;
                setMapInfo(map);
                const list = filelistText
                    .split(/\r?\n/)
                    .filter((l) => l !== "");
                const edges = list
                    .filter((p) => /\/edges\//.test(p))
                    .map((p) => p.split("/")[3] ?? "");
                setEdgeslist(edges);
            })
            .catch(() => setLoadError(true))
            .finally(() => setLoading(false));
    }, [mapname, category]);

    return { mapInfo, edgeslist, loading, loadError };
};
