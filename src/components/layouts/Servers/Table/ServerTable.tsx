import { Server } from "@/components/layouts/Servers/Table/serverTypes";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableFooter,
} from "@/components/ui/table";
import React, { useState } from "react";

type Props = {
    servers: Server[];
    filteredSortedServers: {
        gamemode: string;
        players: string;
        map: string;
        server: string;
        latency: string | number;
    }[];
    totalPlayers: number;
};

// Ordering for expanded content
const displayOrder = [
    { key: "info", label: "Server info" },
    { key: "os", label: "Operating system" },
    { key: "advanced", label: "Advanced" },
    { key: "ip", label: "IP" },
    { key: "version", label: "Version" },
    { key: "realistic", label: "Realistic" },
    { key: "port", label: "Port" },
    { key: "private", label: "Private" },
    { key: "survival", label: "Survival" },
    { key: "max_players", label: "Max players" },
    { key: "wm", label: "Weapon mod" },
    { key: "respawn", label: "Respawn" },
    { key: "num_bots", label: "Number of bots" },
    { key: "anti_cheat_on", label: "Anti-Cheat" },
    { key: "bonus_frequency", label: "Bonus frequency" },
];

const ServersTable = ({
    servers,
    filteredSortedServers,
    totalPlayers,
}: Props) => {
    const [expandedServerIndex, setExpandedServerIndex] = useState<
        number | null
    >(null);

    const toggleExpand = (idx: number) => {
        setExpandedServerIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto mb-20 px-4">
                <div className="overflow-x-auto rounded-lg shadow-md border border-border">
                    <Table className="min-w-[700px]">
                        <TableHeader>
                            <TableRow className="bg-sombre rounded-t-lg">
                                <TableHead className="px-4 py-3 text-left text-blue-200 text-lg font-semibold">
                                    Gamemode
                                </TableHead>
                                <TableHead className="px-4 py-3 text-left text-blue-200 text-lg font-semibold">
                                    Players
                                </TableHead>
                                <TableHead className="px-4 py-3 text-left text-blue-200 text-lg font-semibold">
                                    Map
                                </TableHead>
                                <TableHead className="px-4 py-3 text-left text-blue-200 text-lg font-semibold">
                                    Server
                                </TableHead>
                                <TableHead className="px-4 py-3 text-right text-blue-200 text-lg font-semibold">
                                    Latency
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredSortedServers.map((server, idx) => {
                                const fullServer = servers.find(
                                    (s) => s.name === server.server
                                );
                                const isExpanded = expandedServerIndex === idx;

                                return (
                                    <React.Fragment
                                        key={`${server.server}-${idx}`}
                                    >
                                        <TableRow
                                            onClick={() => toggleExpand(idx)}
                                            className={`cursor-pointer transition-colors duration-200 ${
                                                idx % 2 === 0
                                                    ? "bg-nocturne"
                                                    : "bg-sombre"
                                            } hover:bg-accenthover`}
                                        >
                                            <TableCell className="px-4 py-3 font-medium text-foreground">
                                                {server.gamemode}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-secondary">
                                                {server.players}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-secondary">
                                                {server.map}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-secondary">
                                                {server.server}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-right text-secondary">
                                                {server.latency}
                                            </TableCell>
                                        </TableRow>

                                        {isExpanded && fullServer && (
                                            <TableRow
                                                className={`${idx % 2 === 0 ? "bg-nocturne" : "bg-sombre"}`}
                                            >
                                                <TableCell
                                                    colSpan={5}
                                                    className="px-4 py-3 text-sm text-muted-foreground text-secondary"
                                                >
                                                    <div className="grid grid-cols-3 gap-x-8 gap-y-1 text-sm">
                                                        {displayOrder.map(
                                                            ({
                                                                key,
                                                                label,
                                                            }) => {
                                                                const value =
                                                                    fullServer[
                                                                        key as keyof Server
                                                                    ];
                                                                if (
                                                                    value ===
                                                                    undefined
                                                                )
                                                                    return null;

                                                                return (
                                                                    <div
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="whitespace-nowrap"
                                                                    >
                                                                        <span className="font-medium">
                                                                            {
                                                                                label
                                                                            }
                                                                            :
                                                                        </span>{" "}
                                                                        {value.toString()}
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>

                        <TableFooter>
                            <TableRow className="bg-sombre">
                                <TableCell
                                    colSpan={5}
                                    className="px-4 py-3 font-semibold text-foreground text-left"
                                >
                                    Total servers/players:{" "}
                                    {filteredSortedServers.length}/
                                    {totalPlayers}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ServersTable;
