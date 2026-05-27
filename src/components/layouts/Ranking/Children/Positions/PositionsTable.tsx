import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/shadcn/table";
import { CustomPagination } from "@/components/ui/custom/shared/Ranking/Pagination/Pagination";
import { SearchUser } from "@/components/ui/custom/shared/Ranking/SearchUser/SearchUser";
import { SearchMap } from "@/components/ui/custom/shared/Ranking/SearchMap/SearchMap";
import { useEvents } from "@/hooks/events/useEvents";
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
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
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
    1: { icon: <ArrowUp className="mx-auto text-green-400" size={16} />,  row: "bg-green-900/20" },
    2: { icon: <ArrowUp className="mx-auto text-green-400" size={16} />,  row: "bg-rowdark"      },
    3: { icon: <ArrowDown className="mx-auto text-red-400"  size={16} />, row: "bg-red-900/20"   },
};

interface EventRowProps {
    event: Event;
}

const EventRow: React.FC<EventRowProps> = ({ event }) => {
    const navigate = useNavigate();
    const style = EVENT_STYLE[event.type] ?? { icon: null, row: "bg-rowdark" };
    const medalIcon = MEDAL_ICON[event.medal];

    return (
        <TableRow className={`${style.row} hover:bg-accenthover transition-colors duration-200 border-0`}>
            <TableCell className="px-0.5 py-2 text-center w-[48px]">
                {style.icon}
            </TableCell>

            <TableCell className="px-0.5 py-2 text-secondary">
                <span
                    className="font-medium truncate cursor-pointer hover:text-foreground hover:underline"
                    onClick={() => navigate(`/account/${event.username}`)}
                >
                    {event.username}
                </span>
            </TableCell>

            <TableCell className="px-1 py-2 text-secondary">
                {event.mapname}
            </TableCell>

            <TableCell className="px-1 py-2 text-center">
                {medalIcon && <img src={medalIcon} alt="" className="h-5 w-5 mx-auto" />}
            </TableCell>

            <TableCell className="px-1 py-2 text-center text-secondary">
                {formatDate(event.event_date)}
            </TableCell>
        </TableRow>
    );
};

export const PositionsTable: React.FC = () => {
    const pageSize = 30;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [mapSearch, setMapSearch] = useState("");

    const { events, totalPages, loading, error } = useEvents({
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
                        <TableHead className="w-[48px]" />
                        <TableHead className="px-0.5 py-2 text-left text-blue-200 font-semibold w-[150px]">
                            Player
                        </TableHead>
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
    );
};
