import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMapRecords } from "@/hooks/stats/useMapRecords";
import { useMap } from "@/hooks/maps/useMap";
import { Description } from "@/components/layouts/Map/Description";
import { Stat } from "@/types/stat";
import goldIcon from "@/assets/icons/medal-gold.png";
import silverIcon from "@/assets/icons/medal-silver.png";
import bronzeIcon from "@/assets/icons/medal-bronze.png";

const MEDAL_ICONS = [goldIcon, silverIcon, bronzeIcon];

function formatTime(ms: number): string {
    const totalCs = Math.floor(ms / 10);
    const cs = totalCs % 100;
    const totalSec = Math.floor(totalCs / 100);
    const sec = totalSec % 60;
    const min = Math.floor(totalSec / 60);
    return `${min}:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function ordinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

function formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
    const day = ordinal(d.getDate());
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    return `${time} on ${day} ${month} ${year}`;
}

interface Props {
    mapId: number;
    mapname: string;
}

export const Info: React.FC<Props> = ({ mapId, mapname }) => {
    const navigate = useNavigate();
    const { records } = useMapRecords({ mapId, page: 1, pageSize: 3 });
    const { map } = useMap(mapId);
    const creator = map?.user_id ?? "";

    const [top3, setTop3] = useState<Stat[]>([]);
    useEffect(() => {
        if (records.length > 0) setTop3(records.slice(0, 3));
    }, [records]);

    return (
        <div className="w-full mt-20 mb-20">
            <div className="flex flex-col sm:flex-row justify-center gap-16 max-w-[1100px] mx-auto px-12 py-12">
                <div className="flex flex-col gap-4 min-w-[180px] pr-12">
                    <h3 className="text-white font-bold">{mapname || "Map Records"}</h3>
                    {creator && (
                        <p className="text-secondary text-sm -mt-2">Created by{" "}
                            <span
                                className="cursor-pointer hover:text-foreground hover:underline"
                                onClick={() => navigate(`/profile/${creator}`)}
                            >{creator}</span>
                        </p>
                    )}
                    {top3.map((record, i) => (
                        <div key={record.id} className="flex items-center gap-3">
                            <img src={MEDAL_ICONS[i]} className="w-6 h-6 shrink-0" alt="" />
                            <div className="flex flex-col">
                                <span
                                    className="font-semibold text-sm cursor-pointer hover:text-foreground hover:underline text-secondary"
                                    onClick={() => navigate(`/profile/${record.username}`)}
                                >
                                    {record.username}
                                </span>
                                <span className="text-xs text-secondary font-mono">
                                    {formatTime(record.record_time)} · {formatDate(record.record_date)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-3">
                    <Description mapname={mapname} />
                </div>
            </div>
        </div>
    );
};
