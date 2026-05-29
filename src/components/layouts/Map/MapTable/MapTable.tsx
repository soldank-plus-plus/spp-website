import React, { useState } from "react";
import { useMapRecords } from "@/hooks/stats/useMapRecords";
import { MapRecords } from "./MapRecords";
import { MapPositions } from "./MapPositions";

interface Props {
    mapId: number;
}

export const MapTable: React.FC<Props> = ({ mapId }) => {
    const [tab, setTab] = useState<"records" | "positions">("records");
    const [currentPage, setCurrentPage] = useState(1);

    const { records, totalPages, loading, error } = useMapRecords({ mapId, page: currentPage, pageSize: 30 });

    return (
        <div className="max-w-[1100px] mx-auto px-4">
            <div className="flex justify-center">
                <div>
                    <div className="flex gap-2 mb-6">
                        {(["records", "positions"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setCurrentPage(1); }}
                                className={`rounded px-3 py-1 text-sm font-semibold ${
                                    tab === t ? "bg-accent text-white" : "bg-sombre text-secondary"
                                }`}
                            >
                                {t === "records" ? "Records" : "Positions"}{tab === t ? " ▼" : ""}
                            </button>
                        ))}
                    </div>

                    {tab === "records" && (
                        <MapRecords
                            records={records}
                            totalPages={totalPages}
                            loading={loading}
                            error={error}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}

                    {tab === "positions" && <MapPositions mapId={mapId} />}
                </div>
            </div>
        </div>
    );
};
