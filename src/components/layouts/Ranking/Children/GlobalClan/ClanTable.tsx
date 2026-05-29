import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
} from "@/components/ui/shadcn/table";
import { CustomPagination } from "@/components/ui/custom/core/Pagination";
import { SortButtons } from "@/components/ui/custom/shared/Ranking/SortButtons/SortButtons";
import { SearchUser } from "@/components/ui/custom/shared/Ranking/SearchUser/SearchUser";
import { ClanRow } from "@/components/ui/custom/shared/Ranking/ClanRow/ClanRow";
import { useClans, ClanSortKey } from "@/hooks/clans/useClans";

export const ClanTable: React.FC = () => {
    const pageSize = 20;

    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<ClanSortKey>("unique_caps");
    const [searchTerm, setSearchTerm] = useState("");

    const { clans, totalPages, loading, error } = useClans({
        page: currentPage,
        pageSize,
        search: searchTerm,
        sort: sortBy,
    });

    return (
        <div className="overflow-x-auto px-4 max-w-[900px] mx-auto">
            {/* Search and sort */}
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-x-4">
                <SearchUser
                    searchTerm={searchTerm}
                    setSearchTerm={(value) => {
                        setSearchTerm(value);
                        setCurrentPage(1);
                    }}
                    placeholder="Search clan..."
                />
                <SortButtons
                    sortBy={sortBy}
                    onSortChange={(key) => {
                        setSortBy(key);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Table */}
            <Table className="min-w-[600px] border-separate border-spacing-y-1">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-0.5 py-2 text-left text-blue-200 font-semibold w-[40px]">
                            #
                        </TableHead>
                        <TableHead className="px-0.5 py-2 text-left text-blue-200 font-semibold">
                            Clan
                        </TableHead>
                        <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[60px]">
                            Players
                        </TableHead>
                        <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[60px]">
                            Records
                        </TableHead>
                        <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[60px]">
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
                    {loading && (
                        <TableRow>
                            <td className="text-center py-4" colSpan={8}>
                                Loading...
                            </td>
                        </TableRow>
                    )}

                    {error && (
                        <TableRow>
                            <td
                                className="text-center py-4 text-red-500"
                                colSpan={8}
                            >
                                {error}
                            </td>
                        </TableRow>
                    )}

                    {!loading &&
                        clans.map((clan, index) => (
                            <ClanRow
                                key={clan.id}
                                clan={clan}
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
