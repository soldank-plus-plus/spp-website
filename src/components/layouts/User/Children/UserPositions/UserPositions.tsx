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
import { SearchMap } from "@/components/ui/custom/shared/Ranking/SearchMap/SearchMap";
import { TableSkeleton } from "@/components/ui/custom/shared/TableSkeleton/TableSkeleton";
import { useUserPositions } from "@/hooks/positions/useUserPositions";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Position } from "@/types/position";
import goldIcon from "@/assets/icons/medal-gold.png";
import silverIcon from "@/assets/icons/medal-silver.png";
import bronzeIcon from "@/assets/icons/medal-bronze.png";

function ordinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

function formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    const time = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    const day = ordinal(d.getDate());
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    return `${time} on ${day} ${month} ${year}`;
}

const MEDAL_ICON: Record<number, string> = {
    1: goldIcon,
    2: silverIcon,
    3: bronzeIcon,
};

const POSITION_STYLE: Record<number, { icon: React.ReactNode; row: string }> = {
    1: {
        icon: <ArrowUp className="mx-auto text-green-400" size={16} />,
        row: "bg-green-900/20",
    },
    2: {
        icon: <ArrowUp className="mx-auto text-green-400" size={16} />,
        row: "bg-rowdark",
    },
    3: {
        icon: <ArrowDown className="mx-auto text-red-400" size={16} />,
        row: "bg-red-900/20",
    },
};

interface PositionRowProps {
    position: Position;
}

const PositionRow: React.FC<PositionRowProps> = ({ position }) => {
    const navigate = useNavigate();
    const style = POSITION_STYLE[position.type] ?? {
        icon: null,
        row: "bg-rowdark",
    };
    const medalIcon =
        position.medal !== null ? MEDAL_ICON[position.medal] : undefined;

    return (
        <TableRow
            className={`${style.row} hover:bg-accenthover transition-colors duration-200 border-0`}
        >
            <TableCell className="px-0.5 py-2 text-center w-[48px]">
                {style.icon}
            </TableCell>

            <TableCell className="px-1 py-2 text-secondary w-[160px]">
                <span
                    className="cursor-pointer hover:text-foreground hover:underline"
                    onClick={() =>
                        navigate(
                            `/maps/${position.mapId}?name=${encodeURIComponent(position.mapname ?? "")}`
                        )
                    }
                >
                    {position.mapname}
                </span>
            </TableCell>

            <TableCell className="px-1 py-2 text-center w-[100px]">
                {medalIcon && (
                    <img src={medalIcon} alt="" className="h-5 w-5 mx-auto" />
                )}
            </TableCell>

            <TableCell className="px-1 py-2 text-center text-secondary w-[230px]">
                {position.positionDate !== null
                    ? formatDate(position.positionDate)
                    : "—"}
            </TableCell>
        </TableRow>
    );
};

interface Props {
    userId: number;
}

export const UserPositionsTable: React.FC<Props> = ({ userId }) => {
    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [mapSearch, setMapSearch] = useState("");

    const { positions, totalPages, loading, error } = useUserPositions({
        userId,
        page: currentPage,
        pageSize,
        search: mapSearch,
    });

    return (
        <div className="overflow-x-auto px-4 max-w-[1100px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-x-4">
                <SearchMap
                    searchTerm={mapSearch}
                    setSearchTerm={(val) => {
                        setMapSearch(val);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[48px]" />
                        <TableHead className="px-1 py-2 text-left text-blue-200 font-semibold w-[160px]">
                            Map
                        </TableHead>
                        <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[100px]">
                            Medal
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
                        positions.map((position) => (
                            <PositionRow
                                key={position.id}
                                position={position}
                            />
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
