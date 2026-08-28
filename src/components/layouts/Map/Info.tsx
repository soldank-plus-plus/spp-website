import React from "react";
import { useNavigate } from "react-router-dom";
import { useMapRecords } from "@/hooks/stats/useMapRecords";
import { Preview } from "@/components/layouts/Map/Preview";
import { Specs } from "@/components/layouts/Map/Specs";
import goldIcon from "@/assets/icons/medal-gold.png";
import silverIcon from "@/assets/icons/medal-silver.png";
import bronzeIcon from "@/assets/icons/medal-bronze.png";

const MEDAL_ICONS = [goldIcon, silverIcon, bronzeIcon];
const MEDAL_LABELS = ["Gold", "Silver", "Bronze"];

function formatTime(ms: number): string {
    const totalCs = Math.floor(ms / 10);
    const cs = totalCs % 100;
    const totalSec = Math.floor(totalCs / 100);
    const sec = totalSec % 60;
    const min = Math.floor(totalSec / 60);
    return `${min}:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

interface Props {
    mapId: number;
    mapname: string;
    category?: string;
}

export const Info: React.FC<Props> = ({
    mapId,
    mapname,
    category = "climb",
}) => {
    const navigate = useNavigate();
    const { records } = useMapRecords({ mapId, page: 1, pageSize: 3 });
    const top3 = records.slice(0, 3);

    const cardClass =
        "rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5";

    return (
        <div className="w-full py-10">
            <div className="px-4 max-w-[1100px] mx-auto">
                <div className="flex flex-col sm:flex-row gap-6 items-stretch">
                    <div className="flex flex-col gap-6 sm:w-[300px] shrink-0">
                        <div className={`${cardClass} p-6`}>
                            <span className="font-tomorrow text-xs uppercase tracking-widest text-blue-200 mb-4 block">
                                Top Records
                            </span>
                            <div className="flex flex-col gap-3">
                                {top3.map((record, i) => (
                                    <div
                                        key={record.id}
                                        className="flex items-center gap-3"
                                    >
                                        <img
                                            src={MEDAL_ICONS[i]}
                                            className="w-7 h-7 shrink-0"
                                            alt={MEDAL_LABELS[i]}
                                        />
                                        <div className="flex flex-col">
                                            <span
                                                className="font-semibold text-sm cursor-pointer hover:text-foreground hover:underline text-heading"
                                                onClick={() =>
                                                    navigate(
                                                        `/profile/${record.username}`
                                                    )
                                                }
                                            >
                                                {record.username}
                                            </span>
                                            <span className="text-xs text-secondary font-mono">
                                                {record.recordTime !== null
                                                    ? formatTime(
                                                          record.recordTime
                                                      )
                                                    : "—"}{" "}
                                                ·{" "}
                                                {record.recordDate !== null
                                                    ? formatDate(
                                                          record.recordDate
                                                      )
                                                    : "—"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {top3.length === 0 && (
                                    <p className="text-sm">No records yet</p>
                                )}
                            </div>
                        </div>

                        <div className={`${cardClass} p-6`}>
                            <span className="font-tomorrow text-xs uppercase tracking-widest text-blue-200 mb-4 block">
                                Specification
                            </span>
                            <Specs mapname={mapname} category={category} />
                        </div>
                    </div>

                    <div className="flex-1 relative rounded-xl overflow-hidden border border-white/10 min-h-[200px]">
                        <Preview
                            mapname={mapname}
                            category={category}
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
