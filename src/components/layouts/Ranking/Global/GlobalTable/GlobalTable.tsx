import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import {
    usersData,
    User,
} from "@/components/layouts/Ranking/Global/GlobalTable/usersData";
import { useNavigate } from "react-router-dom";
import { CustomPagination } from "@/components/layouts/Ranking/Pagination";

export const GlobalTable: React.FC = () => {
    const [sortBy, setSortBy] = useState<keyof User>("records");
    const [players, setPlayers] = useState<User[]>(usersData);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const pageSize = 20;
    const navigate = useNavigate();

    // Debounce effect for searching optimization
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 300); // 300ms opóźnienia
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const handleSort = (field: keyof User) => {
        setSortBy(field);
        const sorted = [...players].sort((a, b) => b[field] - a[field]);
        setPlayers(sorted);
        setCurrentPage(1);
    };

    // Then filter after debouncing
    const filteredPlayers = players.filter((player) =>
        player.username.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPlayers.length / pageSize);
    const paginatedPlayers = filteredPlayers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="overflow-x-auto px-4 max-w-[900px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-x-4">
                <div className="relative min-w-[160px] max-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search player..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {(["records", "hardest", "gold"] as const).map((key) => (
                        <button
                            key={key}
                            onClick={() => handleSort(key)}
                            className={`rounded px-3 py-1 text-sm font-semibold whitespace-nowrap ${
                                sortBy === key
                                    ? "bg-accent text-white"
                                    : "bg-sombre text-secondary"
                            }`}
                        >
                            {key === "records"
                                ? "Records"
                                : key === "hardest"
                                  ? "Hardest"
                                  : "Golds"}{" "}
                            {sortBy === key ? "▼" : ""}
                        </button>
                    ))}
                </div>
            </div>

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
                    {paginatedPlayers.map((player, index) => (
                        <TableRow
                            key={player.rank}
                            className={`${
                                index % 2 === 0 ? "bg-rowdark" : "bg-rowlight"
                            } hover:bg-accenthover transition-colors duration-200`}
                        >
                            <TableCell className="text-center px-0.5 py-2 font-bold text-secondary">
                                {(currentPage - 1) * pageSize + index + 1}
                            </TableCell>
                            <TableCell className="px-0.5 py-2 text-secondary">
                                <div className="flex items-center gap-1">
                                    <img
                                        src={player.avatar}
                                        alt="avatar"
                                        className="w-5 h-5 rounded-full border"
                                    />
                                    <ReactCountryFlag
                                        countryCode={player.country}
                                        svg
                                        style={{ width: "1em", height: "1em" }}
                                    />
                                    <span
                                        className="font-medium truncate text-secondary cursor-pointer hover:text-foreground hover:underline"
                                        onClick={() =>
                                            navigate(
                                                `/account/${player.username}`
                                            )
                                        }
                                    >
                                        {player.username}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center px-0.5 py-2 text-secondary">
                                {player.passed}%
                            </TableCell>
                            <TableCell
                                className={`text-center px-0.5 py-2 ${
                                    sortBy === "records"
                                        ? "text-foreground"
                                        : "text-secondary"
                                }`}
                            >
                                {player.records}
                            </TableCell>
                            <TableCell
                                className={`text-center px-0.5 py-2 ${
                                    sortBy === "hardest"
                                        ? "text-foreground"
                                        : "text-secondary"
                                }`}
                            >
                                {player.hardest}
                            </TableCell>
                            <TableCell
                                className={`text-center px-0.5 py-2 ${
                                    sortBy === "gold"
                                        ? "text-foreground"
                                        : "text-secondary"
                                }`}
                            >
                                {player.gold}
                            </TableCell>
                            <TableCell className="text-center px-0.5 py-2 text-secondary">
                                {player.silver}
                            </TableCell>
                            <TableCell className="text-center px-0.5 py-2 text-secondary">
                                {player.bronze}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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
