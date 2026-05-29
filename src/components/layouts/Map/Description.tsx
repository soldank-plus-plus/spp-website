import React, { useEffect, useState } from "react";
import JSZip from "jszip";
import { Button } from "@/components/ui/shadcn/button";
import { parseMap, PmsMap } from "./Chlldren/Mapviewer/map";

function escapeUrl(s: string): string {
    return s.replace(/#/g, "%23");
}

interface Props {
    mapname: string;
    category?: string;
}

export const Description: React.FC<Props> = ({ mapname, category = "climb" }) => {
    const [mapInfo, setMapInfo] = useState<PmsMap | null>(null);
    const [edgeslist, setEdgeslist] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!mapname) return;
        setLoading(true);
        setLoadError(false);

        Promise.all([
            fetch(`/mapviewer/data/${category}/maps/${escapeUrl(mapname)}.pms`)
                .then((r) => { if (!r.ok) throw new Error("not found"); return r.arrayBuffer(); }),
            fetch("/mapviewer/data/filelist").then((r) => r.text()),
        ])
            .then(([buffer, filelistText]) => {
                const map = parseMap(buffer);
                map.id = `${category}_${mapname}`;
                setMapInfo(map);

                const list = filelistText.split(/\r?\n/).filter((l) => l !== "");
                const edges = list
                    .filter((p) => /\/edges\//.test(p))
                    .map((p) => p.split("/")[3] ?? "");
                setEdgeslist(edges);
            })
            .catch(() => setLoadError(true))
            .finally(() => setLoading(false));
    }, [mapname, category]);

    const handleDownload = async () => {
        if (!mapInfo) return;

        const zip = new JSZip();
        const urls: string[] = [];

        for (let i = 0; i < mapInfo.images.length; i++) {
            if (mapInfo.scenery_counts[i] !== 0) urls.push(`scenery-gfx/${mapInfo.images[i]}`);
        }
        for (const edge of edgeslist) {
            if (mapInfo.texture.slice(0, -4).toLowerCase() === edge.slice(0, -4).toLowerCase())
                urls.push(`textures/edges/${edge}`);
        }
        urls.push(`maps/${mapname}.pms`, `textures/${mapInfo.texture}`);

        await Promise.all(
            urls.map(async (url) => {
                try {
                    const res = await fetch(`/mapviewer/data/${category}/${escapeUrl(url)}`);
                    if (res.ok) zip.file(url, await res.arrayBuffer());
                    else window.alert(`Warning: ${url} not found`);
                } catch {
                    window.alert(`Warning: ${url} could not be fetched`);
                }
            }),
        );

        const blob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${mapname} (${mapInfo.name}).zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const texturePath = mapInfo ? `/mapviewer/data/${category}/textures/${mapInfo.texture}` : "";

    if (loading) return <div className="text-secondary text-sm">Loading...</div>;
    if (loadError || !mapInfo) return null;

    return (
        <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex gap-3 mb-3">
                <Button onClick={handleDownload}>
                    Download map
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => window.open(`/mapviewer?map=${category}/${mapname}`, "_blank")}
                >
                    Mapviewer
                </Button>
            </div>

            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">Description:</span>
                <span className="text-secondary">{mapInfo.name}</span>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">Gamemode:</span>
                <span className="text-secondary">{displayCategory}</span>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">Texture:</span>
                <a href={texturePath} target="_blank" rel="noreferrer" className="underline hover:underline">
                    {mapInfo.texture}
                </a>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">Polygons:</span>
                <span className="text-secondary">
                    {mapInfo.polygons.length + mapInfo.bgpolygons.length}{" "}
                    <span className="text-xs">({mapInfo.bgpolygons.length} background)</span>
                </span>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">Spawnpoints:</span>
                <span className="text-secondary">{mapInfo.spawnpoints.length}</span>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">Jet amount:</span>
                <span className="text-secondary">{mapInfo.jet_amount}</span>
            </div>
        </div>
    );
};
