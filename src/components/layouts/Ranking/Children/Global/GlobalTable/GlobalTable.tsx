import React from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
} from "@/components/ui/table";
import { usersData } from "./usersData";
import { CustomPagination } from "@/components/layouts/Ranking/Pagination";
import { usePlayerSearch } from "@/components/layouts/Ranking/Children/Global/GlobalTable/hooks/usePlayerSearch";
import { useSortPlayers } from "@/components/layouts/Ranking/Children/Global/GlobalTable/hooks/useSortPlayers";
import { usePagination } from "@/components/layouts/Ranking/Children/Global/GlobalTable/hooks/usePagination";
import { SortButtons } from "@/components/layouts/Ranking/Children/SharedComponents/SortButtons/SortButtons";
import { PlayerRow } from "@/components/layouts/Ranking/Children/Global/GlobalTable/PlayerRow";
import { SearchPlayer } from "@/components/layouts/Ranking/Children/Global/GlobalTable/SearchPlayer";

export const GlobalTable: React.FC = () => {
    const pageSize = 20;

    // Search
    const { searchTerm, setSearchTerm, filteredPlayers } =
        usePlayerSearch(usersData);

    // Sort
    const { sortBy, setSortBy, sortedPlayers } =
        useSortPlayers(filteredPlayers);

    // Pagination
    const { currentPage, setCurrentPage, totalPages, paginatedItems } =
        usePagination(sortedPlayers, pageSize);

    return (
        <div className="overflow-x-auto px-4 max-w-[900px] mx-auto">
            {/* Search and sort */}
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-x-4">
                <SearchPlayer
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={() => setCurrentPage(1)}
                />
                <SortButtons
                    sortBy={sortBy}
                    onSortChange={(key) => {
                        setSortBy(key);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Fetching */}
            <Table className="min-w-[600px] border-separate border-spacing-y-1">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-0.5 py-2 text-left text-blue-200 font-semibold w-[40px]">
                            #
                        </TableHead>
                        <TableHead className="px-0.5 py-2 text-left text-blue-200 font-semibold">
                            Player
                        </TableHead>
                        <TableHead className="px-1 py-2 text-left text-blue-200 font-semibold w-[40px]">
                            Passed
                        </TableHead>
                        <TableHead className="px-1 py-2 text-left text-blue-200 font-semibold w-[40px]">
                            Records
                        </TableHead>
                        <TableHead className="px-1 py-2 text-left text-blue-200 font-semibold w-[40px]">
                            Hardest
                        </TableHead>
                        <TableHead className="px-0.5 py-2 text-center text-blue-200 font-semibold w-[40px]">
                            G
                        </TableHead>
                        <TableHead className="px-0.5 py-2 text-center text-blue-200 font-semibold w-[40px]">
                            S
                        </TableHead>
                        <TableHead className="px-0.5 py-2 text-center text-blue-200 font-semibold w-[40px]">
                            B
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {paginatedItems.map((player, index) => (
                        <PlayerRow
                            key={player.rank}
                            player={player}
                            index={index}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            sortBy={sortBy}
                        />
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-8 mb-20 flex justify-center">
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};
