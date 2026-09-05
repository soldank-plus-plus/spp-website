import React, { useState } from "react";
import MapCard from "@/components/layouts/Maps/Maplist/MapCard";
import { CustomPagination } from "@/components/ui/custom/core/Pagination";
import { SearchMap } from "@/components/ui/custom/shared/Ranking/SearchMap/SearchMap";
import { MapCardSkeleton } from "@/components/ui/custom/shared/MapCardSkeleton/MapCardSkeleton";
import { useUserMaps } from "@/hooks/maps/useUserMaps";

interface Props {
    userId: number;
}

export const UserMaplist: React.FC<Props> = ({ userId }) => {
    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [mapSearch, setMapSearch] = useState("");

    const { maps, totalPages, loading, error } = useUserMaps({
        userId,
        page: currentPage,
        pageSize,
        search: mapSearch,
    });

    return (
        <div className="overflow-x-auto px-4 max-w-[1100px] mx-auto mb-20">
            <div className="min-w-[800px]">
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-x-4">
                    <SearchMap
                        searchTerm={mapSearch}
                        setSearchTerm={(val) => {
                            setMapSearch(val);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="max-w-[564px]">
                    {loading && <MapCardSkeleton cards={4} />}

                    {error && (
                        <p className="text-red-500 text-sm text-center py-8">
                            {error}
                        </p>
                    )}

                    {!loading && !error && maps.length === 0 && (
                        <p className="text-secondary text-center py-8">
                            No maps found.
                        </p>
                    )}

                    {!loading && (
                        <div className="flex flex-col gap-6">
                            {maps.map((map) => (
                                <MapCard
                                    key={map.id}
                                    map={map}
                                    sortMode="hardest"
                                    showCreators={false}
                                />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
