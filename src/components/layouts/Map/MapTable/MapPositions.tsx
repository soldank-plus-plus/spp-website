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
import { useMapEvents } from "@/hooks/events/useMapEvents";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Event } from "@/types/event";
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

const EVENT_STYLE: Record<number, { icon: React.ReactNode; row: string }> = {
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

const EventRow: React.FC<{ event: Event }> = ({ event }) => {
    const navigate = useNavigate();
    const style = EVENT_STYLE[event.type] ?? { icon: null, row: "bg-rowdark" };
    const medalIcon =
        event.medal !== null ? MEDAL_ICON[event.medal] : undefined;

    return (
        <TableRow
            className={`${style.row} hover:bg-accenthover transition-colors duration-200 border-0`}
        >
            <TableCell className="px-0.5 py-2 text-center w-[48px]">
                {style.icon}
            </TableCell>
            <TableCell className="px-0.5 py-2 text-secondary">
                <span
                    className="font-medium truncate cursor-pointer hover:text-foreground hover:underline"
                    onClick={() => navigate(`/profile/${event.username}`)}
                >
                    {event.username}
                </span>
            </TableCell>
            <TableCell className="px-1 py-2 text-center w-[80px]">
                {medalIcon && (
                    <img src={medalIcon} alt="" className="h-5 w-5 mx-auto" />
                )}
            </TableCell>
            <TableCell className="px-1 py-2 text-center text-secondary w-[230px]">
                {event.eventDate !== null ? formatDate(event.eventDate) : "—"}
            </TableCell>
        </TableRow>
    );
};

interface Props {
    mapId: number;
}

export const MapPositions: React.FC<Props> = ({ mapId }) => {
    const pageSize = 30;
    const [currentPage, setCurrentPage] = useState(1);

    const { events, totalPages, loading, error } = useMapEvents({
        mapId,
        page: currentPage,
        pageSize,
    });

    return (
        <div className="flex justify-center">
            <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[48px]" />
                            <TableHead className="px-0.5 py-2 text-left text-blue-200 font-semibold w-[150px]">
                                Player
                            </TableHead>
                            <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[80px]">
                                Medal
                            </TableHead>
                            <TableHead className="px-1 py-2 text-center text-blue-200 font-semibold w-[230px]">
                                Date
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading && (
                            <TableRow>
                                <td className="text-center py-4" colSpan={4}>
                                    Loading...
                                </td>
                            </TableRow>
                        )}
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
                            events.map((event) => (
                                <EventRow key={event.id} event={event} />
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
        </div>
    );
};
