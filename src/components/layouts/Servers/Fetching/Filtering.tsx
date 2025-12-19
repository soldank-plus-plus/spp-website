import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface Server {
    gamemode: string;
    server: string;
    players: string;
    map: string;
    latency: string;
}

interface Stats {
    totalPlayers: number;
}

interface Props {
    data: Server[];
    onChange: (filteredSortedData: Server[]) => void;
    onStatsChange?: (stats: Stats) => void;
}

export const Filtering: React.FC<Props> = ({
    data,
    onChange,
    onStatsChange,
}) => {
    const [filter, setFilter] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Server;
        direction: "asc" | "desc";
    }>({
        key: "gamemode",
        direction: "asc",
    });

    const filteredData = useMemo(() => {
        if (!filter) return data;
        const lowerFilter = filter.toLowerCase();
        return data.filter(
            (item) =>
                item.server.toLowerCase().includes(lowerFilter) ||
                item.gamemode.toLowerCase().includes(lowerFilter) ||
                item.map.toLowerCase().includes(lowerFilter) ||
                item.players.toLowerCase().includes(lowerFilter)
        );
    }, [filter, data]);

    const filteredSortedData = useMemo(() => {
        const sorted = [...filteredData];
        sorted.sort((a, b) => {
            let aVal: string | number = a[sortConfig.key];
            let bVal: string | number = b[sortConfig.key];

            if (sortConfig.key === "latency") {
                aVal = parseInt(aVal.toString().replace("ms", ""), 10);
                bVal = parseInt(bVal.toString().replace("ms", ""), 10);
            }

            if (typeof aVal === "string" && typeof bVal === "string") {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredData, sortConfig]);

    const parsePlayers = (players: string): [number, number] | null => {
        const parts = players.split("/").map(Number);
        if (parts.length === 2 && parts.every((n) => !isNaN(n))) {
            return [parts[0], parts[1]];
        }
        return null;
    };

    useEffect(() => {
        onChange(filteredSortedData);

        if (onStatsChange) {
            const totalPlayers = filteredSortedData.reduce((sum, server) => {
                const parsed = parsePlayers(server.players);
                return sum + (parsed ? parsed[0] : 0);
            }, 0);

            onStatsChange({ totalPlayers });
        }
    }, [filteredSortedData, onChange, onStatsChange]);

    const sortingHandler = (key: keyof Server) => {
        setSortConfig((current) => {
            if (current.key === key) {
                return {
                    key,
                    direction: current.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    return (
        <div className="w-full flex justify-center mb-6">
            <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl w-full px-4">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search servers, gamemode, map..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-10"
                        aria-label="Filter servers"
                    />
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {(
                        [
                            "gamemode",
                            "players",
                            "map",
                            "server",
                            "latency",
                        ] as (keyof Server)[]
                    ).map((key) => (
                        <button
                            key={key}
                            onClick={() => sortingHandler(key)}
                            className={`rounded px-3 py-1 text-sm font-semibold whitespace-nowrap ${
                                sortConfig.key === key
                                    ? sortConfig.direction === "asc"
                                        ? "bg-accent text-white"
                                        : "bg-accenthover text-white"
                                    : "bg-sombre text-secondary"
                            }`}
                        >
                            {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                            {sortConfig.key === key
                                ? sortConfig.direction === "asc"
                                    ? "▲"
                                    : "▼"
                                : ""}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
