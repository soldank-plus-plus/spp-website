import React, { useState, useMemo } from "react";
import { CustomPagination } from "@/components/ui/custom/shared/Ranking/Pagination/Pagination";
import { useMaps } from "@/hooks/maps/useMaps";
import { useNavigate } from "react-router-dom";
import { Map } from "@/types/map";
import { Input } from "@/components/ui/shadcn/input";
import { Search } from "lucide-react";

type SortMode = "hardest" | "latest";

interface MapCardProps {
    map: Map;
    sortMode: SortMode;
}

const MapCard: React.FC<MapCardProps> = ({ map, sortMode }) => {
    const navigate = useNavigate();

    return (
        <div className="rounded-sm border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5 px-6 py-5">
            <h3
                className="text-foreground font-bold text-lg leading-tight mb-1 cursor-pointer hover:text-accent hover:underline"
                onClick={() => navigate(`/maps/${map.id}?name=${encodeURIComponent(map.mapname)}`)}
            >
                #{sortMode === "hardest" ? map.hardest : map.id} – {map.mapname}
            </h3>
            <p className="text-secondary text-sm mb-1">
                created by{" "}
                <span
                    className="text-secondary cursor-pointer hover:text-foreground hover:underline"
                    onClick={() => navigate(`/profile/${map.user_id}`)}
                >
                    {map.user_id}
                </span>
            </p>
            <p className="text-secondary text-sm">
                {map.records_count} records
            </p>
        </div>
    );
};

export const Maplist: React.FC = () => {
    const pageSize = 50;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchMap, setSearchMap] = useState("");
    const [searchPlayer, setSearchPlayer] = useState("");
    const [sortMode, setSortMode] = useState<SortMode>("hardest");

    const { maps, totalPages, loading, error } = useMaps({ page: currentPage, pageSize });

    const filtered = useMemo(() => {
        const q = searchMap.toLowerCase();
        const p = searchPlayer.toLowerCase();
        const base = maps.filter((m) => {
            const matchMap = q ? m.mapname.toLowerCase().includes(q) : true;
            const matchPlayer = p ? m.user_id.toLowerCase().includes(p) : true;
            return matchMap && matchPlayer;
        });
        return [...base].sort((a, b) =>
            sortMode === "hardest" ? a.hardest - b.hardest : b.date - a.date
        );
    }, [maps, searchMap, searchPlayer, sortMode]);

    return (
        <div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative w-[170px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search map..."
                        value={searchMap}
                        onChange={(e) => { setSearchMap(e.target.value); setCurrentPage(1); }}
                        className="pl-10 w-full"
                    />
                </div>

                <div className="relative w-[170px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search author..."
                        value={searchPlayer}
                        onChange={(e) => { setSearchPlayer(e.target.value); setCurrentPage(1); }}
                        className="pl-10 w-full"
                    />
                </div>

                <div className="flex gap-2">
                    {(["hardest", "latest"] as SortMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setSortMode(mode)}
                            className={`rounded px-3 py-1 text-sm font-semibold whitespace-nowrap ${
                                sortMode === mode
                                    ? "bg-accent text-white"
                                    : "bg-sombre text-secondary"
                            }`}
                        >
                            {mode === "hardest" ? "Hardest" : "Latest"}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <p className="text-secondary text-sm text-center py-8">Loading...</p>
            )}

            {error && (
                <p className="text-red-500 text-sm text-center py-8">{error}</p>
            )}

            {!loading && (
                <div className="flex flex-col gap-6">
                    {filtered.map((map) => (
                        <MapCard key={map.id} map={map} sortMode={sortMode} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-6 mb-8 flex justify-center">
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};
