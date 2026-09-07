import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/shadcn/input";
import { Search, X } from "lucide-react";
import { findGame } from "@/components/layouts/Gamemodes/List/listTypes";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState("");

    // A gamemode in the url narrows the list to that mode, so the gamemode
    // pages can link straight to the servers running them
    const gamemode = findGame(searchParams.get("gamemode") ?? undefined);

    const clearGamemode = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("gamemode");
        setSearchParams(params);
    };
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Server;
        direction: "asc" | "desc";
    }>({
        key: "gamemode",
        direction: "asc",
    });

    const scopedData = useMemo(() => {
        if (!gamemode) return data;
        const mode = gamemode.title.toLowerCase();
        return data.filter((item) =>
            item.gamemode.toLowerCase().includes(mode)
        );
    }, [data, gamemode]);

    const filteredData = useMemo(() => {
        if (!filter) return scopedData;
        const lowerFilter = filter.toLowerCase();
        return scopedData.filter(
            (item) =>
                item.server.toLowerCase().includes(lowerFilter) ||
                item.gamemode.toLowerCase().includes(lowerFilter) ||
                item.map.toLowerCase().includes(lowerFilter) ||
                item.players.toLowerCase().includes(lowerFilter)
        );
    }, [filter, scopedData]);

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
        const [current, max] = players.split("/").map(Number);
        if (current === undefined || max === undefined) return null;
        if (isNaN(current) || isNaN(max)) return null;

        return [current, max];
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

                {gamemode && (
                    <button
                        type="button"
                        onClick={clearGamemode}
                        className="flex items-center gap-1.5 rounded border border-white/20 px-2.5 py-1.5 text-sm text-secondary transition-colors hover:text-foreground"
                    >
                        {gamemode.title}
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}

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
