import React from "react";
import { useMapData, escapeUrl } from "@/hooks/maps/useMapData";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface Props {
    mapname: string;
    category?: string;
}

export const Specs: React.FC<Props> = ({ mapname, category = "climb" }) => {
    const { mapInfo, loading, loadError } = useMapData(mapname, category);

    if (loading)
        return (
            <div className="flex flex-col gap-2">
                {[80, 64, 96, 72, 56, 60].map((w, i) => (
                    <div key={i} className="flex gap-1.5 items-center">
                        <Skeleton className="h-3.5 w-16 shrink-0" />
                        <Skeleton className="h-3.5" style={{ width: w }} />
                    </div>
                ))}
            </div>
        );
    if (loadError || !mapInfo) return null;

    const displayCategory =
        category.charAt(0).toUpperCase() + category.slice(1);
    const texturePath = `/mapviewer/data/${category}/textures/${escapeUrl(mapInfo.texture)}`;

    return (
        <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">
                    Description:
                </span>
                <span className="text-secondary">{mapInfo.name}</span>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">Gamemode:</span>
                <span className="text-secondary">{displayCategory}</span>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">Texture:</span>
                <a
                    href={texturePath}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:underline"
                >
                    {mapInfo.texture}
                </a>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">Polygons:</span>
                <span className="text-secondary">
                    {mapInfo.polygons.length + mapInfo.bgpolygons.length}{" "}
                    <span className="text-xs">
                        ({mapInfo.bgpolygons.length} background)
                    </span>
                </span>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">
                    Spawnpoints:
                </span>
                <span className="text-secondary">
                    {mapInfo.spawnpoints.length}
                </span>
            </div>
            <div className="flex gap-1.5">
                <span className="font-semibold text-foreground">
                    Jet amount:
                </span>
                <span className="text-secondary">{mapInfo.jet_amount}</span>
            </div>
        </div>
    );
};
