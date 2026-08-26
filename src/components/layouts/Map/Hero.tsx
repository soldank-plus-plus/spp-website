import React from "react";
import JSZip from "jszip";
import { useNavigate } from "react-router-dom";
import { useMap } from "@/hooks/maps/useMap";
import { useMapData, escapeUrl } from "@/hooks/maps/useMapData";
import { Button } from "@/components/ui/shadcn/button";

interface Props {
    mapId: number;
    mapname: string;
    category?: string;
}

export const Hero: React.FC<Props> = ({
    mapId,
    mapname,
    category = "climb",
}) => {
    const navigate = useNavigate();
    const { map } = useMap(mapId);
    const { mapInfo, edgeslist } = useMapData(mapname, category);
    const creators = map?.creators ?? [];
    const screenshotUrl = `/mapviewer/screenshots/${category}_${mapname}.png`;

    const handleDownload = async () => {
        if (!mapInfo) return;

        const zip = new JSZip();
        const urls: string[] = [];

        for (let i = 0; i < mapInfo.images.length; i++) {
            if (mapInfo.scenery_counts[i] !== 0)
                urls.push(`scenery-gfx/${mapInfo.images[i]}`);
        }
        for (const edge of edgeslist) {
            if (
                mapInfo.texture.slice(0, -4).toLowerCase() ===
                edge.slice(0, -4).toLowerCase()
            )
                urls.push(`textures/edges/${edge}`);
        }
        urls.push(`maps/${mapname}.pms`, `textures/${mapInfo.texture}`);

        await Promise.all(
            urls.map(async (url) => {
                try {
                    const res = await fetch(
                        `/mapviewer/data/${category}/${escapeUrl(url)}`
                    );
                    if (res.ok) zip.file(url, await res.arrayBuffer());
                    else window.alert(`Warning: ${url} not found`);
                } catch {
                    window.alert(`Warning: ${url} could not be fetched`);
                }
            })
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

    return (
        <div
            className="relative w-full h-[390px] flex items-end bg-background mb-3"
            style={{
                backgroundImage: `url(${screenshotUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90" />
            <div className="relative z-10 w-full text-center px-4">
                <h1>{mapname}</h1>
                {creators.length > 0 && (
                    <p className="mt-1">
                        Created by{" "}
                        {creators.map((creator, i) => (
                            <React.Fragment key={creator.id}>
                                {i > 0 && ", "}
                                <span
                                    className="cursor-pointer hover:text-heading underline underline-offset-2"
                                    onClick={() =>
                                        navigate(`/profile/${creator.username}`)
                                    }
                                >
                                    {creator.username}
                                </span>
                            </React.Fragment>
                        ))}
                    </p>
                )}
                <div className="flex justify-center gap-3 mt-5">
                    <Button
                        variant="outline"
                        className="w-auto"
                        disabled={!mapInfo}
                        onClick={handleDownload}
                    >
                        Download
                    </Button>
                    <Button
                        variant="outline"
                        className="w-auto"
                        onClick={() =>
                            window.open(
                                `/mapviewer?map=${category}/${mapname}`,
                                "_blank"
                            )
                        }
                    >
                        Mapviewer
                    </Button>
                </div>
            </div>
        </div>
    );
};
