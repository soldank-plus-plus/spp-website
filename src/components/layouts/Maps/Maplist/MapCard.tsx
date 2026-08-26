import React from "react";
import { useNavigate } from "react-router-dom";
import { Map } from "@/types/map";

export type SortMode = "hardest" | "latest";

interface Props {
    map: Map;
    sortMode: SortMode;
}

const MapCard: React.FC<Props> = ({ map, sortMode }) => {
    const navigate = useNavigate();

    return (
        <div className="rounded-sm border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5 flex items-center gap-4 overflow-hidden">
            <div className="w-[120px] aspect-square shrink-0 rounded-l-sm overflow-hidden">
                <img
                    src={`/mapviewer/screenshots/climb_${map.mapname}.png`}
                    alt={map.mapname}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="px-4 py-5">
                <h3
                    className="text-lg cursor-pointer hover:underline"
                    onClick={() => navigate(`/maps/${map.id}?name=${encodeURIComponent(map.mapname)}`)}
                >
                    #{sortMode === "hardest" ? map.hardest : map.id} – {map.mapname}
                </h3>
                <p className="text-white/70 text-sm mb-1">
                    created by{" "}
                    {map.creators.length > 0
                        ? map.creators.map((creator, i) => (
                              <React.Fragment key={creator.id}>
                                  {i > 0 && ", "}
                                  <span
                                      className="cursor-pointer hover:text-foreground hover:underline"
                                      onClick={() => navigate(`/profile/${creator.username}`)}
                                  >
                                      {creator.username}
                                  </span>
                              </React.Fragment>
                          ))
                        : "unknown"}
                </p>
                <p className="text-white/70 text-sm">{map.recordsCount} records</p>
            </div>
        </div>
    );
};

export default MapCard;
