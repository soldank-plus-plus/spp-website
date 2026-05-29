import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/shadcn/table";
import { CustomPagination } from "@/components/ui/custom/core/Pagination";
import { SearchUser } from "@/components/ui/custom/shared/Ranking/SearchUser/SearchUser";
import { SearchMap } from "@/components/ui/custom/shared/Ranking/SearchMap/SearchMap";
import { useRecords } from "@/hooks/stats/useRecords";
import { useNavigate } from "react-router-dom";
import { Stat } from "@/types/stat";

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

const ROW_BG: Record<number, string> = {
    1: "bg-gold/30",
    2: "bg-silver/30",
    3: "bg-bronze/30",
};

interface RecordRowProps {
    record: Stat;
}

const RecordRow: React.FC<RecordRowProps> = ({ record }) => {
    const navigate = useNavigate();
    const rowBg = ROW_BG[record.position] ?? "bg-rowdark";

    return (
        <TableRow className={`${rowBg} hover:bg-accenthover transition-colors duration-200 border-0`}>
            <TableCell className="px-0.5 py-2 text-center font-bold text-secondary w-[48px]">
                {record.position}
            </TableCell>

            <TableCell className="px-0.5 py-2 text-secondary">
                <span
                    className="font-medium truncate cursor-pointer hover:text-foreground hover:underline"
                    onClick={() => navigate(`/profile/${record.username}`)}
                >
                    {record.username}
                </span>
            </TableCell>

            <TableCell className="px-1 py-2 text-secondary">
                <span
                    className="cursor-pointer hover:text-foreground hover:underline"
                    onClick={() => navigate(`/maps/${record.map_id}?name=${encodeURIComponent(record.mapname)}`)}
                >
                    {record.mapname}
                </span>
            </TableCell>

            <TableCell className="px-1 py-2 text-center text-secondary font-mono">
                {formatTime(record.record_time)}
            </TableCell>

            <TableCell className="px-1 py-2 text-center text-secondary">
                {formatDate(record.record_date)}
            </TableCell>
        </TableRow>
    );
};

export const RecordsTable: React.FC = () => {
    const pageSize = 30;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [mapSearch, setMapSearch] = useState("");

    const { records, totalPages, loading, error } = useRecords({
        page: currentPage,
        pageSize,
        search: searchTerm,
    });

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    return (
        <div className="overflow-x-auto px-4 max-w-[1100px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-x-4">
                <SearchUser searchTerm={searchTerm} setSearchTerm={handleSearch} />
                <SearchMap searchTerm={mapSearch} setSearchTerm={(val) => { setMapSearch(val); setCurrentPage(1); }} />
            </div>

            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-0.5 py-2 text-center text-blue-200 font-semibold w-[48px]">
                            #
                        </TableHead>
                        <TableHead className="px-0.5 py-2 text-left text-blue-200 font-semibold w-[150px]">
                            Player
                        </TableHead>
                        <TableHead className="px-1 py-2 text-left text-blue-200 font-semibold w-[160px]">
                            Map
                        </TableHead>
                        <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[110px]">
                            Time
                        </TableHead>
                        <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[230px]">
                            Date
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading && (
                        <TableRow>
                            <td className="text-center py-4" colSpan={5}>
                                Loading...
                            </td>
                        </TableRow>
                    )}

                    {error && (
                        <TableRow>
                            <td className="text-center py-4 text-red-500" colSpan={5}>
                                {error}
                            </td>
                        </TableRow>
                    )}

                    {!loading &&
                        records.map((record) => (
                            <RecordRow key={record.id} record={record} />
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
