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
import { TableSkeleton } from "@/components/ui/custom/shared/TableSkeleton/TableSkeleton";
import { useNavigate } from "react-router-dom";
import { Stat } from "@/types/stat";
import { formatFullDate, formatRecordTime } from "@/utils/format";

const ROW_BG: Record<number, string> = {
    1: "bg-gold/30",
    2: "bg-silver/30",
    3: "bg-bronze/30",
};

const RecordRow: React.FC<{ record: Stat }> = ({ record }) => {
    const navigate = useNavigate();
    const rowBg = ROW_BG[record.position ?? 0] ?? "bg-rowdark";

    return (
        <TableRow
            className={`${rowBg} hover:bg-accenthover transition-colors duration-200 border-0`}
        >
            <TableCell className="px-0.5 py-2 text-center font-bold text-secondary w-[48px]">
                {record.position}
            </TableCell>
            <TableCell className="px-0.5 py-2 text-secondary">
                <span
                    className="font-medium truncate cursor-pointer hover:text-foreground hover:underline"
                    onClick={() =>
                        navigate(
                            `/profile/${encodeURIComponent(record.username ?? "")}`
                        )
                    }
                >
                    {record.username}
                </span>
            </TableCell>
            <TableCell className="px-1 py-2 text-center text-secondary font-mono">
                {record.recordTime !== null
                    ? formatRecordTime(record.recordTime)
                    : "—"}
            </TableCell>
            <TableCell className="px-1 py-2 text-center text-secondary">
                {record.recordDate !== null
                    ? formatFullDate(record.recordDate)
                    : "—"}
            </TableCell>
        </TableRow>
    );
};

interface Props {
    records: Stat[];
    totalPages: number;
    pageSize: number;
    loading: boolean;
    error: string | null;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const MapRecords: React.FC<Props> = ({
    records,
    totalPages,
    pageSize,
    loading,
    error,
    currentPage,
    onPageChange,
}) => {
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
                    {loading && <TableSkeleton rows={pageSize} columns={4} />}
                    {error && (
                        <TableRow>
                            <td
                                className="text-center py-4 text-red-500"
                                colSpan={4}
                            >
                                {error}
                            </td>
                        </TableRow>
                    )}
                    {!loading &&
                        records
                            .filter((r) => (r.position ?? 0) > 3)
                            .map((record) => (
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
