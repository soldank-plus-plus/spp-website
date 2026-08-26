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
import { UserRow } from "@/components/ui/custom/shared/Ranking/UserRow/UserRow";
import { useUsers, SortKey } from "@/hooks/users/useUsers";
import { getFlagByName } from "@/utils/countryFlags";
import { ChevronLeft } from "lucide-react";

interface Props {
    countryId: number;
    countryName: string;
    onBack: () => void;
}

export const CountryUsers: React.FC<Props> = ({
    countryId,
    countryName,
    onBack,
}) => {
    const pageSize = 20;

    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortKey>("unique_caps");
    const [searchTerm, setSearchTerm] = useState("");

    const { users, totalPages, loading, error } = useUsers({
        page: currentPage,
        pageSize,
        search: searchTerm,
        sort: sortBy,
        countryId,
    });

    const flag = getFlagByName(countryName);

    return (
        <div className="overflow-x-auto px-4 max-w-[900px] mx-auto">
            <div className="flex items-center gap-3 mb-2 mt-1">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-sm text-secondary hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Countries
                </button>
                <span className="text-secondary/40">/</span>
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    {flag && <span aria-hidden="true">{flag}</span>}
                    {countryName}
                </span>
            </div>

            {/* Search and sort */}
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-x-4">
                <SearchUser
                    searchTerm={searchTerm}
                    setSearchTerm={(value) => {
                        setSearchTerm(value);
                        setCurrentPage(1);
                    }}
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
                            Player
                        </TableHead>
                        <TableHead className="px-1 py-2 text-left text-blue-200 font-semibold w-[40px]">
                            Passed
                        </TableHead>
                        <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[40px]">
                            Records
                        </TableHead>
                        <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[40px]">
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

                    {!loading && !error && users.length === 0 && (
                        <TableRow>
                            <td
                                className="text-center py-4 text-secondary"
                                colSpan={8}
                            >
                                No players found.
                            </td>
                        </TableRow>
                    )}

                    {!loading &&
                        users.map((user, index) => (
                            <UserRow
                                key={user.id}
                                player={user}
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
