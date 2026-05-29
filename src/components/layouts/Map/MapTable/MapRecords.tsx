import React from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/shadcn/table";
import { CustomPagination } from "@/components/ui/custom/core/Pagination";
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

const RecordRow: React.FC<{ record: Stat }> = ({ record }) => {
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
            <TableCell className="px-1 py-2 text-center text-secondary font-mono">
                {formatTime(record.record_time)}
            </TableCell>
            <TableCell className="px-1 py-2 text-center text-secondary">
                {formatDate(record.record_date)}
            </TableCell>
        </TableRow>
    );
};

interface Props {
    records: Stat[];
    totalPages: number;
    loading: boolean;
    error: string | null;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const MapRecords: React.FC<Props> = ({ records, totalPages, loading, error, currentPage, onPageChange }) => {
    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-0.5 py-2 text-center text-blue-200 font-semibold w-[48px]">
                            #
                        </TableHead>
                        <TableHead className="px-0.5 py-2 text-left text-blue-200 font-semibold w-[150px]">
                            Player
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
                            <td className="text-center py-4" colSpan={4}>Loading...</td>
                        </TableRow>
                    )}
                    {error && (
                        <TableRow>
                            <td className="text-center py-4 text-red-500" colSpan={4}>{error}</td>
                        </TableRow>
                    )}
                    {!loading && records.filter((r) => r.position > 3).map((record) => (
                        <RecordRow key={record.id} record={record} />
                    ))}
                </TableBody>
            </Table>

            <div className="mt-8 mb-20 flex justify-center">
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};
