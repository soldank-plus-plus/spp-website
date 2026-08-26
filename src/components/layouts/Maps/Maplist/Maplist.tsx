import React, { useState, useMemo } from "react";
import { CustomPagination } from "@/components/ui/custom/core/Pagination";
import { useMaps } from "@/hooks/maps/useMaps";
import { Input } from "@/components/ui/shadcn/input";
import { Search } from "lucide-react";
import MapCard, { SortMode } from "@/components/layouts/Maps/Maplist/MapCard";

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
            const matchMap = q ? (m.mapname ?? "").toLowerCase().includes(q) : true;
            const matchPlayer = p
                ? m.creators.some((creator) => creator.username.toLowerCase().includes(p))
                : true;
            return matchMap && matchPlayer;
        });
        return [...base].sort((a, b) =>
            sortMode === "hardest" ? (a.hardest ?? 0) - (b.hardest ?? 0) : (b.date ?? 0) - (a.date ?? 0)
        );
    }, [maps, searchMap, searchPlayer, sortMode]);

    return (
        <div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative w-[155px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search map..."
                        value={searchMap}
                        onChange={(e) => { setSearchMap(e.target.value); setCurrentPage(1); }}
                        className="pl-10 w-full"
                    />
                </div>

                <div className="relative w-[180px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search mapper..."
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
                            {mode === "hardest" ? "Hardest" : "Latest"}{sortMode === mode ? " ▼" : ""}
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
